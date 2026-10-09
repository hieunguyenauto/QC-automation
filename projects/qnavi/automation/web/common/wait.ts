import type { Page, Response } from '@playwright/test';

/** Chờ 1 API trả về (vd 'troubles?'), dùng trước khi assert dữ liệu trên bảng. */
export function waitForApi(page: Page, urlPart: string, method = 'GET'): Promise<Response> {
  return page.waitForResponse(
    (res) => res.url().includes(urlPart) && res.request().method() === method && res.status() < 400,
  );
}

/**
 * Chờ loader toàn trang của CMS (AppLoader) tắt.
 * [cần kiểm trên app thật] selector của AppLoader — sửa LOADER khi đã lấy được bằng Pick locator.
 */
const LOADER = '.app-loader, .ant-spin-spinning';
export async function waitForAppIdle(page: Page): Promise<void> {
  await page.locator(LOADER).first().waitFor({ state: 'hidden' }).catch(() => undefined);
}
