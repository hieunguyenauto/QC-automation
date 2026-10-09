import { expect, type Page } from '@playwright/test';

/** Toast / message tiếng Nhật: truyền đúng text trong TC (phần trong ''). */
export async function expectMessage(page: Page, text: string): Promise<void> {
  await expect(page.getByText(text, { exact: false }).first()).toBeVisible();
}
