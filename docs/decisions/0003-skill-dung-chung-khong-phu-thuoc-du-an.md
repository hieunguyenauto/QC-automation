# 0003 — Skill dùng chung, không phụ thuộc dự án hay package ngoài
- Ngày: 2026-10-09 · Trạng thái: Đã áp dụng
- Ảnh hưởng file: .claude/skills/*, CLAUDE.md

## Bối cảnh
Thử dùng package Tanizy QC Agent nhưng không hợp với dự án khác. Repo phải dùng chung, không dính dự án cụ thể.

## Quyết định
Tự viết 3 skill spec-review → test-viewpoint → test-case. Chỉ mượn ý tưởng: SKILL.md + references/, Open Questions, Design Gate READY/PARTIAL/STOP, Automation Eligibility, duyệt trước khi ghi, LOCKED, BLOCKED_INPUT. Knowledge riêng dự án chỉ nằm ở docs/.

## Hệ quả
Sang dự án khác: copy .claude/skills/ + templates/, chỉ thay docs/.
