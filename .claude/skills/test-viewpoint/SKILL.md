---
name: test-viewpoint
description: Thiết kế Test Viewpoint theo format sheet Viewpoint (ID, Screen, Test Level/Test Type, Function, Test Viewpoint, Expected Result, Role, Site, Note). Mỗi viewpoint là 1 góc kiểm thử có trục biến thiên để sinh nhiều test case, trace về spec rồi Lock. Dùng khi người dùng nói "làm viewpoint", "góc kiểm thử", "/test-viewpoint".
---
# Input
- <P>/spec/<scope-key>.md đã duyệt + <P>/qc/gap-reports/<scope-key>-gap-report.md có Design Gate READY/PARTIAL và Context pack.
- Không đọc lại glossary / lessons / bug-history: dùng Context pack. Thiếu thông tin → hỏi, không tự đi đọc cả thư mục.
- references/viewpoint-groups.md, qc/templates/viewpoint.md, qc/templates/data-test.md.

# Viewpoint là gì (đọc kỹ trước khi viết)
- Viewpoint = 1 ĐỐI TƯỢNG × 1 KHÍA CẠNH cần verify, có 1 TRỤC BIẾN THIÊN (axis). Test case = 1 giá trị trên trục đó.
- 3 loại trục: data (các dòng data-test, các giá trị input) · trạng thái (status, có/không data, role) · tổ hợp điều kiện.
- Test Viewpoint (tiếng Anh): "Verify that <object> <aspect> in case/when <GROUP of conditions>". Điều kiện là một nhóm, không phải 1 giá trị.

| Sai (case-by-case) | Đúng (viewpoint) |
|---|---|
| Verify that error is shown when '見積名' is blank | Verify that '見積名' is validated in case of invalid input (Note: Axis: data — D01–D14) |
| Verify that error is shown when '見積名' exceeds 30 chars | (gộp vào dòng trên) |
| Verify that Submit is enabled at '到着' | Verify that the submit button works correctly by trouble status (Note: Axis: status — 受注 / 移動中 / 到着) |
| Verify that Approve button is hidden for Worker | Verify that action buttons are displayed by role and status (Note: Axis: permission matrix — role × status) |

# Quy trình
1. Liệt kê screen / function trong spec, đúng sheet được chỉ định. Mỗi sheet 1 prefix (vd WB2).
2. Mỗi function đi qua 8 nhóm trong viewpoint-groups.md; nhóm 8 lấy từ dòng Lesson / Bug trong Context pack.
3. Trong mỗi nhóm, gom theo đối tượng (field / vùng màn hình / nút / API / rule): mỗi đối tượng × khía cạnh = 1 VP. Mỗi input field = 1 VP validation duy nhất, data-test là trục của nó. Nút theo role → trục là permission matrix của nguồn authoritative.
4. Mỗi VP 1 dòng: ID = <PREFIX>-NN · Expected Result ở mức tổng quát · Role, Site theo spec · Note: "Axis: <loại> — <các giá trị dự kiến>" + nguồn (mã nguồn §mục) / OQ.
5. Tự kiểm trước khi đưa người duyệt — in bảng ID | Axis | Số TC dự kiến:
   - VP dự kiến < 3 TC → gộp vào VP cùng đối tượng / khía cạnh (ngoại lệ: rule chỉ có 1 trường hợp, ghi lý do ở Note).
   - Hai VP chỉ khác nhau 1 giá trị điều kiện → gộp.
   - Mọi acceptance criteria có ≥1 VP; VP không chứa steps hay data cụ thể.
6. Draft → duyệt → ghi <P>/qc/test-viewpoints/<scope-key>-viewpoints.md theo qc/templates/viewpoint.md → State = LOCKED khi được duyệt.

# Cấm
- Viết VP cho từng giá trị / từng điều kiện (đó là test case) · tách VP theo từng dòng data-test.
- Đổi tên / thứ tự cột · viết test case ở bước này · dịch text tiếng Nhật.
- Bịa function/field/message ngoài spec → ghi [cần confirm] và tạo OQ.
