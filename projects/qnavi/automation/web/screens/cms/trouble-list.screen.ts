import { expect } from '@playwright/test';
import { BaseScreen } from '../base.screen';
import { tableRow, waitForApiSafe } from '../../common/ui-wait';
import { click, modal } from '../../common/ui';

/**
 * 作業依頼一覧 — catalog: cms-frontend.md › "Trouble List: /admin/troubles" (không có route guard, mọi role).
 * Nút 新規 chỉ role 01/02/03; cột / filter đổi theo role (xem catalog).
 * Recon 2026-10-12: cột 1 = link 依頼番号 (/admin/troubles/<id>/detail), cột 詳細 = mô tả (故障詳細).
 * Đã xác minh: E2E 13/13 pass (reports/20261012-112231-dev, 20261012-112608-dev). Chỉ dùng openByNumber; các locator lọc/tìm kiếm khác CHƯA dùng → kiểm khi viết TC mới.
 */
export class TroubleListScreen extends BaseScreen {
  readonly id = 'CMS-TROUBLE-LIST';
  readonly path = '/admin/troubles';
  readonly roles = ['99', '98', '01', '02', '05'] as const;

  readonly createButton = this.page.getByRole('button', { name: '新規' });
  readonly advancedSearch = this.page.getByRole('button', { name: '高度な検索' });
  readonly dataOperations = this.page.getByRole('button', { name: 'データ操作' });
  readonly table = this.page.getByRole('table').first();
  readonly rows = this.table.locator('tbody tr');

  async open(): Promise<void> {
    const list = waitForApiSafe(this.page, 'troubles');
    await this.goto();
    await list;
  }

  /**
   * Mở trouble theo 依頼番号 (link ở cột đầu, recon 2026-10-12) hoặc id; không thấy trong list thì mở thẳng URL chi tiết.
   */
  async openByNumber(t: { id?: string; number?: string }): Promise<void> {
    if (t.number) {
      const link = this.page.getByRole('link', { name: t.number, exact: true }).first();
      if (await link.isVisible().catch(() => false)) {
        await link.click();
        await expect(this.page).toHaveURL(/\/admin\/troubles\/\d+\/detail/);
        return;
      }
    }
    if (!t.id) throw new Error('Không có 依頼番号 / id của trouble tạo ở E2E-TC-002');
    await this.page.goto(`/admin/troubles/${t.id}/detail`);
    await expect(this.page).toHaveURL(/\/admin\/troubles\/\d+\/detail/);
  }

  // ----- Phase 007 (dò thật 2026-10-13, role 99) -----
  // '表示条件を保存' → modal '表示条件を保存': input[name=name] (フィルタ名), nút キャンセル / '検索条件をフィルタとして保存'.
  // Header: a.nav-link 'フィルタ' → .dropdown-menu.show liệt kê tên bộ lọc (mỗi dòng có 削除).
  // '表示設定' → modal '表示設定': checkbox #reportPdf (報告書PDF), #reportExcel (報告書Excel)…, nút 初期値にリセット / 設定.
  // Vùng tìm kiếm .filter-advance: input[name=number] (作業依頼の番号), 検索.
  get saveFilterModal() { return modal(this.page, '表示条件を保存'); }
  async openSaveFilter(): Promise<void> {
    await click(this.page.locator('.content-wrapper'), '表示条件を保存');
    await expect(this.saveFilterModal.locator('input[name="name"]')).toBeVisible();
  }
  async headerFilterNames(): Promise<string[]> {
    await this.page.locator('a.nav-link', { hasText: /^\s*フィルタ\s*$/ }).first().click();
    const menu = this.page.locator('.dropdown-menu.show').first();
    await expect(menu).toBeVisible();
    const names = (await menu.innerText()).split('\n').map((t) => t.replace('削除', '').trim()).filter(Boolean);
    await this.page.keyboard.press('Escape');
    return names;
  }
  get displayModal() { return modal(this.page, '表示設定'); }
  async enableReportColumns(): Promise<void> {
    await click(this.page.locator('.content-wrapper'), '表示設定');
    await expect(this.displayModal).toBeVisible();
    await this.displayModal.locator('#reportPdf').check();
    await this.displayModal.locator('#reportExcel').check();
    await click(this.displayModal, '設定');
    await expect(this.displayModal).toBeHidden();
  }
  async searchNumber(number: string): Promise<void> {
    const f = this.page.locator('.filter-advance input[name="number"]');
    await f.fill(number);
    await click(this.page.locator('.filter-advance'), '検索');
    await expect(this.rows.filter({ hasText: number }).first()).toBeVisible({ timeout: 15_000 });
  }
  /** Ô của cột có tiêu đề header ở dòng có 依頼番号 number. [chưa dò: nội dung ô 報告書PDF / 報告書Excel — giả định có link / nút tải] */
  async cellOf(number: string, header: string) {
    const idx = await this.table.locator('thead th').evaluateAll((ths, h) => ths.findIndex((t) => (t.textContent || '').trim() === h), header);
    if (idx < 0) throw new Error(`Không thấy cột '${header}' trong 作業依頼一覧`);
    return this.rows.filter({ hasText: number }).first().locator('td').nth(idx);
  }

  /** Mở trouble đầu tiên (mới nhất) có đủ các chữ trong texts → màn hình chi tiết. */
  async openTrouble(...texts: (string | RegExp)[]): Promise<void> {
    const row = tableRow(this.page, ...texts);
    await expect(row).toBeVisible();
    const link = row.locator('a[href*="/detail"]').first();
    if (await link.count()) await link.click();
    else await row.locator('td').nth(1).click();
    await expect(this.page).toHaveURL(/\/admin\/troubles\/\d+\/detail/);
  }
}
