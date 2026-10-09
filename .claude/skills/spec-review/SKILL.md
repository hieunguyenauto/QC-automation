---
name: spec-review
description: Review spec đã duyệt trong docs/spec/, tìm chỗ thiếu, mơ hồ, mâu thuẫn; ghi Open Question và kết luận Design Gate. Dùng khi người dùng nói "review spec", "tìm gap", "/spec-review".
---
# Input
- Đường dẫn spec chính xác + trạng thái duyệt / revision. Thiếu → dừng, trả BLOCKED_INPUT.

# Quy trình
1. Đề xuất scope-key (= tên file spec) và scope-code. Chờ xác nhận.
2. Liệt kê test item: chức năng, input, trigger, kết quả quan sát được, rule/data liên quan.
3. Đọc lessons/INDEX.md (mục Thiết kế test) + docs/bug-history.md: chỗ spec lặp lại pattern từng gây bug → ghi FND.
4. Mỗi item kiểm: thiếu · mơ hồ · mâu thuẫn · không kiểm chứng được. Mỗi phát hiện = FND-<CODE>-NNN.
5. Chỗ cần người quyết → OQ-<CODE>-NNN trong qc/open-questions.md (Status: OPEN).
6. Kết luận Design Gate: READY (đủ để thiết kế) · PARTIAL (ghi rõ phần bị chặn) · STOP.
7. Draft trong chat → chờ duyệt → ghi qc/gap-reports/<scope-key>-gap-report.md.

# Cấm
- Sửa spec · tự trả lời OQ · coi im lặng là đồng ý.
