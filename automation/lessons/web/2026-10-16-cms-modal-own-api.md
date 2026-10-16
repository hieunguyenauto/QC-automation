# 2026-10-16 Modal hiện trước, dữ liệu đến từ API riêng
- Loại: TIMING
- Nguồn: @E2E22-TC-009 (toridoll-test 16/10) — file: web/common/e2e-suite.ts paymentOpen
- Function / màn hình: Trouble Detail › 作業完了確認 → modal '支払情報'
- Triệu chứng: modal hiện nhưng '作業項目一覧' và số tiền trống → toContainText('Autotest') fail sau 5s.
- Nguyên nhân gốc: nội dung modal đến từ GET /api/troubles/<id>/payments, có lúc > 5s; modal visible ≠ dữ liệu đã có.
- Cách fix: bắt waitForResponse(/payments) trước khi bấm nút, chờ response rồi mới kiểm (timeout 30s).
- Rule rút ra: R38 — Modal có dữ liệu từ API riêng: chờ đúng response đó rồi mới kiểm nội dung (mở rộng R03 / R05 cho modal).
- Áp dụng cho: 支払情報 và mọi modal tải dữ liệu sau khi mở.
