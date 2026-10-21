import fs from 'fs';
import path from 'path';
import { expect, test, type Page } from '@playwright/test';
import { env } from '../../common/env';
import { loginAs } from '../../common/session';
import { clickables } from '../../common/ui';
import { CmsLayout } from '../../screens/cms/layout.screen';
import { ChainSystemScreen } from '../../screens/cms/chain-system.screen';
import { TroubleCreateScreen } from '../../screens/cms/trouble-create.screen';
import { TroubleDetailScreen } from '../../screens/cms/trouble-detail.screen';
import { E2E } from '../../common/e2e-suite';
import { N, NR } from '../../common/env-names';

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
    await chain.openChain(N('Linksys'), N('Linksys Chain System'));
    await loaded(NR(/LINKSYS STORE0000\d/));
  });
  const chainUrl = page.url();
  await snap(page, 'chain-edit-form', async () => {
    await clickables(content, /^\s*編集\s*$/).first().click();
    await expect(content.locator('input[placeholder="社名を入力"]')).not.toHaveValue('', { timeout: 30_000 });
  });
  for (const st of [N('LINKSYS STORE00004'), N('LINKSYS STORE00005'), N('LINKSYS STORE00001'), N('LINKSYS STORE00009'), N('LINKSYS STORE00006'), N('LINKSYS STORE00007'), N('LINKSYS STORE00008'), N('LINKSYS STORE00002')]) {
    const key = st.slice(-5);
    await snap(page, `store-${key}-open-list`, async () => { await page.goto(chainUrl); await loaded(NR(/LINKSYS STORE0000\d/)); });
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
  if (!process.env.RECON_PART || process.env.RECON_PART === 'B') for (const [who, store, cat] of [['02:approveType1', '', '水'], ['01', N('LINKSYS STORE00004'), '操作テスト']] as const) {
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
      await chain.openChain(N('Linksys'), N('Linksys Chain System'));
      await loaded(NR(/LINKSYS STORE0000\d/));
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

  // ---- D. 見積もり theo role không phải 99 (manager / store / subadmin / worker company): mở trouble đầu tiên có báo giá,
  //      header '見積もり' (hoặc クイック操作 → 見積もり), mở rộng dòng đầu. KHÔNG bấm 承認する / 差し戻し / 保存.
  if (process.env.RECON_PART === 'D') {
    const who = (process.env.RECON_WHO || '01:m5,02:approveType1,98,05').split(',') as Parameters<typeof loginAs>[1][];
    const html = async (name: string, loc: ReturnType<Page['locator']>) => {
      fs.mkdirSync(OUT, { recursive: true });
      fs.writeFileSync(path.join(OUT, `D-${name}.html`), await loc.evaluate((e) => e.outerHTML).catch((e) => String(e)));
    };
    for (const w of who) {
      const tag = `D-${w.replace(':', '-')}`;
      await snap(page, `${tag}-login`, () => loginAs(page, w, { save: false }));
      await snap(page, `${tag}-list`, async () => {
        if (process.env.RECON_TROUBLE) { await page.goto(`/admin/troubles/${process.env.RECON_TROUBLE}/detail`); return; }
        await layout.menu('進行中のトラブル一覧');
        await content.locator('tbody tr').first().waitFor({ timeout: 30_000 });
        await content.locator('tbody tr').filter({ hasText: /見積|承認/ }).first().locator('td').nth(1).click({ timeout: 15_000 });
      });
      await snap(page, `${tag}-detail`, () => content.getByText('番号').first().waitFor({ timeout: 30_000 }));
      await html(`${tag}-detail-header`, content.locator('.trouble-action').first());
      const est = clickables(content, /^\s*見積もり\s*$/).first();
      const viaHeader = await est.isVisible().catch(() => false);
      await snap(page, `${tag}-estimates`, async () => {
        if (viaHeader) await est.click();
        else {
          await clickables(content, /クイック操作/).first().click();
          await page.locator('.modal.show').filter({ hasText: '状態変更' }).locator('tr', { hasText: '見積もり' }).locator('.fa-edit').first().click();
        }
        await page.locator('.modal.show tr.estimation-row').first().waitFor({ timeout: 20_000 });
      });
      const box = page.locator('.modal.show').filter({ has: page.locator('tr.estimation-row') }).last();
      await html(`${tag}-estimates-modal`, box);
      await snap(page, `${tag}-expand`, async () => {
        await box.locator('tr.estimation-row').first().getByText(/メニュー展開/).first().click();
        await expect(box.locator('tr.estimation-row').first()).toHaveClass(/is-expanded/);
      });
      await html(`${tag}-expanded-modal`, box);
      await page.goto('/').catch(() => undefined);
    }
  }

  // ---- E. Phần còn [chưa dò thật] của E2E-02…39 (KHÔNG 保存 / 決定 / 送信 / 完了):
  //  E1 đăng nhập mọi tài khoản E2E dùng · E2 案件区分 ở 作業依頼編集 role 99 · E3 nút card 作業員 / 店舗 của báo giá (99) + form コピー / 編集
  //  E4 hộp 差し戻し (manager, báo giá 承認待ち) · E5 hộp con PDF ở 報告書 (99). Trouble: RECON_TROUBLE=<id> hoặc tự tìm ở list.
  if (process.env.RECON_PART === 'E') {
    const d = new TroubleDetailScreen(page);
    const html = async (name: string, loc: ReturnType<Page['locator']>) => {
      fs.mkdirSync(OUT, { recursive: true });
      fs.writeFileSync(path.join(OUT, `E-${name}.html`), await loc.evaluate((x) => x.outerHTML, undefined, { timeout: 10_000 }).catch((x) => String(x)));
    };
    const parts = (process.env.RECON_SUB || '1,2,3,4,5').split(',');
    /** Mở trouble: RECON_TROUBLE, không thì list /admin/troubles → thử tối đa 8 dòng khớp filter (cần nút header '見積もり' nếu needEst). */
    const openTrouble = async (filter: RegExp, needEst = false) => {
      if (process.env.RECON_TROUBLE) {
        await page.goto(`/admin/troubles/${process.env.RECON_TROUBLE}/detail`);
        await content.getByText('番号').first().waitFor({ timeout: 30_000 });
        return;
      }
      await page.goto('/admin/troubles');
      await content.locator('tbody tr').first().waitFor({ timeout: 30_000 });
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
      const hrefs = await content.locator('tbody tr').filter({ hasText: filter }).locator('a[href*="/detail"]')
        .evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute('href') ?? ''))].filter(Boolean).slice(0, Number(process.env.RECON_MAX || 8)));
      notes.push(`  list khớp ${filter}: ${hrefs.join(' ')}`);
      for (const h of hrefs) {
        await page.goto(h);
        await content.getByText('番号').first().waitFor({ timeout: 30_000 });
        await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
        if (!needEst || await clickables(content, /^\s*見積もり\s*$/).first().isVisible().catch(() => false)) { notes.push(`  → dùng ${h}`); return; }
      }
      throw new Error(`Không thấy trouble khớp ${filter}${needEst ? ' có nút 見積もり' : ''}`);
    };
    /** Quét trouble (list khớp filter) tới khi 見積一覧 có dòng badge khớp badge → trả về dòng đó (modal đang mở). */
    const findEstimate = async (filter: RegExp, badge: RegExp) => {
      await page.goto('/admin/troubles');
      await content.locator('tbody tr').first().waitFor({ timeout: 30_000 });
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
      const hrefs = await content.locator('tbody tr').filter({ hasText: filter }).locator('a[href*="/detail"]')
        .evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute('href') ?? ''))].filter(Boolean));
      for (const h of hrefs.slice(0, Number(process.env.RECON_MAX || 20))) {
        await page.goto(h);
        await content.getByText('番号').first().waitFor({ timeout: 30_000 });
        await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
        if (!(await clickables(content, /^\s*見積もり\s*$/).first().isVisible().catch(() => false))) continue;
        if (!(await d.openEstimates().then(() => true, () => false))) continue;
        const badges = await d.estimateModal.locator('tr.estimation-row .badge').allInnerTexts().catch(() => []);
        notes.push(`  ${h}: ${badges.map((b) => b.trim()).join(', ')}`);
        const row = d.estimateModal.locator('tr.estimation-row').filter({ has: page.locator('.badge', { hasText: badge }) }).first();
        if (await row.isVisible().catch(() => false)) { notes.push(`  → dùng ${h}`); return row; }
        await page.keyboard.press('Escape').catch(() => undefined);
      }
      throw new Error(`Không thấy báo giá ${badge} trong ${hrefs.length} trouble`);
    };
    const leave = async () => { await page.keyboard.press('Escape').catch(() => undefined); await page.goto('/').catch(() => undefined); };

    if (parts.includes('1')) {
      for (const w of ['01', '01:m2', '01:m3', '01:m4', '01:m5', '02', '02:qnavi', '02:autoApprove', '02:approveType1', '02:approveType2', '02:approveType3', '98', '05'] as const) {
        await snap(page, `E1-login-${w.replace(':', '-')}`, () => loginAs(page, w, { save: false }));
      }
    }
    if (parts.some((p) => ['2', '3', '5'].includes(p))) await snap(page, 'E-admin-login', () => loginAs(page, '99', { save: false }));
    if (parts.includes('2')) {
      await snap(page, 'E2-detail', () => openTrouble(/対応中|問い合わせ中/));
      await snap(page, 'E2-edit', async () => {
        await clickables(content, /^\s*編集\s*$/).first().click();
        await content.getByText('案件区分').first().waitFor({ timeout: 30_000 });
      });
      await html('E2-案件区分', content.locator('tr, .row, .form-group', { has: page.getByText('案件区分', { exact: true }) }).last());
      await leave();
    }
    if (parts.includes('3')) {
      let r3 = d.estimateModal.locator('tr.estimation-row').first();
      await snap(page, 'E3-find', async () => { r3 = await findEstimate(/見積|作業|対応中/, /^\s*(下書き|承認待ち|差し戻し)\s*$/); });
      await snap(page, 'E3-expand', async () => {
        if (!/is-expanded/.test((await r3.getAttribute('class')) ?? '')) await r3.getByText(/メニュー展開/).first().click();
        await expect(r3).toHaveClass(/is-expanded/);
      });
      await html('E3-estimates-modal', d.estimateModal);
      for (const b of ['コピー', '編集']) {
        const btn = clickables(d.estimateModal.locator('.group-worker'), new RegExp(`^\\s*${b}\\s*$`)).first();
        if (!(await btn.isVisible().catch(() => false))) { notes.push(`E3 không thấy nút card 作業員 '${b}'`); continue; }
        await snap(page, `E3-${b}-form`, async () => { await btn.click(); await d.estimateForm.locator('input[name="title"]').waitFor({ timeout: 15_000 }); });
        await html(`E3-${b}-form`, d.estimateForm);
        await snap(page, `E3-${b}-close`, async () => {
          await clickables(d.estimateForm, /^\s*(閉じる|キャンセル|戻る)\s*$/).first().click().catch(() => page.keyboard.press('Escape'));
          const discard = page.locator('.modal.show').filter({ hasText: /破棄/ }).last();
          if (await discard.isVisible().catch(() => false)) await clickables(discard, /^\s*(はい|OK|破棄)\s*$/).first().click();
        });
      }
      await leave();
    }
    if (parts.includes('4')) {
      const mgr = (process.env.RECON_WHO || '01') as Parameters<typeof loginAs>[1];
      await snap(page, 'E4-manager-login', () => loginAs(page, mgr, { save: false }));
      let row = d.estimateModal.locator('tr.estimation-row').first();
      await snap(page, 'E4-find', async () => { row = await findEstimate(/見積承認待ち/, /^\s*(再)?承認待ち\s*$/); });
      await snap(page, 'E4-expand', async () => {
        if (!/is-expanded/.test((await row.getAttribute('class')) ?? '')) await row.getByText(/メニュー展開/).first().click();
        await expect(row).toHaveClass(/is-expanded/);
      });
      await html('E4-estimates-modal', d.estimateModal);
      await snap(page, 'E4-reject-box', async () => {
        await clickables(d.estimateModal.locator('.group-manager'), /^\s*差し戻し\s*$/).first().click();
        await page.locator('.modal.show textarea').filter({ visible: true }).first().waitFor({ timeout: 15_000 });
      });
      await html('E4-reject-box', page.locator('.modal.show').filter({ has: page.locator('textarea') }).last());
      await leave();   // KHÔNG gửi 差し戻し
    }
    if (parts.includes('5')) {
      if (parts.includes('4')) await snap(page, 'E5-admin-login', () => loginAs(page, '99', { save: false }));
      await snap(page, 'E5-detail', () => openTrouble(/作業完了|到着|作業中/));
      await snap(page, 'E5-status-報告済', async () => { await d.openQuickAction(); await d.setFlow('報告済'); });
      await html('E5-status-modal', d.statusModal);
      await snap(page, 'E5-report-edit', async () => {
        await d.editRow('報告書');
        await clickables(d.reportModal, /^\s*編集\s*$/).first().click();
        await d.reportModal.getByText('PDFファイル').first().waitFor({ timeout: 15_000 });
      });
      await html('E5-report-modal', d.reportModal);
      await snap(page, 'E5-pdf-box', async () => {
        const box = await d.choosePdf(['automation.pdf']);
        await box.waitFor({ timeout: 15_000 });
        await html('E5-pdf-box', box);
      });
      await html('E5-pdf-box-any', page.locator('.modal.show').filter({ visible: true }).last());
      await leave();   // KHÔNG 完了 / 保存
    }
  }

  // ---- F. CÓ GHI DỮ LIỆU (Hieu Nguyen cho phép 15/10/2026): tạo 1 báo giá 下書き 'RECON-Draft' trên trouble test → dò card 作業員
  //  (編集 / コピー: mở form rồi đóng, không 決定) → 提示 → manager / store dò hộp 差し戻し (không gửi).
  //  RECON_TROUBLE chưa có → chỉ liệt kê trouble ứng viên (đọc). RECON_APPROVER = tài khoản duyệt (mặc định 02:approveType1).
  if (process.env.RECON_PART === 'F') {
    const d = new TroubleDetailScreen(page);
    const html = async (name: string, loc: ReturnType<Page['locator']>) => {
      fs.mkdirSync(OUT, { recursive: true });
      fs.writeFileSync(path.join(OUT, `F-${name}.html`), await loc.evaluate((x) => x.outerHTML, undefined, { timeout: 10_000 }).catch((x) => String(x)));
    };
    const name = process.env.RECON_EST || 'RECON-Draft';
    if (!process.env.RECON_SKIP_ADMIN) await snap(page, 'F-admin-login', () => loginAs(page, '99', { save: false }));
    if (!process.env.RECON_TROUBLE) {
      await snap(page, 'F-list', async () => {
        await page.goto('/admin/troubles');
        await content.locator('tbody tr').first().waitFor({ timeout: 30_000 });
        await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
        const rows = await content.locator('tbody tr').evaluateAll((trs) => trs.map((tr) =>
          `${tr.querySelector('a[href*="/detail"]')?.getAttribute('href') ?? '-'} | ${(tr.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 200)}`));
        notes.push(...rows.map((r) => `  ${r}`));
      });
    } else {
      const est = d.estimateModal.locator('tr.estimation-row').filter({ has: page.locator('td', { hasText: new RegExp(`^\\s*${name}\\s*$`) }) }).first();
      const expand = async () => {
        if (!/is-expanded/.test((await est.getAttribute('class')) ?? '')) await est.getByText(/メニュー展開/).first().click();
        await expect(est).toHaveClass(/is-expanded/);
      };
      const goTrouble = async () => {
        await page.goto(`/admin/troubles/${process.env.RECON_TROUBLE}/detail`);
        await content.getByText('番号').first().waitFor({ timeout: 30_000 });
        await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
      };
      if (!process.env.RECON_SKIP_ADMIN) {
        await snap(page, 'F-detail', goTrouble);
        await snap(page, 'F-open-estimates', async () => { await d.openQuickAction(); await d.openEstimateFromStatus(); });
        await snap(page, 'F-new-draft', async () => {
          if (await est.isVisible().catch(() => false)) { notes.push(`  '${name}' đã có — dùng lại`); return; }
          const e = new E2E(page, 0);
          await e.newEstimate(name, Number(process.env.RECON_TOTAL || 50_000));
        });
        await snap(page, 'F-draft-expand', expand);
        await html('F-draft-modal', d.estimateModal);
        for (const b of ['編集', 'コピー']) {
          const btn = clickables(d.estimateModal.locator('.group-worker'), new RegExp(`^\\s*${b}\\s*$`)).first();
          if (!(await btn.isVisible().catch(() => false))) { notes.push(`F không thấy nút card 作業員 '${b}' (下書き)`); continue; }
          await snap(page, `F-${b}-form`, async () => { await btn.click(); await d.estimateForm.locator('input[name="title"]').waitFor({ timeout: 15_000 }); });
          await html(`F-${b}-form`, d.estimateForm);
          notes.push(`  ${b}: title='${await d.estimateForm.locator('input[name="title"]').inputValue().catch(() => '?')}'`);
          await snap(page, `F-${b}-close`, async () => {
            const close = clickables(d.estimateForm, /^\s*(閉じる|キャンセル|戻る)\s*$/).first();
            if (await close.isVisible().catch(() => false)) await close.click(); else await d.estimateForm.locator('.close, [aria-label="Close"], [aria-label="閉じる"]').first().click();
            const discard = page.locator('.modal.show').filter({ hasText: /破棄/ }).last();
            if (await discard.waitFor({ timeout: 3_000 }).then(() => true, () => false)) {
              await html(`F-${b}-discard`, discard);
              await clickables(discard, /^\s*(はい|OK|破棄)\s*$/).first().click();
            }
            await expect(d.estimateForm).toBeHidden({ timeout: 10_000 });
            await expect(d.estimateModal).toBeVisible();
          });
          await snap(page, `F-${b}-reexpand`, expand);
        }
        await snap(page, 'F-submit', () => d.submitEstimates([name]));
        notes.push(`  sau 提示: '${(await est.locator('.badge').innerText().catch(() => '?')).trim()}'`);
        await snap(page, 'F-submitted-expand', expand);
        await html('F-submitted-modal', d.estimateModal);
        await page.goto('/').catch(() => undefined);   // không 保存 状態変更

      }
      if (process.env.RECON_SET_FLOW) {   // bước cuối của 提示 trong TC: 状態変更 → 見積承認待ち → 保存 (継続 dùng continuationFlowStatus)
        await snap(page, 'F-flow-login', () => loginAs(page, '99', { save: false }));
        await snap(page, 'F-flow-save', async () => {
          await goTrouble(); await d.openQuickAction();
          if (await d.statusModal.locator('select[name="continuationFlowStatus"]').isVisible().catch(() => false)) await d.setContinuationFlow('見積承認待ち');
          else await d.setFlow('見積承認待ち');
          await d.saveStatus();
        });
      }
      for (const ap of (process.env.RECON_APPROVER || '02:approveType1').split(',') as Parameters<typeof loginAs>[1][]) {
      const tag = ap.replace(':', '-');
      await snap(page, `F-approver-login-${tag}`, () => loginAs(page, ap, { save: false }));
      await snap(page, `F-approver-detail-${tag}`, goTrouble);
      await snap(page, `F-approver-estimates-${tag}`, async () => { if (ap === '99') { await d.openQuickAction(); await d.openEstimateFromStatus(); } else await d.openEstimates(); });
      await snap(page, `F-approver-expand-${tag}`, expand);
      await html(`F-approver-modal-${tag}`, d.estimateModal);
      await snap(page, `F-reject-box-${tag}`, async () => {
        await clickables(d.estimateModal.locator('.group-manager'), /^\s*差し戻し\s*$/).first().click();
        await page.locator('.modal.show').filter({ visible: true }).filter({ has: page.locator('textarea') }).first().waitFor({ timeout: 15_000 });
      });
      await html(`F-reject-box-${tag}`, page.locator('.modal.show').filter({ visible: true }).filter({ has: page.locator('textarea') }).last());
      if (process.env.RECON_REJECT) {   // Hieu Nguyen cho phép 15/10/2026: gửi 差し戻し thật để dò hộp 決定 sau '差し戻し実行'
        const box = page.locator('.modal.show').filter({ hasText: '見積もりを差し戻す' }).last();
        await snap(page, `F-reject-send-${tag}`, async () => {
          await box.locator('textarea[name="reason"]').fill('Automation reject');
          await clickables(box, /^\s*差し戻し実行\s*$/).first().click();
          await page.locator('.modal.show').filter({ visible: true }).filter({ has: clickables(page, /^\s*決定\s*$/) }).filter({ hasNot: page.locator('textarea') }).last().waitFor({ timeout: 15_000 });
        });
        await html(`F-reject-confirm-${tag}`, page.locator('.modal.show').filter({ visible: true }).filter({ hasNot: page.locator('textarea') }).last());
        await snap(page, `F-reject-decide-${tag}`, async () => {
          await clickables(page.locator('.modal.show').filter({ visible: true }).last(), /^\s*決定\s*$/).first().click();
          await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
        });
        await html(`F-reject-after-${tag}`, page.locator('.modal.show').filter({ visible: true }).last());
        await snap(page, `F-reject-ok-${tag}`, () => d.reopenAfterOk());
        notes.push(`  sau 差し戻し: '${(await est.locator('.badge').innerText().catch(() => '?')).trim()}'`);
      }
      await page.goto('/').catch(() => undefined);   // KHÔNG gửi 差し戻し
      }
    }
  }

  // ---- S. CÓ GHI DỮ LIỆU (Hieu Nguyen cho phép 16/10/2026): tạo tài sản RECON_ASSET (mặc định 'TEST AUTOMATION') cho store RECON_STORE
  //  (mặc định 'LINKSYS STORE00006') ở 資産情報 › /admin/asset-management/<chainId>/create — dữ liệu cần có trước cho E2E-38.
  if (process.env.RECON_PART === 'S') {
    const asset = process.env.RECON_ASSET || 'TEST AUTOMATION';
    const store = process.env.RECON_STORE || N('LINKSYS STORE00006');
    const html = async (name: string, loc: ReturnType<Page['locator']>) => {
      fs.mkdirSync(OUT, { recursive: true });
      fs.writeFileSync(path.join(OUT, `S-${name}.html`), await loc.evaluate((x) => x.outerHTML, undefined, { timeout: 10_000 }).catch((x) => String(x)));
    };
    await snap(page, 'S-login', () => loginAs(page, '99', { save: false }));
    await snap(page, 'S-form', async () => {
      await page.goto(`/admin/asset-management/${process.env.RECON_CHAIN_ID || '1856'}/create`);
      await content.getByRole('textbox', { name: '名称を入力' }).waitFor({ timeout: 30_000 });
    });
    await snap(page, 'S-name', () => content.getByRole('textbox', { name: '名称を入力' }).fill(asset));
    await snap(page, 'S-store-modal', async () => {
      await clickables(content, /チェーン店舗選択/).first().click();
      await page.locator('.modal.show').filter({ visible: true }).last().waitFor({ timeout: 15_000 });
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
    });
    const box = page.locator('.modal.show').filter({ visible: true }).last();
    await html('store-modal', box);
    await snap(page, 'S-store-pick', async () => {
      const name = box.locator('input[name="storeName"], input[name="name"]').first();
      if (await name.isVisible().catch(() => false)) { await name.fill(store); await clickables(box, /^\s*検索\s*$/).first().click(); }
      const row = box.locator('tbody tr').filter({ has: page.locator('td', { hasText: new RegExp(`^\\s*${store}\\b`) }) }).first();
      await row.waitFor({ timeout: 20_000 });
      await html('store-row', row);
      const pick = clickables(row, /^\s*選択\s*$/).first();
      if (await pick.isVisible().catch(() => false)) await pick.click(); else await row.locator('td').nth(1).click();
      await expect(content).toContainText(store, { timeout: 15_000 });
    });
    await html('form-filled', content);
    await snap(page, 'S-save', async () => {
      await clickables(content, /^\s*保存\s*$/).first().click();
      const confirm = page.locator('.modal.show').filter({ visible: true }).filter({ has: clickables(page, /^\s*決定\s*$/) }).last();
      if (await confirm.waitFor({ timeout: 5_000 }).then(() => true, () => false)) { await html('save-confirm', confirm); await clickables(confirm, /^\s*決定\s*$/).first().click(); }
      const ok = page.locator('.modal.show').filter({ visible: true }).filter({ has: clickables(page, /^\s*OK\s*$/) }).last();
      if (await ok.waitFor({ timeout: 30_000 }).then(() => true, () => false)) { await html('save-ok', ok); await clickables(ok, /^\s*OK\s*$/).first().click(); }
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
      notes.push(`  sau 保存: ${page.url()}`);
    });
  }

  // ---- K. 継続依頼 (CHỈ ĐỌC): 98 → 作業依頼登録 → 継続依頼 → chọn trouble gốc RECON_NUMBER → chụp form (không bấm 決定して問合わせ);
  //  mở chi tiết trouble gốc RECON_ID và '_2' RECON_ID2 để xem 作業項目 / version.
  if (process.env.RECON_PART === 'K') {
    const create = new TroubleCreateScreen(page);
    const html = async (name: string, loc: ReturnType<Page['locator']>) => {
      fs.mkdirSync(OUT, { recursive: true });
      fs.writeFileSync(path.join(OUT, `K-${name}.html`), await loc.evaluate((x) => x.outerHTML, undefined, { timeout: 10_000 }).catch((x) => String(x)));
    };
    await snap(page, 'K-login-98', () => loginAs(page, '98', { save: false }));
    notes.push(`  sau login 98: ${page.url()}`);
    await snap(page, 'K-cont-form', async () => {
      await layout.menu('作業依頼登録'); await create.start('継続依頼');
      await create.pickContinuationSource(process.env.RECON_NUMBER || '223470078');
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
    });
    await html('cont-form', content);
    for (const id of [process.env.RECON_ID || '43907', process.env.RECON_ID2 || '43908']) {
      await snap(page, `K-detail-${id}`, async () => {
        await page.goto(`/admin/troubles/${id}/detail`);
        await content.getByText('番号').first().waitFor({ timeout: 30_000 });
        await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
      });
      await html(`detail-${id}`, content);
    }
  }

  // ---- U. Mở 1 URL bất kỳ bằng tài khoản RECON_WHO (mặc định 99) và chụp: RECON_PART=U RECON_URL=/admin/... npm run recon:e2e
  if (process.env.RECON_PART === 'U') {
    const who = (process.env.RECON_WHO || '99') as Parameters<typeof loginAs>[1];
    await snap(page, 'U-login', () => loginAs(page, who, { save: false }));
    await snap(page, 'U-page', async () => {
      await page.goto(process.env.RECON_URL || '/');
      await content.locator('td, th').first().waitFor({ timeout: 30_000 });
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
    });
  }

  fs.writeFileSync(path.join(OUT, '_summary.txt'), notes.join('\n') + '\n');
  await context.close();
});
