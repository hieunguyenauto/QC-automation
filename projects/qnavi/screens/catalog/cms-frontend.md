# qnavi-cms-frontend: Screen Catalog

Source: `qnavi-cms-frontend/cms/frontend/src` (legacy React SPA: Webpack, Redux Toolkit + redux-saga, react-router v6 `useRoutes`, AWS Amplify/Cognito).
Generated 2026-10-02 from a read-only review of the code. All file paths below are relative to `qnavi-cms-frontend/cms/frontend/src/` unless they start with `/`.

> GitNexus note: `node .gitnexus/run.cjs query` returned only unrelated matches (BoringSSL macros from mobile pods) for router and screen concepts, because the monorepo index is dominated by native symbols. The catalog was built by reading the router files directly: `routes/WebRoute.tsx`, `routes/index.ts`, `constants/WebRoutes.ts`, `constants/PermissionRole.ts`, `components/routes/*`, and `components/partials/Sidebar.tsx`.

---

## 1. Routing and permission mechanics

| Piece | File | Behavior |
|---|---|---|
| Route table | `routes/WebRoute.tsx` → `getRouteObjects(isAuthenticate, isRole)` | 118 concrete paths plus `/` and `*` redirects |
| Route hook | `routes/index.ts` (`useAppRoutes`) | If `state.app.isMaintenance` or `isServerDie` is set (and the path is not one of the 4 app-webview paths), **every** route is replaced by `MaintenanceWebPage` or `ServerErrorWebPage` (`getMaintenanceRouteObjects`) |
| `PublicRoute` | `components/routes/PublicRoute.tsx` | If you are logged in (and not on a webview path), it redirects to `/admin/troubles` for role 05 and to `/admin` for everyone else |
| `PrivateRoute` | `components/routes/PrivateRoute.tsx` | If `state.auth.isLoggedIn` is false, it redirects to `/login` |
| `PermissionRoute` | `components/routes/PermissionRoute.tsx` | `addPermissionRoute` wraps every route that has a `screen` ID. `isScreenAccess(screenId)`: allowed when `ScreenAccess[screenId]` is missing or empty, or when it includes the user's role; otherwise it redirects to `/login`. If the route also has `accessRoles` and the role is not in it, it redirects to `/admin` |
| Screen to role map | `constants/PermissionRole.ts` (`ScreenAccess`) | See the per-screen tables. **Screen IDs missing from the map are open to every logged-in role.** Duplicate object keys mean the **last** entry wins (for example `HQS-37` resolves to `[99,98]`) |
| Root `/` | WebRoute | Redirects to `/admin/troubles` for role 05 and to `/admin` for everyone else |
| `*` | WebRoute | Redirects to `admin/not-found`, which renders `NotFound` (a 404 inside `PrivateLayout`) |

**Roles** (`RolePermission`): `01` STORE_ADMIN (chain HQ admin), `02` STORE_GENBA (store floor staff), `03` INDIVIDUAL, `04` WORKER, `05` WORKER_COMPANY, `98` SUB_ADMIN, `99` SYSTEM_ADMIN (GlobaR admin).

**Global App behaviors** (`App.tsx`):
- After login it loads master codes and the user's store (`appMasterActions.loadCodes`, `loadMyStore`), and fetches the newest notification for every role except 99.
- It polls unread messages addressed to the user every `Common.TIMEOUT.REFRESH` (10 minutes).
- It calls `authActions.checkSession()` on mount.
- On window focus or visibility change it reloads configs. If `configs.cmsFeVersion` differs from `process.env.CMS_VERSIONS`, a warning modal that cannot be closed asks the user to reload.
- Global components: `ToastContainer`, `ConfirmLeaveModal` (the unsaved-changes prompt from `useCallbackPrompt`), `AppLoader`, and `NotificationPopup`.
- On logout it clears the saved search conditions of every feature slice.

**Disabled or unrouted** (commented out in `WebRoute.tsx`): Messages (`/admin/messages*`, ticket HQT-524) and Bulk Update (`/admin/bulk-update*`, hidden for Sub Admin). `WebRoutes.UI` (`/admin/ui`) and `AUTH.FIND_RESET_PASSWORD_` are defined as constants but have no route.

## 2. Master route table

| # | Path | Component | Screen ID | Route-level roles |
|---|---|---|---|---|
| | **Public (PublicLayout)** | | | |
| 1 | `/login` | LoginPage | – | guests |
| 2 | `term-of-service` | AppTermOfUsePage | – | guests (app use) |
| 3 | `/forgot-password` | ResetPasswordIndividualPage | – | guests |
| 4 | `/reset-password` | RegisterNewPasswordPage | – | guests |
| | **Public, no layout (mobile app webviews)** | | | |
| 5 | `/maintenance-store` | MaintenanceStoreAppPage | – | any |
| 6 | `/maintenance-worker` | MaintenanceWorkerAppPage | – | any |
| 7 | `/server-error-store` | ServerErrorStoreAppPage | – | any |
| 8 | `/server-error-worker` | ServerErrorWorkerAppPage | – | any |
| | **Private (PrivateLayout)** | | | |
| 9 | `/admin` | DashboardPage | – | all |
| 10 | `admin/profile/change-password` | ChangePassword | – | all |
| 11 | `/admin/term-of-service` | TermOfServicePage | – | all |
| 12 | `admin/privacy-policy` | PrivacyPolicyPage | – | all |
| 13 | `/admin/individuals` | IndividualListPage | CMS0080 | 99 |
| 14 | `/admin/individuals/:id/detail` | IndividualDetailPage | CMS0081 | 99 |
| 15 | `/admin/individuals/:businessId/store/:id/detail` | IndividualStoreDetailPage | CMS0082 | 99 |
| 16 | `/admin/chain-systems` | ChainSystemListPage | CMS0050 | 99 |
| 17 | `/admin/chain-systems/create` | ChainSystemCreateOrUpdatePage | CMS0051 | 99 |
| 18 | `/admin/chain-systems/:id/edit` | ChainSystemCreateOrUpdatePage | CMS0053 | 99, 01 |
| 19 | `/admin/chain-systems/:id/stores` | ChainSystemDetailPage (store) | CMS0050A | all (not in map) |
| 20 | `/admin/chain-systems/:id/stores/create` | ChainSystemStoreCreateOrUpdatePage | CMS0054 | 99 |
| 21 | `/admin/chain-systems/:id/stores/:storeId/detail` | ChainSystemStoreDetailPage | CMS0055 | 99 |
| 22 | `/admin/chain-systems/:id/stores/:storeId/edit` | ChainSystemStoreCreateOrUpdatePage | CMS0056 | 99 |
| 23 | `/admin/chain-systems/:id/stores/import` | ChainSystemStoreImportPage | CMS0057 | 99 |
| 24 | `/admin/chain-systems/:id/stores/import-symptoms` | ChainSystemStoreImportSymptomsPage | CMS0057A | 99 |
| 25 | `/admin/chain-system/stores` | ChainSystemDetailPage (store) | CMS0050A | 01 (accessRoles) |
| 26 | `/admin/chain-system/stores/detail` | ChainSystemStoreDetailPage | CMS0055A | 02 |
| 27 | `/admin/chain-system/stores/edit` | ChainSystemStoreCreateOrUpdatePage | CMS0056A | 02 |
| 28 | `/admin/chain-systems/:id/managers` | ChainSystemDetailPage (manager) | CMS0050B | 99, 01 |
| 29 | `/admin/chain-systems/:id/managers/create` | ChainSystemStoreManagerCreatePage | CMS0057 | 99 |
| 30 | `/admin/chain-systems/:id/managers/:managerId/detail` | ChainSystemStoreManagerDetailPage | CMS0058 | 99 |
| 31 | `/admin/chain-systems/:id/managers/:managerId/edit` | ChainSystemStoreManagerEditPage | CMS0059 | 99 |
| 32 | `/admin/chain-systems/:id/managers/import` | ChainSystemStoreManagerImportPage | CMS0057 | 99 |
| 33 | `/admin/chain-system/stores/managers` | ChainSystemDetailPage (manager) | CMS0050B | 01 (accessRoles) |
| 34 | `/admin/chain-system/stores/managers/:managerId/detail` | ChainSystemStoreManagerDetailPage | CMS0058A | 01 |
| 35 | `/admin/chain-system/stores/managers/:managerId/edit` | ChainSystemStoreManagerEditPage | CMS0059A | 01 |
| 36 | `/admin/chain-system/stores/:storeId/detail` | ChainSystemStoreDetailPage | CMS0055A_1 | 01 |
| 37 | `/admin/chain-system/stores/:storeId/edit` | ChainSystemStoreCreateOrUpdatePage | CMS0056A_1 | 01 |
| 38 | `/admin/chain-systems/:id/est-categories/create` | ChainSystemEstimationCategoryCreateOrUpdatePage | – | all |
| 39 | `/admin/chain-systems/:id/est-categories/:estCategoryId/edit` | ChainSystemEstimationCategoryCreateOrUpdatePage | – | all |
| 40 | `/admin/chain-systems/:id/est-categories/:estCategoryId/detail` | ChainSystemEstimationCategoryDetailPage | – | all |
| 41 | `/admin/chain-systems/:id/attributes` | ChainSystemAttributesListPage | CMS0060A | 99 |
| 42 | `/admin/chain-systems/:id/attributes/import` | ChainSystemAttributesImportPage | CMS0060B | 99 |
| 43 | `/admin/chain-system/stores/attributes` | ChainSystemAttributesListPage | CMS0060C | 01 |
| 44 | `/admin/chain-system/stores/attributes/import` | ChainSystemAttributesImportPage | CMS0060D | 01 |
| 45 | `/admin/agents` | AgentListPage | CMS0150 | 99 |
| 46 | `/admin/agents/create` | AgentCreatePage | CMS0153 | 99 |
| 47 | `/admin/agents/:id/detail` | AgentDetailPage | CMS0151 | 99 |
| 48 | `/admin/agents/:id/edit` | AgentEditPage | CMS0150 | 99 |
| 49 | `/admin/categories` | CategoriesListPage | CMS0120 | all (not in map) |
| 50 | `/admin/groups` | GroupListPage | CMS0040 | 01 |
| 51 | `/admin/groups/create` | GroupCreatePage | CMS0043 | 01 |
| 52 | `/admin/groups/:id/detail` | GroupDetailPage | CMS0041 | 01 |
| 53 | `/admin/groups/:id/edit` | GroupEditPage | CMS0042 | all (not in map) |
| 54 | `/admin/est-categories` | EstimationCategoryListPage | – | all |
| 55 | `/admin/est-categories/create` | EstimationCategoryCreatePage | – | all |
| 56 | `/admin/est-categories/:estCategoryId/detail` | EstimationCategoryDetailPage | – | all |
| 57 | `/admin/est-categories/:estCategoryId/edit` | EstimationCategoryEditPage | – | all |
| 58 | `/admin/workers` | WorkerListPage | CMS0170 | 99, 05 |
| 59 | `/admin/workers/create` | WorkerCreatePage | CMS0173 | 99, 05 |
| 60 | `/admin/workers/:id/edit` | WorkerEditPage | CMS0172 | all (not in map) |
| 61 | `/admin/workers/:id/detail` | WorkerDetailPage | CMS0171 | 99, 05 |
| 62 | `/admin/workers/import` | WorkerImportPage | CMS0174 | 99, 05 |
| 63 | `/admin/worker-company` | WorkerCompanyListPage | HQS-50 | 99 |
| 64 | `/admin/worker-company/create` | WorkerCompanyCreatePage | HQS-38 | 99 |
| 65 | `/admin/worker-company/edit` | WorkerCompanyEditPage | HQS-53 | 99, 05 |
| 66 | `/admin/worker-company/detail` | WorkerCompanyDetailPage | HQS-53 | 99, 05 |
| 67 | `/admin/worker-company/import` | WorkerCompanyImportPage | HQS-61 | 99 |
| 68 | `/admin/worker-company/:id/edit` | WorkerCompanyEditPage | HQS-53 | 99, 05 |
| 69 | `/admin/worker-company/:id/detail` | WorkerCompanyDetailPage | HQS-53 | 99, 05 |
| 70 | `/admin/troubles` | TroubleListPage | – | all |
| 71 | `/admin/trouble/create` | TroubleCreatePage | – | all |
| 72 | `/admin/troubles/create` | TroubleCreatePage | – | all |
| 73 | `/admin/troubles/:id/detail` | TroubleDetailPage | – | all |
| 74 | `/admin/troubles/:id/edit` | TroubleEditPage | – | all |
| 75 | `/admin/troubles/import-payment` | ImportMonthPaymentPage | CMS0031 | 98 |
| 76 | `/admin/troubles/import-billing` | ImportBillingStatusPage | CMS0032 | 01 |
| 77 | `/admin/troubles/import-trouble-complete-status` | ImportTroubleCompleteStatusPage | CMS0033 | 01, 02 |
| 78 | `/admin/settings` | SystemSettingsPage | CMS0903 | 99 |
| 79 | `/admin/chats` | ChatListPage | – | all |
| 80 | `/admin/tasks` | TaskListPage | – | all |
| 81 | `/admin/questions` | QuestionListPage | CMS0200 | 99 |
| 82 | `/admin/store/questions` | QuestionChainStoreListPage | CMS0200_1 | 01, 02 |
| 83 | `/admin/individual/questions` | QuestionIndividualListPage | CMS0200_2 | 03 |
| 84 | `/admin/manager/questions` | QuestionManagerListPage | CMS0200_1 | 01, 02 |
| 85 | `/admin/questions/detail` | QuestionDetailPage (isMaster) | CMS0200_4 | all (not in map) |
| 86 | `/admin/questions/:id/detail` | QuestionDetailPage | CMS0200_5 | 99 |
| 87 | `/admin/accounts/globar` | AccountListPage | CMS0906 | 99 |
| 88 | `/admin/asset-management/chains` | AssetManagementChainSystemListPage | CMS01709 | all (not in map) |
| 89 | `/admin/asset-management/chains/:chainSystemId` | AssetManagementListPage | CMS01709 | all |
| 90 | `/admin/asset-management` | AssetManagementListPage | CMS01709 | all |
| 91 | `/admin/asset-management/create` | AssetManagementCreatePage | CMS01739 | all |
| 92 | `/admin/asset-management/:chainSystemId/create` | AssetManagementCreatePage | CMS01739 | all |
| 93 | `/admin/asset-management/:id/edit` | AssetManagementEditPage | CMS01729 | all |
| 94 | `/admin/asset-management/:id/detail` | AssetManagementDetailPage | CMS01739 | all |
| 95 | `/admin/asset-management/import` | AssetManagementImportAssetsPage | CMS01749 | all |
| 96 | `/admin/asset-management/chains/:chainSystemId/import` | AssetManagementImportAssetsPage | CMS01749 | all |
| 97 | `/admin/asset-column` | AssetColumnListPage | CMS01719 | all (not in map) |
| 98 | `/admin/asset-column/:id/detail` | AssetColumnDetailPage | CMS01729 | all |
| 99 | `/admin/asset-column/:id/edit` | AssetColumnEditPage | CMS01719 | all |
| 100 | `admin/not-found` | NotFound | – | all |
| 101 | `/admin/sub-admin-information` | SubAdminInformationListPage | HQS-37 | 99, 98 |
| 102 | `/admin/sub-admin-information/create` | SubAdminInformationCreatePage | HQS-46 | 99 |
| 103 | `/admin/sub-admin-information/edit` | SubAdminInformationEditPage | HQS-48 | 99, 98 |
| 104 | `/admin/sub-admin-information/detail` | SubAdminInformationDetailPage | HQS-48 | 99, 98 |
| 105 | `/admin/sub-admin-information/import` | SubAdminInformationImportPage | HQS-56 | 99 |
| 106 | `/admin/sub-admin-information/:id/edit` | SubAdminInformationEditPage | HQS-48 | 99, 98 |
| 107 | `/admin/sub-admin-information/:id/detail` | SubAdminInformationDetailPage | HQS-48 | 99, 98 |
| 108 | `/admin/sub-admin-information/:id/import-symptom` | SubAdminInformationImportSymptomPage | HQS-66 | 99 (accessRoles) |
| 109 | `/admin/sub-admin-information/:userId/presets` | SubAdminPresetCreateOrUpdatePage | CMS1388_1 | 99 |
| 110 | `/admin/sub-admin-information/:userId/presets/:presetId` | SubAdminPresetCreateOrUpdatePage | CMS1388_1 | 99 |
| 111 | `/admin/sub-admin-information/:userId/presets/:presetId/detail` | SubAdminPresetDetailPage | CMS1388_2 | 99, 98 |
| 112 | `.../presets/:presetId/import-store` | SubAdminPresetImportStorePage | CMS1388_3 | 99 |
| 113 | `.../presets/:presetId/import-symptom` | SubAdminPresetImportSymptomPage | CMS1388_4 | all (not in map) |
| 114 | `/admin/notifications` | NotificationListPage | – | all |
| 115 | `/admin/notifications/create` | NotificationCreatePage | CMS0114_1 | 99 |
| 116 | `/admin/notifications/:id` | NotificationDetailPage | CMS0114_3 | 99 |
| 117 | `/admin/notifications/:id/edit` | NotificationEditPage | CMS0114_2 | 99 |
| – | `/` | redirect | – | `/admin/troubles` for 05, `/admin` for others |
| – | `*` | redirect | – | `admin/not-found` |
| – | (maintenance mode, all paths) | MaintenanceWebPage / ServerErrorWebPage | – | any |

Distinct page components: about 85, behind 117 routed paths (several components serve more than one route or role variant), plus 2 maintenance-mode pages and 7 disabled pages (Messages x4, Bulk Update x3).

### Permission gaps worth noting (route level)
- These screen IDs are **not in `ScreenAccess`**, so any logged-in role can open them by URL: CMS0050A (chain store list under `/admin/chain-systems/:id/stores`), CMS0042 (group edit), CMS0120 (categories), CMS0172 (worker edit), CMS0200_4 (master question detail), CMS1388_4 (preset symptom import), all asset IDs (CMS01709/01719/01729/01739/01749), and every route with no screen ID at all (troubles, est-categories, chain est-category, chats, tasks, notifications list). The sidebar and in-component checks are the only remaining guards on these, and the backend has to enforce access.
- `ASSET_MANAGEMENT.DETAIL` uses `ASSET_MANAGEMENT_CREATE` (CMS01739), and `AGENT.EDIT` uses `AGENT_LIST` (CMS0150). This looks like a copy-paste error, but it has no practical effect.
- `PermissionRoute` sends a user who fails `isScreenAccess` to `/login`, not to a 403 page. Because `PublicRoute` then redirects a logged-in user back to `/admin`, the user effectively lands on the dashboard.

