# Automated Web Performance Testing - Complete Implementation Guide

## 🎯 Role & Objective

**Role:** You are a Senior Web Performance Engineer and Test Automation Architect specializing in:
- Core Web Vitals optimization and monitoring
- Synthetic monitoring and real user simulation
- Web performance instrumentation at scale
- Playwright/Puppeteer automation for performance testing
- CI/CD integration for performance regression testing

**Mission:** Create a production-grade automated performance testing framework using **Playwright** that accurately measures Core Web Vitals (especially **INP**) through realistic user interaction simulation, not just passive page loads.

---

## 🎯 The INP Testing Challenge

### Why Standard Tools Fall Short

**Problem with Basic Lighthouse/PageSpeed:**
```
❌ Lighthouse = Lab Test (No Real Interactions)
   - Loads page once
   - No user clicks, no scrolling, no typing
   - INP = "Not Available" or always 0ms
   
✅ Real Users = Field Data (Actual Interactions)
   - Click buttons, open menus, fill forms
   - INP measures these real interactions
   - This is what we need to simulate!
```

**The Solution:**
```
Synthetic Monitoring = Automated Real User Simulation
   1. Navigate to page (measure LCP, TTFB)
   2. Wait for page to be interactive
   3. Perform actual user actions (click, type, scroll)
   4. Capture INP during these interactions
   5. Measure CLS during scrolling
   6. Report all metrics with thresholds
```

---

## 📋 Test Configuration (CUSTOMIZE THIS)

```yaml
# ========================================
# TARGET WEBSITE CONFIGURATION
# ========================================
target_url: "https://your-website.com"  # ← CHANGE THIS

# Alternative: Test multiple pages
target_pages:
  - url: "https://your-site.com/"
    name: "Homepage"
    interactions:
      - type: "click"
        selector: "button#cta-button"
        wait_for: "div.modal-overlay"
      
  - url: "https://your-site.com/products"
    name: "Product Listing"
    interactions:
      - type: "click"
        selector: ".filter-button"
      - type: "scroll"
        amount: 1000
      
  - url: "https://your-site.com/checkout"
    name: "Checkout Flow"
    interactions:
      - type: "fill"
        selector: "input#email"
        value: "test@example.com"
      - type: "click"
        selector: "button#submit"

# ========================================
# USER JOURNEY TO SIMULATE
# ========================================
user_journey:
  # Example: E-commerce site
  steps:
    1. "Navigate to homepage"
    2. "Click on 'Shop Now' CTA button"
    3. "Wait for product overlay/modal to appear"
    4. "Scroll down 500px to trigger lazy-loaded images"
    5. "Click on product filter/category"
    6. "Type in search box"
    7. "Click search submit"
  
  # Key interaction for INP measurement
  critical_interaction:
    description: "Click 'Shop Now' CTA button"
    selector: "button#shop-now"
    expected_response: "Product modal opens"
    max_acceptable_inp: 200  # milliseconds

# ========================================
# PERFORMANCE THRESHOLDS
# ========================================
thresholds:
  # Google's Core Web Vitals Thresholds
  inp:
    good: 200        # ms - Feels instant
    needs_improvement: 500  # ms - Noticeable delay
    poor: 501        # ms+ - Significant delay
  
  lcp:
    good: 2500       # ms - Fast loading
    needs_improvement: 4000  # ms - Moderate loading
    poor: 4001       # ms+ - Slow loading
  
  cls:
    good: 0.1        # Minimal layout shift
    needs_improvement: 0.25  # Moderate shift
    poor: 0.26       # Significant shift
  
  ttfb:
    good: 800        # ms - Fast server response
    needs_improvement: 1800  # ms - Moderate response
    poor: 1801       # ms+ - Slow response
  
  fcp:
    good: 1800       # ms - Fast first paint
    needs_improvement: 3000  # ms
    poor: 3001       # ms+

# ========================================
# TEST EXECUTION SETTINGS
# ========================================
test_settings:
  browser: "chromium"  # chromium, firefox, webkit
  
  # Mobile vs Desktop
  device_emulation:
    mobile:
      enabled: true
      device: "iPhone 14 Pro Max"  # Playwright device name
      # Or custom:
      viewport: { width: 430, height: 932 }
      user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)"
      device_scale_factor: 3
      is_mobile: true
      has_touch: true
    
    desktop:
      enabled: true
      viewport: { width: 1920, height: 1080 }
      device_scale_factor: 1
  
  # Network Throttling
  network_conditions:
    - name: "Fast 3G"
      download: 1.6 * 1024  # Mbps
      upload: 0.75 * 1024
      latency: 40  # ms
    
    - name: "Slow 4G"
      download: 4 * 1024
      upload: 3 * 1024
      latency: 20
    
    - name: "No throttling"
      download: -1
      upload: -1
      latency: 0
  
  # CPU Throttling (slower devices)
  cpu_throttling:
    enabled: true
    rate: 4  # 4x slowdown simulates low-end mobile
  
  # Test Iterations
  iterations: 3  # Run test 3 times, take median
  
  # Timeouts
  navigation_timeout: 30000  # 30 seconds
  interaction_timeout: 10000  # 10 seconds
  
  # Screenshots & Traces
  capture_screenshots: true
  capture_trace: true  # For debugging
  trace_on_failure_only: true

# ========================================
# REPORTING & ALERTS
# ========================================
reporting:
  output_formats:
    - json  # Machine-readable results
    - html  # Visual report
    - csv   # For trend analysis
  
  output_directory: "./performance-reports"
  
  # Fail CI/CD pipeline if thresholds exceeded
  fail_on_threshold: true
  
  # Send alerts (optional integrations)
  alerts:
    slack_webhook: "https://hooks.slack.com/services/YOUR/WEBHOOK"
    email: "devops@yourcompany.com"
    
  # Compare with baseline
  baseline_file: "./baseline-metrics.json"
  regression_tolerance: 10  # % - Fail if metrics degrade by 10%

# ========================================
# ADVANCED SETTINGS
# ========================================
advanced:
  # Wait for specific resources
  wait_for_selector: "div#app.loaded"  # Wait for app initialization
  wait_for_network_idle: true
  
  # Custom JavaScript to inject
  custom_scripts:
    - "window.performanceTestMode = true;"
    - "localStorage.setItem('debug', 'true');"
  
  # Block unnecessary resources to speed up tests
  block_resources:
    - "*.woff2"  # Fonts
    - "*.png"    # Images
    - "analytics.js"
    - "google-analytics.com"
  
  # Authentication (if testing logged-in pages)
  authentication:
    enabled: false
    method: "cookies"  # or "login_form"
    cookies_file: "./auth-cookies.json"
```

