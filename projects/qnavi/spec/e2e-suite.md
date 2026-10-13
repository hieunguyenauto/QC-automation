<!-- Nguồn: projects/qnavi/raw/Test suite for automation_E2E.xlsx · Sheet: Test scenario · Import: 2026-10-13 · Revision gốc: Expanded v2 -->
# Test suite for automation E2E — 39 kịch bản (New → Continue → 完了)

Tiêu đề gốc (C7): Qnavi_Toridoll_Estimations — System Test Scenario (Full E2E: New → Continue) — Expanded v2

Ghi chú gốc (A8): Notation: ✅ implemented ❌ not implemented/NA 🚫 disregarded \| Each column = 1 full flow running straight New→Continue to 完了. \| See sheet 'Flow Notes' for tricky statuses (取り下げ却下 = copy-only, re-submit after approved, urgent skip).

Ô tổng gốc (A2:O3): Total TCs = 34, High = 34 (khác số cột thực tế = 39).

Sheet "Flow Notes" được nhắc trong A8 nhưng KHÔNG có trong file.

## Bảng tóm tắt

| Case | Biến thể (row 14) | Tạo trouble | Approve type (New) | Urgent New/Cont | Kết luận (row 78) |
|---|---|---|---|---|---|
| E2E-01 | Type01 direct /  approver=Chain Store | chainstore | 1 | ❌ / ❌ | Type01 direct approve. Both phases Completed. |
| E2E-02 | Type02 multi-level /  highest must approve | chainstore manager | 2 | ❌ / ❌ | Type02 highest-level ends flow. Completed. |
| E2E-03 | Type03 amount-range | chainstore manager | 3 | ❌ / ❌ | Type03 range-based approve. Completed. |
| E2E-04 | Type04 Ringi /  sequential Lv1→3 | chainstore manager | 4 | ❌ / ❌ | Type04 Ringi sequential. Completed. |
| E2E-05 | Type04 auto-approve /  (< ¥5,000 below min) | chainstore | 4 | ❌ / ❌ | Type04 auto-approve below min. Completed. |
| E2E-06 | Type03 full-permission /  account (range 0→∞) | chainstore manager | 3 | ❌ / ❌ | Type03 full-permission approve. Completed. |
| E2E-07 | Type04 Level 0 /  substitute approver | chainstore manager | 4 | ❌ / ❌ | Type04 Level 0 substitute. Completed. |
| E2E-08 | fix_amount NOT set /  (none) both phases | chainstore | 2 | ❌ / ❌ | No fix_amount both phases. Completed. |
| E2E-09 | fix only NEW /  (continue none) | chainstore manager | 4 | ❌ / ❌ | fix only NEW. Completed. |
| E2E-10 | fix both NEW and CONTINUE | chainstore manager | 4 | ❌ / ❌ | fix only CONTINUE. Completed. |
| E2E-11 | Boundary /  est amount == fix | chainstore manager | 4 | ❌ / ❌ | Boundary amount == fix. Completed. |
| E2E-12 | Reject 差し戻し → /  re-edit, type 02→04 | chainstore | 2 | ❌ / ❌ | Reject→re-edit, type 02→04. Completed. |
| E2E-13 | ReqCancel→APPROVE→ /  resubmit type 04→02 | admin | 4 | ❌ / ❌ | ReqCancel approved→resubmit, type 04→02. Completed. |
| E2E-14 | ReqCancel→REJECT→ /  取下却下→COPY→new | admin | 3 | ❌ / ❌ | Cancel rejected → 取り下げ却下 (copy-only) → copy→new→approve. Completed. |
| E2E-15 | Re-submit AFTER approved /  → old 承認済み→失効 | chainstore | 1 | ❌ / ❌ | Re-submit after approved: old→失効. Completed. |
| E2E-16 | Re-submit after approved /  ×2 + type 02→04 | chainstore manager | 2 | ❌ / ❌ | Re-submit after approved ×2 + type change. Completed. |
| E2E-17 | Multi-est 3: 1 approve /  → 2 失効 (draft kept) | chainstore manager | 4 | ❌ / ❌ | Multi-est: 1 approve, 2→失効, draft kept. Completed. |
| E2E-18 | Bulk submit 3 drafts /  → 1 notification | chainstore manager | 2 | ❌ / ❌ | Bulk submit 3→1 notification→approve. Completed. |
| E2E-19 | Urgent NEW only /  (continue normal) | chainstore | 1 | ✅ / ❌ | Urgent NEW only; continue normal. Both Completed. |
| E2E-20 | Urgent CONTINUE only /  (new normal) | chainstore | 1 | ❌ / ✅ | Urgent CONTINUE only; new normal. Both Completed. |
| E2E-21 | Urgent BOTH phases /  skip approval | chainstore | 1 | ✅ / ✅ | Urgent both phases. Both Completed. |
| E2E-22 | Urgent NEW + multi-est /  (失効 under urgent) | chainstore manager | 4 | ✅ / ❌ | Urgent new + multi-est. Both Completed. |
| E2E-23 | Urgent CONTINUE /  + staff change | chainstore manager | 2 | ❌ / ✅ | Urgent continue + staff change. Both Completed. |
| E2E-24 | Worker(iOS) create → /  Admin approve (CMS) | admin | 2 | ❌ / ❌ | Worker iOS → Admin CMS approve. Completed. |
| E2E-25 | Worker(Android) → /  Sub-Admin approve (CMS) | admin | 3 | ❌ / ❌ | Worker Android → Sub-Admin CMS. Completed. |
| E2E-26 | Worker Company /  creates est (Type04) | chainstore manager | 4 | ❌ / ❌ | Worker Company creates est, Type04. Completed. |
| E2E-27 | Cross-device iOS→ /  Android→Webview | chainstore | 1 | ❌ / ❌ | Cross-device iOS/Android/Webview. Completed. |
| E2E-28 | OLD version → /  continue stays OLD | admin | 2 | ❌ / ❌ | OLD version inherited to continue. Completed. |
| E2E-29 | ★KEY: No-key approver → /  reject only → read-key approves | chainstore | 2 | ❌ / ❌ | No-key rejects, read-key approves. Both Completed. |
| E2E-30 | ★KEY: Sub-Admin read-key /  approves (CMS) | admin | 2 | ❌ / ❌ | Sub-Admin (read key) approves. Both Completed. |
| E2E-31 | ★KEY: encryption integrity /  write→read across continue | chainstore | 1 | ❌ / ❌ | Encryption: write-create, read-approve; continue inherits. Completed. |
| E2E-32 | ★KEY: Worker NO key /  (admin-created est) | admin | 2 | ❌ / ❌ | Worker no-key (admin-created); read-key approves. Completed. |
| E2E-33 | ★KEY: Worker No key + Store No key /  → reject → read-key approve | admin | 2 | ❌ / ❌ | Worker no-key + no-key store reject → read-key approve. Completed. |
| E2E-34 | ★KEY: No-key approver UI /  approve disabled / reject only | CMS Web | 1 | ❌ / ❌ | No-key approver: approve disabled, reject only; read-key completes. Completed. |
| E2E-35 | Create trouble via non-trouble navi | admin | 1 | - / - | Trouble created via non-trouble navi can be completed |
| E2E-36 | Create trouble via trouble navi | chainstore | 1 | - / - | Trouble created via trouble navi can be completed |
| E2E-37 | Create trouble with asset via non-trouble navi | chainstore manager | 1 | - / - | Trouble with asset can be completed |
| E2E-38 | Create trouble with asset via trouble navi | chainstore manager | 1 | - / - | Trouble with asset can be completed |
| E2E-39 | Create report with attach PDF file | chainstore | 1 | - / - | Trouble with attached PDF report can be completed |

