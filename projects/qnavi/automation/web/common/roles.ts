import { test } from './fixtures';
import { CMS_ROLES } from '../data/roles';
import { ensureAuthFile, parseWho, type Who } from './session';

/**
 * 1 TC × 1 tài khoản = 1 test, mỗi test mở sẵn phiên đăng nhập (không đi qua màn ログイン).
 *   forAccounts(['99', '98', '02:urgent'], (who) => { test('P007-TC-001 ...', async ({ page }) => { ... }) });
 * Phiên lấy từ .auth/<ENV>/ (còn hạn 8h thì dùng lại, không thì tự đăng nhập 1 lần — common/session.ts).
 * Tên test có [<cột Excel>(:variant)] và tag @role-<mã>.
 */
export function forAccounts(accounts: Who[], body: (who: Who) => void): void {
  for (const who of accounts) {
    const { role, variant } = parseWho(who);
    test.describe(`[${CMS_ROLES[role].label}${variant ? `:${variant}` : ''}]`, { tag: `@role-${role}` }, () => {
      test.use({ storageState: async ({ browser }, use) => use(await ensureAuthFile(browser, who)) });
      body(who);
    });
  }
}

/** Giữ tên cũ: forRoles(['99', '01'], ...) = forAccounts. */
export const forRoles = forAccounts;
