# Template màn hình cho automation (web, Playwright)
1 file = 1 màn hình: `<P>/automation/web/screens/<app>/<screen>.screen.ts`. Mô tả đầy đủ màn hình nằm ở `<P>/screens/catalog/` — chỉ ghi mã màn hình để tra ngược, không chép mô tả.

```ts
import { BaseScreen } from '../base.screen';

/**
 * <Tên màn hình tiếng Nhật> — catalog: <file>.md › "<mục>"
 * Role: <theo permission matrix / catalog>. Chờ: <API cần chờ trước khi assert>.
 * [cần kiểm trên app thật] <locator nào chưa xác minh>
 */
export class XxxScreen extends BaseScreen {
  readonly id = '<mã màn hình, vd CMS0050>';
  readonly path = '<route>';
  readonly roles = ['99'] as const;

  // Locator: getByRole / getByLabel / getByText (label JP) → #id / data-testid → CSS
  readonly saveButton = this.page.getByRole('button', { name: '保存' });

  async save(): Promise<void> { await this.saveButton.click(); }
}
```

Luật: locator chỉ ở file screen · không waitForTimeout · thao tác ngắn, không chứa assert.
