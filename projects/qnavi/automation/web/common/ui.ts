import { expect, type Locator, type Page } from '@playwright/test';
import { waitApisIdle } from './wait';

/**
 * Helper thao tác UI chung cho CMS (Bootstrap modal, nút theo label tiếng Nhật).
 * Locator tìm theo chữ hiển thị trên màn hình (label trong TC), không phụ thuộc class / id.
 */
type Scope = Page | Locator;

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** Khớp đúng cả chuỗi (bỏ khoảng trắng đầu/cuối). */
export const exact = (s: string) => new RegExp(`^\\s*${esc(s)}\\s*$`);
const toRe = (n: string | RegExp) => (typeof n === 'string' ? exact(n) : n);

const CLICKABLE = 'button, a, [role="button"], input[type="button"], input[type="submit"], label.btn';

/** Tất cả nút / link có chữ = name (đang hiển thị). Dùng .nth(i) khi có nhiều nút cùng tên. */
export function clickables(scope: Scope, name: string | RegExp): Locator {
  const byText = scope.locator(CLICKABLE).filter({ hasText: toRe(name) });
  const byValue = typeof name === 'string'
    ? scope.locator(`input[type="button"][value="${name}"], input[type="submit"][value="${name}"]`)
    : byText;
  return byText.or(byValue).filter({ visible: true });
}
export const clickable = (scope: Scope, name: string | RegExp) => clickables(scope, name).first();
export async function click(scope: Scope, name: string | RegExp): Promise<void> {
  await clickable(scope, name).click();
}

/** Modal / dialog đang mở (trên cùng). title: chữ có trong modal để chọn đúng modal. */
export function modal(page: Page, title?: string | RegExp): Locator {
  const all = page.locator('.modal.show, [role="dialog"]').filter({ visible: true });
  return (title ? all.filter({ hasText: title }) : all).last();
}
/** Modal có nút tên btn (vd 決定, OK). */
export function modalWithButton(page: Page, btn: string): Locator {
  return page.locator('.modal.show, [role="dialog"]').filter({ visible: true })
    .filter({ has: page.locator(CLICKABLE).filter({ hasText: exact(btn) }) }).last();
}

/** Bấm 決定 trong hộp xác nhận (kiểm câu hỏi nếu truyền expectText). */
export async function confirmDecide(page: Page, expectText?: string | RegExp): Promise<void> {
  const d = modalWithButton(page, '決定');
  await expect(d).toBeVisible();
  if (expectText) await expect(d).toContainText(expectText);
  await click(d, '決定');
  await waitApisIdle(page, '決定');
}
/** Bấm OK trong hộp thông báo (kiểm nội dung nếu truyền expectText).
 *  Hộp OK hiện SAU khi server lưu xong (lưu kèm ảnh trên est-test > 5s) → chờ tới 30s. */
export async function acknowledgeOk(page: Page, expectText?: string | RegExp): Promise<void> {
  const d = modalWithButton(page, 'OK');
  await expect(d).toBeVisible({ timeout: 30_000 });
  if (expectText) await expect(d).toContainText(expectText);
  await click(d, 'OK');
  await expect(d).toBeHidden();
  await waitApisIdle(page, 'OK');
}
/** 保存 → 決定 → OK (mẫu lưu dùng khắp CMS). */
export async function saveDecideOk(page: Page, scope: Scope, okText?: string | RegExp): Promise<void> {
  await click(scope, '保存');
  await confirmDecide(page);
  await acknowledgeOk(page, okText);
}

const xq = (s: string) => `'${s}'`;
/** Ô nhập đứng sau label (input / textarea / select). Thử getByLabel trước, sau đó tìm theo vị trí chữ. */
export function field(scope: Scope, label: string): Locator {
  const byLabel = scope.getByLabel(label, { exact: true });
  const near = scope.locator(
    `xpath=.//*[not(self::script) and not(self::option)][normalize-space(text())=${xq(label)} or starts-with(normalize-space(text()), ${xq(label)})]` +
    `/following::*[self::input[not(@type="hidden") and not(@type="checkbox") and not(@type="radio") and not(@type="file")] or self::textarea or self::select][1]`,
  );
  return byLabel.or(near).filter({ visible: true }).first();
}
export async function fill(scope: Scope, label: string, value: string): Promise<void> {
  const f = field(scope, label);
  await f.fill(value);
  await expect(f).toHaveValue(value);
}

/** Chọn giá trị cho dropdown đứng sau label: hỗ trợ <select> và dropdown tự vẽ (react-select). */
export async function choose(page: Page, scope: Scope, label: string, option: string): Promise<void> {
  const f = field(scope, label);
  const tag = await f.evaluate((e) => e.tagName.toLowerCase());
  if (tag === 'select') {
    await f.selectOption({ label: option });
    return;
  }
  await f.click();
  await page.getByRole('option', { name: option, exact: true })
    .or(page.locator('[class*="option"]').filter({ hasText: exact(option) }))
    .filter({ visible: true }).first().click();
}

