# RT_run

Chạy lúc 15/10/2026 01:59:04 · môi trường test

| Tổng | Pass | Fail | Skip | Thời gian | Trạng thái |
|---|---|---|---|---|---|
| 3 | 1 | 1 | 1 | 9.3s | FAILED |

## Failed

| TC ID | Test case | Bước fail | Lỗi | Chi tiết |
|---|---|---|---|---|
| RT-TC-002 | fail two | - | Error: expect(received).toBe(expected) // Object.is equality | [FAIL.md](../../Failed/RT-TC-002_fail-two_x_test/FAIL.md) |

## Passed

Chi tiết + video đầy đủ: [PASSED.md](../../Passed/RT_run/PASSED.md)

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video |
|---|---|---|---|---|
| RT-TC-001 | pass one | - | 1.5s | 00:02 |

## Skipped

| TC ID | Test case | Lý do |
|---|---|---|
| RT-TC-003 | skipped three | Không chạy (TC trước fail trong kịch bản nối tiếp, hoặc thiếu điều kiện) |

Video cả lần chạy: [../../Passed/RT_run/video-full.webm](../../Passed/RT_run/video-full.webm) — mốc tua từng TC ghi trong PASSED.md / FAIL.md; TC fail có thêm video-fail.webm.

Report gốc của Playwright: `npm run report` (thư mục `html/` cạnh file này) — bấm vào TC fail để xem trace / ảnh.