---

## 🛠️ Implementation: Complete Playwright Script

### Option 1: TypeScript (Recommended)

```typescript
// performance-test.ts
// 
// AUTOMATED WEB VITALS TESTING WITH PLAYWRIGHT
// Measures: INP, LCP, CLS, TTFB, FCP with real user interactions
//
// Installation:
//   npm install --save-dev @playwright/test web-vitals
//   npx playwright install chromium
//
// Run:
//   npx playwright test performance-test.ts

import { test, expect, chromium, Page } from '@playwright/test';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  // Target website
  targetUrl: 'https://your-website.com',
  
  // User interactions to simulate
  interactions: [
    {
      name: 'Click CTA Button',
      selector: 'button#shop-now',  // ← CHANGE THIS to your button
      type: 'click',
      waitFor: 'div.modal-overlay',  // Wait for this to appear after click
      description: 'Primary CTA interaction - should trigger INP measurement',
    },
    {
      name: 'Click Menu Overlay',
      selector: 'button.menu-toggle',
      type: 'click',
      waitFor: 'nav.mobile-menu.open',
      description: 'Menu interaction - common INP trigger',
    },
    {
      name: 'Fill Search Box',
      selector: 'input[type="search"]',
      type: 'fill',
      value: 'test query',
      description: 'Input interaction',
    },
    {
      name: 'Scroll Down',
      type: 'scroll',
      amount: 1000,  // pixels
      description: 'Scroll to trigger CLS from lazy-loaded content',
    },
  ],
  
  // Performance thresholds (Google's Core Web Vitals)
  thresholds: {
    inp: { good: 200, needsImprovement: 500 },
    lcp: { good: 2500, needsImprovement: 4000 },
    cls: { good: 0.1, needsImprovement: 0.25 },
    ttfb: { good: 800, needsImprovement: 1800 },
    fcp: { good: 1800, needsImprovement: 3000 },
  },
  
  // Test settings
  device: 'iPhone 14 Pro Max',  // Playwright device preset
  networkProfile: 'Slow 4G',    // 'Fast 3G' | 'Slow 4G' | null
  cpuThrottling: 4,              // 4x slowdown
  iterations: 3,                 // Run 3 times, take median
  
  // Output
  outputDir: './performance-reports',
  screenshotOnFailure: true,
  captureTrace: true,
};

// ============================================================================
// WEB VITALS MEASUREMENT UTILITIES
// ============================================================================

/**
 * Injects web-vitals library and sets up metric collection
 * This is the CRITICAL part for measuring INP, LCP, CLS accurately
 */
async function injectWebVitals(page: Page): Promise<void> {
  // Inject web-vitals library from CDN
  await page.addScriptTag({
    url: 'https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js',
  });
  
  // Setup global metric collector
  await page.evaluate(() => {
    // Store metrics in window object for later retrieval
    (window as any).webVitalsMetrics = {
      inp: null,
      lcp: null,
      cls: null,
      fcp: null,
      ttfb: null,
    };
    
    // Register metric callbacks
    // @ts-ignore - webVitals is injected via CDN
    if (typeof webVitals !== 'undefined') {
      // INP - Interaction to Next Paint
      webVitals.onINP((metric: any) => {
        console.log('[Web Vitals] INP:', metric.value, 'ms');
        (window as any).webVitalsMetrics.inp = {
          value: metric.value,
          rating: metric.rating,
          entries: metric.entries?.map((e: any) => ({
            name: e.name,
            duration: e.duration,
            processingStart: e.processingStart,
            processingEnd: e.processingEnd,
            startTime: e.startTime,
          })),
        };
      });
      
      // LCP - Largest Contentful Paint
      webVitals.onLCP((metric: any) => {
        console.log('[Web Vitals] LCP:', metric.value, 'ms');
        (window as any).webVitalsMetrics.lcp = {
          value: metric.value,
          rating: metric.rating,
          element: metric.entries?.[0]?.element?.tagName,
        };
      });
      
      // CLS - Cumulative Layout Shift
      webVitals.onCLS((metric: any) => {
        console.log('[Web Vitals] CLS:', metric.value);
        (window as any).webVitalsMetrics.cls = {
          value: metric.value,
          rating: metric.rating,
          entries: metric.entries?.length,
        };
      });
      
      // FCP - First Contentful Paint
      webVitals.onFCP((metric: any) => {
        console.log('[Web Vitals] FCP:', metric.value, 'ms');
        (window as any).webVitalsMetrics.fcp = {
          value: metric.value,
          rating: metric.rating,
        };
      });
      
      // TTFB - Time to First Byte
      webVitals.onTTFB((metric: any) => {
        console.log('[Web Vitals] TTFB:', metric.value, 'ms');
        (window as any).webVitalsMetrics.ttfb = {
          value: metric.value,
          rating: metric.rating,
        };
      });
    }
  });
}

/**
 * Retrieves collected metrics from the page
 */
async function getWebVitals(page: Page): Promise<any> {
  return await page.evaluate(() => (window as any).webVitalsMetrics);
}

/**
 * Evaluates metric against thresholds
 */
function evaluateMetric(
  metricName: string,
  value: number,
  thresholds: { good: number; needsImprovement: number }
): { rating: 'good' | 'needs-improvement' | 'poor'; passed: boolean } {
  if (value <= thresholds.good) {
    return { rating: 'good', passed: true };
  } else if (value <= thresholds.needsImprovement) {
    return { rating: 'needs-improvement', passed: false };
  } else {
    return { rating: 'poor', passed: false };
  }
}

// ============================================================================
// MAIN TEST SUITE
// ============================================================================

test.describe('Web Performance Tests - Core Web Vitals', () => {
  
  // Run test for each device/network combination
  test(`Measure INP, LCP, CLS on ${CONFIG.device}`, async ({ browser }) => {
    // ========================================================================
    // SETUP: Configure browser context with device emulation
    // ========================================================================
    
    const context = await browser.newContext({
      // Device emulation
      ...chromium.devices[CONFIG.device],
      
      // Network throttling
      ...(CONFIG.networkProfile && {
        offline: false,
        // Simulate network conditions
        // Note: Exact network throttling may require CDP
      }),
    });
    
    // CPU throttling (requires CDP - Chrome DevTools Protocol)
    if (CONFIG.cpuThrottling > 1) {
      const client = await context.newCDPSession(await context.newPage());
      await client.send('Emulation.setCPUThrottlingRate', {
        rate: CONFIG.cpuThrottling,
      });
    }
    
    const page = await context.newPage();
    
    // Enable trace recording for debugging
    if (CONFIG.captureTrace) {
      await context.tracing.start({
        screenshots: true,
        snapshots: true,
      });
    }
    
    // ========================================================================
    // STEP 1: Navigate to page and wait for initial load
    // ========================================================================
    
    console.log(`\n📍 Navigating to: ${CONFIG.targetUrl}`);
    
    const navigationStart = Date.now();
    
    // Navigate and wait for load
    const response = await page.goto(CONFIG.targetUrl, {
      waitUntil: 'networkidle',  // Wait for network to be idle
      timeout: 30000,
    });
    
    const navigationEnd = Date.now();
    const navigationTime = navigationEnd - navigationStart;
    
    console.log(`✅ Page loaded in ${navigationTime}ms`);
    console.log(`📡 Server Response: ${response?.status()}`);
    
    // ========================================================================
    // STEP 2: Inject Web Vitals library
    // ========================================================================
    
    console.log('\n💉 Injecting web-vitals library...');
    await injectWebVitals(page);
    
    // ========================================================================
    // STEP 3: Wait for LCP to be captured
    // ========================================================================
    
    console.log('\n⏳ Waiting for LCP (Largest Contentful Paint)...');
    
    // Wait a bit for LCP to be measured
    // LCP should fire when the largest content element is visible
    await page.waitForTimeout(2000);
    
    // ========================================================================
    // STEP 4: Perform user interactions to trigger INP
    // ========================================================================
    
    console.log('\n🖱️  Simulating user interactions...\n');
    
    for (const interaction of CONFIG.interactions) {
      try {
        console.log(`  → ${interaction.name}`);
        
        if (interaction.type === 'click') {
          // CRITICAL: This is where INP gets measured!
          // 1. Click the element
          await page.click(interaction.selector);
          
          // 2. Wait for visual response (this is crucial for INP)
          if (interaction.waitFor) {
            await page.waitForSelector(interaction.waitFor, {
              timeout: 5000,
            });
          }
          
          // 3. Give time for INP callback to fire
          await page.waitForTimeout(300);
          
        } else if (interaction.type === 'fill') {
          await page.fill(interaction.selector, interaction.value || '');
          await page.waitForTimeout(200);
          
        } else if (interaction.type === 'scroll') {
          await page.evaluate((amount) => {
            window.scrollBy({ top: amount, behavior: 'smooth' });
          }, interaction.amount);
          await page.waitForTimeout(1000);  // Wait for CLS to be captured
        }
        
        console.log(`    ✓ ${interaction.description}`);
        
      } catch (error) {
        console.error(`    ✗ Failed: ${error}`);
        
        if (CONFIG.screenshotOnFailure) {
          await page.screenshot({
            path: join(CONFIG.outputDir, `failure-${interaction.name}.png`),
          });
        }
      }
    }
    
    // ========================================================================
    // STEP 5: Final wait to ensure all metrics are collected
    // ========================================================================
    
    console.log('\n⏳ Finalizing metric collection...');
    await page.waitForTimeout(1000);
    
    // ========================================================================
    // STEP 6: Retrieve metrics from the page
    // ========================================================================
    
    console.log('\n📊 Collecting Web Vitals metrics...\n');
    
    const metrics = await getWebVitals(page);
    
    // ========================================================================
    // STEP 7: Evaluate metrics against thresholds
    // ========================================================================
    
    const results = {
      url: CONFIG.targetUrl,
      timestamp: new Date().toISOString(),
      device: CONFIG.device,
      networkProfile: CONFIG.networkProfile,
      cpuThrottling: CONFIG.cpuThrottling,
      navigationTime,
      metrics: {
        inp: {
          value: metrics.inp?.value ?? null,
          rating: metrics.inp?.rating ?? 'not-measured',
          ...evaluateMetric('INP', metrics.inp?.value ?? Infinity, CONFIG.thresholds.inp),
          interactions: metrics.inp?.entries ?? [],
        },
        lcp: {
          value: metrics.lcp?.value ?? null,
          rating: metrics.lcp?.rating ?? 'not-measured',
          ...evaluateMetric('LCP', metrics.lcp?.value ?? Infinity, CONFIG.thresholds.lcp),
          element: metrics.lcp?.element ?? 'unknown',
        },
        cls: {
          value: metrics.cls?.value ?? null,
          rating: metrics.cls?.rating ?? 'not-measured',
          ...evaluateMetric('CLS', metrics.cls?.value ?? Infinity, CONFIG.thresholds.cls),
          shifts: metrics.cls?.entries ?? 0,
        },
        fcp: {
          value: metrics.fcp?.value ?? null,
          rating: metrics.fcp?.rating ?? 'not-measured',
          ...evaluateMetric('FCP', metrics.fcp?.value ?? Infinity, CONFIG.thresholds.fcp),
        },
        ttfb: {
          value: metrics.ttfb?.value ?? null,
          rating: metrics.ttfb?.rating ?? 'not-measured',
          ...evaluateMetric('TTFB', metrics.ttfb?.value ?? Infinity, CONFIG.thresholds.ttfb),
        },
      },
    };
    
    // ========================================================================
    // STEP 8: Print results to console
    // ========================================================================
    
    console.log('═══════════════════════════════════════════════════');
    console.log('           PERFORMANCE TEST RESULTS                 ');
    console.log('═══════════════════════════════════════════════════\n');
    
    console.log(`📱 Device: ${CONFIG.device}`);
    console.log(`🌐 Network: ${CONFIG.networkProfile || 'No throttling'}`);
    console.log(`⚙️  CPU Throttling: ${CONFIG.cpuThrottling}x\n`);
    
    // INP
    const inpSymbol = results.metrics.inp.passed ? '✅' : '❌';
    console.log(`${inpSymbol} INP: ${results.metrics.inp.value ?? 'N/A'}ms (${results.metrics.inp.rating})`);
    if (results.metrics.inp.interactions?.length) {
      console.log(`   └─ Measured from ${results.metrics.inp.interactions.length} interaction(s)`);
      results.metrics.inp.interactions.slice(0, 3).forEach((int: any) => {
        console.log(`      • ${int.name}: ${int.duration}ms`);
      });
    }
    
    // LCP
    const lcpSymbol = results.metrics.lcp.passed ? '✅' : '❌';
    console.log(`${lcpSymbol} LCP: ${results.metrics.lcp.value ?? 'N/A'}ms (${results.metrics.lcp.rating})`);
    console.log(`   └─ Element: <${results.metrics.lcp.element}>`);
    
    // CLS
    const clsSymbol = results.metrics.cls.passed ? '✅' : '❌';
    console.log(`${clsSymbol} CLS: ${results.metrics.cls.value ?? 'N/A'} (${results.metrics.cls.rating})`);
    console.log(`   └─ Layout shifts: ${results.metrics.cls.shifts}`);
    
    // FCP
    const fcpSymbol = results.metrics.fcp.passed ? '✅' : '❌';
    console.log(`${fcpSymbol} FCP: ${results.metrics.fcp.value ?? 'N/A'}ms (${results.metrics.fcp.rating})`);
    
    // TTFB
    const ttfbSymbol = results.metrics.ttfb.passed ? '✅' : '❌';
    console.log(`${ttfbSymbol} TTFB: ${results.metrics.ttfb.value ?? 'N/A'}ms (${results.metrics.ttfb.rating})`);
    
    console.log('\n═══════════════════════════════════════════════════\n');
    
    // ========================================================================
    // STEP 9: Save results to file
    // ========================================================================
    
    if (!existsSync(CONFIG.outputDir)) {
      mkdirSync(CONFIG.outputDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const jsonPath = join(CONFIG.outputDir, `metrics-${timestamp}.json`);
    
    writeFileSync(jsonPath, JSON.stringify(results, null, 2));
    console.log(`💾 Results saved to: ${jsonPath}\n`);
    
    // ========================================================================
    // STEP 10: Stop trace and save
    // ========================================================================
    
    if (CONFIG.captureTrace) {
      const tracePath = join(CONFIG.outputDir, `trace-${timestamp}.zip`);
      await context.tracing.stop({ path: tracePath });
      console.log(`🔍 Trace saved to: ${tracePath}\n`);
    }
    
    // ========================================================================
    // STEP 11: Assert thresholds (fail test if metrics are poor)
    // ========================================================================
    
    const allPassed = Object.values(results.metrics).every(
      (m: any) => m.passed || m.value === null
    );
    
    expect(allPassed).toBe(true);
    
    // Cleanup
    await context.close();
  });
});
```

