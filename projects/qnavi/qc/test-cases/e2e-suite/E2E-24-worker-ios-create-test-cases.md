# Test case — E2E-24 · Worker(iOS) create → / Admin approve (CMS)
- Project: qnavi · Scope Key: e2e-suite · Sheet prefix: E2E24
- Source: projects/qnavi/spec/e2e-suite.md › E2E-24 (gốc: raw/Test suite for automation_E2E.xlsx, "Expanded v2"). Luồng thao tác: raw/Automation Test AI - Format Main Case.csv, TC LOCKED phase007. Quyết định: QUESTIONS.md lượt 1–7 + quy tắc R1–R20, T1–T5 (14/10/2026). Môi trường tham chiếu: toridoll-test.
- State: LOCKED · Revision: 3 · Approved by / at: Hieu Nguyen / 14/10/2026
- Môi trường: tuỳ biến khi chạy (Q9).
- Ngoại lệ D05: 1 file = 1 kịch bản nối tiếp NEW → CONTINUE → 完了; mỗi TC = 1 giai đoạn. 'Verify:' = điểm kiểm giữa chừng.
- Quy ước chung: báo giá do Admin (99) tạo thay worker trên CMS; worker = linksysworker; FIX = 限度額 (税込) đọc ở TC-001, không sửa; ≤ FIX → tự duyệt cả New và Continue; 承認タイプ theo cấu hình store; báo cáo = đổi trạng thái trên CMS; bỏ 日程承認.
- Lưu ý: NEW dừng ở 到着 02-04 → 見積承認待ち 02-05; bỏ phần duyệt, báo cáo, thanh toán NEW và toàn bộ CONTINUE (G9).
- Lưu ý: Chỉ chạy web; phần thiết bị (iOS / Android / cross-device) không test (G25).

## Tham số kịch bản
| Tham số | Giá trị |
|---|---|
| Biến thể | Worker(iOS) create → / Admin approve (CMS) |
| Store | LINKSYS STORE00007 · approve type 02 (cột gốc: type 02) |
| Tạo trouble | admin · 通常依頼 · トラブルナビ ON (cột gốc ON) · シサンNAVI OFF |
| Worker | linksysworker suốt luồng (C2, N15) |
| Báo giá NEW | 1 提示 · total = FIX + 1 · người duyệt (cột gốc) Admin (CMS) |
| Báo cáo / thanh toán | payer (cột gốc) Admin |
| Báo giá CONTINUE | 1 · total = FIX − 1 · người duyệt (cột gốc) Admin |
| Kết luận gốc | Worker iOS → Admin CMS approve. Completed. |

## Test case
| TC ID | Viewpoint ID | Test Level | Main Screen | Function | Pre-condition | Steps | Expected Results | Role | OS | Priority | Status | Automation Eligibility |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| E2E24-TC-001 |  | System (E2E) | チェーンシステム情報 | SETUP · LINKSYS STORE00007; 限度額 read | E2E00-TC-001 passed (シサンNAVI OFF) | 1. Login Admin (99) → Dashboard → menu 'チェーンシステム情報' → search 'Linksys' → open 'Linksys Chain System'<br>2. Scroll to store list → open 'LINKSYS STORE00007' → Verify: 承認タイプ = '階層承認（No順）'<br>3. Record '限度額' (税込) as FIX (do not edit — N11) | LINKSYS STORE00007 opened; FIX recorded | CMS Admin (99) | Web | High |  | UI-AUTO |
| E2E24-TC-002 |  | System (E2E) | 作業依頼登録 | NEW · admin creates trouble (web form) | E2E24-TC-001 passed | 1. Login Admin (99)<br>2. Menu '作業依頼登録' → '新規依頼' → '次へ'<br>3. 'チェーン店舗選択' → search 社名 'Linksys', 店名 'LINKSYS STORE00007' → '選択' → '担当者選択' → first row → '次へ'<br>4. Select 作業項目 '操作テスト' > 'トイレ（テスト）' > 'つまり：大便器（テスト）'<br>5. '次へ' → Step 3 故障詳細: upload 'hieu6.jpg', 故障詳細記入欄 'AUTOMATION'<br>6. '決定して問合わせ' → '決定' (if date error: '明日以降', 開始 4:00) → 'OK' → minimize chat; record 依頼番号 | Trouble is created for 'LINKSYS STORE00007': '問い合わせ中' / '受注待ち', 業者 '未確定', 見積書 '未提出' | CMS Admin (99) | Web | High |  | UI-AUTO |
| E2E24-TC-003 |  | System (E2E) | Trouble Detail › 状態変更 | NEW · Admin: 対応中 + assign worker | E2E24-TC-002 passed | 1. Login Admin (99) → open trouble (依頼番号)<br>2. 'クイック操作' → 状態 '対応中'<br>3. Edit icon '作業者' → search 社名 'linksys' → '選択' row 'linksysworker' → Verify: 作業者 'LINKSYS WORKER'<br>4. '保存' → '決定' → 'OK' | Badge '対応中' / '受注待ち', 業者 'LINKSYS WORKER' | CMS Admin (99) | Web | High |  | UI-AUTO |
| E2E24-TC-004 |  | System (E2E) | Trouble Detail › 状態変更 | NEW · 受注 → 移動中 → 到着 (02-04) | E2E24-TC-003 passed | 1. 'クイック操作' → 対応中の状態（新規） '受注' → '保存' → '決定' → 'OK' → Verify: badge '受注'<br>2. Same with '移動中' → Verify: badge '移動中'<br>3. Same with '到着' | Badge '対応中' / '到着' (02-04) | CMS Admin (99) | Web | High |  | UI-AUTO |
| E2E24-TC-005 |  | System (E2E) | Trouble Detail › 見積もり | NEW · Create 1 estimate(s) (total = FIX + 1) and 提示 | E2E24-TC-004 passed | 1. Login CMS Admin (99) (tạo thay worker) → open trouble → 'クイック操作' → select '見積承認待ち' → Verify: card 見積もり '必須'<br>2. Edit icon '見積もり' → for each of 'E2E24-New': '登録' → 見積名 → '追加' → '作業', 作業項目 'Autotest', 単価 so that total = FIX + 1 → '決定' → '決定' (top right) → Verify: row '下書き'<br>3. Tick 'E2E24-New' → '提示する' → Verify: '以下1件の見積を店舗へ提出しますか' → '決定' → Verify: '承認待ち'<br>4. '閉じる' → '保存' → '決定' → 'OK' | Badge '対応中' / '見積承認待ち' (02-05), estimate '承認待ち'. NEW flow stops here; no CONTINUE (G9) | CMS Admin (99) (tạo thay worker) | Web | High |  | UI-AUTO |

## Quyết định áp dụng (QUESTIONS.md)
C2, C4, C6, G1, G2, G3, G6, G9, G24, G25, G27, N11, N15
