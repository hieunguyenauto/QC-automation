import { expect, type Locator } from '@playwright/test';
import path from 'path';
import { BaseScreen } from '../base.screen';
import {
  acknowledgeOk, choose, click, exact, clickable, clickables, closeModal, confirmDecide, expectRow, field, fill, modal,
  saveDecideOk, valueOf,
} from '../../common/ui';
import { AssetSelectDialog } from './asset-select.dialog';

const FILES = path.resolve(__dirname, '../../data/files');

/**
 * 作業依頼詳細 — catalog: cms-frontend.md › "Trouble Detail: /admin/troubles/:id/detail" + "Trouble modals".
 * クイック操作 (99/98/05) mở modal 状態変更. Nút header: 履歴, 立候補, 見積もり, 報告書, 作業完了確認…
 * Recon 2026-10-12: header = <p>店舗名:</p>, <p>業者:</p>…; nút có icon (' 編集', ' クイック操作'); bảng chi tiết <td>label</td><td>value</td>;
 *   modal 状態変更 = dialog có heading '状態変更', nút '閉じる', select ở dòng '状態', nút 'キャンセル' / '保存'.
 * Browser thật 2026-10-12: đã chạy tay TC-005 → TC-010 trên trouble 43803 (xem ghi chú từng phần).
 * Sau 保存 → 決定 → OK 'この情報の保存が完了しました。' thì modal 状態変更 tự đóng.
 */
export class TroubleDetailScreen extends BaseScreen {
  readonly id = 'CMS-TROUBLE-DETAIL';
  readonly path = '/admin/troubles';
  readonly roles = ['99', '98', '01', '02', '05'] as const;

  readonly content = this.page.locator('.content-wrapper').first();
  readonly assets = new AssetSelectDialog(this.page);

  /** Đã vào màn chi tiết VÀ dữ liệu đã tải (ô 番号 có số; trước đó các ô trống, クイック操作 bị disable). */
  async expectOpened(id?: string): Promise<void> {
    await expect(this.page).toHaveURL(id ? new RegExp(`/admin/troubles/${id}/detail`) : /\/admin\/troubles\/\d+\/detail/);
    await expect(valueOf(this.content, '番号')).toHaveText(/\d+/, { timeout: 20_000 });
  }
  /** 番号 (= 依頼番号 trong danh sách) đang hiển thị. */
  async number(): Promise<string | undefined> {
    // 継続依頼 có hậu tố '_N' (vd '223470066_2', dò thật 2026-10-14) → giữ cả hậu tố.
    return (await valueOf(this.content, '番号').innerText()).match(/\d+(?:_\d+)?/)?.[0];
  }
  /** Badge trạng thái: vd ('対応中', '受注'). */
  async expectBadges(...badges: string[]): Promise<void> {
    // Badge (.trouble-action .badge) render rỗng trước, có chữ sau ~3s (nhất là role 01).
    for (const b of badges) await expect(this.content.locator('.trouble-action .badge', { hasText: exact(b) })).toBeVisible({ timeout: 15_000 });
  }
  async expectInfo(label: string, value: string | RegExp): Promise<void> {
    await expectRow(this.content, label, value);
  }
  async headerButton(name: string): Promise<void> {
    await click(this.content, name);
  }

  // ---------- 状態変更 ----------
  get statusModal(): Locator { return modal(this.page, '状態変更'); }

