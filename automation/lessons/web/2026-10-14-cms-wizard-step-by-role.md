# 2026-10-14 Wizard 作業依頼登録 khác bước theo role
- Loại: LOCATOR
- Nguồn: @E2E01-TC-009 — file: web/tests/cms/e2e-suite/E2E-01.spec.ts (toridoll-test)
- Function / màn hình: 作業依頼登録 › 継続依頼 (role 98)
- Triệu chứng: `expect(content).toContainText('操作モード設定')` fail; màn hiện 'Step 1 作業依頼設定 … 作業依頼選択'.
- Nguyên nhân gốc: TroubleCreateScreen.start giả định mọi role đều có bước '操作モード設定' (dò ở role 99); role 98 chọn 継続依頼 vào thẳng 作業依頼設定.
- Cách fix: chờ `bước tuỳ chọn .or(bước kế tiếp)`; có '操作モード設定' thì chọn chế độ rồi 次へ, không có thì đi tiếp; comment ghi role đã dò.
- Rule rút ra: R31 — luồng wizard / màn có bước tuỳ role: chờ "bước tuỳ chọn hoặc bước kế tiếp", không cố định số bước; ghi role đã dò trong screen.
- Áp dụng cho: wizard nhiều bước, màn dùng chung cho nhiều role (99 / 98 / 01 / 02).
