# Test case — E2E-35 · Create trouble via non-trouble navi
- Project: qnavi · Scope Key: e2e-suite · Sheet prefix: E2E35
- Source: projects/qnavi/spec/e2e-suite.md › E2E-35 (gốc: raw/Test suite for automation_E2E.xlsx, "Expanded v2"). Luồng thao tác: raw/Automation Test AI - Format Main Case.csv, TC LOCKED phase007, trả lời Q2–Q9 ngày 13/10.
- State: DRAFT · Revision: 1 · Approved by / at: —
- Môi trường: tuỳ biến khi chạy (Q9).
- Ngoại lệ D05: 1 file = 1 kịch bản nối tiếp NEW → CONTINUE → 完了; mỗi TC = 1 giai đoạn. 'Verify:' = điểm kiểm giữa chừng.
- Quy ước chung: báo giá do Admin (99) tạo thay worker trên CMS; số tiền theo FIX (限度額 đọc ở TC-001); ≤ FIX → tự duyệt (Q5); báo cáo = đổi trạng thái trên CMS (Q7); bỏ 日程承認 (Q8).
- Câu hỏi [Gx]: xem projects/qnavi/qc/test-cases/e2e-suite/QUESTIONS.md.

## Tham số kịch bản
| Tham số | Giá trị |
|---|---|
| Biến thể | Create trouble via non-trouble navi |
| Tạo trouble | admin · 通常依頼 · トラブルナビ OFF · シサンNAVI OFF |
| Key | Worker: - · Approver: - |
| Báo giá NEW | 1 · fix あり/yes · <= fix → total = FIX − 1 · type 01 · 稟議 🚫 · người duyệt Store Manager |
| Ngoại lệ NEW | - |
| Báo cáo / thanh toán NEW | report: Admin · payer: Admin |
| Continue | subadmin · urgent ❌ · version New · đổi worker 変更あり (subadmin) |
| Báo giá CONTINUE | 1 · fix あり/yes · <= fix → total = FIX − 1 · type 01 · 稟議 ❌ · người duyệt Read-key store / auto |
| Kết luận gốc | Trouble created via non-trouble navi can be completed |

