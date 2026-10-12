import { expect } from '@playwright/test';
import path from 'path';
import { BaseScreen } from '../base.screen';
import {
  acknowledgeOk, click, clickables, confirmDecide, exact, field, fill, modal, tableRow, uploadVia,
} from '../../common/ui';
import { AssetSelectDialog } from './asset-select.dialog';

const FILES = path.resolve(__dirname, '../../data/files');

/**
 * 作業依頼登録 (wizard) — catalog: cms-frontend.md › "Trouble Create (wizard)".
 * Role 99: [新規依頼/継続依頼] → (操作モード設定) → 店舗 → 作業項目選択 → 故障詳細.
 * Snapshot thật 2026-10-12: heading "作業依頼登録", radio "新規依頼" [checked] / "継続依頼", button "次へ".
 * [cần kiểm trên app thật] từ bước 店舗 trở đi → chạy npm run recon để lấy snapshot.
 */
export class TroubleCreateScreen extends BaseScreen {
  readonly id = 'CMS-TROUBLE-CREATE';
  readonly path = '/admin/trouble/create';
  readonly roles = ['99', '98', '01', '02'] as const;

  readonly content = this.page.locator('.content-wrapper').first();
  readonly assets = new AssetSelectDialog(this.page);
  get storeSearch() { return modal(this.page, '検索条件'); }
  get staffModal() { return modal(this.page, '担当者選択'); }

  async expectStep(name: string): Promise<void> {
    await expect(this.content).toContainText(name);
  }

  /** Bước đầu của 99/98: chọn 新規依頼 → 次へ; nếu có bước 操作モード設定 thì giữ mặc định → 次へ. */
  async startNew(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: '作業依頼登録' })).toBeVisible();
    const radio = this.page.getByRole('radio', { name: '新規依頼' });
    if (await radio.isVisible().catch(() => false)) {
      await radio.check();
      await click(this.content, '次へ');
    }
    const store = this.content.getByText(/チェーン店舗?選択/).first();
    const mode = this.content.getByText('操作モード').first();
    await expect(store.or(mode)).toBeVisible();
    if (!(await store.isVisible()) && (await mode.isVisible())) await click(this.content, '次へ');
    await expect(store).toBeVisible();
  }

  // ----- 店舗 -----
  async openChainStoreSearch(): Promise<void> {
    await click(this.content, /^\s*チェーン店舗?選択\s*$/);
    await expect(this.storeSearch).toBeVisible();
  }
  /** Mở vùng 検索条件 thu gọn (bấm tiêu đề) cho tới khi thấy field probe. */
  async expandSearch(probe = '電話番号'): Promise<void> {
    const box = this.storeSearch;
    if (!(await field(box, probe).isVisible().catch(() => false))) {
      await box.getByText('検索条件', { exact: true }).first().click();
    }
    await expect(field(box, probe)).toBeVisible();
  }
  async fillSearch(label: string, value: string): Promise<void> {
    await fill(this.storeSearch, label, value);
  }
  async search(): Promise<void> {
    await click(this.storeSearch, '検索');
  }
  async pickStore(storeName: string): Promise<void> {
    const box = this.storeSearch;
    await click(tableRow(box, storeName), '選択');
    await expect(box).toBeHidden();
    await expect(this.content).toContainText(storeName);
  }

  async openStaff(): Promise<void> {
    await click(this.content, '担当者選択');
    await expect(this.staffModal).toBeVisible();
  }
  async pickFirstStaff(): Promise<void> {
    const box = this.staffModal;
    await click(box.locator('tbody tr').filter({ has: clickables(this.page, '選択') }).first(), '選択');
    await expect(box).toBeHidden();
  }

  async next(nextStep: string): Promise<void> {
    await click(this.content, '次へ');
    await this.expectStep(nextStep);
  }

  // ----- 作業項目選択 -----
  /** Card thứ index (0-based) → 選択 → modal 故障内容. */
  async openCategory(index: number): Promise<void> {
    await clickables(this.content, '選択').nth(index).click();
    await expect(modal(this.page)).toBeVisible();
  }
  async chooseCategory(item: string): Promise<void> {
    const box = modal(this.page);
    await box.getByText(exact(item)).first().click();
    await expect(box).toBeHidden();
    await expect(this.content).toContainText(item);
  }

  async tickHasAsset(): Promise<void> {
    const label = /対象資産がある場合はチェックを入れてください/;
    await this.page.getByRole('checkbox', { name: label })
      .or(this.content.locator('label').filter({ hasText: label })).first().click();
    await expect(clickables(this.content, '修理対象資産選択').first()).toBeVisible();
  }
  async openAssetSelect(): Promise<void> {
    await click(this.content, '修理対象資産選択');
    await this.assets.expectOpen();
  }

  // ----- 故障詳細 -----
  async uploadFaultImage(index: number, file: string): Promise<void> {
    await uploadVia(this.page, clickables(this.content, '写真を選択').nth(index), path.join(FILES, file));
  }
  async fillFaultDetail(text: string): Promise<void> {
    const f = field(this.content, '故障詳細記入欄').or(this.content.locator('textarea').first()).first();
    await f.fill(text);
    await expect(f).toHaveValue(text);
  }

  /**
   * 希望日時: chọn option (vd 明日以降) rồi nhập giờ 開始 / 終了.
   * [cần kiểm trên app thật] option là radio hay button; 開始/終了 là select hay input.
   */
  async chooseExpectedDate(option: string, startTime: string, endTime: string): Promise<void> {
    await this.page.getByRole('radio', { name: option }).or(this.content.getByText(option, { exact: true })).first().click();
    for (const [label, value] of [['開始', startTime], ['終了', endTime]] as const) {
      const f = field(this.content, label);
      if (!(await f.isVisible().catch(() => false))) continue;
      const tag = await f.evaluate((e) => e.tagName.toLowerCase());
      if (tag === 'select') {
        const hour = String(Number(value.split(':')[0]));
        const opts = await f.locator('option').allInnerTexts();
        const hit = opts.find((o) => o.trim() === value || o.trim().startsWith(value) || o.trim() === hour || o.trim() === hour.padStart(2, '0'));
        if (hit) await f.selectOption({ label: hit });
      } else {
        await f.fill(value);
      }
    }
  }

  async clickSubmit(): Promise<void> {
    await click(this.content, /^\s*決定して問い?合わせ(る)?\s*$/);
  }

  /**
   * 決定 trong hộp xác nhận → OK. Trả về id / 依頼番号 của trouble vừa tạo (lấy từ response POST /troubles).
   * Gọi sau clickSubmit().
   */
  async confirmSubmit(): Promise<{ id?: string; number?: string }> {
    const created = this.page.waitForResponse(
      (r) => r.request().method() === 'POST' && /\/troubles(\?|$)/.test(new URL(r.url()).pathname + '?'),
      { timeout: 60_000 },
    ).catch(() => null);
    await confirmDecide(this.page, 'この新規依頼を保存します');
    const res = await created;
    await acknowledgeOk(this.page, '保存が完了しました');
    let id: string | undefined;
    let number: string | undefined;
    try {
      const body = await res?.json();
      const d = body?.data ?? body;
      id = d?.id != null ? String(d.id) : undefined;
      number = d?.number != null ? String(d.number) : undefined;
    } catch { /* response không phải JSON */ }
    return { id, number };
  }
}
