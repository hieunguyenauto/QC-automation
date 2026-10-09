# 0002 — Viewpoint và test case phải chạy được trước automation
- Ngày: 2026-10-09 · Trạng thái: Đã áp dụng
- Ảnh hưởng file: docs/guide/guide.md, .claude/skills/test-viewpoint, .claude/skills/test-case

## Bối cảnh
Automation chỉ là bước chuyển TC thành code; chưa có TC thì không có gì để automate.

## Quyết định
GĐ1 là thiết kế viewpoint/test case (chưa cần Node). Spike automation ở GĐ2 dùng TC UI-AUTO lấy từ GĐ1.

## Hệ quả
TC không automate được thì quay lại GĐ1 tạo revision, đổi Automation Eligibility.
