import { expect, type Page } from '@playwright/test';
import { confirmDecide } from '../../common/ui';

/**
 * Khung chung CMS (AdminLTE) — catalog: cms-frontend.md › "Global layout".
 * Snapshot thật 2026-10-12 (role 99):
 *   - sidebar = complementary › navigation › menu › link "<icon> 作業依頼登録" (chữ nằm trong <p>)
 *   - header = navigation: textbox "依頼番号 または 店舗名でEnter", button "フィルタ", "パスワード変更", "ログアウト"
 *   - tên tài khoản ở cuối sidebar: paragraph "Qナビ担当者 （株式会社グローバー）"
 */
export class CmsLayout {
  constructor(private readonly page: Page) {}

  get sidebar() { return this.page.getByRole('complementary'); }
  get content() { return this.page.locator('.content-wrapper').first(); }
  get quickSearch() { return this.page.getByRole('textbox', { name: '依頼番号 または 店舗名でEnter' }); }

  /** Bấm menu sidebar theo tên (vd 作業依頼登録, 進行中のトラブル一覧). */
  async menu(name: string): Promise<void> {
    const link = this.sidebar.getByRole('link', { name: new RegExp(`(^|\\s)${name}$`) }).first();
    if (!(await link.isVisible().catch(() => false))) {
      // Sidebar thu gọn → mở bằng nút hamburger (button đầu tiên của header)
      await this.page.getByRole('navigation').first().getByRole('button').first().click();
    }
    await link.click();
  }

  /** Tên tài khoản đang đăng nhập (cuối sidebar). */
  async expectAccount(text: string | RegExp): Promise<void> {
    await expect(this.sidebar).toContainText(text);
  }

  async logout(): Promise<void> {
    await this.page.getByRole('button', { name: 'ログアウト', exact: true }).click();
    await confirmDecide(this.page, 'ログアウトします');
    await expect(this.page).toHaveURL(/\/login/);
  }

  /** Đang ở trang đăng nhập? */
  async isOnLogin(): Promise<boolean> {
    return /\/login/.test(this.page.url());
  }
}
