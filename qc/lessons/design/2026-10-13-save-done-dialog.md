# 2026-10-13 Lưu xong có hộp thoại hoàn tất, TC không ghi bước 'OK'
- Loại: DESIGN_GAP
- Nguồn: P007-TC-006 (projects/qnavi/qc/test-cases/phase007-regression-test-cases.md, rev 4), nhập từ CSV regression
- Function / màn hình: 作業依頼情報 › 表示条件を保存 (/admin/troubles)
- Triệu chứng: TC ghi "Press Enter 5 times in 'フィルタ名'" rồi kiểm link 'フィルタ' trên header; app hiện dialog '確認 · 検索条件の保存が完了しました。' + 'OK' che màn hình → automation bấm 'フィルタ' timeout (dev + est-test, 2026-10-13), 59 TC sau không chạy.
- Nguyên nhân gốc: file gốc bỏ bước đóng hộp thoại hoàn tất sau khi lưu (người test tay bấm OK theo phản xạ nên không ghi).
- Cách fix: thêm "→ Verify: dialog '検索条件の保存が完了しました。' → 'OK'" vào bước 4 của TC-006 (rev 4); message chưa có trong spec/messages.md → ghi [cần confirm].
- Rule rút ra: D16 — thao tác lưu xong mà app hiện hộp thoại hoàn tất: Steps phải ghi "Verify: dialog '<message>' → 'OK'" trước bước tiếp theo.
- Áp dụng cho: mọi thao tác lưu / đăng ký / xoá có hộp thông báo hoàn tất (…が完了しました。 + OK), nhất là TC nhập từ file ngoài.
