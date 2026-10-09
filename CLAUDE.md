# QC Automation — Luật cho AI

## Bối cảnh
- Sản phẩm thị trường Nhật. UI tiếng Nhật, team làm việc bằng tiếng Việt.
- Trả lời bằng tiếng Việt. Giữ nguyên text tiếng Nhật của UI trong locator và assert.

## Thứ tự đọc (bắt buộc)
1. lessons/INDEX.md
2. docs/spec/ — nguồn duy nhất để thiết kế viewpoint/test case
3. qc/test-viewpoints/ → qc/test-cases/ (bản LOCKED)
4. screens/<web|mobile>/_flow.md + file màn hình liên quan

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
