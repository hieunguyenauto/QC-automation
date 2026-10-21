# PASSED · E2E-32.spec_16-10-2026_10-43-34_dev

Chạy lúc 16/10/2026 10:43:34 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 15 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E32-TC-001 | SETUP · LINKSYS STORE00001; 限度額 read | 99 | 16.8s | 00:00 → 00:16 | - |
| E2E32-TC-002 | NEW · admin creates trouble (web form) | 99 | 25.0s | 00:17 → 00:42 | - |
| E2E32-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 7.8s | 00:42 → 00:50 | - |
| E2E32-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 19.2s | 00:50 → 01:09 | - |
| E2E32-TC-005 | NEW · Create 1 estimate(s) (total = FIX + 1) and 提示 | 99 | 18.7s | 01:09 → 01:28 | - |
| E2E32-TC-006 | NEW · Approve (1 level(s)): ChainStore (02) 'linksysstore00001' | 02 | 41.3s | 01:28 → 02:09 | - |
| E2E32-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 28.3s | 02:09 → 02:37 | Dashboard GET /api/home: trả về sau 45.5s (ngưỡng 30s) |
| E2E32-TC-008 | NEW · Chain Store 確認・決済 → 完了 | 02 | 44.1s | 02:37 → 03:21 | - |
| E2E32-TC-009 | CONTINUE · admin creates 継続依頼 '_2' | 99 | 21.6s | 03:21 → 03:43 | Dashboard GET /api/home: trả về sau 43.5s (ngưỡng 30s) |
| E2E32-TC-010 | CONTINUE · 作業スタッフ kept (linksysworker) | 99 | 2.2s | 03:43 → 03:45 | - |
| E2E32-TC-011 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 14.4s | 03:45 → 04:00 | - |
| E2E32-TC-012 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 5.9s | 04:00 → 04:06 | - |
| E2E32-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 27.9s | 04:06 → 04:33 | - |
| E2E32-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 12.8s | 04:33 → 04:46 | - |
| E2E32-TC-015 | CONTINUE · Chain Store 確認・決済 → 完了 | 02 | 43.6s | 04:46 → 05:30 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-32.spec_16-10-2026_10-43-34_dev/SUMMARY.md
