# 2026-10-13 Tìm kiếm: đọc nhầm kết quả mặc định trước khi kết quả tìm về
- Loại: TIMING
- Nguồn: @P007-TC-053 (cũng TC-054) — file: web/tests/cms/phase007-regression.spec.ts (dev)
- Function / màn hình: タスク管理 (/admin/tasks)
- Triệu chứng: task đầu '未着手' (mong '完了'); ảnh lúc fail bảng lại '該当データが0件でした。'.
- Nguyên nhân gốc: sau 検索 test chờ '全 N 件' — chữ này đã có từ danh sách mặc định (status=01, taskScope=02) → đọc dòng cũ. Thêm: taskScope mặc định 'あなたのタスク' của admin không có task 見積承認依頼 → TC rev 6 ghi タスク範囲 '全て'.
- Cách fix: TaskListScreen.search(): waitForResponse GET /tasks có troubleNumber đúng giá trị tìm, rồi waitApisIdle; spec truyền scope ''.
- Rule rút ra: R27
- Áp dụng cho: mọi màn tìm kiếm có danh sách mặc định trước khi tìm.
