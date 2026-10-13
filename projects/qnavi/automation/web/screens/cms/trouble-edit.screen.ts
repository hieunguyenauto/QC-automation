import { expect } from '@playwright/test';
import { BaseScreen } from '../base.screen';
import { acknowledgeOk, click, clickable, modal, modalWithButton, rowOf } from '../../common/ui';

/**
 * 作業依頼編集 — catalog: cms-frontend.md › "Trouble Edit: /admin/troubles/:id/edit".
 * "変更" trên dòng 作業項目（大）mở 店舗・担当者編集 (StoreStaffCategoryEditModal, role 99).
 * Đã xác minh: E2E 13/13 pass (reports/20261012-112231-dev, 20261012-112608-dev). 対応区分 = <select name="types.<id>"> native (01 清掃…04 入れ替え).
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

  /** 変更 ở dòng 作業項目（大）→ 対応区分 = giá trị đầu tiên cho mọi tài sản → 保存 → OK. Trả về các giá trị đã chọn. */
  async setFirstAssetResponseType(): Promise<string[]> {
    await click(rowOf(this.content, '作業項目（大）'), '変更');
    const box = modal(this.page, '店舗・担当者編集');
    await expect(box).toBeVisible();
    await expect(box).toContainText('対応区分');
    const selects = box.locator('select').filter({ visible: true });
    const n = await selects.count();
    const chosen: string[] = [];
    for (let i = 0; i < n; i++) {
      const sel = selects.nth(i);
      const opts = await sel.locator('option').evaluateAll((os) =>
        os.map((o) => ({ value: (o as HTMLOptionElement).value, label: (o.textContent || '').trim() })));
      const first = opts.find((o) => o.value !== '');
      if (first) {
        await sel.selectOption(first.value);
        chosen.push(first.label);
      }
    }
    await click(box, '保存');
    const confirm = modalWithButton(this.page, '決定');
    if (await confirm.waitFor({ state: 'visible', timeout: 2000 }).then(() => true).catch(() => false)) await click(confirm, '決定');
    await acknowledgeOk(this.page, '作業依頼の保存が完了しました');
    return chosen;
  }

  /** 案件区分: nút '営業停止案件' / '通常案件' (dò thật 2026-10-13 ở role 01; role 99 giả định giống). */
  async setCaseType(type: '営業停止案件' | '通常案件'): Promise<void> {
    await click(rowOf(this.content, '案件区分'), type);
  }
  /** 保存 trang 作業依頼編集 → 決定 (この作業依頼を保存します) → OK. */
  async save(): Promise<void> {
    await click(this.content, '保存');
    const confirm = modalWithButton(this.page, '決定');
    if (await confirm.waitFor({ state: 'visible', timeout: 3000 }).then(() => true).catch(() => false)) await click(confirm, '決定');
    await acknowledgeOk(this.page, /保存が完了しました/);
  }
  /** Popup '対象資産' của dòng 資産 (nút 変更): xoá mọi tài sản (nút 削除). Dò thật 2026-10-13 (role 01). */
  async openAssetPopup(): Promise<ReturnType<typeof modal>> {
    await click(rowOf(this.content, '資産'), '変更');
    const box = modal(this.page, '対象資産');
    await expect(box).toBeVisible();
    return box;
  }
  async back(): Promise<void> {
    await clickable(this.content, '戻る').click();
    await expect(this.page).toHaveURL(/\/detail/);
  }
}
