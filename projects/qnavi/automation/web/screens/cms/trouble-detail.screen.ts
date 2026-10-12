import { expect, type Locator } from '@playwright/test';
import path from 'path';
import { BaseScreen } from '../base.screen';
import {
  acknowledgeOk, choose, click, clickable, clickables, closeModal, confirmDecide, expectRow, field, fill, modal,
  rowOf, saveDecideOk, tableRow, uploadVia, valueOf,
} from '../../common/ui';
import { AssetSelectDialog } from './asset-select.dialog';

const FILES = path.resolve(__dirname, '../../data/files');

/**
 * 作業依頼詳細 — catalog: cms-frontend.md › "Trouble Detail: /admin/troubles/:id/detail" + "Trouble modals".
 * クイック操作 (99/98/05) mở modal 状態変更. Nút header: 履歴, 立候補, 見積もり, 報告書, 作業完了確認…
 * Recon 2026-10-12: header = <p>店舗名:</p>, <p>業者:</p>…; nút có icon (' 編集', ' クイック操作'); bảng chi tiết <td>label</td><td>value</td>;
 *   modal 状態変更 = dialog có heading '状態変更', nút '閉じる', select ở dòng '状態', nút 'キャンセル' / '保存'.
 * [cần kiểm trên app thật] icon edit trong 状態変更, menu メニュー展開▼, date picker của 報告書 → npm run recon.
 */
export class TroubleDetailScreen extends BaseScreen {
  readonly id = 'CMS-TROUBLE-DETAIL';
  readonly path = '/admin/troubles';
  readonly roles = ['99', '98', '01', '02', '05'] as const;

  readonly content = this.page.locator('.content-wrapper').first();
  readonly assets = new AssetSelectDialog(this.page);

  /** Đã vào màn chi tiết VÀ dữ liệu đã tải (ô 番号 có số; trước đó các ô trống, クイック操作 bị disable). */
  async expectOpened(id?: string): Promise<void> {
    await expect(this.page).toHaveURL(id ? new RegExp(`/admin/troubles/${id}/detail`) : /\/admin\/troubles\/\d+\/detail/);
    await expect(valueOf(this.content, '番号')).toHaveText(/\d+/, { timeout: 20_000 });
  }
  /** 番号 (= 依頼番号 trong danh sách) đang hiển thị. */
  async number(): Promise<string | undefined> {
    return (await valueOf(this.content, '番号').innerText()).match(/\d+/)?.[0];
  }
  /** Badge trạng thái: vd ('対応中', '受注'). */
  async expectBadges(...badges: string[]): Promise<void> {
    for (const b of badges) await expect(this.content.getByText(b, { exact: true }).first()).toBeVisible();
  }
  async expectInfo(label: string, value: string | RegExp): Promise<void> {
    await expectRow(this.content, label, value);
  }
  async headerButton(name: string): Promise<void> {
    await click(this.content, name);
  }

  // ---------- 状態変更 ----------
  get statusModal(): Locator { return modal(this.page, '状態変更'); }

  async openQuickAction(): Promise<Locator> {
    await click(this.content, 'クイック操作');
    await expect(this.statusModal).toBeVisible();
    return this.statusModal;
  }
  /** Icon edit trên dòng label trong modal 状態変更 (作業者, 見積もり, 報告書). */
  async editRow(label: string): Promise<void> {
    // Recon 2026-10-12: nhãn '作業者 必須' / '見積もり 必須' / '報告書 任意'; icon sửa () là phần tử cuối của ô giá trị.
    await valueOf(this.statusModal, label).locator('i, svg, [class*="fa-"], button').filter({ visible: true }).last().click();
  }
  async setStatus(value: string): Promise<void> {
    await choose(this.page, this.statusModal, '状態', value);
  }
  async setFlow(value: string): Promise<void> {
    await choose(this.page, this.statusModal, '対応中の状態（新規）', value);
  }
  /** Giá trị ĐANG CHỌN của dropdown 対応中の状態（新規） (dòng chứa cả danh sách option nên không kiểm theo text dòng). */
  async expectFlow(value: string): Promise<void> {
    await expect(field(this.statusModal, '対応中の状態（新規）').locator('option:checked')).toHaveText(value);
  }
  async expectStatus(value: string): Promise<void> {
    await expect(field(this.statusModal, '状態').locator('option:checked')).toHaveText(value);
  }
  async saveStatus(): Promise<void> {
    await saveDecideOk(this.page, this.statusModal);
    await expect(this.statusModal).toBeHidden();
  }
  async closeStatus(): Promise<void> {
    await closeModal(this.statusModal);
  }

