# PASSED · E2E-25.spec_16-10-2026_12-18-03_dev

Chạy lúc 16/10/2026 12:18:04 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 15 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E25-TC-001 | SETUP · LINKSYS STORE00008; 限度額 read | 99 | 16.7s | 00:00 → 00:16 | - |
| E2E25-TC-002 | NEW · admin creates trouble (web form) | 99 | 25.3s | 00:17 → 00:42 | - |
| E2E25-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 8.1s | 00:42 → 00:50 | - |
| E2E25-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 15.5s | 00:50 → 01:06 | - |
| E2E25-TC-005 | NEW · Create 1 estimate(s) (total within ¥10,000–¥20,000 (range of MANAGER00004) and > FIX) and 提示 | 99 | 15.6s | 01:06 → 01:21 | - |
| E2E25-TC-006 | NEW · Approve (1 level(s)): CMS SubAdmin (98) | 98 | 43.0s | 01:21 → 02:04 | - |
| E2E25-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 25.3s | 02:04 → 02:30 | Dashboard GET /api/home: trả về sau 46.6s (ngưỡng 30s) |
| E2E25-TC-008 | NEW · Sub Admin 確認・決済 → 完了 | 02 | 37.6s | 02:30 → 03:07 | - |
| E2E25-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 38.4s | 03:07 → 03:46 | - |
| E2E25-TC-010 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.2s | 03:46 → 03:49 | - |
| E2E25-TC-011 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 25.2s | 03:49 → 04:14 | Dashboard GET /api/home: trả về sau 83.4s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 45.5s (ngưỡng 30s) |
| E2E25-TC-012 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.1s | 04:14 → 04:20 | - |
| E2E25-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 24.3s | 04:20 → 04:45 | - |
| E2E25-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 11.1s | 04:45 → 04:56 | - |
| E2E25-TC-015 | CONTINUE · Sub Admin 確認・決済 → 完了 | 02 | 42.9s | 04:56 → 05:39 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-25.spec_16-10-2026_12-18-03_dev/SUMMARY.md
