import fs from 'fs';
import path from 'path';
import { expect, test, type Page } from '@playwright/test';
import { env } from '../../common/env';
import { loginAs } from '../../common/session';
import { clickables } from '../../common/ui';
import { CmsLayout } from '../../screens/cms/layout.screen';
import { ChainSystemScreen } from '../../screens/cms/chain-system.screen';
import { TroubleCreateScreen } from '../../screens/cms/trouble-create.screen';

/**
 * RECON E2E suite — KHÔNG lưu dữ liệu. Lấy cây phần tử thật (R01) cho 2 màn chưa có trong screens/:
 *  A. チェーンシステム情報 (role 99): chi tiết chain Linksys (シサンNAVI / トラブルナビ), chi tiết store (承認タイプ, 限度額), màn 編集 (không lưu).
 *  B. 作業依頼登録 bằng webview トラブルナビ (role 02 store, role 01 manager): chọn big category, đi tới bước trước 'このまま依頼する'.
 * Không bấm 保存 / 決定 / 依頼する / このまま依頼する. Bước lỗi vẫn ghi lại và đi tiếp.
 * Ghi cả nội dung iframe và tab mới (webview có thể mở trong iframe / tab).
 *
 * Chạy:  npm run recon:e2e      (ENV=... để đổi môi trường) → reports/_tmp_chk/recon-e2e/ (tạm, ghi đè)
 */
// Thư mục TẠM duy nhất, mỗi lần chạy ghi đè (không lưu lâu dài): locator rút ra ghi vào screens/, bài học vào automation/lessons/.
const OUT = path.resolve(__dirname, '../../reports/_tmp_chk/recon-e2e');
try { fs.rmSync(OUT, { recursive: true, force: true }); } catch { /* không xoá được thì ghi đè */ }
let n = 0;
const notes: string[] = [];

async function snap(page: Page, name: string, action?: () => Promise<unknown>): Promise<boolean> {
  n += 1;
  const id = String(n).padStart(2, '0');
  let ok = true;
  if (action) {
    try {
      await action();
      await page.waitForLoadState('networkidle', { timeout: 8_000 }).catch(() => undefined);
    } catch (e) {
      ok = false;
      notes.push(`${id} ${name}: LỖI ${(e as Error).message.split('\n')[0]}`);
    }
  }
  fs.mkdirSync(OUT, { recursive: true });
  const parts: string[] = [`# ${page.url()}`];
  for (const f of page.frames()) {
    const aria = await f.locator('body').ariaSnapshot({ timeout: 10_000 }).catch((e) => `# không lấy được: ${String(e).split('\n')[0]}`);
    parts.push(`\n### frame ${f === page.mainFrame() ? 'MAIN' : f.url()}\n${aria}`);
  }
  fs.writeFileSync(path.join(OUT, `${id}-${name}.yml`), parts.join('\n') + '\n');
  await page.screenshot({ path: path.join(OUT, `${id}-${name}.png`), timeout: 10_000, fullPage: true }).catch(() => undefined);
  if (ok) notes.push(`${id} ${name}: ok · frames=${page.frames().length}`);
  return ok;
}