/** Khối chứa label (dòng bảng / form-group / dl) — dùng để kiểm "label = giá trị". */
export function rowOf(scope: Scope, label: string): Locator {
  return scope.locator(
    `xpath=.//*[not(self::script)][normalize-space(text())=${xq(label)} or (self::td and normalize-space()=${xq(label)})]` +
    `/ancestor-or-self::*[self::tr or self::li or self::dl or contains(concat(' ', @class, ' '), ' row ') or contains(@class, 'form-group')][1]`,
  ).filter({ visible: true }).first();
}
/**
 * Ô giá trị của label. Hỗ trợ 3 kiểu bố cục thấy trên CMS (recon 2026-10-12):
 *  - bảng: <td>label</td><td>giá trị</td> (có dòng chứa 2 cặp, vd 開始 | … | 終了 | …)
 *  - header chi tiết: <p>業者:</p> giá trị (nhãn có dấu ':')
 *  - còn lại: khối chứa label (rowOf)
 */
export function valueOf(scope: Scope, label: string): Locator {
  // Ô nhãn có thể kèm badge (vd '作業者 必須', '名称 ※') → so khớp text node đầu tiên.
  const cell = scope.locator(`xpath=.//*[self::td or self::th][not(.//td or .//th)][normalize-space(text())=${xq(label)} or normalize-space()=${xq(label)} or .//*[normalize-space(text())=${xq(label)}]]/following-sibling::*[1]`);
  const header = scope.locator(`xpath=.//p[normalize-space()=${xq(label + ':')} or normalize-space()=${xq(label + '：')}]/..`);
  return cell.or(header).filter({ visible: true }).first();
}
export async function expectRow(scope: Scope, label: string, value: string | RegExp): Promise<void> {
  await expect(valueOf(scope, label)).toContainText(value);
}

/** Dòng bảng chứa toàn bộ các chữ trong texts. */
export function tableRow(scope: Scope, ...texts: (string | RegExp)[]): Locator {
  let r = scope.locator('tr').filter({ visible: true });
  for (const t of texts) r = r.filter({ hasText: t });
  return r.first();
}

/**
 * Upload ảnh: bấm nút (vd 写真を選択) → chọn file → bấm 完了 nếu có.
 * button: Locator của nút cụ thể (vd clickables(card, '写真を選択').nth(1)).
 */
export async function uploadVia(page: Page, button: Locator, filePath: string): Promise<void> {
  // CMS (recon 2026-10-12): 写真を選択 mở hộp con có nút 'Choose File' + 'キャンセル' / '完了' (完了 disable tới khi chọn file).
  let chooser = page.waitForEvent('filechooser', { timeout: 3000 }).catch(() => null);
  await button.click();
  let fc = await chooser;
  if (!fc) {
    const choose = page.getByRole('button', { name: 'Choose File' }).filter({ visible: true }).last();
    if (await choose.isVisible().catch(() => false)) {
      chooser = page.waitForEvent('filechooser', { timeout: 5000 }).catch(() => null);
      await choose.click();
      fc = await chooser;
    }
  }
  // Browser thật 2026-10-12: hộp con có <input type=file id=uploadName> hiển thị sẵn.
  if (fc) await fc.setFiles(filePath);
  else await page.locator('input[type="file"]').filter({ visible: true }).last().setInputFiles(filePath);
  const done = page.getByRole('button', { name: '完了', exact: true }).filter({ visible: true }).last();
  if (await done.isVisible().catch(() => false)) {
    await expect(done).toBeEnabled();
    // Giữ đúng nút vừa bấm: sau khi hộp con đóng, locator `done` sẽ trỏ sang 完了 khác (vd 完了 của modal 報告書).
    const handle = await done.elementHandle();
    await done.click();
    await expect.poll(() => handle!.isVisible()).toBe(false);
  }
}

/** Thu nhỏ khung chat nổi: popover '.chat-popover' — bấm '.popover-trigger' khi nội dung đang mở (browser thật 2026-10-12). */
export async function minimizeChat(page: Page): Promise<void> {
  const open = page.locator('.chat-popover__content.open');
  if (await open.isVisible().catch(() => false)) {
    // Run 2026-10-12: khi chat mở, form '.cf-chat-input' đè lên nút trigger → click thường bị chặn (intercepts pointer events).
    // Bắn event click thẳng vào trigger (không theo toạ độ), rồi kiểm đã đóng (lesson R12).
    await page.locator('.chat-popover .popover-trigger').dispatchEvent('click');
    await expect(open).toBeHidden();
  }
}

/** Đóng modal bằng nút × / 閉じる. */
export async function closeModal(box: Locator): Promise<void> {
  const x = box.locator('button.close, .btn-close, [aria-label="Close"], [aria-label="閉じる"]').filter({ visible: true }).first();
  if (await x.isVisible().catch(() => false)) await x.click();
  else await click(box, '閉じる');
  await expect(box).toBeHidden();
}

export function today(fmt: 'ymd' | 'ym' = 'ymd'): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return fmt === 'ym' ? `${d.getFullYear()}/${p(d.getMonth() + 1)}` : `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())}`;
}
export const pickRandom = (n: number) => Math.floor(Math.random() * n);

/** Option đang chọn của 1 <select> (đọc chữ hiển thị — lesson R07). */
export function checkedOption(select: Locator): Locator {
  return select.locator('option:checked');
}
