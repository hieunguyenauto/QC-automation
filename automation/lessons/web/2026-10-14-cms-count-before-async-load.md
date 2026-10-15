# 2026-10-14 count() trong modal vừa mở = 0 vì bảng chưa tải → bỏ qua thao tác của TC
- Loại: TIMING
- Nguồn: @P007-TC-051 — file: web/tests/cms/phase007/phase007-regression.spec.ts (dev, cms-toridoll-test)
- Function / màn hình: 作業依頼編集 › modal 店舗・担当者編集 ('変更' của 作業項目（大）) — bảng tài sản
- Triệu chứng: TC fail ở Expected (không thấy '修理対象資産を選択してください。'), app hiện '作業依頼の保存が完了しました。'; video không có lần bấm '削除' nào. Bị hiểu nhầm là bug 2285-01 (test.fail), người dùng thử tay thì app đúng.
- Nguyên nhân gốc: modal hiện ngay nhưng bảng tài sản tải sau (lúc đầu chỉ có '選択してください' + spinner). Code đếm nút '削除' bằng count() — count() không chờ → 0 → vòng xoá không chạy → bấm '保存' khi tài sản vẫn còn → app lưu đúng.
- Cách fix: openItemEditModal chờ waitApisIdle; TroubleEditScreen.removeAllItemEditAssets chờ dòng tài sản đầu tiên hiện ra (trouble theo precondition có ≥1 tài sản) rồi mới đếm / xoá, xoá xong kiểm '選択してください'; locator checkbox / 削除 chuyển vào screens/. Gỡ test.fail BUG 2285-01. Chạy lại TC-050 + 051 trên dev: pass.
- Rule rút ra: R30
- Áp dụng cho: mọi vòng lặp / điều kiện dựa trên count() ngay sau khi mở màn / modal / bảng có dữ liệu tải async.
