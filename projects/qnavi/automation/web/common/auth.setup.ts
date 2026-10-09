import fs from 'fs';
import { test as setup, expect } from '@playwright/test';
import { CMS_ROLES, CmsRole, credentials } from '../data/roles';
import { authFile } from './auth';
import { LoginScreen } from '../screens/cms/login.screen';

/**
 * Login CMS 1 lần cho mỗi role có tài khoản trong .env, lưu phiên vào .auth/cms-<role>.json.
 * Role không có tài khoản → bỏ qua; test của role đó sẽ tự skip.
 */
for (const role of Object.keys(CMS_ROLES) as CmsRole[]) {
  setup(`login CMS [${CMS_ROLES[role].label}]`, async ({ page }) => {
    const cred = credentials(role);
    if (!cred) {
      if (fs.existsSync(authFile(role))) fs.rmSync(authFile(role));
      setup.skip(true, `Chưa có CMS_${role}_ID / CMS_${role}_PASSWORD trong .env`);
      return;
    }
    const login = new LoginScreen(page);
    await login.goto();
    await login.login(cred.loginId, cred.password);
    await expect(page).toHaveURL(new RegExp(`${CMS_ROLES[role].home}(/|$|\\?)`));
    await page.context().storageState({ path: authFile(role) });
  });
}
