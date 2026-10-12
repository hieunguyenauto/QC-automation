import { BaseScreen } from '../base.screen';

/**
 * Login CMS — catalog: cms-frontend.md › "Login: /login" (PublicRoute, guest).
 * [cần kiểm trên app thật] name của 2 input: lấy bằng Pick locator rồi sửa ở đây.
 */
export class LoginScreen extends BaseScreen {
  readonly id = 'CMS-LOGIN';
  readonly path = '/login';
  readonly roles = [] as const;

  readonly loginId = this.page.locator('input[name="loginId"]');
  readonly password = this.page.locator('input[name="password"]');
  readonly submit = this.page.getByRole('button', { name: 'ログイン', exact: true });
  readonly microsoftButton = this.page.getByRole('button', { name: /Sign in with Microsoft/ });
  readonly formError = this.page.locator('.invalid-feedback, .alert-danger');

  async login(loginId: string, password: string): Promise<void> {
    await this.loginId.click();
    await this.loginId.fill(loginId);
    await this.password.click();
    await this.password.fill(password);
    await this.submit.click();
  }
}
