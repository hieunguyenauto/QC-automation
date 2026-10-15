# 2026-10-14 Ant Design select trong iframe webview トラブルNAVI
- Loại: LOCATOR
- Nguồn: recon E2E (reports/recon-e2e-t5…t9) + @E2E01-TC-002 — file: web/screens/cms/trouble-navi.webview.ts (toridoll-test)
- Function / màn hình: 作業依頼登録 → webview 'トラブル相談内容' (中項目 / 小項目 / 症状 / 資産)
- Triệu chứng: click ô select timeout; chọn ô thứ 2 lấy nhầm option của dropdown cũ; ô 症状 không mở (15s không có option).
- Nguyên nhân gốc: input combobox opacity 0 (click không được); option render ở .ant-select-dropdown tách khỏi ô, dropdown đã đóng vẫn ở DOM; ô sau disabled / chưa tải tới khi ô trước chọn xong.
- Cách fix: mousedown vào .ant-select-selector lặp tới khi option hiện (expect.toPass); lọc dropdown theo `[id = aria-controls]` của combobox; click option bằng dispatchEvent; kiểm .ant-select-selection-item = chữ đã chọn.
- Rule rút ra: R33 — Ant Design select: mở bằng mousedown (lặp tới khi có option), lọc dropdown theo aria-controls của đúng ô, chọn xong kiểm giá trị hiển thị.
- Áp dụng cho: mọi ant-select (webview Next.js / antd), dropdown portal tách khỏi ô.
