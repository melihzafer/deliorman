const { test, expect } = require('@playwright/test');
const { mkdirSync, writeFileSync } = require('fs');
const { join } = require('path');

const thresholds = {
  lcp: [2500, 4000],
  inp: [200, 500],
  cls: [0.1, 0.25],
};

const outputDir = process.env.PERF_OUTPUT_DIR || 'performance-reports';

const rateMetric = (value, [good, needsImprovement]) => {
  if (value <= good) return 'good';
  if (value <= needsImprovement) return 'needs-improvement';
  return 'poor';
};

const injectWebVitals = async (page) => {
  await page.addScriptTag({
    url: 'https://unpkg.com/web-vitals@5/dist/web-vitals.iife.js',
  });

  await page.evaluate(() => {
    window.__webVitals = {
      lcp: null,
      cls: null,
      inp: null,
    };

    if (!window.webVitals) {
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
  });
};

test.describe('Core Web Vitals (LCP/CLS/INP)', () => {
  test('measures vitals with real interactions', async ({ page }) => {
    const testInfo = test.info();
    const baseURL =
      testInfo.project.use.baseURL ||
      process.env.PERF_BASE_URL ||
      'http://localhost:3000';

    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await injectWebVitals(page);

    await page.waitForTimeout(1500);

    await page.evaluate(() => window.scrollTo({ top: 800, behavior: 'smooth' }));
    await page.waitForTimeout(800);

    const nextSpecialtyButton = page.getByRole('button', {
      name: /next specialty/i,
    });

    await nextSpecialtyButton.waitFor({ state: 'visible', timeout: 15000 });
    await nextSpecialtyButton.scrollIntoViewIfNeeded();
    await nextSpecialtyButton.click();

    await page.waitForTimeout(800);

    await page.waitForFunction(
      () => window.__webVitals?.lcp?.value != null,
      null,
      { timeout: 15000 }
    );

    await page.waitForFunction(
      () => window.__webVitals?.inp?.value != null,
      null,
      { timeout: 15000 }
    );

    const metrics = await page.evaluate(() => window.__webVitals);

    expect(metrics.lcp?.value).not.toBeNull();
    expect(metrics.cls?.value).not.toBeNull();
    expect(metrics.inp?.value).not.toBeNull();

    const results = {
      url: baseURL,
      timestamp: new Date().toISOString(),
      metrics: {
        lcp: {
          value: metrics.lcp?.value ?? null,
          rating: metrics.lcp?.value != null ? rateMetric(metrics.lcp.value, thresholds.lcp) : null,
        },
        cls: {
          value: metrics.cls?.value ?? null,
          rating: metrics.cls?.value != null ? rateMetric(metrics.cls.value, thresholds.cls) : null,
        },
        inp: {
          value: metrics.inp?.value ?? null,
          rating: metrics.inp?.value != null ? rateMetric(metrics.inp.value, thresholds.inp) : null,
          entries: metrics.inp?.entries ?? [],
        },
      },
      thresholds,
    };

    mkdirSync(outputDir, { recursive: true });
    const filename = `vitals-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    writeFileSync(join(outputDir, filename), JSON.stringify(results, null, 2));
  });
});
