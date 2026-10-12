import { expect, type Page } from '@playwright/test';
import path from 'path';
import {
  acknowledgeOk, click, clickable, clickables, confirmDecide, field, fill, modal, today, uploadVia,
} from '../../common/ui';

const FILES = path.resolve(__dirname, '../../data/files');

/**
 * Hộp chọn tài sản (修理対象資産選択 → 検索条件) và hộp 資産登録.
 * Dùng ở 作業依頼登録 (bước 作業項目選択) và 報告書.
 * [cần kiểm trên app thật] cấu trúc bảng, nút 現在 của date picker.
 */
export class AssetSelectDialog {
  constructor(private readonly page: Page) {}

  get box() { return modal(this.page, '新しい機器を登録する'); }

  async expectOpen(): Promise<void> {
    await expect(this.box).toBeVisible();
    await expect(clickable(this.box, '決定する')).toBeVisible();
  }

  /** Chọn tối đa n dòng có tên name (bỏ qua nếu 該当データが0件でした). Trả về số dòng đã chọn. */
  async selectRows(name: string, n: number): Promise<number> {
    if (await this.box.getByText('該当データが0件でした').isVisible().catch(() => false)) return 0;
    const rows = this.box.locator('tbody tr').filter({ hasText: name });
    const count = Math.min(n, await rows.count());
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      await click(row, '選択');
      await expect(clickable(row, '削除')).toBeVisible();
    }
    return count;
  }

  /** 新しい機器を登録する → nhập 資産登録 → 保存 → 決定 → OK. */
  async registerAsset(a: { name: string; model?: string; serial?: string; note?: string; images: string[]; withDates?: boolean }): Promise<void> {
    await click(this.box, '新しい機器を登録する');
    const reg = modal(this.page, '資産登録');
    await expect(reg).toBeVisible();
    for (let i = 0; i < a.images.length; i++) {
      await uploadVia(this.page, clickables(reg, '写真を選択').nth(i), path.join(FILES, a.images[i]));
    }
    await fill(reg, '名称', a.name);
    if (a.model) await fill(reg, '型式', a.model);
    if (a.serial) await fill(reg, '製造番号', a.serial);
    if (a.withDates) {
      for (const [label, fmt] of [['設置・納入日', 'ymd'], ['製造年月', 'ym']] as const) {
        const f = field(reg, label);
        await f.click();
        await clickable(this.page, '現在').click();
        await expect(f).toHaveValue(new RegExp(today(fmt).replace(/\//g, '\\/')));
      }
    }
    if (a.note) await fill(reg, '補足説明', a.note);
    await click(reg, '保存');
    await confirmDecide(this.page, '資産情報を保存します');
    await acknowledgeOk(this.page, '資産情報の保存が完了しました');
  }

  async decide(): Promise<void> {
    const box = this.box;
    await click(box, '決定する');
    await expect(box).toBeHidden();
  }
}
