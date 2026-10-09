import { test } from './fixtures';
import { CMS_ROLES, CmsRole } from '../data/roles';
import { authFile, hasAuth } from './auth';

/**
 * 1 TC × 1 role = 1 test. Dùng trong spec:
 *   forRoles(['99', '98'], (role) => { test('WB2-TC-001 ...', async ({ page }) => { ... }) });
 * Tên test có [<cột Excel>] và tag @role-<mã>. Role chưa login được (thiếu tài khoản trong .env) → skip.
 */
export function forRoles(roles: CmsRole[], body: (role: CmsRole) => void): void {
  for (const role of roles) {
    test.describe(`[${CMS_ROLES[role].label}]`, { tag: `@role-${role}` }, () => {
      // Kiểm lúc chạy (sau project setup), không kiểm lúc nạp file.
      test.use({
        storageState: async ({}, use) => use(hasAuth(role) ? authFile(role) : undefined),
      });
      test.beforeEach(() => {
        test.skip(!hasAuth(role), `Chưa login được role ${role}: thiếu CMS_${role}_ID / PASSWORD trong .env`);
      });
      body(role);
    });
  }
}
