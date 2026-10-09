---
name: spec-review
description: Bước Q&A trước khi thiết kế test - đọc spec, đọc knowledge, đọc bài học, rồi tìm gap, ghi Open Question, kết luận Design Gate và ghi Context pack cho bước viewpoint/test case. Dùng khi người dùng nói "review spec", "tìm gap", "Q&A spec", "/spec-review".
---
# Input
- Đường dẫn spec chính xác + trạng thái duyệt / revision. Thiếu → dừng, trả BLOCKED_INPUT.

# Quy trình (đúng thứ tự)
1. Đọc spec. Đề xuất scope-key (= tên file spec) + scope-code. Chờ xác nhận.
2. Đọc knowledge (chỉ phần liên quan, grep theo function / màn hình):
   - docs/glossary.md
   - screens/<web|mobile>/_flow.md + file màn hình liên quan
   - qc/test-viewpoints/, qc/test-cases/ bản LOCKED của function liên quan
3. Đọc bài học:
   - lessons/INDEX.md mục "Thiết kế test"
   - docs/bug-history.md: chỉ dòng cùng function / loại field / pattern
4. Q&A: liệt kê test item (chức năng, input, trigger, kết quả quan sát được, rule/data). Mỗi item kiểm: thiếu · mơ hồ · mâu thuẫn · không kiểm chứng được · lặp pattern từng gây bug → FND-<CODE>-NNN. Chỗ cần người quyết → OQ-<CODE>-NNN trong qc/open-questions.md (Status: OPEN).
5. Kết luận Design Gate: READY · PARTIAL (ghi rõ phần bị chặn) · STOP.
6. Ghi Context pack ở cuối Gap Report — tóm tắt mọi thứ bước 2–3 tìm được, mỗi dòng ≤ 1 câu, có nguồn:
   | Loại (Thuật ngữ / Màn hình / VP-TC cũ / Lesson / Bug) | Nguồn (file#mục hoặc ID) | Nội dung rút gọn |
7. Draft trong chat → chờ duyệt → ghi qc/gap-reports/<scope-key>-gap-report.md.

# Cấm
- Sửa spec · tự trả lời OQ · coi im lặng là đồng ý · đọc cả thư mục thay vì phần liên quan.
