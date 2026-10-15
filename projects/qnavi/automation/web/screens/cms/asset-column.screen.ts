import { expect, type Locator } from '@playwright/test';
import { BaseScreen } from '../base.screen';
import { click, clickables, modal } from '../../common/ui';
import { waitApiPerf, waitApisIdle } from '../../common/wait';
import { dismissSlowLoad } from './layout.screen';

/**
 * 資産管理項目 của 1 chain — /admin/asset-column/<chainId>/edit (catalog: cms-frontend.md › "Asset Column").
 * Dò thật 2026-10-13 (dev, role 99):
 *  - Bảng cột: No | 項目名 | データ種別 | 設定形式 | 状態 | アクション (nút 編集). Tên cột được phép trùng.
 *  - 追加 → modal 'Linksys Chain Systemの資産管理項目追加': input[name=columnName], select[name=type] (7 = タイマー),
 *    chọn タイマー → radio name="step_selection": 1=年, 2=年月, 3=年月日, 4=年月日時. Nút 戻る / 保存.
 *  - 編集 → cùng modal; select[name=type] bị disable. Quan sát: AT_Timer_YM (danh sách = 年月) mở form lại chọn '年'
 *    và radio KHÔNG bị disable → nghi bug 2174 (TC-003~005 sẽ fail đúng chỗ này).
 *  - (est-test 2026-10-13) '保存' của modal chỉ thêm / sửa dòng tạm trên bảng, KHÔNG gửi request.
 *    Lưu thật = nút '保存' của trang (2 nút: góc phải trên + cuối trang) → hộp '決定'.
 */
export const TIMER_FORMAT: Record<string, string> = { '年': '1', '年月': '2', '年月日': '3', '年月日時': '4' };

export class AssetColumnScreen extends BaseScreen {
  readonly id = 'CMS-ASSET-COLUMN';
  readonly path = '/admin/asset-column';
  readonly roles = ['99'] as const;

  readonly content = this.page.locator('.content-wrapper').first();
  get form(): Locator { return modal(this.page, '資産管理項目'); }

  /** Đợi danh sách cột trả về thực tế (GET /api/asset/column-management, R18) — gọi trước thao tác tải trang. */
  waitList(label: string): Promise<boolean> {
    return waitApiPerf(this.page, (u, m) => m === 'GET' && u.pathname.endsWith('/api/asset/column-management'), `資産管理項目 GET column-management (${label})`, () => dismissSlowLoad(this.page));
  }
  async open(chainId: string): Promise<void> {
    const listed = this.waitList('mở trang');
    await this.page.goto(`/admin/asset-column/${chainId}/edit`);
    await listed;
    await waitApisIdle(this.page, 'Mở 資産管理項目');
    await expect(this.content.getByRole('button', { name: '追加' }).or(this.content.locator('button', { hasText: '追加' })).first()).toBeVisible({ timeout: 20_000 });
    await expect(this.rows.first()).toBeVisible({ timeout: 20_000 });
  }
  get rows(): Locator { return this.content.locator('tbody tr').filter({ has: this.page.locator('td') }); }
  /** Dòng mới nhất có 項目名 = name (tên có thể trùng → lấy dòng cuối). */
  row(name: string): Locator {
    return this.rows.filter({ has: this.page.locator('td', { hasText: new RegExp(`^\\s*${name}\\s*$`) }) }).last();
  }

  /** F5 (khi TC ghi bước reload) + đợi danh sách về thực tế. */
  async reload(): Promise<void> {
    const listed = this.waitList('F5');
    await this.page.reload();
    await listed;
    await waitApisIdle(this.page, 'F5 資産管理項目');
  }
  async startAdd(): Promise<void> {
    await click(this.content, '追加');
    await expect(this.form.locator('input[name="columnName"]')).toBeVisible();
  }
  async fillName(name: string): Promise<void> {
    await this.form.locator('input[name="columnName"]').fill(name);
  }
  async chooseTimer(): Promise<void> {
    await this.form.locator('select[name="type"]').selectOption('7');
    await expect(this.form.locator('input[name="step_selection"]').first()).toBeVisible();
  }
  async chooseFormat(fmt: keyof typeof TIMER_FORMAT): Promise<void> {
    await this.form.locator(`input[name="step_selection"][value="${TIMER_FORMAT[fmt]}"]`).check();
  }
  formatRadio(fmt: keyof typeof TIMER_FORMAT): Locator {
    return this.form.locator(`input[name="step_selection"][value="${TIMER_FORMAT[fmt]}"]`);
  }
  async openEdit(name: string): Promise<void> {
    await click(this.row(name), '編集');
    await expect(this.form.locator('input[name="columnName"]')).toHaveValue(name);
  }
  /** '保存' của trang (lưu cả bảng cột) — dùng nút cuối trang; modal phải đã đóng. */
  async saveAll(): Promise<void> {
    await expect(this.form).toBeHidden();
    await clickables(this.content, '保存').last().click();
  }
  async closeForm(): Promise<void> {
    await click(this.form, '戻る');
    await expect(this.form).toBeHidden();
  }
}
