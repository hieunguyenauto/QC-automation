---
name: kb-update-automation
description: Cập nhật knowledge của phần AUTOMATION (bài học locator / timing / data / env, mô tả màn hình cho automation, template automation, luật viết code test). Dùng khi test automation fail đã tìm ra nguyên nhân, khi đổi locator / Page Object, hoặc người dùng nói "ghi lesson automation", "cập nhật knowledge automation", "/kb-update-automation".
---
# Nguyên tắc
- Automation chỉ dựa vào test case LOCKED. Knowledge automation tách riêng knowledge QC: skill này không sửa spec, Gap Report, viewpoint, test case, qc/lessons, glossary, <P>/screens/ (nghiệp vụ).

# Bản đồ knowledge automation — mỗi loại 1 file nguồn
| Loại | File nguồn |
|---|---|
| Rule đã học (dùng chung) | automation/lessons/INDEX.md (Web R.., Mobile M..) |
| Bài học chi tiết | automation/lessons/<web\|mobile>/<YYYY-MM-DD>-<slug>.md theo manager/templates/lesson.md |
| Template automation | automation/templates/*.md |
| Màn hình cho automation (route, Page Object, element, chờ gì) | <P>/automation/screens/<screen>.md theo automation/templates/screen.md |
| Ghi chú môi trường / data / tài khoản test (không ghi mật khẩu) | <P>/automation/README.md |
| Luật viết code test | CLAUDE.md mục Automation |

# Phân loại khi có lỗi
| Loại lesson | Ai xử lý | File |
|---|---|---|
| LOCATOR · TIMING · DATA | Skill này | lesson + Page Object / <P>/automation/screens/ |
| ENV | Skill này (chỉ ghi chú, không sửa code) | <P>/automation/README.md |
| PRODUCT_BUG | KHÔNG sửa test. Soạn bug → chuyển cho kb-update (QC) ghi <P>/bug-history.md | — |
| TC sai / thiếu / mâu thuẫn với app | KHÔNG tự sửa TC. Báo người dùng → QC sửa TC (revision mới) qua test-case / kb-update | — |

# Quy trình
1. Xác định loại theo bảng trên. Không thuộc automation → dừng, chỉ ra skill đúng.
2. Draft thay đổi (trước / sau) trong chat → chờ duyệt.
3. Sửa file nguồn. Ghi lesson nếu loại LOCATOR / TIMING / DATA.
4. Lesson cùng loại lặp từ 2 lần → đề xuất 1 rule cho automation/lessons/INDEX.md.
5. Đổi luật / cách làm automation → thêm 1 dòng vào manager/decisions.md; luôn thêm 1 dòng manager/CHANGELOG.md (ghi [auto]).
6. Chạy python3 manager/scripts/build_guide.py. Báo file đã đổi + commit "[auto] <tóm tắt>".

# Cấm
- Sửa expect cho khớp app khi TC nói khác · sửa file trong <P>/qc/ · ghi mật khẩu / token vào repo · sửa manager/GUIDE.md bằng tay.
