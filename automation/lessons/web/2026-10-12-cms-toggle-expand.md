# 2026-10-12 Nút mở rộng kiểu bật/tắt (メニュー展開▼)
- Loại: STATE
- Nguồn: browser thật (見積一覧, dòng tr.estimation-row)
- Function / màn hình: CMS modal 見積もり
- Triệu chứng: dòng đã mở sẵn (class is-expanded) → bấm メニュー展開 làm đóng lại, nút 承認する / 取り下げ申請 biến mất.
- Nguyên nhân gốc: phần tử toggle, trạng thái phụ thuộc lần bấm trước / mặc định của app.
- Cách fix: trouble-detail.screen.ts openEstimateMenu kiểm class is-expanded trước khi bấm, rồi expect toHaveClass(/is-expanded/).
- Rule rút ra: R10
- Áp dụng cho: accordion, menu mở rộng, checkbox / toggle.
