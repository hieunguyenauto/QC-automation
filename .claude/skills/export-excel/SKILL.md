---
name: export-excel
description: Xuất viewpoint + test case đã LOCKED ra file Excel mới trong reports/ theo format workbook của dự án. Chỉ chạy khi người dùng đồng ý / yêu cầu ("xuất excel", "export excel", "/export-excel", hoặc trả lời "Có" khi skill test-case hỏi).
---
# Khi nào chạy
- Chỉ khi người dùng yêu cầu, hoặc trả lời "Có" cho câu hỏi cuối skill test-case: "TC đã LOCKED. Xuất Excel không?". Không tự xuất.

# Input
- <P>/qc/test-viewpoints/<scope-key>-viewpoints.md và <P>/qc/test-cases/<scope-key>-test-cases.md, cả hai State = LOCKED. Chưa LOCKED → dừng.
- Danh sách cột kết quả theo role / platform: <P>/README.md (mục cột kết quả). Chỉ lấy role / OS thuộc scope (Gap Report).
- Bài học Excel: qc/lessons/INDEX.md mục Excel / công cụ (T01–T07).

# Output
- File MỚI: reports/<scope-key>-<YYYYMMDD>.xlsx. Không mở / sửa workbook gốc của dự án (T07). Trùng tên → thêm -v2, -v3.
- Sheet 1 `<PREFIX>_Viewpoint`: 9 cột đúng qc/templates/viewpoint.md.
- Sheet 2 `<PREFIX>`: 12 cột TC (TC ID · Viewpoint ID · Test Level · Main Screen · Function · Pre-condition · Steps · Expected Results · Role · OS · Priority · Status). KHÔNG xuất Automation Eligibility (chỉ dùng nội bộ repo).
- Sau 12 cột: cột kết quả theo role / platform (để trống cho tester điền; giá trị Passed / Failed / Fixed / Pending / N/A).
- Tên sheet ≤ 31 ký tự (T01). Text bắt đầu bằng "=" ghi dạng text (T05). Steps xuống dòng trong ô, wrap text, freeze hàng header.

# Quy trình
1. Kiểm 2 file LOCKED, đếm số VP / TC.
2. Tạo workbook bằng openpyxl (skill xlsx nếu có).
3. Đối chiếu: số dòng VP / TC trong Excel = số dòng trong md; mọi Viewpoint ID trong sheet TC có trong sheet Viewpoint (trừ ô trống hợp lệ).
4. Báo: đường dẫn file, bảng Sheet | Số dòng | Khớp?.

# Cấm
- Sửa file md / workbook gốc · thêm hoặc đổi thứ tự cột · điền sẵn kết quả test.
