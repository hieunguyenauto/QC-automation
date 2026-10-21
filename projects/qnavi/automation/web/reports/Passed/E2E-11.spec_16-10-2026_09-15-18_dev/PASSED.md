# PASSED · E2E-11.spec_16-10-2026_09-15-18_dev

Chạy lúc 16/10/2026 09:15:18 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 15 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E11-TC-001 | SETUP · LINKSYS STORE00004; 限度額 read | 99 | 17.1s | 00:00 → 00:17 | - |
| E2E11-TC-002 | NEW · chainstore manager creates trouble (トラブルナビ) | 01 | 58.4s | 00:17 → 01:16 | - |
| E2E11-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 18.2s | 01:16 → 01:34 | Dashboard GET /api/home: trả về sau 62.6s (ngưỡng 30s) |
| E2E11-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 17.7s | 01:34 → 01:52 | - |
| E2E11-TC-005 | NEW · Create 1 estimate(s) (total = FIX (boundary)) and 提示 | 99 | 19.2s | 01:52 → 02:11 | - |
| E2E11-TC-006 | NEW · ≤ FIX → auto approve (no approver) | 99 | 6.1s | 02:11 → 02:17 | - |
| E2E11-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 15.9s | 02:17 → 02:33 | - |
| E2E11-TC-008 | NEW · CS Admin 確認・決済 → 完了 | 01 | 38.5s | 02:33 → 03:11 | - |
| E2E11-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 39.2s | 03:11 → 03:51 | - |
| E2E11-TC-010 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.5s | 03:51 → 03:54 | - |
| E2E11-TC-011 | CONTINUE · Create 1 estimate(s) (total = FIX (boundary)) and 提示 | 99 | 24.1s | 03:54 → 04:18 | Dashboard GET /api/home: trả về sau 85.3s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 46.6s (ngưỡng 30s) |
| E2E11-TC-012 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.1s | 04:18 → 04:24 | - |
| E2E11-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 24.2s | 04:24 → 04:49 | - |
| E2E11-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 10.9s | 04:49 → 04:59 | - |
| E2E11-TC-015 | CONTINUE · CS Admin 確認・決済 → 完了 | 01 | 43.2s | 04:59 → 05:43 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-11.spec_16-10-2026_09-15-18_dev/SUMMARY.md
