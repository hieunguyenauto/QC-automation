---
name: kb-update
description: Cập nhật knowledge của repo (luật, skill, template, bài học, quy trình) và tự ghi tài liệu (decision, CHANGELOG, GUIDE.md). Dùng khi người dùng nói "thêm luật", "sửa skill", "cập nhật template", "ghi lại bài học", "từ giờ phải…", "/kb-update".
---
# Bản đồ knowledge — mỗi loại chỉ có 1 file nguồn
| Loại | File nguồn |
|---|---|
| Luật chung cho AI | CLAUDE.md |
| Cách làm từng bước | .claude/skills/<skill>/SKILL.md (+ references/) |
| Format output | qc/templates/*.md (thiết kế) · automation/templates/*.md (automation) · manager/templates/*.md (lesson) |
| Bài học chung | qc/lessons/design/*.md + qc/lessons/INDEX.md · automation/lessons/<web\|mobile>/*.md + automation/lessons/INDEX.md (rule chỉ đúng cho 1 dự án → projects/<project>/README.md mục Quy tắc riêng) |
| Knowledge riêng dự án | projects/<project>/: README.md, sources.md, glossary.md, bug-history.md, screens/, spec/, raw/ |
| Hướng dẫn cho người (tường thuật) | manager/handbook.md |
| Lý do của quyết định | manager/decisions.md (1 dòng / quyết định) |
| Tài liệu tổng hợp | manager/GUIDE.md — TỰ SINH, không sửa tay |

# Quy trình
0. Nguồn kích hoạt thường gặp: Gap Report chuyển [Done] (spec-review bước 10) → chỉ sửa knowledge trong projects/<project>/, không cần decision / handbook.
1. Xác định thay đổi thuộc loại nào → chọn đúng file nguồn. Không chép nội dung skill/template sang file khác.
2. Draft thay đổi (trước/sau) trong chat → chờ duyệt.
3. Sửa file nguồn.
4. Thay đổi luật hoặc cách làm → thêm 1 dòng lên đầu bảng manager/decisions.md (ID Dnn tiếp theo).
5. Thêm 1 dòng vào manager/CHANGELOG.md, mục [Unreleased], nhóm Thêm / Sửa / Bỏ, kèm ID Dnn nếu có.
6. Thay đổi ảnh hưởng quy trình đọc của người → sửa phần tường thuật trong manager/handbook.md.
7. Chạy: python3 manager/scripts/build_guide.py
8. Báo lại: danh sách file đã đổi + commit message gợi ý "[kb] <tóm tắt>".

# Release
- Người dùng nói "release": đổi [Unreleased] thành [x.y.z] - YYYY-MM-DD, tăng manager/VERSION (luật/skill thay đổi hành vi → y; sửa chữ → z), chạy lại build_guide.py.

# Cấm
- Sửa manager/GUIDE.md bằng tay · bỏ qua CHANGELOG · sửa file LOCKED trong qc/ · ghi cùng 1 nội dung ở 2 file nguồn.
