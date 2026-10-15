import { BaseScreen } from '../base.screen';
import { waitApisIdle } from '../../common/wait';

/**
 * Login CMS — catalog: cms-frontend.md › "Login: /login" (PublicRoute, guest).
 * Đã xác minh: E2E 13/13 pass (reports/20261012-112231-dev, 20261012-112608-dev).
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

  /** Đợi API của màn login chạy xong hết (người dùng chốt: bấm ログイン sớm → app lỗi firebase / huỷ request). */
  async waitReady(): Promise<void> {
    await waitApisIdle(this.page, 'Màn login');
  }
  /** Sau khi bấm ログイン và đã rời /login: đợi API dashboard (auth/info, home, firebase…) chạy xong hết. */
  async waitAfterLogin(): Promise<void> {
    await waitApisIdle(this.page, 'Sau đăng nhập');
  }
  async login(loginId: string, password: string): Promise<void> {
    await this.waitReady();
    await this.loginId.click();
    await this.loginId.fill(loginId);
    await this.password.click();
    await this.password.fill(password);
    await this.submit.click();
  }
}
