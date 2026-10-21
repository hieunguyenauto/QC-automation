# PASSED · E2E-02_15-10-2026_16-43-41_dev

Chạy lúc 15/10/2026 16:43:41 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 15 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E02-TC-001 | SETUP · LINKSYS STORE00007; 限度額 read | 99 | 16.5s | 00:00 → 00:16 | - |
| E2E02-TC-002 | NEW · chainstore manager creates trouble (トラブルナビ) | 01 | 57.7s | 00:17 → 01:14 | - |
| E2E02-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 18.7s | 01:14 → 01:33 | Dashboard GET /api/home: trả về sau 61.7s (ngưỡng 30s) |
| E2E02-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 15.7s | 01:33 → 01:49 | - |
| E2E02-TC-005 | NEW · Create 1 estimate(s) (total = FIX + 1) and 提示 | 99 | 18.4s | 01:49 → 02:07 | - |
| E2E02-TC-006 | NEW · Approve (2 level(s)): ChainStore Manager 'LINKSYS MANAGER00001' → ChainStore Manager 'LINKSYS MANAGER00002' | 01 | 78.2s | 02:07 → 03:25 | - |
| E2E02-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 25.1s | 03:25 → 03:50 | Dashboard GET /api/home: trả về sau 82.2s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 43.9s (ngưỡng 30s) |
| E2E02-TC-008 | NEW · CS Admin 確認・決済 → 完了 | 01 | 39.0s | 03:50 → 04:29 | - |
| E2E02-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 38.1s | 04:30 → 05:08 | - |
| E2E02-TC-010 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.5s | 05:08 → 05:11 | - |
| E2E02-TC-011 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 24.6s | 05:11 → 05:36 | Dashboard GET /api/home: trả về sau 84.9s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 45.7s (ngưỡng 30s) |
| E2E02-TC-012 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.4s | 05:36 → 05:42 | - |
| E2E02-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 24.9s | 05:42 → 06:07 | - |
| E2E02-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 11.3s | 06:07 → 06:18 | - |
| E2E02-TC-015 | CONTINUE · CS Admin 確認・決済 → 完了 | 01 | 44.1s | 06:18 → 07:03 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-02_15-10-2026_16-43-41_dev/SUMMARY.md
