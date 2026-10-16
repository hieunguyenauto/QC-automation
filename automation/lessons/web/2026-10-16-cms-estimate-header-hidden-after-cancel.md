# 2026-10-16 Nút '見積もり' biến mất với 01 / 02 khi không còn báo giá đã nộp; 98 giống 99
- Loại: LOCATOR
- Nguồn: @E2E13-TC-006, @E2E14-TC-006, @E2E25-TC-006 (toridoll-test 16/10) — file: web/screens/cms/trouble-detail.screen.ts, web/common/e2e-suite.ts
- Function / màn hình: Trouble Detail › 見積もり (取り下げ承認 / 却下, duyệt của SubAdmin)
- Triệu chứng: (1) sau 取り下げ承認 / 却下 manager mở lại danh sách → không có nút '見積もり', fallback 'クイック操作' không có với 01 → timeout; (2) SubAdmin (98) mở bằng header → không có '承認する'.
- Nguyên nhân gốc: (1) báo giá về 下書き / 失効 → '見積書: 未提出' → header không còn '見積もり' cho 01 / 02; (2) 98 giống 99: modal header chỉ xem, thao tác qua 状態変更.
- Cách fix: answerCancelRequest chỉ mở lại danh sách khi còn nút; bước manager kiểm '見積書' = '未提出', trạng thái báo giá kiểm ở bước Admin; openEstimatesAs: 99 và 98 qua クイック操作 → 状態変更.
- Rule rút ra: R40 — Nút header '見積もり' chỉ có khi còn báo giá đã nộp; kiểm trạng thái báo giá sau 取り下げ bằng 99 / 98 (qua 状態変更). Bổ sung R34: 98 giống 99.
- Áp dụng cho: luồng 取り下げ, duyệt của 98, mọi bước 01 / 02 mở lại 見積一覧.
