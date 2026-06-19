const { defineConfig, devices } = require('@playwright/test');

const baseURL =
  process.env.PLAYWRIGHT_BASE_URL ||
  process.env.PERF_BASE_URL ||
  'http://127.0.0.1:3010';
const hasExplicitBaseURL =
  typeof process.env.PLAYWRIGHT_BASE_URL === 'string' &&
  process.env.PLAYWRIGHT_BASE_URL.trim().length > 0;
const isLocalBaseURL = /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/i.test(baseURL);
// When PLAYWRIGHT_BASE_URL is provided, the caller is responsible for the server lifecycle.
const shouldUseWebServer = !hasExplicitBaseURL && isLocalBaseURL;

module.exports = defineConfig({
  testDir: './tests',
  timeout: 90_000,
  expect: {
    timeout: 10_000,
  },
  retries: 0,
  workers: 1,
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: ['**/tests/performance/**/*.spec.js'],
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'chromium-mobile',
      testMatch: ['**/tests/performance/**/*.spec.js'],
      use: {
        ...devices['iPhone 14 Pro Max'],
      },
    },
  ],
  ...(shouldUseWebServer
    ? {
        webServer: {
          command: 'npm run build && npx next start --hostname 127.0.0.1 --port 3010',
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 240_000,
        },
      }
    : {}),
});
