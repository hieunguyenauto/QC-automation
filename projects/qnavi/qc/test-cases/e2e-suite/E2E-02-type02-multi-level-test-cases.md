# Test case — E2E-02 · Type02 multi-level / highest must approve
- Project: qnavi · Scope Key: e2e-suite · Sheet prefix: E2E02
- Source: projects/qnavi/spec/e2e-suite.md › E2E-02 (gốc: raw/Test suite for automation_E2E.xlsx, "Expanded v2"). Luồng thao tác: raw/Automation Test AI - Format Main Case.csv, TC LOCKED phase007, trả lời Q2–Q9 ngày 13/10.
- State: DRAFT · Revision: 1 · Approved by / at: —
- Môi trường: tuỳ biến khi chạy (Q9).
- Ngoại lệ D05: 1 file = 1 kịch bản nối tiếp NEW → CONTINUE → 完了; mỗi TC = 1 giai đoạn. 'Verify:' = điểm kiểm giữa chừng.
- Quy ước chung: báo giá do Admin (99) tạo thay worker trên CMS; số tiền theo FIX (限度額 đọc ở TC-001); ≤ FIX → tự duyệt (Q5); báo cáo = đổi trạng thái trên CMS (Q7); bỏ 日程承認 (Q8).
- Câu hỏi [Gx]: xem projects/qnavi/qc/test-cases/e2e-suite/QUESTIONS.md.

## Tham số kịch bản
| Tham số | Giá trị |
|---|---|
| Biến thể | Type02 multi-level / highest must approve |
| Tạo trouble | chainstore manager · 通常依頼 · トラブルナビ ON · シサンNAVI OFF |
| Key | Worker: Write key · Approver: Read key |
| Báo giá NEW | 1 · fix あり/yes · > fix → total = FIX + 1 · type 02 · 稟議 ❌ · người duyệt CS Admin (highest Lv) |
| Ngoại lệ NEW | - |
| Báo cáo / thanh toán NEW | report: CS Admin · payer: CS Admin |
| Continue | subadmin · urgent ❌ · version New · đổi worker 変更なし (subadmin) |
| Báo giá CONTINUE | 1 · fix あり/yes · <=fix → total = FIX − 1 · type 02 · 稟議 ❌ · người duyệt CS Admin (highest) / auto |
| Kết luận gốc | Type02 highest-level ends flow. Completed. |

