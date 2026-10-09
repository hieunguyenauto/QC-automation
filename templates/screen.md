# ユーザー一覧 (user-list)
- Route: /users
- Page Object: web/pages/UserListPage.ts
- Đi tới: login → dashboard → menu ユーザー管理
- Quyền: admin, staff (staff không thấy 削除)

| Element | Ý nghĩa | Dẫn tới |
|---|---|---|
| createBtn | 新規作成 | user-create |

## Lưu ý
- Table load async → chờ API /users trước khi assert