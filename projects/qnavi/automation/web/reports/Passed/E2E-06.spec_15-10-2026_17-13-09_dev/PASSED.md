# PASSED · E2E-06.spec_15-10-2026_17-13-09_dev

Chạy lúc 15/10/2026 17:13:09 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 12 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E06-TC-001 | SETUP · LINKSYS STORE00008; 限度額 read | 99 | 15.9s | 00:00 → 00:16 | - |
| E2E06-TC-002 | NEW · chainstore manager creates trouble (トラブルナビ) | 01 | 55.8s | 00:16 → 01:12 | - |
| E2E06-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 17.8s | 01:12 → 01:30 | Dashboard GET /api/home: trả về sau 59.5s (ngưỡng 30s) |
| E2E06-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 15.3s | 01:30 → 01:45 | - |
| E2E06-TC-005 | NEW · Create 1 estimate(s) (total = ¥9,999,999) and 提示 | 99 | 15.7s | 01:45 → 02:01 | - |
| E2E06-TC-006 | NEW · Approve (1 level(s)): ChainStore Manager 'LINKSYS MANAGER00005' | 01 | 39.4s | 02:01 → 02:40 | - |
| E2E06-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 30.0s | 02:40 → 03:10 | Dashboard GET /api/home: trả về sau 42.7s (ngưỡng 30s) |
| E2E06-TC-008 | NEW · CS Admin 確認・決済 → 完了 | 01 | 39.3s | 03:10 → 03:49 | - |
| E2E06-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 39.2s | 03:49 → 04:29 | - |
| E2E06-TC-010 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.4s | 04:29 → 04:32 | - |
| E2E06-TC-011 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 24.3s | 04:32 → 04:56 | Dashboard GET /api/home: trả về sau 85.7s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 46.1s (ngưỡng 30s) |
| E2E06-TC-012 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.4s | 04:56 → 05:03 | - |

Report gốc: reports/Runs/E2E-06.spec_15-10-2026_17-13-09_dev/SUMMARY.md
