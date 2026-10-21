# PASSED · E2E-29.spec_16-10-2026_12-29-44_dev

Chạy lúc 16/10/2026 12:29:44 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 17 / 17

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E29-TC-001 | SETUP · LINKSYS STORE00001; 限度額 read | 99 | 17.6s | 00:00 → 00:17 | - |
| E2E29-TC-002 | NEW · chainstore creates trouble (トラブルナビ) | 02 | 55.2s | 00:18 → 01:13 | - |
| E2E29-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 18.2s | 01:13 → 01:31 | Dashboard GET /api/home: trả về sau 59.3s (ngưỡng 30s) |
| E2E29-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 20.1s | 01:31 → 01:51 | - |
| E2E29-TC-005 | NEW · Create 2 estimate(s) (total = FIX + 1) and 提示 | 99 | 22.1s | 01:51 → 02:13 | - |
| E2E29-TC-006 | NEW · 差し戻し → コピー → 新規提示 | 02 | 54.8s | 02:13 → 03:08 | Dashboard GET /api/home: trả về sau 40.2s (ngưỡng 30s) |
| E2E29-TC-007 | NEW · Approve (1 level(s)): ChainStore (02) 'linksysstore00001' | 02 | 41.6s | 03:08 → 03:50 | - |
| E2E29-TC-008 | NEW · Other estimates → 失効 after approval | 99 | 15.6s | 03:50 → 04:05 | Dashboard GET /api/home: trả về sau 44.1s (ngưỡng 30s) |
| E2E29-TC-009 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 19.3s | 04:05 → 04:25 | - |
| E2E29-TC-010 | NEW · Chain Store 確認・決済 → 完了 | 02 | 38.6s | 04:25 → 05:03 | - |
| E2E29-TC-011 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 38.6s | 05:03 → 05:42 | - |
| E2E29-TC-012 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.2s | 05:42 → 05:45 | - |
| E2E29-TC-013 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 24.7s | 05:45 → 06:10 | Dashboard GET /api/home: trả về sau 84.7s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 45.8s (ngưỡng 30s) |
| E2E29-TC-014 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.7s | 06:10 → 06:17 | - |
| E2E29-TC-015 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 28.1s | 06:17 → 06:45 | - |
| E2E29-TC-016 | CONTINUE · 報告済 (02-90) | 99 | 12.3s | 06:45 → 06:57 | - |
| E2E29-TC-017 | CONTINUE · Chain Store 確認・決済 → 完了 | 02 | 43.2s | 06:57 → 07:40 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-29.spec_16-10-2026_12-29-44_dev/SUMMARY.md
