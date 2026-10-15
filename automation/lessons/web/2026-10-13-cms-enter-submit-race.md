# 2026-10-13 Enter đã gửi form, test vẫn bấm 決定 lúc nút đang disabled
- Loại: TIMING
- Nguồn: @P007-TC-028 — file: web/tests/cms/phase007/phase007-regression.spec.ts (dev)
- Function / màn hình: Trouble Detail › 見積もり › 登録 (見積名, Enter ×5)
- Triệu chứng: click '決定' timeout: "element is not enabled" rồi "detached"; app đúng (1 見積 'EnterTest' 下書き).
- Nguyên nhân gốc: Enter submit form; trong lúc gửi form còn hiện (isVisible true) nhưng 決定 disabled, sau đó form đóng. Kiểm isVisible tức thời rồi click → đua.
- Cách fix: chờ form đóng (5s); còn mở mới bấm 決定; sau đó expect form hidden 15s.
- Rule rút ra: R22
- Áp dụng cho: TC "Enter nhiều lần / double click" (D01) và mọi bước "nếu còn mở thì bấm".
