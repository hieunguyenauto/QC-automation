# 2026-10-12 Nút × của modal cũng tên "閉じる"
- Loại: LOCATOR
- Nguồn: browser thật (modal 状態変更, 見積もり, react-datepicker)
- Function / màn hình: CMS mọi modal Bootstrap + date picker
- Triệu chứng: getByRole('button', { name: '閉じる' }) khớp 2 nút (× có aria-label="閉じる" và nút chữ 閉じる) → strict mode / bấm nhầm.
- Nguyên nhân gốc: accessible name lấy từ aria-label, trùng chữ của nút khác.
- Cách fix: common/ui.ts click()/clickables() lọc theo text hiển thị (hasText exact); × thì dùng closeModal() (button.close); date picker dùng .react-datepicker button hasText 閉じる.
- Rule rút ra: R08
- Áp dụng cho: mọi nút đóng trong modal / popup.