## E2E-01 — Type01 direct /  approver=Chain Store

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | Write key |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | Chain Store |
| 22 | 作業報告承認者(役割) | Report approver | Chain Store |
| 23 | 支払者(役割) | Payer | Chain Store |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | <= fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 1 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ❌ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | auto |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 1 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | chain store |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Type01 direct approve. Both phases Completed. |

## E2E-02 — Type02 multi-level /  highest must approve

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | Write key |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore manager |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | CS Admin (Lv1-4) |
| 22 | 作業報告承認者(役割) | Report approver | CS Admin |
| 23 | 支払者(役割) | Payer | CS Admin |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | > fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 2 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ❌ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | CS Admin (highest Lv) |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更なし |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <=fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 2 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | CS Admin (highest) / auto |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Type02 highest-level ends flow. Completed. |

## E2E-03 — Type03 amount-range

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | Write key |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore manager |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | CS Admin (range) |
| 22 | 作業報告承認者(役割) | Report approver | CS Admin |
| 23 | 支払者(役割) | Payer | CS Admin |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | within range |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 3 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ❌ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | CS Admin (range match) |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 3 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | CS Admin (range) / auto |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Type03 range-based approve. Completed. |

## E2E-04 — Type04 Ringi /  sequential Lv1→3

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | Write key |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore manager |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | CS Admin |
| 22 | 作業報告承認者(役割) | Report approver | CS Admin |
| 23 | 支払者(役割) | Payer | CS Admin |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | OFF |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | > fix (¥49,999) |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 4 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ✅ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | CS Admin (Lv1→3) |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 4 |
| 64 | 稟議承認中 | Ringi | ✅ |
| 65 | 承認者 | Approver | CS Admin (Lv1→3) |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Type04 Ringi sequential. Completed. |

