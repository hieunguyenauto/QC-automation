# 2026-10-20 Locator dựa attribute thư viện kéo thả (data-rbd-*): có ở dev, không có ở toridoll-test
- Loại: LOCATOR
- Nguồn: @P007-TC-031 — file: web/tests/cms/phase007/phase007-regression.spec.ts (toridoll-test, dò thật 2026-10-20)
- Function / màn hình: form 見積もり › bảng hạng mục (screens/cms/trouble-detail.screen.ts › estimateItemsBody)
- Triệu chứng: "locator.innerText: Timeout 15000ms" chờ tbody[data-rbd-droppable-id="dnd-create-estimates"]; app vẫn hiện đúng bảng, đúng dòng (chỉ 'AT_SelectItem', không 'Autotest').
- Nguyên nhân gốc: locator dựa attribute nội bộ của thư viện kéo thả, dò trên dev (2026-10-13); bản toridoll-test không render — 70/70 tbody trong trace không có attribute nào.
- Cách fix: estimateItemsBody = table có header '項目種別' (.last() — bảng trong cùng) › tbody cuối. Chạy thật TC-016…031 trên toridoll-test: 16/16 pass.
- Rule rút ra: R43 (sửa R21: chỉ rõ bảng bằng header riêng, không bằng thuộc tính)
- Áp dụng cho: mọi locator dùng attribute do thư viện UI sinh (data-rbd-*, id / class tự sinh, ant-*-id…), nhất là chạy nhiều môi trường (dev / toridoll-test / est-test).
