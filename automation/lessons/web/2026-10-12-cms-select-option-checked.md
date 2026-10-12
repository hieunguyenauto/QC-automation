# 2026-10-12 Kiểm giá trị dropdown bằng option:checked
- Loại: ASSERTION
- Nguồn: browser thật (modal 状態変更, select[name=newFlowStatus])
- Function / màn hình: CMS 状態変更, 編集 trouble (types.<id>)
- Triệu chứng: toContainText('受注') trên dòng luôn pass vì dòng chứa toàn bộ option.
- Nguyên nhân gốc: innerText của <select> = danh sách mọi option.
- Cách fix: trouble-detail.screen.ts expectFlow/expectStatus dùng locator('option:checked').
- Rule rút ra: R07
- Áp dụng cho: mọi <select> native.
