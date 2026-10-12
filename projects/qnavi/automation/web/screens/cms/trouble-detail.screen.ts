import { expect, type Locator } from '@playwright/test';
import path from 'path';
import { BaseScreen } from '../base.screen';
import {
  acknowledgeOk, choose, click, clickable, clickables, closeModal, confirmDecide, expectRow, field, fill, modal,
  rowOf, saveDecideOk, tableRow, uploadVia,
} from '../../common/ui';
import { AssetSelectDialog } from './asset-select.dialog';

const FILES = path.resolve(__dirname, '../../data/files');

/**
 * 作業依頼詳細 — catalog: cms-frontend.md › "Trouble Detail: /admin/troubles/:id/detail" + "Trouble modals".
 * クイック操作 (99/98/05) mở modal 状態変更. Nút header: 履歴, 立候補, 見積もり, 報告書, 作業完了確認…
 * [cần kiểm trên app thật] icon edit trong 状態変更, menu メニュー展開▼, date picker của 報告書.
 */
export class TroubleDetailScreen extends BaseScreen {
  readonly id = 'CMS-TROUBLE-DETAIL';
  readonly path = '/admin/troubles';
  readonly roles = ['99', '98', '01', '02', '05'] as const;

  readonly content = this.page.locator('.content-wrapper').first();
  readonly assets = new AssetSelectDialog(this.page);

  async expectOpened(): Promise<void> {
    await expect(this.page).toHaveURL(/\/admin\/troubles\/\d+\/detail/);
  }

  /** Badge trạng thái: vd ('対応中', '受注'). */
  async expectBadges(...badges: string[]): Promise<void> {
    for (const b of badges) await expect(this.content.getByText(b, { exact: true }).first()).toBeVisible();
  }
  async expectInfo(label: string, value: string | RegExp): Promise<void> {
    await expectRow(this.content, label, value);
  }

  // ---------- 状態変更 ----------
  get statusModal(): Locator { return modal(this.page, '状態変更'); }

  async openQuickAction(): Promise<Locator> {
    await click(this.content, 'クイック操作');
    const m = this.statusModal;
    await expect(m).toBeVisible();
    return m;
  }
  /** Icon edit trên dòng label trong modal 状態変更 (作業者, 見積もり, 報告書). */
  async editRow(label: string): Promise<void> {
    const row = rowOf(this.statusModal, label);
    await row.locator('button, a, [role="button"], i[class*="edit"], i[class*="pen"], svg').filter({ visible: true }).last().click();
  }
  async setStatus(value: string): Promise<void> {
    await choose(this.page, this.statusModal, '状態', value);
  }
  async setFlow(value: string): Promise<void> {
    await choose(this.page, this.statusModal, '対応中の状態（新規）', value);
  }
  async saveStatus(): Promise<void> {
    await saveDecideOk(this.page, this.statusModal);
  }
  /** クイック操作 → chọn 対応中の状態（新規）→ 保存 → 決定 → OK. */
  async changeFlow(value: string, expectCurrent?: string): Promise<void> {
    const m = await this.openQuickAction();
    if (expectCurrent) await expect(m).toContainText(expectCurrent);
    await this.setFlow(value);
    await this.saveStatus();
    await this.expectBadges('対応中', value);
  }

  async assignWorker(company: string, loginId: string, workerName: string): Promise<void> {
    await this.editRow('作業者');
    const box = modal(this.page, '検索条件');
    await expect(box).toBeVisible();
    if (!(await box.getByText('電話番号').isVisible().catch(() => false))) await box.getByText('検索条件', { exact: true }).first().click();
    for (const f of ['電話番号', '対応可能な作業項目（大）', '表示件数']) await expect(box).toContainText(f);
    await fill(box, '社名', company);
    await click(box, '検索');
    await expect(box.locator('tbody tr').first()).toContainText(new RegExp(company, 'i'));
    await click(tableRow(box, loginId), '選択');
    await expect(this.statusModal).toContainText(workerName);
  }

  // ---------- 見積もり ----------
  get estimateModal(): Locator { return modal(this.page, '見積一覧'); }
  estimateRow(name: string): Locator { return tableRow(this.estimateModal, name); }

  async createAndSubmitEstimate(e: { name: string; itemName: string; unitPrice: string; unitPriceShown: string }): Promise<void> {
    await this.editRow('見積もり');
    const box = this.estimateModal;
    await expect(box).toBeVisible();
    await click(box, '登録');
    for (const f of ['見積名', '見積書宛名', '見積有効期限']) await expect(box).toContainText(f);
    await fill(box, '見積名', e.name);
    await click(box, '追加');
    const add = modal(this.page, '作業項目追加');
    await expect(add).toBeVisible();
    for (const t of ['作業', '部材', '諸経費']) await expect(clickable(add, t)).toBeVisible();
    await click(add, '作業');
    await fill(add, '作業項目', e.itemName);
    const price = field(add, '単価');
    await price.fill(e.unitPrice);
    await price.blur();
    await expect(price).toHaveValue(new RegExp(`^(${e.unitPrice}|${e.unitPriceShown})$`));
    await click(add, '決定');
    await expect(add).toBeHidden();
    await expect(box).toContainText(e.itemName);
    await clickables(box, '決定').first().click();
    await expect(this.estimateRow(e.name)).toBeVisible();
    await this.submitEstimate(e.name);
  }

  async submitEstimate(name: string): Promise<void> {
    const row = this.estimateRow(name);
    await row.locator('input[type="checkbox"]').first().check();
    await click(this.estimateModal, '提示する');
    const d = modal(this.page, '以下1件の見積を店舗へ提出しますか');
    await expect(d).toContainText(name);
    await click(d, '決定');
    await expect(this.estimateRow(name)).toContainText('承認待ち');
  }

  async openEstimateMenu(name: string): Promise<void> {
    await click(this.estimateRow(name), /メニュー展開/);
  }
  async closeEstimateModal(): Promise<void> {
    await click(this.estimateModal, '閉じる');
  }

  // ---------- 報告書 ----------
  get reportModal(): Locator { return modal(this.page, '報告書'); }

  /** Chọn ngày (1, 2…) của tháng hiện tại trong date picker đang mở rồi 閉じる. [cần kiểm trên app thật] */
  async pickDay(label: string, day: number): Promise<void> {
    await rowOf(this.reportModal, label).locator('input, button').filter({ visible: true }).first().click();
    const picker = this.page.locator('.react-datepicker, .rdtPicker, .datepicker, .flatpickr-calendar, [class*="picker"]').filter({ visible: true }).last();
    await picker.locator('td, div[role="option"], button, span').filter({ hasText: new RegExp(`^\\s*${day}\\s*$`) })
      .filter({ visible: true }).first().click();
    const close = clickable(this.page, '閉じる');
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
  async headerButton(name: string): Promise<void> {
    await click(this.content, name);
  }
  async ok(text?: string | RegExp) { await acknowledgeOk(this.page, text); }
  async decide(text?: string | RegExp) { await confirmDecide(this.page, text); }
  async close(box: Locator) { await closeModal(box); }
}

