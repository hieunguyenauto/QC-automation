# PASSED · E2E-06.spec_16-10-2026_08-38-11_dev

Chạy lúc 16/10/2026 08:38:11 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 15 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E06-TC-001 | SETUP · LINKSYS STORE00008; 限度額 read | 99 | 17.5s | 00:00 → 00:17 | - |
| E2E06-TC-002 | NEW · chainstore manager creates trouble (トラブルナビ) | 01 | 57.9s | 00:18 → 01:16 | - |
| E2E06-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 18.8s | 01:16 → 01:34 | Dashboard GET /api/home: trả về sau 61.8s (ngưỡng 30s) |
| E2E06-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 15.6s | 01:34 → 01:50 | - |
| E2E06-TC-005 | NEW · Create 1 estimate(s) (total = ¥9,999,999) and 提示 | 99 | 15.2s | 01:50 → 02:05 | - |
| E2E06-TC-006 | NEW · Approve (1 level(s)): ChainStore Manager 'LINKSYS MANAGER00005' | 01 | 39.4s | 02:05 → 02:45 | - |
| E2E06-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 25.0s | 02:45 → 03:10 | Dashboard GET /api/home: trả về sau 43.3s (ngưỡng 30s) |
| E2E06-TC-008 | NEW · CS Admin 確認・決済 → 完了 | 01 | 39.4s | 03:10 → 03:49 | - |
| E2E06-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 39.0s | 03:49 → 04:28 | - |
| E2E06-TC-010 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.2s | 04:28 → 04:31 | - |
| E2E06-TC-011 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 27.2s | 04:31 → 04:58 | Dashboard GET /api/home: trả về sau 84.8s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 45.2s (ngưỡng 30s) |
| E2E06-TC-012 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 5.7s | 04:58 → 05:04 | - |
| E2E06-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 24.8s | 05:04 → 05:29 | - |
| E2E06-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 10.9s | 05:29 → 05:40 | - |
| E2E06-TC-015 | CONTINUE · CS Admin 確認・決済 → 完了 | 01 | 43.1s | 05:40 → 06:23 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-06.spec_16-10-2026_08-38-11_dev/SUMMARY.md