## E2E-05 — Type04 auto-approve /  (< ¥5,000 below min)

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | Write key |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | N/A (auto-approve) |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | (auto) |
| 22 | 作業報告承認者(役割) | Report approver | CS Admin |
| 23 | 支払者(役割) | Payer | CS Admin |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | < ¥5,000 (below min) |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 → auto → 作業中02-07 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 4 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ❌ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | auto |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | < ¥5,000 |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 4 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | auto |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Type04 auto-approve below min. Completed. |

## E2E-06 — Type03 full-permission /  account (range 0→∞)

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | Write key |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore manager |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | CS Admin (0→∞) |
| 22 | 作業報告承認者(役割) | Report approver | CS Admin |
| 23 | 支払者(役割) | Payer | CS Admin |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | > fix (high) |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 3 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ❌ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | CS Admin (range 0→∞) |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 3 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | CS Admin (0→∞) / auto |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Type03 full-permission approve. Completed. |

## E2E-07 — Type04 Level 0 /  substitute approver

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | Write key |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore manager |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | Level 0 (sub) |
| 22 | 作業報告承認者(役割) | Report approver | CS Admin (Level 0) |
| 23 | 支払者(役割) | Payer | CS Admin (Level 0) |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | > fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 4 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ✅ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | Level 0 (substitute) |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 4 |
| 64 | 稟議承認中 | Ringi | ✅ |
| 65 | 承認者 | Approver | Level 0 / auto |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Type04 Level 0 substitute. Completed. |

## E2E-08 — fix_amount NOT set /  (none) both phases

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | Write key |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | Chain Store |
| 22 | 作業報告承認者(役割) | Report approver | Chain Store |
| 23 | 支払者(役割) | Payer | Chain Store |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | なし/no |
| 33 | 見積金額 | Est amount vs fix | no limit (any) |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 2 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ❌ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | Chain Store |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | なし/no |
| 61 | 見積金額 | Est amount vs fix | no limit (any) |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 2 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | Chain Store |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | No fix_amount both phases. Completed. |

## E2E-09 — fix only NEW /  (continue none)

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | Write key |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore manager |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | CS Admin |
| 22 | 作業報告承認者(役割) | Report approver | CS Admin |
| 23 | 支払者(役割) | Payer | CS Admin |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | OFF |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | > fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 4 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ✅ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | CS Admin |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更なし |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | なし/no |
| 61 | 見積金額 | Est amount vs fix | no limit |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 4 |
| 64 | 稟議承認中 | Ringi | ✅ |
| 65 | 承認者 | Approver | CS Admin |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | fix only NEW. Completed. |

## E2E-10 — fix both NEW and CONTINUE

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | Write key |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore manager |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | Store Manager |
| 22 | 作業報告承認者(役割) | Report approver | Store Manager |
| 23 | 支払者(役割) | Payer | Store Manager |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | > fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 4 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ✅ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | CS Admin (Lv1→3) |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | > fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 4 |
| 64 | 稟議承認中 | Ringi | ✅ |
| 65 | 承認者 | Approver | CS Admin (Lv1→3) |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | fix only CONTINUE. Completed. |

## E2E-11 — Boundary /  est amount == fix

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | Write key |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore manager |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | CS Admin |
| 22 | 作業報告承認者(役割) | Report approver | CS Admin |
| 23 | 支払者(役割) | Payer | CS Admin |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | equal fix value |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 4 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ✅ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | auto |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | equal limit value |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 4 |
| 64 | 稟議承認中 | Ringi | ✅ |
| 65 | 承認者 | Approver | CS Admin / auto |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Boundary amount == fix. Completed. |

## E2E-12 — Reject 差し戻し → /  re-edit, type 02→04

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | Write key |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | CS Admin |
| 22 | 作業報告承認者(役割) | Report approver | CS Admin |
| 23 | 支払者(役割) | Payer | CS Admin |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | > fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 2 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | OK (after→04) |
| 39 | 再編集→再提示 | Re-edit → Resubmit | ✅ 再承認待ち |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 02 → 04 |
| 41 | 承認者 | Approver | CS Admin |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | ✅ non-target→失効 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 2 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | CS Admin / auto |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Reject→re-edit, type 02→04. Completed. |

