import fs from 'fs';
import path from 'path';
import { test, type Page } from '@playwright/test';
import data from '../../data/e2e-trouble-flow.json';
import { credentials } from '../../data/roles';
import { env } from '../../common/env';
import { clickables, field, modal } from '../../common/ui';
import { LoginScreen } from '../../screens/cms/login.screen';
import { CmsLayout } from '../../screens/cms/layout.screen';

/**
 * RECON — đi qua các màn hình CMS, KHÔNG lưu dữ liệu, chụp ảnh + cây phần tử (aria snapshot) từng bước
 * vào reports/recon-<lần chạy>/. Dùng để lấy locator thật trước khi viết / sửa screens/ (automation/lessons R01).
 * Không bấm 保存 / 決定 / 提示する / 決定して問合わせ. Bước nào lỗi vẫn ghi lại và đi tiếp.
 *
 * Chạy:  npm run recon                       (màn chi tiết lấy trouble đầu tiên trong danh sách)
 *        E2E_TROUBLE_ID=1234 npm run recon   (dùng trouble cụ thể)
 */
const OUT = path.resolve(__dirname, `../../reports/recon-${process.env.RUN_ID ?? Date.now()}`);
let n = 0;
const notes: string[] = [];

async function snap(page: Page, name: string, action?: () => Promise<unknown>): Promise<boolean> {
  n += 1;
  const id = String(n).padStart(2, '0');
  let ok = true;
  if (action) {
    try {
      await action();
      await page.waitForLoadState('networkidle', { timeout: 5_000 }).catch(() => undefined);
    } catch (e) {
      ok = false;
      notes.push(`${id} ${name}: LỖI ${(e as Error).message.split('\n')[0]}`);
    }
  }
  fs.mkdirSync(OUT, { recursive: true });
  const aria = await page.locator('body').ariaSnapshot({ timeout: 10_000 }).catch((e) => `# không lấy được: ${e}`);
  fs.writeFileSync(path.join(OUT, `${id}-${name}.yml`), `# ${page.url()}\n${aria}\n`);
  await page.screenshot({ path: path.join(OUT, `${id}-${name}.png`), timeout: 10_000 }).catch(() => undefined);
  if (ok) notes.push(`${id} ${name}: ok`);
  return ok;
}
const esc = async (page: Page) => { await page.keyboard.press('Escape').catch(() => undefined); };
async function closeTop(page: Page) {
  const box = modal(page);
  if (!(await box.isVisible().catch(() => false))) return;
  const x = box.locator('button.close, .btn-close, [aria-label="Close"], [aria-label="閉じる"]').filter({ visible: true }).first();
  if (await x.isVisible().catch(() => false)) await x.click();
  else {
    const btn = clickables(box, /^\s*(閉じる|キャンセル|戻る|決定する)\s*$/).first();
    if (await btn.isVisible().catch(() => false)) await btn.click(); else await esc(page);
  }
}

