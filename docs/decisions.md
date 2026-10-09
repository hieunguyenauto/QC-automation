# Decisions — mới nhất ở trên
<!-- Mỗi quyết định 1 dòng. Chỉ người đọc khi cần biết "vì sao"; AI không đọc file này khi làm task thường. -->

| ID | Ngày | Quyết định | Lý do | File ảnh hưởng |
|---|---|---|---|---|
| D09 | 2026-10-09 | Viewpoint = 1 đối tượng × 1 khía cạnh + 1 trục biến thiên; giá trị trên trục là test case. Note ghi "Trục"; VP dự kiến < 3 TC thì gộp | Lần chạy QNAVI-1614 ra viewpoint case-by-case: skill cũ bắt "mỗi viewpoint 1 dòng" theo mẫu câu có điều kiện cụ thể, không có luật về độ thô | test-viewpoint/SKILL.md, viewpoint-groups.md, templates/viewpoint.md, test-case/SKILL.md |
| D08 | 2026-10-09 | Luồng thiết kế: đọc spec → đọc knowledge → đọc bài học → Q&A → viewpoint → test case. spec-review ghi "Context pack" để bước sau không đọc lại toàn bộ | Đúng thứ tự tư duy QA, giảm token | spec-review, test-viewpoint, test-case, CLAUDE.md |
| D07 | 2026-10-09 | Repo là nguồn knowledge duy nhất; sửa qua skill kb-update; GUIDE.md tự sinh; decisions gộp 1 file | Tránh 3 bản sao lệch nhau, giảm token | kb-update, build_guide.py, GUIDE.md, CHANGELOG.md, docs/decisions.md |
| D06 | 2026-10-09 | Thêm nhóm viewpoint 7 Performance (chỉ đặt ngưỡng khi spec có số) và 8 Bài học / bug cũ; lesson DESIGN_GAP | 6 nhóm cũ thiếu performance; bug lọt lưới không được dùng lại | viewpoint-groups.md, lesson.md, lessons/INDEX.md, docs/bug-history.md |
| D05 | 2026-10-09 | Mỗi TC chỉ 1 expected result; nhiều thứ cần kiểm → tách TC cùng VP_ID | Dễ biết chỗ fail, 1 test() = 1 assert chính | test-case/SKILL.md |
| D04 | 2026-10-09 | Template giữ đúng cột file Excel của team; No. = TC-<FUNC>-NNN; thêm cột Automation Eligibility | Export Excel không phải đổi cột | templates/viewpoint.md, testcase.md, data-test.md |
| D03 | 2026-10-09 | Tự viết skill dùng chung, chỉ mượn ý tưởng (SKILL.md + references, OQ, Design Gate, LOCKED, BLOCKED_INPUT) | Package ngoài không hợp dự án khác | .claude/skills/*, CLAUDE.md |
| D02 | 2026-10-09 | Viewpoint/test case phải chạy được trước automation | Chưa có TC thì không có gì để automate | guide, test-viewpoint, test-case |
| D01 | 2026-10-09 | 5 giai đoạn có cổng: kiến trúc → thiết kế → chạy thử → cài đầy đủ → vận hành | Lỗi khoanh trong từng khối | guide |
