import { expect, type Page } from '@playwright/test';
import { click, confirmDecide, exact } from '../../common/ui';

/**
 * Khung chung CMS (AdminLTE) — catalog: cms-frontend.md › "Global layout".
 * Sidebar: menu theo role. Header: ログアウト (confirm CMSG00005).
 */
export class CmsLayout {
  constructor(private readonly page: Page) {}

  get sidebar() { return this.page.locator('.main-sidebar, aside').first(); }
  get content() { return this.page.locator('.content-wrapper').first(); }

  /** Bấm menu sidebar theo tên (vd 作業依頼登録, 進行中のトラブル一覧). */
  async menu(name: string): Promise<void> {
    const item = this.sidebar.locator('a, [role="link"], li').filter({ hasText: exact(name) }).first();
    if (!(await item.isVisible().catch(() => false))) {
      // Sidebar thu gọn → mở bằng nút hamburger
      await this.page.locator('[data-widget="pushmenu"], .nav-link:has(i.fa-bars)').first().click().catch(() => undefined);
    }
    await item.click();
  }

  async logout(): Promise<void> {
    await click(this.page.locator('.main-header, nav.navbar').first(), 'ログアウト');
    await confirmDecide(this.page, 'ログアウトします');
    await expect(this.page).toHaveURL(/\/login/);
  }
}
