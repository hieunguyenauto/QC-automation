import { defineConfig, devices } from '@playwright/test';
import { env } from './common/env';

/**
 * Mỗi lần chạy ghi vào reports/<ngày-giờ>-<ENV>/ : html/, results.json, junit.xml, artifacts/ (trace, ảnh, video khi fail).
 * RUN_ID đặt 1 lần ở process chính, worker kế thừa qua biến môi trường.
 */
if (!process.env.RUN_ID) {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  process.env.RUN_ID = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}-${env.name}`;
}
const runDir = `reports/${process.env.RUN_ID}`;

export default defineConfig({
  testDir: '.',
  outputDir: `${runDir}/artifacts`,
  timeout: env.testTimeoutMs,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: true,
  reporter: [
    ['list'],
    ['html', { outputFolder: `${runDir}/html`, open: 'never' }],
    ['json', { outputFile: `${runDir}/results.json` }],
    ['junit', { outputFile: `${runDir}/junit.xml` }],
  ],
  use: {
    // Trình duyệt: mặc định Google Chrome cài sẵn trên máy (BROWSER_CHANNEL=chrome).
    // Đặt BROWSER_CHANNEL=chromium trong .env để dùng Chromium của Playwright (cần npx playwright install chromium).
    channel: process.env.BROWSER_CHANNEL === 'chromium' ? undefined : process.env.BROWSER_CHANNEL || 'chrome',
    baseURL: env.cmsBaseUrl,
    locale: 'ja-JP',
    timezoneId: 'Asia/Tokyo',
    actionTimeout: env.actionTimeoutMs,
    navigationTimeout: env.navigationTimeoutMs,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'setup', testMatch: /common\/auth\.setup\.ts/, use: { ...devices['Desktop Chrome'] } },
    {
      name: 'cms',
      testMatch: /tests\/cms\/.*\.spec\.ts/,
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
