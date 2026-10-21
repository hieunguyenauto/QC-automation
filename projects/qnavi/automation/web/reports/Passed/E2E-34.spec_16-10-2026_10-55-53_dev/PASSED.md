# PASSED · E2E-34.spec_16-10-2026_10-55-53_dev

Chạy lúc 16/10/2026 10:55:53 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 16 / 16

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E34-TC-001 | SETUP · LINKSYS STORE00001; 限度額 read | 99 | 17.3s | 00:00 → 00:17 | - |
| E2E34-TC-002 | NEW · chainstore creates trouble (トラブルナビ) | 02 | 54.7s | 00:18 → 01:12 | - |
| E2E34-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 18.2s | 01:12 → 01:30 | Dashboard GET /api/home: trả về sau 58.8s (ngưỡng 30s) |
| E2E34-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 20.0s | 01:30 → 01:50 | - |
| E2E34-TC-005 | NEW · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 14.6s | 01:50 → 02:05 | - |
| E2E34-TC-006 | NEW · ≤ FIX → auto approve (no approver) | 99 | 6.6s | 02:05 → 02:12 | - |
| E2E34-TC-007 | NEW · Read-key store views auto-approved estimate | 02 | 31.6s | 02:12 → 02:43 | - |
| E2E34-TC-008 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 28.3s | 02:43 → 03:12 | Dashboard GET /api/home: trả về sau 34.9s (ngưỡng 30s) |
| E2E34-TC-009 | NEW · Chain Store 確認・決済 → 完了 | 02 | 39.1s | 03:12 → 03:51 | - |
| E2E34-TC-010 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 38.9s | 03:51 → 04:30 | - |
| E2E34-TC-011 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.7s | 04:30 → 04:33 | - |
| E2E34-TC-012 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 25.9s | 04:33 → 04:59 | Dashboard GET /api/home: trả về sau 86.3s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 47.0s (ngưỡng 30s) |
| E2E34-TC-013 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.7s | 04:59 → 05:06 | - |
| E2E34-TC-014 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 28.3s | 05:06 → 05:34 | - |
| E2E34-TC-015 | CONTINUE · 報告済 (02-90) | 99 | 12.3s | 05:34 → 05:47 | - |
| E2E34-TC-016 | CONTINUE · Chain Store 確認・決済 → 完了 | 02 | 43.7s | 05:47 → 06:30 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-34.spec_16-10-2026_10-55-53_dev/SUMMARY.md
