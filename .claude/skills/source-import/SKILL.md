---
name: source-import
description: Chuyển tài liệu nguồn của khách (xlsx, csv, docx, pdf) sang Markdown để làm input thiết kế test. Gốc giữ ở <P>/raw/, bản md ở <P>/spec/. Dùng khi người dùng nói "import spec", "chuyển excel sang md", "thêm file excel vào spec", "/source-import", hoặc đưa file .xlsx làm spec.
---
# Input
- File gốc ở <P>/raw/ (người dùng đưa đường dẫn). File chưa nằm trong raw/ → đề nghị chuyển vào trước. raw/*.xlsx|pdf|csv bị .gitignore: không commit tài liệu mật của khách.
- scope-key do người dùng xác nhận.

# Quy trình
1. Liệt kê sheet / trang: tên, số dòng có dữ liệu, có ảnh / màu / comment / ô gộp / công thức không. Hỏi sheet nào cần import (mặc định: tất cả sheet có dữ liệu).
2. Mỗi sheet → 1 bảng Markdown. Header dò theo literal (T03), không hard-code hàng. Ô gộp → lặp giá trị cho từng ô (T04). Công thức → lấy giá trị đã tính; ô "=..." dạng text giữ nguyên (T05). Tiếng Nhật giữ nguyên, không dịch.
3. Ghi ra:
   - 1 file: <P>/spec/<scope-key>.md (spec chính) hoặc <P>/spec/<scope-key>/<sheet>.md khi nhiều sheet lớn.
   - Đầu mỗi file: `<!-- Nguồn: <P>/raw/<file> · Sheet: … · Import: YYYY-MM-DD · Revision gốc: … -->`
4. Đối chiếu: bảng Sheet | Số dòng gốc | Số dòng md | Khớp?. Lệch → sửa trước khi báo xong.
5. Báo phần MẤT khi chuyển (ảnh, màu ô có ý nghĩa, comment, hyperlink, data validation / dropdown) kèm vị trí ô. Màu / comment có ý nghĩa nghiệp vụ → chép thành chữ vào cột "Ghi chú import".
6. Nguồn mới → đề xuất thêm 1 dòng vào <P>/sources.md (mức ưu tiên do người dùng quyết).

# Cấm
- Sửa file gốc trong raw/ · tóm tắt / bỏ dòng · dịch tiếng Nhật · tự suy ra nội dung ảnh.
