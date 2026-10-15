# 2026-10-14 Số 継続依頼 có hậu tố '_N' bị regex cắt mất
- Loại: DATA
- Nguồn: @E2E01-TC-009 — file: web/tests/cms/e2e-suite/E2E-01.spec.ts (toridoll-test)
- Function / màn hình: Trouble Detail › 番号
- Triệu chứng: Expected '223470066_2', Received '223470066' (màn đúng là trouble 継続, '番号 223470066_2', '前回番号 223470066').
- Nguyên nhân gốc: TroubleDetailScreen.number() dùng regex `\d+` → bỏ hậu tố '_2'.
- Cách fix: regex `\d+(?:_\d+)?`.
- Rule rút ra: R32 — đọc mã / số hiển thị phải khớp đủ định dạng thật (hậu tố, tiền tố) và assert so với giá trị đầy đủ.
- Áp dụng cho: 依頼番号, mã báo giá, mã tài sản, mọi ID có định dạng ghép.
