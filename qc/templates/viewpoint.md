# Test Viewpoint — <Sheet / Function>
- Project: <project> · Scope Key: <scope-key> · Sheet prefix: <PREFIX>
- Source: projects/<project>/spec/<scope-key>.md (rev N)
- State: DRAFT · Revision: 1 · Approved by / at:

| ID | Screen | Test Level/Test Type | Function | Test Viewpoint | Expected Result | Role | Site | Note |
|---|---|---|---|---|---|---|---|---|
| WB2-01 | Create estimation | System / Function | 見積名 input | Verify that '見積名' is validated in case of invalid input | Invalid input shows the error message defined in spec and the estimation is not saved | Worker | APP | Axis: data — D01–D14 (data-test.md) · BD-APP §Create |
| WB2-02 | Create estimation | System / Function | Submit estimation | Verify that the submit button works correctly by trouble status | Submit is enabled only at status allowed by spec; other statuses disable it | Worker | APP | Axis: status — 受注 / 移動中 / 到着 · BD-CMS §State change |

<!-- Test Level/Test Type: System / UAT / Regression × Function / UI / Validation / Transition / Data / API / Security / Performance -->
<!-- ID: <PREFIX>-NN. Viết tiếng Anh, label tiếng Nhật giữ nguyên trong ''. Note bắt buộc ghi "Axis: …" + nguồn. -->
