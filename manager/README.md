# Bản đồ repo
| Thư mục | Nhóm | Chứa gì | AI đọc khi nào |
|---|---|---|---|
| CLAUDE.md | Gốc | Luật chung, thứ tự đọc, dự án đang làm | Mọi phiên |
| .claude/skills/ | Skill | kb-update (QC + manager) · kb-update-automation (automation) · source-import, spec-review, test-viewpoint, test-case, export-excel (qc) · skill automation (GĐ3) | Khi skill được gọi |
| manager/ | Manager | GUIDE.md (tự sinh), handbook.md, decisions.md, CHANGELOG.md, VERSION, scripts/, templates/lesson.md | Chỉ khi người dùng hỏi / chạy kb-update |
| qc/ | QC (chung) | templates/ (spec, gap-report, viewpoint, testcase, data-test), lessons/ (Thiết kế test, Excel) | Luồng thiết kế test |
| automation/ | Automation (chung) | templates/screen.md, lessons/ (web, mobile) — sửa bằng kb-update-automation | Khi viết / sửa code test |
| projects/<p>/ | Dự án | README, sources, glossary, bug-history, spec/, raw/, screens/, qc/ (output thiết kế), automation/web, automation/mobile | Theo luồng, chỉ phần liên quan |
| reports/ | Output tạm | PDF, Excel xuất ra (gitignored) | Không |
