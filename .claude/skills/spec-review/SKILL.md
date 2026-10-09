---
name: spec-review
description: Bước Q&A trước khi thiết kế test - đọc spec, đọc knowledge, đọc bài học, rồi tìm gap, ghi Open Question, kết luận Design Gate và ghi Context pack cho bước viewpoint/test case. Dùng khi người dùng nói "review spec", "tìm gap", "Q&A spec", "/spec-review".
---
# Input
- <P> = projects/<project> (CLAUDE.md). Đường dẫn spec chính xác <P>/spec/<scope-key>.md + trạng thái duyệt / revision. Thiếu → dừng, trả BLOCKED_INPUT. Spec chỉ có dạng xlsx / pdf → chạy skill source-import trước.

# Quy trình (đúng thứ tự)
1. Đọc spec. Đề xuất scope-key (= tên file spec), sheet prefix, code cho OQ. Chờ xác nhận.
2. Đọc knowledge (chỉ phần liên quan, grep theo function / màn hình):
   - <P>/README.md, <P>/sources.md (nguồn nào authoritative)
   - <P>/glossary.md, <P>/screens/_flow.md + màn hình liên quan (permission matrix, state transition)
   - <P>/qc/test-viewpoints/, test-cases/ bản LOCKED của function liên quan
3. Đọc bài học: qc/lessons/INDEX.md mục "Thiết kế test"; <P>/bug-history.md chỉ dòng cùng function / loại field / pattern.
4. Kiểm scope: role nào thuộc ticket, ticket thuộc release phase nào, có ticket cha / con không (qc/lessons D11).
5. Q&A: liệt kê test item (chức năng, input, trigger, kết quả quan sát được, rule/data). Mỗi item kiểm: thiếu · mơ hồ · mâu thuẫn giữa các nguồn · không kiểm chứng được · lặp pattern từng gây bug → FND-<CODE>-NNN. Mâu thuẫn → ghi nguồn nào thắng theo sources.md. Chỗ cần người quyết → OQ-<CODE>-NNN trong <P>/qc/open-questions.md (Status: OPEN).
6. Kết luận Design Gate: READY · PARTIAL (ghi rõ phần bị chặn) · STOP.
7. Ghi Context pack ở cuối Gap Report (ngày + revision của qc/lessons/INDEX.md), mỗi dòng ≤ 1 câu, có nguồn:
   | Loại (Thuật ngữ / Màn hình / Permission / VP-TC cũ / Lesson / Bug / Scope) | Nguồn (file#mục hoặc ID) | Nội dung rút gọn |
8. Viết đúng qc/templates/gap-report.md. Draft trong chat → chờ duyệt → ghi <P>/qc/gap-reports/<scope-key>-gap-report.md (State: DRAFT); người dùng duyệt → LOCKED.
9. Chuyển [Done] khi đủ 3 điều kiện: Gap Report đã LOCKED · mọi OQ của scope trong <P>/qc/open-questions.md là ANSWERED / RESOLVED (không còn OPEN) · người dùng xác nhận "Done". Thiếu 1 điều kiện → giữ LOCKED, liệt kê OQ còn OPEN.
10. Khi [Done]: gọi kb-update để cập nhật knowledge dự án — chỉ điều đã chắc chắn (spec đã duyệt + câu trả lời OQ):
    | Loại | File đích |
    |---|---|
    | Thuật ngữ mới | <P>/glossary.md |
    | Màn hình, permission, state transition | <P>/screens/ |
    | Rule nghiệp vụ, quy ước dùng chung nhiều ticket | <P>/README.md |
    | Nguồn tài liệu mới | <P>/sources.md |
    Draft bảng trước/sau → người dùng duyệt → ghi. Xong: OQ đã đưa vào knowledge → RESOLVED; ghi danh sách file đã cập nhật vào mục 7 của Gap Report.

# Cấm
- Cập nhật knowledge dự án khi Gap Report chưa [Done] · ghi điều chỉ đúng cho 1 ticket vào knowledge chung của dự án.
- Sửa spec · tự trả lời OQ · coi im lặng là đồng ý · đọc cả thư mục thay vì phần liên quan.
