# Test case — E2E-00 · Common setup (cấu hình chain Linksys)
- Project: qnavi · Scope Key: e2e-suite · Sheet prefix: E2E00
- Source: QUESTIONS.md (C4: トラブルナビ luôn ON · N11: chỉ bật/tắt シサンNAVI · G29) — tiền đề chung của mọi case E2E.
- State: LOCKED · Revision: 2 · Approved by / at: Hieu Nguyen / 14/10/2026
- Dùng: TC-001 (シサンNAVI OFF) là tiền đề của 35 case; TC-002 (シサンNAVI ON) là tiền đề của E2E-37, E2E-38. Chạy lẻ 1 case → chạy TC common tương ứng trước.
- シサンNAVI là cấu hình chung của chain → không chạy song song case nhóm OFF với nhóm ON.

## Test case
| TC ID | Viewpoint ID | Test Level | Main Screen | Function | Pre-condition | Steps | Expected Results | Role | OS | Priority | Status | Automation Eligibility |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| E2E00-TC-001 |  | System (E2E) | チェーンシステム情報 | COMMON · Linksys: トラブルナビ ON, シサンNAVI OFF | - | 1. Login Admin (99) → Dashboard → menu 'チェーンシステム情報' → search 'Linksys' → open 'Linksys Chain System'<br>2. Verify: 'トラブルナビ' = ON<br>3. Verify: 'シサンNAVI' = OFF; if not → '編集' → set 'シサンNAVI' = OFF → '保存' → '決定' → 'OK' | 'Linksys Chain System' shows トラブルナビ ON / シサンNAVI OFF | CMS Admin (99) | Web | High |  | UI-AUTO |
| E2E00-TC-002 |  | System (E2E) | チェーンシステム情報 | COMMON · Linksys: トラブルナビ ON, シサンNAVI ON | - | 1. Login Admin (99) → Dashboard → menu 'チェーンシステム情報' → search 'Linksys' → open 'Linksys Chain System'<br>2. Verify: 'トラブルナビ' = ON<br>3. Verify: 'シサンNAVI' = ON; if not → '編集' → set 'シサンNAVI' = ON → '保存' → '決定' → 'OK' | 'Linksys Chain System' shows トラブルナビ ON / シサンNAVI ON | CMS Admin (99) | Web | High |  | UI-AUTO |

## Quyết định áp dụng (QUESTIONS.md)
C4, G29, N11
