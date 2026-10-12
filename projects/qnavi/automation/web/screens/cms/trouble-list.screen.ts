import { expect } from '@playwright/test';
import { BaseScreen } from '../base.screen';
import { tableRow, waitForApiSafe } from '../../common/ui-wait';

/**
 * 作業依頼一覧 — catalog: cms-frontend.md › "Trouble List: /admin/troubles" (không có route guard, mọi role).
 * Nút 新規 chỉ role 01/02/03; cột / filter đổi theo role (xem catalog).
 * [cần kiểm trên app thật] các locator dưới đây.
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

  /** Mở trouble theo 依頼番号 (ưu tiên) hoặc id; không thấy trong list thì mở thẳng URL chi tiết. */
  async openByNumber(t: { id?: string; number?: string }): Promise<void> {
    if (t.number) {
      const row = tableRow(this.page, new RegExp(`(^|\\D)${t.number}(\\D|$)`));
      if (await row.isVisible().catch(() => false)) {
        await this.openTrouble(new RegExp(`(^|\\D)${t.number}(\\D|$)`));
        return;
      }
    }
    if (!t.id) throw new Error('Không có 依頼番号 / id của trouble tạo ở E2E-TC-002');
    await this.page.goto(`/admin/troubles/${t.id}/detail`);
    await expect(this.page).toHaveURL(/\/admin\/troubles\/\d+\/detail/);
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