## Test case
| TC ID | Viewpoint ID | Test Level | Main Screen | Function | Pre-condition | Steps | Expected Results | Role | OS | Priority | Status | Automation Eligibility |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| E2E02-TC-001 |  | System (E2E) | チェーンシステム情報 | SETUP · Linksys: トラブルナビ ON, シサンNAVI OFF; store 02; 限度額 read | - | 1. Login Admin (99) → Dashboard → menu 'チェーンシステム情報' → search 'Linksys' → open 'Linksys Chain System' → '編集'<br>2. Set toggle 'トラブルナビ' = ON, 'シサンNAVI' = OFF → save (保存 → 決定 → OK)<br>3. Scroll to store list → open the store type 02 store [G1] → Verify: 承認タイプ = 02 [G2]<br>4. Verify: field '限度額' has a value → record it as FIX | Linksys shows トラブルナビ ON / シサンNAVI OFF; store approve type 02; FIX recorded | CMS Admin (99) | Web | High |  | UI-AUTO |
| E2E02-TC-002 |  | System (E2E) | 作業依頼登録 (トラブルナビ) | NEW · chainstore manager creates normal trouble (トラブルナビ) | E2E02-TC-001 passed | 1. Login ChainStore Manager (01) [G1] → Verify: Dashboard<br>2. Menu '作業依頼登録' → select category '水' → Verify: webview トラブルナビ opens<br>3. Select '中項目', '小項目', '症状' (no field '資産' because シサンNAVI OFF) → '次へ'<br>4. Click 'このまま依頼する' → click 'このまま依頼する' again<br>5. Upload 'hieu6.jpg', input text 'AUTOMATION' → click next (icon button)<br>6. Select radio '至急' → click '依頼する' [G5]<br>7. Click 'トップ画面に戻る' → Verify: Dashboard; record 依頼番号 | Trouble is created for the store: '問い合わせ中' / '受注待ち', 業者 '未確定', 見積書 '未提出' | ChainStore Manager (01) [G1] | Web | High |  | UI-AUTO |
| E2E02-TC-003 |  | System (E2E) | Trouble Detail › 状態変更 | NEW · Admin: 対応中 + assign worker | E2E02-TC-002 passed | 1. Login Admin (99) → open trouble (依頼番号)<br>2. 'クイック操作' → 状態 '対応中'<br>3. Edit icon '作業者' → search 社名 'linksys' → '選択' row 'linksysworker' → Verify: 作業者 'LINKSYS WORKER'<br>4. '保存' → '決定' → 'OK' | Badge '対応中' / '受注待ち', 業者 'LINKSYS WORKER' | CMS Admin (99) | Web | High |  | UI-AUTO |
| E2E02-TC-004 |  | System (E2E) | Trouble Detail › 状態変更 | NEW · 受注 → 移動中 → 到着 (02-04) | E2E02-TC-003 passed | 1. 'クイック操作' → 対応中の状態（新規） '受注' → '保存' → '決定' → 'OK' → Verify: badge '受注'<br>2. Same with '移動中' → Verify: badge '移動中'<br>3. Same with '到着' | Badge '対応中' / '到着' (02-04) | CMS Admin (99) | Web | High |  | UI-AUTO |
| E2E02-TC-005 |  | System (E2E) | Trouble Detail › 見積もり | NEW · Create 1 estimate(s) (total = FIX + 1) and 提示 | E2E02-TC-004 passed | 1. Login CMS Admin (99) (tạo thay worker) → open trouble → 'クイック操作' → select '見積承認待ち' → Verify: card 見積もり '必須'<br>2. Edit icon '見積もり' → for each of 'E2E02-New': '登録' → 見積名 → '追加' → '作業', 作業項目 'Autotest', 単価 so that total = FIX + 1 → '決定' → '決定' (top right) → Verify: row '下書き'<br>3. Tick 'E2E02-New' → '提示する' → Verify: '以下1件の見積を店舗へ提出しますか' → '決定' → Verify: '承認待ち'<br>4. '閉じる' → '保存' → '決定' → 'OK' | Badge '対応中' / '見積承認待ち' (02-05), 見積書 'あり', estimate(s) '承認待ち' | CMS Admin (99) (tạo thay worker) | Web | High |  | UI-AUTO |
| E2E02-TC-006 |  | System (E2E) | Trouble Detail › 見積もり | NEW · Approve type 02: CS Admin (highest Lv) | E2E02-TC-005 passed | 1. Logout → login CS Admin (highest Lv) [G1] → open trouble → '見積もり' → expand 'E2E02-New' → Verify: card 店舗 has '承認する', '差し戻し'; amounts visible<br>1b. Login a lower-level CS Admin → '承認する' → Verify: still '承認待ち' (highest level must approve) [G22]<br>2. '承認する' → Verify: 'この見積を承認しますか', '承認後は取り消すことができません' → '決定' | Estimate 'E2E02-New' = '承認済み', card 店舗 'この見積は承認済みです。現在実行できるアクションはありません。'; badge '対応中' / '作業中' | CS Admin (highest Lv) [G1] | Web | High |  | UI-AUTO |
| E2E02-TC-007 |  | System (E2E) | Trouble Detail › 状態変更 / 報告書 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | E2E02-TC-006 passed | 1. Login Admin (99) → 'クイック操作' → '作業完了' → '保存' → '決定' → 'OK' → Verify: badge '作業完了'<br>2. 'クイック操作' → '報告済' → edit icon '報告書' → '編集' → 開始 day 1, 終了 day 2, 原因と発生起因 'automation', 作業前 'hieu4.jpg', 作業後 'hieu3.jpg' → '完了'<br>3. '保存' → '決定' → 'OK' | Badge '対応中' / '報告済' (02-09) | CMS Admin (99) | Web | High |  | UI-AUTO |
| E2E02-TC-008 |  | System (E2E) | Trouble Detail › 作業完了確認 | NEW · CS Admin 確認・決済 → 完了 | E2E02-TC-007 passed | 1. Logout → login CS Admin (approver) [G1] → open trouble → minimize chat<br>2. '作業完了確認' → Verify: '支払情報' with 作業項目 and total of the approved estimate<br>3. Star '感動' → comment 'Automation test' → '作業完了確認' → '決定' → Verify: '作業依頼の決済状態の保存が完了しました。' → 'OK' | Badge '完了' / '報告済', '作業完了確認' disappears; NEW trouble = 完了 | CS Admin (approver) [G1] | Web | High |  | UI-AUTO |
| E2E02-TC-009 |  | System (E2E) | 作業依頼登録 (継続) | CONTINUE · subadmin creates 継続依頼 '_2' | E2E02-TC-008 passed | 1. Logout → login CMS SubAdmin (98) → menu '作業依頼登録' → radio '継続依頼' → '次へ'<br>2. '作業依頼選択' → select the trouble of TC-002 → Verify: store and 作業項目 filled from the original<br>3. '決定して問合わせ' → '決定' → 'OK' | Continue trouble '<依頼番号>_2' is created: '対応中' / '見積待ち' (02-10), version New | CMS SubAdmin (98) | Web | High |  | UI-AUTO |
| E2E02-TC-010 |  | System (E2E) | Trouble Detail › 状態変更 (継続) | CONTINUE · 作業スタッフ unchanged (変更なし) | E2E02-TC-009 passed | 1. Open '_2' → Verify: 業者 = 'LINKSYS WORKER' (inherited) | Worker inherited from the original trouble | CMS SubAdmin (98) | Web | High |  | UI-AUTO |
| E2E02-TC-011 |  | System (E2E) | Trouble Detail › 見積もり (継続) | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | E2E02-TC-010 passed | 1. Login Admin (99) → open '_2' → 'クイック操作' → edit icon '見積もり' → for each of 'E2E02-Cont': '登録', item '作業' 'Autotest', total = FIX − 1 → '決定'<br>2. Tick → '提示する' → '決定' → Verify: '承認待ち'<br>3. '閉じる' → select '見積承認待ち' → '保存' → '決定' → 'OK' | Badge '対応中' / '見積承認待ち' (02-20) | CMS Admin (99) | Web | High |  | UI-AUTO |
| E2E02-TC-012 |  | System (E2E) | Trouble Detail › 見積もり | CONTINUE · ≤ FIX → auto approve (no approver) | E2E02-TC-011 passed | 1. Reload trouble → '見積もり' → Verify: no approver action was done | Estimate 'E2E02-Cont' = '承認済み' automatically; badge '対応中' / '見積承認済'; no '稟議承認中' | CMS Admin (99) | Web | High |  | UI-AUTO |
| E2E02-TC-013 |  | System (E2E) | Trouble Detail › 状態変更 (継続) | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | E2E02-TC-012 passed | 1. Login Admin (99) → 'クイック操作' → '日程確定' → '保存' → '決定' → 'OK'<br>2. Same with '移動中', '到着', '作業中', '作業完了' → Verify: badge after each step | Badge '対応中' / '作業完了' (02-80) | CMS Admin (99) | Web | High |  | UI-AUTO |
| E2E02-TC-014 |  | System (E2E) | Trouble Detail › 報告書 (継続) | CONTINUE · 報告済 (02-90) | E2E02-TC-013 passed | 1. 'クイック操作' → '報告済' → edit '報告書' → '編集' → 開始 / 終了, 原因と発生起因 'automation', photos → '完了' → '保存' → '決定' → 'OK' | Badge '対応中' / '報告済' (02-90) | CMS Admin (99) | Web | High |  | UI-AUTO |
| E2E02-TC-015 |  | System (E2E) | Trouble Detail › 作業完了確認 (継続) | CONTINUE · CS Admin 確認・決済 → 完了 | E2E02-TC-014 passed | 1. Logout → login CS Admin (approver) [G1] → open '_2'<br>2. '作業完了確認' → Verify: '支払情報' total of the CONTINUE estimate<br>3. '感動' → 'Automation test' → '作業完了確認' → '決定' → 'OK' | '_2' badge '完了' / '報告済'; both troubles 完了 | CS Admin (approver) [G1] | Web | High |  | UI-AUTO |

## Câu hỏi ảnh hưởng file này
G1, G2, G5, G22
