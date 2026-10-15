import { test, expect } from '../../../common/fixtures';
import { forRoles } from '../../../common/roles';
import { parseWho } from '../../../common/session';
import { CMS_ROLES } from '../../../data/roles';

/**
 * TC MẪU để dựng khung — không phải TC thật. Xoá khi đã có spec sinh từ TC LOCKED.
 * Quy ước: 1 file = 1 sheet TC (tests/cms/<bộ test>/<scope-key>.spec.ts); 1 test = 1 TC × 1 role;
 * Steps → test.step; 1 TC = 1 expected → 1 expect chính.
 */
forRoles(['99', '98', '01', '02', '05'], (role) => {
  test('SAMPLE-TC-001 Logged-in user opens CMS home', { tag: '@SAMPLE-TC-001' }, async ({ page }) => {
    await test.step('1. Open CMS root', async () => {
      await page.goto('/');
    });
    await test.step('2. Verify redirect to role home', async () => {
      await expect(page).toHaveURL(new RegExp(`${CMS_ROLES[parseWho(role).role].home}(/|$|\\?)`));
    });
  });
});
