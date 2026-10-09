---
name: kb-update
description: Cập nhật knowledge của repo (luật, skill, template, bài học, quy trình) và tự ghi tài liệu (decision, CHANGELOG, GUIDE.md). Dùng khi người dùng nói "thêm luật", "sửa skill", "cập nhật template", "ghi lại bài học", "từ giờ phải…", "/kb-update".
---
# Bản đồ knowledge — mỗi loại chỉ có 1 file nguồn
| Loại | File nguồn |
|---|---|
| Luật chung cho AI | CLAUDE.md |
| Cách làm từng bước | .claude/skills/<skill>/SKILL.md (+ references/) |
| Format output | templates/*.md |
| Bài học | lessons/<design\|web\|mobile>/*.md + lessons/INDEX.md |
| Knowledge dự án | docs/spec/, docs/glossary.md, docs/bug-history.md, screens/ |
| Hướng dẫn cho người (tường thuật) | docs/guide/guide.md |
| Lý do của quyết định | docs/decisions.md (1 dòng / quyết định) |
| Tài liệu tổng hợp | GUIDE.md — TỰ SINH, không sửa tay |

# Quy trình
1. Xác định thay đổi thuộc loại nào → chọn đúng file nguồn. Không chép nội dung skill/template sang file khác.
2. Draft thay đổi (trước/sau) trong chat → chờ duyệt.
3. Sửa file nguồn.
4. Thay đổi luật hoặc cách làm → thêm 1 dòng lên đầu bảng docs/decisions.md (ID Dnn tiếp theo).
5. Thêm 1 dòng vào CHANGELOG.md, mục [Unreleased], nhóm Thêm / Sửa / Bỏ, kèm ID Dnn nếu có.
6. Thay đổi ảnh hưởng quy trình đọc của người → sửa phần tường thuật trong docs/guide/guide.md.
7. Chạy: python3 scripts/build_guide.py
8. Báo lại: danh sách file đã đổi + commit message gợi ý "[kb] <tóm tắt>".

# Release
- Người dùng nói "release": đổi [Unreleased] thành [x.y.z] - YYYY-MM-DD, tăng VERSION (luật/skill thay đổi hành vi → y; sửa chữ → z), chạy lại build_guide.py.

# Cấm
- Sửa GUIDE.md bằng tay · bỏ qua CHANGELOG · sửa file LOCKED trong qc/ · ghi cùng 1 nội dung ở 2 file nguồn.
