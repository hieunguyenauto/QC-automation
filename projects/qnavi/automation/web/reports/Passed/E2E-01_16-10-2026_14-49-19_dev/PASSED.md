# PASSED · E2E-01_16-10-2026_14-49-19_dev

Chạy lúc 16/10/2026 14:49:19 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 15 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E01-TC-001 | SETUP · LINKSYS STORE00006; 限度額 read | 99 | 21.7s | 00:00 → 00:21 | - |
| E2E01-TC-002 | NEW · chainstore creates trouble (トラブルナビ) | 02 | 57.1s | 00:22 → 01:19 | - |
| E2E01-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 20.0s | 01:19 → 01:39 | Dashboard GET /api/home: trả về sau 61.3s (ngưỡng 30s) |
| E2E01-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 15.9s | 01:39 → 01:55 | - |
| E2E01-TC-005 | NEW · Create 1 estimate (total = FIX − 1) and 提示 | 99 | 14.9s | 01:55 → 02:10 | - |
| E2E01-TC-006 | NEW · ≤ FIX → auto approve (no approver) | 99 | 7.0s | 02:10 → 02:17 | - |
| E2E01-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 16.6s | 02:17 → 02:33 | - |
| E2E01-TC-008 | NEW · Chain Store 確認・決済 → 完了 | 02 | 43.2s | 02:33 → 03:17 | - |
| E2E01-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 42.4s | 03:17 → 03:59 | - |
| E2E01-TC-010 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.5s | 03:59 → 04:02 | - |
| E2E01-TC-011 | CONTINUE · Create 1 estimate (total = FIX − 1) and 提示 | 99 | 24.2s | 04:03 → 04:27 | Dashboard GET /api/home: trả về sau 93.1s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 49.7s (ngưỡng 30s) |
| E2E01-TC-012 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.3s | 04:27 → 04:33 | - |
| E2E01-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 | 99 | 30.0s | 04:33 → 05:03 | - |
| E2E01-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 11.0s | 05:03 → 05:14 | - |
| E2E01-TC-015 | CONTINUE · Chain Store 確認・決済 → 完了 | 02 | 39.7s | 05:14 → 05:54 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-01_16-10-2026_14-49-19_dev/SUMMARY.md
