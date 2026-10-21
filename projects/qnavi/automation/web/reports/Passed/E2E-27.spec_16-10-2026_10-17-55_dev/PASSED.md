# PASSED · E2E-27.spec_16-10-2026_10-17-55_dev

Chạy lúc 16/10/2026 10:17:55 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 15 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E27-TC-001 | SETUP · LINKSYS STORE00005; 限度額 read | 99 | 16.7s | 00:00 → 00:16 | - |
| E2E27-TC-002 | NEW · chainstore creates trouble (トラブルナビ) | 02 | 54.8s | 00:17 → 01:12 | - |
| E2E27-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 17.8s | 01:12 → 01:30 | Dashboard GET /api/home: trả về sau 58.5s (ngưỡng 30s) |
| E2E27-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 17.1s | 01:30 → 01:47 | - |
| E2E27-TC-005 | NEW · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 14.9s | 01:47 → 02:02 | - |
| E2E27-TC-006 | NEW · ≤ FIX → auto approve (no approver) | 99 | 6.3s | 02:02 → 02:08 | - |
| E2E27-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 21.2s | 02:08 → 02:29 | - |
| E2E27-TC-008 | NEW · Chain Store 確認・決済 → 完了 | 02 | 38.3s | 02:29 → 03:07 | - |
| E2E27-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 38.7s | 03:08 → 03:46 | - |
| E2E27-TC-010 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.3s | 03:46 → 03:50 | - |
| E2E27-TC-011 | CONTINUE · Create 1 estimate(s) (total = FIX + 1 (cột gốc "no limit"; STORE00005 vẫn có FIX — N17)) and 提示 | 99 | 26.6s | 03:50 → 04:16 | Dashboard GET /api/home: trả về sau 84.2s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 45.7s (ngưỡng 30s) |
| E2E27-TC-012 | CONTINUE · Approve (1 level(s)): ChainStore (02) 'linksysstore00005' | 02 | 46.2s | 04:16 → 05:02 | - |
| E2E27-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 35.7s | 05:02 → 05:38 | Dashboard GET /api/home: trả về sau 45.1s (ngưỡng 30s) |
| E2E27-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 15.8s | 05:38 → 05:54 | - |
| E2E27-TC-015 | CONTINUE · Chain Store 確認・決済 → 完了 | 02 | 43.8s | 05:54 → 06:38 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-27.spec_16-10-2026_10-17-55_dev/SUMMARY.md
