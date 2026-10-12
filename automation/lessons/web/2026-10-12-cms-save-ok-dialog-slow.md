# 2026-10-12 Hộp OK sau 保存 → 決定 hiện chậm (server lưu > 5s) → chờ timeout dài
- Loại: TIMING
- Nguồn: @E2E-TC-002 — file: web/tests/cms/e2e-trouble-flow.spec.ts (bước 23. 保存 → 決定 → OK ở 資産登録)
- Function / màn hình: CMS 作業依頼登録 – dialog chọn 資産 › 資産登録 (lưu kèm 2 ảnh), môi trường est-test
- Triệu chứng: sau 決定, spinner vẫn quay; acknowledgeOk báo "element(s) not found" cho hộp OK sau 5s, dù app không báo lỗi.
- Nguyên nhân gốc: hộp OK '資産情報の保存が完了しました' chỉ hiện khi server lưu xong; lưu có ảnh trên est-test mất > 5s, acknowledgeOk dùng expect timeout mặc định (5s).
- Cách fix: common/ui.ts acknowledgeOk: expect(hộp OK).toBeVisible({ timeout: 30_000 }). Không dùng waitForAppIdle vì selector LOADER (common/wait.ts) chưa xác minh trên app thật.
- Rule rút ra: R17
- Áp dụng cho: mọi hộp kết quả sau thao tác lưu / gửi server (OK, 完了) — dùng chung qua acknowledgeOk / saveDecideOk.
