# PASSED · E2E-36.spec_16-10-2026_11-03-29_dev

Chạy lúc 16/10/2026 11:03:30 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 15 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E36-TC-001 | SETUP · LINKSYS STORE00006; 限度額 read | 99 | 17.7s | 00:00 → 00:17 | - |
| E2E36-TC-002 | NEW · chainstore creates trouble (トラブルナビ) | 02 | 58.7s | 00:18 → 01:17 | - |
| E2E36-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 18.1s | 01:17 → 01:35 | Dashboard GET /api/home: trả về sau 62.1s (ngưỡng 30s) |
| E2E36-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 15.1s | 01:35 → 01:50 | - |
| E2E36-TC-005 | NEW · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 14.7s | 01:50 → 02:05 | - |
| E2E36-TC-006 | NEW · ≤ FIX → auto approve (no approver) | 99 | 6.3s | 02:05 → 02:11 | - |
| E2E36-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 15.3s | 02:11 → 02:26 | - |
| E2E36-TC-008 | NEW · Chain Store 確認・決済 → 完了 | 02 | 42.4s | 02:26 → 03:09 | - |
| E2E36-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 39.6s | 03:09 → 03:48 | - |
| E2E36-TC-010 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.3s | 03:48 → 03:52 | - |
| E2E36-TC-011 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 24.0s | 03:52 → 04:16 | Dashboard GET /api/home: trả về sau 89.0s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 46.2s (ngưỡng 30s) |
| E2E36-TC-012 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.2s | 04:16 → 04:22 | - |
| E2E36-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 28.4s | 04:22 → 04:50 | - |
| E2E36-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 10.6s | 04:50 → 05:01 | - |
| E2E36-TC-015 | CONTINUE · Chain Store 確認・決済 → 完了 | 02 | 42.6s | 05:01 → 05:43 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-36.spec_16-10-2026_11-03-29_dev/SUMMARY.md