## E2E-13 — ReqCancel→APPROVE→ /  resubmit type 04→02

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | No key (creator holds it) |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | admin |
| 20 | 見積作成者(役割) | Est creator (role) | admin |
| 21 | 見積書承認者(役割) | Approver (role) | Store Manager |
| 22 | 作業報告承認者(役割) | Report approver | Store Manager |
| 23 | 支払者(役割) | Payer | Store Manager |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | > fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 4 |
| 36 | 取下げ申請 | Request cancel | ✅ 取下げ承認待ち |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | ✅ approve → 再編集 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | OK (initial 04) |
| 39 | 再編集→再提示 | Re-edit → Resubmit | ✅ 再承認待ち |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 04 → 02 |
| 41 | 承認者 | Approver | Store Manager |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 4 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | CS Admin / auto |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | ReqCancel approved→resubmit, type 04→02. Completed. |

## E2E-14 — ReqCancel→REJECT→ /  取下却下→COPY→new

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | No key (creator holds it) |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | admin |
| 20 | 見積作成者(役割) | Est creator (role) | subadmin |
| 21 | 見積書承認者(役割) | Approver (role) | CS Admin (range) |
| 22 | 作業報告承認者(役割) | Report approver | CS Admin |
| 23 | 支払者(役割) | Payer | CS Admin |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | OFF |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | within range |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 3 |
| 36 | 取下げ申請 | Request cancel | ✅ 取下げ承認待ち |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | ❌ reject → 取り下げ却下 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ❌ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | コピー → 新規下書き → 提示 |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | CS Admin (range) |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更なし |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 3 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | Chain Store / auto |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Cancel rejected → 取り下げ却下 (copy-only) → copy→new→approve. Completed. |

## E2E-15 — Re-submit AFTER approved /  → old 承認済み→失効

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | Write key |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | Chain Store |
| 22 | 作業報告承認者(役割) | Report approver | Chain Store |
| 23 | 支払者(役割) | Payer | Chain Store |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | <= fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 1 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ❌ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 01 → 01 (after approved) |
| 41 | 承認者 | Approver | auto |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved |
| 43 | 失効 | Other est → 失効 | ✅ old approved→失効 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | ✅ old 承認済み→失効; new→承認待ち→承認済み |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 1 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | Chain Store / auto |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Re-submit after approved: old→失効. Completed. |

## E2E-16 — Re-submit after approved /  ×2 + type 02→04

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | Write key |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore manager |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | CS Admin |
| 22 | 作業報告承認者(役割) | Report approver | CS Admin |
| 23 | 支払者(役割) | Payer | CS Admin |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | > fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 2 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | OK (2nd→04) |
| 39 | 再編集→再提示 | Re-edit → Resubmit | ✅ 再承認待ち |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 02 → 04 (after approved) |
| 41 | 承認者 | Approver | CS Admin |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | ✅ approved→失効 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | ✅ ×2: each approved→失効 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 2 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | CS Admin / auto |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Re-submit after approved ×2 + type change. Completed. |

## E2E-17 — Multi-est 3: 1 approve /  → 2 失効 (draft kept)

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | Write key |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore manager |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | CS Admin |
| 22 | 作業報告承認者(役割) | Report approver | CS Admin |
| 23 | 支払者(役割) | Payer | CS Admin |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 3 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | > fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 4 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ✅ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | CS Admin |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | ✅ 2 est→失効 (下書き kept) |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 2 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 4 |
| 64 | 稟議承認中 | Ringi | ✅ |
| 65 | 承認者 | Approver | CS Admin / auto |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Multi-est: 1 approve, 2→失効, draft kept. Completed. |

## E2E-18 — Bulk submit 3 drafts /  → 1 notification

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | Write key |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore manager |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | CS Admin |
| 22 | 作業報告承認者(役割) | Report approver | CS Admin |
| 23 | 支払者(役割) | Payer | CS Admin |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 3 (bulk submit) |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | > fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 2 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ❌ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | CS Admin |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | ✅ others→失効 on approve |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 2 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | CS Admin / auto |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Bulk submit 3→1 notification→approve. Completed. |

## E2E-19 — Urgent NEW only /  (continue normal)

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | Write key |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ✅ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | skip(new) / Chain Store(cont) |
| 22 | 作業報告承認者(役割) | Report approver | Chain Store |
| 23 | 支払者(役割) | Payer | Chain Store |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 緊急依頼 / urgent |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | <= fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 作業中02-07 (urgent: skip est-approval) |
| 35 | 承認タイプ(初回) | Approve type (initial) | 1 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ❌ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | auto |
| 42 | 見積承認結果(状態) | Est approve result (status) | (already 作業中02-07 via urgent) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 1 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | Chain Store / auto |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Urgent NEW only; continue normal. Both Completed. |

