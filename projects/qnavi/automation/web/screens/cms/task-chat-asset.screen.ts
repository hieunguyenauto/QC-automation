import { expect, type Locator } from '@playwright/test';
import { BaseScreen } from '../base.screen';
import { waitApisIdle } from '../../common/wait';
import { click } from '../../common/ui';

/**
 * タスク管理 /admin/tasks — dò thật 2026-10-13 (dev, role 01 + 99):
 *  - '検索条件' thu gọn; input[name=troubleNumber], select[name=status] (''=全て, 01=未着手, 02=完了),
 *    select[name=taskScope] (''=全て, 02=あなたのタスク, 01=作成したタスク), input[name=storeName]; nút 検索.
 *  - Bảng: No | 依頼番号 (link /admin/troubles/<id>/detail?chatMode=firebase&from=task) | 都道府県 | 店舗名 | 件名 ('見積承認依頼が届いています。')
 *    | 内容 | 大 | 中 | 小 | 期限 | 作成日 | 担当者 | 作成者 | 状態 (未着手 / 完了) | 操作. Mới nhất ở trên.
 *    Nội dung task KHÔNG ghi tên 見積 → phân biệt task theo thứ tự tạo (mới nhất = dòng đầu).
 */
export class TaskListScreen extends BaseScreen {
  readonly id = 'CMS-TASKS';
  readonly path = '/admin/tasks';
  readonly roles = ['99', '98', '01', '02'] as const;

  readonly content = this.page.locator('.content-wrapper').first();
  get rows(): Locator { return this.content.locator('tbody tr').filter({ has: this.page.locator('a[href*="/admin/troubles/"]') }); }

  async expand(): Promise<void> {
    const probe = this.content.locator('input[name="troubleNumber"]');
    if (!(await probe.isVisible().catch(() => false))) await this.content.locator('h4', { hasText: '検索条件' }).first().click();
    await expect(probe).toBeVisible();
  }
  async search(opts: { number?: string; status?: '' | '01' | '02'; scope?: '' | '01' | '02'; storeName?: string }): Promise<void> {
    await this.expand();
    await this.content.locator('input[name="troubleNumber"]').fill(opts.number ?? '');
    if (opts.status !== undefined) await this.content.locator('select[name="status"]').selectOption(opts.status);
    if (opts.scope !== undefined) await this.content.locator('select[name="taskScope"]').selectOption(opts.scope);
    await this.content.locator('input[name="storeName"]').fill(opts.storeName ?? '');
    // Chờ ĐÚNG response của lần tìm này: '全 N 件' đã có sẵn từ danh sách mặc định (status=01, taskScope=02) → đọc nhầm dòng cũ (TC-053 dev 2026-10-13).
    const res = this.page.waitForResponse((r) => r.url().includes('/tasks') && r.request().method() === 'GET'
      && new URL(r.url()).searchParams.get('troubleNumber') === (opts.number ?? ''), { timeout: 30_000 });
    await click(this.content, '検索');
    await res;
    await waitApisIdle(this.page, 'タスク検索');
    await expect(this.content.getByText(/全\s*\d+\s*件|該当データが0件/).first()).toBeVisible({ timeout: 15_000 });
  }
  /** Cột 状態 của dòng (index 0 = mới nhất). */
  status(row: Locator): Locator { return row.locator('td').nth(13); }
  async openRow(index = 0): Promise<void> {
    await this.rows.nth(index).locator('a[href*="/admin/troubles/"]').first().click();
    await expect(this.page).toHaveURL(/\/admin\/troubles\/\d+\/detail/);
  }
}

/**
 * チャット一覧 /admin/chats — dò thật 2026-10-13 (dev, role 99):
 *  - Tab a.nav-link 'すべて' / '自分宛て' (mặc định active = 自分宛て) / '自分宛て (旧チャット)'.
 *  - '検索条件' thu gọn: input[name=searchNumberStoreNameCompanyName] (検索キー（番号・店名・社名）).
 *  - Dòng: link 依頼番号 (href /admin/troubles/<id>/detail; bấm → URL thêm ?chatMode=firebase). 戻る ở detail → /admin/chats.
 */
