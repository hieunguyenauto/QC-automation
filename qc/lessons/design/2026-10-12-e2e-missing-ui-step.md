# 2026-10-12 TC E2E nhập từ file ngoài thiếu bước UI bắt buộc
- Loại: DESIGN_GAP
- Nguồn: E2E-TC-002 (projects/qnavi/qc/test-cases/e2e-trouble-flow-test-cases.md), chuyển từ CSV viết tay
- Function / màn hình: 作業依頼登録
- Triệu chứng: TC bắt đầu từ bước 店舗, thiếu bước chọn 新規依頼 / 継続依頼 → chạy tay hay automation đều lệch.
- Nguyên nhân gốc: file gốc ghi theo trí nhớ thao tác, bỏ bước mặc định; khi chuyển format không đối chiếu màn hình.
- Cách fix: thêm bước vào TC-002 bước 1 (rev 2).
- Rule rút ra: D14 — nhập TC E2E từ file ngoài: đối chiếu từng bước với catalog / màn hình thật, bổ sung bước bắt buộc bị bỏ.
- Áp dụng cho: mọi TC nhập từ nguồn ngoài skill test-case.
