---
name: test-viewpoint
description: Thiết kế Test Viewpoint theo format team (VP_ID, Category, Test Level, Function, View Point, Expected Results, Site, Note). Mỗi viewpoint là 1 góc kiểm thử có trục biến thiên để sinh nhiều test case, trace về spec rồi Lock. Dùng khi người dùng nói "làm viewpoint", "góc kiểm thử", "/test-viewpoint".
---
# Input
- Spec đã duyệt + qc/gap-reports/<scope-key>-gap-report.md có Design Gate READY/PARTIAL và Context pack.
- Không đọc lại glossary / lessons / bug-history: dùng Context pack. Thiếu thông tin → hỏi, không tự đi đọc cả thư mục.
- references/viewpoint-groups.md, templates/viewpoint.md, templates/data-test.md.

# Viewpoint là gì (đọc kỹ trước khi viết)
- Viewpoint = 1 ĐỐI TƯỢNG × 1 KHÍA CẠNH cần verify, có 1 TRỤC BIẾN THIÊN. Test case = 1 giá trị trên trục đó.
- 3 loại trục: data (các dòng data-test, các giá trị input) · trạng thái (status, có/không data, role) · tổ hợp điều kiện (đúng/sai × đúng/sai).
- View Point: "Verify that <đối tượng> <khía cạnh> + in case/when <NHÓM điều kiện>". Điều kiện là một nhóm, không phải 1 giá trị.

| Sai (case-by-case) | Đúng (viewpoint) |
|---|---|
| Verify that error is shown when ユーザーID is blank | Verify that ユーザーID input is validated in case of invalid data (Note: Trục data — D01–D14) |
| Verify that error is shown when ユーザーID exceeds 20 chars | (gộp vào dòng trên) |
| Verify that 1 row is displayed when ユーザーID exists | Verify that search result matches the search condition (Note: Trục — khớp 1 / nhiều / không khớp / khớp một phần) |
| Verify that 削除 button is hidden for staff | Verify that action buttons are displayed by role (Note: Trục role — admin / staff / viewer) |

# Quy trình
1. Liệt kê function / màn hình trong spec. Mỗi function 1 Function code (ví dụ USRL).
2. Mỗi function đi qua 8 nhóm trong viewpoint-groups.md; nhóm 8 lấy từ dòng Lesson / Bug trong Context pack.
3. Trong mỗi nhóm, gom theo đối tượng (field / vùng màn hình / nút / API / rule): mỗi đối tượng × khía cạnh = 1 VP. Mỗi input field = 1 VP validation duy nhất, data-test là trục của nó.
4. Mỗi VP 1 dòng: VP_ID = VP-<FUNC>-NNN · Expected Results ở mức tổng quát (kỳ vọng chung của cả nhóm điều kiện) · Note ghi "Trục: <loại> — <các giá trị dự kiến>" + mục spec / OQ.
5. Tự kiểm trước khi đưa người duyệt — in bảng VP_ID | Trục | Số TC dự kiến:
   - VP dự kiến < 3 TC → gộp vào VP cùng đối tượng / khía cạnh (ngoại lệ: rule nghiệp vụ chỉ có 1 trường hợp, ghi lý do ở Note).
   - Hai VP chỉ khác nhau 1 giá trị điều kiện → gộp.
   - Mọi acceptance criteria có ≥1 VP; VP không chứa steps hay data cụ thể.
6. Draft → duyệt → ghi qc/test-viewpoints/<scope-key>-viewpoints.md theo templates/viewpoint.md → State = LOCKED khi được duyệt.

# Cấm
- Viết VP cho từng giá trị / từng điều kiện (đó là test case) · tách VP theo từng dòng data-test.
- Đổi tên / thứ tự cột · viết test case ở bước này · dịch text tiếng Nhật.
- Bịa function/field/message ngoài spec → ghi [cần confirm] và tạo OQ.
