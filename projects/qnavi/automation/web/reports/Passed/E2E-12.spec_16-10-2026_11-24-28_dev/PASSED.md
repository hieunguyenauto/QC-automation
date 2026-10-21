# PASSED · E2E-12.spec_16-10-2026_11-24-28_dev

Chạy lúc 16/10/2026 11:24:28 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 17 / 17

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E12-TC-001 | SETUP · LINKSYS STORE00007; 限度額 read | 99 | 17.8s | 00:00 → 00:17 | - |
| E2E12-TC-002 | NEW · chainstore creates trouble (トラブルナビ) | 02 | 61.7s | 00:18 → 01:20 | - |
| E2E12-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 17.3s | 01:20 → 01:37 | Dashboard GET /api/home: trả về sau 65.2s (ngưỡng 30s) |
| E2E12-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 15.5s | 01:37 → 01:53 | - |
| E2E12-TC-005 | NEW · Create 2 estimate(s) (total = FIX + 1) and 提示 | 99 | 23.7s | 01:53 → 02:16 | - |
| E2E12-TC-006 | NEW · 差し戻し → コピー → 新規提示 | 01 | 53.7s | 02:16 → 03:10 | Dashboard GET /api/home: trả về sau 40.5s (ngưỡng 30s) |
| E2E12-TC-007 | NEW · Approve (2 level(s)): ChainStore Manager 'LINKSYS MANAGER00001' → ChainStore Manager 'LINKSYS MANAGER00002' | 01 | 79.0s | 03:10 → 04:29 | - |
| E2E12-TC-008 | NEW · Other estimates → 失効 after approval | 99 | 15.8s | 04:29 → 04:45 | Dashboard GET /api/home: trả về sau 82.1s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 44.1s (ngưỡng 30s) |
| E2E12-TC-009 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 17.1s | 04:45 → 05:02 | - |
| E2E12-TC-010 | NEW · CS Admin 確認・決済 → 完了 | 01 | 38.1s | 05:02 → 05:40 | - |
| E2E12-TC-011 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 39.1s | 05:40 → 06:19 | - |
| E2E12-TC-012 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.3s | 06:19 → 06:22 | - |
| E2E12-TC-013 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 24.3s | 06:22 → 06:47 | Dashboard GET /api/home: trả về sau 84.7s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 46.2s (ngưỡng 30s) |
| E2E12-TC-014 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.3s | 06:47 → 06:53 | - |
| E2E12-TC-015 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 25.0s | 06:53 → 07:18 | - |
| E2E12-TC-016 | CONTINUE · 報告済 (02-90) | 99 | 11.1s | 07:18 → 07:29 | - |
| E2E12-TC-017 | CONTINUE · CS Admin 確認・決済 → 完了 | 01 | 42.6s | 07:29 → 08:12 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-12.spec_16-10-2026_11-24-28_dev/SUMMARY.md
