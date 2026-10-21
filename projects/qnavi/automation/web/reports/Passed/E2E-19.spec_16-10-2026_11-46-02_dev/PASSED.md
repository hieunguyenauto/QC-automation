# PASSED · E2E-19.spec_16-10-2026_11-46-02_dev

Chạy lúc 16/10/2026 11:46:02 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 15 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E19-TC-001 | SETUP · LINKSYS STORE00006; 限度額 read | 99 | 17.3s | 00:00 → 00:17 | - |
| E2E19-TC-002 | NEW · chainstore creates trouble (トラブルナビ) | 02 | 54.4s | 00:17 → 01:12 | - |
| E2E19-TC-003 | NEW · Set urgent: 案件区分 営業停止案件 | 99 | 18.1s | 01:12 → 01:30 | Dashboard GET /api/home: trả về sau 57.8s (ngưỡng 30s) |
| E2E19-TC-004 | NEW · Admin: 対応中 + assign worker | 99 | 8.5s | 01:30 → 01:38 | - |
| E2E19-TC-005 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 15.9s | 01:38 → 01:54 | - |
| E2E19-TC-006 | NEW · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 13.9s | 01:54 → 02:08 | - |
| E2E19-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 14.9s | 02:08 → 02:23 | - |
| E2E19-TC-008 | NEW · Chain Store 確認・決済 → 完了 | 02 | 37.5s | 02:23 → 03:01 | - |
| E2E19-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 39.1s | 03:01 → 03:40 | - |
| E2E19-TC-010 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.2s | 03:40 → 03:43 | - |
| E2E19-TC-011 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 24.0s | 03:43 → 04:07 | Dashboard GET /api/home: trả về sau 84.0s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 46.0s (ngưỡng 30s) |
| E2E19-TC-012 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.2s | 04:07 → 04:13 | - |
| E2E19-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 24.1s | 04:13 → 04:37 | - |
| E2E19-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 11.3s | 04:37 → 04:49 | - |
| E2E19-TC-015 | CONTINUE · Chain Store 確認・決済 → 完了 | 02 | 43.2s | 04:49 → 05:32 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-19.spec_16-10-2026_11-46-02_dev/SUMMARY.md