## E2E-20 — Urgent CONTINUE only /  (new normal)

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | Write key |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ✅ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | Chain Store(new) / skip(cont) |
| 22 | 作業報告承認者(役割) | Report approver | Chain Store |
| 23 | 支払者(役割) | Payer | Chain Store |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | > fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 1 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ❌ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | Chain Store |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ✅ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix / >fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認済み02-40 (urgent: skip est-approval) |
| 63 | 承認タイプ | Approve type | 1 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | skip (urgent) |
| 66 | 見積承認結果(状態) | Est approve result (status) | (already 見積承認済み02-40 via urgent) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | (urgent: schedule auto/skip) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Urgent CONTINUE only; new normal. Both Completed. |

## E2E-21 — Urgent BOTH phases /  skip approval

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | Write key |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | N/A (skip approval) |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ✅ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ✅ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | skip (both) |
| 22 | 作業報告承認者(役割) | Report approver | Chain Store |
| 23 | 支払者(役割) | Payer | Chain Store |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 緊急依頼 / urgent |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | > fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 作業中02-07 (urgent: skip est-approval) |
| 35 | 承認タイプ(初回) | Approve type (initial) | 1 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ❌ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | skip (urgent) |
| 42 | 見積承認結果(状態) | Est approve result (status) | (already 作業中02-07 via urgent) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ✅ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix / >fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認済み02-40 (urgent: skip est-approval) |
| 63 | 承認タイプ | Approve type | 1 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | skip (urgent) |
| 66 | 見積承認結果(状態) | Est approve result (status) | (already 見積承認済み02-40 via urgent) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | (urgent: schedule auto/skip) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Urgent both phases. Both Completed. |

## E2E-22 — Urgent NEW + multi-est /  (失効 under urgent)

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | Write key |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ✅ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore manager |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | skip (urgent) |
| 22 | 作業報告承認者(役割) | Report approver | CS Admin |
| 23 | 支払者(役割) | Payer | CS Admin |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 緊急依頼 / urgent |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 3 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | > fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 作業中02-07 (urgent: skip est-approval) |
| 35 | 承認タイプ(初回) | Approve type (initial) | 4 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ❌ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | skip (urgent) |
| 42 | 見積承認結果(状態) | Est approve result (status) | (already 作業中02-07 via urgent) |
| 43 | 失効 | Other est → 失効 | ✅ non-target→失効 (verify under urgent) |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更なし |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 4 |
| 64 | 稟議承認中 | Ringi | ✅ |
| 65 | 承認者 | Approver | CS Admin / auto |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Urgent new + multi-est. Both Completed. |

## E2E-23 — Urgent CONTINUE /  + staff change

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | Write key |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ✅ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore manager |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | CS Admin |
| 22 | 作業報告承認者(役割) | Report approver | CS Admin |
| 23 | 支払者(役割) | Payer | CS Admin |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | > fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 2 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ❌ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | CS Admin |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ✅ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認済み02-40 (urgent: skip est-approval) |
| 63 | 承認タイプ | Approve type | 2 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | skip (urgent) |
| 66 | 見積承認結果(状態) | Est approve result (status) | (already 見積承認済み02-40 via urgent) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | (urgent: schedule auto/skip) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Urgent continue + staff change. Both Completed. |

## E2E-24 — Worker(iOS) create → /  Admin approve (CMS)

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | Write key |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | admin |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | Admin |
| 22 | 作業報告承認者(役割) | Report approver | Admin |
| 23 | 支払者(役割) | Payer | Admin |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | > fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 2 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ❌ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | Admin (CMS) |
| 42 | 見積承認結果(状態) | Est approve result (status) | 🚫 |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 🚫 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 🚫 |
| 49 | 新規結果 | NEW trouble result | 🚫 |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 2 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | Admin |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Worker iOS → Admin CMS approve. Completed. |

## E2E-25 — Worker(Android) → /  Sub-Admin approve (CMS)

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | Write key |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | admin |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | Sub Admin |
| 22 | 作業報告承認者(役割) | Report approver | Sub Admin |
| 23 | 支払者(役割) | Payer | Sub Admin |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | within range |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 3 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ❌ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | Sub Admin (CMS) |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 3 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | Sub Admin |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Worker Android → Sub-Admin CMS. Completed. |

