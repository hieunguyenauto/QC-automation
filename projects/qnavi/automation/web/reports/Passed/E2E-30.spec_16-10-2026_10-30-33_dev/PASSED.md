# PASSED · E2E-30.spec_16-10-2026_10-30-33_dev

Chạy lúc 16/10/2026 10:30:33 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 15 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E30-TC-001 | SETUP · LINKSYS STORE00001; 限度額 read | 99 | 16.6s | 00:00 → 00:16 | - |
| E2E30-TC-002 | NEW · admin creates trouble (web form) | 99 | 24.7s | 00:17 → 00:41 | - |
| E2E30-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 7.9s | 00:41 → 00:49 | - |
| E2E30-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 24.8s | 00:49 → 01:14 | - |
| E2E30-TC-005 | NEW · Create 1 estimate(s) (total = FIX + 1) and 提示 | 99 | 18.0s | 01:14 → 01:32 | - |
| E2E30-TC-006 | NEW · Approve (1 level(s)): CMS SubAdmin (98) | 98 | 44.8s | 01:32 → 02:17 | - |
| E2E30-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 33.6s | 02:17 → 02:51 | Dashboard GET /api/home: trả về sau 48.9s (ngưỡng 30s) |
| E2E30-TC-008 | NEW · Sub Admin 確認・決済 → 完了 | 02 | 40.2s | 02:51 → 03:31 | - |
| E2E30-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 39.1s | 03:31 → 04:10 | - |
| E2E30-TC-010 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.3s | 04:10 → 04:13 | - |
| E2E30-TC-011 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 24.9s | 04:13 → 04:38 | Dashboard GET /api/home: trả về sau 86.7s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 46.3s (ngưỡng 30s) |
| E2E30-TC-012 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.6s | 04:38 → 04:45 | - |
| E2E30-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 29.7s | 04:45 → 05:14 | - |
| E2E30-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 12.6s | 05:14 → 05:27 | - |
| E2E30-TC-015 | CONTINUE · Sub Admin 確認・決済 → 完了 | 02 | 44.1s | 05:27 → 06:11 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-30.spec_16-10-2026_10-30-33_dev/SUMMARY.md
