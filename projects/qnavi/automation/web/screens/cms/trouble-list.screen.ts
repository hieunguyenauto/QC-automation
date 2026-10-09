import { BaseScreen } from '../base.screen';
import { waitForApi } from '../../common/wait';

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
    const list = waitForApi(this.page, 'troubles');
    await this.goto();
    await list;
  }
}
