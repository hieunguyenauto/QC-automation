import fs from 'fs';
import path from 'path';
import { expect, type Browser, type Page } from '@playwright/test';
import { env } from './env';
import { CMS_ROLES, credentials, type CmsRole } from '../data/roles';
import { LoginScreen } from '../screens/cms/login.screen';
import { CmsLayout, waitDashboardApi } from '../screens/cms/layout.screen';

/**
 * ĐĂNG NHẬP DÙNG CHUNG — mọi spec dùng file này, không tự viết hàm login.
 *
 * Tài khoản viết dạng "role" hoặc "role:variant":
 *   '99'            → admin          '01' → chain store manager     '98' → subadmin
 *   '02'            → store mặc định (linksysstore00001)
 *   '02:urgent'     → linksysstore00003 (danh sách variant: env/<ENV>.json › accounts.02.variants)
 *   '05'            → worker company
 * loginId lấy từ env/<ENV>.json › accounts, mật khẩu từ .env. Basic Auth (nếu môi trường có) Playwright tự xử lý.
 *
 * Cách dùng:
 *   await loginAs(page, '02:ringi');     // đang là tài khoản khác → tự đăng xuất rồi đăng nhập lại; đúng tài khoản rồi → bỏ qua
 *   await logout(page);
 *   forAccounts(['99', '02:urgent'], (who) => { test(...) })  — xem common/roles.ts (mỗi test mở sẵn phiên, không login lại)
 */
export type Who = CmsRole | `${CmsRole}:${string}`;

export function parseWho(who: Who): { role: CmsRole; variant?: string } {
  const [role, variant] = who.split(':') as [CmsRole, string | undefined];
  if (!(role in CMS_ROLES)) throw new Error(`Role không hợp lệ: ${who}`);
  return { role, variant };
}

export function credentialsOf(who: Who): { loginId: string; password: string } {
  const { role, variant } = parseWho(who);
  const c = credentials(role, variant);
  if (!c) {
    const key = variant ? `CMS_${role}_${variant.toUpperCase()}_PASSWORD hoặc CMS_${role}_PASSWORD` : `CMS_${role}_PASSWORD`;
    throw new Error(`Thiếu tài khoản ${who} (ENV=${env.name}): loginId ở env/${env.name}.json › accounts, mật khẩu ${key} ở .env`);
  }
  return c;
}

/** File phiên đăng nhập, tách theo môi trường: .auth/<ENV>/cms-<role>[-<variant>].json (gitignore). */
export function authFile(who: Who): string {
  const { role, variant } = parseWho(who);
  return path.resolve(__dirname, `../.auth/${env.name}/cms-${role}${variant ? `-${variant}` : ''}.json`);
}
/** Phiên còn dùng được: có file và chưa quá maxAgeHours (mặc định 8h). */
export function hasFreshAuth(who: Who, maxAgeHours = 8): boolean {
  const f = authFile(who);
  return fs.existsSync(f) && Date.now() - fs.statSync(f).mtimeMs < maxAgeHours * 3_600_000;
}

// Tài khoản đang đăng nhập trên từng page (để loginAs bỏ qua khi đã đúng).
const current = new WeakMap<Page, string>();
export const currentAccount = (page: Page) => current.get(page);
/** Dùng khi spec tự login/logout bằng UI (TC kiểm chính màn login) để cập nhật trạng thái. */
export function markLoggedIn(page: Page, who: Who | null): void {
  if (who) current.set(page, who);
  else current.delete(page);
}

export async function logout(page: Page): Promise<void> {
  if (!current.get(page) && /\/login/.test(page.url())) return;
  await new CmsLayout(page).logout();
  current.delete(page);
}

/** Đăng nhập bằng UI (màn ログイン) rồi lưu phiên vào .auth/<ENV>/ để test khác dùng lại. */
export async function loginAs(page: Page, who: Who, opts: { save?: boolean } = {}): Promise<void> {
  if (current.get(page) === who) return;
  if (current.get(page)) await logout(page);
  const c = credentialsOf(who);
  const login = new LoginScreen(page);
  await login.goto();
  const dashboard = waitDashboardApi(page);
  await login.login(c.loginId, c.password);
  await expect(page, `Đăng nhập ${who} (${c.loginId}) không thành công`).not.toHaveURL(/\/login/, { timeout: 20_000 });
  await dashboard;
  await login.waitAfterLogin();
  current.set(page, who);
  if (opts.save !== false) {
    fs.mkdirSync(path.dirname(authFile(who)), { recursive: true });
    await page.context().storageState({ path: authFile(who) });
  }
}

/** Bảo đảm có file phiên cho tài khoản: còn hạn → dùng lại; hết hạn / chưa có → mở trình duyệt riêng đăng nhập 1 lần. */
export async function ensureAuthFile(browser: Browser, who: Who): Promise<string> {
  if (hasFreshAuth(who)) return authFile(who);
  const ctx = await browser.newContext({ baseURL: env.cmsBaseUrl, httpCredentials: env.httpCredentials, locale: 'ja-JP' });
  try {
    await loginAs(await ctx.newPage(), who);
  } finally {
    await ctx.close();
  }
  return authFile(who);
}
