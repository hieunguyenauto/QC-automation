# 2026-10-16 Dữ liệu đi kèm trouble chỉ xem được qua modal / modal mở để kiểm phải đóng
- Loại: LOCATOR
- Nguồn: @E2E37-TC-002, @E2E39-TC-008 (toridoll-test 16/10) — file: web/scripts/gen-e2e-specs.mjs
- Function / màn hình: Trouble Detail › hàng '資産' · header '報告書'
- Triệu chứng: (1) kiểm tên tài sản trên trang chi tiết không thấy; (2) TC sau bấm 'ログアウト' timeout vì modal '報告書' TC trước mở để kiểm PDF còn che.
- Nguyên nhân gốc: (1) hàng '資産' chỉ có nút '資産一覧' → modal mới có 名称 / 型式 / 製造番号; (2) kịch bản serial dùng chung trang, modal không đóng chặn TC sau.
- Cách fix: kiểm tài sản bằng TroubleEditScreen.expectAssetInList (mở 資産一覧 → kiểm → đóng); kiểm PDF trong 報告書 xong closeModal.
- Rule rút ra: R39 — Dữ liệu gắn với trouble (tài sản, báo cáo…): dò xem hiển thị thẳng hay chỉ qua modal; modal mở để kiểm thì đóng trong cùng bước (serial).
- Áp dụng cho: Expected kiểm dữ liệu đi kèm; mọi bước mở modal chỉ để kiểm.
