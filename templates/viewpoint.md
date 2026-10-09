# Test Viewpoint — <Function>
- Scope Key: <scope-key> · Function code: <FUNC>
- Source: docs/spec/<scope-key>.md (rev N)
- State: DRAFT · Revision: 1 · Approved by / at:

| VP_ID | Category | Test Level | Function | View Point | Expected Results | Site | Note |
|---|---|---|---|---|---|---|---|
| VP-USRL-001 | Function | System | ユーザー一覧 | Verify that search result matches the search condition in case of searching by ユーザーID | Chỉ hiển thị các dòng khớp điều kiện; không khớp thì hiển thị message theo spec | Common | Trục: khớp 1 / nhiều / không khớp / khớp một phần · spec §2.1 |
| VP-USRL-002 | Validation | System | ユーザー一覧 | Verify that ユーザーID input is validated in case of invalid data | Data không hợp lệ hiển thị message lỗi theo spec, không thực hiện search | Common | Trục data: D01–D14 trong data-test.md · spec §2.2 |

<!-- Category: UI / Function / Validation / Transition / Data / API / Security / Performance -->
<!-- Test Level: Unit / Integration / System / UAT / Regression -->
<!-- Site: theo sản phẩm, ví dụ Admin / User site / BE / Common -->