  async openQuickAction(): Promise<Locator> {
    await click(this.content, 'クイック操作');
    await expect(this.statusModal).toBeVisible();
    return this.statusModal;
  }
  /** Icon edit trên dòng label trong modal 状態変更 (作業者, 見積もり, 報告書).
   *  Browser thật 2026-10-12: <td><div class="card">…<div class="icon …"><i class="far fa-edit"></i></div></td>. */
  async editRow(label: string): Promise<void> {
    await valueOf(this.statusModal, label).locator('.icon, i.fa-edit').filter({ visible: true }).first().click();
  }
  async setStatus(value: string): Promise<void> {
    await choose(this.page, this.statusModal, '状態', value);
  }
  async setFlow(value: string): Promise<void> {
    await choose(this.page, this.statusModal, '対応中の状態（新規）', value);
  }
  /** Giá trị ĐANG CHỌN của dropdown 対応中の状態（新規） (dòng chứa cả danh sách option nên không kiểm theo text dòng). */
  async expectFlow(value: string): Promise<void> {
    await expect(field(this.statusModal, '対応中の状態（新規）').locator('option:checked')).toHaveText(value);
  }
  async expectStatus(value: string): Promise<void> {
    await expect(field(this.statusModal, '状態').locator('option:checked')).toHaveText(value);
  }
  async saveStatus(): Promise<void> {
    await saveDecideOk(this.page, this.statusModal);
    await expect(this.statusModal).toBeHidden();
  }
  async closeStatus(): Promise<void> {
    await closeModal(this.statusModal);
  }

  // ----- 作業者 (検索条件) -----
  get searchModal(): Locator { return modal(this.page, '検索条件'); }
  async expandSearch(): Promise<void> {
    const box = this.searchModal;
    if (!(await field(box, '電話番号').isVisible().catch(() => false))) await box.getByText('検索条件', { exact: true }).first().click();
    await expect(field(box, '電話番号')).toBeVisible();
  }
  async searchWorker(company: string): Promise<void> {
    await fill(this.searchModal, '社名', company);
    await click(this.searchModal, '検索');
  }
  async pickWorker(loginId: string): Promise<void> {
    // Có 'linksysworkerqnavi' và 'linksysworker' → khớp ô đúng nguyên văn.
    const row = this.searchModal.locator('tbody tr').filter({ has: this.page.locator('td', { hasText: new RegExp(`^\\s*${loginId}\\s*$`) }) }).first();
    await click(row, '選択');
    await expect(this.searchModal).toBeHidden();
  }

  // ---------- 見積もり ----------
  // Browser thật 2026-10-12 (trouble 43803):
  //  - Modal '見積もり' (có '見積一覧', nút 閉じる / 登録 / 提示する). Dòng = tr.estimation-row, badge trạng thái, ô 'メニュー展開▼'.
  //  - 登録 → modal form (input[name=title|companyName|expiredTime], textarea[name=notices]); có sẵn dòng 現場調査費/出張費.
  //  - 追加 → modal '作業項目追加': nút 作業/部材/諸経費; input[name=label|workerAmount] bị disable tới khi chọn loại.
  //  - Dòng item trong form: 項目名 nằm trong textarea[name="items.N.label"] (không phải text).
  //  - 決定 form: lưu ngay, không có confirm. 提示する → '以下1件の見積を店舗へ提出しますか?' → 決定; trạng thái đổi sau ~3–5s.
  //  - Nút × có aria-label="閉じる" → không dùng getByRole name '閉じる' (trùng).
  get estimateModal(): Locator { return modal(this.page, '見積一覧'); }
  get estimateForm(): Locator {
    return this.page.locator('.modal.show').filter({ visible: true }).filter({ has: this.page.locator('input[name="title"]') }).last();
  }
  /** Bảng hạng mục của form 見積もり (form có 2 tbody: thông tin chung + hạng mục kéo thả) — dò thật dev 2026-10-13. */
  get estimateItemsBody(): Locator { return this.estimateForm.locator('tbody[data-rbd-droppable-id="dnd-create-estimates"]'); }
  get itemModal(): Locator { return modal(this.page, '作業項目追加'); }
  estimateRow(name: string): Locator {
    return this.estimateModal.locator('tr.estimation-row').filter({ has: this.page.locator('td', { hasText: exact(name) }) }).first();
  }
  async expectEstimateStatus(name: string, status: string): Promise<void> {
    await expect(this.estimateRow(name).locator('.badge')).toHaveText(status, { timeout: 15_000 });
  }

