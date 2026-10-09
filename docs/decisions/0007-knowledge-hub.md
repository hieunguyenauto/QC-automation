# 0007 — Repo là nơi duy nhất chứa knowledge, tài liệu tự sinh
- Ngày: 2026-10-09 · Trạng thái: Đã áp dụng
- Ảnh hưởng file: .claude/skills/kb-update, scripts/build_guide.py, GUIDE.md, CHANGELOG.md, docs/decisions/, .githooks/pre-commit, CLAUDE.md

## Bối cảnh
Knowledge nằm ở 5 nơi (repo, Claude Docs, file trong Project, memory, lịch sử chat); 3 nơi lặp nhau và dễ lệch.

## Quyết định
Repo là nguồn duy nhất. Mọi thay đổi đi qua skill kb-update: sửa đúng 1 file nguồn → ghi decision + CHANGELOG → chạy build_guide.py sinh GUIDE.md. Pre-commit hook chặn commit khi GUIDE.md lệch. Claude Docs và file trong Project chỉ là bản đọc, đồng bộ từ GUIDE.md khi cần.

## Hệ quả
Không sửa GUIDE.md hay Claude Docs bằng tay. Khi có dự án thứ 2: tách skill + template thành plugin dùng chung.
