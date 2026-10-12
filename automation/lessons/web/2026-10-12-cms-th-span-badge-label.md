# 2026-10-12 Nhãn dạng <th><div><span>nhãn</span></div><br><span class="badge">必須</span></th>
- Loại: LOCATOR
- Nguồn: browser thật (作業依頼詳細, modal 状態変更)
- Function / màn hình: CMS chi tiết trouble, 状態変更, 報告書
- Triệu chứng: tìm ô có text đúng bằng nhãn không thấy vì th chứa thêm badge 必須/任意.
- Nguyên nhân gốc: th gồm nhiều node; normalize-space(th) = 'nhãn 必須'.
- Cách fix: common/ui.ts field()/valueOf() khớp nhãn ở text node con (.//*[normalize-space(text())=nhãn]) rồi lấy ô kế tiếp.
- Rule rút ra: R06
- Áp dụng cho: mọi bảng th/td có badge 必須/任意.
