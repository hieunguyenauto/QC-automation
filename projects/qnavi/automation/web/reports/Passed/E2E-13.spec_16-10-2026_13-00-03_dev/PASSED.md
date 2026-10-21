# PASSED · E2E-13.spec_16-10-2026_13-00-03_dev

Chạy lúc 16/10/2026 13:00:04 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 16 / 16

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E13-TC-001 | SETUP · LINKSYS STORE00004; 限度額 read | 99 | 20.9s | 00:00 → 00:21 | - |
| E2E13-TC-002 | NEW · admin creates trouble (web form) | 99 | 22.9s | 00:21 → 00:44 | - |
| E2E13-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 8.0s | 00:44 → 00:52 | - |
| E2E13-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 16.2s | 00:52 → 01:08 | - |
| E2E13-TC-005 | NEW · Create 1 estimate(s) (total = ¥22,001 (税抜 ¥20,001 ≥ Lv1 min_amount ¥20,000)) and 提示 | 99 | 18.8s | 01:08 → 01:27 | - |
| E2E13-TC-006 | NEW · 取り下げ申請 → 承認 → 再提示 | 99 | 74.5s | 01:27 → 02:42 | Dashboard GET /api/home: trả về sau 45.8s (ngưỡng 30s) |
| E2E13-TC-007 | NEW · Approve type 04 (稟議, sequential managers) | 01 | 41.5s | 02:42 → 03:23 | - |
| E2E13-TC-008 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 26.1s | 03:23 → 03:49 | Dashboard GET /api/home: trả về sau 44.5s (ngưỡng 30s) |
| E2E13-TC-009 | NEW · Store Manager 確認・決済 → 完了 | 01 | 38.1s | 03:49 → 04:27 | - |
| E2E13-TC-010 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 39.7s | 04:27 → 05:07 | - |
| E2E13-TC-011 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.3s | 05:07 → 05:10 | - |
| E2E13-TC-012 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 24.0s | 05:10 → 05:34 | Dashboard GET /api/home: trả về sau 84.5s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 46.2s (ngưỡng 30s) |
| E2E13-TC-013 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.3s | 05:34 → 05:41 | - |
| E2E13-TC-014 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 31.5s | 05:41 → 06:12 | - |
| E2E13-TC-015 | CONTINUE · 報告済 (02-90) | 99 | 12.1s | 06:12 → 06:24 | - |
| E2E13-TC-016 | CONTINUE · Store Manager 確認・決済 → 完了 | 01 | 43.7s | 06:24 → 07:08 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-13.spec_16-10-2026_13-00-03_dev/SUMMARY.md