## E2E-26 — Worker Company /  creates est (Type04)

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | No key (creator holds it) |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore manager |
| 20 | 見積作成者(役割) | Est creator (role) | Worker Company |
| 21 | 見積書承認者(役割) | Approver (role) | CS Admin |
| 22 | 作業報告承認者(役割) | Report approver | CS Admin |
| 23 | 支払者(役割) | Payer | CS Admin |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | OFF |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | > fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 4 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ✅ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | CS Admin |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | admin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | admin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 4 |
| 64 | 稟議承認中 | Ringi | ✅ |
| 65 | 承認者 | Approver | CS Admin |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Worker Company creates est, Type04. Completed. |

## E2E-27 — Cross-device iOS→ /  Android→Webview

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | Write key |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | Chain Store |
| 22 | 作業報告承認者(役割) | Report approver | Chain Store |
| 23 | 支払者(役割) | Payer | Chain Store |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | <= fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 1 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ❌ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | Chain Store |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更なし |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | なし/no |
| 61 | 見積金額 | Est amount vs fix | no limit |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 1 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | Chain Store |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Cross-device iOS/Android/Webview. Completed. |

## E2E-28 — OLD version → /  continue stays OLD

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | No key (creator holds it) |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | admin |
| 20 | 見積作成者(役割) | Est creator (role) | admin |
| 21 | 見積書承認者(役割) | Approver (role) | CS Admin |
| 22 | 作業報告承認者(役割) | Report approver | CS Admin |
| 23 | 支払者(役割) | Payer | CS Admin |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | OFF |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | > fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 2 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ❌ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | CS Admin |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | admin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | OLD (must stay OLD) |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | admin |
| 57 | 変更有無 | Change or not | 変更なし |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 2 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | CS Admin |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | OLD version inherited to continue. Completed. |

## E2E-29 — ★KEY: No-key approver → /  reject only → read-key approves

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | Write key |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | No key → Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | Store no-key (reject) → Store read-key (approve) |
| 22 | 作業報告承認者(役割) | Report approver | Chain Store |
| 23 | 支払者(役割) | Payer | Chain Store |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | > fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 2 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ❌ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | ✅ 差し戻し→再編集→再承認待ち |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | - |
| 41 | 承認者 | Approver | No-key store: reject only → Read-key store: approve |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | ✅ non-target→失効 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 2 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | CS Admin |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | No-key rejects, read-key approves. Both Completed. |

## E2E-30 — ★KEY: Sub-Admin read-key /  approves (CMS)

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | Write key |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Read key (Sub-Admin) |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | admin |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | Sub Admin (read key) |
| 22 | 作業報告承認者(役割) | Report approver | Sub Admin |
| 23 | 支払者(役割) | Payer | Sub Admin |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | > fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 2 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ❌ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | Sub Admin (read key, CMS) |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 2 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | Sub Admin (read key) |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Sub-Admin (read key) approves. Both Completed. |

## E2E-31 — ★KEY: encryption integrity /  write→read across continue

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | Write key |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Write→Read (encrypt) |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | Worker(write)→Store(read) |
| 22 | 作業報告承認者(役割) | Report approver | Chain Store |
| 23 | 支払者(役割) | Payer | Chain Store |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | <= fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 1 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ❌ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | Read-key store (no-key sees masked) |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 1 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | Read-key store |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Encryption: write-create, read-approve; continue inherits. Completed. |

## E2E-32 — ★KEY: Worker NO key /  (admin-created est)

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | No key (worker) |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | admin |
| 20 | 見積作成者(役割) | Est creator (role) | admin |
| 21 | 見積書承認者(役割) | Approver (role) | Store (read key) |
| 22 | 作業報告承認者(役割) | Report approver | Chain Store |
| 23 | 支払者(役割) | Payer | Chain Store |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | > fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 2 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ❌ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | Read-key store |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | admin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | admin |
| 57 | 変更有無 | Change or not | 変更なし |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 2 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | Read-key store / auto |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Worker no-key (admin-created); read-key approves. Completed. |

## E2E-33 — ★KEY: Worker No key + Store No key /  → reject → read-key approve

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | No key (worker) |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | No key → Read key |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | admin |
| 20 | 見積作成者(役割) | Est creator (role) | admin |
| 21 | 見積書承認者(役割) | Approver (role) | Store no-key (reject) → Store read-key (approve) |
| 22 | 作業報告承認者(役割) | Report approver | Chain Store |
| 23 | 支払者(役割) | Payer | Chain Store |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | > fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 2 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ❌ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | ✅ 差し戻し→再編集→再承認待ち |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | No-key store: reject → Read-key store: approve |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | ✅ non-target→失効 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | admin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | admin |
| 57 | 変更有無 | Change or not | 変更なし |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 2 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | CS Admin / auto |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Worker no-key + no-key store reject → read-key approve. Completed. |

