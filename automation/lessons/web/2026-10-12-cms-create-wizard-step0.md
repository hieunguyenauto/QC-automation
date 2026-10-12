# 2026-10-12 Màn tạo trouble có bước ẩn trước bước 店舗
- Loại: LOCATOR (sai luồng màn hình)
- Nguồn: @E2E-TC-002 — file: projects/qnavi/automation/web/tests/cms/e2e-trouble-flow.spec.ts, report 20261012-090955-dev
- Function / màn hình: CMS 作業依頼登録 (/admin/trouble/create), role 99
- Triệu chứng: bước 1 chờ chữ '店舗' nhưng màn hình chỉ có '作業依頼登録 新規依頼 継続依頼 次へ'.
- Nguyên nhân gốc: code được sinh chỉ dựa vào CSV và catalog; cả hai đều không ghi bước chọn loại依頼 (radio 新規依頼 / 継続依頼 + 次へ) của role 99/98.
- Cách fix: thêm TroubleCreateScreen.startNew() (chọn 新規依頼 → 次へ, bỏ qua 操作モード設定 nếu có); cập nhật TC-002 bước 1.
- Rule rút ra: R01 — màn hình chưa chạy qua: lấy cây phần tử thật (error-context.md / aria snapshot / codegen) trước khi viết locator.
- Áp dụng cho: mọi wizard nhiều bước, màn hình có nội dung khác nhau theo role.
