import fs from 'fs';
import path from 'path';
import { test, type Page } from '@playwright/test';
import { env } from '../../common/env';
import { loginAs, type Who } from '../../common/session';
import { click } from '../../common/ui';
import { CmsLayout } from '../../screens/cms/layout.screen';
import { ChainSystemScreen } from '../../screens/cms/chain-system.screen';

/**
 * RECON tên hiển thị theo môi trường — KHÔNG lưu dữ liệu.
 * Đăng nhập từng tài khoản trong env/<ENV>.json, ghi lại tên chain / store / manager / worker company thật
 * để điền tên đúng cho môi trường (vd est-test dùng tài khoản arabica…).
 * Chạy:  ENV=est-test npm run recon:names  [CHAIN_QUERY=arabica]  → reports/_tmp_chk/recon-names/ (tạm, ghi đè)
 */
const OUT = path.resolve(__dirname, '../../reports/_tmp_chk/recon-names');
try { fs.rmSync(OUT, { recursive: true, force: true }); } catch { /* ghi đè */ }
const notes: string[] = [];
let n = 0;
async function snap(page: Page, name: string, action?: () => Promise<unknown>) {
  const id = String(++n).padStart(2, '0');
  try { if (action) await action(); await page.waitForLoadState('networkidle', { timeout: 8_000 }).catch(() => undefined); notes.push(`${id} ${name}: ok`); }
  catch (e) { notes.push(`${id} ${name}: LỖI ${(e as Error).message.split('\n')[0]}`); }
  fs.mkdirSync(OUT, { recursive: true });
  const aria = await page.locator('body').ariaSnapshot({ timeout: 10_000 }).catch((e) => `# không lấy được: ${String(e).split('\n')[0]}`);
  fs.writeFileSync(path.join(OUT, `${id}-${name}.yml`), `# ${page.url()}\n${aria}\n`);
  await page.screenshot({ path: path.join(OUT, `${id}-${name}.png`), fullPage: true, timeout: 10_000 }).catch(() => undefined);
}

test('recon tên hiển thị (read-only)', async ({ page }) => {
  test.setTimeout(10 * 60_000);
  const q = process.env.CHAIN_QUERY ?? 'arabica';
  await snap(page, 'admin-login', () => loginAs(page, '99'));
  const chain = new ChainSystemScreen(page);
  await snap(page, 'chain-search', async () => {
    await new CmsLayout(page).menu('チェーンシステム情報');
    await chain.expandSearch();
    await page.locator('input[name="companyName"]').fill(q);
    await click(page, '検索');
    await page.locator('tbody tr').first().waitFor({ timeout: 15_000 });
  });
  await snap(page, 'chain-detail-stores', async () => {
    await page.locator('tbody tr').first().locator('td').nth(1).click();
    await page.waitForURL(/\/chain-systems\/\d+\/stores/, { timeout: 15_000 });
  });
  const accounts = env.accounts ?? {};
  const whos: Who[] = ['98', '01', '05'] as Who[];
  for (const v of Object.keys((accounts['01'] as any)?.variants ?? {})) whos.push(`01:${v}` as Who);
  for (const v of Object.keys((accounts['02'] as any)?.variants ?? {})) whos.push(`02:${v}` as Who);
  for (const who of whos) await snap(page, `login-${who.replace(':', '-')}`, () => loginAs(page, who));
  fs.writeFileSync(path.join(OUT, '_summary.txt'), `ENV=${env.name}\n` + notes.join('\n') + '\n');
});
