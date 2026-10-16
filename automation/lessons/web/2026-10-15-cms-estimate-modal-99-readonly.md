# 2026-10-15 Role 99: modal 見積もり mở bằng header chỉ để xem
- Loại: LOCATOR
- Nguồn: recon E2E (RECON_PART=E/F, trouble 43888) — file: web/screens/cms/trouble-detail.screen.ts, web/common/e2e-case.ts (toridoll-test)
- Function / màn hình: Trouble Detail › 見積もり (見積もり管理 / 見積一覧)
- Triệu chứng: role 99 mở báo giá bằng nút header '見積もり' → mở rộng dòng không có card 店舗 / 作業員; click '差し戻し' / '承認する' timeout.
- Nguyên nhân gốc: cùng modal 見積一覧 nhưng với 99, đường header chỉ để xem (chỉ có 閉じる); card thao tác (差し戻し, 承認する, 編集, コピー, 取り下げ申請) chỉ có khi mở qua クイック操作 → 状態変更 → icon 見積もり. Role 01 / 02 / 98 dùng header bình thường.
- Cách fix: e2e-case.ts openEstimatesAs(who): 99 → openQuickAction() + openEstimateFromStatus(); role khác → openEstimates(). Ghi chú ở TroubleDetailScreen.openEstimates.
- Rule rút ra: R34 — Cùng 1 modal có thể mở được nhiều đường với quyền khác nhau theo role: dò đường nào có nút thao tác cho TỪNG role, không giả định header và クイック操作 ra cùng modal.
- Áp dụng cho: thao tác báo giá của 99 (duyệt thay, urgent, 差し戻し, 取り下げ), mọi modal mở được từ header lẫn 状態変更.
