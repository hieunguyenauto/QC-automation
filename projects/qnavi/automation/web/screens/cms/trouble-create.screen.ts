import { expect } from '@playwright/test';
import path from 'path';
import { BaseScreen } from '../base.screen';
import {
  acknowledgeOk, click, clickable, clickables, confirmDecide, exact, field, fill, modal, modalWithButton, tableRow, uploadVia,
} from '../../common/ui';
import { AssetSelectDialog } from './asset-select.dialog';

const FILES = path.resolve(__dirname, '../../data/files');

/**
 * 作業依頼登録 (wizard) — catalog: cms-frontend.md › "Trouble Create (wizard)".
 * Role 99: 店舗 → 作業項目選択 → 故障詳細 (có thể có thêm 操作モード設定).
 * [cần kiểm trên app thật] tên nút チェーン店(舗)選択, cách mở vùng 検索条件, card 作業項目.
 */
export class TroubleCreateScreen extends BaseScreen {
  readonly id = 'CMS-TROUBLE-CREATE';
  readonly path = '/admin/trouble/create';
  readonly roles = ['99', '98', '01', '02'] as const;

  readonly content = this.page.locator('.content-wrapper').first();
  readonly assets = new AssetSelectDialog(this.page);

  async expectStep(name: string): Promise<void> {
    await expect(this.content).toContainText(name);
  }

  /** Mở vùng 検索条件 thu gọn trong modal (bấm vào tiêu đề). */
  async expandSearch(box = modal(this.page, '検索条件')): Promise<void> {
    const header = box.getByText('検索条件', { exact: true }).first();
    const probe = field(box, '電話番号');
    if (!(await probe.isVisible().catch(() => false))) await header.click();
  }

  async selectChainStore(company: string, store: string, storeName: string, chainName: string): Promise<void> {
    await click(this.content, /^\s*チェーン店舗?選択\s*$/);
    const box = modal(this.page, '検索条件');
    await expect(box).toBeVisible();
    await this.expandSearch(box);
    for (const f of ['社名', '店名', '電話番号', '表示件数']) await expect(box).toContainText(f);
    await fill(box, '社名', company);
    await fill(box, '店名', store);
    await click(box, '検索');
    await expect(box).toContainText(chainName);
    const row = tableRow(box, storeName);
    await expect(row).toBeVisible();
    await click(row, '選択');
    await expect(box).toBeHidden();
    await expect(this.content).toContainText(storeName);
  }

  async selectFirstStaff(): Promise<void> {
    await click(this.content, '担当者選択');
    const box = modal(this.page, '担当者選択');
    await expect(box).toBeVisible();
    const first = box.locator('tbody tr').filter({ has: clickables(box, '選択') }).first();
    await click(first, '選択');
    await expect(box).toBeHidden();
  }

  async next(nextStep: string): Promise<void> {
    await click(this.content, '次へ');
    await this.expectStep(nextStep);
  }

  /** Card thứ index (0-based) của 作業項目 → 選択 → chọn item trong modal 故障内容. */
  async pickCategory(index: number, item: string): Promise<void> {
    await clickables(this.content, '選択').nth(index).click();
    const box = modal(this.page, '故障内容').or(modal(this.page));
    await expect(box.first()).toBeVisible();
    await box.first().getByText(exact(item)).first().click();
    await expect(this.content).toContainText(item);
  }

  async tickHasAsset(): Promise<void> {
    const label = /対象資産がある場合はチェックを入れてください/;
    const cb = this.page.getByLabel(label).or(this.content.locator('label').filter({ hasText: label })).first();
    await cb.click();
    await expect(clickable(this.content, '修理対象資産選択')).toBeVisible();
  }

  async openAssetSelect(): Promise<void> {
    await click(this.content, '修理対象資産選択');
    await this.assets.expectOpen();
  }

  async uploadFaultImages(file: string, count: number): Promise<void> {
    for (let i = 0; i < count; i++) {
      await uploadVia(this.page, clickables(this.content, '写真を選択').nth(i), path.join(FILES, file));
    }
  }

  async fillFaultDetail(text: string): Promise<void> {
    const f = field(this.content, '故障詳細記入欄').or(this.content.locator('textarea').first()).first();
    await f.fill(text);
    await expect(f).toHaveValue(text);
  }

  /** 決定して問い合わせる → 決定; lỗi ngày giờ thì chọn 明日以降 / 開始 4 giờ rồi gửi lại. */
  async submit(): Promise<void> {
    await click(this.content, /^\s*決定して問い?合わせ(る)?\s*$/);
    await confirmDecide(this.page, 'この新規依頼を保存します');
    const ok = modalWithButton(this.page, 'OK');
    await expect(ok).toBeVisible({ timeout: 30_000 });
    if (!(await ok.innerText()).includes('保存が完了しました')) {
      // Lỗi ngày giờ → đóng, chọn lại thời gian rồi gửi lại
      await click(ok, 'OK');
      await this.content.getByText('明日以降', { exact: false }).first().click();
      const start = field(this.content, '開始');
      if (await start.isVisible().catch(() => false)) {
        const tag = await start.evaluate((e) => e.tagName.toLowerCase());
        if (tag === 'select') await start.selectOption({ index: 4 });
        else await start.fill('04:00');
      }
      await click(this.content, /^\s*決定して問い?合わせ(る)?\s*$/);
      await confirmDecide(this.page, 'この新規依頼を保存します');
    }
    await acknowledgeOk(this.page, '保存が完了しました');
  }
}