  async openEstimateFromStatus(): Promise<void> {
    await this.editRow('見積もり');
    await expect(this.estimateModal).toBeVisible();
  }
  async startNewEstimate(): Promise<void> {
    await click(this.estimateModal, '登録');
    const f = this.estimateForm;
    for (const n of ['title', 'companyName', 'expiredTime']) await expect(f.locator(`input[name="${n}"]`)).toBeVisible();
  }
  async fillEstimateName(name: string): Promise<void> {
    await this.estimateForm.locator('input[name="title"]').fill(name);
  }
  async openAddItem(): Promise<void> {
    await click(this.estimateForm, '追加');
    await expect(this.itemModal).toBeVisible();
  }
  async chooseItemType(type: '作業' | '部材' | '諸経費'): Promise<void> {
    await this.itemModal.locator('.btn-group button', { hasText: exact(type) }).click();
    await expect(this.itemModal.locator('input[name="label"]')).toBeEnabled();
  }
  async fillItemName(name: string): Promise<void> {
    await this.itemModal.locator('input[name="label"]').fill(name);
  }
  async fillUnitPrice(value: string, shown: string): Promise<void> {
    const price = this.itemModal.locator('input[name="workerAmount"]');
    await price.fill(value);
    await price.blur();
    await expect(price).toHaveValue(new RegExp(`^(${value}|${shown})$`));
  }
  async decideItem(itemName: string): Promise<void> {
    await click(this.itemModal, '決定');
    await expect(this.itemModal).toBeHidden();
    await expect(this.estimateForm.locator('textarea[name$=".label"]').last()).toHaveValue(itemName);
  }
  async decideEstimate(name: string): Promise<void> {
    await click(this.estimateForm, '決定');
    await expect(this.estimateForm).toBeHidden();
    await expect(this.estimateRow(name)).toBeVisible({ timeout: 15_000 });
  }
  /** Tick dòng → 提示する → 決定 → trạng thái mong đợi (mặc định 承認待ち; dưới fix_amount → 承認済み). */
  async submitEstimateExpect(name: string, status: string): Promise<void> {
    await this.estimateRow(name).locator('input[type="checkbox"]').first().check();
    await click(this.estimateModal, '提示する');
    const d = modal(this.page, '以下1件の見積を店舗へ提出しますか');
    await expect(d).toContainText(name);
    await click(d, '決定');
    await expect(d).toBeHidden();
    await this.expectEstimateStatus(name, status);
  }
  /** Tick dòng → 提示する → 決定 → trạng thái 承認待ち. */
  async submitEstimate(name: string): Promise<void> {
    await this.estimateRow(name).locator('input[type="checkbox"]').first().check();
    await click(this.estimateModal, '提示する');
    const d = modal(this.page, '以下1件の見積を店舗へ提出しますか');
    await expect(d).toContainText(name);
    await click(d, '決定');
    await expect(d).toBeHidden();
    await this.expectEstimateStatus(name, '承認待ち');
  }
  /** Mở phần mở rộng của dòng (nếu đang đóng). Bấm khi đã mở sẽ ĐÓNG lại → kiểm class is-expanded trước. */
  async openEstimateMenu(name: string): Promise<void> {
    const row = this.estimateRow(name);
    if (!/is-expanded/.test((await row.getAttribute('class')) ?? '')) await row.getByText(/メニュー展開/).first().click();
    await expect(row).toHaveClass(/is-expanded/);
  }
  /** Nút trong phần mở rộng: card 店舗 (.group-manager) hoặc 作業員 (.group-worker). */
  estimateAction(group: 'manager' | 'worker', name: string): Locator {
    return clickable(this.estimateModal.locator(`.group-${group}`), name);
  }
  async closeEstimateModal(): Promise<void> {
    await click(this.estimateModal, '閉じる');
    await expect(this.estimateModal).toBeHidden();
  }