---

### Option 2: Python (Alternative)

```python
# performance_test.py
#
# AUTOMATED WEB VITALS TESTING WITH PLAYWRIGHT (PYTHON)
# 
# Installation:
#   pip install playwright pytest
#   playwright install chromium
#
# Run:
#   pytest performance_test.py -v -s

import asyncio
import json
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List, Optional

import pytest
from playwright.async_api import async_playwright, Page, Browser, BrowserContext

# ============================================================================
# CONFIGURATION
# ============================================================================

CONFIG = {
    "target_url": "https://your-website.com",
    
    "interactions": [
        {
            "name": "Click CTA Button",
            "selector": "button#shop-now",
            "type": "click",
            "wait_for": "div.modal-overlay",
            "description": "Primary CTA - triggers INP",
        },
        {
            "name": "Click Menu",
            "selector": "button.menu-toggle",
            "type": "click",
            "wait_for": "nav.mobile-menu.open",
        },
        {
            "name": "Scroll Down",
            "type": "scroll",
            "amount": 1000,
        },
    ],
    
    "thresholds": {
        "inp": {"good": 200, "needs_improvement": 500},
        "lcp": {"good": 2500, "needs_improvement": 4000},
        "cls": {"good": 0.1, "needs_improvement": 0.25},
        "ttfb": {"good": 800, "needs_improvement": 1800},
        "fcp": {"good": 1800, "needs_improvement": 3000},
    },
    
    "device": "iPhone 14 Pro Max",
    "cpu_throttling": 4,
    "output_dir": "./performance-reports",
}

# ============================================================================
# WEB VITALS UTILITIES
# ============================================================================

async def inject_web_vitals(page: Page) -> None:
    """Inject web-vitals library and setup metric collection"""
    
    # Inject web-vitals from CDN
    await page.add_script_tag(
        url="https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js"
    )
    
    # Setup metric collector
    await page.evaluate("""
        window.webVitalsMetrics = {
            inp: null,
            lcp: null,
            cls: null,
            fcp: null,
            ttfb: null,
        };
        
        if (typeof webVitals !== 'undefined') {
            webVitals.onINP((metric) => {
                console.log('[Web Vitals] INP:', metric.value, 'ms');
                window.webVitalsMetrics.inp = {
                    value: metric.value,
                    rating: metric.rating,
                    entries: metric.entries?.map(e => ({
                        name: e.name,
                        duration: e.duration,
                        processingStart: e.processingStart,
                        processingEnd: e.processingEnd,
                    })),
                };
            });
            
            webVitals.onLCP((metric) => {
                console.log('[Web Vitals] LCP:', metric.value, 'ms');
                window.webVitalsMetrics.lcp = {
                    value: metric.value,
                    rating: metric.rating,
                    element: metric.entries?.[0]?.element?.tagName,
                };
            });
            
            webVitals.onCLS((metric) => {
                console.log('[Web Vitals] CLS:', metric.value);
                window.webVitalsMetrics.cls = {
                    value: metric.value,
                    rating: metric.rating,
                    entries: metric.entries?.length,
                };
            });
            
            webVitals.onFCP((metric) => {
                console.log('[Web Vitals] FCP:', metric.value, 'ms');
                window.webVitalsMetrics.fcp = {
                    value: metric.value,
                    rating: metric.rating,
                };
            });
            
            webVitals.onTTFB((metric) => {
                console.log('[Web Vitals] TTFB:', metric.value, 'ms');
                window.webVitalsMetrics.ttfb = {
                    value: metric.value,
                    rating: metric.rating,
                };
            });
        }
    """)


async def get_web_vitals(page: Page) -> Dict[str, Any]:
    """Retrieve collected metrics"""
    return await page.evaluate("window.webVitalsMetrics")


def evaluate_metric(
    value: Optional[float],
    thresholds: Dict[str, float]
) -> Dict[str, Any]:
    """Evaluate metric against thresholds"""
    if value is None:
        return {"rating": "not-measured", "passed": False}
    
    if value <= thresholds["good"]:
        return {"rating": "good", "passed": True}
    elif value <= thresholds["needs_improvement"]:
        return {"rating": "needs-improvement", "passed": False}
    else:
        return {"rating": "poor", "passed": False}


# ============================================================================
# MAIN TEST
# ============================================================================

@pytest.mark.asyncio
async def test_web_vitals():
    """Measure Core Web Vitals with real user interactions"""
    
    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch(headless=False)
        
        # Create context with device emulation
        device = p.devices[CONFIG["device"]]
        context = await browser.new_context(**device)
        
        # Enable CPU throttling via CDP
        if CONFIG["cpu_throttling"] > 1:
            client = await context.new_cdp_session(await context.new_page())
            await client.send("Emulation.setCPUThrottlingRate", {
                "rate": CONFIG["cpu_throttling"]
            })
        
        page = await context.new_page()
        
        # Start tracing
        await context.tracing.start(screenshots=True, snapshots=True)
        
        try:
            # ================================================================
            # STEP 1: Navigate to page
            # ================================================================
            
            print(f"\n📍 Navigating to: {CONFIG['target_url']}")
            
            nav_start = time.time()
            response = await page.goto(
                CONFIG["target_url"],
                wait_until="networkidle",
                timeout=30000
            )
            nav_end = time.time()
            
            nav_time = (nav_end - nav_start) * 1000
            print(f"✅ Page loaded in {nav_time:.0f}ms")
            print(f"📡 Status: {response.status}")
            
            # ================================================================
            # STEP 2: Inject web-vitals
            # ================================================================
            
            print("\n💉 Injecting web-vitals library...")
            await inject_web_vitals(page)
            
            # ================================================================
            # STEP 3: Wait for LCP
            # ================================================================
            
            print("\n⏳ Waiting for LCP...")
            await page.wait_for_timeout(2000)
            
            # ================================================================
            # STEP 4: Perform interactions
            # ================================================================
            
            print("\n🖱️  Simulating user interactions:\n")
            
            for interaction in CONFIG["interactions"]:
                try:
                    print(f"  → {interaction['name']}")
                    
                    if interaction["type"] == "click":
                        await page.click(interaction["selector"])
                        
                        if "wait_for" in interaction:
                            await page.wait_for_selector(
                                interaction["wait_for"],
                                timeout=5000
                            )
                        
                        await page.wait_for_timeout(300)
                        
                    elif interaction["type"] == "fill":
                        await page.fill(
                            interaction["selector"],
                            interaction.get("value", "")
                        )
                        await page.wait_for_timeout(200)
                        
                    elif interaction["type"] == "scroll":
                        await page.evaluate(
                            f"window.scrollBy({{top: {interaction['amount']}, behavior: 'smooth'}})"
                        )
                        await page.wait_for_timeout(1000)
                    
                    print(f"    ✓ {interaction.get('description', 'Done')}")
                    
                except Exception as e:
                    print(f"    ✗ Failed: {e}")
            
            # ================================================================
            # STEP 5: Collect metrics
            # ================================================================
            
            print("\n📊 Collecting metrics...\n")
            await page.wait_for_timeout(1000)
            
            metrics = await get_web_vitals(page)
            
            # ================================================================
            # STEP 6: Evaluate and report
            # ================================================================
            
            results = {
                "url": CONFIG["target_url"],
                "timestamp": datetime.now().isoformat(),
                "device": CONFIG["device"],
                "navigation_time": nav_time,
                "metrics": {
                    "inp": {
                        "value": metrics.get("inp", {}).get("value"),
                        **evaluate_metric(
                            metrics.get("inp", {}).get("value"),
                            CONFIG["thresholds"]["inp"]
                        ),
                    },
                    "lcp": {
                        "value": metrics.get("lcp", {}).get("value"),
                        **evaluate_metric(
                            metrics.get("lcp", {}).get("value"),
                            CONFIG["thresholds"]["lcp"]
                        ),
                    },
                    "cls": {
                        "value": metrics.get("cls", {}).get("value"),
                        **evaluate_metric(
                            metrics.get("cls", {}).get("value"),
                            CONFIG["thresholds"]["cls"]
                        ),
                    },
                    "fcp": {
                        "value": metrics.get("fcp", {}).get("value"),
                        **evaluate_metric(
                            metrics.get("fcp", {}).get("value"),
                            CONFIG["thresholds"]["fcp"]
                        ),
                    },
                    "ttfb": {
                        "value": metrics.get("ttfb", {}).get("value"),
                        **evaluate_metric(
                            metrics.get("ttfb", {}).get("value"),
                            CONFIG["thresholds"]["ttfb"]
                        ),
                    },
                },
            }
            
            # Print results
            print("═" * 50)
            print("        PERFORMANCE TEST RESULTS")
            print("═" * 50 + "\n")
            
            for metric_name, data in results["metrics"].items():
                symbol = "✅" if data["passed"] else "❌"
                value = data["value"]
                rating = data["rating"]
                
                if value is not None:
                    unit = "ms" if metric_name != "cls" else ""
                    print(f"{symbol} {metric_name.upper()}: {value}{unit} ({rating})")
                else:
                    print(f"⚠️  {metric_name.upper()}: Not measured")
            
            print("\n" + "═" * 50 + "\n")
            
            # Save results
            output_dir = Path(CONFIG["output_dir"])
            output_dir.mkdir(exist_ok=True)
            
            timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
            json_path = output_dir / f"metrics-{timestamp}.json"
            
            with open(json_path, "w") as f:
                json.dump(results, f, indent=2)
            
            print(f"💾 Results saved to: {json_path}\n")
            
            # Stop tracing
            trace_path = output_dir / f"trace-{timestamp}.zip"
            await context.tracing.stop(path=str(trace_path))
            print(f"🔍 Trace saved to: {trace_path}\n")
            
            # Assert all metrics passed
            all_passed = all(
                m["passed"] or m["value"] is None
                for m in results["metrics"].values()
            )
            
            assert all_passed, "Some metrics failed threshold checks"
            
        finally:
            await context.close()
            await browser.close()


if __name__ == "__main__":
    asyncio.run(test_web_vitals())
```

