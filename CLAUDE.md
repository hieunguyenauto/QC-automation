# QC Automation — Luật cho AI

## Bối cảnh
- Sản phẩm thị trường Nhật. UI tiếng Nhật, team làm việc bằng tiếng Việt.
- Trả lời bằng tiếng Việt. Giữ nguyên text tiếng Nhật của UI trong locator và assert.

## Thứ tự đọc khi thiết kế test (bắt buộc)
1. Spec: docs/spec/<scope-key>.md (đường dẫn người dùng đưa)
2. Knowledge: docs/glossary.md, screens/<web|mobile>/_flow.md + màn hình liên quan, qc/ của function liên quan (bản LOCKED)
3. Bài học: lessons/INDEX.md (mục Thiết kế test), docs/bug-history.md (chỉ dòng cùng function / pattern)
4. Q&A: skill spec-review → Gap Report + Context pack + Open Questions
5. Viewpoint: skill test-viewpoint (đọc Context pack, không đọc lại bước 2–3)
6. Test case: skill test-case (đọc viewpoint LOCKED + Context pack)
Khi viết / sửa code test: đọc lessons/INDEX.md (mục Web / Mobile) trước.

## Tiết kiệm token
- KHÔNG đọc GUIDE.md, docs/guide/, docs/decisions.md, CHANGELOG.md trừ khi người dùng hỏi.
- Chỉ đọc phần file liên quan (grep theo function / ID), không đọc cả thư mục.

## Luật QC chung
- Chỉ đọc spec mà người dùng đưa đường dẫn chính xác. Thiếu input → dừng, trả BLOCKED_INPUT và hỏi. Không tự đi tìm file.
- Không bịa requirement. Spec không rõ → ghi Open Question vào qc/open-questions.md.
- Draft trong chat trước, chờ duyệt nội dung + đường dẫn rồi mới ghi file. Im lặng không phải là duyệt.
- Không sửa file State = LOCKED. Cần đổi → tăng Revision, duyệt lại.
- ID: OQ-<CODE>-NNN, VP-<CODE>-NNN, TC-<CODE>-NNN. CODE = scope-code 2–12 ký tự in hoa.
- Mọi file AI ghi vào qc/test-viewpoints/, qc/test-cases/, qc/gap-reports/ phải mở đầu bằng header: Scope Key · Scope Code / Source (path + rev) / State (DRAFT | LOCKED) · Revision / Approved by / at.

## Knowledge
- Mọi thay đổi luật, skill, template, bài học, quy trình → dùng skill kb-update (sửa đúng 1 file nguồn, ghi decision + CHANGELOG, chạy scripts/build_guide.py).
- GUIDE.md là file tự sinh. Không sửa tay.
