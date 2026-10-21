# E2E-01_16-10-2026_15-27-08_toridoll-test

Chạy lúc 16/10/2026 15:27:08 · môi trường toridoll-test (https://cms-toridoll-test.qnavi.picontechnology.com)

| Tổng | Pass | Fail | Skip | Thời gian | Trạng thái |
|---|---|---|---|---|---|
| 15 | 15 | 0 | 0 | 339.3s | PASSED |

## Performance (lưu tạm để check sau — không làm fail TC; log dồn: reports/PERFORMANCE.md)

| TC ID | Test case | Chi tiết |
|---|---|---|
| E2E01-TC-003 | NEW · Admin: 対応中 + assign worker | Dashboard GET /api/home: trả về sau 56.9s (ngưỡng 30s) |
| E2E01-TC-011 | CONTINUE · Create 1 estimate (total = FIX − 1) and 提示 | Dashboard GET /api/home: trả về sau 87.9s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 49.7s (ngưỡng 30s) |
| E2E01-TC-015 | CONTINUE · Chain Store 確認・決済 → 完了 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

## Failed

Không có.

## Passed

Chi tiết + video đầy đủ: [PASSED.md](../../Passed/E2E-01_16-10-2026_15-27-08_toridoll-test/PASSED.md)

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video |
|---|---|---|---|---|
| E2E01-TC-001 | SETUP · LINKSYS STORE00006; 限度額 read | 99 | 19.8s | 00:00 |
| E2E01-TC-002 | NEW · chainstore creates trouble (トラブルナビ) | 02 | 53.0s | 00:20 |
| E2E01-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 19.8s | 01:13 |
| E2E01-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 15.7s | 01:33 |
| E2E01-TC-005 | NEW · Create 1 estimate (total = FIX − 1) and 提示 | 99 | 14.8s | 01:48 |
| E2E01-TC-006 | NEW · ≤ FIX → auto approve (no approver) | 99 | 6.4s | 02:03 |
| E2E01-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 15.2s | 02:10 |
| E2E01-TC-008 | NEW · Chain Store 確認・決済 → 完了 | 02 | 38.0s | 02:25 |
| E2E01-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 42.6s | 03:03 |
| E2E01-TC-010 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.4s | 03:45 |
| E2E01-TC-011 | CONTINUE · Create 1 estimate (total = FIX − 1) and 提示 | 99 | 24.6s | 03:49 |
| E2E01-TC-012 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.3s | 04:13 |
| E2E01-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 | 99 | 24.6s | 04:20 |
| E2E01-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 11.3s | 04:44 |
| E2E01-TC-015 | CONTINUE · Chain Store 確認・決済 → 完了 | 02 | 42.5s | 04:55 |

## Skipped

Không có.

Video cả lần chạy: [../../Passed/E2E-01_16-10-2026_15-27-08_toridoll-test/video-full.webm](../../Passed/E2E-01_16-10-2026_15-27-08_toridoll-test/video-full.webm) — mốc tua từng TC ghi trong PASSED.md / FAIL.md; TC fail có thêm video-fail.webm.

Report gốc của Playwright: `npm run report` (thư mục `html/` cạnh file này) — bấm vào TC fail để xem trace / ảnh.
