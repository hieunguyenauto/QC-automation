# 2026-10-14 TC sinh bằng script dùng chung 1 luồng cho mọi nhánh, sót bước CMS web
- Loại: DESIGN_GAP
- Nguồn: e2e-suite TC-002 (projects/qnavi/qc/test-cases/e2e-suite/, rev 2 LOCKED), sinh bằng _tools/gen_e2e.py từ CSV "Automation Test AI - Format Main Case.csv"
- Function / màn hình: 作業依頼登録 (store / manager tạo trouble), Step 1 店舗 → Step 2 作業項目選択 (故障内容)
- Triệu chứng: recon cho automation (toridoll-test, 14/10/2026) thấy (1) category '操作テスト' (cột gốc トラブルNAVI OFF) đi luồng CMS thường, không có webview, nhưng TC ghi "Verify: webview トラブルナビ opens"; (2) TC bắt đầu từ "chọn category '水'" — trên CMS web phải qua Step 1 (店舗 / 'チェーン店舗選択', '担当者選択' → '次へ') rồi mới tới thẻ 故障内容; webview 'トラブル相談内容' nằm trong iframe.
- Nguyên nhân gốc: generator áp 1 template webview cho mọi trouble do store / manager tạo, không tách nhánh theo category; luồng lấy từ CSV mô tả trên app nên thiếu bước Step 1 của CMS web.
- Lần 2 (rev 4, automation E2E-01-TC-005 fail trên toridoll-test): bước 提示 ghi "Verify: '承認待ち'" cho mọi báo giá; báo giá ≤ FIX thì app chuyển '承認済み' ngay khi 提示.
- Cách fix: TC rev 3 — nhánh '水' (webview) và nhánh '操作テスト' (CMS thường) có bước riêng; thêm Step 1 cho cả store và manager. Rev 4: bước 提示 ghi trạng thái theo nhánh (≤ FIX → '承認済み', > FIX → '承認待ち').
- Rule rút ra: D17 — luồng thao tác lấy từ CSV / app mobile phải đối chiếu với màn CMS web (catalog hoặc recon) trước khi LOCK; mỗi nhánh điều kiện (ON / OFF, category…) có bước riêng, không dùng chung 1 template (kể cả trạng thái kỳ vọng, vd 提示 ≤ FIX → '承認済み'). Liên quan D14.
- Áp dụng cho: TC E2E nhập từ file ngoài, TC sinh hàng loạt bằng script / template.
