import { defineConfig, devices } from '@playwright/test';
import { env } from './common/env';

/**
 * Mỗi lần chạy ghi vào reports/<ngày-giờ>-<ENV>/ : SUMMARY.md, passed/, failed/<TC>_<tên>_<dd-mm-yyyy>/, skipped/ (common/qc-reporter.ts)
 * + html/, results.json, junit.xml, artifacts/ (report gốc Playwright).
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
    // Report cho QC: SUMMARY.md, passed/, failed/<TC ID>_<tên>_<dd-mm-yyyy>/FAIL.md, reports/HISTORY.md
    ['./common/qc-reporter.ts', { outputFolder: runDir, envName: env.name, baseUrl: env.cmsBaseUrl }],
  ],
  use: {
    // Trình duyệt: mặc định Google Chrome cài sẵn trên máy (BROWSER_CHANNEL=chrome).
    // Đặt BROWSER_CHANNEL=chromium trong .env để dùng Chromium của Playwright (cần npx playwright install chromium).
    channel: process.env.BROWSER_CHANNEL === 'chromium' ? undefined : process.env.BROWSER_CHANNEL || 'chrome',
    baseURL: env.cmsBaseUrl,
    // Basic Auth theo môi trường (env/<ENV>.json › httpAuth + .env HTTP_AUTH_PASSWORD).
    httpCredentials: env.httpCredentials,
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
      testIgnore: [/tests\/cms\/e2e-.*\.spec\.ts/, /tests\/cms\/recon\.spec\.ts/],
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // Kịch bản E2E nối tiếp: tự login bằng UI, không cần project setup.
      name: 'e2e',
      testMatch: /tests\/cms\/e2e-.*\.spec\.ts/,
      // trace/video off: spec tự ghi trace theo từng TC trên context dùng chung (xem e2e-trouble-flow.spec.ts, lesson R13).
      use: { ...devices['Desktop Chrome'], viewport: { width: 1600, height: 1000 }, trace: 'off', video: 'off' },
    },
    {
      // npm run open: mở trình duyệt đã qua Basic Auth (+ đăng nhập ACCOUNT nếu có) để xem / lấy locator.
      name: 'open',
      testMatch: /tests\/tools\/open\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1600, height: 1000 } },
    },
    {
      // Đi qua màn hình, không lưu dữ liệu, ghi aria snapshot → reports/recon-<run>/ (lấy locator thật).
      name: 'recon',
      testMatch: /tests\/cms\/recon\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