  // ----- Phase 007 (P007-TC-028~054) -----
  /** Số dòng 見積 có tên name trong 見積一覧. */
  estimateRows(name: string): Locator {
    return this.estimateModal.locator('tr.estimation-row').filter({ has: this.page.locator('td', { hasText: exact(name) }) });
  }
  /** Nhấn Enter n lần ở ô 見積名 (form 見積もり). */
  async pressEnterInEstimateName(n: number): Promise<void> {
    const f = this.estimateForm.locator('input[name="title"]');
    for (let i = 0; i < n; i++) await f.press('Enter');
  }
  /** Dòng hạng mục (trong form 見積もり) có 項目名 = label (項目名 nằm trong textarea[name="items.N.label"]). */
  itemRow(label: string): Locator {
    return this.estimateForm.locator('tbody tr').filter({ has: this.page.locator(`textarea[name$=".label"]`) })
      .filter({ has: this.page.locator('textarea').filter({ hasText: label }) }).last();
  }
  /** Danh sách 作業項目選択 trong hộp 作業項目追加 (nút list-group-item). */
  selectListItem(name: string): Locator {
    return this.itemModal.locator('.workItemList button', { hasText: name }).first();
  }
  /** Xoá dòng mặc định (出張費 / 現場調査費) của form 見積もり. [chưa dò: nút 削除 ở dòng — thấy trong form 2026-10-12] */
  async deleteDefaultRows(): Promise<void> {
    const rows = this.estimateForm.locator('tbody tr').filter({ hasText: /出張費|現場調査費/ });
    while (await rows.count()) {
      await click(rows.first(), '削除');
    }
  }
  /** Ô 店舗向け 単価 của dòng hạng mục cuối (input[name="items.N.amount"]). */
  /** App tự tính 店舗向け 単価 (= 作業会社単価 / 0.7) SAU khi thêm hạng mục / xoá dòng mặc định; lúc đầu ô = '0'.
   *  Nhập trước khi app tính xong → bị ghi đè (TC-048 dev 2026-10-13: 9500 → 4,285). Chờ ô hết '0' rồi nhập, KIỂM giá trị + 会計. */
  async setStoreUnitPrice(value: string): Promise<void> {
    const f = this.estimateForm.locator('input[name$=".amount"]').last();
    await expect(f).not.toHaveValue(/^0?$/, { timeout: 15_000 });
    await f.fill(value);
    await f.press('Tab');
    const shown = Number(value).toLocaleString('en-US');
    await expect(f).toHaveValue(shown);
    await expect(this.estimateForm).toContainText(new RegExp(`会計[^￥]*￥${shown.replace(',', '\\,')}`));
  }
  /** Chọn 対応中の状態（継続） (trouble 継続依頼: select name=continuationFlowStatus, dò thật 2026-10-13). */
  async setContinuationFlow(label: string): Promise<void> {
    await this.statusModal.locator('select[name="continuationFlowStatus"]').selectOption({ label });
  }
  /** Bấm 保存 trong 状態変更 mà không đi tiếp (dùng khi app chặn chuyển trạng thái). */
  async clickSaveStatus(): Promise<void> {
    await click(this.statusModal, '保存');
  }
  /** Không có hộp xác nhận '…保存します' hiện ra (chờ ngắn). */
  async expectNoConfirm(): Promise<void> {
    await expect(this.page.locator('.modal.show').filter({ hasText: 'この情報を保存します' })).toHaveCount(0, { timeout: 3_000 });
  }

  // ----- チャット (khung chat nổi, dò thật 2026-10-13) -----
  // .chat-popover: .popover-trigger (icon nổi) · .chat-popover__content.open (khung mở) · header có i.fa-minus-square (thu nhỏ)
  // · textarea[name=content] · button.cf-send (submit) · danh sách tin #chat.
  get chatBox(): Locator { return this.page.locator('.chat-popover__content.open'); }
  get chatInput(): Locator { return this.page.locator('.chat-popover textarea[name="content"]'); }
  get chatMessages(): Locator { return this.page.locator('.chat-popover #chat'); }
  async openChat(): Promise<void> {
    if (!(await this.chatBox.isVisible().catch(() => false))) await this.page.locator('.chat-popover .popover-trigger').dispatchEvent('click');
    await expect(this.chatBox).toBeVisible();
  }
  async sendChat(text: string): Promise<void> {
    await this.chatInput.fill(text);
    await this.page.locator('.chat-popover button.cf-send').click();
  }
  async minimizeChatByIcon(): Promise<void> {
    await this.page.locator('.chat-popover i.fa-minus-square').dispatchEvent('click');
    await expect(this.chatBox).toBeHidden();
  }

