Quét đủ 8 nhóm cho mỗi function, không bỏ sót:

| Nhóm | Test Type gợi ý | Hỏi gì |
|---|---|---|
| 1. UI / Layout | UI | Đúng design, empty state, trạng thái button/chip/badge, responsive |
| 2. Positive | Function | Luồng chính chạy đúng với data hợp lệ |
| 3. Negative | Validation | Data sai, bỏ trống bắt buộc, sai thứ tự, không có quyền |
| 4. Boundary / Edge | Validation | Min/max length, min/max value, 0 / 1 / nhiều / tối đa, ngày biên |
| 5. Data / Business rule | Data | Trạng thái dữ liệu, trùng lặp, ràng buộc quan hệ, tính toán |
| 6. Cross-cutting | Transition / Security | Chuyển màn hình, permission/role, message tiếng Nhật, session/timeout, SQL injection, trim |
| 7. Performance | Performance | Thời gian phản hồi màn hình/API, load nhiều data (list 1.000+ dòng, export, upload file lớn), nhiều user thao tác cùng lúc, double submit. Chỉ đặt ngưỡng khi spec có số; không có → tạo OQ hỏi ngưỡng |
| 8. Bài học / bug cũ | Regression | Lấy từ dòng Lesson / Bug trong Context pack của Gap Report (qc/lessons/INDEX.md D01–D13 + bug-history của dự án). Bug/lesson nào cùng function, cùng loại field hoặc cùng pattern → ≥1 VP; Note ghi ID bug hoặc file lesson |

- Mỗi nhóm thường ra 1–vài VP cho 1 function, KHÔNG phải 1 VP cho mỗi câu hỏi trong cột "Hỏi gì" — các câu hỏi đó là giá trị trên trục, thành test case.
- Mỗi input field = 1 VP validation; các dòng qc/templates/data-test.md là trục data của VP đó.
- Mẫu câu Test Viewpoint (tiếng Anh): "Verify that <object> <aspect> in case/when <group of conditions>".
