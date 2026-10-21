# PASSED · E2E-18.spec_16-10-2026_11-38-43_dev

Chạy lúc 16/10/2026 11:38:43 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 16 / 16

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E18-TC-001 | SETUP · LINKSYS STORE00007; 限度額 read | 99 | 17.2s | 00:00 → 00:17 | - |
| E2E18-TC-002 | NEW · chainstore manager creates trouble (トラブルナビ) | 01 | 56.2s | 00:17 → 01:14 | - |
| E2E18-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 17.2s | 01:14 → 01:31 | Dashboard GET /api/home: trả về sau 60.2s (ngưỡng 30s) |
| E2E18-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 15.5s | 01:31 → 01:46 | - |
| E2E18-TC-005 | NEW · Create 3 estimate(s) (total = FIX + 1) and 提示 | 99 | 24.8s | 01:46 → 02:11 | - |
| E2E18-TC-006 | NEW · Approve (2 level(s)): ChainStore Manager 'LINKSYS MANAGER00001' → ChainStore Manager 'LINKSYS MANAGER00002' | 01 | 77.7s | 02:11 → 03:29 | - |
| E2E18-TC-007 | NEW · Other estimates → 失効 after approval | 99 | 16.2s | 03:29 → 03:45 | Dashboard GET /api/home: trả về sau 82.3s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 45.2s (ngưỡng 30s) |
| E2E18-TC-008 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 14.9s | 03:45 → 04:00 | - |
| E2E18-TC-009 | NEW · CS Admin 確認・決済 → 完了 | 01 | 37.5s | 04:00 → 04:37 | - |
| E2E18-TC-010 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 38.4s | 04:37 → 05:16 | - |
| E2E18-TC-011 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.3s | 05:16 → 05:19 | - |
| E2E18-TC-012 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 24.0s | 05:19 → 05:43 | Dashboard GET /api/home: trả về sau 82.7s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 44.9s (ngưỡng 30s) |
| E2E18-TC-013 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.3s | 05:43 → 05:50 | - |
| E2E18-TC-014 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 28.7s | 05:50 → 06:18 | - |
| E2E18-TC-015 | CONTINUE · 報告済 (02-90) | 99 | 10.7s | 06:18 → 06:29 | - |
| E2E18-TC-016 | CONTINUE · CS Admin 確認・決済 → 完了 | 01 | 43.0s | 06:29 → 07:12 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-18.spec_16-10-2026_11-38-43_dev/SUMMARY.md
