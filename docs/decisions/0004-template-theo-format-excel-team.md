# 0004 — Template theo format file Excel test case của team
- Ngày: 2026-10-09 · Trạng thái: Đã áp dụng
- Ảnh hưởng file: templates/viewpoint.md, templates/testcase.md, templates/data-test.md

## Bối cảnh
Output phải export sang file Excel của team (sheet Test Viewpoint, Data test, Testcase) không phải đổi cột.

## Quyết định
Giữ đúng tên và thứ tự cột. Thêm 2 quy ước: No. ghi TC-<FUNC>-NNN (dùng làm tag automation); thêm cột Automation Eligibility. Khối Implementation 1st/2nd chỉ có trong Excel.

## Hệ quả
Cột Site cần giá trị thật của sản phẩm (đang để ví dụ).
