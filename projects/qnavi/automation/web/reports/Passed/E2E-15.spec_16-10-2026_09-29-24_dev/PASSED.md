# PASSED · E2E-15.spec_16-10-2026_09-29-24_dev

Chạy lúc 16/10/2026 09:29:24 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 16 / 16

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E15-TC-001 | SETUP · LINKSYS STORE00006; 限度額 read | 99 | 20.6s | 00:00 → 00:20 | - |
| E2E15-TC-002 | NEW · chainstore creates trouble (トラブルナビ) | 02 | 55.2s | 00:21 → 01:16 | - |
| E2E15-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 18.1s | 01:16 → 01:34 | Dashboard GET /api/home: trả về sau 59.0s (ngưỡng 30s) |
| E2E15-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 15.8s | 01:34 → 01:50 | - |
| E2E15-TC-005 | NEW · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 14.4s | 01:50 → 02:04 | - |
| E2E15-TC-006 | NEW · ≤ FIX → auto approve (no approver) | 99 | 6.5s | 02:04 → 02:11 | - |
| E2E15-TC-007 | NEW · Re-submit AFTER approved | 99 | 10.5s | 02:11 → 02:21 | - |
| E2E15-TC-008 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 15.3s | 02:21 → 02:37 | - |
| E2E15-TC-009 | NEW · Chain Store 確認・決済 → 完了 | 02 | 38.9s | 02:37 → 03:16 | - |
| E2E15-TC-010 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 39.4s | 03:16 → 03:55 | - |
| E2E15-TC-011 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.2s | 03:55 → 03:58 | - |
| E2E15-TC-012 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 25.1s | 03:58 → 04:23 | Dashboard GET /api/home: trả về sau 85.5s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 46.3s (ngưỡng 30s) |
| E2E15-TC-013 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.5s | 04:23 → 04:30 | - |
| E2E15-TC-014 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 24.6s | 04:30 → 04:54 | - |
| E2E15-TC-015 | CONTINUE · 報告済 (02-90) | 99 | 11.1s | 04:54 → 05:06 | - |
| E2E15-TC-016 | CONTINUE · Chain Store 確認・決済 → 完了 | 02 | 43.6s | 05:06 → 05:49 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-15.spec_16-10-2026_09-29-24_dev/SUMMARY.md
