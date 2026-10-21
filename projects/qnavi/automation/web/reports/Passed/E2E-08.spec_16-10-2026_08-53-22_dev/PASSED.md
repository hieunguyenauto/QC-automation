# PASSED · E2E-08.spec_16-10-2026_08-53-22_dev

Chạy lúc 16/10/2026 08:53:22 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 15 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E08-TC-001 | SETUP · LINKSYS STORE00002; 限度額 none | 99 | 17.8s | 00:00 → 00:17 | - |
| E2E08-TC-002 | NEW · chainstore creates trouble (トラブルナビ) | 02 | 52.6s | 00:18 → 01:11 | - |
| E2E08-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 18.3s | 01:11 → 01:29 | Dashboard GET /api/home: trả về sau 56.4s (ngưỡng 30s) |
| E2E08-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 15.8s | 01:29 → 01:45 | - |
| E2E08-TC-005 | NEW · Create 1 estimate(s) (total = ¥10,000 (store has no 限度額)) and 提示 | 99 | 15.4s | 01:45 → 02:00 | - |
| E2E08-TC-006 | NEW · Approve (1 level(s)): ChainStore (02) 'linksysstore00002' | 02 | 36.8s | 02:00 → 02:37 | - |
| E2E08-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 24.5s | 02:37 → 03:02 | Dashboard GET /api/home: trả về sau 40.5s (ngưỡng 30s) |
| E2E08-TC-008 | NEW · Chain Store 確認・決済 → 完了 | 02 | 35.7s | 03:02 → 03:37 | - |
| E2E08-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 38.6s | 03:37 → 04:16 | - |
| E2E08-TC-010 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.3s | 04:16 → 04:19 | - |
| E2E08-TC-011 | CONTINUE · Create 1 estimate(s) (total = ¥10,000 (store has no 限度額)) and 提示 | 99 | 25.4s | 04:19 → 04:44 | Dashboard GET /api/home: trả về sau 80.9s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 45.2s (ngưỡng 30s) |
| E2E08-TC-012 | CONTINUE · Approve (1 level(s)): ChainStore (02) 'linksysstore00002' | 02 | 38.2s | 04:44 → 05:23 | - |
| E2E08-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 34.2s | 05:23 → 05:57 | Dashboard GET /api/home: trả về sau 42.2s (ngưỡng 30s) |
| E2E08-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 11.4s | 05:57 → 06:08 | - |
| E2E08-TC-015 | CONTINUE · Chain Store 確認・決済 → 完了 | 02 | 43.0s | 06:08 → 06:51 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-08.spec_16-10-2026_08-53-22_dev/SUMMARY.md
