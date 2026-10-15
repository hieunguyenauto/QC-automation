import type { Page } from '@playwright/test';
import type { CmsRole } from '../data/roles';
import { trackApis, waitApisIdle, waitForAppIdle } from '../common/wait';

/**
 * Knowledge automation: 1 file = 1 màn hình.
 * - id: mã màn hình trong projects/qnavi/screens/catalog/*.md (vd CMS0050) để tra ngược mô tả.
 * - path: route. roles: role được vào (theo catalog / permission matrix).
 * - Locator CHỈ khai báo trong file screen, không viết trong spec.
 */
export abstract class BaseScreen {
  abstract readonly id: string;
  abstract readonly path: string;
  abstract readonly roles: readonly CmsRole[];

  constructor(protected readonly page: Page) { trackApis(page); }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
    await waitApisIdle(this.page, `Mở ${this.path}`);
    await waitForAppIdle(this.page);
  }
}
