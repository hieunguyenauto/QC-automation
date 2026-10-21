# PASSED · E2E-22.spec_16-10-2026_13-10-39_dev

Chạy lúc 16/10/2026 13:10:39 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 16 / 16

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E22-TC-001 | SETUP · LINKSYS STORE00004; 限度額 read | 99 | 17.2s | 00:00 → 00:17 | - |
| E2E22-TC-002 | NEW · chainstore manager creates trouble (トラブルナビ) | 01 | 57.2s | 00:17 → 01:15 | - |
| E2E22-TC-003 | NEW · Set urgent: 案件区分 営業停止案件 | 99 | 18.8s | 01:15 → 01:33 | Dashboard GET /api/home: trả về sau 61.3s (ngưỡng 30s) |
| E2E22-TC-004 | NEW · Admin: 対応中 + assign worker | 99 | 8.2s | 01:33 → 01:42 | - |
| E2E22-TC-005 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 16.0s | 01:42 → 01:58 | - |
| E2E22-TC-006 | NEW · Create 4 estimates (total = FIX + 1), 提示 3, keep 1 下書き | 99 | 30.9s | 01:58 → 02:28 | - |
| E2E22-TC-007 | NEW · Urgent: Admin approves 1 estimate → others 失効 | 99 | 15.0s | 02:28 → 02:43 | - |
| E2E22-TC-008 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 20.5s | 02:43 → 03:04 | - |
| E2E22-TC-009 | NEW · CS Admin 確認・決済 → 完了 | 01 | 38.1s | 03:04 → 03:42 | - |
| E2E22-TC-010 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 39.1s | 03:42 → 04:21 | - |
| E2E22-TC-011 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.4s | 04:21 → 04:25 | - |
| E2E22-TC-012 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 24.2s | 04:25 → 04:49 | Dashboard GET /api/home: trả về sau 84.3s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 46.0s (ngưỡng 30s) |
| E2E22-TC-013 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.0s | 04:49 → 04:55 | - |
| E2E22-TC-014 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 24.0s | 04:55 → 05:19 | - |
| E2E22-TC-015 | CONTINUE · 報告済 (02-90) | 99 | 10.5s | 05:19 → 05:29 | - |
| E2E22-TC-016 | CONTINUE · CS Admin 確認・決済 → 完了 | 01 | 43.2s | 05:29 → 06:13 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-22.spec_16-10-2026_13-10-39_dev/SUMMARY.md
