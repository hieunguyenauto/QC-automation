# 2026-10-12 Click trúng thẻ bên cạnh do ảnh tải muộn (layout shift)
- Loại: TIMING / CLICK
- Nguồn: run reports/20261012-104903-dev (projects/qnavi/automation/web), E2E-TC-002 bước 14
- Function / màn hình: CMS 作業依頼登録 › 作業項目選択 (modal chọn 故障内容 / 故障個所 / 故障症状 dạng thẻ có ảnh)
- Triệu chứng: bấm chữ 'つまり：大便器（テスト）' nhưng app nhận 'ウォシュレット不具合（テスト）'; locator đúng, kết quả sai.
- Nguyên nhân gốc: ảnh trong lưới thẻ tải sau → các thẻ dịch vị trí giữa lúc Playwright tính toạ độ và lúc click.
- Cách fix: trouble-create.screen.ts chooseCategory: chờ mọi <img> trong modal complete → target.dispatchEvent('click') (không theo toạ độ) → kiểm giá trị đã chọn, sai thì mở lại và chọn lại (≤3 lần).
- Rule rút ra: R11
- Áp dụng cho: lưới thẻ / danh sách có ảnh, dropdown tự dựng, mọi chỗ chọn xong phải kiểm lại giá trị.
