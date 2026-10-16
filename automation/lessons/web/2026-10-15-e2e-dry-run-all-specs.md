# 2026-10-15 Chạy khô (E2E_DRY) phải được mọi spec trong bộ hiểu
- Loại: DATA
- Nguồn: lệnh kiểm TC ↔ code `E2E_DRY=1 … tests/cms/e2e-suite/` — file: web/tests/cms/e2e-suite/E2E-00.spec.ts, E2E-01.spec.ts (toridoll-test)
- Function / màn hình: Bộ E2E suite (E2E-00 … E2E-39)
- Triệu chứng: lệnh "dry-run" (không được đụng app) chạy thật E2E-01 15/15 → tạo trouble 223470076 / 223470076_2 trên toridoll-test; E2E-00 chạy thật tới bước login (fail do timeout, chưa đổi setting chain).
- Nguyên nhân gốc: chỉ E2E-02…39 (common/e2e-case.ts) hiểu E2E_DRY; E2E-00 / 01 viết riêng, không kiểm biến này.
- Cách fix: E2E-00 / 01 thêm `test.skip(!!process.env.E2E_DRY, …)` ở đầu file (trước serialScenario) → DRY cả thư mục: 545 pass + 17 skip, 8.5s, không mở app.
- Rule rút ra: R36 — Spec nào trong bộ có chế độ khô (E2E_DRY) cũng phải hiểu biến đó; spec không chạy khô được thì skip cả file khi DRY. Kiểm / recon luôn DRY, chạy thật không DRY; trước khi chạy DRY kiểm mọi spec trong phạm vi.
- Áp dụng cho: spec mới thêm vào tests/cms/e2e-suite/, mọi lệnh kiểm không được ghi dữ liệu.
