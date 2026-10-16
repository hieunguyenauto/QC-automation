import { expect } from '@playwright/test';
import { BaseScreen } from '../base.screen';
import { waitApisIdle } from '../../common/wait';
import { acknowledgeOk, click, clickable, clickables, confirmDecide, exact, modalWithButton, valueOf } from '../../common/ui';
import { NR } from '../../common/env-names';

/**
 * チェーンシステム情報 — catalog: cms-frontend.md › "Chain System".
 * Dò thật 2026-10-13 (dev, role 99):
 *  - Danh sách /admin/chain-systems: khối '検索条件' thu gọn (h4 bấm mở), input[name=companyName], nút 検索; bấm ô tên ở dòng → chi tiết.
 *  - Chi tiết /admin/chain-systems/<chainId>/stores: nút 症状一覧DL, 店舗別作業項目DL (hộp '確認' 'CSVファイルをダウンロードします。よろしいですか？', 閉じる / 決定).
 *  - Bảng チェーン店舗一覧: cột 店名; bấm ô 店名 → /admin/chain-systems/<chainId>/stores/<storeId>/detail.
 *  - Role 01 (manager): menu チェーンシステム情報 vào thẳng /admin/chain-system/stores, KHÔNG có nút 症状一覧DL.
 * Dò thật 2026-10-14 (toridoll-test, role 99, reports/recon-e2e-t*):
 *  - Chi tiết chain: dòng 'シサンNAVI' / 'トラブルNAVI' — ON hiện ảnh (img 'asset' / 'chatbot'). Dữ liệu tải sau (R03).
 *  - 編集 → 'チェーンシステム編集': công tắc input#switchCheckboxassetFlag (シサンNAVI), #switchCheckboxchatbotFlag (トラブルNAVI),
 *    bấm label.roundedSwitch[for=…]; '保存' disabled tới khi form tải xong.
 *  - Chi tiết store /stores/<id>/detail: dòng '限度額' ('￥20,000（継続依頼にも適用する：適用する）' hoặc trống),
 *    '承認タイプ' (chữ: 個人承認 / 階層承認（No順） / 金額承認 / 金額と階層承認 (No順); store không type thì không có dòng), '決済承認'.
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
    await waitApisIdle(this.page, 'Quay lại チェーン店舗一覧');
    return id;
  }

  // ----- E2E suite (2026-10-14) -----
  /** Chi tiết chain đã tải xong: bảng チェーン店舗一覧 có store. */
  async expectChainLoaded(): Promise<void> {
    await expect(this.content.getByText(NR(/LINKSYS STORE0000\d/)).first()).toBeVisible({ timeout: 30_000 });
  }
  /** 編集 → form 'チェーンシステム編集' đã tải (社名 có giá trị). */
  async openEdit(): Promise<void> {
    await clickables(this.content, exact('編集')).first().click();
    await expect(this.content.locator('input[placeholder="社名を入力"]')).not.toHaveValue('', { timeout: 30_000 });
  }
  toggle(flag: 'assetFlag' | 'chatbotFlag') { return this.content.locator(`#switchCheckbox${flag}`); }
  async isOn(flag: 'assetFlag' | 'chatbotFlag'): Promise<boolean> { return this.toggle(flag).isChecked(); }
  /** Bật / tắt công tắc (chưa lưu). */
  async setToggle(flag: 'assetFlag' | 'chatbotFlag', on: boolean): Promise<void> {
    if ((await this.isOn(flag)) !== on) await this.content.locator(`label[for="switchCheckbox${flag}"]`).click();
    await expect(this.toggle(flag)).toBeChecked({ checked: on });
  }
  /** 保存 → 決定 → OK của form チェーンシステム編集. */
  async saveEdit(): Promise<void> {
    await clickables(this.content, exact('保存')).first().click();
    await confirmDecide(this.page);
    await acknowledgeOk(this.page);
  }
  /** Bấm ô 店名 (tên bắt đầu bằng storeName, vd 'LINKSYS STORE00004' khớp 'LINKSYS STORE00004 (RINGI)') → chi tiết store. */
  async openStore(storeName: string): Promise<void> {
    const row = this.content.locator('tbody tr').filter({ has: this.page.locator('td', { hasText: new RegExp(`^\\s*${storeName}\\b`) }) }).first();
    await expect(row).toBeVisible({ timeout: 30_000 });
    await row.locator('td').nth(1).click();
    await expect(this.page).toHaveURL(/\/stores\/\d+\/detail/);
    await expect(valueOf(this.content, '店名')).toContainText(storeName, { timeout: 30_000 });
  }
  /** Giá trị 1 dòng ở chi tiết store. */
  storeValue(label: string) { return valueOf(this.content, label); }
  /** 限度額 (税込) dạng số; trống → null. */
  async limitAmount(): Promise<number | null> {
    const t = (await this.storeValue('限度額').innerText()).trim();
    const m = t.match(/￥\s*([\d,]+)/);
    return m ? Number(m[1].replace(/,/g, '')) : null;
  }
}