test('recon CMS screens (read-only)', async ({ browser }) => {
  test.setTimeout(600_000);
  const context = await browser.newContext({ baseURL: env.cmsBaseUrl, httpCredentials: env.httpCredentials, locale: 'ja-JP', timezoneId: 'Asia/Tokyo', viewport: { width: 1600, height: 1000 } });
  context.setDefaultTimeout(5_000);
  const page = await context.newPage();
  page.on('dialog', (d) => d.accept().catch(() => undefined)); // beforeunload khi rời form
  const login = new LoginScreen(page);
  const layout = new CmsLayout(page);
  const content = page.locator('.content-wrapper').first();
  const admin = credentials('99');
  if (!admin) throw new Error('Thiếu CMS_99_* trong .env');

  // ---- Login / dashboard
  await snap(page, 'login', () => login.goto());
  await snap(page, 'dashboard', () => login.login(admin.loginId, admin.password));

  // ---- 作業依頼登録 (không bấm 決定して問合わせ)
  await snap(page, 'create-step0', () => layout.menu('作業依頼登録'));
  await snap(page, 'create-mode-step', async () => {
    await page.getByRole('radio', { name: '新規依頼' }).check();
    await clickables(content, '次へ').first().click();
  });
  await snap(page, 'create-store-step', async () => {
    if (await page.getByRole('radio', { name: /操作可能モード/ }).first().isVisible().catch(() => false)) {
      await clickables(content, '次へ').first().click();
    }
    await clickables(content, /チェーン店舗?選択/).first().waitFor();
  });
  await snap(page, 'create-store-search-modal', () => clickables(content, /チェーン店舗?選択/).first().click());
  await snap(page, 'create-store-search-expanded', () => modal(page, '検索条件').getByText('検索条件', { exact: true }).first().click());
  await snap(page, 'create-store-search-result', async () => {
    const box = modal(page, '検索条件');
    await field(box, '社名').fill(data.store.companyQuery);
    await field(box, '店名').fill(data.store.storeQuery);
    await clickables(box, '検索').first().click();
  });
  await snap(page, 'create-store-picked', () =>
    clickables(modal(page, '検索条件').locator('tr').filter({ hasText: data.store.storeName }).first(), '選択').first().click());
  await snap(page, 'create-staff-modal', () => clickables(content, '担当者選択').first().click());
  await snap(page, 'create-staff-picked', () =>
    clickables(modal(page, '担当者選択').locator('tbody tr').first(), '選択').first().click());
  await snap(page, 'create-category-step', async () => {
    await clickables(content, '次へ').first().click();
    await content.getByText('故障内容').first().waitFor();
  });
  await snap(page, 'create-category-modal', () => clickables(content, '選択').nth(0).click());
  await snap(page, 'create-category-large', () => modal(page).getByText(data.categories.large, { exact: true }).first().click());
  await snap(page, 'create-category-medium', async () => {
    await clickables(content, '選択').nth(1).click();
    await modal(page).getByText(data.categories.medium, { exact: true }).first().click();
  });
  await snap(page, 'create-category-small', async () => {
    await clickables(content, '選択').nth(2).click();
    await modal(page).getByText(data.categories.small, { exact: true }).first().click();
  });
  await snap(page, 'create-asset-checkbox', () =>
    content.getByText(/対象資産がある場合はチェックを入れてください/).first().click());
  await snap(page, 'create-asset-select-modal', () => clickables(content, '修理対象資産選択').first().click());
  await snap(page, 'create-asset-register-modal', () => clickables(modal(page), '新しい機器を登録する').first().click());
  await snap(page, 'create-asset-date-picker', () => field(modal(page, '資産登録'), '設置・納入日').click());
  await snap(page, 'create-asset-photo-dialog', async () => {
    await esc(page);
    await clickables(modal(page, '資産登録'), '写真を選択').first().click();
  });
  await snap(page, 'create-asset-modals-closed', async () => { await closeTop(page); await closeTop(page); await closeTop(page); });
  await snap(page, 'create-fault-step', () => clickables(content, '次へ').first().click());
  await snap(page, 'create-fault-expected-date', () =>
    page.getByRole('radio', { name: data.expectedDate.option }).or(content.getByText(data.expectedDate.option, { exact: true })).first().click());

  // ---- Danh sách + chi tiết (chỉ mở / đóng modal, KHÔNG 保存)
  const loaded = async () => {
    await page.waitForURL(/\/detail/);
    await page.locator('xpath=//*[self::td or self::th][normalize-space(text())="番号"]/following-sibling::*[1]').filter({ hasText: /\d/ }).first().waitFor({ timeout: 20_000 });
  };
  const openRow = async (status: string) => {
    await page.goto('/admin/troubles');
    const row = page.locator('tbody tr').filter({ hasText: status }).first();
    await row.getByRole('link').first().click();
    await loaded();
  };
  await snap(page, 'trouble-list', async () => {
    await page.goto('/admin/troubles');
    await page.locator('tbody tr a').first().waitFor();
  });

  // (a) trouble 問い合わせ中: 状態変更 → chọn 対応中 (không lưu) để thấy dòng 作業者
  await snap(page, 'detail-new', () => process.env.E2E_TROUBLE_ID
    ? page.goto(`/admin/troubles/${process.env.E2E_TROUBLE_ID}/detail`).then(loaded) : openRow('問い合わせ中'));
  await snap(page, 'detail-new-quick-action', () => clickables(content, 'クイック操作').first().click());
  await snap(page, 'detail-new-status-taiouchu', () => field(modal(page, '状態変更'), '状態').selectOption({ label: '対応中' }));
  await snap(page, 'detail-new-worker-search', () =>
    modal(page, '状態変更').locator('xpath=.//*[self::td or self::th][normalize-space(text())="作業者"]/following-sibling::*[1]')
      .locator('i, svg, [class*="fa-"], button').filter({ visible: true }).last().click());
  await snap(page, 'detail-new-worker-search-expanded', () => modal(page, '検索条件').getByText('検索条件', { exact: true }).first().click());
  await snap(page, 'detail-new-closed', async () => { await closeTop(page); await closeTop(page); });
  await snap(page, 'edit-page', () => clickables(content, '編集').first().click());
  await snap(page, 'edit-change-modal', () =>
    clickables(page.locator('xpath=//*[self::td or self::th][normalize-space()="作業項目（大）"]/..').first(), '変更').first().click());
  await snap(page, 'edit-closed', async () => { await closeTop(page); await clickables(content, '戻る').first().click(); });

  // (b) trouble 報告済: các modal header + 状態変更 (見積もり / 報告書)
  await snap(page, 'detail-reported', () => openRow('報告済'));
  for (const b of ['見積もり', '報告書', '資産一覧', '履歴', '立候補', '見積稟議進捗']) {
    await snap(page, `detail-reported-${b}`, () => clickables(content, b).first().click());
    await snap(page, `detail-reported-${b}-closed`, () => closeTop(page));
  }
  await snap(page, 'detail-reported-quick-action', () => clickables(content, 'クイック操作').first().click());
  await snap(page, 'detail-reported-estimate-from-status', () =>
    modal(page, '状態変更').locator('xpath=.//*[self::td or self::th][normalize-space(text())="見積もり"]/following-sibling::*[1]')
      .locator('i, svg, [class*="fa-"], button').filter({ visible: true }).last().click());
  await snap(page, 'detail-reported-estimate-closed', () => closeTop(page));
  await snap(page, 'detail-reported-report-from-status', () =>
    modal(page, '状態変更').locator('xpath=.//*[self::td or self::th][normalize-space(text())="報告書"]/following-sibling::*[1]')
      .locator('i, svg, [class*="fa-"], button').filter({ visible: true }).last().click());
  await snap(page, 'detail-reported-all-closed', async () => { await closeTop(page); await closeTop(page); });

  // ---- Manager (01)
  const mgr = credentials('01');
  if (mgr) {
    await snap(page, 'logout-confirm', () => page.getByRole('button', { name: 'ログアウト', exact: true }).click());
    await snap(page, 'logout-done', () => clickables(modal(page), '決定').first().click());
    await snap(page, 'manager-dashboard', () => login.login(mgr.loginId, mgr.password));
    await snap(page, 'manager-trouble-list', () => layout.menu('進行中のトラブル一覧'));
    await snap(page, 'manager-trouble-detail', async () => {
      const row = page.locator('tbody tr').filter({ hasText: '報告済' }).first();
      await (await row.isVisible().catch(() => false) ? row : page.locator('tbody tr').first()).getByRole('link').first().click();
      await loaded();
    });
    for (const b of ['見積もり', '作業完了確認']) {
      await snap(page, `manager-header-${b}`, () => clickables(content, b).first().click());
      await snap(page, `manager-header-${b}-closed`, () => closeTop(page));
    }
  }

  fs.writeFileSync(path.join(OUT, '_summary.txt'), notes.join('\n') + '\n');
  test.info().annotations.push({ type: 'recon', description: OUT });
  await context.close();
});
