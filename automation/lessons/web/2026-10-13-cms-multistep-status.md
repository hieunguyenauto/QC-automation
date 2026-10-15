# 2026-10-13 稟議 nhiều bước: badge giữ '稟議承認中' giữa các bước
- Loại: TIMING (giả định sai về trạng thái)
- Nguồn: @P007-TC-053 — file: web/tests/cms/phase007/phase007-regression.spec.ts (dev)
- Function / màn hình: Trouble Detail › 見積もり (STORE00004 RINGI, 4 bước MANAGER00001 → 00004)
- Triệu chứng: sau 承認する → 決定, expect badge khác '稟議承認中' timeout; ảnh: vẫn '稟議承認中', nút 承認する hiện lại, chat có '…を完了しました'.
- Nguyên nhân gốc: mỗi bước duyệt chỉ chuyển sang người duyệt kế tiếp, trạng thái không đổi cho tới bước cuối ('承認済み').
- Cách fix: sau mỗi lần duyệt chỉ waitApisIdle; vòng sau reload + đọc trạng thái; bước cuối kiểm '承認済み' (tối đa 5 lần — P6).
- Rule rút ra: R29
- Áp dụng cho: luồng duyệt nhiều cấp / trạng thái tổng hợp nhiều bước.
