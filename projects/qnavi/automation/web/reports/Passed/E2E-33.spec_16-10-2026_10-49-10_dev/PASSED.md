# PASSED · E2E-33.spec_16-10-2026_10-49-10_dev

Chạy lúc 16/10/2026 10:49:11 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 17 / 17

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E33-TC-001 | SETUP · LINKSYS STORE00001; 限度額 read | 99 | 16.7s | 00:00 → 00:16 | - |
| E2E33-TC-002 | NEW · admin creates trouble (web form) | 99 | 24.5s | 00:17 → 00:41 | - |
| E2E33-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 8.1s | 00:41 → 00:49 | - |
| E2E33-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 19.2s | 00:49 → 01:09 | - |
| E2E33-TC-005 | NEW · Create 2 estimate(s) (total = FIX + 1) and 提示 | 99 | 23.8s | 01:09 → 01:32 | - |
| E2E33-TC-006 | NEW · 差し戻し → コピー → 新規提示 | 02 | 53.5s | 01:32 → 02:26 | Dashboard GET /api/home: trả về sau 39.4s (ngưỡng 30s) |
| E2E33-TC-007 | NEW · Approve (1 level(s)): ChainStore (02) 'linksysstore00001' | 02 | 40.7s | 02:26 → 03:07 | - |
| E2E33-TC-008 | NEW · Other estimates → 失効 after approval | 99 | 16.5s | 03:07 → 03:23 | Dashboard GET /api/home: trả về sau 44.2s (ngưỡng 30s) |
| E2E33-TC-009 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 18.9s | 03:23 → 03:42 | - |
| E2E33-TC-010 | NEW · Chain Store 確認・決済 → 完了 | 02 | 39.0s | 03:42 → 04:21 | - |
| E2E33-TC-011 | CONTINUE · admin creates 継続依頼 '_2' | 99 | 21.2s | 04:21 → 04:42 | Dashboard GET /api/home: trả về sau 42.3s (ngưỡng 30s) |
| E2E33-TC-012 | CONTINUE · 作業スタッフ kept (linksysworker) | 99 | 2.1s | 04:42 → 04:44 | - |
| E2E33-TC-013 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 15.2s | 04:44 → 05:00 | - |
| E2E33-TC-014 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.2s | 05:00 → 05:06 | - |
| E2E33-TC-015 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 28.1s | 05:06 → 05:34 | - |
| E2E33-TC-016 | CONTINUE · 報告済 (02-90) | 99 | 12.3s | 05:34 → 05:46 | - |
| E2E33-TC-017 | CONTINUE · Chain Store 確認・決済 → 完了 | 02 | 44.4s | 05:46 → 06:30 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-33.spec_16-10-2026_10-49-10_dev/SUMMARY.md
