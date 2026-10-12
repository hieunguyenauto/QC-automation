import { expect } from '@playwright/test';
import { BaseScreen } from '../base.screen';
import { acknowledgeOk, click, clickable, modal, modalWithButton, rowOf } from '../../common/ui';

/**
 * 作業依頼編集 — catalog: cms-frontend.md › "Trouble Edit: /admin/troubles/:id/edit".
 * "変更" trên dòng 作業項目（大）mở 店舗・担当者編集 (StoreStaffCategoryEditModal, role 99).
 * [cần kiểm trên app thật] dropdown 対応区分 là <select> hay dropdown tự vẽ.
 */
export class TroubleEditScreen extends BaseScreen {
  readonly id = 'CMS-TROUBLE-EDIT';
  readonly path = '/admin/troubles';
  readonly roles = ['99', '98', '01', '02', '05'] as const;

  readonly content = this.page.locator('.content-wrapper').first();

  async expectOpened(): Promise<void> {
    await expect(this.page).toHaveURL(/\/edit/);
    await expect(this.content).toContainText('作業依頼編集');
  }

  /** 変更 ở dòng 作業項目（大）→ chọn ngẫu nhiên 対応区分 cho mọi tài sản → 保存 → OK. */
  async randomizeAssetResponseType(): Promise<void> {
    await click(rowOf(this.content, '作業項目（大）'), '変更');
    const box = modal(this.page, '店舗・担当者編集');
    await expect(box).toBeVisible();
    await expect(box).toContainText('対応区分');
    const selects = box.locator('select').filter({ visible: true });
    const n = await selects.count();
    for (let i = 0; i < n; i++) {
      const sel = selects.nth(i);
      const values = (await sel.locator('option').evaluateAll((os) => os.map((o) => (o as HTMLOptionElement).value)))
        .filter((v) => v !== '');
      if (values.length) await sel.selectOption(values[Math.floor(Math.random() * values.length)]);
    }
    await click(box, '保存');
    const confirm = modalWithButton(this.page, '決定');
    if (await confirm.waitFor({ state: 'visible', timeout: 2000 }).then(() => true).catch(() => false)) await click(confirm, '決定');
    await acknowledgeOk(this.page, '作業依頼の保存が完了しました');
  }

  async back(): Promise<void> {
    await clickable(this.content, '戻る').click();
    await expect(this.page).toHaveURL(/\/detail/);
  }
}
