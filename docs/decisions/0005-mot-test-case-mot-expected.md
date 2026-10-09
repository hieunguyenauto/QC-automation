# 0005 — Mỗi test case chỉ 1 expected result
- Ngày: 2026-10-09 · Trạng thái: Đã áp dụng
- Ảnh hưởng file: .claude/skills/test-case/SKILL.md

## Bối cảnh
TC gộp nhiều kết quả khó xác định chỗ fail, khó automate thành 1 assert.

## Quyết định
Mỗi TC 1 Expectation result. Cần kiểm nhiều thứ → tách TC, cùng VP_ID, Test Steps giống nhau.

## Hệ quả
Số TC tăng, nhưng mỗi test() có 1 assert chính, fail là biết ngay sai ở đâu.
