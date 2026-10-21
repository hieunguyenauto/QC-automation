# PASSED · E2E-01_16-10-2026_14-57-13_dev

Chạy lúc 16/10/2026 14:57:13 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 15 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E01-TC-001 | SETUP · LINKSYS STORE00006; 限度額 read | 99 | 22.3s | 00:00 → 00:22 | - |
| E2E01-TC-002 | NEW · chainstore creates trouble (トラブルナビ) | 02 | 56.0s | 00:22 → 01:19 | - |
| E2E01-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 18.5s | 01:19 → 01:37 | Dashboard GET /api/home: trả về sau 59.7s (ngưỡng 30s) |
| E2E01-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 15.8s | 01:37 → 01:53 | - |
| E2E01-TC-005 | NEW · Create 1 estimate (total = FIX − 1) and 提示 | 99 | 14.4s | 01:53 → 02:07 | - |
| E2E01-TC-006 | NEW · ≤ FIX → auto approve (no approver) | 99 | 6.6s | 02:07 → 02:14 | - |
| E2E01-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 15.5s | 02:14 → 02:29 | - |
| E2E01-TC-008 | NEW · Chain Store 確認・決済 → 完了 | 02 | 38.0s | 02:29 → 03:07 | - |
| E2E01-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 43.3s | 03:07 → 03:51 | - |
| E2E01-TC-010 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.6s | 03:51 → 03:54 | - |
| E2E01-TC-011 | CONTINUE · Create 1 estimate (total = FIX − 1) and 提示 | 99 | 25.2s | 03:54 → 04:20 | Dashboard GET /api/home: trả về sau 88.7s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 50.5s (ngưỡng 30s) |
| E2E01-TC-012 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.1s | 04:20 → 04:26 | - |
| E2E01-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 | 99 | 25.5s | 04:26 → 04:51 | - |
| E2E01-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 11.3s | 04:51 → 05:02 | - |
| E2E01-TC-015 | CONTINUE · Chain Store 確認・決済 → 完了 | 02 | 39.7s | 05:02 → 05:42 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-01_16-10-2026_14-57-13_dev/SUMMARY.md
