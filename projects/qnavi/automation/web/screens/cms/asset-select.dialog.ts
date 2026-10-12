import { expect, type Page } from '@playwright/test';
import path from 'path';
import {
  acknowledgeOk, click, clickable, clickables, confirmDecide, field, fill, modal, today, uploadVia,
} from '../../common/ui';

const FILES = path.resolve(__dirname, '../../data/files');

/**
 * Hộp chọn tài sản (修理対象資産選択 → 検索条件) và hộp 資産登録.
 * Dùng ở 作業依頼登録 (bước 作業項目選択) và 報告書.
 * Đã xác minh: E2E 13/13 pass (reports/20261012-112231-dev, 20261012-112608-dev).
 */
export class AssetSelectDialog {
  constructor(private readonly page: Page) {}

  get box() { return modal(this.page, '新しい機器を登録する'); }
  get register() { return modal(this.page, '資産登録'); }

  async expectOpen(): Promise<void> {
    await expect(this.box).toBeVisible();
    await expect(clickable(this.box, '新しい機器を登録する')).toBeVisible();
    await expect(clickable(this.box, '決定する')).toBeVisible();
  }

  /** Chọn tối đa n dòng có tên name (bỏ qua nếu 該当データが0件でした). Trả về số dòng đã chọn. */
  async selectRows(name: string, n: number): Promise<number> {
    // Danh sách tải sau (recon 2026-10-12: lúc đầu hiện '0件'). Chờ '全 N 件中' có số; quá 10s mới coi là 0 件.
    const loaded = await this.box.getByText(/全\s*\d+\s*件中/).first().waitFor({ timeout: 10_000 }).then(() => true).catch(() => false);
    if (!loaded || (await this.box.getByText('該当データが0件でした').isVisible().catch(() => false))) return 0;
    const named = this.box.locator('tbody tr').filter({ hasText: name });
    const selectable = named.filter({ has: clickables(this.page, '選択') });
    const selected = named.filter({ has: clickables(this.page, '削除') });
    const count = Math.min(n, await selectable.count());
    for (let i = 0; i < count; i++) {
      const before = await selected.count();
      await click(selectable.first(), '選択'); // dòng đã chọn đổi nút → luôn lấy dòng đầu còn 選択
      await expect(selected).toHaveCount(before + 1);
    }
    return count;
  }

  async openRegister(): Promise<void> {
    await click(this.box, '新しい機器を登録する');
    await expect(this.register).toBeVisible();
  }
  /** Upload ảnh vào card thứ index (0-based) của 資産登録. */
  async uploadImage(index: number, file: string): Promise<void> {
    await uploadVia(this.page, clickables(this.register, '写真を選択').nth(index), path.join(FILES, file));
  }
  async fillField(label: string, value: string): Promise<void> {
    await fill(this.register, label, value);
  }
  /** Bấm ô ngày → nút 現在 → kiểm giá trị là hôm nay. */
  async setNow(label: string, fmt: 'ymd' | 'ym'): Promise<void> {
    const f = field(this.register, label);
    await f.click();
    await clickable(this.page, '現在').click();
    await expect(f).toHaveValue(new RegExp(today(fmt).replace(/\//g, '\\/')));
  }
  /** 保存 → 決定 → OK. */
  async save(): Promise<void> {
    await click(this.register, '保存');
    await confirmDecide(this.page, '資産情報を保存します');
    await acknowledgeOk(this.page, '資産情報の保存が完了しました');
    await expect(this.box).toBeVisible();
  }

  async decide(): Promise<void> {
    const box = this.box;
    await click(box, '決定する');
    await expect(box).toBeHidden();
  }
}