  // ----- 作業者 (検索条件) -----
  get searchModal(): Locator { return modal(this.page, '検索条件'); }
  async expandSearch(): Promise<void> {
    const box = this.searchModal;
    if (!(await field(box, '電話番号').isVisible().catch(() => false))) await box.getByText('検索条件', { exact: true }).first().click();
    await expect(field(box, '電話番号')).toBeVisible();
  }
  async searchWorker(company: string): Promise<void> {
    await fill(this.searchModal, '社名', company);
    await click(this.searchModal, '検索');
  }
  async pickWorker(loginId: string): Promise<void> {
    await click(tableRow(this.searchModal, loginId), '選択');
    await expect(this.searchModal).toBeHidden();
  }

  // ---------- 見積もり ----------
  get estimateModal(): Locator { return modal(this.page, '見積一覧'); }
  get itemModal(): Locator { return modal(this.page, '作業項目追加'); }
  estimateRow(name: string): Locator { return tableRow(this.estimateModal, name); }

  async openEstimateFromStatus(): Promise<void> {
    await this.editRow('見積もり');
    await expect(this.estimateModal).toBeVisible();
  }
  async startNewEstimate(): Promise<void> {
    await click(this.estimateModal, '登録');
    for (const f of ['見積名', '見積書宛名', '見積有効期限']) await expect(this.estimateModal).toContainText(f);
  }
  async openAddItem(): Promise<void> {
    await click(this.estimateModal, '追加');
    await expect(this.itemModal).toBeVisible();
  }
  async fillUnitPrice(value: string, shown: string): Promise<void> {
    const price = field(this.itemModal, '単価');
    await price.fill(value);
    await price.blur();
    await expect(price).toHaveValue(new RegExp(`^(${value}|${shown})$`));
  }
  async decideItem(itemName: string): Promise<void> {
    await click(this.itemModal, '決定');
    await expect(this.itemModal).toBeHidden();
    await expect(this.estimateModal).toContainText(itemName);
  }
  async decideEstimate(name: string): Promise<void> {
    await clickables(this.estimateModal, '決定').first().click();
    await expect(this.estimateRow(name)).toBeVisible();
  }
  /** Tick dòng → 提示する → 決定 → trạng thái 承認待ち. */
  async submitEstimate(name: string): Promise<void> {
    await this.estimateRow(name).locator('input[type="checkbox"]').first().check();
    await click(this.estimateModal, '提示する');
    const d = modal(this.page, '以下1件の見積を店舗へ提出しますか');
    await expect(d).toContainText(name);
    await click(d, '決定');
    await expect(this.estimateRow(name)).toContainText('承認待ち');
  }
  async openEstimateMenu(name: string): Promise<void> {
    // Recon 2026-10-12: 'メニュー展開 ▼' là ô (không phải button).
    await this.estimateRow(name).getByText(/メニュー展開/).first().click();
  }
  async closeEstimateModal(): Promise<void> {
    await click(this.estimateModal, '閉じる');
    await expect(this.estimateModal).toBeHidden();
  }

  // ---------- 報告書 ----------
  get reportModal(): Locator { return modal(this.page, '報告書'); }

  /** Chọn ngày (1, 2…) của tháng hiện tại trong date picker rồi 閉じる. [cần kiểm trên app thật] */
  async pickDay(label: string, day: number): Promise<void> {
    // react-datepicker (recon 2026-10-12): option "Choose 2026年10月1日木曜日", nhóm nút 現在 / クリア / 閉じる.
    await valueOf(this.reportModal, label).locator('input').filter({ visible: true }).first().click();
    await this.page.getByRole('option', { name: new RegExp(`^Choose \\d+年\\d+月${day}日`) }).filter({ visible: true }).first().click();
    const close = this.page.getByRole('group').getByRole('button', { name: '閉じる', exact: true }).filter({ visible: true }).first();
    if (await close.isVisible().catch(() => false)) await close.click();
  }
  async uploadReportPhoto(label: string, file: string): Promise<void> {
    await uploadVia(this.page, clickables(rowOf(this.reportModal, label), '写真を選択').first(), path.join(FILES, file));
    await expect(rowOf(this.reportModal, label).locator('img').first()).toBeVisible();
  }
  async downloadFrom(button: string): Promise<string> {
    const dl = this.page.waitForEvent('download');
    await click(this.reportModal, button);
    return (await dl).suggestedFilename();
  }

  // ---------- chung ----------
  async ok(text?: string | RegExp) { await acknowledgeOk(this.page, text); }
  async decide(text?: string | RegExp) { await confirmDecide(this.page, text); }
}
