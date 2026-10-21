# PASSED · E2E-05.spec_16-10-2026_11-18-44_dev

Chạy lúc 16/10/2026 11:18:44 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 15 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E05-TC-001 | SETUP · LINKSYS STORE00005; 限度額 read | 99 | 17.2s | 00:00 → 00:17 | - |
| E2E05-TC-002 | NEW · chainstore creates trouble (トラブルナビ) | 02 | 54.6s | 00:18 → 01:12 | - |
| E2E05-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 17.1s | 01:12 → 01:29 | Dashboard GET /api/home: trả về sau 57.8s (ngưỡng 30s) |
| E2E05-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 16.8s | 01:29 → 01:46 | - |
| E2E05-TC-005 | NEW · Create 1 estimate(s) (total = ¥4,999 (≤ FIX ¥20,000)) and 提示 | 99 | 15.2s | 01:46 → 02:01 | - |
| E2E05-TC-006 | NEW · ≤ FIX → auto approve (no approver) | 99 | 6.3s | 02:01 → 02:08 | - |
| E2E05-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 16.3s | 02:08 → 02:24 | - |
| E2E05-TC-008 | NEW · CS Admin 確認・決済 → 完了 | 01 | 38.3s | 02:24 → 03:02 | - |
| E2E05-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 39.3s | 03:02 → 03:41 | - |
| E2E05-TC-010 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.4s | 03:41 → 03:45 | - |
| E2E05-TC-011 | CONTINUE · Create 1 estimate(s) (total = ¥4,999 (≤ FIX ¥20,000)) and 提示 | 99 | 24.9s | 03:45 → 04:10 | Dashboard GET /api/home: trả về sau 84.5s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 45.9s (ngưỡng 30s) |
| E2E05-TC-012 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.4s | 04:10 → 04:16 | - |
| E2E05-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 24.9s | 04:16 → 04:41 | - |
| E2E05-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 11.5s | 04:41 → 04:53 | - |
| E2E05-TC-015 | CONTINUE · CS Admin 確認・決済 → 完了 | 01 | 44.0s | 04:53 → 05:37 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-05.spec_16-10-2026_11-18-44_dev/SUMMARY.md
