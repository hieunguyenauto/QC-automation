import type { Page, Response } from '@playwright/test';
export { tableRow } from './ui';

/** Như waitForApi nhưng không làm fail test nếu API không gọi (vd trang dùng cache). */
export function waitForApiSafe(page: Page, urlPart: string, timeout = 15_000): Promise<Response | null> {
  return page.waitForResponse((r) => r.url().includes(urlPart) && r.status() < 400, { timeout }).catch(() => null);
}
