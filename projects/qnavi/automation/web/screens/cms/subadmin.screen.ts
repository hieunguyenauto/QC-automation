import { expect, type Locator } from '@playwright/test';
import { BaseScreen } from '../base.screen';
import { acknowledgeOk, click, confirmDecide, modalWithButton } from '../../common/ui';
import { waitApisIdle } from '../../common/wait';

/**
 * サブアドミン情報 / 詳細 / 症状グループ — catalog: cms-frontend.md › "Sub Admin".
 * Dò thật 2026-10-13 (dev, role 99):
 *  - /admin/sub-admin-information: '検索条件' thu gọn, input[name=loginId], 検索; nút 登録 (thêm subadmin); bấm ô 社名 ở dòng → chi tiết.
 *  - Chi tiết /admin/sub-admin-information/<id>/detail: tiêu đề 'サブアドミン詳細'; bảng thông tin đầu tiên (table đầu) có ログインID, メール…;
 *    phía dưới là bảng 症状グループ: No | 症状グループID | 症状グループ名 | 説明 | チェーンシステム名（社名）| チェーン店舗一覧 | 操作; nút 登録.
 *    Vùng search 症状グループ: input[name=title], input[name=numberItem] (表示件数, mặc định 20).
 *  - 登録 → trang /presets: input[name=title] (症状グループ名), textarea[name=description] (説明), 戻る / 保存.
 *    保存 → '確認 この症状グループを保存します。よろしいですか？' → 決定.
 *    Trống tên → '.message--error p.text-danger' '症状グループ名を入力してください。' dưới ô tên, vẫn ở /presets (DOM thật dev 2026-10-13; KHÔNG phải .invalid-feedback).
 *    OK → '<tên>の保存が完了しました。' → /presets/<presetId>/detail.
 *  - Chi tiết nhóm: '症状グループ詳細', dòng '紐付け店舗一括登録' (CSVダウンロード / CSVアップロード), dòng '症状一括登録'.
 *  - CSVアップロード → /presets/<id>/import-store: radio name=appSelectModeImport (upsert = 追加のみ, mặc định; replace),
 *    input[type=file] accept .csv, nút アップロード.
 *    OK: '<file>ファイルが正常にアップロードされました。' → về chi tiết nhóm.
 *    File chỉ có dòng tiêu đề: 'エラーが発生されました。一括登録できませんでした。'. File 0 byte: lỗi inline loại file (không dùng).
 *    Format CSV (CSVダウンロード): 'チェーン店 ID,店名,チェーンシステムID,チェーンシステム名'.
 */
export const STORE_CSV_HEADER = 'チェーン店 ID,店名,チェーンシステムID,チェーンシステム名';

export class SubAdminScreen extends BaseScreen {
  readonly id = 'CMS-SUBADMIN';
  readonly path = '/admin/sub-admin-information';
  readonly roles = ['99'] as const;

  readonly content = this.page.locator('.content-wrapper').first();
  /** Bảng thông tin subadmin (bảng đầu tiên của trang chi tiết). */
  get infoTable(): Locator { return this.content.locator('table').first(); }

  private async expand(probe: string): Promise<void> {
    const input = this.content.locator(`input[name="${probe}"]`);
    if (!(await input.isVisible().catch(() => false))) await this.content.locator('h4', { hasText: '検索条件' }).first().click();
    await expect(input).toBeVisible();
  }
  async searchLoginId(loginId: string): Promise<Locator> {
    await this.expand('loginId');
    await this.content.locator('input[name="loginId"]').fill(loginId);
    await click(this.content, '検索');
    const row = this.content.locator('tbody tr', { hasText: loginId }).first();
    await expect(row).toBeVisible({ timeout: 15_000 });
    return row;
  }
  async openDetail(loginId: string): Promise<void> {
    const row = await this.searchLoginId(loginId);
    await row.locator('td').nth(1).click();
    await expect(this.page).toHaveURL(/\/sub-admin-information\/\d+\/detail/);
    await expect(this.content).toContainText('サブアドミン詳細');
    await expect(this.content).toContainText('症状グループ名', { timeout: 15_000 });
  }

  // ----- 症状グループ -----
  async startAddGroup(): Promise<void> {
    // Nút 登録 thứ nhất trong trang chi tiết là của bảng 症状グループ (khu thông tin chỉ có 戻る / 編集).
    await click(this.content, '登録');
    await expect(this.page).toHaveURL(/\/presets$/);
    await expect(this.content.locator('input[name="title"]')).toBeVisible();
  }
  async fillGroup(name: string, description: string): Promise<void> {
    await this.content.locator('input[name="title"]').fill(name);
    await this.content.locator('textarea[name="description"]').fill(description);
  }
  async saveGroup(): Promise<void> {
    await click(this.content, '保存');
    await confirmDecide(this.page, 'この症状グループを保存します');
  }
  /** Rời form /presets đang nhập dở: 戻る → '画面の編集内容が破棄されますが、処理を続行しますか？' → はい (dò thật dev 2026-10-13).
   *  Chỉ dùng để dọn trạng thái giữa các TC chạy nối tiếp, không phải bước của TC. */
  async discardGroupForm(): Promise<void> {
    await click(this.content, '戻る');
    const d = modalWithButton(this.page, 'はい').filter({ hasText: '画面の編集内容が破棄されますが' });
    await expect(d).toBeVisible();
    await click(d, 'はい');
    await expect(this.page).not.toHaveURL(/\/presets$/);
    await waitApisIdle(this.page, '破棄 → はい');
  }
  get groupError(): Locator { return this.content.locator('.message--error').filter({ visible: true }).first(); }
  async expectGroupSaved(name: string): Promise<void> {
    await acknowledgeOk(this.page, `${name}の保存が完了しました`);
    await expect(this.page).toHaveURL(/\/presets\/\d+\/detail/);
    await expect(this.content).toContainText('症状グループ詳細');
  }
  /** Ô 表示件数 của vùng search 症状グループ. */
  async perPageInput(): Promise<Locator> {
    await this.expand('numberItem');
    return this.content.locator('input[name="numberItem"]');
  }

  // ----- import store -----
  async openImportStore(): Promise<void> {
    const row = this.content.locator('tr', { hasText: '紐付け店舗一括登録' }).first();
    await click(row, 'CSVアップロード');
    await expect(this.page).toHaveURL(/\/import-store/);
  }
  get addOnlyRadio(): Locator { return this.content.locator('input[name="appSelectModeImport"][value="upsert"]'); }
  async upload(fileName: string, content: string): Promise<void> {
    await this.content.locator('input[type="file"]').setInputFiles({ name: fileName, mimeType: 'text/csv', buffer: Buffer.from(content, 'utf8') });
    await click(this.content, 'アップロード');
  }

  /** Ô input đầu tiên của form (form 登録 đã mở). */
  get formFirstInput() { return this.content.locator('input').first(); }
  /** Bấm vào nhóm (cột 3) ở bảng nhóm của màn chi tiết subadmin → /presets/<id>/detail. */
  async openGroup(group: string): Promise<void> {
    await this.content.locator('tbody tr', { hasText: group }).first().locator('td').nth(2).click();
  }
}
