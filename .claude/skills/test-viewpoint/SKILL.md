---
name: test-viewpoint
description: Thiết kế Test Viewpoint theo format team (VP_ID, Category, Test Level, Function, View Point, Expected Results, Site, Note), trace về spec rồi Lock. Dùng khi người dùng nói "làm viewpoint", "góc kiểm thử", "/test-viewpoint".
---
# Input
- Spec đã duyệt + Gap Report có Design Gate READY/PARTIAL (hoặc người dùng nói rõ bỏ qua review).
- lessons/INDEX.md, docs/bug-history.md (nếu có).
- references/viewpoint-groups.md, templates/viewpoint.md, templates/data-test.md, docs/glossary.md.

# Quy trình
1. Liệt kê function / màn hình trong spec. Mỗi function 1 Function code (ví dụ USRL).
2. Mỗi function quét đủ 8 nhóm trong viewpoint-groups.md; mỗi input field soi qua data-test.md.
3. Mỗi viewpoint 1 dòng: VP_ID = VP-<FUNC>-NNN; View Point theo mẫu "Verify that … in case/when …"; Note ghi mục spec hoặc OQ.
4. Kiểm: mọi acceptance criteria có ≥1 VP; VP không chứa steps hay data cụ thể.
5. Draft → duyệt → ghi qc/test-viewpoints/<scope-key>-viewpoints.md theo templates/viewpoint.md → State = LOCKED khi được duyệt.

# Cấm
- Đổi tên / thứ tự cột · viết test case ở bước này · dịch text tiếng Nhật.
- Bịa function/field/message ngoài spec → ghi [cần confirm] và tạo OQ.
