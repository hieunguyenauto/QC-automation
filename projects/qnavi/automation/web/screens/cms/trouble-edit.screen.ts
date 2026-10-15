import { expect } from '@playwright/test';
import { BaseScreen } from '../base.screen';
import { acknowledgeOk, click, clickable, closeModal, exact, modal, modalWithButton, rowOf } from '../../common/ui';
import { waitApisIdle } from '../../common/wait';

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
  /** 変更 ở dòng 作業項目（大）→ modal 店舗・担当者編集 (role 99). Dò thật dev 2026-10-13: 3 thẻ 選択 (故障内容/個所/症状),
   *  checkbox '対象資産がある場合はチェックを入れてください', 修理対象資産選択, bảng tài sản (対応区分 select + 削除 mỗi dòng), キャンセル / 保存. */
  async openItemEditModal(): Promise<ReturnType<typeof modal>> {
    await click(rowOf(this.content, '作業項目（大）'), '変更');
    const box = modal(this.page, '店舗・担当者編集');
    await expect(box).toBeVisible();
    // Modal hiện ngay nhưng bảng tài sản tải sau (lúc đầu chỉ có '選択してください' + spinner) — dò thật dev 2026-10-14.
    await waitApisIdle(this.page, '店舗・担当者編集');
    return box;
  }
  /** Checkbox '対象資産がある場合はチェックを入れてください' trong modal 店舗・担当者編集. */
  itemEditAssetCheck(box: ReturnType<typeof modal>) {
    return box.locator('input[type="checkbox"]').first();
  }
  /** Nút '削除' của từng dòng tài sản trong modal 店舗・担当者編集. */
  itemEditAssetDeletes(box: ReturnType<typeof modal>) {
    return box.locator('button', { hasText: exact('削除') });
  }
  /** Xoá hết tài sản trong modal. Trouble phải có sẵn ≥1 tài sản: chờ dòng tài sản hiện ra rồi mới đếm
   *  (count() không chờ — đếm lúc bảng chưa tải = 0 → không xoá gì, bug test 2026-10-14). */
  async removeAllItemEditAssets(box: ReturnType<typeof modal>): Promise<void> {
    const del = this.itemEditAssetDeletes(box);
    await expect(del.first(), 'Trouble không có tài sản nào trong modal 店舗・担当者編集').toBeVisible({ timeout: 30_000 });
    for (let n = await del.count(); n > 0; n--) {
      await del.first().click();
      await expect(del).toHaveCount(n - 1);
    }
    await expect(box).toContainText('選択してください');
  }
  async setFirstAssetResponseType(): Promise<string[]> {
    const box = await this.openItemEditModal();
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
  /** Hàng '資産' chỉ có nút '資産一覧' (không có checkbox) → modal: No | 対応区分 | … | 名称 | 型式 | 製造番号 (dò thật dev 2026-10-13). */
  async expectAssetInList(name: string): Promise<void> {
    await click(rowOf(this.content, '資産'), '資産一覧');
    const box = modal(this.page).filter({ hasText: '製造番号' });
    await expect(box).toBeVisible();
    await expect(box).toContainText(name);
    await closeModal(box);
  }
  async back(): Promise<void> {
    await clickable(this.content, '戻る').click();
    await expect(this.page).toHaveURL(/\/detail/);
  }
}
