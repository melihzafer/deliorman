const { test, expect } = require('@playwright/test');
const { mkdirSync, writeFileSync } = require('fs');
const { join } = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const thresholds = {
  lcp: [2500, 4000],
  inp: [200, 500],
  cls: [0.1, 0.25],
  fcp: [1800, 3000],
  ttfb: [800, 1800],
};

const outputDir = process.env.PERF_OUTPUT_DIR || 'performance-reports';

// Page configurations with specific interactions
const pageConfigs = [
  {
    name: 'Homepage',
    path: '/',
    interactions: [
      { type: 'click', selector: '.tst-menu-btn', name: 'Menu Toggle Open' },
      { type: 'wait', selector: 'nav.tst-active', timeout: 3000 },
      { type: 'click', selector: '.tst-menu-btn', name: 'Menu Toggle Close' },
      { type: 'click', selector: '.tst-res-btn', name: 'Reservation Popup Open' },
      { type: 'wait', selector: '.tst-popup-bg.tst-active', timeout: 3000 },
      { type: 'click', selector: '.tst-close-popup', name: 'Close Popup' },
      { type: 'scroll', amount: 800, name: 'Scroll to Specialties' },
      { type: 'click', selector: '.swiper-pagination-bullet', name: 'Swiper Pagination' },
    ],
  },
  {
    name: 'Menu',
    path: '/menu',
    interactions: [
      { type: 'click', selector: '.tst-menu-btn', name: 'Menu Toggle' },
      { type: 'wait', selector: 'nav.tst-active', timeout: 3000 },
      { type: 'click', selector: '.tst-menu-btn', name: 'Menu Toggle Close' },
      { type: 'scroll', amount: 500, name: 'Scroll Down' },
      { type: 'click', selector: '.tst-filter-link, [data-filter], .tst-btn', name: 'Filter/Button Click', optional: true },
    ],
  },
  {
    name: 'Gallery',
    path: '/gallery',
    interactions: [
      { type: 'click', selector: '.tst-menu-btn', name: 'Menu Toggle' },
      { type: 'wait', selector: 'nav.tst-active', timeout: 3000 },
      { type: 'click', selector: '.tst-menu-btn', name: 'Menu Toggle Close' },
      { type: 'scroll', amount: 600, name: 'Scroll to Gallery' },
      // Skip gallery item click - it opens fancybox lightbox and causes navigation issues
    ],
  },
  {
    name: 'Reservation',
    path: '/reservation',
    interactions: [
      { type: 'click', selector: '.tst-menu-btn', name: 'Menu Toggle' },
      { type: 'wait', selector: 'nav.tst-active', timeout: 3000 },
      { type: 'click', selector: '.tst-menu-btn', name: 'Menu Toggle Close' },
      { type: 'scroll', amount: 400, name: 'Scroll to Form' },
      // Skip form input click - can trigger focus/navigation issues
    ],
  },
  {
    name: 'Contact',
    path: '/contact',
    interactions: [
      { type: 'click', selector: '.tst-menu-btn', name: 'Menu Toggle' },
      { type: 'wait', selector: 'nav.tst-active', timeout: 3000 },
      { type: 'click', selector: '.tst-menu-btn', name: 'Menu Toggle Close' },
      { type: 'scroll', amount: 500, name: 'Scroll Down' },
    ],
  },
  {
    name: 'Lunch Menu',
    path: '/lunch-menu',
    interactions: [
      { type: 'click', selector: '.tst-menu-btn', name: 'Menu Toggle' },
      { type: 'wait', selector: 'nav.tst-active', timeout: 3000 },
      { type: 'click', selector: '.tst-menu-btn', name: 'Menu Toggle Close' },
      { type: 'scroll', amount: 600, name: 'Scroll Down' },
      { type: 'click', selector: '.tst-filter-link, [data-filter]', name: 'Filter Click', optional: true },
    ],
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const rateMetric = (value, [good, needsImprovement]) => {
  if (value <= good) return 'good';
  if (value <= needsImprovement) return 'needs-improvement';
  return 'poor';
};

const metricPassed = (value, [good]) => value <= good;

const injectWebVitals = async (page) => {
  await page.addScriptTag({
    url: 'https://unpkg.com/web-vitals@5/dist/web-vitals.iife.js',
  });

  await page.evaluate(() => {
    window.__webVitals = {
      lcp: null,
      cls: null,
      inp: null,
      fcp: null,
      ttfb: null,
    };

    if (!window.webVitals) {
      console.error('[Web Vitals] Library not loaded');
      return;
    }

    const mapEntries = (entries) =>
      (entries || []).map((entry) => ({
        name: entry.name,
        startTime: entry.startTime,
        duration: entry.duration,
        processingStart: entry.processingStart,
        processingEnd: entry.processingEnd,
      }));

    const updateMetric = (name, metric) => {
      window.__webVitals[name] = {
        value: metric.value,
        rating: metric.rating,
        entries: mapEntries(metric.entries),
      };
      console.log(`[Web Vitals] ${name.toUpperCase()}: ${metric.value}`);
    };

    window.webVitals.onLCP((metric) => updateMetric('lcp', metric), {
      reportAllChanges: true,
    });

    window.webVitals.onCLS((metric) => updateMetric('cls', metric), {
      reportAllChanges: true,
    });

    window.webVitals.onINP((metric) => updateMetric('inp', metric), {
      reportAllChanges: true,
    });

    window.webVitals.onFCP((metric) => updateMetric('fcp', metric), {
      reportAllChanges: true,
    });

    window.webVitals.onTTFB((metric) => updateMetric('ttfb', metric), {
      reportAllChanges: true,
    });
  });
};

const executeInteractions = async (page, interactions) => {
  const executedInteractions = [];

  for (const action of interactions) {
    try {
      console.log(`  → ${action.name || action.type}`);

      switch (action.type) {
        case 'click': {
          const element = page.locator(action.selector).first();
          const isVisible = await element.isVisible().catch(() => false);

          if (isVisible) {
            // Check if this might be a navigation link
            const tagName = await element.evaluate((el) => el.tagName.toLowerCase()).catch(() => 'unknown');
            const href = await element.getAttribute('href').catch(() => null);

            // If it's a link with a different href, skip to avoid navigation
            if (tagName === 'a' && href && !href.startsWith('#') && href !== '#' && href !== '#.') {
              console.log(`    ⚠ Skipped navigation link: ${href}`);
              executedInteractions.push({ ...action, success: false, skipped: true });
            } else {
              // Use force click with timeout to avoid getting stuck
              await element.click({ force: true, timeout: 5000 }).catch((err) => {
                if (action.optional) {
                  console.log(`    ⚠ Click failed (optional): ${err.message.split('\n')[0]}`);
                  executedInteractions.push({ ...action, success: false, skipped: true });
                  return;
                }
                throw err;
              });
              executedInteractions.push({ ...action, success: true });
            }
          } else if (action.optional) {
            console.log(`    ⚠ Skipped (not visible): ${action.selector}`);
            executedInteractions.push({ ...action, success: false, skipped: true });
          } else {
            throw new Error(`Element not visible: ${action.selector}`);
          }
          break;
        }

        case 'scroll': {
          await page.evaluate((amount) => {
            window.scrollBy({ top: amount, behavior: 'smooth' });
          }, action.amount);
          executedInteractions.push({ ...action, success: true });
          break;
        }

        case 'wait': {
          if (action.selector) {
            await page.waitForSelector(action.selector, {
              timeout: action.timeout || 5000,
              state: 'visible',
            });
          } else {
            await page.waitForTimeout(action.timeout || 500);
          }
          executedInteractions.push({ ...action, success: true });
          break;
        }

        default:
          console.log(`    ⚠ Unknown action type: ${action.type}`);
      }

      // Allow time for INP callback to fire
      await page.waitForTimeout(300);
    } catch (error) {
      console.log(`    ✗ Failed: ${error.message}`);
      executedInteractions.push({ ...action, success: false, error: error.message });

      if (!action.optional) {
        // Continue with other interactions even if one fails
        console.log('    Continuing with remaining interactions...');
      }
    }
  }

  return executedInteractions;
};

const measurePageVitals = async (page, baseURL, pageConfig) => {
  const url = `${baseURL}${pageConfig.path}`;
  console.log(`\n📍 Testing: ${pageConfig.name} (${url})`);

  // Navigate to page
  const navigationStart = Date.now();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // Wait for network to settle (with timeout to avoid hanging)
  await page.waitForLoadState('networkidle').catch(() => {
    console.log('  ⚠ Network idle timeout, continuing...');
  });

  const navigationTime = Date.now() - navigationStart;
  console.log(`✅ Page loaded in ${navigationTime}ms`);

  // Inject web-vitals library
  await injectWebVitals(page);

  // Wait for initial metrics (LCP, FCP, TTFB)
  await page.waitForTimeout(2000);

  // Execute page-specific interactions
  console.log(`\n🖱️  Executing interactions for ${pageConfig.name}:`);
  const executedInteractions = await executeInteractions(page, pageConfig.interactions);

  // Final wait for INP callbacks
  await page.waitForTimeout(1000);

  // Ensure we're still on the same page (some interactions may trigger navigation)
  const currentUrl = page.url();
  if (!currentUrl.includes(pageConfig.path) && pageConfig.path !== '/') {
    console.log(`  ⚠ Page navigated away, returning to: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => {});
    // Re-inject web vitals after navigation
    await injectWebVitals(page);
    await page.waitForTimeout(2000);
  }

  // Wait for metrics to be captured
  await page.waitForFunction(
    () => window.__webVitals?.lcp?.value != null,
    null,
    { timeout: 15000 }
  ).catch(() => console.log('    ⚠ LCP not captured'));

  await page.waitForFunction(
    () => window.__webVitals?.inp?.value != null,
    null,
    { timeout: 10000 }
  ).catch(() => console.log('    ⚠ INP not captured (may need more interactions)'));

  // Collect metrics (with fallback for undefined)
  const metrics = await page.evaluate(() => window.__webVitals || {
    lcp: null,
    cls: null,
    inp: null,
    fcp: null,
    ttfb: null,
  });

  // Build results
  const pageResults = {
    name: pageConfig.name,
    url: pageConfig.path,
    navigationTime,
    interactions: executedInteractions.map((i) => ({
      name: i.name,
      type: i.type,
      success: i.success,
      skipped: i.skipped || false,
    })),
    metrics: {
      lcp: {
        value: metrics.lcp?.value ?? null,
        rating: metrics.lcp?.value != null ? rateMetric(metrics.lcp.value, thresholds.lcp) : null,
        passed: metrics.lcp?.value != null ? metricPassed(metrics.lcp.value, thresholds.lcp) : false,
      },
      cls: {
        value: metrics.cls?.value ?? null,
        rating: metrics.cls?.value != null ? rateMetric(metrics.cls.value, thresholds.cls) : null,
        passed: metrics.cls?.value != null ? metricPassed(metrics.cls.value, thresholds.cls) : false,
      },
      inp: {
        value: metrics.inp?.value ?? null,
        rating: metrics.inp?.value != null ? rateMetric(metrics.inp.value, thresholds.inp) : null,
        passed: metrics.inp?.value != null ? metricPassed(metrics.inp.value, thresholds.inp) : false,
        entries: metrics.inp?.entries ?? [],
      },
      fcp: {
        value: metrics.fcp?.value ?? null,
        rating: metrics.fcp?.value != null ? rateMetric(metrics.fcp.value, thresholds.fcp) : null,
        passed: metrics.fcp?.value != null ? metricPassed(metrics.fcp.value, thresholds.fcp) : false,
      },
      ttfb: {
        value: metrics.ttfb?.value ?? null,
        rating: metrics.ttfb?.value != null ? rateMetric(metrics.ttfb.value, thresholds.ttfb) : null,
        passed: metrics.ttfb?.value != null ? metricPassed(metrics.ttfb.value, thresholds.ttfb) : false,
      },
    },
  };

  // Determine if page passed all metrics
  const metricsToCheck = ['lcp', 'cls', 'inp'];
  pageResults.passed = metricsToCheck.every(
    (m) => pageResults.metrics[m].value === null || pageResults.metrics[m].passed
  );

  // Log results
  console.log(`\n📊 Results for ${pageConfig.name}:`);
  Object.entries(pageResults.metrics).forEach(([name, data]) => {
    const symbol = data.passed ? '✅' : data.value === null ? '⚠️' : '❌';
    const unit = name === 'cls' ? '' : 'ms';
    const value = data.value !== null ? `${data.value}${unit}` : 'N/A';
    console.log(`   ${symbol} ${name.toUpperCase()}: ${value} (${data.rating || 'not measured'})`);
  });

  // Wait for page to fully stabilize before returning
  await page.waitForTimeout(500);
  await page.waitForLoadState('load').catch(() => {});

  return pageResults;
};

// ============================================================================
// TEST SUITE
// ============================================================================

test.describe('Full Website Performance Tests - Core Web Vitals', () => {
  test('measures vitals across all pages with real interactions', async ({ page }) => {
    const testInfo = test.info();
    const baseURL =
      testInfo.project.use.baseURL ||
      process.env.PERF_BASE_URL ||
      'http://localhost:3000';

    console.log('\n═══════════════════════════════════════════════════');
    console.log('     FULL WEBSITE PERFORMANCE TEST SUITE');
    console.log('═══════════════════════════════════════════════════');
    console.log(`📱 Device: iPhone 14 Pro Max (emulated)`);
    console.log(`🌐 Base URL: ${baseURL}`);
    console.log(`📄 Testing ${pageConfigs.length} pages\n`);

    const allResults = [];

    // Test each page
    for (const pageConfig of pageConfigs) {
      const pageResult = await measurePageVitals(page, baseURL, pageConfig);
      allResults.push(pageResult);
    }

    // Build consolidated report
    const failedPages = allResults.filter((p) => !p.passed).map((p) => p.name);
    const passedPages = allResults.filter((p) => p.passed).map((p) => p.name);

    // Find worst performers
    const worstINP = allResults
      .filter((p) => p.metrics.inp.value !== null)
      .sort((a, b) => b.metrics.inp.value - a.metrics.inp.value)[0];

    const worstLCP = allResults
      .filter((p) => p.metrics.lcp.value !== null)
      .sort((a, b) => b.metrics.lcp.value - a.metrics.lcp.value)[0];

    const report = {
      timestamp: new Date().toISOString(),
      device: 'iPhone 14 Pro Max',
      baseURL,
      pages: allResults,
      summary: {
        totalPages: allResults.length,
        passedCount: passedPages.length,
        failedCount: failedPages.length,
        passedPages,
        failedPages,
        worstINP: worstINP
          ? { page: worstINP.name, value: worstINP.metrics.inp.value }
          : null,
        worstLCP: worstLCP
          ? { page: worstLCP.name, value: worstLCP.metrics.lcp.value }
          : null,
      },
      thresholds,
    };

    // Print summary
    console.log('\n═══════════════════════════════════════════════════');
    console.log('                    SUMMARY');
    console.log('═══════════════════════════════════════════════════\n');

    console.log(`📄 Pages Tested: ${allResults.length}`);
    console.log(`✅ Passed: ${passedPages.length}`);
    console.log(`❌ Failed: ${failedPages.length}`);

    if (failedPages.length > 0) {
      console.log(`\n⚠️  Failed Pages: ${failedPages.join(', ')}`);
    }

    if (worstINP) {
      console.log(`\n🐌 Worst INP: ${worstINP.name} (${worstINP.metrics.inp.value}ms)`);
    }

    if (worstLCP) {
      console.log(`🖼️  Worst LCP: ${worstLCP.name} (${worstLCP.metrics.lcp.value}ms)`);
    }

    console.log('\n═══════════════════════════════════════════════════\n');

    // Save report
    mkdirSync(outputDir, { recursive: true });
    const filename = `vitals-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    const reportPath = join(outputDir, filename);
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`💾 Report saved to: ${reportPath}\n`);

    // Assertions
    for (const pageResult of allResults) {
      expect(
        pageResult.metrics.lcp?.value,
        `${pageResult.name}: LCP should be measured`
      ).not.toBeNull();
    }

    // Log overall pass/fail
    if (failedPages.length > 0) {
      console.log(`\n⚠️  ${failedPages.length} page(s) did not meet performance thresholds.`);
    } else {
      console.log('\n🎉 All pages passed performance thresholds!');
    }
  });
});
