import { expect, test, type Page } from '@playwright/test';
import { click, confirmDecide, modalWithButton } from '../../common/ui';
import { trackApis, waitApiPerf, waitApisIdle } from '../../common/wait';

/** Hộp lỗi app khi server chậm (est-test 2026-10-13: dashboard, 資産管理項目…) — CHỈ đóng đúng câu này, hộp khác vẫn để test fail. */
const SLOW_LOAD = '表示に時間がかかっております';
const guarded = new WeakSet<Page>();

/**
 * Đăng ký 1 lần / page: mọi thao tác / expect gặp hộp SLOW_LOAD → bấm OK, đợi trang tải xong, ghi annotation 'env-warning'
 * (reporter đưa vào SUMMARY + FAIL.md). KHÔNG reload (người dùng chốt 2026-10-13) — dữ liệu vẫn thiếu thì test fail bình thường.
 */
function guardSlowLoad(page: Page): void {
  if (guarded.has(page)) return;
  guarded.add(page);
  const box = modalWithButton(page, 'OK').filter({ hasText: SLOW_LOAD });
  // Lỗi lấy token Firebase (firebase-auth/exchange, est-test gọi firebase-be-dev) → app huỷ request đang chạy (diag 2026-10-13)
  page.on('console', (m) => {
    if (m.type() !== 'error' || !m.text().includes('Error getting Firebase token')) return;
    const status = /status: (\d+)/.exec(m.text())?.[1] ?? '?';
    try { test.info().annotations.push({ type: 'env-warning', description: `firebase-auth/exchange lỗi HTTP ${status} → app huỷ request đang chạy — URL ${page.url()}` }); } catch { /* ngoài test */ }
  });
  page.addLocatorHandler(box, async (d) => {
    const msg = (await d.innerText().catch(() => SLOW_LOAD)).replace(/\s+/g, ' ').trim();
    try { test.info().annotations.push({ type: 'env-warning', description: `Hộp lỗi app đã tự đóng (OK): ${msg} — URL ${page.url()}` }); } catch { /* ngoài test (hook) */ }
    await click(d, 'OK');
    await page.waitForLoadState('load').catch(() => {});
  });
}

/** Hộp SLOW_LOAD hiện (đợi tối đa 10s) → bấm OK như người dùng + ghi env-warning. Không reload. */
export async function dismissSlowLoad(page: Page): Promise<void> {
  const d = modalWithButton(page, 'OK').filter({ hasText: SLOW_LOAD });
  if (!(await d.waitFor({ state: 'visible', timeout: 10_000 }).then(() => true, () => false))) return;
  const msg = (await d.innerText().catch(() => SLOW_LOAD)).replace(/\s+/g, ' ').trim();
  try { test.info().annotations.push({ type: 'env-warning', description: `Hộp lỗi app đã tự đóng (OK): ${msg} — URL ${page.url()}` }); } catch { /* ngoài test */ }
  await click(d, 'OK').catch(() => {});
}

/**
 * Đợi dashboard tải xong danh sách 進行中の作業 (GET /api/home) — như người dùng đợi trang hiện xong rồi mới bấm (R18).
 * Bấm sang trang khác khi /api/home chưa về → app hiện hộp SLOW_LOAD ở trang sau (trace 2026-10-13).
 * GỌI TRƯỚC khi submit đăng nhập, await sau khi rời /login. Chậm / không về → chỉ ghi PERFORMANCE (waitApiPerf), chạy tiếp.
 * App không gửi /api/home (role không có dashboard này) → bỏ qua.
 */
export function waitDashboardApi(page: Page): Promise<void> {
  const isHome = (u: URL, m: string) => m === 'GET' && u.pathname.endsWith('/api/home');
  const sent = page.waitForRequest((r) => isHome(new URL(r.url()), r.method()), { timeout: 20_000 }).then(() => true, () => false);
  const done = waitApiPerf(page, isHome, 'Dashboard GET /api/home', () => dismissSlowLoad(page));
  return (async () => { if (await sent) await done; })();
}

/**
 * Khung chung CMS (AdminLTE) — catalog: cms-frontend.md › "Global layout".
 * Snapshot thật 2026-10-12 (role 99):
 *   - sidebar = complementary › navigation › menu › link "<icon> 作業依頼登録" (chữ nằm trong <p>)
 *   - header = navigation: textbox "依頼番号 または 店舗名でEnter", button "フィルタ", "パスワード変更", "ログアウト"
 *   - tên tài khoản ở cuối sidebar: paragraph "Qナビ担当者 （株式会社グローバー）"
 */
export class CmsLayout {
  constructor(private readonly page: Page) { trackApis(page); guardSlowLoad(page); }

  get sidebar() { return this.page.getByRole('complementary'); }
  get content() { return this.page.locator('.content-wrapper').first(); }
  get quickSearch() { return this.page.getByRole('textbox', { name: '依頼番号 または 店舗名でEnter' }); }

  /** Bấm menu sidebar theo tên (vd 作業依頼登録, 進行中のトラブル一覧). Danh sách trouble: role 99 = '作業依頼情報' (không có
   *  '進行中のトラブル一覧' — Hieu Nguyen xác nhận 15/10/2026); role 01 / 02 / 98 = '進行中のトラブル一覧'. */
  async menu(name: string): Promise<void> {
    const link = this.sidebar.getByRole('link', { name: new RegExp(`(^|\\s)${name}$`) }).first();
    if (!(await link.isVisible().catch(() => false))) {
      // Sidebar thu gọn → mở bằng nút hamburger (button đầu tiên của header)
      await this.page.getByRole('navigation').first().getByRole('button').first().click();
    }
    await waitApisIdle(this.page, `Trước menu ${name}`);
    await link.click();
    await waitApisIdle(this.page, `Menu ${name}`);
  }

  /** Tên tài khoản đang đăng nhập (cuối sidebar). */
  async expectAccount(text: string | RegExp): Promise<void> {
    await expect(this.sidebar).toContainText(text);
  }

  async logout(): Promise<void> {
    await this.page.getByRole('button', { name: 'ログアウト', exact: true }).click();
    await confirmDecide(this.page, 'ログアウトします');
    await expect(this.page).toHaveURL(/\/login/);
    await waitApisIdle(this.page, 'Sau đăng xuất');
  }

  /** Đang ở trang đăng nhập? */
  async isOnLogin(): Promise<boolean> {
    return /\/login/.test(this.page.url());
  }
}
