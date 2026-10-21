# PASSED · E2E-31.spec_16-10-2026_10-36-52_dev

Chạy lúc 16/10/2026 10:36:52 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 16 / 16

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E31-TC-001 | SETUP · LINKSYS STORE00001; 限度額 read | 99 | 18.2s | 00:00 → 00:18 | - |
| E2E31-TC-002 | NEW · chainstore creates trouble (トラブルナビ) | 02 | 54.7s | 00:18 → 01:13 | - |
| E2E31-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 19.6s | 01:13 → 01:33 | Dashboard GET /api/home: trả về sau 58.6s (ngưỡng 30s) |
| E2E31-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 19.7s | 01:33 → 01:52 | - |
| E2E31-TC-005 | NEW · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 15.8s | 01:52 → 02:08 | - |
| E2E31-TC-006 | NEW · ≤ FIX → auto approve (no approver) | 99 | 6.5s | 02:08 → 02:15 | - |
| E2E31-TC-007 | NEW · Read-key store views auto-approved estimate | 02 | 31.6s | 02:15 → 02:46 | - |
| E2E31-TC-008 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 28.5s | 02:46 → 03:15 | Dashboard GET /api/home: trả về sau 34.6s (ngưỡng 30s) |
| E2E31-TC-009 | NEW · Chain Store 確認・決済 → 完了 | 02 | 39.5s | 03:15 → 03:54 | - |
| E2E31-TC-010 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 39.1s | 03:54 → 04:34 | - |
| E2E31-TC-011 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.3s | 04:34 → 04:37 | - |
| E2E31-TC-012 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 24.2s | 04:37 → 05:01 | Dashboard GET /api/home: trả về sau 85.4s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 45.7s (ngưỡng 30s) |
| E2E31-TC-013 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.3s | 05:01 → 05:07 | - |
| E2E31-TC-014 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 30.3s | 05:07 → 05:38 | - |
| E2E31-TC-015 | CONTINUE · 報告済 (02-90) | 99 | 12.9s | 05:38 → 05:51 | - |
| E2E31-TC-016 | CONTINUE · Chain Store 確認・決済 → 完了 | 02 | 44.1s | 05:51 → 06:35 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-31.spec_16-10-2026_10-36-52_dev/SUMMARY.md
