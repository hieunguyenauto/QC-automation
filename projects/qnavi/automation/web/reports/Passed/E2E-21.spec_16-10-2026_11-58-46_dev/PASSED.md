# PASSED · E2E-21.spec_16-10-2026_11-58-46_dev

Chạy lúc 16/10/2026 11:58:46 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 15 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E21-TC-001 | SETUP · LINKSYS STORE00006; 限度額 read | 99 | 17.8s | 00:00 → 00:18 | - |
| E2E21-TC-002 | NEW · chainstore creates trouble (トラブルナビ) | 02 | 55.3s | 00:18 → 01:13 | - |
| E2E21-TC-003 | NEW · Set urgent: 案件区分 営業停止案件 | 99 | 19.6s | 01:13 → 01:33 | Dashboard GET /api/home: trả về sau 59.1s (ngưỡng 30s) |
| E2E21-TC-004 | NEW · Admin: 対応中 + assign worker | 99 | 9.8s | 01:33 → 01:43 | - |
| E2E21-TC-005 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 16.2s | 01:43 → 01:59 | - |
| E2E21-TC-006 | NEW · Create 1 estimate(s) (total = FIX + 1) and 提示 | 99 | 14.1s | 01:59 → 02:13 | - |
| E2E21-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 28.1s | 02:13 → 02:41 | - |
| E2E21-TC-008 | NEW · Chain Store 確認・決済 → 完了 | 02 | 37.9s | 02:41 → 03:19 | - |
| E2E21-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 39.0s | 03:19 → 03:58 | - |
| E2E21-TC-010 | CONTINUE · Urgent inherited: 案件区分 営業停止案件 | 99 | 12.4s | 03:58 → 04:10 | Dashboard GET /api/home: trả về sau 81.3s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 43.3s (ngưỡng 30s) |
| E2E21-TC-011 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 28.8s | 04:10 → 04:39 | - |
| E2E21-TC-012 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 24.1s | 04:39 → 05:03 | Dashboard GET /api/home: trả về sau 32.5s (ngưỡng 30s) |
| E2E21-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 25.0s | 05:03 → 05:28 | - |
| E2E21-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 11.4s | 05:28 → 05:40 | - |
| E2E21-TC-015 | CONTINUE · Chain Store 確認・決済 → 完了 | 02 | 43.8s | 05:40 → 06:24 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-21.spec_16-10-2026_11-58-46_dev/SUMMARY.md
