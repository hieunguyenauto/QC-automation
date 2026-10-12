import { test as setup } from '@playwright/test';
import { CMS_ROLES, credentials, type CmsRole } from '../data/roles';
import { ensureAuthFile } from './session';

/**
 * (Tuỳ chọn) Đăng nhập trước mọi role mặc định có tài khoản → .auth/<ENV>/cms-<role>.json.
 * Không bắt buộc: forAccounts tự đăng nhập khi cần. Role thiếu tài khoản → skip.
 */
for (const role of Object.keys(CMS_ROLES) as CmsRole[]) {
  setup(`login CMS [${CMS_ROLES[role].label}]`, async ({ browser }) => {
    setup.skip(!credentials(role), `Chưa có tài khoản role ${role} (env/<ENV>.json › accounts + .env)`);
    await ensureAuthFile(browser, role);
  });
}