## Test case
| TC ID | Viewpoint ID | Test Level | Main Screen | Function | Pre-condition | Steps | Expected Results | Role | OS | Priority | Status | Automation Eligibility |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| E2E35-TC-001 |  | System (E2E) | チェーンシステム情報 | SETUP · Linksys: トラブルナビ OFF, シサンNAVI OFF; store 01; 限度額 read | - | 1. Login Admin (99) → Dashboard → menu 'チェーンシステム情報' → search 'Linksys' → open 'Linksys Chain System' → '編集'<br>2. Set toggle 'トラブルナビ' = OFF, 'シサンNAVI' = OFF → save (保存 → 決定 → OK)<br>3. Scroll to store list → open the store type 01 store [G1] → Verify: 承認タイプ = 01 [G2]<br>4. Verify: field '限度額' has a value → record it as FIX | Linksys shows トラブルナビ OFF / シサンNAVI OFF; store approve type 01; FIX recorded | CMS Admin (99) | Web | High |  | UI-AUTO |
| E2E35-TC-002 |  | System (E2E) | 作業依頼登録 | NEW · admin creates normal trouble (web form) | E2E35-TC-001 passed | 1. Login Admin (99)<br>2. Menu '作業依頼登録' → '新規依頼' → '次へ' [G6]<br>3. 'チェーン店舗選択' → search 社名 'Linksys', 店名 = store type 01 store → '選択' (admin / manager only) → '担当者選択' → first row → '次へ'<br>4. Select 作業項目 '操作テスト' > 'トイレ（テスト）' > 'つまり：大便器（テスト）'<br>5. '次へ' → Step 3 故障詳細: upload 'hieu6.jpg', 故障詳細記入欄 'AUTOMATION'<br>6. '決定して問合わせ' → '決定' ('この新規依頼を保存します。よろしいですか？'; if date error: '明日以降', 開始 4:00) → 'OK' → minimize chat; record 依頼番号 | Trouble is created for the store: '問い合わせ中' / '受注待ち', 業者 '未確定', 見積書 '未提出' | CMS Admin (99) | Web | High |  | UI-AUTO |
| E2E35-TC-003 |  | System (E2E) | Trouble Detail › 状態変更 | NEW · Admin: 対応中 + assign worker | E2E35-TC-002 passed | 1. Login Admin (99) → open trouble (依頼番号)<br>2. 'クイック操作' → 状態 '対応中'<br>3. Edit icon '作業者' → search 社名 'linksys' → '選択' row 'linksysworker' → Verify: 作業者 'LINKSYS WORKER'<br>4. '保存' → '決定' → 'OK' | Badge '対応中' / '受注待ち', 業者 'LINKSYS WORKER' | CMS Admin (99) | Web | High |  | UI-AUTO |
| E2E35-TC-004 |  | System (E2E) | Trouble Detail › 状態変更 | NEW · 受注 → 移動中 → 到着 (02-04) | E2E35-TC-003 passed | 1. 'クイック操作' → 対応中の状態（新規） '受注' → '保存' → '決定' → 'OK' → Verify: badge '受注'<br>2. Same with '移動中' → Verify: badge '移動中'<br>3. Same with '到着' | Badge '対応中' / '到着' (02-04) | CMS Admin (99) | Web | High |  | UI-AUTO |
| E2E35-TC-005 |  | System (E2E) | Trouble Detail › 見積もり | NEW · Create 1 estimate(s) (total = FIX − 1) and 提示 | E2E35-TC-004 passed | 1. Login CMS Admin (99) (tạo thay worker) → open trouble → 'クイック操作' → select '見積承認待ち' → Verify: card 見積もり '必須'<br>2. Edit icon '見積もり' → for each of 'E2E35-New': '登録' → 見積名 → '追加' → '作業', 作業項目 'Autotest', 単価 so that total = FIX − 1 → '決定' → '決定' (top right) → Verify: row '下書き'<br>3. Tick 'E2E35-New' → '提示する' → Verify: '以下1件の見積を店舗へ提出しますか' → '決定' → Verify: '承認待ち'<br>4. '閉じる' → '保存' → '決定' → 'OK' | Badge '対応中' / '見積承認待ち' (02-05), 見積書 'あり', estimate(s) '承認待ち' | CMS Admin (99) (tạo thay worker) | Web | High |  | UI-AUTO |
| E2E35-TC-006 |  | System (E2E) | Trouble Detail › 見積もり | NEW · ≤ FIX → auto approve (no approver) | E2E35-TC-005 passed | 1. Reload trouble → '見積もり' → Verify: no approver action was done<br>Note: cột gốc ghi người duyệt 'Store Manager' nhưng số tiền ≤ FIX → theo Q5 là tự duyệt [G27] | Estimate 'E2E35-New' = '承認済み' automatically; badge '対応中' / '作業中'; no '稟議承認中' | CMS Admin (99) | Web | High |  | UI-AUTO |
| E2E35-TC-007 |  | System (E2E) | Trouble Detail › 状態変更 / 報告書 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | E2E35-TC-006 passed | 1. Login Admin (99) → 'クイック操作' → '作業完了' → '保存' → '決定' → 'OK' → Verify: badge '作業完了'<br>2. 'クイック操作' → '報告済' → edit icon '報告書' → '編集' → 開始 day 1, 終了 day 2, 原因と発生起因 'automation', 作業前 'hieu4.jpg', 作業後 'hieu3.jpg' → '完了'<br>3. '保存' → '決定' → 'OK' | Badge '対応中' / '報告済' (02-09) | CMS Admin (99) | Web | High |  | UI-AUTO |
| E2E35-TC-008 |  | System (E2E) | Trouble Detail › 作業完了確認 | NEW · Admin 確認・決済 → 完了 | E2E35-TC-007 passed | 1. Logout → login CMS Admin (99) → open trouble → minimize chat<br>2. '作業完了確認' → Verify: '支払情報' with 作業項目 and total of the approved estimate<br>3. Star '感動' → comment 'Automation test' → '作業完了確認' → '決定' → Verify: '作業依頼の決済状態の保存が完了しました。' → 'OK' | Badge '完了' / '報告済', '作業完了確認' disappears; NEW trouble = 完了 | CMS Admin (99) | Web | High |  | UI-AUTO |
| E2E35-TC-009 |  | System (E2E) | 作業依頼登録 (継続) | CONTINUE · subadmin creates 継続依頼 '_2' | E2E35-TC-008 passed | 1. Logout → login CMS SubAdmin (98) → menu '作業依頼登録' → radio '継続依頼' → '次へ'<br>2. '作業依頼選択' → select the trouble of TC-002 → Verify: store and 作業項目 filled from the original<br>3. '決定して問合わせ' → '決定' → 'OK' | Continue trouble '<依頼番号>_2' is created: '対応中' / '見積待ち' (02-10), version New | CMS SubAdmin (98) | Web | High |  | UI-AUTO |
| E2E35-TC-010 |  | System (E2E) | Trouble Detail › 状態変更 (継続) | CONTINUE · subadmin changes 作業スタッフ (変更あり) | E2E35-TC-009 passed | 1. Open '_2' → 'クイック操作' → edit icon '作業者' → select worker 2 [G7] → '保存' → '決定' → 'OK' | 業者 shows worker 2; status unchanged | CMS SubAdmin (98) | Web | High |  | UI-AUTO |
| E2E35-TC-011 |  | System (E2E) | Trouble Detail › 見積もり (継続) | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | E2E35-TC-010 passed | 1. Login Admin (99) → open '_2' → 'クイック操作' → edit icon '見積もり' → for each of 'E2E35-Cont': '登録', item '作業' 'Autotest', total = FIX − 1 → '決定'<br>2. Tick → '提示する' → '決定' → Verify: '承認待ち'<br>3. '閉じる' → select '見積承認待ち' → '保存' → '決定' → 'OK' | Badge '対応中' / '見積承認待ち' (02-20) | CMS Admin (99) | Web | High |  | UI-AUTO |
| E2E35-TC-012 |  | System (E2E) | Trouble Detail › 見積もり | CONTINUE · ≤ FIX → auto approve (no approver) | E2E35-TC-011 passed | 1. Reload trouble → '見積もり' → Verify: no approver action was done | Estimate 'E2E35-Cont' = '承認済み' automatically; badge '対応中' / '見積承認済'; no '稟議承認中' | CMS Admin (99) | Web | High |  | UI-AUTO |
| E2E35-TC-013 |  | System (E2E) | Trouble Detail › 状態変更 (継続) | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | E2E35-TC-012 passed | 1. Login Admin (99) → 'クイック操作' → '日程確定' → '保存' → '決定' → 'OK'<br>2. Same with '移動中', '到着', '作業中', '作業完了' → Verify: badge after each step | Badge '対応中' / '作業完了' (02-80) | CMS Admin (99) | Web | High |  | UI-AUTO |
| E2E35-TC-014 |  | System (E2E) | Trouble Detail › 報告書 (継続) | CONTINUE · 報告済 (02-90) | E2E35-TC-013 passed | 1. 'クイック操作' → '報告済' → edit '報告書' → '編集' → 開始 / 終了, 原因と発生起因 'automation', photos → '完了' → '保存' → '決定' → 'OK' | Badge '対応中' / '報告済' (02-90) | CMS Admin (99) | Web | High |  | UI-AUTO |
| E2E35-TC-015 |  | System (E2E) | Trouble Detail › 作業完了確認 (継続) | CONTINUE · Admin 確認・決済 → 完了 | E2E35-TC-014 passed | 1. Logout → login CMS Admin (99) → open '_2'<br>2. '作業完了確認' → Verify: '支払情報' total of the CONTINUE estimate<br>3. '感動' → 'Automation test' → '作業完了確認' → '決定' → 'OK' | '_2' badge '完了' / '報告済'; both troubles 完了 | CMS Admin (99) | Web | High |  | UI-AUTO |

## Câu hỏi ảnh hưởng file này
G1, G2, G6, G7, G8, G27
