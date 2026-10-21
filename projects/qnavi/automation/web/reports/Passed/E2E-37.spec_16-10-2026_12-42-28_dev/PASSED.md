# PASSED · E2E-37.spec_16-10-2026_12-42-28_dev

Chạy lúc 16/10/2026 12:42:28 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 15 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E37-TC-001 | SETUP · LINKSYS STORE00006; 限度額 read | 99 | 24.9s | 00:00 → 00:25 | - |
| E2E37-TC-002 | NEW · chainstore manager creates trouble (web form, シサンNAVI) | 01 | 69.0s | 00:25 → 01:34 | - |
| E2E37-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 17.6s | 01:34 → 01:52 | Dashboard GET /api/home: trả về sau 72.7s (ngưỡng 30s) |
| E2E37-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 16.0s | 01:52 → 02:08 | - |
| E2E37-TC-005 | NEW · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 14.7s | 02:08 → 02:22 | - |
| E2E37-TC-006 | NEW · ≤ FIX → auto approve (no approver) | 99 | 6.2s | 02:22 → 02:29 | - |
| E2E37-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 15.4s | 02:29 → 02:44 | - |
| E2E37-TC-008 | NEW · Store Manager 確認・決済 → 完了 | 01 | 38.5s | 02:44 → 03:23 | - |
| E2E37-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 39.2s | 03:23 → 04:02 | - |
| E2E37-TC-010 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.4s | 04:02 → 04:05 | - |
| E2E37-TC-011 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 23.9s | 04:05 → 04:29 | Dashboard GET /api/home: trả về sau 84.8s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 45.9s (ngưỡng 30s) |
| E2E37-TC-012 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.7s | 04:29 → 04:36 | - |
| E2E37-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 25.2s | 04:36 → 05:01 | - |
| E2E37-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 10.9s | 05:01 → 05:12 | - |
| E2E37-TC-015 | CONTINUE · Store Manager 確認・決済 → 完了 | 01 | 43.0s | 05:12 → 05:55 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-37.spec_16-10-2026_12-42-28_dev/SUMMARY.md
