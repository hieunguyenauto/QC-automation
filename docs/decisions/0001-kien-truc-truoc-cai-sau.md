# 0001 — Dựng kiến trúc trước, chạy thử từng khối, rồi mới cài đầy đủ
- Ngày: 2026-10-09 · Trạng thái: Đã áp dụng
- Ảnh hưởng file: docs/guide/guide.md

## Bối cảnh
Bản hướng dẫn đầu tiên bắt cài hết công cụ rồi mới dựng repo, khi lỗi không biết lỗi ở khối nào.

## Quyết định
5 giai đoạn có cổng: Kiến trúc → Viewpoint & Test case → Chạy thử automation → Cài đặt đầy đủ → Vận hành. Chưa qua cổng thì không sang giai đoạn sau.

## Hệ quả
Lỗi được khoanh trong từng khối. Mỗi khối có bảng "Lỗi hay gặp" riêng.
