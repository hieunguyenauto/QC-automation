import fs from 'fs';
import { test, type BrowserContext, type Page } from '@playwright/test';
import { env } from './env';

/**
 * Khung cho kịch bản chạy NỐI TIẾP trên 1 trình duyệt dùng chung (mọi TC cùng 1 page).
 * Gom lại từ tests/cms/e2e-trouble-flow.spec.ts, áp dụng lesson:
 *  - R02 / R13: trace tự ghi theo chunk từng TC (config project e2e: trace/video off), giữ khi fail; mọi lệnh trong hook có giới hạn thời gian.
 *  - Ảnh + aria snapshot + URL khi fail (FAIL.md của common/qc-reporter.ts đọc các file đính kèm này).
 *  - Video cả kịch bản → reports/Runs/<lần chạy>/video/ (tắt: E2E_VIDEO=off); reporter ghi mốc thời gian, xoá khi không có fail.
 * Dùng:
 *   test.describe.configure({ mode: 'serial' });
 *   const sc = serialScenario(() => [`T1 ${t1.number}`]);   // hàm trả chú thích dữ liệu ghi vào report
 *   test('...', async () => { const page = sc.page; ... });
 */
export const within = (p: Promise<unknown> | undefined, ms: number) =>
  Promise.race([(p ?? Promise.resolve()).catch(() => {}), new Promise((r) => setTimeout(r, ms))]);

export function serialScenario(notes: () => string[] = () => []) {
  let context: BrowserContext;
  let page: Page;
  const videoDir = process.env.E2E_VIDEO === 'off' || !process.env.RUN_ID ? undefined : `reports/Runs/${process.env.RUN_ID}/video`;

  test.beforeAll(async ({ browser }) => {
    if (videoDir) {
      fs.mkdirSync(videoDir, { recursive: true });
      fs.writeFileSync(`${videoDir}/start.txt`, String(Date.now()));
    }
    context = await browser.newContext({
      ...(videoDir ? { recordVideo: { dir: videoDir, size: { width: 1280, height: 800 } } } : {}),
      httpCredentials: env.httpCredentials,
      baseURL: env.cmsBaseUrl, locale: 'ja-JP', timezoneId: 'Asia/Tokyo', viewport: { width: 1600, height: 1000 },
      acceptDownloads: true,
    });
    context.setDefaultTimeout(env.actionTimeoutMs);
    context.setDefaultNavigationTimeout(env.navigationTimeoutMs);
    await context.tracing.start({ screenshots: true, snapshots: true });
    page = await context.newPage();
  });

  test.beforeEach(async ({}, testInfo) => {
    await within(context.tracing.startChunk({ title: testInfo.title }), 10_000);
  });

  test.afterEach(async ({}, testInfo) => {
    const n = notes().filter(Boolean);
    if (n.length) testInfo.annotations.push({ type: 'trouble', description: n.join(' · ') });
    if (testInfo.status !== testInfo.expectedStatus) {
      await testInfo.attach('url', { body: page.url(), contentType: 'text/plain' }).catch(() => {});
      const shot = await page.screenshot({ timeout: 10_000 }).catch(() => null);
      if (shot) await testInfo.attach('screenshot', { body: shot, contentType: 'image/png' });
      const aria = await page.locator('body').ariaSnapshot({ timeout: 10_000 }).catch(() => null);
      if (aria) await testInfo.attach('aria-snapshot', { body: aria, contentType: 'text/yaml' });
      const tracePath = testInfo.outputPath('trace.zip');
      await within(context.tracing.stopChunk({ path: tracePath }), 30_000);
      await testInfo.attach('trace', { path: tracePath, contentType: 'application/zip' }).catch(() => {});
    } else {
      await within(context.tracing.stopChunk(), 10_000);
    }
  });

  test.afterAll(async () => {
    test.setTimeout(60_000);
    await within(context?.tracing.stop(), 15_000);
    await within(context?.close(), 30_000);
  });

  return {
    get page() { return page; },
    get context() { return context; },
  };
}