export class ChatListScreen extends BaseScreen {
  readonly id = 'CMS-CHATS';
  readonly path = '/admin/chats';
  readonly roles = ['99', '98', '01', '02', '05'] as const;

  readonly content = this.page.locator('.content-wrapper').first();
  readonly searchKey = this.content.locator('input[name="searchNumberStoreNameCompanyName"]');

  async expand(): Promise<void> {
    if (!(await this.searchKey.isVisible().catch(() => false))) await this.content.locator('h4', { hasText: '検索条件' }).first().click();
    await expect(this.searchKey).toBeVisible();
  }
  async tab(name: 'すべて' | '自分宛て'): Promise<void> {
    await this.content.locator('a.nav-link', { hasText: new RegExp(`^\\s*${name}\\s*$`) }).first().click();
  }
  async openFirst(): Promise<void> {
    const link = this.content.locator('tbody a[href*="/admin/troubles/"]').first();
    await expect(link).toBeVisible({ timeout: 15_000 });
    await link.click();
    await expect(this.page).toHaveURL(/\/admin\/troubles\/\d+\/detail\?.*chatMode=firebase/);
  }
}

/**
 * 資産情報 — dò thật 2026-10-13 (dev, role 99):
 *  - /admin/asset-management/chains (企業一覧): input[name=chainSystemName] (社名), 検索; bấm ô 社名 → /admin/asset-management/chains/<chainId>.
 *  - 資産情報一覧: input[name=assetName] (名称)…, 検索; bấm ô 名称 → /admin/asset-management/<assetId>/detail.
 *  - 資産詳細: tab a.nav-link '全て' (mặc định) / '自動マッチング'; bảng '資産の作業依頼履歴' link 依頼番号 (?assetId=<assetId>).
 *    戻る ở trouble detail → về đúng 資産詳細, giữ tab đang chọn.
 */
export class AssetInfoScreen extends BaseScreen {
  readonly id = 'CMS-ASSET-INFO';
  readonly path = '/admin/asset-management/chains';
  readonly roles = ['99', '01'] as const;

  readonly content = this.page.locator('.content-wrapper').first();

  private async expand(probe: string): Promise<void> {
    const input = this.content.locator(`input[name="${probe}"]`);
    if (!(await input.isVisible().catch(() => false))) await this.content.locator('h4', { hasText: '検索条件' }).first().click();
    await expect(input).toBeVisible();
  }
  async openChain(query: string, chainName: string): Promise<void> {
    await this.expand('chainSystemName');
    await this.content.locator('input[name="chainSystemName"]').fill(query);
    await click(this.content, '検索');
    const row = this.content.locator('tbody tr', { hasText: chainName }).first();
    await expect(row).toBeVisible({ timeout: 15_000 });
    await row.locator('td').nth(1).click();
    await expect(this.page).toHaveURL(/\/asset-management\/chains\/\d+/);
  }
  async openAsset(name: string): Promise<void> {
    await this.expand('assetName');
    await this.content.locator('input[name="assetName"]').fill(name);
    await click(this.content, '検索');
    const row = this.content.locator('tbody tr', { hasText: name }).first();
    await expect(row).toBeVisible({ timeout: 15_000 });
    await row.locator('td').nth(3).click();
    await expect(this.page).toHaveURL(/\/asset-management\/\d+\/detail/);
    await expect(this.content).toContainText('資産の作業依頼履歴');
  }
  tab(name: '全て' | '自動マッチング'): Locator {
    return this.content.locator('a.nav-link', { hasText: new RegExp(`^\\s*${name}\\s*$`) }).first();
  }
  get historyLinks(): Locator { return this.content.locator('a[href*="/admin/troubles/"]'); }
}
