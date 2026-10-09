# Test case — <Sheet / Function>
- Project: <project> · Scope Key: <scope-key> · Sheet prefix: <PREFIX>
- Viewpoint: projects/<project>/qc/test-viewpoints/<scope-key>-viewpoints.md (rev N)
- State: DRAFT · Revision: 1 · Approved by / at:

| TC ID | Viewpoint ID | Test Level | Main Screen | Function | Pre-condition | Steps | Expected Results | Role | OS | Priority | Status | Automation Eligibility |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| WB2-TC-001 | WB2-02 | System | Create estimation | Submit estimation | Trouble status is '到着' | 1. Login as Worker<br>2. Open trouble detail<br>3. Tap '提出' | Estimation status changes to '承認待ち' | Worker | iOS, Android | High | | UI-AUTO |

| Cột | Quy ước |
|---|---|
| TC ID | `<PREFIX>-TC-NNN` (CR: `TC-CR<n>-NNN`, enhancement: `EH-<ticket>-TC-NNN` — theo projects/<p>/README.md) |
| Viewpoint ID | ID trong file viewpoint. TC bổ sung từ nguồn khác không map được → ĐỂ TRỐNG, không đặt ID giả |
| Steps | Đánh số `1. … 2. …`, bước 1 thường là `Login as <Role>` |
| Expected Results | 1 kết quả / TC, viết tiếng Anh, label/message tiếng Nhật giữ nguyên trong '' |
| Role / OS | Role áp dụng · Web / iOS / Android (nhiều giá trị cách nhau dấu phẩy) |
| Priority | High (luồng chính, UAT) · Medium (negative / validation chính) · Low (UI, hiếm gặp) |
| Status | Để trống khi thiết kế. Khi chạy (Excel): Passed / Failed / Fixed / Pending / N/A; `-` = role/platform không áp dụng |
| Automation Eligibility | Cột thêm cho automation, không có trong Excel gốc |
