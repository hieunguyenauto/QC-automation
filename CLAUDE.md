# QC Automation — Luật cho AI

## Bối cảnh
- Sản phẩm thị trường Nhật. UI tiếng Nhật, team làm việc bằng tiếng Việt.
- Trả lời / chat bằng tiếng Việt. Viewpoint và test case viết bằng TIẾNG ANH; label / message tiếng Nhật giữ nguyên trong '' (không dịch).
- Dự án đang làm: qnavi → <P> = projects/qnavi. Hồ sơ dự án: <P>/README.md, thứ tự ưu tiên nguồn: <P>/sources.md.
- Câu hỏi về dự án (role, màn hình, thuật ngữ, luồng, bug…): tự đọc / grep trong <P>/ (README.md, glossary.md, screens/_flow.md, screens/catalog/, bug-history.md, spec/) rồi trả lời kèm nguồn — không cần xin phép. Chỉ nói "không biết" khi đã tìm trong <P>/ mà không có.

## Thứ tự đọc khi thiết kế test (bắt buộc)
0. Spec là xlsx / pdf / docx → skill source-import (gốc ở <P>/raw/, md ở <P>/spec/)
1. Spec: <P>/spec/<scope-key>.md (đường dẫn người dùng đưa)
2. Knowledge: <P>/README.md, <P>/sources.md, <P>/glossary.md, <P>/screens/_flow.md + màn hình liên quan, <P>/qc/ của function liên quan (bản LOCKED)
3. Bài học: qc/lessons/INDEX.md (mục Thiết kế test), <P>/bug-history.md (chỉ dòng cùng function / pattern)
4. Q&A: skill spec-review → Gap Report + Context pack + Open Questions. Hết OQ OPEN + người dùng xác nhận → [Done] → kb-update ghi knowledge vào <P>/
5. Viewpoint: skill test-viewpoint (Context pack trước, rồi knowledge + bài học của đúng function / màn hình)
6. Test case: skill test-case (viewpoint LOCKED + Context pack + knowledge + bài học của đúng function)
   Message trong '' ở Expected phải tra <P>/spec/messages.md (grep đúng chữ hoặc mã); không có / khác → ghi [cần confirm], không tự đoán.
Khi đọc / ghi Excel: qc/lessons/INDEX.md mục Excel / công cụ.

## Automation (luồng riêng: Spec → Test case → Automation)
- Input duy nhất: test case LOCKED <P>/qc/test-cases/ có Automation Eligibility UI-AUTO / BOTH. Không đọc spec, Gap Report, viewpoint, qc/lessons, bug-history.
- Đọc thêm: automation/lessons/INDEX.md, <P>/automation/README.md, <P>/automation/web/README.md (quy ước TC → code), <P>/automation/web/screens/ của màn hình liên quan; mô tả màn hình tra <P>/screens/catalog/.
- TC thiếu / mâu thuẫn với app → dừng, báo người dùng; không tự sửa TC, không sửa expect cho khớp app.
- Knowledge automation cập nhật bằng skill kb-update-automation (không dùng kb-update).
- Đăng nhập trong test: CHỈ dùng <P>/automation/web/common/session.ts (loginAs(page, '02:urgent'), logout, forAccounts([...]) ). Không tự viết hàm login, không ghi loginId / mật khẩu trong spec. Tài khoản: env/<ENV>.json › accounts + .env.
- Message dùng để expect (data/<scope-key>.json › messages) phải khớp <P>/spec/messages.md; không có trong file → ghi chú nguồn (TC LOCKED / app thật) và báo người dùng.
- Màn hình mới / chưa chạy qua: BẮT BUỘC dò màn hình thật trước khi viết locator (R01) — Browser pane hoặc npm run recon / recon:e2e. Kết quả dò chỉ ghi vào thư mục tạm reports/_tmp_chk/recon*/ (ghi đè mỗi lần), không tạo thư mục reports/recon-* mới; thứ cần giữ ghi vào screens/ (locator) và automation/lessons/ (bài học). Trích nguồn ghi 'dò thật <ngày>, <môi trường>', không ghi đường dẫn reports/.
- Sinh / sửa code test: đọc automation/lessons/INDEX.md TRƯỚC; locator chỉ lấy / ghi ở screens/. Sửa xong 1 lỗi test fail → luôn đề xuất lesson (bản nháp: loại, nguyên nhân gốc, rule) cho người dùng duyệt rồi ghi vào automation/lessons/ + INDEX; lỗi do TC sai → lesson phía QC (qc/lessons).

## Skill dùng trong repo
- Thiết kế test dùng skill của repo: source-import, spec-review, test-viewpoint, test-case, export-excel (chỉ khi người dùng đồng ý); sửa knowledge: kb-update.
- KHÔNG dùng skill tài khoản qa-testcase-writing (format cũ, khác D10) trừ khi người dùng gọi đúng tên nó.
- Mỗi bước (Gap Report, viewpoint, test case) phải: draft → người dùng duyệt → LOCKED. Không bỏ bước duyệt.

## Tiết kiệm token
- Khi làm task QC: KHÔNG đọc manager/ (GUIDE.md, handbook.md, decisions.md, CHANGELOG.md). Người dùng hỏi về quyết định / lịch sử / hướng dẫn thì đọc.
- Chỉ đọc phần file liên quan (grep theo function / ID), không đọc cả thư mục.

## Luật QC chung
- Các luật dưới đây chỉ áp dụng khi đang làm task QC (thiết kế viewpoint / test case, automation). Câu hỏi khác, tra cứu, sửa repo theo yêu cầu: làm bình thường, được đọc manager/ khi người dùng hỏi.
- Khi thiết kế test: chỉ dùng spec mà người dùng đưa đường dẫn chính xác làm input. Thiếu → dừng, trả BLOCKED_INPUT. (Luật này KHÔNG áp dụng cho câu hỏi tra cứu.)
- Không bịa requirement. Spec không rõ → ghi Open Question vào <P>/qc/open-questions.md.
- Draft trong chat trước, chờ duyệt nội dung + đường dẫn rồi mới ghi file. Im lặng không phải là duyệt.
- Không sửa file State = LOCKED. Cần đổi → tăng Revision, duyệt lại.
- ID: OQ-<CODE>-NNN · viewpoint <PREFIX>-NN · test case <PREFIX>-TC-NNN (PREFIX = sheet prefix; quy ước riêng dự án ở <P>/README.md).
- Nguồn mâu thuẫn → theo thứ tự ưu tiên trong <P>/sources.md; permission matrix của nguồn authoritative override mọi suy luận từ UI.
- Mỗi lần chỉ làm đúng 1 sheet / function được chỉ định; không tự mở rộng scope. Chỉ tạo viewpoint mới khi được yêu cầu.
- Deliverable cho người review: xuất file mới, không sửa file gốc.
- Mọi file AI ghi vào <P>/qc/test-viewpoints/, test-cases/, gap-reports/ phải mở đầu bằng header: Project · Scope Key · Sheet prefix / Source (path + rev) / State (DRAFT | LOCKED) · Revision / Approved by / at.

## Knowledge
- Mọi thay đổi luật, skill, template, bài học, quy trình → dùng skill kb-update (sửa đúng 1 file nguồn, ghi decision + CHANGELOG, chạy manager/scripts/build_guide.py).
- manager/GUIDE.md là file tự sinh. Không sửa tay.
