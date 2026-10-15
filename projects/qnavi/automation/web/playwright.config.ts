import fs from 'fs';
import { defineConfig, devices } from '@playwright/test';
import { env } from './common/env';

/**
 * Report (common/qc-reporter.ts) — 3 thư mục tổng, tên = [tên testcase]_[dd-mm-yyyy_HH-mm-ss]_[ENV]:
 *   reports/Passed/<TC ID>_<tên TC>_<ngày giờ>_<ENV>.md
 *   reports/Failed/<TC ID>_<tên TC>_<ngày giờ>_<ENV>/   (FAIL.md + ảnh, trace…)
 *   reports/Skipped/<TC ID>_<tên TC>_<ngày giờ>_<ENV>.md
 *   reports/Runs/<tên bộ test>_<ngày giờ>_<ENV>/        (SUMMARY.md + report gốc Playwright: html, results.json, junit, artifacts)
 *   reports/HISTORY.md
 * RUN_ID đặt 1 lần ở process chính, worker kế thừa qua biến môi trường.
 */
function suiteName(): string {
  const args = process.argv.slice(2);
  // Tên lần chạy = tên file / thư mục / bộ lọc truyền vào (vd tests/cms/phase007/ → phase007, E2E-01 → E2E-01).
  const withValue = new Set(['-g', '--grep', '--grep-invert', '--project', '-c', '--config', '-j', '--workers', '--retries', '--repeat-each', '--timeout', '--reporter', '--shard']);
  const specs = args.filter((a, i) => a !== 'test' && !a.startsWith('-') && !withValue.has(args[i - 1]))
    .map((a) => a.replace(/\/+$/, '').split('/').pop()!.replace(/\.spec\.ts$/, '')).filter(Boolean);
  if (specs.length) return specs.join('+');
  const project = args.find((a) => a.startsWith('--project='))?.split('=')[1]
    ?? (args.includes('--project') ? args[args.indexOf('--project') + 1] : undefined);
  if (project === 'e2e') {
    // Tên file kịch bản E2E (vd e2e-trouble-flow).
    try {
      return 'e2e-all';
    } catch { return 'e2e'; }
  }
  return project ?? 'all';
}
if (!process.env.RUN_ID) {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  const stamp = `${p(d.getDate())}-${p(d.getMonth() + 1)}-${d.getFullYear()}_${p(d.getHours())}-${p(d.getMinutes())}-${p(d.getSeconds())}`;
  process.env.RUN_STAMP = stamp;
  process.env.RUN_ID = `${suiteName()}_${stamp}_${env.name}`;
}
// --list / chạy thử không ghi vào Runs/ (tránh thư mục rỗng 0 test)
const LIST_ONLY = process.argv.includes('--list');
const runDir = LIST_ONLY ? `reports/_tmp_chk/${process.env.RUN_ID}` : `reports/Runs/${process.env.RUN_ID}`;

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
    ['./common/qc-reporter.ts', { reportsRoot: 'reports', runDir, stamp: process.env.RUN_STAMP, envName: env.name, baseUrl: env.cmsBaseUrl }],
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
      // Test lẻ độc lập (mỗi test tự đăng nhập bằng phiên lưu sẵn).
      testMatch: /tests\/cms\/smoke\/.*\.spec\.ts/,
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // Kịch bản E2E nối tiếp: tự login bằng UI, không cần project setup.
      name: 'e2e',
      // Kịch bản nối tiếp: e2e-*.spec.ts và phase<NNN>-*.spec.ts (regression theo phase).
      // Mỗi bộ test 1 thư mục: tests/cms/e2e-trouble-flow/, phase007/, e2e-suite/ … (mọi thư mục trừ smoke/).
      testMatch: /tests\/cms\/.*\.spec\.ts/,
      testIgnore: /tests\/cms\/smoke\//,
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
      // Đi qua màn hình, không lưu dữ liệu, ghi aria snapshot → reports/_tmp_chk/recon*/ (tạm, ghi đè mỗi lần; lấy locator thật).
      name: 'recon',
      testMatch: /tests\/tools\/recon.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
