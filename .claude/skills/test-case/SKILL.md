---
name: test-case
description: Sinh test case từ viewpoint đã LOCKED theo format team (No., VP_ID, Priority, Category / Test items, Sub Category, Objective, Pre-condition, Data test, Test Steps, Expectation result) kèm Automation Eligibility. Dùng khi người dùng nói "viết test case", "sinh TC", "/test-case".
---
# Input
- qc/test-viewpoints/<scope-key>-viewpoints.md có State = LOCKED. Chưa LOCKED → dừng.
- Context pack trong qc/gap-reports/<scope-key>-gap-report.md (thuật ngữ, màn hình, bài học).
- templates/testcase.md, templates/data-test.md, references/test-design-techniques.md, references/automation-eligibility.md.

# Quy trình
1. Mỗi VP: đọc "Trục" ở cột Note; mỗi giá trị trên trục → 1 TC. Chọn kỹ thuật (EP, BVA, Decision Table…), khai triển theo trục biến thiên: mỗi giá trị data / trạng thái / nhánh điều kiện → 1 TC. Nhiều TC cùng 1 VP_ID là đúng.
2. No. = TC-<FUNC>-NNN. Priority: High (happy case cho UAT/regression) / Normal.
3. Objective: "Verify that + <expectation> + in case/when + <condition>". Có chữ "và" nối 2 ý độc lập → tách 2 TC.
4. Pre-condition không có ghi "-". Data test: data cụ thể hoặc trỏ No. trong data-test.md.
5. Test Steps đánh số "1. … 2. …", mỗi bước 1 hành động. Expectation result quan sát được, giữ nguyên tiếng Nhật.
   - MỖI TC CHỈ 1 EXPECTED RESULT. Không gộp nhiều kết quả vào 1 ô (không "và", không liệt kê 1) 2) 3), không "<br>" nhiều kết quả).
   - Cần kiểm nhiều thứ (message + màu field + không lưu DB…) → tách mỗi thứ 1 TC, cùng VP_ID, Test Steps giống nhau.
   - Ví dụ SAI: "Hiển thị message E001 và field viền đỏ và không lưu". ĐÚNG: 3 TC, mỗi TC 1 kết quả.
6. Gán Automation Eligibility theo automation-eligibility.md.
7. Đối soát: bảng VP_ID | Kỹ thuật | Số TC; VP nào 0 TC phải ghi lý do; TC không có VP_ID là lỗi.
8. VP nhóm 8 (bài học / bug cũ): Priority High, Remarks ghi ID bug.
9. Draft → duyệt → ghi qc/test-cases/<scope-key>-test-cases.md theo templates/testcase.md → Lock khi được duyệt.

# Cấm
- Gộp nhiều expected result vào 1 TC.
- Sửa viewpoint ở đây · đổi tên / thứ tự cột · dùng MANUAL để che thiếu spec (dùng NEEDS_SPEC) · bịa field/message.
