# PASSED · E2E-26.spec_16-10-2026_12-23-47_dev

Chạy lúc 16/10/2026 12:23:47 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 15 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E26-TC-001 | SETUP · LINKSYS STORE00004; 限度額 read | 99 | 16.9s | 00:00 → 00:16 | - |
| E2E26-TC-002 | NEW · chainstore manager creates trouble (web form) | 01 | 51.4s | 00:17 → 01:08 | - |
| E2E26-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 18.4s | 01:08 → 01:27 | Dashboard GET /api/home: trả về sau 55.6s (ngưỡng 30s) |
| E2E26-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 17.0s | 01:27 → 01:44 | - |
| E2E26-TC-005 | NEW · Create 1 estimate(s) (total = ¥22,001 (税抜 ¥20,001 ≥ Lv1 min_amount ¥20,000)) and 提示 | 05 | 43.8s | 01:44 → 02:28 | - |
| E2E26-TC-006 | NEW · Approve type 04 (稟議): Admin approves on behalf of each Lv | 99 | 24.4s | 02:28 → 02:52 | Dashboard GET /api/home: trả về sau 47.1s (ngưỡng 30s) |
| E2E26-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 15.6s | 02:52 → 03:08 | - |
| E2E26-TC-008 | NEW · CS Admin 確認・決済 → 完了 | 01 | 38.1s | 03:08 → 03:46 | - |
| E2E26-TC-009 | CONTINUE · admin creates 継続依頼 '_2' | 99 | 21.1s | 03:46 → 04:07 | Dashboard GET /api/home: trả về sau 42.2s (ngưỡng 30s) |
| E2E26-TC-010 | CONTINUE · 作業スタッフ kept (linksysworker) | 99 | 2.4s | 04:07 → 04:09 | - |
| E2E26-TC-011 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 15.1s | 04:09 → 04:24 | - |
| E2E26-TC-012 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.1s | 04:24 → 04:30 | - |
| E2E26-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 24.3s | 04:30 → 04:55 | - |
| E2E26-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 12.4s | 04:55 → 05:07 | - |
| E2E26-TC-015 | CONTINUE · CS Admin 確認・決済 → 完了 | 01 | 42.0s | 05:07 → 05:49 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-26.spec_16-10-2026_12-23-47_dev/SUMMARY.md