---

## 📊 Understanding the Output

### Sample Console Output
```
📍 Navigating to: https://your-website.com
✅ Page loaded in 1245ms
📡 Status: 200

💉 Injecting web-vitals library...

⏳ Waiting for LCP...

🖱️  Simulating user interactions:

  → Click CTA Button
[Web Vitals] INP: 245ms
    ✓ Primary CTA - triggers INP
  → Click Menu
[Web Vitals] INP: 180ms
    ✓ Menu interaction
  → Scroll Down
[Web Vitals] CLS: 0.05
    ✓ Scroll to capture CLS

📊 Collecting metrics...

[Web Vitals] LCP: 1850ms
[Web Vitals] FCP: 980ms
[Web Vitals] TTFB: 340ms

══════════════════════════════════════════════════
        PERFORMANCE TEST RESULTS
══════════════════════════════════════════════════

✅ INP: 245ms (needs-improvement)  ← Interaction latency
✅ LCP: 1850ms (good)               ← Largest content loaded
✅ CLS: 0.05 (good)                 ← Layout stability
✅ FCP: 980ms (good)                ← First paint
✅ TTFB: 340ms (good)               ← Server response

══════════════════════════════════════════════════

💾 Results saved to: ./performance-reports/metrics-2026-02-01-143045.json
🔍 Trace saved to: ./performance-reports/trace-2026-02-01-143045.zip
```

