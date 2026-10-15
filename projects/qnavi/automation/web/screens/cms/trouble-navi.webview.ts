import { expect, type FrameLocator, type Locator, type Page } from '@playwright/test';
import path from 'path';

const FILES = path.resolve(__dirname, '../../data/files');

/**
 * Webview トラブルNAVI (Next.js + Ant Design) nhúng trong 作業依頼登録 của CMS:
 * Step 2 → thẻ 故障内容 '選択' → bấm category (vd '水') → content-wrapper chỉ còn <iframe src="https://test-trouble…/">.
 * Dò thật 2026-10-14 (toridoll-test, role 02 STORE00006, reports/recon-e2e-t5…t11):
 *  1. 'トラブル相談内容': radio 'カテゴリから選ぶ' (mặc định), 4–5 ô ant-select: 大項目 (chọn sẵn) · 中項目 · 小項目 · 症状 · 資産 (khi シサンNAVI ON).
 *     Ô sau chỉ mở được khi ô trước đã chọn (đang disabled / chưa tải) → mousedown lặp tới khi dropdown hiện (expect.toPass).
 *     Option nằm trong .ant-select-dropdown có [id = aria-controls của combobox] (dropdown cũ còn ở DOM khi đóng → phải lọc theo id).
 *  2. '次へ' → '診断結果' (考えられる原因…) → nút 'このまま依頼する' → /job/ (chat AIアシスタント).
 *  3. /job/: 連絡先担当者 tự điền → '写真を撮影する' (file chooser) → textbox '故障の詳細を記入してください。例：水道の水が出ない。' + nút gửi (icon)
 *     → 'ご希望日時を教えてください。' radio: 本日中（希望時間指定）/ 明日以降（希望時間指定）/ 明日以降（希望日付＆希望時間指定）/ 至急.
 *  Sau radio: '依頼する', 'トップ画面に戻る' [cần kiểm trên app thật — recon dừng trước 依頼する để không tạo trouble].
 */
export class TroubleNaviWebview {
  readonly id = 'TROUBLE-NAVI-WEBVIEW';
  readonly frame: FrameLocator;
  constructor(private readonly page: Page) {
    this.frame = page.frameLocator('.trouble-navi iframe').first();
  }

  async expectOpened(large: string): Promise<void> {
    await expect(this.frame.getByRole('heading', { name: 'トラブル相談内容' })).toBeVisible({ timeout: 30_000 });
    await expect(this.select('大項目').locator('.ant-select-selection-item')).toHaveText(large, { timeout: 15_000 });
  }
  /** Khối ant-select đứng cùng hàng với tiêu đề h5 label. */
  select(label: string): Locator {
    return this.frame.locator('div.flex', { has: this.frame.locator('h5', { hasText: new RegExp(`^${label}$`) }) }).last().locator('.ant-select');
  }
  hasSelect(label: string): Locator { return this.frame.locator('h5', { hasText: new RegExp(`^${label}$`) }); }
  /** Mở dropdown của label và chọn option thứ index (mặc định đầu tiên). Trả về chữ đã chọn. */
  async pick(label: string, index = 0): Promise<string> {
    const sel = this.select(label);
    await expect(sel).not.toHaveClass(/ant-select-disabled/, { timeout: 15_000 });
    const list = await sel.locator('input[role=combobox]').getAttribute('aria-controls');
    const opt = this.frame.locator('.ant-select-dropdown', { has: this.frame.locator(`[id="${list}"]`) }).locator('.ant-select-item-option').nth(index);
    await expect(async () => {
      await sel.locator('.ant-select-selector').dispatchEvent('mousedown');
      await expect(opt).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: 30_000 });
    const text = (await opt.innerText()).trim();
    await opt.dispatchEvent('click');
    await expect(sel.locator('.ant-select-selection-item')).toHaveText(text, { timeout: 10_000 });
    return text;
  }
  async next(): Promise<void> {
    const btn = this.frame.getByRole('button', { name: '次へ' });
    await expect(btn).toBeEnabled({ timeout: 15_000 });
    await btn.click();
  }
  requestAsIsButton(): Locator { return this.frame.getByRole('button', { name: 'このまま依頼する' }).or(this.frame.getByText('このまま依頼する', { exact: true })).first(); }
  photoButton(): Locator { return this.frame.getByRole('button', { name: '写真を撮影する' }); }
  async uploadPhoto(file: string): Promise<void> {
    const btn = this.photoButton();
    await expect(btn).toBeEnabled({ timeout: 30_000 });
    const [chooser] = await Promise.all([this.page.waitForEvent('filechooser'), btn.click()]);
    await chooser.setFiles(path.join(FILES, file));
    await expect(this.frame.getByText(`【写真】 ${file}`).or(this.frame.getByText(file)).first()).toBeVisible({ timeout: 30_000 });
  }
  detailBox(): Locator { return this.frame.getByRole('textbox', { name: /故障の詳細を記入してください/ }); }
  /** Nhập chi tiết → bấm nút gửi (icon ngay sau textbox). */
  async sendDetail(text: string): Promise<void> {
    await expect(this.detailBox()).toBeVisible({ timeout: 30_000 });
    await this.detailBox().fill(text);
    await this.detailBox().locator('xpath=following::button[1]').click();
    await expect(this.frame.getByText(`【詳細】 ${text}`).or(this.frame.getByText('ご希望日時を教えてください')).first()).toBeVisible({ timeout: 30_000 });
  }
  async chooseTiming(option: '至急' | '本日中（希望時間指定）'): Promise<void> {
    const r = this.frame.getByRole('radio', { name: option });
    await expect(r).toBeVisible({ timeout: 30_000 });
    await r.check({ force: false });
  }
  /** '依頼する' [cần kiểm trên app thật]. */
  async submit(): Promise<void> {
    const btn = this.frame.getByRole('button', { name: '依頼する' });
    await expect(btn).toBeEnabled({ timeout: 30_000 });
    await btn.click();
  }
  /** Màn hoàn tất: '依頼番号' nếu webview hiện (regex số) [cần kiểm trên app thật]. */
  async doneText(): Promise<string> {
    const back = this.frame.getByText('トップ画面に戻る').first();
    await expect(back).toBeVisible({ timeout: 60_000 });
    return this.frame.locator('body').innerText();
  }
  async backToTop(): Promise<void> {
    await this.frame.getByText('トップ画面に戻る').first().click();
  }
}
