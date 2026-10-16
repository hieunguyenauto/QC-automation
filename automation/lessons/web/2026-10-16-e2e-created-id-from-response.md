# 2026-10-16 Trouble do test tạo: lấy id từ response của thao tác tạo, không lấy "dòng mới nhất" của danh sách
- Loại: DATA
- Nguồn: review E2E-01 ↔ TC rev 13 (@E2E01-TC-002 bước 8, toridoll-test 16/10) — file: web/common/e2e-suite.ts, web/screens/cms/trouble-navi.webview.ts
- Function / màn hình: 作業依頼登録 (トラブルナビ webview) › '依頼する' → 'トップ画面に戻る'
- Triệu chứng: test pass, nhưng 依頼番号 lấy bằng cách mở 進行中のトラブル一覧 và chọn dòng đầu tiên của store (recordNewest, ghi [cần kiểm trên app thật]); không có gì chứng minh đó là trouble vừa tạo.
- Nguyên nhân gốc: webview không trả id về CMS → code đoán theo danh sách. Người khác tạo trouble cùng store cùng lúc, hoặc thứ tự danh sách khác, sẽ lấy nhầm → cả kịch bản nối tiếp chạy trên trouble sai mà vẫn có thể pass.
- Cách fix: TroubleNaviWebview.submit() chờ response POST /troubles (catalog trouble-frontend.md › /job › Submit), lấy id / number (thiếu number → chữ '依頼番号は N です'); E2E.submitTrouble(t) ghi ngay (R14); sau 'トップ画面に戻る' E2E.openCreated(t, store) mở đúng trouble, kiểm 番号 khớp + 店舗名. Bỏ recordNewest (E2E-01 + 23 spec sinh + khuôn gen-e2e-specs.mjs).
- Rule rút ra: R41 — Bản ghi do test tạo (trouble, báo giá…): lấy id / mã từ response API của chính thao tác tạo (hoặc chữ app hiện ngay sau khi tạo); không lấy "dòng mới nhất" của danh sách.
- Áp dụng cho: mọi bước tạo dữ liệu mà TC sau dùng lại (tạo trouble webview / web form, 継続依頼, báo giá…).
