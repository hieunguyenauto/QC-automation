import { expect } from '@playwright/test';
import { BaseScreen } from '../base.screen';
import { click, clickable, modalWithButton } from '../../common/ui';

/**
 * チェーンシステム情報 — catalog: cms-frontend.md › "Chain System".
 * Dò thật 2026-10-13 (dev, role 99):
 *  - Danh sách /admin/chain-systems: khối '検索条件' thu gọn (h4 bấm mở), input[name=companyName], nút 検索; bấm ô tên ở dòng → chi tiết.
 *  - Chi tiết /admin/chain-systems/<chainId>/stores: nút 症状一覧DL, 店舗別作業項目DL (hộp '確認' 'CSVファイルをダウンロードします。よろしいですか？', 閉じる / 決定).
 *  - Bảng チェーン店舗一覧: cột 店名; bấm ô 店名 → /admin/chain-systems/<chainId>/stores/<storeId>/detail.
 *  - Role 01 (manager): menu チェーンシステム情報 vào thẳng /admin/chain-system/stores, KHÔNG có nút 症状一覧DL.
 */
export class ChainSystemScreen extends BaseScreen {
  readonly id = 'CMS-CHAIN-SYSTEM';
  readonly path = '/admin/chain-systems';
  readonly roles = ['99', '98', '01'] as const;

  readonly content = this.page.locator('.content-wrapper').first();
  readonly symptomDl = clickable(this.content, '症状一覧DL');
  readonly storeItemDl = clickable(this.content, '店舗別作業項目DL');

  async expandSearch(): Promise<void> {
    const input = this.content.locator('input[name="companyName"]');
    if (!(await input.isVisible().catch(() => false))) await this.content.locator('h4', { hasText: '検索条件' }).first().click();
    await expect(input).toBeVisible();
  }
  /** Tìm theo 社名 rồi mở chi tiết chain (dòng chứa chainName). Trả về chainId (từ URL). */
  async openChain(companyQuery: string, chainName: string): Promise<string> {
    await this.expandSearch();
    await this.content.locator('input[name="companyName"]').fill(companyQuery);
    await click(this.content, '検索');
    const row = this.content.locator('tbody tr', { hasText: chainName }).first();
    await expect(row).toBeVisible({ timeout: 15_000 });
    await row.locator('td').nth(1).click();
    await expect(this.page).toHaveURL(/\/chain-systems\/\d+\/stores/);
    return this.page.url().match(/chain-systems\/(\d+)/)![1];
  }
  /** Bấm nút DL → hộp xác nhận CSV. */
  async openStoreItemDl(): Promise<ReturnType<typeof modalWithButton>> {
    await this.storeItemDl.click();
    const box = modalWithButton(this.page, '決定');
    await expect(box).toBeVisible();
    return box;
  }
  /** id của store (bấm ô 店名 ở bảng チェーン店舗一覧 → URL .../stores/<id>/detail), rồi quay lại. */
  async storeId(storeName: string): Promise<string> {
    const back = this.page.url();
    const row = this.content.locator('tbody tr', { hasText: storeName }).first();
    await expect(row).toBeVisible({ timeout: 15_000 });
    await row.locator('td').nth(1).click();
    await expect(this.page).toHaveURL(/\/stores\/\d+\/detail/);
    const id = this.page.url().match(/stores\/(\d+)\/detail/)![1];
    await this.page.goto(back);
    return id;
  }
}