test('recon E2E suite screens (read-only)', async ({ browser }) => {
  test.setTimeout(900_000);
  const context = await browser.newContext({ baseURL: env.cmsBaseUrl, httpCredentials: env.httpCredentials, locale: 'ja-JP', timezoneId: 'Asia/Tokyo', viewport: { width: 1600, height: 1000 } });
  context.setDefaultTimeout(8_000);
  const popups: Page[] = [];
  context.on('page', (p) => { popups.push(p); notes.push(`(tab mới) ${p.url()}`); });
  const page = await context.newPage();
  page.on('dialog', (d) => d.accept().catch(() => undefined));
  const layout = new CmsLayout(page);
  const chain = new ChainSystemScreen(page);
  const content = page.locator('.content-wrapper').first();

  // ---- A. チェーンシステム情報 (99) — chờ dữ liệu tải (R03 / R05) rồi mới chụp
  const loaded = (t: string | RegExp) => content.getByText(t).first().waitFor({ timeout: 30_000 });
  if (!process.env.RECON_PART || process.env.RECON_PART === 'A') {
  await snap(page, 'admin-login', () => loginAs(page, '99', { save: false }));
  await snap(page, 'chain-list', () => layout.menu('チェーンシステム情報'));
  await snap(page, 'chain-detail', async () => {
    await chain.openChain('Linksys', 'Linksys Chain System');
    await loaded(/LINKSYS STORE0000\d/);
  });
  const chainUrl = page.url();
  await snap(page, 'chain-edit-form', async () => {
    await clickables(content, /^\s*編集\s*$/).first().click();
    await expect(content.locator('input[placeholder="社名を入力"]')).not.toHaveValue('', { timeout: 30_000 });
  });
  for (const st of ['LINKSYS STORE00004', 'LINKSYS STORE00005', 'LINKSYS STORE00001', 'LINKSYS STORE00009', 'LINKSYS STORE00006', 'LINKSYS STORE00007', 'LINKSYS STORE00008', 'LINKSYS STORE00002']) {
    const key = st.slice(-5);
    await snap(page, `store-${key}-open-list`, async () => { await page.goto(chainUrl); await loaded(/LINKSYS STORE0000\d/); });
    const ok = await snap(page, `store-${key}-detail`, async () => {
      const row = content.locator('tbody tr').filter({ has: page.locator('td', { hasText: new RegExp(`^\\s*${st}\\b`) }) }).first();
      await row.locator('td').nth(1).click({ timeout: 15_000 });
      await page.waitForURL(/\/stores\/\d+\/detail/, { timeout: 15_000 });
      await loaded(st);
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
    });
    if (ok && (key === '00004' || key === '00005')) {
      await snap(page, `store-${key}-edit-form`, async () => {
        await clickables(content, /^\s*編集\s*$/).first().click();
        await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
      });
    }
  }

  }

  // ---- B. 作業依頼登録 → Step 2 作業項目選択 → thẻ category (webview トラブルナビ?)
  const create = new TroubleCreateScreen(page);
  if (!process.env.RECON_PART || process.env.RECON_PART === 'B') for (const [who, store, cat] of [['02:approveType1', '', '水'], ['01', 'LINKSYS STORE00004', '操作テスト']] as const) {
    const tag = who.replace(':', '-');
    await snap(page, `${tag}-login`, () => loginAs(page, who, { save: false }));
    await snap(page, `${tag}-create-step1`, async () => { await layout.menu('作業依頼登録'); await loaded('Step 1'); });
    if (store) {
      await snap(page, `${tag}-pick-store`, async () => {
        await create.openChainStoreSearch();
        await create.expandSearch('店名').catch(() => undefined);
        await create.fillSearch('店名', store).catch(() => undefined);
        await create.search();
        await create.pickStore(store);
      });
    }
    await snap(page, `${tag}-staff`, async () => { await create.openStaff(); await create.pickFirstStaff(); });
    await snap(page, `${tag}-step2`, async () => { await create.next('作業項目選択'); await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined); });
    await snap(page, `${tag}-open-fault-card`, async () => {
      await create.openCategory(0);
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
      await page.getByText(cat, { exact: true }).first().waitFor({ timeout: 30_000 }).catch(() => undefined);
    });
    await snap(page, `${tag}-click-${cat}`, async () => {
      const t = page.locator('.modal.show').getByText(cat, { exact: true }).first();
      await t.waitFor({ timeout: 30_000 });
      await t.dispatchEvent('click');
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
    });
    for (const p of popups.splice(0)) {
      await p.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
      await snap(p, `${tag}-popup`);
    }
    await page.goto('/').catch(() => undefined);   // rời form, không lưu
  }

  // ---- C. HTML công tắc シサンNAVI + đi sâu webview トラブルNAVI (dừng trước '依頼する', không tạo trouble)
  if (process.env.RECON_PART === 'C') {
    await snap(page, 'C-admin-login', () => loginAs(page, '99', { save: false }));
    await snap(page, 'C-chain-edit', async () => {
      await layout.menu('チェーンシステム情報');
      await chain.openChain('Linksys', 'Linksys Chain System');
      await loaded(/LINKSYS STORE0000\d/);
      await clickables(content, /^\s*編集\s*$/).first().click();
      await expect(content.locator('input[placeholder="社名を入力"]')).not.toHaveValue('', { timeout: 30_000 });
      for (const label of ['シサンNAVI', 'トラブルNAVI']) {
        const html = await content.locator('tr', { has: page.locator('th, td', { hasText: new RegExp(`^\\s*${label}\\s*$`) }) }).first().evaluate((e) => e.outerHTML);
        fs.mkdirSync(OUT, { recursive: true });
        fs.writeFileSync(path.join(OUT, `C-${label}.html`), html);
      }
    });
    const create = new TroubleCreateScreen(page);
    await snap(page, 'C-store-login', () => loginAs(page, '02:approveType1', { save: false }));
    await snap(page, 'C-step2', async () => {
      await layout.menu('作業依頼登録'); await loaded('Step 1');
      await create.openStaff(); await create.pickFirstStaff(); await create.next('作業項目選択');
      await create.openCategory(0);
      const t = page.locator('.modal.show').getByText('水', { exact: true }).first();
      await t.waitFor({ timeout: 30_000 }); await t.dispatchEvent('click');
    });
    const f = page.frameLocator('iframe').first();
    await snap(page, 'C-webview-loaded', () => f.getByRole('heading', { name: 'トラブル相談内容' }).waitFor({ timeout: 30_000 }));
    const iframeHtml = async (name: string) => {
      const h = await page.frames().find((x) => x !== page.mainFrame())?.content().catch(() => '');
      fs.writeFileSync(path.join(OUT, `C-${name}.html`), h ?? '');
    };
    await iframeHtml('webview-1');
    for (const [i, h] of ['中項目', '小項目', '症状'].entries()) {
      await snap(page, `C-pick-${h}`, async () => {
        const row = f.locator('div.flex', { has: f.locator('h5', { hasText: new RegExp(`^${h}$`) }) }).last();
        await expect(row.locator('.ant-select')).not.toHaveClass(/ant-select-disabled/, { timeout: 15_000 });
        const list = await row.locator('input[role=combobox]').getAttribute('aria-controls');
        const opt = f.locator('.ant-select-dropdown', { has: f.locator(`[id="${list}"]`) }).locator('.ant-select-item-option').first();
        await expect(async () => {
          await row.locator('.ant-select-selector').dispatchEvent('mousedown');
          await expect(opt).toBeVisible({ timeout: 2_000 });
        }).toPass({ timeout: 20_000 }).catch(async (e) => {
          fs.writeFileSync(path.join(OUT, `C-row-${h}.html`), await row.evaluate((e2) => e2.outerHTML).catch(() => ''));
          await iframeHtml(`webview-fail-${h}`); throw e;
        });
        await iframeHtml(`webview-open-${h}`);
        await opt.dispatchEvent('click');
        await expect(row.locator('.ant-select-selection-item')).toBeVisible({ timeout: 10_000 });
      });
    }
    await snap(page, 'C-next-1', async () => { await f.getByRole('button', { name: '次へ' }).click(); });
    await iframeHtml('webview-2');
    await snap(page, 'C-konomama-1', async () => { await f.getByText('このまま依頼する').first().click(); });
    await iframeHtml('webview-3');
    await snap(page, 'C-chat-loaded', () => f.getByRole('button', { name: '写真を撮影する' }).waitFor({ timeout: 30_000 }));
    await snap(page, 'C-photo', async () => {
      const [chooser] = await Promise.all([
        page.waitForEvent('filechooser', { timeout: 10_000 }).catch(() => null),
        f.getByRole('button', { name: '写真を撮影する' }).click(),
      ]);
      const file = path.resolve(__dirname, '../../data/files/hieu6.jpg');
      if (chooser) await chooser.setFiles(file);
      else await f.locator('input[type=file]').first().setInputFiles(file);
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
    });
    await iframeHtml('webview-5');
    await snap(page, 'C-after-photo', () => f.locator('textarea, input[type=text]').first().waitFor({ timeout: 20_000 }));
    await iframeHtml('webview-6');
    await snap(page, 'C-text-send', async () => {
      await f.getByRole('textbox', { name: /故障の詳細を記入してください/ }).fill('AUTOMATION');
      await f.getByRole('textbox', { name: /故障の詳細を記入してください/ }).locator('xpath=following::button[1]').click();
      await f.getByText('依頼する', { exact: true }).first().waitFor({ timeout: 30_000 }).catch(() => undefined);
    });
    await iframeHtml('webview-7');
    await page.goto('/').catch(() => undefined);   // rời form, KHÔNG bấm 依頼する
  }

  fs.writeFileSync(path.join(OUT, '_summary.txt'), notes.join('\n') + '\n');
  await context.close();
});