## E2E-34 — ★KEY: No-key approver UI /  approve disabled / reject only

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | Write key |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | No key (approver) |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | ❌ |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | ❌ |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | CMS Web |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | Store (no key) |
| 22 | 作業報告承認者(役割) | Report approver | Chain Store |
| 23 | 支払者(役割) | Payer | Chain Store |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | <= fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 1 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | ❌ |
| 39 | 再編集→再提示 | Re-edit → Resubmit | ✅ reject→差し戻し→再編集→再承認待ち |
| 40 | 再提示で承認タイプ変更 | ★ Approve type CHANGED on re-submit | 🚫 |
| 41 | 承認者 | Approver | No-key store: 承認する disabled, 承認しない enabled |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | 承認後の再提示(新) | ★ Re-submit AFTER approved (NEW flow) | 🚫 |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 1 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | Read-key store / auto |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | No-key approver: approve disabled, reject only; read-key completes. Completed. |

## E2E-35 — Create trouble via non-trouble navi

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | - |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | - |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | - |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | - |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | admin |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | Chain Store |
| 22 | 作業報告承認者(役割) | Report approver | Admin |
| 23 | 支払者(役割) | Payer | Admin |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | OFF |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | <= fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 1 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | 🚫 |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | **再提示で承認タイプ変更** | **★ Approve type CHANGED on re-submit** | |
| 41 | 承認者 | Approver | Store Manager |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | **承認後の再提示(新)** | **★ Re-submit AFTER approved (NEW flow)** | |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 1 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | Read-key store / auto |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Trouble created via non-trouble navi can be completed |

## E2E-36 — Create trouble via trouble navi

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | - |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | - |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | - |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | - |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | Chain Store |
| 22 | 作業報告承認者(役割) | Report approver | Chain Store |
| 23 | 支払者(役割) | Payer | Chain Store |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | <= fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 1 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | 🚫 |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | **再提示で承認タイプ変更** | **★ Approve type CHANGED on re-submit** | |
| 41 | 承認者 | Approver | Store Manager |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | **承認後の再提示(新)** | **★ Re-submit AFTER approved (NEW flow)** | |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 1 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | Read-key store / auto |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Trouble created via trouble navi can be completed |

## E2E-37 — Create trouble with asset via non-trouble navi

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | - |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | - |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | - |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | - |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore manager |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | Chain Store |
| 22 | 作業報告承認者(役割) | Report approver | Store Manager |
| 23 | 支払者(役割) | Payer | Store Manager |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | OFF |
| 29 | シサンNAVI | Asset Navi | ON |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | <= fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 1 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | 🚫 |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | **再提示で承認タイプ変更** | **★ Approve type CHANGED on re-submit** | |
| 41 | 承認者 | Approver | Store Manager |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | **承認後の再提示(新)** | **★ Re-submit AFTER approved (NEW flow)** | |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 1 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | Read-key store / auto |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Trouble with asset can be completed |

## E2E-38 — Create trouble with asset via trouble navi

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | - |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | - |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | - |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | - |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore manager |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | Chain Store |
| 22 | 作業報告承認者(役割) | Report approver | Store Manager |
| 23 | 支払者(役割) | Payer | Store Manager |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | ON |
| 29 | シサンNAVI | Asset Navi | ON |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | <= fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 1 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | 🚫 |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | **再提示で承認タイプ変更** | **★ Approve type CHANGED on re-submit** | |
| 41 | 承認者 | Approver | Store Manager |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | **承認後の再提示(新)** | **★ Re-submit AFTER approved (NEW flow)** | |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 1 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | Read-key store / auto |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Trouble with asset can be completed |

## E2E-39 — Create report with attach PDF file

