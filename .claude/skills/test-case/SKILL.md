---
name: test-case
description: Sinh test case từ viewpoint đã LOCKED theo format sheet TC (TC ID, Viewpoint ID, Test Level, Main Screen, Function, Pre-condition, Steps, Expected Results, Role, OS, Priority, Status) kèm Automation Eligibility, rồi đối chiếu 3 nguồn. Dùng khi người dùng nói "viết test case", "sinh TC", "/test-case".
---
# Input
- <P>/qc/test-viewpoints/<scope-key>-viewpoints.md có State = LOCKED. Chưa LOCKED → dừng.
- Context pack trong <P>/qc/gap-reports/<scope-key>-gap-report.md.
- qc/templates/testcase.md, qc/templates/data-test.md, references/test-design-techniques.md, references/automation-eligibility.md.
- Chỉ làm đúng 1 sheet được chỉ định.

# Quy trình
1. Mỗi VP: đọc "Axis" ở cột Note; mỗi giá trị trên trục → 1 TC. Chọn kỹ thuật (EP, BVA, Decision Table…). Nhiều TC cùng 1 Viewpoint ID là đúng.
2. TC ID = <PREFIX>-TC-NNN (quy ước CR / enhancement theo <P>/README.md). Viết tiếng Anh, label tiếng Nhật giữ nguyên trong ''.
3. 1 TC = 1 behavior = 1 Expected Result.
   - Không gộp nhiều kết quả vào 1 ô (không "and", không liệt kê 1) 2) 3), không "<br>" nhiều kết quả).
   - Cần kiểm nhiều thứ (message + màu field + không lưu DB…) → tách mỗi thứ 1 TC, cùng Viewpoint ID, Steps giống nhau.
4. Pre-condition không có ghi "-". Steps đánh số "1. … 2. …", bước 1 thường là "Login as <Role>". Role / OS theo spec.
5. Priority: High (luồng chính, UAT) · Medium (negative / validation chính) · Low (UI, hiếm gặp). VP nhóm 8 (bài học / bug cũ) → High, ghi bug ID ở Function hoặc ghi chú. Status để trống.
6. Gán Automation Eligibility theo automation-eligibility.md.
7. Đối chiếu 3 nguồn trước khi coi là xong: (1) viewpoint, (2) TC cũ của function (nếu sources.md có), (3) basic design. Case thiếu → bổ sung; TC bổ sung không map được viewpoint nào → ĐỂ TRỐNG Viewpoint ID, liệt kê riêng để người quyết có tạo VP mới không. Mâu thuẫn → theo sources.md.
8. Kiểm trùng theo NỘI DUNG (không chỉ theo ID) và trace 2 chiều: in bảng Viewpoint ID | Kỹ thuật | Số TC; VP nào 0 TC ghi lý do; TC trỏ VP không tồn tại là lỗi.
9. Draft → duyệt → ghi <P>/qc/test-cases/<scope-key>-test-cases.md theo qc/templates/testcase.md → Lock khi được duyệt.
10. Sau khi LOCKED: hỏi đúng 1 câu "TC đã LOCKED. Xuất Excel không?". Có → skill export-excel. Không → dừng.

# Cấm
- Gộp nhiều expected result / scenario vào 1 TC · đặt Viewpoint ID giả (vd CMS-NEW) · tự tạo viewpoint mới.
- Đổi tên / thứ tự cột · dùng MANUAL để che thiếu spec (dùng NEEDS_SPEC) · bịa field/message · suy quyền từ UI thay vì permission matrix.
