# PASSED · E2E-21.spec_16-10-2026_09-52-53_dev

Chạy lúc 16/10/2026 09:52:54 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 9 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E21-TC-001 | SETUP · LINKSYS STORE00006; 限度額 read | 99 | 17.1s | 00:00 → 00:17 | - |
| E2E21-TC-002 | NEW · chainstore creates trouble (トラブルナビ) | 02 | 54.7s | 00:17 → 01:12 | - |
| E2E21-TC-003 | NEW · Set urgent: 案件区分 営業停止案件 | 99 | 17.9s | 01:12 → 01:30 | Dashboard GET /api/home: trả về sau 58.2s (ngưỡng 30s) |
| E2E21-TC-004 | NEW · Admin: 対応中 + assign worker | 99 | 7.3s | 01:30 → 01:37 | - |
| E2E21-TC-005 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 15.4s | 01:37 → 01:53 | - |
| E2E21-TC-006 | NEW · Create 1 estimate(s) (total = FIX + 1) and 提示 | 99 | 13.4s | 01:53 → 02:06 | - |
| E2E21-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 28.2s | 02:06 → 02:34 | - |
| E2E21-TC-008 | NEW · Chain Store 確認・決済 → 完了 | 02 | 38.4s | 02:34 → 03:13 | - |
| E2E21-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 38.5s | 03:13 → 03:51 | - |

Report gốc: reports/Runs/E2E-21.spec_16-10-2026_09-52-53_dev/SUMMARY.md
