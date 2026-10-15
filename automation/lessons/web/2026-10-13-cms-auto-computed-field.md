# 2026-10-13 Nhập 店舗向け 単価 trước khi app tự tính xong → bị ghi đè
- Loại: TIMING
- Nguồn: @P007-TC-048 — file: web/tests/cms/phase007-regression.spec.ts (dev)
- Function / màn hình: Trouble Detail › 見積もり › form (店舗向け 単価 = input items.N.amount)
- Triệu chứng: '承認待ち' mong đợi nhưng '承認済み'; trace: 見積 'EdgeOver' chỉ ￥4,285 / 税込 ￥4,713 (không phải ￥10,450) — tưởng bug fix_amount, thực ra giá chưa vào.
- Nguyên nhân gốc: sau khi thêm hạng mục / xoá dòng mặc định, app tính lại 店舗向け 単価 (= 作業会社単価 / 0.7) bất đồng bộ; lúc đó ô còn '0'. Test fill 9500 trước → app ghi đè thành 4,285.
- Cách fix: setStoreUnitPrice(): chờ ô hết '0', fill + Tab, KIỂM ô = '9,500' và '会計 … ￥9,500'.
- Rule rút ra: R25
- Áp dụng cho: mọi ô app tự tính / tự format (tiền, tổng, ngày) mà test cần ghi đè.
