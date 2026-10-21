# PASSED · E2E-38.spec_16-10-2026_12-48-43_dev

Chạy lúc 16/10/2026 12:48:43 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 15 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E38-TC-001 | SETUP · LINKSYS STORE00006; 限度額 read | 99 | 16.8s | 00:00 → 00:16 | - |
| E2E38-TC-002 | NEW · chainstore manager creates trouble (トラブルナビ, シサンNAVI) | 01 | 57.4s | 00:17 → 01:14 | - |
| E2E38-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 17.6s | 01:14 → 01:32 | Dashboard GET /api/home: trả về sau 60.8s (ngưỡng 30s) |
| E2E38-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 15.4s | 01:32 → 01:47 | - |
| E2E38-TC-005 | NEW · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 14.6s | 01:47 → 02:02 | - |
| E2E38-TC-006 | NEW · ≤ FIX → auto approve (no approver) | 99 | 5.9s | 02:02 → 02:08 | - |
| E2E38-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 15.5s | 02:08 → 02:23 | - |
| E2E38-TC-008 | NEW · Store Manager 確認・決済 → 完了 | 01 | 38.1s | 02:23 → 03:02 | - |
| E2E38-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 38.8s | 03:02 → 03:40 | - |
| E2E38-TC-010 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.1s | 03:40 → 03:43 | - |
| E2E38-TC-011 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 24.5s | 03:43 → 04:08 | Dashboard GET /api/home: trả về sau 83.4s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 45.2s (ngưỡng 30s) |
| E2E38-TC-012 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.1s | 04:08 → 04:14 | - |
| E2E38-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 24.2s | 04:14 → 04:38 | - |
| E2E38-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 11.1s | 04:38 → 04:49 | - |
| E2E38-TC-015 | CONTINUE · Store Manager 確認・決済 → 完了 | 01 | 43.0s | 04:49 → 05:32 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-38.spec_16-10-2026_12-48-43_dev/SUMMARY.md
