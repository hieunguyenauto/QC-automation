| Giá trị | Dùng khi | Đi tiếp |
|---|---|---|
| UI-AUTO | Kết quả kiểm tra được bằng UI automation, ổn định | Playwright / Appium |
| API-AUTO | Có đủ method, endpoint, auth, payload, response | Để sau |
| BOTH | Cùng mục tiêu kiểm được ở cả UI và API | Playwright trước |
| MANUAL | Cần mắt người: layout, font, in ấn, thiết bị thật | Chạy tay |
| NEEDS_SPEC | Thiếu expected result, data hoặc contract | Quay lại spec-review |

- Không dùng MANUAL để che thiếu spec.
- UI-AUTO là "đủ điều kiện automate", chưa có nghĩa đã có code hay đã chạy.
- Mọi TC vẫn phải chạy tay được trước khi có code.
