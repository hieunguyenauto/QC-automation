# PASSED · E2E-39.spec_16-10-2026_12-54-21_dev

Chạy lúc 16/10/2026 12:54:21 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 15 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E39-TC-001 | SETUP · LINKSYS STORE00006; 限度額 read | 99 | 23.6s | 00:00 → 00:23 | - |
| E2E39-TC-002 | NEW · chainstore creates trouble (web form) | 02 | 50.2s | 00:24 → 01:14 | - |
| E2E39-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 17.3s | 01:14 → 01:31 | Dashboard GET /api/home: trả về sau 53.9s (ngưỡng 30s) |
| E2E39-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 15.8s | 01:31 → 01:47 | - |
| E2E39-TC-005 | NEW · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 14.6s | 01:47 → 02:02 | - |
| E2E39-TC-006 | NEW · ≤ FIX → auto approve (no approver) | 99 | 5.7s | 02:02 → 02:07 | - |
| E2E39-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) + PDF attachment | 99 | 16.4s | 02:07 → 02:24 | - |
| E2E39-TC-008 | NEW · Chain Store 確認・決済 → 完了 | 02 | 37.8s | 02:24 → 03:02 | - |
| E2E39-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 39.3s | 03:02 → 03:41 | - |
| E2E39-TC-010 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.3s | 03:41 → 03:44 | - |
| E2E39-TC-011 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 23.9s | 03:44 → 04:08 | Dashboard GET /api/home: trả về sau 84.2s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 46.2s (ngưỡng 30s) |
| E2E39-TC-012 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 5.9s | 04:08 → 04:14 | - |
| E2E39-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 24.4s | 04:14 → 04:39 | - |
| E2E39-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 11.1s | 04:39 → 04:50 | - |
| E2E39-TC-015 | CONTINUE · Chain Store 確認・決済 → 完了 | 02 | 44.5s | 04:50 → 05:34 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-39.spec_16-10-2026_12-54-21_dev/SUMMARY.md