### Sidebar menu by role (`components/partials/Sidebar.tsx` MENU)
| Menu item | Target | Roles shown |
|---|---|---|
| Dashboard | `/admin` | 01, 02, 03, 04, 99, 98 |
| SOS request info | `/admin/troubles` | 99, 98, 05 |
| SOS request register | `/admin/trouble/create` | 99, 98, 01, 02 |
| Troubles | `/admin/troubles` | 01, 02, 03 |
| Individuals | `/admin/individuals` | 99 |
| Chain systems | `/admin/chain-systems` | screen CMS0050, so 99 |
| Categories | `/admin/categories` | 99 |
| Agents | `/admin/agents` | screen CMS0150, so 99 |
| Groups | `/admin/groups` | screen CMS0040, so 01 |
| Chain systems (own) | `/admin/chain-system/stores` | 01 |
| Store detail | `/admin/chain-system/stores/detail` | 02 |
| Notifications | `/admin/notifications` | 99; also 01, 02, 03 |
| Chats | `/admin/chats` | all |
| Task management | `/admin/tasks` | all |
| Estimation categories | `/admin/est-categories` | screen CMS0160, so 99 (the route itself has no guard) |
| Sub admin information | list for 99; `/detail` for 98 | 99 / 98 |
| Workers | `/admin/workers` | 99, 05 |
| Worker company | list for 99; `/detail` for 05 | 99 / 05 |
| Questions | `/admin/questions` (99), `/admin/store/questions` (01, 02), `/admin/individual/questions` (03) | per role |
| Asset column | list for 99; `/admin/asset-column/{myStore.chainSystem.id}/detail` for 01 (hidden when the chain's `assetFlag` is off) | 99 / 01 |
| Asset management | 99 is sent to `/admin/asset-management/chains`; 01 and 02 go to `/admin/asset-management`, which is hidden unless `myStore.chainSystem.assetFlag` is on | 01, 02, 99 |
| Config (system settings) | `/admin/settings` | 99 |
| GlobaR accounts | `/admin/accounts/globar` | 99 |

---
## Contents
- Module: Auth, Static, App, Profile, Dashboard, Settings, Accounts, Global Layout
- Module: Troubles (core workflow)
- Module: Chain System, Chain Stores, Store Managers, Attributes, Individual, Group, Agent
- Module: Asset Management, Asset Column, Categories, Estimation Categories
- Module: Sub Admin Information, Presets, Worker Company, Workers
- Module: Chat, Tasks, Notifications, Questions (plus disabled and non-routed modules)
- Cross-module findings

---

## Module: Auth, Static, App, Profile, Dashboard, Settings, Accounts, Global Layout

### Cross-cutting: the axios client (`api/axiosClient.ts`)
- **Headers on every request:** `Authorization: Bearer <localStorage TOKEN>` (the Cognito access token), `alias-key-name` (from `ADMIN_INFO.aliasKeyName`), `locale`. The timeout is 180 s.
- **401:** calls `AuthService.getIdTokenOfCurrentUser()` (Amplify `fetchAuthSession`) to refresh the token, then retries once. If that fails, it calls `showLogoutNotification()`, which opens a NotificationPopup ("ログアウト", CMSG00006 "すべてのタブセッションがサインアウトされました。"). Closing the popup reloads the page.
- **503:** sets `isMaintenance` if `data.isMaintenance` is true, otherwise sets `isServerDie`.
- **502:** sets `isServerDie`.
- **504, timeout, or network error:** all treated as 504.
- **Cross-tab logout:** a successful `auth/signout` writes `localStorage.USER_SIGNED_OUT`. A `storage` event listener in the other tabs then shows the logout notification.
- **Amplify config** (`constants/AwsConfig.ts`): Cognito user pool and client ID; OAuth with domain `COGNITO_APP_DOMAIN`, scopes phone/email/profile/openid/aws.cognito.signin.user.admin, `responseType: code`, and redirect to `COGNITO_APP_DOMAIN_REDIRECT`.
- **Calls made when logged in** (from `App.tsx`):
  - GET `codes`
  - GET `/asset/my-store` (loads `myStore`)
  - GET `notifications/store-newest` (all roles except 99)
  - GET `/chat/mentions/has-unread` (every 10 minutes)
  - GET `/configs` (on focus; used for the version check)
  - POST `{BE_CHAT_API_URL}/v2/firebase-auth/exchange`, then `signInWithCustomToken` (`useFirebaseAuth`)
- **Env banner:** shown when `ENV_TEXT` and `CMS_VERSIONS` are set. It is a red bar reading `"<ENV_TEXT> (<CMS_VERSIONS>)"`.

### Public screens (PublicRoute + PublicLayout)
`PublicLayout` (`components/templates/PublicLayout.tsx`) sets the body class `bg-qnavi` and renders `<section class="container-fluid"><Outlet/></section>`. It has no header, sidebar, or footer.

#### Login: `/login`
- **Component:** `LoginPage` (internally `Login`), file `features/auth/pages/LoginPage.tsx`.
- **Purpose:** Sign in with a CMS login ID and password, or with Microsoft through the Cognito hosted UI.
- **Guard:** PublicRoute. Users who are already logged in are redirected away.
- **UI:**
  - Logo and the title "QナビORDER".
  - A card titled "ログイン":
    - Form-level error message (for 422 responses).
    - `loginId` (required, trimmed).
    - `password` (required).
    - Submit button "ログイン".
  - A **"Sign in with Microsoft"** button.
  - The text "ログインID・パスワードを忘れた方はこちら", followed by two links:
    - "チェーン店として登録の方はこちら" opens `https://www.globar.co.jp/contact/qnavi-ask/` in a new tab.
    - "個人店舗として登録の方はこちら" goes to `/forgot-password`.
  - App Store and Google Play badges.
- **Password flow** (`authSaga.watchLoginFlow` → `handleLogin` → `AuthService.login`):
  1. Calls Amplify `signIn({username, password})`, then `fetchAuthSession()`.
  2. If Cognito returns `UserNotFoundException` or `NotAuthorizedException`, it calls **POST `auth/validate`** `{loginId, password}`. This is the backend's legacy check and lazy migration into Cognito. On success it retries `signIn`.
  3. Calls **GET `auth/info`**, which returns the user (role, chainSystemId, chainStoreId, name, aliasKeyName, and so on).
  4. Stores `ADMIN_INFO` and `TOKEN` (the accessToken) in localStorage, then dispatches `loginSuccess`.
  5. On any error it runs `handleLogout` and dispatches `authActions.error`.
  - At startup, if `TOKEN` and `ADMIN_INFO` are already in localStorage, it goes straight to `loginSuccess`.
- **Microsoft (social) login:**
  1. `authActions.loginMicrosoft` calls `signInWithRedirect({provider:{custom: COGNITO_APP_PROVIDER_NAME}, customState:'prompt=select_account'})`, which uses the Cognito federated IdP (Azure AD).
  2. When the redirect returns, `Hub.listen('auth')` catches `signInWithRedirect` and dispatches `checkSession`.
  3. `checkSession` calls `fetchAuthSession`, then **GET `auth/info`**, then dispatches `loginSuccess`. A 4xx error logs the user out.
  - **There is no Google login button in this SPA.**
- **Unused:** `authApi.login` (POST `/auth/signin`) and `refreshToken` (POST `auth/refresh_token`).
- **Logout chain** (shared by every screen):
  1. **POST `auth/signout`**
  2. Amplify `signOut()` and clear the Cognito identity
  3. Firebase `signOut()` and `clearFirebaseTokens()`
  4. Clear localStorage and sessionStorage
  5. Dispatch `logoutSuccess`
- **Permission:** `authActions.loadPermission` calls GET `users/permission`.

#### App Terms of Use: `term-of-service`
- **Component:** `AppTermOfUsePage`, file `features/app/pages/TermOfUsePage.tsx`.
- **Purpose:** The static, hard-coded Japanese terms "QナビORDER 利用規約", shown to the mobile apps.
- **Guard:** It sits under PublicRoute, so users who are logged in are redirected away.
- **API:** none.

#### Forgot Password: `/forgot-password`
- **Component:** `ResetPasswordIndividualPage`, file `features/auth/pages/ResetPasswordIndividualPage.tsx`.
- **Purpose:** An individual store (role 03) requests a password re-registration.
- **Fields:** `storeName`, `phone` (`appPhoneNumber`), `email`. All are required.
- **Action:**
  1. Button "パスワードの再登録を依頼する" opens a confirm (AMSG00056).
  2. **POST `auth/reset-password`** `{storeName, phone, email}`.
  3. A success message, then navigation to `/login`.
  - Errors are mapped onto the matching fields.

#### Register New Password: `/reset-password?token=…`
- **Component:** `RegisterNewPasswordPage`, file `features/auth/pages/RegisterNewPasswordPage.tsx`.
- **On mount:** **POST `auth/find-reset-password`** `{token}`. This fills the read-only `loginId`. On error the user is sent to `/login`.
- **Fields:** `loginId` (read-only), `newPassword` (`appPassword` rule, max 256), `confirmPassword` (must match).
- **Save:**
  1. Confirm (AMSG00056).
  2. **POST `auth/update-new-password`** `{loginId, newPassword, confirmPassword, token}`.
  3. A success modal with the button "ログインに戻る", which goes to `/login`.
- Includes a leave prompt.

#### Mobile app webview pages (no layout; exempt from the redirect and from the maintenance override)
| Path | Component | Renders |
|---|---|---|
| `/maintenance-store` | MaintenanceStoreAppPage | `MaintenanceStoreApp type='maintenance'` |
| `/maintenance-worker` | MaintenanceWorkerAppPage | `MaintenanceWorkerApp type='maintenance'` |
| `/server-error-store` | ServerErrorStoreAppPage | `MaintenanceStoreApp type='server'` |
| `/server-error-worker` | ServerErrorWorkerAppPage | `MaintenanceWorkerApp type='server'` |

- **Files:** `features/static/pages/*` and `features/static/components/MaintenanceStoreApp.tsx` / `MaintenanceWorkerApp.tsx`.
- **Look:**
  - The store app version has a blue overlay with the shop logo.
  - The worker app version has a green overlay with the worker logo.
- **Content:**
  - A maintenance or server-error title and message.
  - Contact block: 株式会社グローバー, tel 090-1393-5799 and 090-1393-1573.
  - A link to the Notion support portal.
  - The text "restart the app".
- **API:** none.

#### Maintenance-mode web pages (they replace every route)
- **Components:** `MaintenanceWebPage` and `ServerErrorWebPage`, both rendering `features/static/components/MaintenanceWeb.tsx`.
- **Content:** logo, message, contacts, and a button "ページを再読み込みする" that calls `location.reload()`.
- **Trigger:** HTTP 503 or 502 (see the axios section above).

### Private screens

#### Dashboard: `/admin`
- **Component:** `DashboardPage`, file `features/dashboard/pages/DashboardPage.tsx`.
- **Guard:** login only. The sidebar item "ホーム" is shown to 01, 02, 03, 04, 98 and 99.
- **Widgets by role:**
  - **99 SYSTEM_ADMIN:** `DashBoardSystem` (`features/dashboard/components/DashboardSystem.tsx`), using **GET `/home`**.
    - A "全体" row of 8 info boxes: 作業依頼, 個人事業主, チェーンシステム, メッセージ配信, 価格項目, 代理店, 見積用作業項目, 作業員.
    - Three doughnut charts:
      - 状態率: inquiring / working / done
      - 緊急率: urgent rate
      - 継続トラブル率: continuation rate
    - A "本日" row of 3 small boxes (問い合わせ中, 対応中, 対応済). Each links to `/admin/troubles`.
  - **03 INDIVIDUAL:** `DashBoardOther` (`DashboardOther.tsx`), using **GET `/home/store`**.
    - The same 3 status boxes, each linking to `/admin/troubles`.
    - A "依頼登録" (+) box that links to `/admin/trouble/create`.
    - The component also contains store-admin chart code, but it is hidden behind a flag that is always false, so it never runs.
  - **01, 02, 04, 05, 98:** `DashboardQuickSight` (`DashboardQuickSight.tsx`), an embedded AWS QuickSight dashboard:
    1. Gets the Cognito idToken.
    2. Exchanges it for `AWS.CognitoIdentityCredentials` (`COGNITO_IDENTITY_POOL_ID`).
    3. Calls **GET `/get-embed-link?dashboardId=<DASHBOARD_ID>&awsAccountId=<AWS_ACCOUNT_ID>`**.
    4. Shows the returned `embedUrl` in an `<iframe>`.

#### Change Password: `admin/profile/change-password`
- **Component:** `ChangePassword`, file `features/profile/pages/ChangePassword.tsx`.
- **Guard:** login only. It is reached from the Header link "パスワード変更".
- **Fields:** `currentPassword`, `newPassword` (`appPassword` rule, max 256), `verifyPassword` (must match, AMSG00047).
- **Save:**
  1. Confirm (AMSG00056).
  2. **POST `/users/password`**. This goes to the backend, not to Amplify `updatePassword`.
  3. On success, the user is **logged out**.
- Includes a leave prompt.

#### Terms of Service (private): `/admin/term-of-service`
- **Component:** `TermOfServicePage`, file `features/static/pages/TermOfServicePage.tsx`.
- **Content:** the same static terms, shown inside the private layout.
- **API:** none.
- **Note:** the Footer's terms link points to `process.env.TERMS_OF_SERVICE_URL`, not to this page.

#### Privacy Policy: `admin/privacy-policy`
- **Component:** `PrivacyPolicyPage`, file `features/static/pages/PrivacyPolicyPage.tsx`.
- **Content:** static sections (はじめに / 個人情報の定義 / 個人情報の収集・利用).
- **Linked from:** the Footer.
- **API:** none.

#### System Settings: `/admin/settings` (CMS0903, role 99)
- **Component:** `SystemSettingsPage` (internally `SettingsPage`), file `features/settings/pages/SettingsPage.tsx`.
- **Load:** **GET `settings/config`**.
- **System section:**

  | Field | Meaning |
  |---|---|
  | `invoiceCancelFee` | cancellation fee, tax included |
  | `cancelFee` | cancellation fee, tax excluded |
  | `taxRate` | tax rate (%) |
  | `email` | address that receives system notification emails |
  | `acceptableIp` | GlobaR default allowed IP addresses, separated by `;` |

- **"バージョン管理" section:**
  - Card "Qナビ" (store app): `storeIosUrl`, `storeAndroidUrl`, `jtVt10Url`, and the current/required versions for iOS, Android and JT-VT10.
  - Card "Qナビ作業員用" (worker app): `workerIosUrl`, `workerAndroidUrl`, and the iOS and Android versions.
  - Each iOS and Android platform has a **"通知する"** (notify) button.
- **Actions:**
  - **Save:** confirm (AMSG00040), then **PUT `settings/config`**. Save is disabled until the form changes.
  - **Notify:** confirm (AMSG00121), then **POST `settings/notify-upgrade`** `{pushType: 1|2|3|4}`. The push types are: 1 store iOS, 2 store Android, 3 worker iOS, 4 worker Android.
- Includes a leave prompt.

#### GlobaR Admin Accounts: `/admin/accounts/globar` (CMS0906, role 99)
- **Component:** `AccountListPage`, file `features/accounts/pages/ListPage.tsx`.
- **Filter:** `features/accounts/components/FilterForm.tsx`. The search condition is kept in `accountSlice`.
- **Purpose:** a read-only list of system admin accounts.
- **Filter fields:** `loginId`, `email`, `lastLoginAtFrom/To`, `dateFrom/To`, `numberItem`.
- **Table:** No, login_id, name, email, last_login_at, created_at. It is sortable and paginated. Rows have no actions.
- **API:** **GET `/users/globar-account`**. A 422 response is mapped onto the filter fields.

#### Not Found: `admin/not-found`
- **Component:** `NotFound`, file `components/templates/NotFound.tsx`.
- **Content:** a large "404" and the text "アクセスしようとしたページは見つかりませんでした。".
- **Note:** this is a private route. A logged-out user who hits `*` is redirected to `/login`.

### Global layout
- **PrivateLayout** (`components/templates/PrivateLayout.tsx`) uses the AdminLTE shell: Header, Sidebar, `.content-wrapper` (containing the Outlet), and Footer. It sets body classes such as sidebar-mini and sidebar-collapse from `app.menuSidebarCollapsed` and the screen size.
- **Header** (`components/partials/Header.tsx`):
  - **Navbar colour by role:** 01 danger, 02 warning, 03 info, 04 success, 99 lightblue. Roles 98 and 05 have no colour.
  - **Left side:** a hamburger button that toggles the sidebar.
  - **Right side, in order:**
    1. **Trouble quick search.** The placeholder reads "依頼番号 または 店舗名でEnter".
       - Pressing Enter calls **GET `/troubles/search`** `{searchPattern, numberItem:20, page, sortColumn:'updated_at,id'}`.
       - Results appear in `TroubleSearchResultPopup`, which loads more as you scroll. Clicking a result goes to `/admin/troubles/:id/detail`.
       - A filter icon opens an overlay with the full trouble `FilterForm` (`isHeaderUI`). Submitting it navigates to `/admin/troubles` with those conditions.
    2. **Notification bell** (hidden for 99). It goes to `/admin/notifications` and shows a badge when `hasNewNotification` is set.
    3. **"フィルタ" dropdown** of saved search criteria.
       - The list comes from **GET `/filters`** and scrolls infinitely.
       - Choosing one navigates to `/admin/troubles` with its `filterCriteria`, selected columns and column widths.
       - Delete asks for confirmation (AMSG00042), then calls **DELETE `/filters/:id`**.
    4. **"パスワード変更"**, which links to the change-password page.
    5. **"ログアウト"**: confirm (CMSG00005), then the logout chain.
  - **Not in the Header:** a language switcher (the only locale is ja), an unread-message count, or the user name. The name is shown at the bottom of the sidebar instead.
- **Sidebar** (`components/partials/Sidebar.tsx`):
  - The brand link "Qnavi 管理画面" points to `/`.
  - The bottom block shows the account name:
    - 99: "システム", or the system2 label with the name.
    - 01 and 02: `name（companyName）`.
    - 03, 98 and 05: the name.
  - The menu items are listed in the overview. Role 04 sees only ホーム, チャット一覧 and タスク管理.
- **MenuItem** (`components/partials/MenuItem.tsx`):
  - Clicking an item refreshes the mention-unread flag, collapses the sidebar on small screens, and navigates.
  - The chat item shows a red dot when `hasNewToMeMessage` is set.
  - The notifications item shows a badge when `hasNewNotification` is set (all roles except 99).
- **Footer:** "Copyright © {year} Globar. All rights reserved.", a "利用規約" link to the external `TERMS_OF_SERVICE_URL`, and a "プライバシーポリシー" link to `admin/privacy-policy`.
- **SearchBar** (`components/partials/SearchBar.tsx`): a reusable collapsible search header with a clear button and left/right button slots.

### Global modals (`components/modals/`)
| Modal | Purpose / trigger |
|---|---|
| `AppModal` | Generic Bootstrap modal: sizes sm through full, optional `<form>` wrapper, click-outside close, scroll-to-top button |
| `ConfirmDialog` | Global confirm, opened with `useAppModal().confirm({...})` and mounted by `AppProvider`. Types: warning / success / error / info |
| `ConfirmLeaveModal` | Shown when `useCallbackPrompt` blocks leaving a dirty form. Message AMSG00049 ("画面の編集内容が破棄されますが、処理を続行しますか？") |
| `NotificationPopup` | Redux-driven popup (`app.notificationPopup`). Used for the "signed out in all tabs" message, which reloads the page |
| `AppImageViewModal` / `AppImageViewOriginModal` | Image preview, and preview at original size |
| `DataViewModal` | Generic read-only data modal |
| `ViewDownoadModal` (`ViewDownloadModal`) | Download-link modal, opened with `useAppModal().viewDownload()` |
| Version-reload confirm (`App.tsx`) | Warning that cannot be closed when `configs.cmsFeVersion !== CMS_VERSIONS`. The button calls `location.reload()` |

### Redux in `features/common`
- **`appSlice`:** isLoading, sidebar state, screenSize, responseError, hasNewNotification, hasNewToMeMessage, isMaintenance, isServerDie, notificationPopup.
- **`appSaga`:**
  - `getUnReadToMeMessages`: GET `/chat/mentions/has-unread`.
  - `getNewestNotification`: GET `notifications/store-newest`.
  - `getUnReadMessages`: GET `chat/get-trouble-user`. Nothing active dispatches it.
- **`appMasterSaga`:**
  - `loadCodes`: GET `codes`.
  - `loadMyStore`: GET `/asset/my-store`.
  - `loadConfigs`: GET `/configs`.
  - `allLargeCategory`: GET `largecategories?chainSystemId=`.
- **`searchSaga`:** `getSearchCategories`.

---
## Module: Troubles (作業依頼 / work requests), the core workflow

### Overview
- **Sagas:** `features/trouble/troubleSaga.ts` is empty. Components and hooks call the APIs directly: `troubleApi.*` (`api/apiTrouble.ts`), `troubleApiV2.*` (`api/apiTroubleV2.ts`), and `estimateApi.*` (`api/apiEstimateV2.ts`).
- **API clients:**
  - `troubleApi` and `troubleApiV2` use `axiosClient`, which points at the CMS backend.
  - `estimateApi` uses `estimationClient` (`libs/axios/estimation.ts`, base URL `API_ESTIMATION_URL`), which points at the **estimation backend**.
- **`troubleSlice`** holds only UI state:
  - `register`: the create wizard
  - `statusEdit`: a working copy for the status modal, including the `idempotenceKey`
  - `estimationV2.isNewEstimationFlow`
  - `searchCriteria`
  - `isOpenTroubleNavi`
- **Permissions:**
  - `useTroublePermission.ts` provides `troublePermission`, `troubleEditPermission`, `troubleEstimatePermission`, `troubleFilterPermission`, and `buildTroubleDetailPermission(trouble)`.
  - `useTroubleStatus.ts` decides which rows of the status modal are visible or required.
- **Two estimation flows:** V1 (legacy, CMS backend) and V2 (estimation backend). The switch is `trouble.isNewEstimationFlow`, and it picks `StatusEditModal` vs `StatusEditModalV2` and `EstimatesModal` vs `EstimatesModalV2`.
- **Route guards:** only the three import pages have screen guards. List, Create, Detail, and Edit rely on checks inside the components and on the backend.

### Status enums (`models/Trouble.ts`)
| Field | Values |
|---|---|
| `status` | 01 inquiring 問い合わせ中 · 02 working 対応中 · 03 done 完了 |
| `troubleType` | 01 new 新規 · 02 continuation 継続 |
| `newFLowStatus` | 01 waiting · 02 orders · 03 moving · 04 arrival · 05 waitingQuoteApproval · 06 quoteRejection · 07 working · 08 done · 09 reported · 10 approved |
| `continuationFlowStatus` | 10 waitingQuote · 20 waitingQuoteApproval · 30 quoteRejection · 40 quoteApproval · 41 waitingScheduleApproval · 42 scheduleReRequest · 50 scheduleConfirmed · 60 moving · 61 arrival · 70 working · 80 done · 90 reported · 91 approved |
| `doneStatus` | 01 card payment · 02 invoice · 03 free cancel · 04/05 paid cancel · 06 worker cancel · 07 force cancel |
| V2 estimate status | draft · submitted · re_submitted · approved · returned · selected · expired · request_cancel · cancelled |

### Trouble List: `/admin/troubles`
- **Component:** `TroubleListPage` (`features/trouble/pages/ListPage.tsx`), with the table in `components/TroubleListTable.tsx` (about 1600 lines).
- **Purpose:** Search, list, and export work requests, and run quick per-row actions.
- **Route guard:** none.
- **Role-dependent UI:**
  - `TroubleNotice` panel (依頼情報): shown to every role except 99, using GET `troubles/notice`.
  - "新規" (Create) button: `canCreateFromList`, which is 01, 02, and 03 only.
  - "データ操作" (Data operations) dropdown:

    | Item | Upload → | Download | Who |
    |---|---|---|---|
    | 完了状態一括更新 (bulk completion status) | `/admin/troubles/import-trouble-complete-status` | GET `troubles/export-complete-status` | 01/02 with `isAllowPayment == 1` |
    | 請求月の一括更新 (bulk billing month) | `/admin/troubles/import-payment` | GET `/troubles/export` | 98 |
    | 請求状態の一括更新 (bulk billing status) | `/admin/troubles/import-billing` | GET `/troubles/export` | 01 |
    | 作業依頼データ (request data) | – | GET `/troubles/export` | all |
    | 立候補者つき作業依頼データ (request data with candidates) | – | GET `/troubles/export-candidacies` | all |

    Exports are blocked above `MAX_DOWNLOAD_DATA_EXCEL` rows (AMSG00136).
  - Table columns by role:
    - memo: 99/98
    - rating: 99
    - chain system: 99/98
    - store payer: hidden for 03
    - workerTotal: 99/98/05
    - history: 99/98
    - quick action (クイック操作): 99/98/05
  - Rows are highlighted red for every role except 99.
  - Per-row action buttons (立候補 candidates, 見積もり estimate, 見積稟議進捗 approval progress, 報告書 report, 作業完了確認 completion) come from `buildTroubleDetailPermission`. See the Detail page below.
  - Worker-company cell on an inquiring automatching trouble: a "立候補一覧" (candidate list) button.
  - Advanced filter Normal/Attribute tabs: 01 only (`troubleFilterPermission.attributesSearch`).
  - Attributes come from GET `/extra-attributes/:chainSystemId` for 01, and GET `/extra-attributes` for other roles.
- **Search:**
  - **Basic** (`FilterFormBasic`): `searchStatus`, `troubleType`, `number`, `companyName` (99), `storeName`, `workerName`.
  - **"高度な検索" (advanced) drawer** (`components/filters/FilterFormAdvance.tsx`, `FilterFormNormal.tsx`, `FilterFormAttributes.tsx`):
    - store fields, staff, phone, prefecture, worker
    - categories (large, medium, small, symptom)
    - status: searchStatus (the 完了 "done" option only for 99/98/01/02), newFlowStatus, continuationFlowStatus, doneStatus, requestCancelStatus, resubmissionStatus
    - asset code and name
    - date ranges and expiredTime
    - role-gated fields:

      | Field | Roles |
      |---|---|
      | companyName / rating | 99 |
      | billStatus | 99/98 |
      | isConfirmed | 98/99/05 |
      | searchUrgentFlag | 98/01/02 |
      | paymentMonth | 99/98/01/02 |
  - Search conditions persist in the URL and localStorage (`hooks/useQueryCondition.ts`).
- **Toolbar:**
  - "データエクスポート" (data export): POST `/troubles/export-selected-column`
  - "表示条件を保存" (save conditions): opens `SaveCriteriaModal`
  - "表示設定" (display settings): opens `FilterColumnModal`
  - page size 20, 50, or 100
  - column resize and drag-and-drop ordering, saved in localStorage
- **Inline memo edit:** PUT `troubles/:id/quick-edit`.
- **Download cells:**
  - V1: GET `download-file`
  - V2: GET `troubles/:id/estimations/:estimationId/download?fileType=` (estimation backend)
  - Report PDFs: `ReportAttachedPdfListModal`
- **API:**
  - GET `/troubles` (list)
  - GET `/troubles/:id` (before opening the candidate modal)
  - GET `troubles/:id/list-account-payments` (store payer modal)
  - plus the exports listed above
- **Modals:**
  - `StatusEditModal` / `V2`
  - `TroubleHistoriesModal`
  - `TroubleCandidaciesModal` / `AutomatchingCandidaciesModal`
  - `TroubleEstimatesModal` / `V2`
  - `TroubleReportModal`
  - `TroublePaymentModal`
  - `FilterColumnModal`, `SaveCriteriaModal`
  - `ViewAssetsModal`, `QuotationApprovalModal`, `ReportAttachedPdfListModal`
- **Navigation:**
  - a row or the number link → `/admin/troubles/:id/detail`
  - Create → `/admin/troubles/create`
  - the three import pages, via the Data operations dropdown

### Trouble Create (wizard): `/admin/trouble/create` and `/admin/troubles/create`
- **Component:** `TroubleCreatePage` (`features/trouble/pages/CreatePage.tsx`), with steps in `useTrouble.ts`.
- **Title:** "作業依頼登録" (register work request) for 99/98, "依頼登録" (register request) for everyone else.
- **Route guard:** none.
- **Trouble type:**
  - 99/98 choose new or continuation (`canSelectTroubleType`).
  - Every other role is forced to new, unlocked, starting at step 1.
- **Steps:**

  | Who | Type | Steps |
  |---|---|---|
  | 99 | new | 操作モード設定 (operation mode: lock) → 店舗 (store) → 作業項目選択 (work items) → 故障詳細 (fault detail) |
  | others | new | 店舗 → 作業項目選択 → 故障詳細 |
  | 98 | continuation | 作業依頼設定 (select previous request) |
  | 99 | continuation | 操作モード設定 → 作業依頼設定 |

- **Store step** (`components/newTypes/ShopSetting.tsx`):
  - "個人店舗選択" (select individual store): 99 and 03.
  - "チェーン店選択" (select chain store): 99, 98, and 01.
  - 02: the store is filled automatically (GET `/stores/:id`).
  - Staff is picked through `IndividualSelectStaffModal` or `ChainSystemStoreSelectStaffModal`.
- **Work items** (`components/newTypes/WorkItemSelection.tsx`):
  - Large, medium, and small category picker modals.
  - `ViewQuestionModal` (Q&A) opens after the small category is chosen.
  - Optional "資産を追加" (add assets), shown when `chainStore.assetFlag` is set, uses `AssetSelectModal` and `AssetTable`.
- **Fault detail** (`components/newTypes/FaultDetail.tsx`):
  - multiple images
  - `description` (required)
  - `isEmergency`:
    - normal stores: 緊急 (urgent) or 時間選択 (choose a time)
    - automatching stores: 今日 (today) or 明日 (tomorrow); 緊急 is disabled after 20:00 JST
- **Continuation** (`components/continuationTypes/WorkRequestModeSetting.tsx`): "前回依頼選択" (select previous request) opens `TroubleSelectModal` (`pages/SelectModal.tsx`), which calls GET `/troubles?isContinue=1&searchStatus[]=02,03`.
- **Submit:** "決定して問い合わせる" (decide and inquire) shows confirm AMSG00040, then sends POST `/troubles` as multipart with an **`Idempotency-Key`** header.
  - payload: `troubleType`, `isLock`, `storeType`, `chainStoreId`/`individualStoreId`, `chainStoreManagerId`, `staffId`, `troubleImage[]`, `description`, `isEmergency`, `dateOption`, expected dates, categories, `isAsset`, `assetIds[]`, `previousTroubleId`
- **Other behavior:**
  - A leave prompt guards unsaved input.
  - When `isOpenTroubleNavi` is set, the page renders the TroubleNavi iframe instead of the wizard.
- **Navigation:**
  - after success → the detail page
  - Back (01/02/03 only) → the list

### Trouble Detail: `/admin/troubles/:id/detail`
- **Component:** `TroubleDetailPage` (`features/trouble/pages/DetailPage.tsx`).
- **Purpose:** The hub for one request: workflow actions plus chat.
- **Route guard:** none. The backend enforces visibility.
- **Load:**
  - GET `/troubles/:id`
  - GET `/chat/:id/has-unread-message` (when a legacy chat exists)
  - GET `/stores/:id` or `/individuals/stores/:id` (skipped for 05)
  - `loadPermission` (GET `users/permission`)
  - `PickScheduleWorkModal` opens automatically for roles other than 99/98 when status is 02, flow is 41, and schedules exist.
- **Header:**
  - related troubles
  - status, flow, and 営業停止 (business suspension) badges
  - Back: target depends on `?from=task`, `?assetId`, or `?chatMode`
  - "クイック操作" (quick action): 99/98/05, opens the status modal
  - "編集" (Edit): all roles
  - worker company name:
    - 99: a link to the worker detail page
    - 98: plain text
    - others: opens `CandidacyDetailModal`
- **Action buttons** (`buildTroubleDetailPermission`):

  | Button | 99/98 | Store roles 01/02/03 (unless `isLock`) | 05 |
  |---|---|---|---|
  | 履歴 (history) | yes | – | – |
  | 立候補 (candidates) | yes | new: inquiring/working/done(01/02); continuation: working/done | – |
  | 見積もり (estimates) | new: done or flow ≥05; continuation: done or flow ≥20 | V2: flow ≥05 / ≥20 plus `isAllowApproveEstimate`; V1: flow 05 or ≥07 / 20 or ≥40 | always |
  | 見積稟議進捗 (approval progress) | when `isShowApproverList` | same | same |
  | 報告書 (report) | yes | flow ≥08 / ≥80 or done(01/02) | always |
  | 作業完了確認・決済 (confirm completion and pay) | – | flow ≥08 / ≥80 plus `isAllowPayment` and `isAllowApproveEstimate` | – |
  | 無料キャンセル (free cancel) | – | new: inquiring; continuation: working with flow <40 | – |
  | 有料キャンセル (paid cancel) | – | new: working with flow <07 | – |
  | 訪問確定日時 (confirm visit date) | – | continuation flow 41 | – |
  | タスク (task) | all | all | all |

- **Detail rows:**
  - categories, asset button, number, previous/next number links
  - description and images (`AppImageViewModal`)
  - suspension, emergency, expected date, candidate schedules, worker date and company, created/updated
  - **依頼内容確認 (request confirmed) checkbox** (99/98/05): PUT `troubles/:id/is-confirm`
  - 99 only: lock, rating, comments
  - 99/98/01/02: billing status, billing months, BM number
  - 99/98: chain system, memo
  - store payer: GET `troubles/:id/list-account-payments`
- **Chat popover:**
  - `FirebaseChatBox`, or the legacy `ChatBox` through a switch
  - "未読にする" (mark unread), 99 only: POST `chat/:id/user-unread-message` (legacy) or PUT `chat/:id/mark-as-unread` (firebase)
- **Payment:**
  1. `TroublePaymentModal`: rating (required) and comments.
  2. POST `/troubles/:id/payments` (V1) or POST `/v2/troubles/:id/payments` (V2).
  3. On failure, `ChangePaymentMethodFail` offers:
     - a new card (`CreditCardRegister`)
     - another card
     - switching to invoice (POST `/credit-cards/change-payment`)
- **Cancel:** confirm AMSG00099, then POST `troubles/:id/free-cancel` or POST `troubles/:id/paid-cancel`.
- **Modals:**
  - `TroubleHistoriesModal`
  - `TroubleEstimatesModal` / `V2`
  - candidates modals
  - `TroubleReportModal`, `TroublePaymentModal`
  - `CandidacyDetailModal`, `PickScheduleWorkModal`
  - status modals
  - `TaskListModal`
  - `ViewAssetsModal`, `QuotationApprovalModal`
  - store payer list
  - `EstimateViewModal`: unreachable (dead code)

### Trouble Edit: `/admin/troubles/:id/edit`
- **Component:** `TroubleEditPage` (`features/trouble/pages/EditPage.tsx`).
- **Route guard:** none. Fields are gated by `troubleEditPermission`.
- **Fields:**

  | Field | Editable by | Read-only for |
  |---|---|---|
  | billing status (`AppButtonGroup`) | 99/98/01 | 02 |
  | `billingMonthForSales`, `billingMonthForPayment` (YYYY/MM), `bmNumber` (max 50), `memoContent` | 99/98 | 01/02 |
  | `memoStoreContent` (店舗メモ, store memo) | all | – |
  | `description` (required) | 99/98 | – |
  | images (add / remove / update) | 99 | others |
  | `isLock` | 99/05 | – |
  | `urgentFlag` (営業停止/通常, suspended/normal) | 99/98/05, and 01 if `isAllowPayment` | – |

- **"更新" (update) sub-editors:**

  | Sub-editor | Who | Condition | Modal |
  |---|---|---|---|
  | store, staff, and category | 99 | new type only | `StoreStaffCategoryEditModal` |
  | expected date | 99/98 | – | `ExpectedDateEditModal` |
  | worker date | 99 | worker assigned and status ≠ 01 | `WorkerDateEditModal` |
  | status | 99/98/05 | – | `StatusEditModal` / `V2` |
  | assets | 98/01 | – | `UpdateAssetModal`; view with `ViewAssetsModal` |

- **Save:** confirm AMSG00040, then POST `/troubles/:id` as multipart with `_method=PUT`. Save is disabled until the form changes. A leave prompt guards unsaved input.
- **API:** GET `/troubles/:id`.
- **Navigation:** Back and after success → the detail page, keeping the query string.

### Import Billing Month: `/admin/troubles/import-payment` (CMS0031, [98])
- **Component:** `ImportMonthPaymentPage` (`features/trouble/pages/ImportMonthPaymentPage.tsx`). The const inside the file is misnamed.
- **Title:** "請求月の一括更新" (bulk update billing month).
- **UI:** `AppUploadFileHolder` with a 422 error list, and a Back button.
- **API:** POST `imports/payment-month` (multipart). It runs as an async job (`handleUploadJob`).
- **Template:** GET `/troubles/export`, from the list's Data operations dropdown.
- **Navigation:** Back → the list.

### Import Billing Status: `/admin/troubles/import-billing` (CMS0032, [01])
- **Component:** `ImportBillingStatusPage` (`features/trouble/pages/ImportBillingStatusPage.tsx`).
- **Title:** "請求状態の一括更新" (bulk update billing status).
- **API:** POST `imports/store-admin/billing-status` (multipart).

### Import Completion Status: `/admin/troubles/import-trouble-complete-status` (CMS0033, [01, 02])
- **Component:** `ImportTroubleCompleteStatusPage` (`features/trouble/pages/ImportTroubleCompleteStatusPage.tsx`).
- **Title:** "完了状態一括更新" (bulk update completion status).
- **API:** POST `troubles/import-complete-status` (multipart).
- **Template:** GET `troubles/export-complete-status`.
- **Gap:** the route does not check `isAllowPayment`. Only the menu does.

### Trouble modals (`features/trouble/components/modals`)
Where each modal opens: L = list, D = detail, E = edit, S = inside a status modal.

#### Status-change modals
- **`StatusEditModal.tsx`** (V1). Opens from L, D, and E, for roles 99/98/05.
  - **Loads:**
    - GET `/estcategories/all`
    - GET `troubles/:id/reports`, or GET `troubles/:id/assets` if there is no report
    - GET `/troubles/:id/estimates`
  - **Fields:**
    - `status`: a continuation trouble cannot be set to 01
    - `newFlowStatus` / `continuationFlowStatus`: shown when status is working
    - `doneStatus`: shown when status is done
    - when `urgentFlag` is set, flow options are limited to a band: new 01–05 or 07–10; continuation 10–20 or 40–91
    - worker: `WorkerSelectModal` from `features/worker`
    - visit date and time: `WorkerDateTimeModal`
    - estimates: `EstimateListModal`
    - schedules (continuation 41/42): `ScheduleListModal`
    - report: `ReportModal`, then `report/CreateModal`
  - **Validation:**
    - a worker is required when status is working, or done with doneStatus ≤02
    - new flow ≥05 needs at least one presented estimate; ≥07 needs a selected estimate (unless urgent)
    - continuation flow ≥20 needs a presented estimate; ≥40 needs a selected estimate; 41–49 needs schedules
    - done with doneStatus ≤02 needs a selected estimate
  - **Locking:** status becomes read-only, and cancel is disabled, when the trouble was auto-approved during the edit or an estimate changed.
  - **Submit:** confirm, then POST `troubles/:id/status` as multipart with `_method=PUT` and an `Idempotency-Key` header.
    - payload: status/flow/done plus their old values, `worker{id,date,start,end}`, `schedules`, `estimation.selectedId`, `autoApproved`, `report{...}`
    - deleted report PDFs are audit-logged
    - the idempotency key is rotated after the request
  - **Close:** POST `troubles/delete_attachment` removes files uploaded during the edit.
- **`estimationV2/StatusEditModalV2.tsx`** (V2). Opens from the same places as V1.
  - **Loads:** GET `/estcategories/all` and GET `troubles/:id/estimations` (estimation backend). After the estimate list closes it re-fetches and re-syncs.
  - **Rollback rule:** if the database status is working with flow >05 (new) or >20 (continuation), or the trouble is done, the status cannot go back to 05/06 (new) or 20/30 (continuation).
    - errors: EVMSG0004 / EVMSG00041 / EVMSG0005 / EVMSG00051 / EVMSG0001
    - 05 needs a submitted, re-submitted, or request-cancel estimate
    - 06 also accepts a returned estimate
    - ≥07 needs an approved or selected estimate, unless the trouble is urgent or has `resubmissionStatus`
    - EVMSG0006: not submitted
    - EVMSG0002: approval is required
    - EVMSG0003: the worker company must wait for approval
  - **Submit:** POST `/v2/troubles/:id/status` as multipart with `_method=PUT` and an `Idempotency-Key` header.
  - **Sub-modal:** `EstimateListModalV2`.

#### Sub-modals inside the status modals (S)
- **`statuses/WorkerDateTimeModal.tsx`** "訪問予定日時選択" (select planned visit time). Validates with GET `troubles/:id/check-status`.
- **`statuses/ScheduleListModal.tsx`** "訪問予定候補日登録" (register candidate visit dates). Rows of date, start, and end. Validates with GET `troubles/:id/check-status`.
- **`statuses/EstimateListModal.tsx`** (V1).
  - Columns: title, totals, 提示 (present) toggle, 選択 (select) toggle, Excel/PDF, edit/copy/delete. Edit, copy, and delete are disabled when the trouble is urgent, and delete is also disabled for the selected estimate.
  - Edit form: GET `/troubles/:id/estimates-config?estimationId=`.
  - Done: POST `troubles/:id/estimates-change` with `{estRemoveIds, estSelectedId, oldEstSelectedId, statusCheckedIds, ...}`. The response can auto-advance the flow.
- **`statuses/EstimateCreateModal.tsx`** (V1).
  - Fields: title, notices, `isManual` (自由入力, free entry), item rows (label, amount, quantity, total), workerTotal, total.
  - Save: POST `troubles/:id/estimates`.
- **`statuses/EstimateItemCreateModal.tsx`** "作業項目追加" (add work item). POST `troubles/:id/estimates/item-list`.
- **`statuses/ExportButton.tsx`**: GET `download-file?url=&isEncoded=`.
- **`estimationV2/statuses/EstimateListModalV2.tsx`**:
  - Detail panel and checkbox multi-select.
  - "提示する" (present to store): POST `troubles/:id/estimations/submit` with `{estimationIds}`.
  - Create, up to `MAX_ESTIMATION`.
  - Delete: DELETE `troubles/:id/estimations/:estimationId`.
  - Expanded row shows `EstimationActionShop` (hidden for 05) and `EstimationActionWorker` (取り下げ申請 request withdrawal / edit / copy / delete).
  - Also reachable: `ReasonModalContainer`, `HistoryModal`.
- **`estimationV2/statuses/EstimateCreateModalV2.tsx`**:
  - Fields: title, companyName, expiredTime (+30 days on copy), notices, items (`EstimateItemCreateModalV2`).
  - Drag-sortable rows (`list/DraggableList.tsx`, `DraggableRow.tsx`).
  - Recalculates with POST `troubles/:id/estimations/calculate-items`.
  - Save: POST `troubles/:id/estimations` or PATCH `troubles/:id/estimations/:estimationId`.
- **`ExportButtonV2`**: GET `troubles/:id/estimations/:estimationId/download?fileType=pdf|excel`.
- **`ExportSummaryButtonV2`**: GET `estimations/export-summary?fileType=&troubleNumber=`.

#### Estimate view and approval
- **`EstimatesModal.tsx`** (V1). Opens from D and L.
  - **Load:** GET `/troubles/:id/estimates?isGetSummary=true`. Summary chains get tabs, including a 合計 (total) tab.
  - **Approval panel:** depends on approveType (personal / class / price / level), `requestApproveEst`, and whether the user is in the approver list.
  - **Actions:**
    - 承認 (approve) and 差し戻し (send back): POST `/troubles/:id/estimates/approve`
    - approve on the total tab: POST `/troubles/approve-estimates-summary`
    - summary download: POST `troubles/:id/summary-estimates`
  - **Banners:** AMSG00096, AMSG00097, AMSG00098.
- **`estimationV2/EstimatesModalV2.tsx`**. Opens from D and L.
  - **Load:** GET `troubles/:id/estimations` and GET `troubles/:id/estimates/condition-display`.
  - Summary tabs with `ExportSummaryButtonV2`.
  - The list is shown only when `useApproveDisplay().showSelectEstimate` is true. Worker amounts are hidden for 01/02.
  - Row actions (`components/estimations/EstimationActionShop.tsx`; hidden for 99/98 and for approved or expired estimates):
    - 承認 (approve): POST `/troubles/review_estimation_service` (CMS backend)
    - 差し戻し (send back) and 取り下げ却下 (reject withdrawal): open `ReasonEstimationModal`
    - 取り下げ承認 (approve withdrawal): POST `troubles/:id/estimations/approve-request-cancel`
- **`estimationV2/ReasonEstimationModal.tsx`**.
  - Field: `reason` (required, max 256).
  - API, body `{estimationIds, reason}`:
    - send back: POST `troubles/:id/estimations/reject`
    - request withdrawal: POST `troubles/:id/estimations/send-request-cancel`
    - reject withdrawal: POST `troubles/:id/estimations/reject-request-cancel`
- **`estimationV2/HistoryModal.tsx`** "見積もり履歴" (estimate history). Read-only.
- **`EstimateViewModal.tsx`** "見積書" (estimate document). GET `/troubles/:id/report-approved`. Unreachable.
- **`QuotationApprovalModal.tsx`** "見積稟議進捗" (approval progress). Opens from D and L. GET `/troubles/:id/list-approvers`, with a "show approvers" toggle.

#### Candidate modals
- **`CandidaciesModal.tsx`** "立候補" (candidates). Opens from D and L.
  - **Load:** GET `troubles/:id/candidacies-confirm`.
  - **Columns:** company, visitable date and time, achievements (this store / this chain / Qnavi overall), result, created.
  - **"選択" (select):** shown to 01/02/03 when `isAllowSelectWorker` is set, the trouble is inquiring, and the result is 01.
    1. `CandidacyConfirmModal` asks for confirmation.
    2. POST `troubles/:id/candidacies-decision` with `{workerId, workerDate, workerStart, workerEnd}`. This moves the trouble from 01 to 02.
- **`automatchingCandidaciesModal.tsx`** "立候補者リスト" (candidate list). GET `automatching/troubles/:id/candidacies-confirm`. Detail only.
- **`candidacies/CandidacyDetailModal.tsx`** "作業員詳細" (worker detail). GET `troubles/:id/candidacies-confirm/:candidacyId`.
- **`candidacies/CandidacyConfirmModal.tsx`**: OK confirmation.
- **`PickScheduleWorkModal.tsx`**. Opens from D (button, or automatically at continuation flow 41).
  - Radio list of schedules.
  - "選択" (select): POST `troubles/:id/schedules` with `{troubleScheduleId, accept:1}`.
  - "却下" (reject): the same call with `accept:0`.
  - **Bug:** the catch block leaves the loader on and calls `handleSuccess`.

#### Report modals
- **`ReportModal.tsx`** "報告書" (report). Read-only from D and L, editable from S.
  - **Load:** GET `troubles/:id/reports`, or GET `troubles/:id/assets` if there is no report.
  - **Summary download:** POST `troubles/:id/summary-reports`.
  - **"作業報告書確認" (confirm work report)**: shown to 01/02 when the store does not pay through the system and the flow is 09 or 90. POST `troubles/:id/approve-report`.
- **`report/CreateModal.tsx`**.
  - **Fields:**
    - start and end (required)
    - reason (required)
    - content, symptom, notice
    - status, isContinue
    - sortable before/after images
    - assets (with responseType)
    - PDF attachments (99/98)
  - **Upload:** POST `troubles/generate_presigned_url`, then PUT to S3.
  - **Remove:** POST `troubles/delete_attachment`.
  - **Validate:** POST `troubles/reports`. The report is then stored in redux and saved together with the status.
- **`ReportAttachedPdfListModal.tsx`**. Opens from L. GET `download-report-attachment?url=&reportId=`.

#### Other modals
- **`HistoriesModal.tsx`**. Opens from D and L, for 99/98. GET `/troubles/:id/histories`.
- **`PaymentModal.tsx`** "支払情報" (payment information).
  - GET `/troubles/:id/payments`.
  - Fields: rating (required), comments.
  - The parent then POSTs `payments`, and doneStatus becomes 01 or 02.
- **`ExpectedDateEditModal.tsx`** "訪問希望日時編集" (edit preferred visit time). Opens from E. PUT `troubles/:id/expected-date`.
- **`WorkerDateEditModal.tsx`** "作業者編集" (edit worker). Opens from E. PUT `troubles/:id/worker-date`.
- **`StoreStaffCategoryEditModal.tsx`** "店舗・担当者編集" (edit store and staff). Opens from E.
  - PUT `troubles/:id/store-staff-categories`.
  - Uses the chain/individual store pickers, `edits/SelectCategories.tsx`, and `AssetSelectModal`.
- **`UpdateAssetModal.tsx`**. Opens from E. PUT `troubles/:id/assets` with `{assets:[{id,responseType}]}`.
- **`ViewAssetsModal.tsx`**. Opens from D, E, and L. GET `troubles/:id/assets`.
- **`FilterColumnModal.tsx`** "表示設定" (display settings).
  - Column visibility by section, an attribute tab, 全選択切替 (toggle all), and 初期設定に戻す (reset to default).
  - Stored in localStorage only.
- **`searchCriteria/SaveCriteriaModal.tsx`** "表示条件を保存" (save display conditions).
  - Field: name.
  - POST `/filters` with `{name, filterCriteria, selectedColumn[], selectedColumnWidth}`.
  - Saved criteria are loaded and deleted from the Header's "フィルタ" (filter) dropdown.

### Status transitions handled in the UI
- **01 → 02:**
  - the store selects a candidate: POST `candidacies-decision`
  - or 99/98/05 sets the status and worker in the status modal
- **Inside 02:** flow is chosen in the status modal, subject to the validation and V2 rollback rules.
  - V1 estimate change can auto-advance the flow: POST `estimates-change`
  - estimate approval: POST `estimates/approve` (V1) or POST `review_estimation_service` (V2)
  - schedule accept/reject (41/42 → 50): POST `schedules`
  - report confirm (09/90 → 10/91) for stores that do not pay through the system: POST `approve-report`
- **02 (flow ≥08 / ≥80) → 03:**
  - payment: POST `payments` (V1 or V2)
  - or an admin sets 03 plus a doneStatus
- **Cancel:**
  - POST `free-cancel` (new + inquiring, or continuation flow <40)
  - POST `paid-cancel` (new + working, flow <07)

### Risks in this module
1. `useTroublePermission.troublePermission` mutates the module-level `TroublePermissionAlowAll` / `TroublePermissionDenyAll` objects instead of copying them. Flags can therefore carry over between logins in the same SPA session.
2. `PickScheduleWorkModal` reports a failure as success and leaves the loader running.
3. The completion-status import route does not enforce `isAllowPayment`.
4. Detail and Edit have no route guard, and the Edit button is shown to every role. Only the backend enforces access.
5. Dead code: `EstimateViewModal` and `troubleApi.automatchingCandidaciesDetail`.

---
## Module: Chain System, Chain Stores, Store Managers, Attributes, Individual, Group, Agent

**None of these modules uses redux-saga.** Pages call the `api/*` wrappers directly, wrapped in `appActions.loading()` and `hideLoading()`. The slices are used only to cache search conditions:
- `chainSlice`: `searchConditionChain`, `searchConditionChainStore` (keyed by chainSystemId), `searchConditionChainManager`.
- `individualSlice`: search conditions for individuals.

### Shared helpers

#### `features/chainSystem/useChain.ts`

`chainSystemId` is resolved as follows:

| Role | chainSystemId |
|---|---|
| 99 | the `:id` URL parameter, falling back to the master `WORK_CATEGORY_MASTER_CHAIN_SYSTEM_ID` |
| 01 / 02 | `auth.chainSystemId` (the URL is ignored) |
| any other role | the master ID |

`chainStoreId` is resolved as follows:

| Role | chainStoreId |
|---|---|
| 02 | `auth.chainStoreId` |
| others | the `:storeId` URL parameter |

The hook also builds `chainPermission`, which has three parts: `{chain, chainStore, chainManager}`.

| Flag | 02 | 01 | 99 |
|---|---|---|---|
| canView / canViewAny / canExport | no | yes | yes |
| canEdit / canEditLoginId / canCreate / canImport / canDelete | no | no | yes |
| canSearchGroup / canViewGroup | no | yes | no |
| canApproveEstimate | no | yes | yes, only when chainStoreId is set |
| canViewAttribute / canGoBack | no | yes | yes |
| canSettingApproval | no | no | yes |
| canSettingProgressEmailNotify | no | no | yes |

#### `features/chainSystem/useChainRedirect.ts`

This hook picks the navigation target:
- When `:id` is in the URL, it uses the `/admin/chain-systems/:id/...` routes.
- Otherwise it uses the 01/02 routes under `/admin/chain-system/stores...`.

### API endpoints used by these modules
| Wrapper | Endpoints |
|---|---|
| `apiChainSystem` | GET/POST `/chainsystems`<br>GET/PUT/DELETE `/chainsystems/:id`<br>download `/chainsystems/export`<br>`/chainsystems/:id/download-template-work-categories`<br>POST `/chainsystems/:id/bulk-work-categories`<br>`/chainsystems/:id/download-template-est-categories`<br>POST `/chainsystems/:id/bulk-est-categories`<br>`/chainsystems/:id/export-symptoms` |
| `apiChainStore` | GET/POST `/stores`<br>GET `/stores/search-all-id`<br>GET `/stores/all`<br>download `/stores/download-store-list`<br>`/stores/export-symptoms`<br>POST `/stores/import`<br>POST `/stores/import-symptoms`<br>GET/PUT `/stores/:id`<br>GET `stores/:id/staffs`<br>GET `/stores/:storeId/approver-list` |
| `apiChainStoreManager` | GET/POST `/managers`<br>GET `/managers/download-store-manager-list` (async job)<br>POST `/managers/import`<br>GET/PUT `/managers/:id`<br>PUT `/managers/:id/representative-stores` |
| `apiAttributes` | GET `/extra-attributes/:chainSystemId`<br>POST `/extra-attributes`<br>PUT/DELETE `/extra-attributes/:id`<br>download `/extra-attributes/download-attribute-list`<br>POST `/extra-attributes/import` |
| `apiIndividual` | GET `/individuals`<br>`/individuals/export`<br>GET `/individuals/:id`<br>GET `/individuals/stores`<br>GET `individuals/stores/search-all-id`<br>`/individuals/stores/export`<br>GET `/individuals/stores/:id`<br>GET `/individuals/stores/:id/staffs` |
| `apiGroup` | GET/POST `/groups`<br>GET `/groups/all`<br>GET/PUT/DELETE `/groups/:id` |
| `apiAgent` | GET/POST `/agents`<br>`/agents/export`<br>GET/PUT/DELETE `/agents/:id` |

### Chain System

#### Chain System List: `/admin/chain-systems` (CMS0050, roles [99])
- **Component:** `ChainSystemListPage`, in `features/chainSystem/pages/ListPage.tsx`
- **Purpose:** Search, list, and export chain companies.
- **Filter** (`components/FilterForm.tsx`): `companyName`, `phoneNumber`, `address`, `numberOfStore`, `dateFrom`, `dateTo`, `numberItem`.
- **Table columns:** No, company name, phone, address, automatching icon, store count, store-admin count, created at, Edit.
  - Clicking a row opens `/admin/chain-systems/:id/stores`.
- **Buttons:**
  - Download: calls `/chainsystems/export`.
  - Create: goes to `/admin/chain-systems/create`.
  - Edit: goes to `/admin/chain-systems/:id/edit` with `state.isFromList`.
- **Dead code:** `onDelete` (DELETE `/chainsystems/:id`) exists, but no button renders it.
- **On mount:** clears the cached store and manager search conditions.

#### Chain System Create / Edit: `/admin/chain-systems/create` (CMS0051, [99]) and `/admin/chain-systems/:id/edit` (CMS0053, [99, 01])
- **Component:** `ChainSystemCreateOrUpdatePage`, in `features/chainSystem/pages/CreateOrUpdatePage.tsx`
- **Form fields:**
  - `companyName`: required.
  - `phoneNumber`.
  - `startMonth`: shown only when the user is not 99.
  - `address1`, `address2`.
  - `troubleDisplayType`: radio, shown only to 99.
  - `automatchingFlag`, `assetFlag`, `chatbotFlag`: switches, disabled unless the user is 99.
- **Buttons:**
  - Save: top and bottom, disabled until the form is dirty. Shows confirm AMSG00040.
  - Back.
  - A leave prompt guards unsaved changes.
- **Embedded `CategoryInfo`** (`components/CategoryInfo.tsx`). Shown only when editing, the user is 99, and no save is in progress.
  - **Work categories:** Import and Download buttons, plus the draggable `CategoriesListPage` (large/medium/small tree; see the Categories module). Uses `/chainsystems/:id/download-template-work-categories` and POST `/bulk-work-categories`.
  - **Estimation categories:** an embedded `EstimationCategoryListPage` (GET `/estcategories`) with Import/Download (`/download-template-est-categories`, POST `/bulk-est-categories`).
    - Its create, detail, and edit links go to `/admin/chain-systems/:id/est-categories/...`.
  - Two upload modals (`AppModal` + `AppUploadFileHolder`) that show 422 errors.
- **APIs:** GET `/chainsystems/:id`, POST `/chainsystems`, PUT `/chainsystems/:id`.
- **Navigation after save:**
  - Create: back to the list.
  - Update: to `/admin/chain-systems/:id/stores` for 99, or to `/admin/chain-system/stores` for others.

#### Chain System Detail shell: `ChainSystemDetailPage` (`features/chainSystem/pages/DetailPage.tsx`, prop `detailType`)
| Path | detailType | Screen / roles |
|---|---|---|
| `/admin/chain-systems/:id/stores` | store | CMS0050A, not in the screen map (all roles) |
| `/admin/chain-system/stores` | store | CMS0050A plus `accessRoles` [01] |
| `/admin/chain-systems/:id/managers` | manager | CMS0050B, [99, 01] |
| `/admin/chain-system/stores/managers` | manager | CMS0050B plus `accessRoles` [01] |

- **Header card:**
  - Back: shown only to 99.
  - Attribute list: shown to 01 and 99. Goes to `/admin/chain-systems/:id/attributes` (99) or `/admin/chain-system/stores/attributes` (01).
  - Edit: goes to the chain edit page.
- **Detail rows:**
  - company name, phone, address, created at.
  - start month: hidden for 99.
  - trouble display type: shown only to 99.
  - payment method: hidden for 99. Includes a **"Change payment method"** button that opens the `FlowPayment` modal (`features/payment`).
  - automatching, asset, and chatbot flag icons.
- **Store / Manager switcher** (`components/StoreAndManagerInfo.tsx`): two full-width buttons, "Chain store" and "Chain manager". These are not real tabs: the button for the current view is disabled, and the other one navigates.
- **Body:** the embedded Store List or Manager List, described below.
- **API:** GET `/chainsystems/:id`.

#### Chain Store List (embedded, `features/chainSystem/pages/stores/ListPage.tsx`)
- **Filter** (`components/stores/FilterForm.tsx`):
  - `storeName`, `phoneNumber`, `prefecture`, `address`, `staffName`, `staffPhoneNumber`.
  - `group`: shown only to 01.
  - last login from/to, created from/to, `numberItem`.
  - One multi-select per chain attribute, sent as `attributeValueIds`.
- **Table columns:**
  - No, store name, phone, email, zipcode, prefecture, address.
  - payment method, login ID, acceptable IP.
  - groups: shown only to 01.
  - last login, automatching, created at, Edit.
- **Toolbar buttons:**
  - **99 only:**
    - Export symptom IDs (`/chainsystems/:id/export-symptoms`, confirm AMSG00043_1).
    - Download symptoms (`/stores/export-symptoms`).
    - Upload symptoms (goes to `/admin/chain-systems/:id/stores/import-symptoms`).
    - Import (goes to `/admin/chain-systems/:id/stores/import`).
    - Create (goes to `/admin/chain-systems/:id/stores/create`).
  - **All roles:**
    - Export attributes (`/extra-attributes/download-attribute-list`).
    - Import attributes (goes to the attribute import page).
    - Download (`/stores/download-store-list`).
- **Delete:** the button is commented out.
- **APIs:** GET `/stores?chainSystemId=…`, GET `/extra-attributes/:chainSystemId`.
- **Navigation:** clicking a row opens the store detail. Edit opens the store edit page for the user's role.

#### Chain Store Create / Edit: `ChainSystemStoreCreateOrUpdatePage` (`features/chainSystem/pages/stores/CreateOrUpdatePage.tsx`)
| Path | Screen / roles |
|---|---|
| `/admin/chain-systems/:id/stores/create` | CMS0054, [99] |
| `/admin/chain-systems/:id/stores/:storeId/edit` | CMS0056, [99] |
| `/admin/chain-system/stores/edit` | CMS0056A, [02] (the user's own store) |
| `/admin/chain-system/stores/:storeId/edit` | CMS0056A_1, [01] |

- **Main fields:**
  - `loginId`: read-only unless the user is 99.
  - `password`: shown only to 99, and required only on create.
  - `storeName`, `phoneNumber`, `email`, `zipcode`, `prefectures`, `address1`: required.
  - `address2`, `businessTime`, `attribute1`, `attribute2`.
  - **Staff list:** at least one required. Shown as cards. Add or edit through `StaffCreateOrUpdateModal` (`features/staff`); delete shows confirm AMSG00042.
  - `fixedAmount` and `isAutoApprovalContinue`.
  - `acceptableIp`.
  - `notificationFlag`.
  - `automatchingFlag`: disabled unless the user is 99.
- **Fields shown only to 99:**
  - `isAllowSelectWorker`.
  - `isAllowApproveEstimate`: disabled when the store is in an approver list (warning AMSG00125).
  - `isAllowPayment`.
  - Progress-email block:
    - `isSendProgressEmail`.
    - Timing switches: createNewTrouble, createContinueTrouble, submitEstimation, approvedEstimate, submitReport, payment, paidCancel, freeCancel.
    - Email list (up to 10), edited through `EmailCreateOrUpdateModal` (`features/emails`).
- **Shown only to 01:** `groupIds`, a multi-select loaded from GET `/groups/all`.
- **Attributes section:** one select per attribute.
- **Approval settings** (shown when `canApproveEstimate` and not creating):
  - `isApproverList`.
  - `approveType`: personal / class / price / level.
  - `isIncludeTax`: for the price type.
  - Approver table (`components/stores/ApprovalCreateOrUpdate.tsx`):
    - Pick from GET `/stores/:storeId/approver-list`, reorder up and down, and delete.
    - For the price type: min/max amount, "no limit", and out-of-scope notification.
    - Validation requires at least one approver. The price type also requires a "no limit" row.
- **Save:**
  - Shows confirm AMSG00040.
  - For users other than 99, the `isAllow*` and progress-email fields are removed from the payload.
  - POST `/stores` (create) or PUT `/stores/:id` (update).
- **Quirk:** 02 opens the page in "create" mode (there is no `:storeId`), but the save still updates `auth.chainStoreId`.
- **APIs:**
  - GET `/stores/:id`.
  - GET `/extra-attributes/:chainSystemId`.
  - GET `/stores/:storeId/approver-list`.
  - GET `/groups/all`.

#### Chain Store Detail: `ChainSystemStoreDetailPage` (`features/chainSystem/pages/stores/DetailPage.tsx`)
| Path | Screen / roles |
|---|---|
| `/admin/chain-systems/:id/stores/:storeId/detail` | CMS0055, [99] |
| `/admin/chain-system/stores/detail` | CMS0055A, [02] (the user's own store) |
| `/admin/chain-system/stores/:storeId/detail` | CMS0055A_1, [01] |

- **Rows shown to all roles:**
  - login ID, last login, store name, phone, email, zipcode, prefecture, address, business time, attribute1/2.
  - **Staff:** a count badge plus a Detail button that opens `StaffListPage` in an `AppModal`.
  - fixed amount, acceptable IP.
  - notification flag.
  - created at (shown twice).
  - automatching.
- **Rows shown only to 01:** groups.
- **Rows shown only to 99:** `isAllow*` flags.
- **Rows shown to approvers:** approver-list settings and the approver table.
- **Progress email:** shown only to 99. Includes a Detail button that opens `EmailListModal`.
- **Payment method:** hidden for 99. Includes "Change payment method", which opens `FlowPayment` at the `ChangePaymentMethod` step.
- **Attribute badges.**
- **Buttons:**
  - Back: hidden for 02.
  - Edit: goes to the edit page for the user's role.
- **API:** GET `/stores/:id`.

#### Chain Store Import: `/admin/chain-systems/:id/stores/import` (CMS0057, [99])
- **Component:** `ChainSystemStoreImportPage` (`pages/stores/ImportPage.tsx`).
- **UI:** an `AppUploadFileHolder` that shows 422 errors.
- **API:** POST multipart `/stores/import` with `{chainSystemId, file}`.
- **Navigation:** Back returns to the store list.

#### Chain Store Import Symptoms: `/admin/chain-systems/:id/stores/import-symptoms` (CMS0057A, [99])
- **Component:** `ChainSystemStoreImportSymptomsPage` (`pages/stores/ImportSymptomsPage.tsx`).
- **UI:** CSV upload.
- **API:** POST multipart `/stores/import-symptoms`.

#### Chain Estimation Category: `/admin/chain-systems/:id/est-categories/create`, `.../:estCategoryId/edit`, `.../:estCategoryId/detail` (no guard)
- **Create / edit:** `ChainSystemEstimationCategoryCreateOrUpdatePage` (`pages/estimationCategories/CreateOrUpdatePage.tsx`). It wraps the Estimation Category form.
  - Fields: largeCategory, label, amount, workerAppShowStatus.
  - APIs: GET/POST/PUT `/estcategories`.
- **Detail:** `ChainSystemEstimationCategoryDetailPage` (`pages/estimationCategories/DetailPage.tsx`).
  - API: GET `/estcategories/:id`.
- **Navigation:** Back returns to `/admin/chain-systems/:id/edit`.

#### Store Manager List (embedded, `features/chainSystem/pages/managers/ListPage.tsx`)
- **Filter:** `userName`, `phoneNumber`, last login from/to, created from/to, `numberItem`.
- **Table columns:** No, user name, representative store, phone, email, number of stores in charge, login ID, acceptable IP, last login, created at, Edit.
- **Buttons:**
  - Download: GET `/managers/download-store-manager-list`, run as an async job.
  - Import: shown only to 99. Goes to `/:id/managers/import`.
  - Create: shown only to 99. Goes to `/:id/managers/create`.
- **API:** GET `/managers`.
- **Navigation:** clicking a row opens the manager detail.

#### Store Manager Create / Edit: `pages/managers/CreateOrUpdatePage.tsx`
| Path | Screen / roles |
|---|---|
| `/admin/chain-systems/:id/managers/create` | `ChainSystemStoreManagerCreatePage`, CMS0057, [99] |
| `/admin/chain-systems/:id/managers/:managerId/edit` | `ChainSystemStoreManagerEditPage`, CMS0059, [99] |
| `/admin/chain-system/stores/managers/:managerId/edit` | CMS0059A, [01] |

- **Fields:**
  - `loginId`: editable only by 99. The check uses the `chainStore.canEdit` flag.
  - `password`: shown only to 99, and required on create.
  - `userName`, `phoneNumber`, `email`: required.
  - `storeList`: multi-select loaded from GET `/stores/all?isAllStoreInChain=true`.
  - `acceptableIp`.
  - `isAllowSelectWorker`, `isAllowApproveEstimate`, `isAllowPayment`: shown only to 99. Setting approve to "deny" forces payment to "deny".
  - `notificationFlag`.
- **Save:** confirm AMSG00040, then POST `/managers` or PUT `/managers/:id`.
- **Navigation after save:** create returns to the list; update goes to the manager detail.

#### Store Manager Detail: `/admin/chain-systems/:id/managers/:managerId/detail` (CMS0058, [99]) and `/admin/chain-system/stores/managers/:managerId/detail` (CMS0058A, [01])
- **Component:** `ChainSystemStoreManagerDetailPage` (`pages/managers/DetailPage.tsx`).
- **Rows:**
  - login ID, last login, name, phone, email.
  - stores in charge: chips in the form "name (loginId)".
  - IP.
  - **Representative store:** an inline select with **Save** and **Clear** buttons. Both call PUT `/managers/:id/representative-stores`.
  - allow flags: shown only to 99.
  - notification, created at.
- **API:** GET `/managers/:id`.
- **Navigation:** Back and Edit buttons.

#### Store Manager Import: `/admin/chain-systems/:id/managers/import` (CMS0057, [99])
- **Component:** `ChainSystemStoreManagerImportPage`.
- **API:** POST multipart `/managers/import` with `{chainSystemId, file}`.

#### Attributes List: `/admin/chain-systems/:id/attributes` (CMS0060A, [99]) and `/admin/chain-system/stores/attributes` (CMS0060C, [01])
- **Component:** `ChainSystemAttributesListPage` (`pages/attributes/ListPage.tsx`).
- **Table** (not paginated): name, value badges, Edit/Delete.
- **Create:**
  - At 20 attributes or more (`MAX_ATTRIBUTES`), an info modal ("exceedAttributes") opens instead.
  - Otherwise `AttributeFormModal` opens.
- **`AttributeFormModal`** (`components/attributes/AttributeFormModal.tsx`):
  - `name`: required, max 50.
  - `values[]`: each unique, max 50. Reorder by dnd-kit drag-and-drop; add and remove rows.
  - Cancel asks for confirmation if the form is dirty.
  - POST `/extra-attributes` or PUT `/extra-attributes/:id`.
- **Delete:** confirm, then DELETE `/extra-attributes/:id`.
- **API:** GET `/extra-attributes/:chainSystemId`.
- **Navigation:** Back returns to the store list for the user's role.

#### Attributes Import: `/admin/chain-systems/:id/attributes/import` (CMS0060B, [99]) and `/admin/chain-system/stores/attributes/import` (CMS0060D, [01])
- **Component:** `ChainSystemAttributesImportPage` (`pages/attributes/ImportAttributesPage.tsx`).
- **API:** POST multipart `/extra-attributes/import` with `{chainSystemId, file}`.

#### Chain modals used by other modules (no route of their own)
- **`ChainSystemStoreSelectModal`** (`pages/stores/SelectModal.tsx`):
  - xl modal with a store filter and table. Supports single or multiple selection, check/uncheck all, and an optional "Bulk create" button (used for Q&A).
  - APIs: GET `/stores`, GET `/stores/search-all-id`.
  - Used by the trouble modals and by Question detail.
- **`ChainSystemStoreSelectStaffModal`** (`pages/stores/SelectStaffModal.tsx`):
  - Staff picker.
  - API: GET `stores/:id/staffs`.
- **Dead code:** `pages/stores/SelectModalQuestion.tsx` and `components/stores/StaffCreateOrUpdateModal.tsx` are not imported anywhere.

### Individual Accounts

#### Individual List: `/admin/individuals` (CMS0080, [99])
- **Component:** `IndividualListPage` (`features/individualAccount/pages/ListPage.tsx`).
- **Filter:** `searchCompanyName`, dateFrom/To, `numberItem`.
- **Table columns:** No, company name, login ID, store count, created at.
- **Button:** Download.
- **APIs:** GET `/individuals`, download `/individuals/export`.
- **Navigation:** clicking a row opens `/admin/individuals/:id/detail`.

#### Individual Detail: `/admin/individuals/:id/detail` (CMS0081, [99])
- **Component:** `IndividualDetailPage` (`pages/DetailPage.tsx`).
- **Rows:** company name, agency store name, login ID, last login, created at.
- **Embedded `IndividualStoreListPage`** (`pages/store/ListPage.tsx`):
  - Filter: store name/phone, dates, numberItem.
  - Table columns: store name (with a representative badge), phone, email, zipcode, prefecture, address, business time, attributes, payment method, created at.
  - Download button.
  - Clicking a row opens `/admin/individuals/:businessId/store/:id/detail`.
- **APIs:**
  - GET `/individuals/:id`.
  - GET `/individuals/stores?individualBusinessId=…`.
  - download `/individuals/stores/export`.

#### Individual Store Detail: `/admin/individuals/:businessId/store/:id/detail` (CMS0082, [99])
- **Component:** `IndividualStoreDetailPage` (`pages/store/DetailPage.tsx`).
- **Rows:**
  - store info.
  - **Person in charge:** a count badge plus a Detail button that opens a `DataViewModal` contact table.
  - limit (`fixedAmount`), created at.
- **Bug:** the zipcode is rendered through `getLabelPrefectures`.
- **API:** GET `/individuals/stores/:id`.

#### Individual modals used by other modules
- **`IndividualStoreSelectModal`:** GET `/individuals/stores`, GET `individuals/stores/search-all-id`.
- **`IndividualSelectStaffModal`:** GET `/individuals/stores/:id/staffs`.
- Both are used by the trouble and question screens.

### Group (role 01)

#### Group List: `/admin/groups` (CMS0040, [01])
- **Component:** `GroupListPage` (`features/group/pages/ListPage.tsx`).
- **Filter:** `groupName`, dates, numberItem.
- **Table columns:** No, name, created at, Edit.
- **Button:** Create.
- **Delete:** the button is commented out.
- **API:** GET `/groups`.
- **Navigation:** clicking a row opens `/admin/groups/:id/detail`.

#### Group Create / Edit: `/admin/groups/create` (CMS0043, [01]) and `/admin/groups/:id/edit` (CMS0042, **not in the screen map**)
- **Component:** `GroupCreatePage` / `GroupEditPage` (`pages/CreateOrUpdatePage.tsx`).
- **Field:** `groupName`, required.
- **Save:** shows a confirm, then POST `/groups` or PUT `/groups/:id`.
- **Edit mode:** loads GET `/groups/:id`.
- **Navigation after save:** to the group detail.

#### Group Detail: `/admin/groups/:id/detail` (CMS0041, [01])
- **Component:** `GroupDetailPage`.
- **Rows:** name, created at.
- **Buttons:** Back, Edit.
- **API:** GET `/groups/:id`.

### Agent (role 99)

#### Agent List: `/admin/agents` (CMS0150, [99])
- **Component:** `AgentListPage` (`features/agent/pages/ListPage.tsx`).
- **Filter:** `searchNameAndPhone`, from/to, numberItem.
- **Table columns:** No, name, phone, description, address, QR code, created at, Edit.
- **Buttons:** Download (`/agents/export`), Create.
- **Delete:** commented out.
- **API:** GET `/agents`.

#### Agent Create / Edit: `/admin/agents/create` (CMS0153, [99]) and `/admin/agents/:id/edit` (uses CMS0150, [99])
- **Component:** `AgentCreatePage` / `AgentEditPage` (`pages/CreateOrUpdatePage.tsx`).
- **Fields:**
  - `storeName`: required.
  - `description`.
  - `phone`.
  - `address1`, `address2`.
  - `qrcode`: required, digits.
- **Save:** POST `/agents` or PUT `/agents/:id`.
- **Edit mode:** loads GET `/agents/:id`.
- A leave prompt guards unsaved changes.

#### Agent Detail: `/admin/agents/:id/detail` (CMS0151, [99])
- **Component:** `AgentDetailPage`.
- **Rows:** name, description, phone, address, QR code, image, created at.
- **API:** GET `/agents/:id`.

### Possible bugs and permission gaps in this module
1. **Shared permission object.** For roles 01 and 02, the `chainPermission` parts all reference the same module-level `FunctionPermissionDenyAll` object; for 99 they reference `FunctionPermissionAlowAll`. Assigning a flag therefore mutates the global constant. Flags can leak between roles when users log in one after another in the same SPA session.
2. **Stale IDs.** The `useMemo` in `useChain` does not include `paramChainSystemId` or `paramStoreId` in its dependencies, so IDs can go stale.
3. **Open store list.** `/admin/chain-systems/:id/stores` (CMS0050A) is open to every role at route level. For roles 03 and 04 it falls back to the master chain ID.
4. **Edit button ignores `canEdit`.** The store list's Edit button renders regardless of `canEdit`.
5. **Display bugs:**
   - Individual store detail renders the zipcode as a prefecture.
   - Store detail shows the created-at row twice.
   - The approver-list check compares an approver ID with the store ID.

---
## Module: Asset Management, Asset Column, Categories, Estimation Categories

Only `features/category` uses a saga (`categorySaga.ts`). The asset, column and estimation-category screens call their API wrappers directly, either in the component or through hooks (`useAsset.ts`, `useColumn.ts`). The wrappers are `api/apiAssets.ts`, `api/apiColumn.ts`, `api/apiCategory.ts` and `api/apiEstimationCategory.ts`.

**`myStore`** (`appMaster.myStore`, loaded with **GET `/asset/my-store`**) supplies the chain system ID, `userRole` and chain store for most asset screens.

Duplicated screen ID values:
- `ASSET_MANAGEMENT_DETAIL`, `ASSET_COLUMN_LIST` and `ASSET_COLUMN_EDIT` all use `CMS01719`.
- `ASSET_MANAGEMENT_EDIT` and `ASSET_COLUMN_DETAIL` both use `CMS01729`.

None of these IDs are in `ScreenAccess`, so route-level access is open for all of them. They would collide if anyone later adds them to the map.

### Asset Management

#### Asset Chain System List: `/admin/asset-management/chains`
- **Component:** `AssetManagementChainSystemListPage`, `features/assetManagement/pages/ChainSystemListPage.tsx`
- **Purpose:** System admin entry point. Lists the chain systems that have an asset column configuration.
- **Guard:** On mount, a user who is not 99 is redirected to `/admin/asset-management`.
- **Filter:** Shared `features/column/components/FilterForm.tsx` with chainSystemName, dateFrom, dateTo, numberItem. The search condition is kept in `assetChainListSlice`.
- **Table:** No, chain system (sort `company_name`), registered (active/all), last editor (`updated_by`), edited date (`updated_at`), created date (`created_at`).
- **API:** **GET `/asset/list-column-management`**
- **Navigation:** Row opens `/admin/asset-management/chains/:chainSystemId`.

#### Asset List: `/admin/asset-management` and `/admin/asset-management/chains/:chainSystemId`
- **Component:** `AssetManagementListPage`, `features/assetManagement/pages/ListPage.tsx`
- **Purpose:** Paged asset list. The table columns are built dynamically from the chain's active asset column definitions.
- **Guards:**
  - A user who is not 99 and requests a URL with `:chainSystemId` is redirected to `/admin/asset-management`.
  - A 99 user without `:chainSystemId` is redirected to `/chains`.
  - A 99 user with the param gets "scoped" mode: the chain filter is locked and hidden, and the title shows the company name.
  - Download, Upload and Create are shown only to 99, 01 and 02. Edit on each row is shown to everyone.
- **Filter:** chainSystemName (hidden when scoped), storeName, assetCode, assetName, manufacturerName, model, serialNumber, installationDelivery from/to, manufacturingDate from/to (month), additionalInformation, dateFrom/To, numberItem.
- **Table:** Columns come from `data[0].items`. Sortable columns are name, code, chain_store_id and chain_system_id. Option lists longer than 5 get a "…" tooltip. Images show as thumbnails and files as download links.
- **API:**
  - **GET `/asset`** (list)
  - **GET `/asset/chain-systems/:chainSystemId/download-asset-list`** (download)
  - **GET `/chainsystems/:id`** (scoped title)
- **Navigation:**
  - Row opens `/admin/asset-management/:id/detail`.
  - Edit opens `/:id/edit`.
  - Upload opens `/chains/:chainSystemId/import` or `/import`.
  - Create opens `/:chainSystemId/create` or `/create`.

#### Asset Create / Edit: `/admin/asset-management/create`, `/admin/asset-management/:chainSystemId/create`, `/admin/asset-management/:id/edit`
- **Components:** `AssetManagementCreatePage` and `AssetManagementEditPage`. Both use `features/assetManagement/pages/CreateOrUpdatePage.tsx`, which wraps `CreateOrUpdateForm.tsx`.
- **Purpose:** A dynamic form built from the chain's asset column definition.
- **How the definition is loaded:**
  - Role 05 loads the asset detail when there is an `assetId`. Otherwise it calls `getColumnDetail(chainSystemId)`.
  - For all other roles:
    - Edit loads the asset detail.
    - Create by a `myStore.userRole` of 99 or 98 uses the chainSystemId URL param.
    - Create by any other role uses `myStore.chainSystem.id` and pre-fills the store.
  - **Possible bug:** a 99 user on plain `/create` ends up calling `getColumnDetail(NaN)`.
- **Guard:** The "Select chain store" button needs `canSelectChainStore` and a `userRole` other than '03'. A leave prompt runs when the form is dirty.
- **Common fields:**
  - assetName: required, max 256
  - storeId: required; picked through the `SelectModalStore` modal
  - images
  - manufacturerName: with autocomplete
  - modelNumber and serialNumber: half-width only
  - installationDate: yyyy/MM/dd
  - manufacturingDate: yyyy/MM
  - additionalNotes
- **Custom field types:**
  - text (maxLength)
  - number (integer or float, with min/max)
  - select (multiple)
  - radio
  - checkbox
  - file or image
  - time (year, yearMonth, date or datetime)
- **Save:** Shows confirm AMSG00040, then submits `{assetColumnManagementId, chainStoreId, assetValues[]}`.
- **API:**
  - **GET `/asset/column-management?chainSystemId=`**
  - **GET `/asset/:id`**
  - **POST `/asset`**
  - **PUT `/asset/:id`**
  - **GET `/asset/suggestion-manufacturer?keyword=`** (debounced 500 ms)
  - File upload in three steps: **POST `/asset/file`** returns a presigned URL, then a **PUT** to S3, then **PUT `/asset/file`** to confirm
  - Store picker: **GET `/stores`** and **GET `/stores/search-all-id`**
- **Navigation:**
  - After an edit, goes to the detail page.
  - After a create, goes to the scoped chain list or `/admin/asset-management`.
  - Back goes to the detail page if `location.state.fromDetail` is set.

#### Asset Detail: `/admin/asset-management/:id/detail`
- **Component:** `AssetManagementDetailPage`, `features/assetManagement/pages/DetailPage.tsx`
- **Purpose:** Read-only view of the asset values, plus its **trouble history**.
- **UI:**
  - `AppDetailRow` for every active key. Options show as badges, images through `AppImage` (HEIC files as a download link), and files as links.
  - A "Trouble history" section (`components/HistoryTrouble.tsx`):
    - The trouble `FilterForm`.
    - `TroubleNotices`, shown to everyone except 99 and asset-enabled 01/02.
    - `AppTabs` with two tabs: normal troubles (`TroubleListTable`) and automatching troubles (`AutomatchingTroubleListTable`).
    - Modals: `AutomatchingCandidaciesModal`, `TroubleCandidaciesModal` and `ViewAssetsModal`.
    - Only 99 sees the rating and comment columns and the display-type toggle.
- **API:**
  - **GET `/asset/:id`**
  - **GET `/troubles?assetId=`** or **GET `/automatching/troubles`**
  - **GET `troubles/notice`**
  - **GET `/troubles/:id`**
- **Navigation:**
  - Edit opens `/:id/edit` with `{fromDetail:true}`.
  - A trouble row opens `/admin/troubles/:id/detail?assetId=<id>`.
  - Back goes to the scoped list (99) or `/admin/asset-management`.

#### Asset Import: `/admin/asset-management/import` and `/admin/asset-management/chains/:chainSystemId/import`
- **Component:** `AssetManagementImportAssetsPage`, `features/assetManagement/pages/ImportAssetsPage.tsx`
- **Guard:** A user who is not 99 and requests a URL with the param is redirected away. 99 sees an admin notice and the scoped title.
- **UI:** `AppUploadFileHolder` that accepts Excel only and lists errors per row.
- **API:**
  - **POST `/asset/chain-systems/:chainSystemId/bulk-import`** (multipart). This is an async upload job.
  - **GET `/chainsystems/:id`**
  - `/asset/import` and `/asset/download-asset-list` are defined but not called anywhere.

### Asset Column (column master)

#### Asset Column List: `/admin/asset-column`
- **Component:** `AssetColumnListPage`, `features/column/pages/ListPage.tsx`
- **Guard:** No role check in the page itself. Only the sidebar limits it to 99.
- **Filter:** chainSystemName, dateFrom, dateTo, numberItem
- **Table:** No, chain system, registered (active/all), last editor, edited date, created date, Edit
- **API:** **GET `/asset/list-column-management`**
- **Navigation:** Row opens `/admin/asset-column/:chainSystemId/detail`. Edit opens `/:chainSystemId/edit`. Note that `:id` here is the chainSystemId.

#### Asset Column Detail: `/admin/asset-column/:id/detail`
- **Component:** `AssetColumnDetailPage`, `features/column/pages/DetailPage.tsx`
- **Purpose:** View a chain's column definition. This page is also the 01 sidebar target, with `:id` taken from the user's own chain.
- **Guard:** The preview-header Back button is shown only to 99.
- **UI:**
  - A "Preview area": an empty table whose headers are the active columns.
  - A "List area" table: No, column name, data type, setting detail, status, Edit. Common columns cannot be edited.
- **Modal:** `AddSelectItemModal` with `isDetail=true`. Saving from this modal **writes to the server immediately**.
- **API:**
  - **GET `/asset/column-management?chainSystemId=:id`**
  - **POST `/asset/column-management`** with `{chainSystemId, assetKeys:[{id|null,name,order,status,isRequired,isCommon,commonId,fieldType,validation,assetKeyOption}]}`
- **Navigation:** Back goes to the list. Edit opens `/:id/edit`.

#### Asset Column Edit: `/admin/asset-column/:id/edit`
- **Component:** `AssetColumnEditPage`, `features/column/pages/EditPage.tsx`
- **Purpose:** Add, edit, reorder (drag and drop) and delete columns, preview the result, then save everything at once.
- **UI:**
  - A preview header with Save, which is disabled until something changes.
  - A list area with Add and Preview.
  - `components/TableDragDrop.tsx`, built on dnd-kit. Each row has Edit, and unsaved rows also have Delete. Common columns are locked.
- **Dialogs:**
  - Save confirm (AMSG00040).
  - Delete confirm (AMSG00042). Delete removes the row locally only.
  - A leave prompt.
- **`AddSelectItemModal`** (`features/column/components/AddSelectItemModal.tsx`, size xl):
  - Name.
  - Type, with type-specific settings:
    - text: maxLength and placeholder
    - number: integer or float, minRange/maxRange, placeholder
    - select, radio, checkbox: up to 15 options, with no duplicates
    - file: image or file, allowed extensions, file count
    - time: year, yearMonth, date or datetime
  - Status can be changed only on saved columns. Saved columns let you edit only the name and status.
- **API:** **GET** and **POST `/asset/column-management`**
- **Navigation:** Back goes to `/:id/detail`.

### Categories (three-level work-category tree)

#### Categories: `/admin/categories` (CMS0120, not in the map; the sidebar limits it to 99)
- **Component:** `CategoriesListPage`, `features/category/pages/ListPage.tsx`
- **Reused in:**
  - Chain System Edit (`CategoryInfo`, with `isDraggable` and `chainSystemId`)
  - Question detail (`isQuestion`)
- **Purpose:** Browse and edit the large, medium and small categories. On this route the chain system is `auth.chainSystemId` or the master `WORK_CATEGORY_MASTER_CHAIN_SYSTEM_ID` (`isWorkMaster`).
- **Guards:**
  - The create and edit modals render only for 99.
  - Add buttons are shown to 99 when not in question mode:
    - Large: always
    - Medium: after a large category is selected
    - Small: after both a large and a medium category are selected
  - Non-99 users do not see hidden categories.
  - Delete is a stub.
  - Drag reordering only works when `isDraggable` is set.
- **UI:**
  - A `SelectedCategories` summary.
  - `AppTabs` with three tabs:
    - Large: a two-column grid of `CategoryItemBox` items with drag and drop.
    - Medium: `CategoryVirtualizedGrid`.
    - Small: `CategoryVirtualizedGrid`, with a "Select" button in question mode.
  - Each card shows an icon, `labelJa` and an isShow check.
  - Selections filter the next level on the client.
- **Saga and API** (`categorySaga.ts`):
  - **GET `largecategories?chainSystemId=`** returns all three levels.
  - **GET `smallcategories?mediumCategoryId=`**
  - The master large-category list is loaded only when the `chainSystemId` prop is given.
  - Reordering calls **POST `largecategories/order-number/:chainSystemId`** with `{id:[ids]}`.

#### Category editing modals (`features/category/components/`, size xl; opened by `CategoryActions.createOrUpdateCategory`)
- **`CreateOrUpdateLargeCategory.tsx`**
  - Fields:
    - labelJa, labelEn, labelZht and labelZhs (required)
    - url, isShow, iconImage
    - Required numbers: selectWorkRate, workRate, actualCostRate, elementRate, discountRate, storeTravellingCost, workerTravellingCost, storeSiteSurveyCost, workerSiteSurveyCost
    - `largeWorkCategoryMaster` select, required when the chain is not the master
  - API: **GET `largecategories/:id`**, **POST `largecategories`** (multipart), **POST `largecategories/:id`** with `_method=PUT`
- **`CreateOrUpdateMediumCategory.tsx`**
  - Fields: the four labels, url, isShow, iconImage
  - API: **GET/POST `mediumcategories`** and **POST `mediumcategories/:id`** with `_method=PUT`
- **`CreateOrUpdateSmallCategory.tsx`**
  - Fields:
    - `smallWorkCategoryMaster` select (when not the master)
    - The four labels, url, isShow, iconImage, description
    - selectWorkRate, plus workRate, elementRate and discountRate (1–200)
  - API: **GET/POST `smallcategories`** and **POST `smallcategories/:id`** with `_method=PUT`

#### Category selection modals (used by the trouble screens)
- **`pages/LargeSelectModal.tsx`** ("故障内容"):
  - **GET `largecategories?isShow&chainStoreId`**
  - **GET `${API_BASE_URL_TROUBLE}/qa_data/get_qa_category?chain_system_id=`**. This calls the trouble service and feeds the TroubleNavi entry.
- **`pages/MediumSelectModal.tsx`** and **`pages/SmallSelectModal.tsx`**: pickers for the medium and small levels.
- **Consumers:** `features/trouble/components/newTypes/WorkItemSelection.tsx` and `features/trouble/components/edits/SelectCategories.tsx`.

### Estimation Categories (quote work items)

#### Estimation Category List: `/admin/est-categories` (no route guard; the sidebar uses CMS0160 = [99])
- **Component:** `EstimationCategoryListPage`, `features/estimationCategory/pages/ListPage.tsx`. It can be reused through props such as `chainSystemId` and the `goTo*` callbacks, which the Chain System Edit page uses.
- **Default chain:** the master chain.
- **Filter:** label, largeCategory, workerAppShowStatus, dateFrom/To, numberItem. Large categories come from **GET `largecategories?chainSystemId=`** (appMaster saga).
- **Table:** No, large category, label, amount (¥), worker-app show status, Edit. Delete is a stub.
- **API:** **GET `/estcategories`**
- **Navigation:**
  - Create opens `/admin/est-categories/create`.
  - Row opens `/:estCategoryId/detail`.
  - Edit opens `/:estCategoryId/edit`.

#### Estimation Category Create / Edit: `/admin/est-categories/create` and `/admin/est-categories/:estCategoryId/edit`
- **Components:** `EstimationCategoryCreatePage` and `EstimationCategoryEditPage`, both `features/estimationCategory/pages/CreateOrUpdatePage.tsx`
- **Fields:**
  - largeCategory (required select)
  - label (required, max 256)
  - amount (required, ¥)
  - workerAppShowStatus (checkbox)
  - The payload also carries `chainSystemId`.
- **Save:** Shows confirm AMSG00040. A leave prompt is active.
- **API:** **GET `/estcategories/:id`**, **POST `/estcategories`**, **PUT `/estcategories/:id`**
- **Navigation:** After a create, `navigate(-1)`. After an edit, goes to the detail page.

#### Estimation Category Detail: `/admin/est-categories/:estCategoryId/detail`
- **Component:** `EstimationCategoryDetailPage`, `features/estimationCategory/pages/DetailPage.tsx`
- **UI:** Large category, label, amount and worker-app show status. Edit and Back buttons.
- **API:** **GET `/estcategories/:id`**

### Other modals and components in this module
- **`features/assetManagement/pages/SelectModal.tsx`** (`AssetSelectModal`): A full-size modal for searching and selecting assets, with a "Register new asset" button that opens `CreateOrUpdateModal`.
  - API: **GET `/asset`**
  - Used by the trouble components `StoreStaffCategoryEditModal`, `UpdateAssetModal`, `report/CreateModal` and `WorkItemSelection`.
- **`CreateOrUpdateModal.tsx`:** The asset form in a modal. It can lock the store to a fixed value.
- **`components/SelectModalStore.tsx`:** A chain store picker with a bulk-create mode.
- **`AssetUploadFileHolder`, `AssetFileHolder` (S3 presigned upload), `AssetUploadImagesHolder`, `AssetImageHolder`:** File and image slots.
- **`pages/SelectChainSystem.tsx`:** Not routed. It would call **GET `/chainsystems?assetFlag=1`**. It is probably dead code.

---
## Module: Sub Admin Information, Presets, Worker Company, Workers

**There are no sagas in these three features.** Pages call the `src/api/*.ts` wrappers directly (`async/await` in the component or in `use*.ts` hooks). The slices (`subAdminInformationSlice`, `workerCompanySlice`, `workerSlice`) only hold search conditions. The one saga involved is `appMasterSaga` (`appMasterActions.allLargeCategory`, which calls `GET largecategories?chainSystemId=…`). Small categories are derived on the client.

How export calls work:
- `appDownloadFile(url, params)` is a GET that returns a blob.
- `appDownloadFileWidthData(url, data)` is a POST that returns a blob.
- Async import and export jobs are polled through `useCommon.handleUploadJob` / `handleDownloadJob`, which call `GET /job-statuses/:jobId`.

How updates are sent:
- `update` in `apiSubAdminInformation`, `apiWorker` and `apiWorkerCompany` is a **POST** to the resource URL with `_method=PUT`.
- Preset `update` is a real **PUT**.

### Sub Admin

#### Sub Admin List
- **Route:** `/admin/sub-admin-information`. Screen `HQS-37`, roles [99, 98]. The duplicate key in `ScreenAccess` resolves to [99,98].
- **Component:** `SubAdminInformationListPage`, file `features/subAdminInformation/pages/ListPage.tsx`.
- **Purpose:** Search and list sub-admin accounts.
- **In-component role checks:** none. Download, Import, Create and Edit always render; the Create and Import routes are blocked for 98.
- **UI:**
  - `SearchBar` with `components/FilterForm.tsx`. Fields: `name`, `loginId`, `email`, `lastLoginAtFrom/To`, `dateFrom/To` (created), `numberItem`.
  - Buttons: Download, Import, Create.
  - `AppDataTable` (sortable, paginated). Columns: No, name, email, a "chain store list" button, a "worker list" button, loginId, lastLoginAt, createdAt, Edit. Clicking a row opens the detail page.
- **Modals:**
  - `SelectModalWorker` (`components/selectModalWorker/SelectModalWorker.tsx`, read-only). It calls `GET /workers?companyName&address&phoneNumber&numberItem&sudAdminId`. The param `sudAdminId` is a typo.
  - `ChainStoreListModal` (`components/chainStoreList/ChainStoreListModal.tsx`, read-only, xl). It calls `GET /users/sub-admin/:id/stores`. Filter: companyName, storeName, phoneNumber. Columns: company, store, phone, prefecture, address, createdAt.
  - `SelectModalStore` is imported but never rendered.
- **API:**
  - `GET /users/sub-admin` (list).
  - `GET /users/sub-admin/export` (Download button, blob).
- **Navigation:**
  - `/admin/sub-admin-information/:id/detail` (row click).
  - `/:id/edit`.
  - `/create`.
  - `/import`.

#### Sub Admin Create
- **Route:** `/admin/sub-admin-information/create`. Screen `HQS-46`, roles [99].
- **Component:** `SubAdminInformationCreatePage`, file `features/subAdminInformation/pages/CreateOrUpdatePage.tsx`. Create mode applies when there is no `:id`.
- **Purpose:** Create a sub-admin account, including its company info and rating configuration.
- **Role checks:** `isSubAdmin()` disables `loginId` and `workerIds`, hides `password`, and redirects to `/admin/sub-admin-information/detail` after save.
- **Form** (react-hook-form + yup, `AppDetailRow mode="edit"`):
  - `loginId` (required).
  - `password` (required only on create).
  - `name` (required, max 256).
  - `phoneNumber` (required).
  - `email` (max 128).
  - `workerIds`: `AppSelectMultiple` with infinite scroll, loading `GET /workers` in pages of 30.
  - Company section: `companyName` (required), `address` (required), `noteEstimate`, `noteReport`.
  - `isEnableRating` (radio). When it is on, two mutually exclusive switches appear: `isApplyRatioGlobar` and `isCustomRating`.
  - When `isCustomRating` is on, these are required: `selectWorkRate`, `workRate`, `actualCostRate`, `elementRate`, `discountRate` (1–200 %), `storeTravellingCost`, `workerTravellingCost`, `storeSiteSurveyCost`, `workerSiteSurveyCost`.
  - Hidden row (`isShow:false`) for the symptom file: export `GET /users/sub-admin/export-symptom?userId` (a job) and an automatic CSV import `POST /users/sub-admin/import-symptom` (multipart `{userId,file}`).
- **Actions:**
  - Save opens a confirm dialog (`AMSG00040`). It is disabled until the form is dirty.
  - Back is `navigate(-1)`.
  - Unsaved-change prompt (`useCallbackPrompt`).
- **API:**
  - `POST /users/sub-admin` (`symptoms` and `chainStores` are forced to `[]`).
  - `GET /workers`.
- **Modals:** `components/worker/SelectModal.tsx` is mounted, but its open flag is never set, so it is unreachable.
- **Navigation:** after success, goes to `/admin/sub-admin-information/:newId/detail`.

#### Sub Admin Edit
- **Routes:**
  - `/admin/sub-admin-information/:id/edit`. Screen `HQS-48`, roles [99, 98].
  - `/admin/sub-admin-information/edit`, the self route.
- **Component:** `SubAdminInformationEditPage`, the same file as Create.
- **Behavior:**
  - `isCreate = !id`, so **the param-less `/edit` route renders in CREATE mode** and is effectively broken.
  - Role 98 actually arrives at `/:ownUserId/edit` from Detail.
  - The client does not check ownership; the backend must enforce it.
- **Role checks:** same as Create.
- **API:**
  - `GET /users/sub-admin/:id` (prefill).
  - `POST /users/sub-admin/:id` with `_method=PUT`.
  - `GET /workers`.
- **Navigation:** after success, goes to `/:id/detail` (or `/detail` for 98).

#### Sub Admin Detail
- **Routes:**
  - `/admin/sub-admin-information/:id/detail`. Screen `HQS-48`, roles [99, 98].
  - `/admin/sub-admin-information/detail`, the self route (uses `auth.user.id`).
- **Component:** `SubAdminInformationDetailPage`, file `features/subAdminInformation/pages/DetailPage.tsx`.
- **Purpose:** Read-only view of a sub admin, plus the embedded preset list.
- **UI:**
  - loginId, lastLoginAt, name, phoneNumber, email.
  - Workers (badges).
  - Company: companyName, address, noteEstimate, noteReport.
  - createdAt.
  - enableRating, the "apply GlobaR ratio" row, and the custom-ratio block (9 fields).
  - Back shows only when the URL has `:id`. Edit always shows.
  - The embedded **Preset List** (below) renders when `item.subAdminId` exists.
- **API:** `GET /users/sub-admin/:id`. The response field `subAdminId` (the sub_admin table id) is different from the user id.
- **Navigation:**
  - Back goes to the list.
  - Edit goes to `/:id/edit`.
  - Nothing links to `/:id/import-symptom`.

#### Embedded Preset List (inside Sub Admin Detail, no route of its own)
- **File:** `features/subAdminInformation/pages/subAdminPreset/ListPage.tsx`. Props: `subAdminId`, `currentUserId`.
- **Role checks:** `isSystemAdmin()` shows the Create, Edit and Delete buttons.
- **UI:**
  - `SearchBar` (`components/subAdminPreset/FilterForm.tsx`: `title`, `numberItem`).
  - Table columns: No, ID, title, description, chainSystem name, a "store list" button, Edit/Delete.
- **Modals:**
  - `ChainStoreListModal` in preset mode: `GET /sub-admins/:subAdminId/presets/:presetId/stores`.
  - Delete confirm (`AMSG00042`).
- **API:**
  - `GET /sub-admins/:subAdminId/presets`.
  - `DELETE /sub-admins/:subAdminId/presets/:presetId`.
- **Navigation:**
  - Create goes to `/admin/sub-admin-information/:userId/presets`.
  - Edit goes to `/:userId/presets/:presetId`.
  - Row click goes to `/:userId/presets/:presetId/detail`.

#### Sub Admin Bulk Import
- **Route:** `/admin/sub-admin-information/import`. Screen `HQS-56`, roles [99].
- **Component:** `SubAdminInformationImportPage`, file `features/subAdminInformation/pages/ImportPage.tsx`.
- **UI:** `AppUploadFileHolder` and Back, with a 422 error list.
- **API:** `POST /users/sub-admin/import` (multipart `file`).
- **Navigation:** Back or success goes to the list.

#### Sub Admin Import Symptom
- **Route:** `/admin/sub-admin-information/:id/import-symptom`. Screen `HQS-66` is not in the map; route `accessRoles: [99]`.
- **Component:** `SubAdminInformationImportSymptomPage`, file `features/subAdminInformation/pages/ImportSymptomPage.tsx`.
- **UI:** CSV `AppUploadFileHolder`. It handles 422 errors and shows `AMSG00133_2` on network errors.
- **API:** `POST /users/sub-admin/import-symptom` (multipart `{userId,file}`), then polling `GET /job-statuses/:jobId`.
- **Navigation:** goes to `/:id/detail`. No screen links here; it is reachable only by URL.

### Sub Admin Presets
All preset pages use `useSubAdminPreset` (`features/subAdminInformation/useSubAdminPreset.ts`). The flow on each page is:
1. Call `GET /users/sub-admin/:userId`, which resolves `subAdminId`.
2. Redirect to NOT_FOUND if the user id is NaN or `subAdminId` is missing.
3. Call `/sub-admins/:subAdminId/...` endpoints.

#### Preset Create / Edit
- **Routes:**
  - Create: `/admin/sub-admin-information/:userId/presets`.
  - Edit: `/admin/sub-admin-information/:userId/presets/:presetId`.
  - Screen `CMS1388_1`, roles [99].
- **Component:** `SubAdminPresetCreateOrUpdatePage`, file `features/subAdminInformation/pages/subAdminPreset/CreateOrUpdatePage.tsx`.
- **Form:**
  - `title` (required, excludes system characters).
  - `description` (textarea, max 500).
  - Edit only: chainSystem name (read-only) and a "store list" button that opens `ChainStoreListModal`.
- **Actions:** Save opens a confirm dialog (`SAP000001`). Pressing Enter submits. Unsaved-change prompt.
- **API:**
  - `GET /users/sub-admin/:userId`.
  - `GET /sub-admins/:subAdminId/presets/:presetId` (edit).
  - `POST /sub-admins/:subAdminId/presets` (create).
  - `PUT /sub-admins/:subAdminId/presets/:presetId` (update).
- **Navigation:**
  - After success, goes to the preset detail.
  - Back goes to the preset detail (edit) or to the sub-admin detail (create).

#### Preset Detail
- **Route:** `/admin/sub-admin-information/:userId/presets/:presetId/detail`. Screen `CMS1388_2`, roles [99, 98].
- **Component:** `SubAdminPresetDetailPage`, file `features/subAdminInformation/pages/subAdminPreset/DetailPage.tsx`.
- **Role checks:** `isSystemAdmin()` controls:
  - the Edit buttons,
  - the store import/export row,
  - the symptom import/export row,
  - where Back goes: admin to `/:userId/detail`, otherwise to `/admin/sub-admin-information/detail`.
- **UI:**
  - title, description, chainSystem name.
  - "store list" button (opens the modal).
  - Admin rows:
    - Stores: Export CSV (confirm `AMSG00043_1`) and Import.
    - Symptoms: Export CSV and Import. Symptom Import is disabled when the preset has no stores.
- **API:**
  - `GET /users/sub-admin/:userId`.
  - `GET /sub-admins/:subAdminId/presets/:presetId`.
  - `POST .../presets/:presetId/export-store` (blob).
  - `POST .../presets/:presetId/export-symptom` (blob).
  - `GET .../presets/:presetId/stores`.
- **Navigation:**
  - Edit goes to the preset edit page.
  - Import store goes to `.../import-store`.
  - Import symptom goes to `.../import-symptom`.

#### Preset Import Store
- **Route:** `/admin/sub-admin-information/:userId/presets/:presetId/import-store`. Screen `CMS1388_3`, roles [99].
- **Component:** `SubAdminPresetImportStorePage`, file `features/subAdminInformation/pages/subAdminPreset/ImportStorePage.tsx`.
- **UI:**
  - CSV upload with a `ModeImport` selector (default Upsert).
  - On a job failure it shows an error list per chain system, each with an error-file link and the store count.
- **API:** `POST /sub-admins/:subAdminId/presets/:presetId/import-store` (multipart `{file, mode}`), then job polling.
- **Navigation:** goes to the preset detail.

#### Preset Import Symptom
- **Route:** `.../presets/:presetId/import-symptom`. Screen `CMS1388_4` is **not in the map**, so all roles pass.
- **Component:** `SubAdminPresetImportSymptomPage`, file `features/subAdminInformation/pages/subAdminPreset/ImportSymptomPage.tsx`.
- **Role checks:** none. The entry button is admin-only, but any role can open the URL.
- **UI:** CSV upload with the mode selector.
- **API:** `POST /sub-admins/:subAdminId/presets/:presetId/import-symptom` (multipart `{file, mode}`), then job polling.
- **Navigation:** goes to the preset detail.

### Worker Company

#### Worker Company List
- **Route:** `/admin/worker-company`. Screen `HQS-50`, roles [99].
- **Component:** `WorkerCompanyListPage`, file `features/workerCompany/pages/ListPage.tsx`.
- **UI:**
  - Filter: `staff`, `phoneNumber`, `lastLoginAtFrom/To`, `dateFrom/To`, `numberItem`.
  - Buttons: Download, Import, Create.
  - Table columns: No, staff, phone, email, a "作業員一覧" (worker list) button, loginId, lastLoginAt, createdAt, Edit.
- **Modals:** `WorkerCompanySelectModal` (`features/workerCompany/pages/selectModal/SelectModal.tsx`, read-only). It calls `GET /workers?companyName&address&phoneNumber&numberItem&workerCompanyId`. Columns: company, phone, staff, zipcode, prefecture, address, loginId, automatching, lastLoginAt, createdAt.
- **API:**
  - `GET /worker-company`.
  - `GET /worker-company/export/list` (blob).
- **Navigation:** `/:id/detail`, `/:id/edit`, `/create`, `/import`.

#### Worker Company Create
- **Route:** `/admin/worker-company/create`. Screen `HQS-38`, roles [99].
- **Component:** `WorkerCompanyCreatePage`, file `features/workerCompany/pages/CreateOrUpdatePage.tsx`.
- **Role checks:** `isWorkerCompany()` disables `loginId` and `workerListId`, hides `password`, and redirects to `/admin/worker-company/detail`.
- **Form:**
  - `loginId` (required).
  - `password` (required on create).
  - `staff` (required).
  - `phoneNumber` (required).
  - `email`.
  - `workerListId`: multi-select with infinite scroll, loading `GET /workers/get/all-id?page&numberItem=30`. It is submitted as `workerList: [{workerId}]`.
- **On mount:** dispatches `allLargeCategory`, which calls `GET largecategories`.
- **Actions:** confirm on save (`AMSG00040`), Back, unsaved-change prompt.
- **API:** `POST /worker-company` (multipart).
- **Navigation:** goes to `/:newId/detail`.

#### Worker Company Edit
- **Routes:**
  - `/admin/worker-company/:id/edit`. Screen `HQS-53`, roles [99, 05].
  - `/admin/worker-company/edit`, the self route.
- **Component:** `WorkerCompanyEditPage`, the same file as Create.
- **Behavior:** the param-less `/edit` route renders as **create**, the same issue as Sub Admin Edit. Role 05 uses `/:ownId/edit`. There is no ownership check on the client.
- **API:**
  - `GET /worker-company/:id`.
  - `POST /worker-company/:id` with `_method=PUT` (multipart).
  - `GET /workers/get/all-id`.
- **Navigation:** admin goes to `/:id/detail`; role 05 goes to `/admin/worker-company/detail`.

#### Worker Company Detail
- **Routes:**
  - `/admin/worker-company/:id/detail`. Screen `HQS-53`, roles [99, 05].
  - `/admin/worker-company/detail`, the self route (uses `auth.user.workerCompanyId`).
- **Component:** `WorkerCompanyDetailPage`, file `features/workerCompany/pages/DetailPage.tsx`.
- **UI:** loginId, lastLoginAt, staff, phone, email, workers (badges), createdAt. Back shows only when the URL has `:id`. Edit always shows.
- **API:** `GET /worker-company/:id`.
- **Navigation:** Back goes to the list. Edit goes to `/:id/edit`.

#### Worker Company Import
- **Route:** `/admin/worker-company/import`. Screen `HQS-61`, roles [99].
- **Component:** `WorkerCompanyImportPage`, file `features/workerCompany/pages/ImportPage.tsx`.
- **UI:** upload with a 422 error list.
- **API:** `POST /worker-company/import` (multipart).
- **Navigation:** goes to the list.

### Workers

#### Worker List
- **Route:** `/admin/workers`. Screen `CMS0170`, roles [99, 05].
- **Component:** `WorkerListPage`, file `features/worker/pages/ListPage.tsx`.
- **Role checks:** none in the component. Role 05 sees Download, Import and Create; the backend scopes the data.
- **UI:**
  - Filter (`features/worker/components/FilterForm.tsx`): `companyName`, `phoneNumber`, `prefecture`, `address`, `staff`, `workablePrefectureList`, `workableLargeCategoryList`, `lastLoginAtFrom/To`, `dateFrom/To`, `numberItem`.
  - Table columns: No, companyName, phone, staff, zipcode, prefecture, address, loginId, automatching icon, lastLoginAt, createdAt, Edit.
  - The Delete button is commented out.
- **API:**
  - `GET /workers`.
  - `GET /workers/download-worker-list` (blob).
  - `GET largecategories`.
- **Navigation:** `/:id/detail`, `/:id/edit`, `/create`, `/import`.

#### Worker Create
- **Route:** `/admin/workers/create`. Screen `CMS0173`, roles [99, 05].
- **Component:** `WorkerCreatePage`, file `features/worker/pages/CreateOrUpdatePage.tsx`.
- **Role checks:** `isWorkerCompany()` disables `staff` and, on create, pre-fills it with the user's name.
- **Form:**
  - `code` (1–12).
  - `loginId` (required).
  - `password` (required on create).
  - `companyName` (required).
  - `phoneNumber` (required).
  - `email`.
  - `staff` (required).
  - `zipcode` (required).
  - `prefecture` (required).
  - `address1` (required) and `address2`.
  - Workable: `workablePrefectureList` (at least 1), `workableLargeCategoryList` (at least 1), `workableSmallCategoryList`.
  - Symptoms and stores:
    - `largeCategorySymptomList`.
    - `stores`: infinite-scroll multi-select, loading `GET stores/search-all-id`.
    - `symptomList`: options from `GET symptoms?isShow=01&largeCategoryId[]`.
  - `automatchingFlag` (switch). When it is on, `automatchingLargeCategoryList` (required), `automatchingSmallCategoryList` and `automatchingPrefectureList` (required) appear.
  - `description`.
  - `image` (`AppUploadImageHolder`).
- **Actions:** confirm on save (`AMSG00040`), Back, unsaved-change prompt.
- **API:** `POST /workers` (multipart), `GET largecategories`, `GET symptoms`, `GET stores/search-all-id`.
- **Navigation:** goes to `/:newId/detail`.

#### Worker Edit
- **Route:** `/admin/workers/:id/edit`. Screen `CMS0172` is **not in `ScreenAccess`**, so all roles pass.
- **Component:** `WorkerEditPage`, the same file as Create.
- **Role checks:** only `isWorkerCompany()` disabling `staff`. There is no ownership check.
- **API:**
  - `GET /workers/:id` (normalized by `useWorker`).
  - `POST /workers/:id` with `_method=PUT` (multipart).
  - The option APIs as on Create.
- **Navigation:** goes to `/:id/detail`.

#### Worker Detail
- **Route:** `/admin/workers/:id/detail`. Screen `CMS0171`, roles [99, 05].
- **Component:** `WorkerDetailPage`, file `features/worker/pages/DetailPage.tsx`.
- **UI:** all the fields above shown read-only: badges for the category and prefecture lists, the automatching block, the description (`dangerouslySetInnerHTML` after `convertNl2Br`), the image, and createdAt.
- **API:** `GET /workers/:id`.
- **Navigation:** Back goes to the list. Edit goes to the edit page.

#### Worker Import
- **Route:** `/admin/workers/import`. Screen `CMS0174`, roles [99, 05].
- **Component:** `WorkerImportPage`, file `features/worker/pages/ImportPage.tsx`.
- **UI:** upload with a 422 error list.
- **API:** `POST /workers/import` (multipart).
- **Navigation:** goes to the list.

### Modals in this module
| Modal | File | Used by | API | Notes |
|---|---|---|---|---|
| ChainStoreListModal | `features/subAdminInformation/components/chainStoreList/ChainStoreListModal.tsx` | Sub Admin List (no preset), Preset List / Edit / Detail | `GET /users/sub-admin/:id/stores` or `GET /sub-admins/:subAdminId/presets/:presetId/stores` | Read-only, xl |
| SelectModalWorker | `features/subAdminInformation/components/selectModalWorker/SelectModalWorker.tsx` | Sub Admin List | `GET /workers?sudAdminId=` (typo) | Read-only |
| SelectModalStore | `.../selectModalStore/SelectModalStore.tsx` | Imported, never rendered | `LIST_STORE` without `replaceUrl` | Dead code |
| chainSystemStore SelectModal | `.../chainSystemStore/SelectModal.tsx` | Not imported | – | Dead code |
| Sub-admin worker SelectModal | `.../worker/SelectModal.tsx` | Sub Admin Create / Edit, but the open flag is never set | `GET /workers`, `GET workers/search-all-id` | Unreachable |
| WorkerCompanySelectModal | `features/workerCompany/pages/selectModal/SelectModal.tsx` | Worker Company List | `GET /workers?workerCompanyId=` | Read-only |
| WorkerSelectModal | `features/worker/pages/SelectModal.tsx` | Trouble `StatusEditModal`, `StatusEditModalV2`, `WorkerDateEditModal` | `GET /workers` or `GET /workers/for-assign`, plus `GET /workers/search-all-id` | Single or multiple selection |
| Confirm dialogs | `useAppModal().confirm` | Saves (`AMSG00040` / `SAP000001`), preset delete (`AMSG00042`), exports (`AMSG00043_1`) | – | – |

### Issues to note
1. The self-edit routes `/admin/sub-admin-information/edit` and `/admin/worker-company/edit` render the shared form in **create** mode because there is no `:id`.
2. `CMS0172` (worker edit) and `CMS1388_4` (preset symptom import) are missing from `ScreenAccess`, so they are open to all roles.
3. The list pages do not hide actions by role.
4. `SelectModalWorker` sends the typo param `sudAdminId`.

---
## Module: Chat, Tasks, Notifications, Questions (Q&A), plus Disabled and Non-routed Modules

These modules make very few saga calls. Components call `api/*` directly. The only saga paths are in `appSaga`:
- `getUnReadToMeMessages`
- `getNewestNotification`
- `getUnReadMessages` (inactive)

There are two API base URLs:
- `axiosClient` points to the CMS backend.
- `firebaseChatApi` and `firebaseAuthApi` (`api/apiFirebaseChat.ts`) point to `process.env.BE_CHAT_API_URL`, which is the separate chat backend.

### Chat List: `/admin/chats`
- **Component:** `ChatListPage`, in `features/chat/pages/ListPage.tsx`.
- **Purpose:** Lists troubles that have chat activity, in three tabs. Selecting a row opens the trouble detail with the chat panel.
- **Guards:**
  - Route: none.
  - Sidebar: all roles.
  - Inside the page: the `TroubleDisplayType` radio is shown only to 99, and only in the All and To-me tables.
- **Filter** (`features/chat/components/FilterForm.tsx`):
  - `searchNumberStoreNameCompanyName`
  - `searchPrefecture`
  - `searchTroubleType`
  - `numberItem`
  - Cascading category multi-selects: large, medium, small, symptom
- **Tabs** (`AppTabs` with tabId `chatListTab`, `MessageTabType`). The default tab is Mention, and the active tab is kept in `chatSlice.activeTabKey`.

  | Tab | Table component | Mode |
  |---|---|---|
  | All (`normalMessage`) | `ChatListTable` → `CommonChatTable` | FIREBASE |
  | Mention (`mentionMessage`) | `ChatListMention` | FIREBASE |
  | To me (`otherMessage`) | `ChatListToMeTable` | LEGACY |

- **Columns:** No, trouble number (link, red dot when unread), prefecture, store, latest time, sender, latest message, receivers (user and group badges), worker company, large/medium/small category, business suspension badge.
- **Mention tab content:** read from Firestore with `getDoc` at `conversations/{prefix||'trouble-'}{troubleId}/messages/{message_id}`. Names are resolved through the chat backend.
- **API:**

  | Purpose | Method + URL |
  |---|---|
  | All tab | GET `chat/search` |
  | To-me tab | GET `chat/to-me` |
  | Mention tab | GET `/chat/mentions` |
  | Mention info | GET `{BE_CHAT_API_URL}/v2/chat/map-mentions-info` |
  | Participant info | GET `{BE_CHAT_API_URL}/v2/chat/map-participants-info` |
  | Display type (99 only) | GET / POST `troubles/display-type` |
  | Unread refresh | GET `/chat/mentions/has-unread` |
  | Firebase token | POST `{BE_CHAT_API_URL}/v2/firebase-auth/exchange`, `/refresh`, `/verify` |

- **Navigation:** a row opens `/admin/troubles/:id/detail?chatMode=firebase|legacy`. Ctrl-click opens a new tab.

### Task List: `/admin/tasks`
- **Component:** `TaskListPage`, in `features/tasks/pages/ListPage.tsx`.
- **Guards:**
  - Route: none.
  - Sidebar: all roles.
  - Inside the page: `isBtnTask` is true for 99, 98, 01 and 02, and also for the task's creator or an assignee. The Complete and Edit buttons appear only when `type=NORMAL`, `status=01` and `isBtnTask` is true.
- **Filter:**
  - `troubleNumber`
  - `status` (01 not started / 02 finished, default 01)
  - `taskScope` (default ASSIGNEE)
  - `title`
  - Category cascade
  - `content`, `storeName`
  - Created date range
  - Due date range
  - Trouble created date range
- **Table columns:** No, request number link, prefecture, store, subject, content, large/medium/small category, due date, created date, assignees (user and group badges), creator, status, actions.
- **API:**

  | Action | Method + URL |
  |---|---|
  | List | GET `tasks` |
  | Complete | POST `tasks/:id/complete` |
  | Update (through the modal) | PUT `tasks/:id` |
  | Delete (unused) | DELETE `tasks/:id` |

- **Navigation:** a row opens the trouble detail with `?chatMode=firebase&from=task`.
- **Modals:**
  - **`TaskListModal`** is opened from the "Task" button on Trouble Detail.
    - Data: GET `tasks?troubleId=&numberItem=999`.
    - Normal tasks render as `TaskItem` (Complete / Edit). Automatic tasks render as read-only `TaskItemAuto`.
  - **`TaskCreateOrUpdateModal`**:
    - Fields: `title` (required), `assignees` (required, mixes users and `group{id}`), `dueDate`, `description` (max 500).
    - Save: POST `tasks` or PUT `tasks/:id`.
    - Options: GET `troubles/:id/get-users` and GET `troubles/:id/get-groups`.
    - Has a leave prompt.

### Notification List: `/admin/notifications`
- **Component:** `NotificationListPage`, in `features/notification/pages/ListPage.tsx`.
- **Guards:**
  - Route: none. Roles 04, 05 and 98 can open it by URL.
  - Sidebar: 99 and 01/02/03.
  - Inside the page, behavior splits on `isSystemAdmin()`:

  | | 99 | Other roles |
  |---|---|---|
  | Create button | shown | hidden |
  | Columns | public-status badge, Edit/Delete (disabled once public) | content cut to 200 characters, unread dot |
  | Row click | opens the detail page | opens `DetailModal` and marks the item read |
  | Search parameter | `status` | `content` |

- **Filter:** `title`, `content` (non-admin), `status` (admin), `draftFlag`, `publicDateFrom` / `publicDateTo`, `numberItem`.
- **API:**

  | Action | Method + URL |
  |---|---|
  | List | GET `/notifications` |
  | Delete (confirm AMSG00042) | DELETE `notifications/:id` |
  | Mark read | GET `notifications/mark_read/:id` |
  | Newest | GET `notifications/store-newest` |

- **Navigation:** Create opens `/admin/notifications/create`, a row opens `/:id`, and Edit opens `/:id/edit`.

### Notification Create and Edit: `/admin/notifications/create` (CMS0114_1, [99]) and `/admin/notifications/:id/edit` (CMS0114_2, [99])
- **Component:** `NotificationCreatePage` / `NotificationEditPage`, both in `features/notification/pages/CreateOrUpdatePage.tsx`.
- **Fields:**
  - `title` (required, max 256)
  - `content` (required)
  - Target checkboxes `storeFlag` / `workerFlag` (at least one is required)
  - `publicDate` (datetime, must be now or later)
  - `publicNow` (when checked, clears and disables `publicDate`)
- **Buttons:**
  - Back
  - Save (confirm HQL00040)
  - Draft (sets `draftFlag`, confirm HQL00041)
- **Behavior:** if the item is already public, the Edit page shows AMSG00046 as not-found. Both pages have a leave prompt.
- **API:** GET `/notifications/:id`, POST `notifications`, PUT `notifications/:id`.

### Notification Detail: `/admin/notifications/:id` (CMS0114_3, [99])
- **Component:** `NotificationDetailPage`, in `features/notification/pages/DetailPage.tsx`.
- **Shows:** title, content (rendered with `AppTextHyperlink`), target checkmarks, delivery time, status.
- **Buttons:** Edit is hidden once the item is public.
- **API:** GET `/notifications/:id`.
- **`DetailModal`** (`pages/DetailModal.tsx`) is the read-only popup that non-admin users see on the list. It makes no API call.

### Question Master: `/admin/questions` (CMS0200, [99])
- **Component:** `QuestionListPage`, in `features/question/pages/ListPage.tsx`.
- **Purpose:** Pick a chain system whose Q&A you want to manage, or go to the standard (master) Q&A.
- **Filter:** `companyNameAndPhoneNumber`, dateFrom/To, numberItem.
- **Table columns:** No, company name, phone, created at.
- **Buttons:** "Register standard Q&A" (`registerStandardQA`) opens `/admin/questions/detail`.
- **API:** GET `/chainsystems`.
- **Navigation:** a row opens `/admin/questions/:id/detail`.

### Question Detail: five routes share one component (`features/question/pages/DetailPage.tsx`)
| Route | Exported name | Screen | Roles |
|---|---|---|---|
| `/admin/questions/detail` | QuestionDetailPage `isMaster` | CMS0200_4 | not in map, so all roles |
| `/admin/questions/:id/detail` | QuestionDetailPage | CMS0200_5 | 99 |
| `/admin/store/questions` | QuestionChainStoreListPage (alias) | CMS0200_1 | 01, 02 |
| `/admin/individual/questions` | QuestionIndividualListPage (alias) | CMS0200_2 | 03 |
| `/admin/manager/questions` | QuestionManagerListPage (alias) | CMS0200_1 | 01, 02 |

- **Main UI:** the category tree `CategoriesListPage` with `isQuestion=true`. The `chainSystemId` passed in depends on the role:
  - 99 with master: the master ID
  - 99: `:id`
  - 03: the master ID
  - All others: `auth.chainSystemId`
- **Small category selected:** the modal that opens depends on the role.

  | Role / mode | First modal | Then |
  |---|---|---|
  | 99 with master | `StoreMasterQuestionModal` | – |
  | 99 (not master) or 01 | `ChainSystemStoreSelectModal` (GET `/stores`, `/stores/search-all-id`; bulk-create button for 99 and 01, which opens `BulkStoreChainStoreQuestionModal`) | `StoreChainStoreOrIndividualQuestionModal` |
  | 03 | `IndividualStoreSelectModal` (GET `/individuals/stores`, `individuals/stores/search-all-id`) | `StoreChainStoreOrIndividualQuestionModal` |
  | 02 | `StoreChainStoreOrIndividualQuestionModal` for the user's own `auth.chainStoreId` | – |

- **Question modals:** all of them use `StoreQuestionForm`, which has question rows with add, delete, ON/OFF, bulk ON/OFF and save.

  | Modal | API |
  |---|---|
  | `master/StoreMasterQuestionModal` | GET `/questions/show/:smallCategoryId`; POST `/questions/store`; DELETE `questions/:id/deleted` |
  | `chain/StoreChainStoreOrIndividualQuestionModal` | GET `/questions/get-question-store/:smallCategoryId?chainStoreId|individualStoreId`; POST `/questions/update-multiple` |
  | `chain/BulkStoreChainStoreQuestionModal` | GET `/questions/show/:smallWorkCategoryMaster?chainSystemId`; POST `/questions/toggle-question-all-store`; POST `/questions/created-bulk-store`; DELETE `/questions/deleted-list-store` |
  | `ViewQuestionModal` (used in the trouble-create `WorkItemSelection`) | GET `/questions/search-questions/:smallCategoryId?storeId&searchIndividual` |

- **Confirm messages:** AMSG00040 / AMSG00107 (save), AMSG00105 (item delete), AMSG00108 / AMSG00109 (bulk ON/OFF), AMSG00106 (bulk delete).

### DISABLED: Messages (HQT-524 "Hide temporary")
- **Status:** the routes `/admin/messages`, `/create`, `/:id/edit` and `/:id/detail` (CMS0110, CMS0111_1, CMS0111_2, CMS0112) are commented out in `WebRoute.tsx`. The sidebar entry is commented out as well. `ScreenAccess` still lists them for [99, 05].
- **Code:** `features/message/pages/ListPage.tsx`, `CreateOrUpdatePage.tsx`, `DetailPage.tsx`.
- **List page:**
  - Filters: `searchTitle`, registration date range.
  - Columns: title, sent badge, created at, Edit / Delete.
  - API: GET `/messages/search`, DELETE `messages/:id`.
- **Create page:**
  - Fields: title, content, deliveryTime.
  - Recipients:
    - Workers, through `SelectModalWorker`
    - Individual stores, hidden for 05 and 98
    - Chain stores, hidden for 05
  - API: GET `/messages/:id`, POST `messages/store`.
- **Detail page:**
  - Recipient tables: GET `/messages/:id/worker`, `/chain-store`, `/individual-store`, `/app-message`.
  - Send button: GET `/messages/:id/send-message`.

### DISABLED: Bulk Update (hidden for Sub Admin)
- **Status:** the routes `/admin/bulk-update`, `/:type/import` and `/import-all` (HQT-188) are commented out. So are the map entry ([98]) and the sidebar entry.
- **List page** (`features/bulkUpdate/pages/ListPage.tsx`):
  - Four rows: trouble common, estimate, report, billing status.
  - Each row has Upload and Template download (confirm AMSG00043_1). There is also an "all" upload.
  - Template downloads: GET `/exports/trouble-common`, `/exports/estimation`, `/exports/report`, `/exports/billing-status`.
- **Import page** (`ImportPage.tsx`): POST multipart `/imports/trouble-common`, `/imports/estimation`, `/imports/report`, `/imports/billing-status`.
- **Import All page** (`ImportAll.tsx`): three CSV fields, POST `/imports/all-trouble-data`.

### Non-routed modules
- **chatFirebase** (`features/chatFirebase`): `FirebaseChatBox`, embedded in Trouble Detail.
  - **Modes:** Firebase mode is the default (`?chatMode=firebase`). If `trouble.hasLegacyChat`, a switch toggles to the read-only legacy `features/chat/components/ChatBox`, which uses GET `chat/:troubleId/get-messages`.
  - **Firestore:**
    - Collection: `{FIRESTORE_CONVERSATIONS_COLLECTION_NAME||'conversations'}/{prefix}{troubleId}/messages`.
    - History loads in pages of 20 (`getDocs` with `orderBy`, `startAfter`, `limit`).
    - Live updates use `onSnapshot`.
    - Edits and deletes sync through `where(documentId)` / `version`.
    - All writes go through the backend.
  - **UI:**
    - Messages, with delete for your own (confirm AMSG00042)
    - Image preview (`ChatFirebaseImageViewModal`)
    - Mention "To" multi-select
    - Textarea
    - File drag-and-drop. Allowed types: pdf, jpg/jpeg/png/gif/heic, mp4/ogg/m4v/avi/mov. Size and count limits apply.
  - **Chat backend API (`BE_CHAT_API_URL`):**

    | Purpose | Method + URL |
    |---|---|
    | Permission check (403 shows a popup) | POST `/v2/chat/permissions/conversation/request?trouble_id=` |
    | Mark read | PUT `/v2/chat/troubles/:id/mark-conversation-as-read` |
    | Name lookups | GET `/v2/chat/map-participants-info`, `/map-mentions-info` |
    | File retrieval | GET `/v2/chat/retrieve-files` |
    | File upload | POST `/v2/chat/generate_presigned_url`, then PUT to S3 |
    | Send | POST `/v2/chat/troubles/:id/send-message` |
    | Delete | DELETE `/v2/chat/conversations/:trouble_id/messages/:id` |

  - **Main API:** mention options come from GET `troubles/:id/get-users` and `/get-groups`.
- **payment** (`features/payment`): the card and payment-method wizard `FlowPayment`.
  - **Steps:**
    1. `SelectPaymentType`: all stores or per store.
    2. `SelectStore`: GET `/stores/all?chainSystemId`.
    3. `ChangePaymentMethod`:
       - Card list: GET `/credit-cards?chainSystemId&chainStoreId`.
       - Delete a card: DELETE `/credit-cards/:id`.
       - Change method (confirm AMSG00056): POST `/credit-cards/change-payment`.
    4. `CreditCardRegister`:
       - Fields: `cardNumber`, `expire`, `cvv`.
       - POST to `VERITRANS_TOKEN_URL` for a token, then POST `/credit-cards/register`.
  - **Used by:**
    - Chain System Detail: the full flow.
    - Chain Store Detail: the ChangePaymentMethod step only.
    - Trouble Detail: `ChangePaymentMethodFail` and `CreditCardRegister` when a payment fails.
- **staff** (`features/staff`):
  - `StaffListPage` is a read-only name/phone table shown in a modal on Trouble Detail/Edit, the trouble list and Store Detail.
  - `StaffCreateOrUpdateModal` has name and phone fields and makes no API call. It is used in the Store form.
- **emails** (`features/emails`):
  - `EmailListModal` is used in Store Detail.
  - `EmailCreateOrUpdateModal` has a single email field with a duplicate check and makes no API call. It is used in the Store form.
- **troubleNavi** (`features/troubleNavi/index.tsx`):
  - A full-screen iframe of `process.env.WEB_VIEW_TROUBLE`. Trouble Create renders it when `isOpenTroubleNavi` is set.
  - Every second it posts `{type:'set_cookie', data:{TOKEN, largeCategoryId, storeId, chainSystemId, staff, role, mode, assetSelected}}` to the iframe with targetOrigin `"*"`, until it receives `iframe_loaded`.
  - It listens for `close_webview` and `back_to_home`.
  - **Security note:** posting the token with targetOrigin `"*"` sends it to whatever page is loaded in the iframe.

---
## Cross-module findings (permission gaps and bugs)

1. **Route-level gaps:** any logged-in role can open these by URL, because their screen ID is missing from `ScreenAccess` or the route has no screen ID at all:
   - Troubles: list, create, detail, edit
   - Estimation categories, and the chain estimation-category pages
   - `/admin/chain-systems/:id/stores` (CMS0050A)
   - Group edit (CMS0042)
   - Categories (CMS0120)
   - Worker edit (CMS0172)
   - Master Q&A detail (CMS0200_4)
   - Preset symptom import (CMS1388_4)
   - All asset-management and asset-column screens
   - Chats, tasks, the notification list

   On these pages the only frontend controls are the sidebar and checks inside each component. The backend has to enforce access.
2. **A denied screen check redirects to `/login`.** `PublicRoute` then bounces a logged-in user to `/admin`, so in practice the user lands on the dashboard rather than seeing a 403 page.
3. **Permission objects are mutated globally.** Both `useChain` (`FunctionPermissionDenyAll` / `AlowAll`) and `useTroublePermission` (`TroublePermissionAlowAll` / `DenyAll`) assign module-level constants and then modify them. Flags can leak between roles when different users log in within the same SPA session.
4. **Self-edit routes render in create mode.** `/admin/sub-admin-information/edit` and `/admin/worker-company/edit` have no `:id`. The shared CreateOrUpdate page therefore treats them as create pages, and saving would POST a new record. In practice the real self-edit flow goes through `/:ownId/edit`.
5. **`ScreenAccess` has duplicate keys.** `HQS-37`, `GROUP_LIST`, `EST_CATEGORY_LIST` and `WORKERS_LIST` appear more than once, and the last entry wins. Several screens also share IDs: `HQS-48` covers both edit and detail, and the `CMS01719` and `CMS01729` asset IDs are reused across screens.
6. **The completion-status import route skips a check.** `/admin/troubles/import-trouble-complete-status` does not check `isAllowPayment`. The menu does.
7. **TroubleNavi posts the Cognito access token to its iframe with targetOrigin `"*"`** (`features/troubleNavi/index.tsx:32`). The token goes to whatever page is loaded in that iframe.
8. **Smaller bugs:**
   - `PickScheduleWorkModal` reports a failure as success and leaves the loader running.
   - Individual store detail renders the zipcode as a prefecture label.
   - Store detail shows the created-at row twice.
   - `SelectModalWorker` sends the misspelled param `sudAdminId`.
   - A system admin (99) opening plain `/admin/asset-management/create` loads the column definition with chainSystemId NaN.
9. **Dead or disabled code:**
   - Messages module (HQT-524) and Bulk Update are disabled.
   - Unused components and APIs: `EstimateViewModal`, `SelectChainSystem` (asset), `SelectModalStore` and the chainSystemStore SelectModal (sub-admin), the sub-admin worker SelectModal, `SelectModalQuestion`, and the duplicate chain `StaffCreateOrUpdateModal`.
   - Delete buttons are commented out on chain systems, stores, managers, groups, agents, categories and estimation categories.
