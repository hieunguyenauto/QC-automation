# PASSED · E2E-01_15-10-2026_15-49-50_dev

Chạy lúc 15/10/2026 15:49:50 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 15 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E01-TC-001 | SETUP · LINKSYS STORE00006; 限度額 read | 99 | 16.2s | 00:00 → 00:16 | - |
| E2E01-TC-002 | NEW · chainstore creates trouble (トラブルナビ) | 02 | 54.7s | 00:17 → 01:11 | - |
| E2E01-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 17.2s | 01:11 → 01:29 | Dashboard GET /api/home: trả về sau 58.2s (ngưỡng 30s) |
| E2E01-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 15.2s | 01:29 → 01:44 | - |
| E2E01-TC-005 | NEW · Create 1 estimate (total = FIX − 1) and 提示 | 99 | 14.2s | 01:44 → 01:58 | - |
| E2E01-TC-006 | NEW · ≤ FIX → auto approve (no approver) | 99 | 6.1s | 01:58 → 02:04 | - |
| E2E01-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 16.0s | 02:04 → 02:20 | - |
| E2E01-TC-008 | NEW · Chain Store 確認・決済 → 完了 | 02 | 38.9s | 02:20 → 02:59 | - |
| E2E01-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 38.5s | 02:59 → 03:37 | - |
| E2E01-TC-010 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.4s | 03:37 → 03:41 | - |
| E2E01-TC-011 | CONTINUE · Create 1 estimate (total = FIX − 1) and 提示 | 99 | 24.0s | 03:41 → 04:05 | Dashboard GET /api/home: trả về sau 84.4s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 45.3s (ngưỡng 30s) |
| E2E01-TC-012 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.1s | 04:05 → 04:11 | - |
| E2E01-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 | 99 | 24.2s | 04:11 → 04:35 | - |
| E2E01-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 11.8s | 04:35 → 04:47 | - |
| E2E01-TC-015 | CONTINUE · Chain Store 確認・決済 → 完了 | 02 | 39.6s | 04:47 → 05:26 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-01_15-10-2026_15-49-50_dev/SUMMARY.md