| Dòng | 項目 | Item | Giá trị |
|---|---|---|---|
| 10 | Worker口座の鍵 | Worker account key | - |
| 11 | 承認者の鍵 | Approver key (Store/Sub-Admin) | - |
| 12 | 緊急フラグ(新規) | Urgent Flag (NEW) | - |
| 13 | 緊急フラグ(継続) | Urgent Flag (CONTINUE) | - |
| 15 | **デバイス・アカウント** | **Device & Account (cross matrix)** | |
| 16 | 依頼作成デバイス | Trouble-creator device | CMS Web |
| 17 | 見積作成デバイス | Est-creator device | CMS Web |
| 18 | 承認デバイス | Approver device | CMS Web |
| 19 | 依頼作成者(役割) | Trouble creator (role) | chainstore |
| 20 | 見積作成者(役割) | Est creator (role) | worker |
| 21 | 見積書承認者(役割) | Approver (role) | Chain Store |
| 22 | 作業報告承認者(役割) | Report approver | Chain Store |
| 23 | 支払者(役割) | Payer | Chain Store |
| 24 | **新規依頼** | **New trouble** | |
| 25 | **新規依頼登録** | **New trouble registration** | |
| 26 | 依頼登録者 | Creator | 任意/optional |
| 27 | 依頼内容 | Trouble content | 通常依頼 / normal |
| 28 | トラブルナビ | Trouble Navi | OFF |
| 29 | シサンNAVI | Asset Navi | OFF |
| 30 | **見積承認** | **Approve est (NEW)** | |
| 31 | 見積書の数 | Total est (count) | 1 |
| 32 | 限度額設定 | Set fix_amount (NEW) | あり/yes |
| 33 | 見積金額 | Est amount vs fix | <= fix |
| 34 | 提示(初回) | Submit estimation (status) | 到着02-04 → 見積承認待ち02-05 |
| 35 | 承認タイプ(初回) | Approve type (initial) | 1 |
| 36 | 取下げ申請 | Request cancel | 🚫 |
| 37 | 取下げ承認/却下 | Approve / reject request cancel | 🚫 |
| 38 | 稟議承認中 | Ringi (稟議承認中) | 🚫 |
| 39 | 再編集→再提示 | Re-edit → Resubmit | 🚫 |
| 40 | **再提示で承認タイプ変更** | **★ Approve type CHANGED on re-submit** | |
| 41 | 承認者 | Approver | Store Manager |
| 42 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-05 → 作業中02-07 (est approved; reject→見積拒否02-06) |
| 43 | 失効 | Other est → 失効 | 🚫 |
| 44 | **承認後の再提示(新)** | **★ Re-submit AFTER approved (NEW flow)** | |
| 45 | **報告書** | **Report** | |
| 46 | 作業→報告→承認 | Work → Report → Final approve (status) | 作業完了02-08 → 報告済み02-09 → 承認済み02-10 |
| 47 | **確認・決済** | **Confirm ・ Payment** | |
| 48 | 確認・決済 | Confirm/Payment (status) | 承認済み02-10 → 完了 03-01/02 (決済) |
| 49 | 新規結果 | NEW trouble result | 完了 / Completed |
| 50 | **継続依頼** | **Continue trouble (inherits original)** | |
| 51 | **継続依頼登録** | **Continue registration** | |
| 52 | 依頼登録者 | Creator | subadmin |
| 53 | 緊急 | Urgent (continue) | ❌ |
| 54 | バージョン継承 | Version inherited | New |
| 55 | **作業スタッフ変更** | **Staff change** | |
| 56 | 選択者 | Selector | subadmin |
| 57 | 変更有無 | Change or not | 変更あり |
| 58 | **見積承認** | **Approve est (CONTINUE)** | |
| 59 | 見積書の数 | Total est (count) | 1 |
| 60 | 限度額設定 | Set fix_amount (CONTINUE) | あり/yes |
| 61 | 見積金額 | Est amount vs fix | <= fix |
| 62 | 提示 | Submit estimation (status) | 見積待ち02-10 → 見積承認待ち02-20 |
| 63 | 承認タイプ | Approve type | 1 |
| 64 | 稟議承認中 | Ringi | ❌ |
| 65 | 承認者 | Approver | Read-key store / auto |
| 66 | 見積承認結果(状態) | Est approve result (status) | 見積承認待ち02-20 → 見積承認済み02-40 (reject→見積拒否02-30) |
| 67 | **日程承認** | **Schedule approval (CONTINUE only)** | |
| 68 | 日程承認 | Schedule approve (status) | 日程承認待ち02-41 → 日程確定02-50 (再依頼→日程再依頼02-42) |
| 69 | 移動→到着→作業 | Move → Arrive → Work (status) | 移動中02-60 → 到着02-61 → 作業中02-70 → 作業完了02-80 |
| 70 | **報告書** | **Report** | |
| 71 | 報告→承認 | Report → Final approve (status) | 報告済み02-90 → 承認済み02-91 |
| 72 | **確認・決済** | **Confirm ・ Payment** | |
| 73 | 確認・決済 | Confirm/Payment (status) | 承認済み02-91 → 完了 03-01/02 (決済) |
| 74 | 継続結果 | CONTINUE trouble result | 完了 / Completed |
| 75 | **判定** | **Verdict (section)** | |
| 76 | **結果** | **Final result** | |
| 77 | **補足/注意** | **★ Note / Clarification** | |
| 78 | 説明 | Expected (final) | Trouble with attached PDF report can be completed |
