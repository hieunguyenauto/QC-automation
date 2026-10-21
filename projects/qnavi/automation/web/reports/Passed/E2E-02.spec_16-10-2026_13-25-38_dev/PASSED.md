# PASSED · E2E-02.spec_16-10-2026_13-25-38_dev

Chạy lúc 16/10/2026 13:25:38 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 15 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E02-TC-001 | SETUP · LINKSYS STORE00007; 限度額 read | 99 | 23.9s | 00:00 → 00:23 | - |
| E2E02-TC-002 | NEW · chainstore manager creates trouble (トラブルナビ) | 01 | 57.1s | 00:24 → 01:21 | - |
| E2E02-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 18.0s | 01:21 → 01:39 | Dashboard GET /api/home: trả về sau 61.2s (ngưỡng 30s) |
| E2E02-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 16.6s | 01:39 → 01:56 | - |
| E2E02-TC-005 | NEW · Create 1 estimate(s) (total = FIX + 1) and 提示 | 99 | 17.1s | 01:56 → 02:13 | - |
| E2E02-TC-006 | NEW · Approve (2 level(s)): ChainStore Manager 'LINKSYS MANAGER00001' → ChainStore Manager 'LINKSYS MANAGER00002' | 01 | 77.5s | 02:13 → 03:31 | - |
| E2E02-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 26.0s | 03:31 → 03:57 | Dashboard GET /api/home: trả về sau 81.3s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 43.8s (ngưỡng 30s) |
| E2E02-TC-008 | NEW · CS Admin 確認・決済 → 完了 | 01 | 47.8s | 03:57 → 04:44 | - |
| E2E02-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 39.5s | 04:44 → 05:24 | - |
| E2E02-TC-010 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.2s | 05:24 → 05:27 | - |
| E2E02-TC-011 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 24.0s | 05:27 → 05:51 | Dashboard GET /api/home: trả về sau 94.1s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 46.0s (ngưỡng 30s) |
| E2E02-TC-012 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.4s | 05:51 → 05:58 | - |
| E2E02-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 23.8s | 05:58 → 06:21 | - |
| E2E02-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 11.0s | 06:21 → 06:32 | - |
| E2E02-TC-015 | CONTINUE · CS Admin 確認・決済 → 完了 | 01 | 43.3s | 06:32 → 07:16 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-02.spec_16-10-2026_13-25-38_dev/SUMMARY.md
