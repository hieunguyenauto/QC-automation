# PASSED · E2E-35.spec_16-10-2026_12-37-29_dev

Chạy lúc 16/10/2026 12:37:29 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 15 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E35-TC-001 | SETUP · LINKSYS STORE00006; 限度額 read | 99 | 18.4s | 00:00 → 00:18 | - |
| E2E35-TC-002 | NEW · admin creates trouble (web form) | 99 | 24.2s | 00:19 → 00:43 | - |
| E2E35-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 8.2s | 00:43 → 00:51 | - |
| E2E35-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 15.8s | 00:51 → 01:07 | - |
| E2E35-TC-005 | NEW · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 14.9s | 01:07 → 01:22 | - |
| E2E35-TC-006 | NEW · ≤ FIX → auto approve (no approver) | 99 | 6.3s | 01:22 → 01:28 | - |
| E2E35-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 16.2s | 01:28 → 01:44 | - |
| E2E35-TC-008 | NEW · Admin 確認・決済 → 完了 | 02 | 37.6s | 01:44 → 02:22 | - |
| E2E35-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 38.7s | 02:22 → 03:01 | - |
| E2E35-TC-010 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.3s | 03:01 → 03:04 | - |
| E2E35-TC-011 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 24.4s | 03:04 → 03:28 | Dashboard GET /api/home: trả về sau 83.7s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 45.9s (ngưỡng 30s) |
| E2E35-TC-012 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.5s | 03:28 → 03:35 | - |
| E2E35-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 25.3s | 03:35 → 04:00 | - |
| E2E35-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 11.0s | 04:00 → 04:11 | - |
| E2E35-TC-015 | CONTINUE · Admin 確認・決済 → 完了 | 02 | 42.6s | 04:11 → 04:54 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-35.spec_16-10-2026_12-37-29_dev/SUMMARY.md