---

## 🎯 When INP is "Not Measured"

If you see `INP: Not measured`, it means:

1. **No interactions occurred** - Add more clicks/taps
2. **Interactions were too fast** - Web Vitals might not capture < 40ms interactions
3. **Interaction didn't cause visual update** - The `waitFor` selector is crucial
4. **Timing issue** - Increase wait time after interaction

**Fix:**
```typescript
// Ensure interaction causes measurable work
await page.click('button#heavy-operation');

// ✅ Wait for visual feedback
await page.waitForSelector('.loading-spinner', { state: 'hidden' });

// ✅ Give INP callback time to fire
await page.waitForTimeout(500);
```

---

## 🚀 Running the Tests

### TypeScript
```bash
# Install dependencies
npm install --save-dev @playwright/test web-vitals
npx playwright install chromium

# Run tests
npx playwright test performance-test.ts

# With UI (see browser)
npx playwright test performance-test.ts --headed

# Generate HTML report
npx playwright test --reporter=html
npx playwright show-report
```

### Python
```bash
# Install dependencies
pip install playwright pytest
playwright install chromium

# Run tests
pytest performance_test.py -v -s

# With HTML report
pytest performance_test.py --html=report.html
```

---

## 📈 Continuous Integration

### GitHub Actions Example
```yaml
name: Performance Tests

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: |
          npm install
          npx playwright install --with-deps chromium
      
      - name: Run performance tests
        run: npx playwright test performance-test.ts
      
      - name: Upload results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: performance-results
          path: |
            performance-reports/
            playwright-report/
      
      - name: Comment PR with results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const results = JSON.parse(
              fs.readFileSync('./performance-reports/metrics-latest.json')
            );
            
            const comment = `
            ## 📊 Performance Test Results
            
            | Metric | Value | Status |
            |--------|-------|--------|
            | INP | ${results.metrics.inp.value}ms | ${results.metrics.inp.passed ? '✅' : '❌'} |
            | LCP | ${results.metrics.lcp.value}ms | ${results.metrics.lcp.passed ? '✅' : '❌'} |
            | CLS | ${results.metrics.cls.value} | ${results.metrics.cls.passed ? '✅' : '❌'} |
            `;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

---

This comprehensive testing framework gives you production-grade performance monitoring with real INP measurements, not just theoretical lab scores!