  // ---------- 報告書 ----------
  // Browser thật 2026-10-12: modal 報告書 (xem) có nút 編集 → modal sửa (input[name=start|end] react-datepicker,
  //  select[name=status] 未提出/提出済, textarea[name=symptom|reason|content|notice], dropzone ảnh, 修理対象資産選択, キャンセル/完了).
  //  Lọc theo '施工業者' vì modal 状態変更 cũng có chữ '報告書'.
  get reportModal(): Locator { return modal(this.page, '施工業者'); }

  /** react-datepicker: option "Choose 2026年10月1日木曜日"; nút 現在 / クリア / 閉じる; giá trị input 'YYYY/MM/DD 00:00'. */
  async pickDay(name: 'start' | 'end', day: number): Promise<void> {
    await this.reportModal.locator(`input[name="${name}"]`).click();
    const picker = this.page.locator('.react-datepicker').filter({ visible: true }).last();
    await picker.getByRole('option', { name: new RegExp(`^Choose \\d+年\\d+月${day}日`) }).first().click();
    const close = picker.locator('button', { hasText: exact('閉じる') });
    if (await close.isVisible().catch(() => false)) await close.click();
    await expect(picker).toBeHidden();
  }
  /** Ảnh: input[type=file] ẩn trong .dropzone của dòng → mở hộp con 'N / 20' → 完了. */
  async uploadReportPhoto(label: string, file: string): Promise<void> {
    await valueOf(this.reportModal, label).locator('.dropzone input[type="file"]').first().setInputFiles(path.join(FILES, file));
    // Hộp con là .modal lồng trong modal 報告書, đóng thì chỉ bỏ class show (vẫn ở DOM) → modal 報告書 cũng chứa chữ 'N / 20'
    //  → loại modal có '施工業者' (R09).
    const box = this.page.locator('.modal.show, [role="dialog"]').filter({ visible: true })
      .filter({ hasText: /\d+\s*\/\s*20/ }).filter({ hasNotText: '施工業者' }).last();
    await expect(box).toContainText(file);
    // 完了 → generate_presigned_url → PUT S3; app bỏ qua ảnh của dòng khác cho tới khi PUT xong → chờ response.
    const uploaded = this.page.waitForResponse(r => r.request().method() === 'PUT' && r.url().includes('/modules/troubles/files/'));
    await click(box, '完了');
    expect((await uploaded).ok()).toBe(true);
    await expect(box).toBeHidden();
    await expect(valueOf(this.reportModal, label).locator('img').first()).toBeVisible();
  }
  /** 状態 của 報告書 (select[name=status]: 01 未提出 / 02 提出済). */
  async setReportStatus(label: '未提出' | '提出済'): Promise<void> {
    await this.reportModal.locator('select[name="status"]').selectOption({ label });
  }
  /** Mỗi tài sản 1 dropdown 対応区分 (select name="types.<assetId>"). */
  get assetTypeSelects(): Locator { return this.reportModal.locator('select[name^="types."]'); }
  /** Dòng tài sản trong form 報告書: tr TRONG CÙNG có select types.<assetId>. Bảng tài sản lồng trong tr '修理対象資産選択' của form
   *  → tr ngoài cũng "có" select, phải loại tr chứa tr (dev 2026-10-13). */
  get assetRows(): Locator {
    return this.reportModal.locator('tr').filter({ has: this.page.locator('select[name^="types."]') }).filter({ hasNot: this.page.locator('tr') });
  }
  /** Dropdown 対応区分 của dòng tài sản thứ i (theo dòng, không theo thứ tự phần tử). */
  assetTypeSelect(i: number): Locator { return this.assetRows.nth(i).locator('select[name^="types."]').first(); }
  /**
   * PDF 報告書: input[type=file accept=pdf] trong .dropzone của dòng 'PDFファイル' → hộp con 'N / 5' → 完了.
   * [chưa dò thật: hộp con PDF — giả định giống hộp ảnh 'N / 20' (R15, R16)]. Trả về hộp con (đang mở) để kiểm message.
   */
  async choosePdf(files: string[]): Promise<Locator> {
    await valueOf(this.reportModal, 'PDFファイル').locator('.dropzone input[type="file"]').first()
      .setInputFiles(files.map((f) => path.join(FILES, f)));
    return this.page.locator('.modal.show, [role="dialog"]').filter({ visible: true })
      .filter({ hasText: /\d+\s*\/\s*5/ }).filter({ hasNotText: '施工業者' }).last();
  }
  async confirmPdf(box: Locator): Promise<void> {
    const uploaded = this.page.waitForResponse((r) => r.request().method() === 'PUT' && r.url().includes('/modules/troubles/files/'), { timeout: 30_000 }).catch(() => null);
    const handle = await clickable(box, '完了').elementHandle();
    await click(box, '完了');
    await uploaded;
    await expect.poll(() => handle!.isVisible()).toBe(false);
  }
  async cancelBox(box: Locator): Promise<void> {
    if (await box.isVisible().catch(() => false)) await click(box, 'キャンセル');
  }
  /** Thẻ PDF = '.pdf-report-items__item' có img[title=<tên>]. Không tìm theo chữ trong ô PDFファイル: message lỗi
   *  '<tên>: ファイルの形式は正しくありません。' cũng chứa tên file (TC-040, dev 2026-10-13). */
  pdfCard(name: string): Locator {
    return this.reportModal.locator('.pdf-report-items__item', { has: this.page.locator(`img[title="${name}"]`) }).first();
  }
  /** Preview PDF (dò thật dev 2026-10-13): phần bấm được là thumbnail '.upload-pdf-holder__preview' (role=button, img[title=<tên>]);
   *  bấm tên file (p.pdf-filename) KHÔNG mở gì. Preview = '.modal.show.app-pdf-preview-modal' (tiêu đề tên file, ダウンロード, canvas).
   *  Form 報告書 cũng có 1 canvas riêng → không tìm canvas theo modal chứa tên file. */
  /** × của thẻ PDF = '.btn-close-card' (icon .fa, không có chữ) trong '.pdf-report-items__item' (dò thật dev 2026-10-13). */
  async removePdf(name: string): Promise<void> {
    await this.pdfCard(name).locator('.btn-close-card').first().click();
  }
  pdfPreview(name: string): Locator {
    return this.page.locator('.modal.show.app-pdf-preview-modal').filter({ hasText: name }).last();
  }
  async openPdfPreview(name: string): Promise<Locator> {
    const thumb = this.reportModal.locator('[role="button"]', { has: this.page.locator(`img[title="${name}"]`) }).first();
    if (await thumb.isVisible().catch(() => false)) await thumb.click();
    else await this.reportModal.getByText(name).first().click(); // màn xem 報告書 (không phải form sửa): chưa dò
    const pv = this.pdfPreview(name);
    await expect(pv.locator('canvas').first()).toBeVisible({ timeout: 20_000 });
    return pv;
  }
  async downloadFrom(button: string): Promise<string> {
    const dl = this.page.waitForEvent('download');
    await click(this.reportModal, button);
    return (await dl).suggestedFilename();
  }

  // ---------- chung ----------
  async ok(text?: string | RegExp) { await acknowledgeOk(this.page, text); }
  async decide(text?: string | RegExp) { await confirmDecide(this.page, text); }
}
