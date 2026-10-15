import { expect } from '@playwright/test';
import path from 'path';
import { BaseScreen } from '../base.screen';
import {
  acknowledgeOk, click, clickable, clickables, confirmDecide, exact, field, fill, modal, tableRow, uploadVia,
} from '../../common/ui';
import { AssetSelectDialog } from './asset-select.dialog';

const FILES = path.resolve(__dirname, '../../data/files');

/**
 * 作業依頼登録 (wizard) — catalog: cms-frontend.md › "Trouble Create (wizard)".
 * Role 99: [新規依頼/継続依頼] → (操作モード設定) → 店舗 → 作業項目選択 → 故障詳細.
 * Snapshot thật 2026-10-12: heading "作業依頼登録", radio "新規依頼" [checked] / "継続依頼", button "次へ".
 * Đã xác minh: E2E 13/13 pass (reports/20261012-112231-dev, 20261012-112608-dev).
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

  /**
   * Bước đầu với chọn rõ ràng (dò thật 2026-10-13): radio label.btn '新規依頼' / '継続依頼' → 次へ →
   * 'Step 1 操作モード設定': label.btn '操作可能モード（ロックなし）' / '操作可能モード（ロック）' → 次へ.
   */
  async start(type: '新規依頼' | '継続依頼', mode = '操作可能モード（ロックなし）'): Promise<void> {
    await expect(this.page.getByRole('heading', { name: '作業依頼登録' })).toBeVisible();
    await this.content.locator('label.btn', { hasText: exact(type) }).click();
    await click(this.content, '次へ');
    // Role 99: có bước '操作モード設定'. Role 98 (dò thật 2026-10-14, toridoll-test): 継続依頼 vào thẳng 'Step 1 作業依頼設定' (nút 作業依頼選択).
    const modeStep = this.content.getByText('操作モード設定').first();
    const next = type === '継続依頼' ? clickable(this.content, '作業依頼選択') : this.content.getByText(/チェーン店舗?選択/).first();
    await expect(modeStep.or(next)).toBeVisible({ timeout: 15_000 });
    if (await modeStep.isVisible()) {
      await this.content.locator('label.btn', { hasText: exact(mode) }).click();
      await click(this.content, '次へ');
    }
    await expect(next).toBeVisible({ timeout: 15_000 });
  }
  /** 継続依頼: 作業依頼選択 → hộp 検索条件 (input[name=number]) → 選択 dòng có 依頼番号. */
  async pickContinuationSource(number: string): Promise<void> {
    await click(this.content, '作業依頼選択');
    const box = modal(this.page, '検索条件');
    await expect(box).toBeVisible();
    const num = box.locator('input[name="number"]');
    if (!(await num.isVisible().catch(() => false))) await box.locator('h4', { hasText: '検索条件' }).first().click();
    await num.fill(number);
    await click(box, '検索');
    const row = box.locator('tbody tr').filter({ has: this.page.locator('td', { hasText: exact(number) }) }).first(); // R20
    await expect(row).toBeVisible({ timeout: 15_000 });
    await click(row, '選択');
    await expect(box).toBeHidden();
  }
  /** 決定して問合わせ → 決定 (この継続依頼を保存します) → OK. */
  async submitContinuation(): Promise<void> {
    await this.clickSubmit();
    await confirmDecide(this.page, 'この継続依頼を保存します');
    await acknowledgeOk(this.page, '作業依頼の保存が完了しました');
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
  private lastCategory = 0;
  async openCategory(index: number): Promise<void> {
    this.lastCategory = index;
    await clickables(this.content, '選択').nth(index).click();
    await expect(modal(this.page)).toBeVisible();
  }
  /**
   * Run 2026-10-12: bấm chữ 'つまり：大便器（テスト）' nhưng app nhận 'ウォシュレット不具合（テスト）'.
   * Nguyên nhân: ảnh trong danh sách thẻ tải muộn → layout xô lệch giữa lúc Playwright tính toạ độ và lúc click.
   * Fix: chờ ảnh tải xong, click bằng dispatchEvent (không theo toạ độ), kiểm giá trị đã chọn; sai thì mở lại thẻ và chọn lại (tối đa 3 lần).
   */
  async chooseCategory(item: string): Promise<void> {
    for (let attempt = 1; ; attempt++) {
      const box = modal(this.page);
      const target = box.getByText(exact(item)).first();
      // Danh sách thẻ có lúc quay spinner > 5s dù API largecategories đã 200 (dev + est-test 2026-10-13) → chờ thực tế tới 30s, không reload (D24).
      await expect(target).toBeVisible({ timeout: 30_000 });
      await box.evaluate(async (el) => {
        const imgs = Array.from(el.querySelectorAll('img'));
        await Promise.all(imgs.map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
      });
      await target.dispatchEvent('click');
      await expect(box).toBeHidden();
      const ok = await expect(this.content).toContainText(item, { timeout: 5_000 }).then(() => true, () => false);
      if (ok) return;
      if (attempt >= 3) await expect(this.content).toContainText(item); // ném lỗi rõ ràng
      await this.openCategory(this.lastCategory);
    }
  }

  /**
   * Thẻ 故障内容 → bấm category có webview トラブルNAVI (vd '水'): modal đóng, content chỉ còn iframe .trouble-navi (dò thật 2026-10-14,
   * toridoll-test). Category không có webview (vd '操作テスト') dùng chooseCategory.
   */
  async openTroubleNavi(category: string): Promise<void> {
    await this.openCategory(0);
    const box = modal(this.page);
    const target = box.getByText(exact(category)).first();
    await expect(target).toBeVisible({ timeout: 30_000 });
    await target.dispatchEvent('click');
    await expect(this.content.locator('.trouble-navi iframe')).toBeVisible({ timeout: 30_000 });
  }
  /** Step 1 khi store đăng nhập: card 店舗選択 đã có sẵn store của tài khoản. */
  async expectOwnStore(storeName: string): Promise<void> {
    await expect(this.content).toContainText(storeName, { timeout: 30_000 });
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
    const f = this.content.locator('textarea[name="description"]');
    await f.fill(text);
    await expect(f).toHaveValue(text);
  }

  /**
   * 訪問希望日時 (browser thật 2026-10-12, store tự động matching): nút 至急 / 本日中 / 明日以降;
   * 明日以降 → radio 希望時間指定 (mặc định) / 希望日付＆希望時間指定 + 4 ô text: hour, minute (開始) rồi hour, minute (終了).
   */
  async chooseExpectedDate(option: string, startTime: string, endTime: string): Promise<void> {
    await click(this.content, option);
    const hours = this.content.locator('input[name="hour"]');
    const minutes = this.content.locator('input[name="minute"]');
    await expect(hours).toHaveCount(2);
    const [sh, sm] = startTime.split(':');
    const [eh, em] = endTime.split(':');
    await hours.nth(0).fill(sh); await minutes.nth(0).fill(sm);
    await hours.nth(1).fill(eh); await minutes.nth(1).fill(em);
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
