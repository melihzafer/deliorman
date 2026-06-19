# Performance testing (LCP/CLS/INP)

This repo includes a Playwright-based performance test that measures Core Web Vitals with real user interactions.

## What it measures

- **LCP** (Largest Contentful Paint)
- **CLS** (Cumulative Layout Shift)
- **INP** (Interaction to Next Paint)

## How it works

The test injects the `web-vitals` library at runtime, performs a scroll and an interaction with the Specialties slider, then collects LCP/CLS/INP and writes a JSON report.

## Run locally

1. Install dependencies.
2. Install Playwright browsers.
3. Run the perf test script.

Environment variables:

- `PERF_BASE_URL` (default: `http://localhost:3000`)
- `PERF_OUTPUT_DIR` (default: `performance-reports`)

## Output

Reports are written to `performance-reports/` in JSON format and are gitignored.
