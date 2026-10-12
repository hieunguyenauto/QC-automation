import { test } from '@playwright/test';
import { env } from '../../common/env';
import { loginAs, type Who } from '../../common/session';

/**
 * MỞ TRÌNH DUYỆT ĐỂ XEM / LẤY LOCATOR — không phải test.
 * Đã qua sẵn Basic Auth (env/<ENV>.json › httpAuth + .env), tuỳ chọn đăng nhập sẵn tài khoản.
 *   npm run open                              → trang login của ENV trong .env
 *   ACCOUNT=99 npm run open                   → đăng nhập admin rồi dừng
 *   ENV=est-test ACCOUNT=02:urgent npm run open
 *   URL=/admin/troubles ACCOUNT=99 npm run open
 * Cửa sổ Playwright Inspector mở ra: bấm "Record" để ghi thao tác / "Pick locator" để lấy locator. Đóng trình duyệt để kết thúc.
 */
test('open browser', async ({ page }) => {
  test.setTimeout(0);
  const who = process.env.ACCOUNT as Who | undefined;
  if (who) await loginAs(page, who, { save: false });
  else await page.goto('/login');
  if (process.env.URL) await page.goto(process.env.URL);
  console.log(`ENV=${env.name} · ${env.cmsBaseUrl} · Basic Auth: ${env.httpCredentials ? 'có (tự điền)' : 'không'} · tài khoản: ${who ?? '(chưa đăng nhập)'}`);
  await page.pause();
});
