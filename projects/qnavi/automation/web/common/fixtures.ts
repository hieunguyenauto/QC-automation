import { test as base } from '@playwright/test';
import { LoginScreen } from '../screens/cms/login.screen';
import { TroubleListScreen } from '../screens/cms/trouble-list.screen';

/** Gắn sẵn các màn hình vào test. Thêm màn hình mới: import + thêm 1 dòng ở đây. */
type Screens = {
  loginScreen: LoginScreen;
  troubleList: TroubleListScreen;
};

export const test = base.extend<Screens>({
  loginScreen: async ({ page }, use) => use(new LoginScreen(page)),
  troubleList: async ({ page }, use) => use(new TroubleListScreen(page)),
});

export { expect } from '@playwright/test';
