# QnaviShop (qnavi-shop-app) — Screen Catalog

Source root: `/Users/protar/Desktop/work/qnavi/qnavi-shop-app/QnaviShop/app`
Stack: React Native 0.77 (bare CLI), react-navigation v6, Redux + redux-saga, RTK slices, TanStack Query v5, Amplify (Cognito), Firebase (messaging, Firestore chat), i18next (ja/en/vi/zhs/zht).

Method: GitNexus `query` was run first (it surfaced `DrawerMenu` for the shop app but no shop-app execution flows; most results came from the repair app). The screen list below was confirmed by reading the navigator files directly. Every screen was then read and traced from its action, through the saga, repository and `ApiList` endpoint.

## 1. Navigation structure

```
App.tsx
└─ ContainerNavigation (app/navigation/ContainerNavigation.tsx)
   └─ NavigationContainer (ref = navigationRef, light/dark theme)
      └─ DrawerView (app/layout/DrawerView.tsx) — react-native-gesture-handler DrawerLayout,
         │   left, drawerLockMode="locked-closed" (opened only programmatically via openDrawer())
         │   renderNavigationView → DrawerMenu (app/layout/DrawerMenu.js)
         ├─ StackNavigator (app/navigation/StackNavigator.tsx) — single createStackNavigator, initialRoute = Login, headerShown:false
         ├─ BaseModalOk  — global API error modal (alertReducer status === 'error', except 503/502 codes);
         │                 on UPGRADE_REQUIRED opens the store URL and exits the app
         └─ MainLoading  — global loading overlay
```

- **One root stack only.** The app uses no react-navigation bottom-tab or drawer navigator. The side menu is a gesture-handler `DrawerLayout` wrapped around the stack. `app/navigation/CustomNavigation.js` is a leftover template bottom-tab bar (Home/Pages/Settings) and nothing imports it.
- **Bottom "tabs":** the app has no tab navigator. Most screens render the `components/TabBar/TabBarBottom.tsx` component, a fake tab bar where each tap **resets the stack**. Its five tabs are Home, Request (依頼), Progress, Task and Chat. Section B lists exactly where each tab goes.
- **Drawer:** `drawerLockMode="locked-closed"` only turns off the swipe gesture. The header hamburger opens the drawer programmatically through `openDrawer()` → `drawerRef.current.openDrawer()`, and that works as designed. `screens/Base/BaseMainScreen` also wraps content in its own legacy DrawerLayout.
- **Conditional stack:** the stack reads `alertReducer.params.statusCode`:
  - `MAINTENANCE` → the stack contains only `Maintenance`.
  - `BAD_GATEWAY` → the stack contains only `ServiceUnavailable`.
  - otherwise → all regular screens below.
- **Nested top tabs** (`@react-navigation/material-top-tabs`): inside `ChatList` (`screens/Chat/ChatListScreen.tsx`) and inside `features/chat/components/ChatBottomSheet.tsx`. See section E.
- **Home routing** (`RootNavigation.navigateToHome`): resets the stack to `MajorCategory {isRootStack:true}` when `global.isChainStore()`, otherwise to `ManageBox {isRootStack:true}`.
- **Helpers** (`RootNavigation.ts`): `navigate`, `navigatePush` (StackActions.push), `navigateAndResetStack`, `navigateGoBack`, `openDrawer` / `closeDrawer`, `getActiveRouteName`. A typed `RootStackParamsList` exists only for `ListTask {troubleId?}` and `CreateTaskScreen {troubleId?, taskInfo?, isDisable?}`.

### 1.1 Registered stack routes (ScreenTypes.js → component)

| # | Route name | SC id | Component | File |
|---|---|---|---|---|
| 1 | Login | SC0001 | LoginScreen | screens/Login/LoginScreen.tsx |
| 2 | ResetPasword | SC0001A | ResetPasswordScreen | screens/ResetPassword/ResetPassword.tsx |
| 3 | Register | SC004 | RegisterScreen | screens/Register/ResgisterScreen.js |
| 4 | PaymentManagement | SC0035 | PaymentManagementScreen | screens/PaymentManagement/PaymentManagementScreen.tsx |
| 5 | WebView | – | WebViewScreen | screens/WebView/WebViewScreen.tsx |
| 6 | PWA_Webview | – | PWA_Webview | screens/WebView/PWA_Webview.tsx |
| 7 | MajorCategory | SC0010 | MajorCategoryScreen | screens/MajorCategory/MajorCategoryScreen.js |
| 8 | MediumCategory | SC0011 | MediumCategoryScreen | screens/MediumCategory/MediumCategoryScreen.js |
| 9 | MinorCategory | SC0012 | MinorCategoryScreen | screens/MinorCategory/MinorCategoryScreen.js |
| 10 | RegisterQr | – | RegisterQRScreen | screens/Register/RegisterQRScreen.tsx |
| 11 | PaymentInfoRegister | – | PaymentInfoRegisterScreen | screens/PaymentInfoRegister/PaymentInfoRegisterScreen.js |
| 12 | ManageBox | SC0003 | ManageBoxScreen | screens/ManageBox/ManageBoxScreen.js |
| 13 | TroubleList | SC0009 | TroubleListScreen | screens/Trouble/TroubleListScreen.js |
| 14 | StoreList | SC0005 | StoreListScreen | screens/Store/StoreListScreen.tsx |
| 15 | RequestList | SC0016 | RequestListScreen | screens/Request/RequestListScreen.tsx |
| 16 | ChatList | SC0027 | ChatListScreen | screens/Chat/ChatListScreen.tsx |
| 17 | NotifyList | SC0037 | NotifyListScreen | screens/Notification/NotificationListScreen.tsx |
| 18 | NotifyDetail | SC0038 | NotificationDetailScreen | screens/Notification/NotificationDetailScreen.tsx |
| 19 | MessageList | SC0032 | MessageListScreen | screens/Message/MessageListScreen.tsx |
| 20 | MessageDetail | SC0033 | MessageDetailScreen | screens/Message/MessageDetail.tsx |
| 21 | HistoryList | SC0028 | HistoryListScreen | screens/History/HistoryListScreen.tsx |
| 22 | TroubleDetail | SC0029 | TroubleDetailScreen | screens/TroubleDetail/TroubleDetailScreen.tsx |
| 23 | FailureContent | SC0014 | FailureContentScreen | screens/Failure/FailureContentScreen.tsx |
| 24 | WorkCancelFee | SC0030 | WorkCancelFeeScreen | screens/TroubleDetail/cancel/WorkCancelFeeScreen.tsx |
| 25 | WorkerSelection | SC0017 | WorkerSelectionScreen | screens/WorkerSelection/WorkerSelectionScreen.tsx |
| 26 | WorkerDetail | SC0018 | WorkerDetailScreen | screens/WorkerDetail/WorkerDetailScreen.tsx |
| 27 | StoreEdit | SC0006 | StoreEditScreen | screens/StoreEdit/StoreEditScreen.js |
| 28 | WorkInprogress | SC0019 | WorkInprogressScreen | screens/Work/WorkInprogressScreen.tsx |
| 29 | WorkInprogressDetail | SC0020 | WorkInprogressDetailScreen | screens/Work/WorkInprogressDetailScreen.tsx |
| 30 | EstimationList | SC0021 | EstimationListScreen | screens/Estimation/EstimationListScreen.tsx |
| 31 | EstimationDetail | SC0022 | EstimationDetailScreen | screens/Estimation/EstimationDetailScreen.tsx |
| 32 | WorkDetailPayment | SC0025 / SC0031 | WorkDetailPaymentScreen | screens/WorkDetailPayment/WorkDetailPaymentScreen.tsx |
| 33 | WorkReport | SC0024 | WorkReportScreen | screens/Work/WorkReport.tsx |
| 34 | WorkContinueInprogress | SC0026 | WorkContinueInprogressScreen | screens/Work/WorkContinueInprogressScreen.tsx |
| 35 | ManualContact | – | ManualContactScreen | screens/Static/ManualContact.tsx |
| 36 | AssetSelection | – | AssetSelectionScreen | screens/AssetSelection/AssetSelectionScreen.tsx |
| 37 | AssetCreateScreen | – | AssetCreateScreen | screens/AssetSelection/AssetCreateScreen.tsx |
| 38 | ListTask | – | ListTaskScreen | screens/TaskManager/Tasks/index.tsx |
| 39 | CreateTaskScreen | – | CreateTaskScreen | screens/TaskManager/CreateTask/index.tsx |
| 40 | ListApprovalScreen | – | ListApprovalScreen | screens/Work/ListApprovalScreen.tsx |
| 41 | Maintenance | – | MaintenanceScreen | screens/Maintenance/Maintenance.tsx (conditional stack) |
| 42 | ServiceUnavailable | – | ServiceUnavailableScreen | screens/ServiceUnvailable/ServiceUnvailable.tsx (conditional stack) |

Route constants that are defined in ScreenTypes.js but never registered: `Home`, `RequestSumit` (SC0015; its role is merged into WorkerSelection), `ChatDetail`, `DrawerMenu` (SC0002; used only as a `from` marker, because the menu is not a route), `MajorAsset`. `screens/WebView/WvScreen.js` is imported in StackNavigator but not registered.

### 1.2 Side menu (SC0002) — `DrawerMenu` (app/layout/DrawerMenu.js)

Not a route. It is opened through `openDrawer()` from the header hamburger button. Its items:

| Item | Action |
|---|---|
| Close (X) | closeDrawer |
| Account | `global.user.manager` ? `StoreList {from:'DrawerMenu'}` : `StoreEdit` (param string 'Account') |
| History | `HistoryList` |
| Tasks | `ListTask` |
| Notifications | `NotifyList`; shows a badge when `commonReducer.badgeSizeBar.notificationFlag` is set |
| Chat | `ChatList`; shows a badge when `badgeSizeBar.troubleUnreadFlag` is set |
| Privacy policy | `WebView {uri:'https://www.globar.co.jp/privacypolicy/'}` |
| Terms | `WebView {uri: CMS_FE_URL + '/term-of-service', leftIcon:'back'}` |
| Company | `WebView {uri:'https://www.globar.co.jp/company/'}` |
| Logout | ModalConfirmMessage → `logoutAction.requestLogout()` (logoutSaga → POST `auth/signout`). It then clears the notification slice, clears AsyncStore user data, removes delivered notifications, resets the badge, clears the react-query cache, resets the stack to `Login` and shows ModalOkMessage "logout complete". |
| Footer | app version; an "Auto matching" pill when `global.automatchingFlag == true` |

### 1.3 API URL note

`ApiModule.post()` rewrites URLs through `ApiListNewMapper`: `MASTER_API_V2` (`/api/mobile/v2/auth/config`) is actually sent as POST `/api/mobile/auth/config`, after `convertParams` / `convertResponse` adapt the payload. Any section below that cites `v2/auth/config` therefore reaches `/api/mobile/auth/config` on the wire.

### 1.4 Global permission model (summary)

- `permissionsReducer` (fetched through PERMISSION_REQUEST → GET `stores/permission`): `is_allow_select_worker`, `is_allow_approve_estimate`, `is_allow_payment`.
- Roles (`global.hasRole(role)` over `global.user.roles`, defined in app/config/index.js):
  - `global.isChainStore()` means role `storeGenba` (chain store on-site staff). It decides whether home is MajorCategory or ManageBox.
  - `global.isStoreAdmin()` means role `storeAdmin`.
  - `global.isIndividualStore()` means role `individual`.
- `global.user` is set by `Common.setAuthInfo` from `auth/info` / the login response.
  - `global.user.manager` is defined for manager accounts. It switches the Account menu between StoreList and StoreEdit.
  - The flags `global.automatchingFlag`, `global.storeAutomatchingFlag` and `global.assetFlag` come from `user.chain` or `user.manager`.
- `global.JTVT10` / `global.Paycas` are device flags, not tenant flags. They mark dedicated Android terminals (device `JT-VT10` / `msm8909` Paycas POS). They hide parts of the UI (for example the Login extras, the FailureContent image upload and the force-update store link) and switch the ManualContact data.

---


# Qnavi Shop App: Auth, Onboarding, Payment Settings, System and WebView Screens

Base paths are relative to `qnavi-shop-app/QnaviShop/app/`.
`DOMAIN_API` = `Config.API_URL + '/api/mobile/'`. `DOMAIN_API2` = `Config.API_URL + '/api/mobile/v2/'`.
Every REST call goes through `ApiInstance.apiModule` (`api/ApiModule.ts`). Its request interceptor refreshes the Bearer token from Amplify `fetchAuthSession()`. On a 401 it retries once with a refreshed Cognito token and calls `forceLogout()` if that fails. `forceLogout()` clears AsyncStorage, resets the stack to `Login`, clears react-query, signs out of Cognito, clears the WebView session and signs out of Firebase. A 503 response with `isMaintenance` maps to MAINTENANCE (503); any other 503 maps to BAD_GATEWAY (502). A 426 response becomes an UPGRADE_REQUIRED alert that carries the store link.

Role helpers in `config/index.js`, based on `global.user.roles`:
- `global.isChainStore()` means the user has the role `storeGenba`.
- `global.isStoreAdmin()` means `storeAdmin`.
- `global.isIndividualStore()` means `individual`.
- `global.user.manager` exists for manager (multi-store) accounts.

`RootNavigation.navigateToHome()` resets the stack to `MajorCategory {isRootStack:true}` when `isChainStore()` is true. Otherwise it resets to `ManageBox {isRootStack:true}`.

---

## App bootstrap and global shell

### (bootstrap) (`App` / `AppCore`), `App.tsx`
- **Purpose**: the root component. It sets up the providers, configures Amplify, restores the session globals, handles push notifications and re-syncs auth when the app returns to the foreground.
- **Provider tree**: `SafeAreaProvider` > `KeyboardProvider` > `QueryClientProvider` (exported `queryClient`) > `I18nextProvider` > redux `Provider` > `ConnectedAppCore` > `AutocompleteDropdownContextProvider` > `ContainerNavigation`.
- **Module load**: runs `moment.locale(i18n.language)` and `Amplify.configure(awsConfig)` (Cognito, `config/awsConfig`).
- **Constructor**: sets `global.uuid`. Android uses `DeviceInfo.getAndroidId()` and iOS uses `getUniqueId()`.
- **`initializeApp()` (componentDidMount)**:
  - Calls `AsyncStoreApp.getUser()` and returns early if it is empty.
  - Otherwise calls `Common.setResponseLoginGlobal(response, responseMaster)`, which sets `global.masterConfig`, `global.user`, `global.device` and the API token, plus `global.storeId` through `initializeStoreIdFromAuth`.
  - Dispatches `refreshAuthInfo()`, an RTK thunk in `slices/RefreshAuthInfoSlice` (`features/auth`-style). It calls `CognitoAuthRepository.getAuthInfo`, which is **POST `/api/mobile/auth/info`** with `{from:'store', registrationId: fcmToken, uuid, type, serialNo}`. On success it calls `Common.setAuthInfo`, `initializeStoreIdFromAuth` and `AsyncStoreApp.storeAuthInfoIntoUserData`.
  - Requests notification permission: `messaging().requestPermission()` on iOS, `POST_NOTIFICATIONS` on Android.
  - Gets the FCM token into `global.fcmToken`, then sets `isInitialized=true`.
- **How Login is skipped**: App.tsx does **not** navigate. The stack's `initialRouteName` is always `Login`. The skip happens inside `LoginScreen.checkAutoLogin()`; see Login below.
- **Push handling**:
  - `onTokenRefresh` updates `global.fcmToken`.
  - `onNotificationOpenedApp` calls `Common.navigateFromNotification(remoteMessage)`. The home screen is `MajorCategory` or `ManageBox` depending on `isChainStore()`. The function also handles `notiId` values such as `ps36` (message) and others.
  - `getInitialNotification` stores the message in `global.remoteMessage`. A comment says it is consumed later by "TopScreen".
  - Foreground `onMessage`:
    - It suppresses `ps23` when firebase chat is enabled and the current route is that trouble's chat conversation.
    - `ps40` runs `queryClient.refetchQueries(['latestNews'])`.
    - Anything else shows a top Toast or ToastAndroid with title + body.
- **AppState change (background to active)**: requires `isInitialized` and `isLogin()`, which means AsyncStorage user data exists. It then:
  - dispatches `refreshAuthInfo()` (POST `auth/info`)
  - refetches `latestNews`
  - dispatches `getMasterConfig()`. The saga is `commonSaga.fetchMasterConfig`, which calls `GetMasterConfigV2`: **POST `/api/mobile/v2/auth/config`** with `{version:0, chain_system, storeId?}`.
  - dispatches `getBadgeSideBar()`. The saga is `fetchBadgeSideBar`, which calls **GET `/api/mobile/stores/get_side_bar`** and also dispatches `getMentionUnreadCountThunk` (chat).

### (container) (`ContainerNavigation`), `navigation/ContainerNavigation.tsx`
- `NavigationContainer` with `ref=navigationRef`. It tracks `currentRouteName`, which `getCurrentRouteName()` exposes.
- It wraps `StackNavigator` in `DrawerView ref=drawerRef` (the side menu `layout/DrawerMenu.js`).
- **Global error modal** (`BaseModalOk`): shown when `alertReducer.status==='error'` and the statusCode is not 503 or 502. Its button dispatches `ALERT_ERROR_DISMISS`.
  - For **426 UPGRADE_REQUIRED** the button reads "update". It opens `params.code` (the store link) unless the build is JTVT10 or Paycas, then calls `RNExitApp.exitApp()`.
  - For 426 the button is hidden on Paycas builds.
  - For any other code it runs `params.action?.()`.
- Also renders `MainLoading` (the global spinner, driven by the `LoadingSlice` and ApiModule request counting).

---

## Authentication

### Login (`LoginScreen`), `screens/Login/LoginScreen.tsx`
- **Purpose**: store-staff sign-in (Cognito username/password or Microsoft SSO), auto-login, and Terms of Service acceptance.
- **Params**: `route.params.register?: {username, password}`. `Register` sets it after a successful sign-up. A `useFocusEffect` (`afterRegistrationLogin`) consumes it: it fills the form and submits automatically.
- **UI**:
  - `ImageBackground` (`IMAGES.bgLogin`), logo, and `Config.APP_NAME` as the title.
  - `InputLogin` username (email keyboard) and `InputLogin` password (`type='password'`), driven by react-hook-form and yup. Both are required.
  - Login `Button`. It is a no-op while `loginReducer.loading`.
  - A "Forgot password" link, shown only when `global.JTVT10 == false && global.Paycas == false`.
  - A "Login with Microsoft" button (`MicrosoftIcon`). It is disabled while the keyboard is visible.
  - The Register button is **commented out**, so `Register` cannot be reached from the UI. Uncertain: `Register` may now be dead code.
  - In `__DEV__` the form is pre-filled with `<dev-store-account> / <password>` (đã che).
- **On mount**:
  - Calls `checkAutoLogin()`.
  - Subscribes to Amplify `Hub.listen('auth')`. On `signInWithRedirect` it dispatches `GET_CURRENT_SESSION`.
  - Adds keyboard listeners and a status-bar style change.
- **Flow: check app version and auto-login (`checkAutoLogin`)**:
  1. Dispatches `checkAppVersion({uuid, successCallback})`, action `CHECK_APP_VERSION_REQUEST`. Saga `commonSaga.fetchCheckAppVersion` calls `CommonRepository.GetCheckAppVersion`: **POST `/api/mobile/auth/check_app_version`**. A non-200 dispatches `requestAlertErrorAction`. For 426 the global modal forces the update.
  2. On success it reads `AsyncStoreApp.getUser()` and stops if it is empty. Otherwise it calls `Common.setResponseLoginGlobal`, then dispatches `getMasterConfig()` (`MASTER_CONFIG_REQUEST`, which is POST `/api/mobile/v2/auth/config`).
  3. `autoLogin(is_accept_policy)` branches on whether the stored user accepted the policy:
     - **Accepted**: calls **GET `/api/mobile/stores/permission`** directly through ApiInstance as a token-validity probe.
       - On 401 it clears AsyncStorage, dispatches `firebaseAuthSignOut()` and stays on Login.
       - Otherwise it dispatches `GET_CURRENT_SESSION_FOR_FIREBASE_LOGIN` and `LOGIN_RESPONSE` (`onLoginAuto(storedResponse)`), then calls **`RootNavigation.navigateToHome()`**. This is how Login is skipped.
     - **Not accepted**: dispatches `SHOW_POLICY`, which opens the ToS modal.
- **Flow: password login**: `onLogin` dispatches `LOGIN_REQUEST {username,password}`. The saga is `loginSaga.fetchAutValidateViaCognito`, registered with takeLatest.
  1. Calls Amplify `signIn(params)` (`CognitoAuthRepository.handleSignInCognito`). If `isSignedIn` and `nextStep.signInStep==='DONE'`:
     - `fetchAuthSession()` returns the accessToken, which is set on `ApiInstance`.
     - `fetchUserInfo` calls **POST `/api/mobile/auth/info`**, then `GetMasterConfigV2` (**POST `/api/mobile/v2/auth/config`**, `chain_system` = `user.manager?.system ?? user.chain?.system`).
     - It then calls `Common.setResponseLoginGlobal` and sets `global.automatchingFlag`, `storeAutomatchingFlag` and `assetFlag` from the manager or chain record.
     - It puts `LOGIN_RESPONSE` and writes `AsyncStoreApp.storeUser({response,responseMaster})`.
     - If `user.is_accept_policy != true` it puts `SHOW_POLICY`. Otherwise it calls `navigateToHome()`.
     - Finally it dispatches `exchangeForFirebaseToken(accessToken)` (chat auth, see `features/auth`).
  2. Errors from `signIn`:
     - `UserNotFoundException` (a legacy user not yet migrated to Cognito): calls **POST `{API_URL}/api/auth/validate`** with `{loginId, password}`. Note that this path is not under `/api/mobile`. On 200 it retries `fetchAutValidateViaCognito`. Otherwise it calls `onLoginFailed` (LOGIN_FAILED, clear token, `forceLogout`) and shows an alert.
     - `NotAuthorizedException`: `onLoginFailed` and the alert "incorrect username or password".
     - Any other error: `onLoginFailed` and an alert with the error.
  - Legacy note: `fetchLogin` uses `LoginRepository.getLogin`, which is **POST `/api/mobile/auth/signin`**. No saga registers it, so it is dead code.
- **Flow: Microsoft login**: dispatches `LOGIN_REQUEST_MS`. Saga `fetchLoginMS` calls Amplify `signInWithRedirect({provider:{custom: Config.PROVIDER_CUSTOM}})`, which uses the Cognito hosted UI. When the Hub `signInWithRedirect` event fires it dispatches `GET_CURRENT_SESSION`. Saga `getCurrentSession` sets the token from `fetchAuthSession`, runs `fetchUserInfo` (same as above), then runs `exchangeForFirebaseToken`.
- **Modals**:
  - **`ModalToS`** (Terms of Service), visible while `loginReducer.policyVisible`, which `SHOW_POLICY` sets.
    - **Agree** dispatches `POLICY_ACCEPTED {username,password}` (taken from the form values). Saga `policyAcceptedViaCognito` calls `CommonRepository.acceptPolicy`: **POST `/api/mobile/auth/policy/accept`** with `{username,password,from:'store',registrationId,uuid,serialNo}`. On 200 it calls `navigateToHome()`. Otherwise it calls `onLoginFailed` and shows an alert.
    - **Disagree** calls `AsyncStoreApp.clearUser()` and dispatches `POLICY_DENIED`. Saga `policyDeniedViaCognito` puts LOGIN_FAILED, clears the token and puts `LOGOUT_REQUEST`. `logoutSaga` calls **POST `/api/mobile/auth/signout`** `{userId, uuid}`, then Cognito `signOut`, `clearWebViewSession` and `firebaseAuthSignOut`.
  - **Forgot-password `BaseModal`** has two options:
    - The chain-store option opens `https://www.globar.co.jp/contact/qnavi-ask/` externally.
    - The individual-store option navigates to `ResetPasword`.
- **Gating**:
  - The forgot-password link is hidden on JTVT10 and Paycas builds.
  - The home destination depends on `isChainStore()`.
- **Navigation targets**:
  - `MajorCategory {isRootStack:true}` or `ManageBox {isRootStack:true}`, reached through `navigateToHome` (stack reset).
  - `ResetPasword` (no params).
  - `Register` only through code that is now commented out.

### features/auth (chat / Firebase auth used by login)
- `features/auth/redux/authThunks.ts` defines three thunks:
  - `exchangeForFirebaseToken(cognitoAccessToken)` calls `BEChatAuthRepository.exchangeForFirebaseToken`: **POST `{Config.BE_CHAT_API_URL}/v2/firebase-auth/exchange`** with header `Authorization: Bearer <cognito access token>` and body `null`. It returns `{firebase_token}`, then dispatches `signInWithFirebaseCustomToken(firebase_token)`, which calls `firebase.auth().signInWithCustomToken`.
  - `firebaseAuthSignOut()` calls `firebase.auth().signOut()`. It is called on logout, `forceLogout`, and when the auto-login 401 probe fails.
- `features/auth/redux/authSlice.ts`: an empty slice (`authReducer`) with no state.
- Callers: the `getCurrentSession`, `getCurrentSessionForFirebaseLogin` and `fetchAutValidateViaCognito` sagas.

### ResetPasword (`ResetPasswordScreen`), `screens/ResetPassword/ResetPassword.tsx`
- **Purpose**: password reset request for individual stores (SC0001A).
- **Params**: none.
- **UI**:
  - `Header` (back) and a caption.
  - A `FormWidthTitle` "store" section with three required fields:
    - `storeName` (`InputForm`, max 50)
    - `phoneNumber` (`MaskInputForm`, mask `99-9999-999999`, regex `^[0-9-]+$`)
    - `emailAddress` (`InputForm`)
  - Description text and a Submit `Button`.
- **API**: `ApiInstance.apiModule.post` directly, with no saga: **POST `{API_URL}/api/auth/reset-password`** with `{phone (dashes stripped), storeName, email}`. Note that this path is not under `/api/mobile`.
  - On 200 it shows a success `BaseModalOk` with `response.results.message`.
  - On error it dispatches `ALERT_ERROR_RESPONSE`, which opens the global error modal.
- **Modals**: the success `BaseModalOk`. OK calls `navigateAndResetStack(Login)`.
- **Gating**: the screen is reachable only from Login's forgot-password modal, which is hidden on JTVT10 and Paycas builds.
- **Navigation**: `Login` (stack reset) after success; back via the Header.

---

## Store self-registration (legacy / likely unreachable)

### Register (`RegisterScreen`), `screens/Register/ResgisterScreen.js` with `AccountForm.tsx`
- **Purpose**: self sign-up for a new store account (SC004).
- **Reachability**: the entry button on Login is commented out. The only remaining `navigate(Register)` calls come from `registerSaga.postQrRegister` and `RegisterQRScreen` cancel. Uncertain: the screen is effectively unreachable in the current UI.
- **Params**: `route.params.qrData` (set by registerSaga after a QR scan). The screen itself does not read `route.params`. It reads `registerQrReducer.data` and passes it to `AccountForm` as `qrData`.
- **UI** (`AccountForm` with `isEdit=false`):
  - Account section:
    - `username`: required, 8–32 characters, `Constants.Regex.Login`.
    - `password`: required, 8–32 characters, `Regex.Password`.
    - `passwordConfirm`: must match `password`.
  - QR hint and a `QrCamera` tile (`onScanQr`).
  - Partner/company section: `partnerCode` and `partnerName`, max 50 each. The QR result fills both and sets the hidden `agentId`.
  - Store section:
    - `name`: required, max 50.
    - `phone`: required, `Regex.Phone`.
    - `email`: required, `Regex.Email`.
    - `businessTime` (`InputTime`).
    - `postcode`: required, `Regex.Zip`.
    - `province`: required. A `Dropdown` built from `global.masterConfig.tdfks`.
    - `address1`: required.
    - `address2`.
    - `fixed_amount`: optional, `Regex.FixAmount`.
  - Staff field-array: each entry has `name` (required, max 50) and `phone` (required, `Regex.Phone`). An "Add staff" `TextLink` adds entries and each has a remove icon.
  - A Register `Button`. `onError` focuses the first invalid input.
  - On focus, `AccountForm` calls `getMasterConfig()`, which is `MASTER_CONFIG_REQUEST` (POST `/api/mobile/v2/auth/config`).
- **Actions**:
  - **Scan QR**: `Common.requestCamera(navigateToQrScreen(), ...)`. Note that the call happens immediately, not as a callback. It navigates to `RegisterQr`.
  - **Register**: opens `ModalConfirmMessage`. Yes builds `{account:{username,password}, store:{name,address1,address2,phone,email,business_time,zipcode,tdfk,staffs[],agent,fixed_amount}, os, from:'store', registrationId, uuid}` and dispatches `REGISTER_REQUEST`. Saga `registerSaga.postRegister` calls `RegisterRepository.PostRegister`: **POST `/api/mobile/auth/register`**. On 200 it puts `REGISTER_RESPONSE`. Otherwise it puts `REGISTER_FAILED` and an alert.
  - **Back**: if any input is dirty it shows a confirm modal. Otherwise it calls `goBack()`.
  - **`onChangePayment`**: `navigate(PaymentInfoRegister)`. This is passed to `AccountForm`, but `AccountForm` never uses that prop, so it is dead code.
- **Modals**:
  - Register confirm (`ModalConfirmMessage`).
  - Success (`ModalOkMessage`, shown when `registerReducer.status==='ok'`). OK calls `navigate(Login, {register:{username,password}})`, which triggers the auto-login.
  - "No agent" warning, shown when the QR read returns no `qrcode`.
  - Back-confirm.
- **Navigation**: `RegisterQr`; `Login {register:{username,password}}`; `goBack`.

### RegisterQr (`RegisterQRScreen`), `screens/Register/RegisterQRScreen.tsx`
- **Purpose**: scan an agent (partner) QR code during registration.
- **Params**: none.
- **UI**:
  - Uses `react-native-vision-camera` (`useCameraDevice('back')`, `useCodeScanner` with codeTypes `['qr']`).
  - Shows a loading spinner while the camera permission is unknown.
  - When permission is denied it shows a text and a Cancel button.
  - Otherwise: a square camera view and a Cancel `Button`.
- **Actions**: the first scanned code sets `isActive=false` and dispatches `REGISTER_QR_REQUEST(qrcode)`. Saga `registerSaga.postQrRegister` calls `readQrRegister`: **POST `/api/mobile/agents/qrcode`** `{qrcode}`.
  - The saga wraps any truthy response as `statusCode:200`, so error responses are also treated as success.
  - It puts `REGISTER_QR_RESPONSE`. If `results.results.name` is defined it calls `navigate(Register, {qrData: response.results})`.
- **Cancel**: `navigate(Register)`.
- **Navigation**: `Register` (with or without `qrData`).

### PaymentInfoRegister (`PaymentInfoRegisterScreen`), `screens/PaymentInfoRegister/PaymentInfoRegisterScreen.js`
- **Purpose**: a legacy credit card registration form.
- **Reachability**: the only caller is `RegisterScreen.onChangePayment`, which is never invoked (see above). It is effectively unreachable.
- **Params**: none.
- **UI**:
  - `Header` (back), caption and note.
  - `FormWidthTitle` with `cardNumber`, `expirationDate` and `securityCode` (`InputForm`).
  - Submit `Button` and `TabBarBottom`.
- **Actions / bugs** (confirmed in code):
  - `validate()` initialises `isValid=false` and never sets it to true, so submit never dispatches.
  - Even if it did, `mapDispatchToProps` calls `paymentInfoRegisterAction.requestGetToken` and `requestRegister`, which do not exist. The action file exports only `requestPaymentInfoRegister`, `registerFailed` and `onPaymentInfoRegisterResponse`.
  - No saga handles `PAYMENT_INFO_REGISTER_REQUEST`.
  - `state.paymentInfoRegisterReducer` is not registered. Uncertain: not checked in `rootReducers`; no references were found.
- **API**: none in practice.
- **Navigation**: back only. `TabBarBottom` gives Home, Request and other tabs.

---

## Payment settings

### PaymentManagement (`PaymentManagementScreen`), `screens/PaymentManagement/PaymentManagementScreen.tsx` with `CardRegistrationModal.tsx` and `CardItem.tsx`
- **Purpose**: choose the payment method (invoice/bill `'00'` or credit card `'01'`), manage the store's credit cards (add, delete, set main) (SC0035).
- **Entry points**: the "change payment" `ButtonOutline` in `AccountForm` edit mode, which appears in `StoreEdit`, including the read-only Toridoll variant. That call is `navigate(PaymentManagement)` with no params. `screens/WorkDetailPayment/PaymentFailModal.tsx` reuses `CardRegistrationModal` directly rather than navigating.
- **Params** (optional): `fromFailureModal?: boolean`, `troubleId?`, `allPay?`. If `fromFailureModal===true` the add-card modal opens on mount. Uncertain: no current caller navigates with these params.
- **State**:
  - RTK slice `slices/PaymentManagementSlice.ts` (`state.paymentMananagementSlice`): `cards`, `okModal`, `confirmModal`, `isCredit`, `mainCard`, `initialIsCredit`, `initialMainCardId`, `addCardError`, `creditCard`.
  - The initial `is_credit` comes from `storeEditReducer.results.is_credit`.
  - `storeId` is `storeListReducer.storeCheckedId ?? global.storeId`.
- **On mount**: dispatches `changeIsCredit({isCredit: is_credit, hideModal:true})`, `setInitialIsCredit` and the thunk `getCards()`.
  - `getCards()` calls **GET `/api/mobile/credit_cards`** with params `{chainStoreId, individualStoreId, chainSystemId}`.
    - `chainStoreId` is the store id if `isChainStore() || isStoreAdmin()`.
    - `individualStoreId` is the store id if `isIndividualStore()`.
    - `chainSystemId` is `user.manager?.system ?? user.chain?.system`.
  - The reducer adjusts `isMainPayment` by `storeEditReducer.results.is_use_system_card`: system (chain) cards versus own cards. It also moves the main card to the top of the list.
- **UI**:
  - `Header` (back). If `isCredit` or the main card differs from its initial value, back opens a confirm (AMSG00049) whose action is `navigateBack()`. Otherwise it calls `navigateGoBack()`.
  - Caption, and a description that names the selected method.
  - Two radio rows, "Bill payment" (`changeIsCredit('00')`) and "Credit card payment" (`changeIsCredit('01')`). Choosing '00' also opens an OK modal (AMSG00126).
  - Card list (`CardItem`). It is greyed out and disabled when `isCredit==='00'`. An "Add card" `TextLink` appears when cards are enabled.
  - Save `Button`. When `isCredit==='01'` and there are no cards it opens an OK modal (AMSG00018 "register a credit card"). Otherwise it opens a confirm (AMSG00056) whose action is the thunk `changePaymentMethod()`.
  - `TabBarBottom`.
- **`CardItem`**:
  - Shows the brand icon (amex, visa, diners, mastercard, jcb), masked number and expiry.
  - Chain-system cards have a yellow background and the label "chain system payment".
  - Tap calls `changeMainCard(item)`. This only changes local state and opens the OK modal AMSG00057.
  - The trash icon appears only for non-system cards (`chainSystemId===null`). It opens a confirm (AMSG00061) with the action `deleteCard(item.id)`:
    - **DELETE `/api/mobile/credit_cards/{id}`**.
    - On 200: `getCards()` and the OK modal AMSG00063.
    - If it was the last card it also runs `changePaymentMethod({isCredit:'00'})` and `STORE_INFO_REQUEST`.
- **`CardRegistrationModal`** (`BaseModal`):
  - Fields, validated with yup:
    - `cardNumber`: digits only, 12–18 characters.
    - `cardExpire`: `MM/YY`, not in the past.
    - `securityCode`: digits only, 3–4 characters.
  - Submit dispatches the thunk `addCard`:
    1. Gets a Veritrans token: **POST `Config.TOKEN_URL`** (external Veritrans token API) with `{token_api_key: Config.TOKEN_API_KEY, lang:'ja', card_number, card_expire, security_code}`.
    2. **POST `/api/mobile/credit_cards/register`** with `{token, chainStoreId, individualStoreId, isMainPayment: cards.length===0}`. A 201 counts as success.
  - On 201, `getCards()` runs, then one of two branches:
    - If `fromFailureModal`: `changePaymentMethod({isCredit:'01', mainCard})`, then `troublePay({troubleId, payAll: allPay})`, which is **POST `/api/mobile/troubles/payment`**, followed by `getTroubleDetail`.
    - Otherwise: the OK modal AMSG00127.
  - On error it opens the OK modal with the message and sets `addCardError`. Closing that OK modal reopens the add-card modal.
- **`changePaymentMethod` thunk**: **POST `/api/mobile/credit_cards/change_payment`** with `{chainStoreId, individualStoreId, isCredit, chainSystemId, mainCardId}`.
  - On 200 it dispatches `STORE_INFO_REQUEST {id: storeId}` (saga `storeEditSaga.fetchStoreInfo`, **POST `/api/mobile/stores/info`** `{storeId}`), `getCards()` and `setInitialIsCredit`. When called with no argument it also opens the OK modal "payment changed".
  - On error it dispatches `ALERT_ERROR_RESPONSE`.
- **Modals**: `CardRegistrationModal`, `BaseModalConfirm` (its right button dispatches the stored `confirmModal.action`) and `BaseModalOk`. OK closes the modal, restores `addCardError` and dispatches `STORE_INFO_REQUEST`.
- **Role gating**: the store id goes into `chainStoreId` or `individualStoreId` depending on `isChainStore()`, `isStoreAdmin()` and `isIndividualStore()`. System cards cannot be deleted. The screen does not check `permissionsReducer.is_allow_payment`.
- **Navigation**: back, either through `navigateBack` (the slice reducer calls `navigateGoBack()`) or `navigateGoBack()`; plus the `TabBarBottom` targets.

---

## System status screens (conditionally rendered)

### Maintenance (`MaintenanceScreen`), `screens/Maintenance/Maintenance.tsx`
- **Rendering condition**: `StackNavigator` renders *only* this screen when `alertReducer.params.statusCode === 503` (MAINTENANCE). ApiModule maps a 503 whose response has `isMaintenance:true` to this code. All other routes are unmounted.
- **Purpose**: shows the maintenance notice page.
- **Params**: none.
- **UI**: a full-screen `WebView` of `Config.CMS_FE_URL + '/maintenance-store'`. Any other URL is opened externally with `Linking.openURL` and blocked inside the WebView.
- **API**: none. The global error modal is suppressed for 503.
- **Navigation**: none. There is no exit in code: the stack only returns once `alertReducer` is cleared. Uncertain how that happens; probably only on app restart.

### ServiceUnavailable (`ServiceUnavailableScreen`), `screens/ServiceUnvailable/ServiceUnvailable.tsx`
- **Rendering condition**: rendered exclusively when `alertReducer.params.statusCode === 502` (BAD_GATEWAY). That happens on a real 502, or on a 503 without `isMaintenance`.
- **UI**: a full-screen `WebView` of `Config.CMS_FE_URL + '/server-error-store'`. Other URLs are opened externally.
- **Params, API, navigation**: none. Same lock-in behaviour as Maintenance.

---

## WebViews

### WebView (`WebViewScreen`), `screens/WebView/WebViewScreen.tsx`
- **Purpose**: a generic in-app viewer for URLs, images, PDFs, the Terms of Service page, and the trouble/consultant web app (`Config.TROUBLE_WEB_VIEW_URL`).
- **Params**:
  - `uri` (required)
  - `leftIcon?: 'back'`
  - `offBack?: boolean`, which hides the close button
  - `troubleCategoryId?: number`
  - `mode?: 'search'|'select'`
- **Render branches**:
  1. When `isImageURL(uri)`: a black HTML page showing the image, a close button, and a Download icon (`downloadAndSave(uri)`).
  2. When the uri contains `.pdf`: a `react-native-pdf` viewer with a close button.
  3. When the uri contains `/term-of-service`: a `Header` titled Terms of Service (using `leftIcon`) above a WebView.
  4. Default: a `ButtonClose` (unless `offBack`) and a `WebView` (incognito, no cache).
     - If the uri is exactly `TROUBLE_WEB_VIEW_URL`, it first calls `ApiInstance.apiModule.refreshToken()` (Amplify `fetchAuthSession`). It then injects cookies before the content loads: `token`, `refresh_token` (from `global.device`), `large_category`, `mode`, `store_id` and `store_name`.
     - Inside a trouble URL, navigations to non-trouble URLs open externally.
     - On Android it injects JS when the keyboard appears, so the chat input scrolls into view.
- **Messages**: `Constants.CLOSE_CONSULTAN_WEBVIEW_EVENT` triggers `navigateGoBack()`.
- **Permissions**: on mount it requests the Android CAMERA, READ_EXTERNAL_STORAGE and WRITE_EXTERNAL_STORAGE permissions.
- **API**: none, apart from the Cognito token refresh.
- **Callers**:
  - DrawerMenu: Privacy (`https://www.globar.co.jp/privacypolicy/`), Terms (`CMS_FE_URL/term-of-service` with `leftIcon:'back'`) and Company (`https://www.globar.co.jp/company/`).
  - DrawerMenu `gotoScreen('Policy')` passes the *string* `'Policy'` as params. This would crash because `uri` would be undefined, but nothing in the menu calls it.
  - ManualContact (PDF manuals).
  - MajorCategory, TroubleDetail, EstimationDetail, WorkInprogressDetail, WorkReport, ChatBox, ChatItem, CardChatStore and CardChatWorkingStaff.
- **Navigation**: `goBack` only.

### PWA_Webview (`PWA_Webview`), `screens/WebView/PWA_Webview.tsx`
- **Purpose**: hosts the estimation PWA (`Config.PWA_URL`, the qnavi-estimation-frontend) for estimate review, approval and payment flows.
- **Params**: `uri`, a path appended to `PWA_URL`. Callers use `trouble/{id}/estimate`, sometimes with `?mode=summary` or other query values.
- **Token handling**:
  - Gets the Cognito access token from `fetchAuthSession({forceRefresh?})` and the refresh token from `cognitoUserPoolsTokenProvider.tokenOrchestrator.getTokenStore().loadTokens()`.
  - Calls `clearWebViewSession()`, then writes native cookies with `@react-native-cookies/cookies` on the PWA domain:
    - `access_token` (24h)
    - `refresh_token` (30d)
    - `login_id` = `global.user._id` (30d)
  - Verifies the `access_token` cookie up to 3 times.
  - Also injects `document.cookie` before the content loads and again `onLoadEnd`.
  - Clears localStorage and sessionStorage when the session owner (login_id) changes.
  - Basic-auth credentials embedded in `PWA_URL` are sent as an `Authorization` header and through `onHttpAuthRequest`.
- **Recovery**:
  - If the page lands on `/unauthorized` it replaces the location with the original URL, up to 2 times (an iOS 26 cookie-sync workaround).
  - `onError`, or an HTTP status of 400 or more, shows an error screen: "読み込みに失敗しました" with a Retry button (up to 3 retries, then back).
  - On a `TOKEN_EXPIRED` message it force-refreshes once. If that fails it shows the alert "セッションエラー" and goes back.
- **Back handling**: the Android hardware back button goes back natively if the URL ends with `/estimate` or `/login`. Otherwise it injects `RN_BACK` and `history.back()`, or posts `CLOSE_WEBVIEW`.
- **postMessage protocol** (PWA to app):
  - `CLOSE_WEBVIEW`: `goBack`.
  - `DOWNLOAD_PDF {base64,fileName}`: `downloadPDFBase64`.
  - `SHARE_PDF`: `sharePDFBase64`.
  - `GO_TO_HOME`: `navigateToHome()`.
  - `GO_TO_LIST_APPROVAL {troubleId}`: `navigate(ListApprovalScreen, {troubleId})`.
  - `PAYMENT_COMPLETED_ACTION`, with an `action` field:
    - `GO_TO_NEXT_TROUBLE`: `StackActions.replace(WorkContinueInprogress, {troubleId: nextTroubleId})`.
    - `GO_TO_HISTORY`: reset to `[MajorCategory|ManageBox {isRootStack:true}, HistoryList]`, choosing by `isChainStore()`.
    - `GO_TO_TOP`: `navigateToHome()`.
  - `TOKEN_EXPIRED`: refresh flow (above).
- **API**: no direct REST calls. Approval and payment happen inside the PWA.
- **Gating**: in the app, only `isChainStore()` affects routing. Any approval or payment permission checks happen in the callers or the PWA. Uncertain: those were not checked here.
- **Callers**: TroubleDetail, EstimationDetail (with `navigatePush`), WorkInprogress, WorkInprogressDetail, WorkContinueInprogress, WorkReport and WorkDetailPayment.

### (unregistered) `WvScreen`, `screens/WebView/WvScreen.js`
- `StackNavigator.tsx` imports it (`import WvScreen from '~/screens/WebView/WvScreen'`), but **no `Stack.Screen` registers it**. It is dead code.
- It is a placeholder that renders a `Header` (title = `route.params`, default "WEBVIEW CONTENT") and the static text "Webview content". `WebViewScreen.tsx` also uses `TAG='WvScreen'`, which is only a log tag.

---

## Static / help

### ManualContact (`ManualContactScreen`), `screens/Static/ManualContact.tsx`
- **Purpose**: list of manuals and the contact link (マニュアル・問い合わせ一覧).
- **Reachability**: it is registered in the Stack, but no `navigate(ScreenTypes.ManualContact)` call exists anywhere in `app/`. It is unreachable from the current UI, which is uncertain only if something navigates to it dynamically by name.
- **Params**: none.
- **UI**: `Header` (back), a `FlatList` of link rows (icon and title), and `TabBarBottom`.
  - Default list:
    - Basic manual PDF (`qnavi.club/manual/tennpomanual.pdf`)
    - 4 YouTube videos: how to request, approve an estimate, check history/report, and use the admin account
    - Sludge collection PDF (`qnavi.club/_bk/pdf/odei.pdf`)
    - Contact (`globar.co.jp/contact/qnavi-inquiry/`)
  - When `global.Paycas` is set, only the two PDFs are listed.
- **Actions**: video and email items open externally with `Linking.openURL`. PDF items navigate to `WebView {uri}`.
- **API**: none.
- **Navigation**: `WebView {uri}`; back; `TabBarBottom` targets.

---

## Store account

### StoreEdit (`StoreEditScreen`, class component extending `BaseMainScreen`), `screens/StoreEdit/StoreEditScreen.js`
- **Purpose**: view and edit the store account information, its staff and payment entry, and cancel (deactivate) the account (SC0006). It reuses `AccountForm` with `isEdit=true`.
- **Entry points**:
  - DrawerMenu "Account" for non-manager users (`!global.user.manager`). It calls `navigation.navigate(StoreEdit, 'Account')`. The params are the string `'Account'`, so `storeId` is undefined and the screen falls back to `global.storeId`.
  - `StoreList` item tap when the list was opened from the DrawerMenu: `{storeId}`.
- **Params**: `route.params.storeId?`.
- **On mount**: dispatches `STORE_INFO_REQUEST {id: storeId ?? global.storeId}`. Saga `storeEditSaga.fetchStoreInfo` calls `GetStoreById`: **POST `/api/mobile/stores/info`** `{storeId}`, which results in `STORE_INFO_RESPONSE` and fills `state.account`.
- **On unmount**: dispatches `RESET_STATE` and resets the Android keyboard mode.
- **UI**:
  - `TitleArea`.
  - An "Auto matching" badge when `account.automatchingFlag`.
  - Pull-to-refresh (repeats `STORE_INFO_REQUEST`).
  - `AccountForm` (edit). It shows only the store and staff sections: account, QR and partner sections are hidden. Fields:
    - `name`, `phone`, `email`, `postcode`, `province` and `address1` are required.
    - `address2`, `businessTime` and `fixed_amount` are optional.
    - Staff list with name and phone.
  - Buttons: Save, "Change payment method" (navigates to `PaymentManagement`) and "Cancel account".
  - `TabBarBottom`, hidden on Android while the keyboard is open.
  - `AccountForm` calls `getMasterConfig()` on focus (POST `/api/mobile/v2/auth/config`) to get the prefecture list.
  - `AccountForm` has a `beforeRemove` listener: when the form is dirty it shows a "discard changes" confirm through `showMessageConfirm`.
- **Actions**:
  - **Save**: confirm (`sStoreEdit.message.confirm`), then `STORE_SAVE_REQUEST {id,name,address1,address2,phone,email,business_time,zipcode,prefectures,staffs[],fixed_amount}`. Saga `saveStoreEdit` calls **POST `/api/mobile/stores/update`**. `STORE_SAVE_RESPONSE` shows the success modal, whose OK calls `navigateGoBack()`.
  - **Cancel account**: `ModalConfirmMessage`, then `ACCOUNT_DEACTIVE_REQUEST {storeId: global.storeId}`. Note that it uses the global store, not the edited `storeId`. Saga `deactiveAccount` calls **POST `/api/mobile/stores/deactive`**. `ACCOUNT_DEACTIVE_RESPONSE` shows the "cancel success" modal. Uncertain: there is no logout or navigation afterwards in this screen.
  - `STORE_INFO_FAILED` shows an alert modal with the message. Every saga failure also dispatches the global `requestAlertErrorAction`.
- **Gating**:
  - `disableEditAccount = isToridollUser()` (`global.user.system_id == 2`). It makes all inputs read-only and hides Save and "add staff"; only "Change payment" and "Cancel account" remain.
  - The DrawerMenu sends managers (`global.user.manager`) to `StoreList` first instead of here.
- **Modals**: the confirm from `BaseMainScreen` (`showMessageConfirm`), `ModalOkMessage` (success, error and cancel-success) and the deactivate confirm.
- **Navigation**: `PaymentManagement` (no params); `navigateGoBack()` after save.

### StoreList (`StoreListScreen` wrapping `StoreListScreenInner` in a `MenuProvider`), `screens/Store/StoreListScreen.tsx`
- **Purpose**: list of the stores that the user (a manager or multi-store account) can access. Picking a store makes it the current store (SC0005).
- **Entry points**:
  - DrawerMenu "Account" when `global.user.manager` is set: `{from: 'DrawerMenu'}`.
  - The ManageBox screen: `gotoScreen(StoreList)`.
  - The `TabBarBottom` "Request" tab for non-chain users: `navigateAndResetStack(StoreList)`.
- **Params**: `route.params.from?`, which defaults to `ManageBox`.
- **Data**: the react-query hook `useStoreList` (`hook/query/useStoreList.ts`, `useInfiniteQuery`, key `['storeList', storeId, storeName, sortColumn, sortDirection]`). It calls `StoreRepository.GetStoreList`: **GET `/api/mobile/stores/list`** with query `{storeId: global.storeId, page, numberItem:20, storeName, sortColumn:'store_name', sortDirection}`. Pages are 20 items and the next page loads `onEndReached`.
  - The first load without a cache dispatches `showMainLoading()`.
- **UI**:
  - `Header` (back).
  - `InputSearch`: typing sets `search`, and submitting sets `keyword`, which refetches.
  - `FilterListStore`, a popup menu for sort direction asc/desc.
  - `FlatList` rows: a check icon when `storeListReducer.storeCheckedId === item.id`, the store name, and `IconNotice` when `countTrouble > 0`.
  - Pull-to-refresh: `refetch()` plus a `latestNews` refetch.
  - `EmptyData`.
  - `TabBarBottom isStoreList={!isChainStore()} onReload`.
- **Item tap**:
  - Dispatches `SAVE_STORE_CHECKED {storeId}`. The reducer sets `storeCheckedId`. The saga `storeSaga.saveStoreChecked` loop never executes (`while (i > 0)` with `i=0`).
  - Dispatches `getMasterConfig({reloadTarget:'all', chainSystem, storeId})`: **POST `/api/mobile/v2/auth/config`** `{version:0, chain_system, storeId}`. It refreshes `global.masterConfig` and the alias key.
  - Sets `global.storeAutomatchingFlag = item.automatchingFlag`.
  - Navigates by origin:
    - From the DrawerMenu: `StoreEdit {storeId: item.id}`.
    - Otherwise: `RequestList {id: item.id, name: item.name}`.
- **Gating**:
  - Managers reach this screen through the DrawerMenu.
  - The bottom tab behaviour depends on `isChainStore()`: chain users go to `MajorCategory` instead.
  - It does not use `global.storeId` reassignment directly. Store selection is tracked in `storeListReducer.storeCheckedId`, which `PaymentManagement` and other screens read.
- **Navigation**: `StoreEdit {storeId}`; `RequestList {id, name}`; back.

---

## Endpoint summary (this group)
| Method | Path | Used by |
|---|---|---|
| POST | `/api/mobile/auth/check_app_version` | Login (`CHECK_APP_VERSION_REQUEST`) |
| POST | `/api/mobile/v2/auth/config` | Login saga, App foreground, AccountForm focus, StoreList tap (`MASTER_CONFIG_REQUEST`) |
| POST | `/api/mobile/auth/info` | Login saga `fetchUserInfo`, `refreshAuthInfo` thunk (App) |
| POST | `/api/auth/validate` (not under `/api/mobile`) | Login, Cognito `UserNotFoundException` migration |
| GET | `/api/mobile/stores/permission` | Login auto-login token probe |
| POST | `/api/mobile/auth/policy/accept` | Login ToS agree (`POLICY_ACCEPTED`) |
| POST | `/api/mobile/auth/signout` | ToS disagree, then `LOGOUT_REQUEST` |
| POST | `{BE_CHAT_API_URL}/v2/firebase-auth/exchange` | `exchangeForFirebaseToken` (chat auth after login) |
| GET | `/api/mobile/stores/get_side_bar` | App foreground (`GET_BADGE_SIDE_BAR_REQUEST`) |
| POST | `/api/auth/reset-password` (not under `/api/mobile`) | ResetPasword |
| POST | `/api/mobile/auth/register` | Register (`REGISTER_REQUEST`) |
| POST | `/api/mobile/agents/qrcode` | RegisterQr (`REGISTER_QR_REQUEST`) |
| GET | `/api/mobile/credit_cards` | PaymentManagement `getCards` |
| POST | `Config.TOKEN_URL` (Veritrans) | CardRegistrationModal `addCard` step 1 |
| POST | `/api/mobile/credit_cards/register` | `addCard` step 2 |
| DELETE | `/api/mobile/credit_cards/{id}` | CardItem `deleteCard` |
| POST | `/api/mobile/credit_cards/change_payment` | `changePaymentMethod` |
| POST | `/api/mobile/troubles/payment` | `addCard` when `fromFailureModal` (`troublePay`) |
| POST | `/api/mobile/stores/info` | StoreEdit, PaymentManagement (`STORE_INFO_REQUEST`) |
| POST | `/api/mobile/stores/update` | StoreEdit save (`STORE_SAVE_REQUEST`) |
| POST | `/api/mobile/stores/deactive` | StoreEdit cancel account (`ACCOUNT_DEACTIVE_REQUEST`) |
| GET | `/api/mobile/stores/list` | StoreList `useStoreList` |
| (dead) POST | `/api/mobile/auth/signin` | `LoginRepository.getLogin`; no saga registers it |


# QnaviShop: home, request-creation flow and trouble lists (part B)

All paths are relative to `qnavi-shop-app/QnaviShop/app/`. `DOMAIN_API` = `Config.API_URL + '/api/mobile/'`. The HTTP method shown is the one `ApiModule` actually uses: `get` maps to GET, and `post`, `postFormData` and `postFormUrlencoded` map to POST.

**Cross-cutting facts that apply to every screen below**
- Role helpers live in `config/index.js` and are built on `global.hasRole(role)` over `global.user.roles`:
  - `isChainStore()` is true for role `storeGenba` (chain-store floor staff).
  - `isStoreAdmin()` is true for `storeAdmin`.
  - `isIndividualStore()` is true for `individual`.
- None of the screens in this part reads `permissionsReducer` or `global.permissions` (`is_allow_select_worker`, `is_allow_approve_estimate`, `is_allow_payment`). Those permission flags gate screens further down the flow (WorkerSelection, estimates, payment). They are out of scope here. Role gating here comes only from `isChainStore`, `isStoreAdmin` and `isIndividualStore`, plus `global.user.manager`/`chain` for `chain_system`.
- Master config request: `getMasterConfig` → `MASTER_CONFIG_REQUEST` → `commonSaga.fetchMasterConfig` → `CommonRepository.GetMasterConfigV2`.
  - It posts to `ApiList.MASTER_API_V2` (`DOMAIN_API2 + 'auth/config'`). `ApiListNewMapper` then **remaps that URL to `POST /api/mobile/auth/config`**.
  - Body: `{version: 0, chain_system, storeId?}`.
  - Side effects: it writes `global.masterConfig` (categories, `chatbotFlag`, assets), `global.assetFlag`, `global.summaryTrouble` and the API alias key. On 400 it sets `global.storeId = null`.
- Badge request: `getBadgeSideBar` → `GET_BADGE_SIDE_BAR_REQUEST` → `commonSaga.fetchBadgeSideBar`.
  - It first dispatches the RTK thunk `chat/getMentionUnreadCount` (`features/chat/redux/chatThunks.ts`).
  - Then it calls `GET /api/mobile/stores/get_side_bar`.
  - It sets `global.automatchingFlag` and `global.storeAutomatchingFlag`, and sets the iOS app badge.
- Errors from sagas are dispatched as `alertAction.requestAlertErrorAction`. The global `BaseModalOk` in `navigation/ContainerNavigation.tsx` renders them.

---

## Shared chrome

### Header (`layout/Header.tsx`, function component `Header`)
- **Purpose:** the top bar used by every screen in this part. It is not a route.
- **Props used:**
  - `title`, `bgWhite`, `uppercase`.
  - `leftIcon` (`'menu'` or `'back'`), `onBackPress`, `backNavigate`.
  - `isShowTopHeader`, `isShowDrawer`, `isShowRefresh` (default true), `onPressRefresh`.
  - `renderRightView`, `hideNotification`, `onReloadLayout`.
  - Props passed by callers but **ignored by Header:** `sideMenu`, `drawer`, `titleCenter`, `isShowMenu`.
- **Top row** (only when `isShowTopHeader`):
  - Hamburger button (when `isShowDrawer`): dispatches `commonAction.getBadgeSideBar()`, then calls `RootNavigation.openDrawer()`.
    - `openDrawer()` opens the **app-level** `DrawerView` (`layout/DrawerView.tsx`): a gesture-handler `DrawerLayout` with `drawerLockMode="locked-closed"`, so it cannot be swiped open. It renders `DrawerMenu` and is mounted in `ContainerNavigation.tsx` with `drawerRef`.
    - A dot badge shows when `badgeSizeBar.notificationFlag || badgeSizeBar.troubleUnreadFlag`.
  - Refresh icon (when `isShowRefresh`): calls `onPressRefresh`.
- **Main row:**
  - Back chevron (when `leftIcon === 'back'`). Tap order: `onBackPress` if given, else `navigation.navigate(backNavigate)`, else `goBack()`.
  - A "menu" state is computed when `leftIcon === 'menu'`, or when `leftIcon === 'back'` and the stack cannot go back. In that state the back button is hidden; no hamburger is drawn in this row.
  - Centred title.
  - Optional `renderRightView`.
- **Notification dropdown:** `useLatestNews(isUserLoggedIn)` is a react-query hook with key `['latestNews']` that calls `GET /api/mobile/notifications/store_newest` (staleTime 5 min, enabled once `isLogin()` resolves true).
  - When the result is not empty and `!hideNotification`, the header renders `screens/Notification/NotificationDropdown.tsx`, an overlay pinned to the top.
  - Expand toggle: shows `publicDate` and the content clamped to 3 lines.
  - "To detail" link: shown only when the text is 3 lines or more. Navigates to `NotifyDetail` with `{item}`.
  - "Mark read / hide": `useHideNotice` mutation, `GET /api/mobile/notifications/hide_notice/{id}`. On success it invalidates `['notifications']` and refetches `['latestNews']`.
  - "To list": navigates to `NotifyList`.
- **On focus:** calls `props.onReloadLayout?.()` and re-checks login.

### Bottom tab bar (`components/TabBar/TabBarBottom.tsx`, `TabBarBottom`)
Every screen in this part renders it. Its props (`onReload`, `isHome`, `isStoreList`, `isTrouble`, `isTaskList`, `isChatList`) mean "this tab is the current screen, so tapping it reloads instead of navigating". That applies only when `!navigation.canGoBack()`.

| Tab | Behaviour |
|---|---|
| Home | Resets the stack to `MajorCategory` for a chain store, else to `ManageBox`. |
| Request (依頼) | Resets to `MajorCategory` for a chain store, else to `StoreList`. |
| Progress | Resets to `TroubleList` `{id: global.storeId, name: global.user.chain?.name}` if `isStoreAdmin() \|\| isIndividualStore()`, else to `RequestList` with the same params. Also dispatches `getBadgeSideBar`. |
| Task | Dispatches the `taskSlice.updateParamGetListTask` reset, then resets to `ListTask` `{hideBtnBack: true}`. The badge shows `countTaskNotDone`. |
| Chat | Resets to `ChatList` `{hideBtnBack: true}`. The badge shows `countTroubleUnread + chatReducer.mentionUnreadCount`. |

### Base screens (`screens/Base/*`)
- **`BaseLayout`** (`BaseLayout.js`): a class shell with `SafeAreaView`, a `Header` (`sideMenu` and `drawer` props, which Header ignores) and an overridable `renderBody()`. It has no drawer and no modals.
- **`BaseMainScreen`** (`BaseMainScreen.js`, a PureComponent):
  - Wraps content in its **own** gesture-handler `DrawerLayout` (`this.drawerRef`, left side, `DrawerMenu`).
  - Renders `Header` with `leftIcon` set to `isRootStack ? 'menu' : 'back'`, and wires `onReloadLayout` to `this.onReloadLayout`.
  - Provides `showMessageAlert(msg, cb)`, which renders `ModalOkMessage`, and `showMessageConfirm(msg, cb)`, which renders `ModalConfirmMessage`.
  - Its overridable hooks are `renderBody`, `renderLoading`, `onReloadData` and `onReloadLayout`.
  - Because Header's hamburger calls the global `openDrawer()`, this per-screen drawer is effectively only reachable by gesture (uncertain whether any route still relies on it).
- **`BaseMainScreen.tsx`:** the generic TS version of the same idea. It wraps content in a `DrawerLayout` and renders `Header` with the `menu`/`back` icon, but has no modals and no `onReloadLayout`. Its constructor calls `this.setState`, which is a bug: it has no effect in a constructor.
- **`BasePushScreen.js`:** despite the name, it is a placeholder functional `NotifyListScreen`. It has a back header and a "Get List" text button that dispatches `notifyAction.getNotifyList({})` (redux `notifyListReducer`). It looks like dead or demo code.
- None of the screens in this part actually extends these bases. `ManageBoxScreen` imports `BaseMainScreen` but extends `React.Component`.

---

## Home

### ManageBox (`ManageBoxScreen`)
- **File:** `screens/ManageBox/ManageBoxScreen.js`, a redux-connected class component. SC0003 home for **non-chain-store** users (`navigateToHome` sends chain stores to `MajorCategory` instead).
- **Purpose:** a menu hub of cards with running and unread counters.
- **Params:** `isRootStack` is passed by `navigateToHome` but **not read**.
- **UI:**
  - `Header`: title `global.user.name`, `isShowTopHeader`, `isShowDrawer`, `isShowRefresh={false}`.
  - `TitleArea` subtitle.
  - A pull-to-refresh `ScrollView` of `BoxCard` + `TitleItem` cards, in this order:
    1. Select store (`ICONS.sum`).
    2. Working list: under-text "{troubleRunningCount}", badge number `trouble_running_notice_count`.
    3. Chat list: badge is 1 if `badgeSizeBar.troubleUnreadFlag`.
    4. Notifications: badge is 1 if `badgeSizeBar.notificationFlag`.
    5. History.
    - A Message-list card is commented out.
  - `TabBarBottom isHome={!isChainStore()}`.
- **Data and API calls:**
  - On mount:
    - Handles a pending push via `Common.navigateFromNotification(global.remoteMessage)`. The condition is `!== null || !== undefined`, which is always true.
    - Fetches the FCM token into `global.fcmToken`.
    - Dispatches `appAction.getHomeInfo({storeId, is_managerbox: 1})` → `HOME_INFO_REQUEST` → `appSaga.getHomeInfo` → `AppRepository.GetHomeInfo` → **POST `/api/mobile/troubles/home`** `{storeId, is_managerbox}`. The result goes to `appReducer`, and the counters come from `results.trouble_running_count`, `message_unseen_count`, `chat_unread_count` and `trouble_running_notice_count`.
    - On failure the saga dispatches `homeInfoBoxFailed` (note: the *Box* variant) and shows an alert.
  - On focus: refetches `['latestNews']` (GET `notifications/store_newest`), dispatches `getBadgeSideBar` (GET `stores/get_side_bar`) and dispatches `getMasterConfig({reloadTarget: 'all', chainSystem})` (POST `/api/mobile/auth/config`).
  - Pull-to-refresh or the Home tab: runs `getHomeInfo`, `getMasterConfig({reloadTarget: 'categories'})`, `getManageBoxList()`, the `latestNews` refetch and `getBadgeSideBar`.
    - `getManageBoxList()` dispatches `MANAGE_BOX_REQUEST` → `manageBoxSaga.fetchManageBox`. That saga is a **stub**: it makes no API call and puts a fake success into `manageBoxReducer`.
- **Gating:** a chain store never lands here via `navigateToHome`. `isHome` on the tab bar is `!isChainStore()`.
- **Modals:** none local (the global error modal still applies).
- **Navigation:**

| Card | Target route | Params |
|---|---|---|
| Select store | `StoreList` | none |
| Working list | `TroubleList` | none (TroubleList uses `global.storeId`) |
| Chat list | `ChatList` | none |
| Notifications | `NotifyList` | none |
| History | `HistoryList` | none |

---

## Request creation flow (trouble request)

Flow: **MajorCategory → MediumCategory → MinorCategory → (AssetSelection [→ AssetCreateScreen]) → FailureContent → WorkInprogress**.

The selection is carried in **globals**, not route params: `global.majorCatSelected`, `global.mediumCatSelected` and `global.minorCatSelected`. Only `headerTitle` and `assetCatSelected` travel as params.

### MajorCategory (`MajorCategoryScreen`)
- **File:** `screens/MajorCategory/MajorCategoryScreen.js`, a redux-connected class component. SC0010. It is the **home for chain stores** (`navigateToHome` resets to it with `{isRootStack: true}`).
- **Purpose:** pick the large category, or open the chatbot "simple search" trouble WebView.
- **Params:** `isRootStack`. It is also treated as root when `!navigation.canGoBack()`.
- **UI:**
  - `Header`:
    - Title: `global.storeName` if `isStoreAdmin()`, else `global.user.name`.
    - `leftIcon`: `'menu'` at the root, else `'back'`.
    - `isShowTopHeader`; `isShowDrawer` only at the root; `isShowRefresh={false}`.
  - `TitleArea` subtitle.
  - The "simple search" button (`SearchIcon`): shown only when `chatbotFlag` is set **and** the first master-config load has finished (`hasSyncedInitialChatbotFlag`).
  - A two-column `FlatList` grid of `ButtonBig` (icon and label) built from `global.masterConfig.large_categories` (chunked by 2). Pull-to-refresh.
  - `TabBarBottom isStoreList={isChainStore()} isHome={isChainStore()}`.
- **Data and API calls:**
  - On focus: `onReloadData('all')` runs:
    - `getMasterConfig({reloadTarget, chainSystem: user.manager?.system ?? user.chain?.system, storeId})` → POST `/api/mobile/auth/config`.
    - If `chatbotFlag`: `troubleAction.getLargeCategoryMapped({chain_system_id, errorCallback})` → `GET_LARGE_CATEGORY_MAPPED_REQUEST` → `troubleSaga.getLargeCategoryMapped` → `TroubleRepository.GetLargeCategoryMapped` → **GET `{Config.TROUBLE_API_URL}/qa_data/get_large_category_mapped?chain_system_id=…`**. This goes to the trouble backend, not `/api/mobile`. The result goes to `troubleGetLargeCategoryMappedReducer`.
      - On error the saga shows an alert whose OK action retries.
      - On mount, on AppState returning to active, and when `chatbotFlag` turns on, the screen calls `getLargeCategoryMappedUntilSuccess`, which retries on every error.
    - The `latestNews` refetch and `getBadgeSideBar`.
  - Loading: `masterConfigReducer.loading || troubleGetLargeCategoryMappedReducer.loading` drives `LoadingSlice.showMainLoading` / `hideMainLoading` (RTK).
  - On mount: the same pending-push handling as ManageBox (`Common.navigateFromNotification`). At the root it also fetches the FCM token.
- **Category tap logic (`itemClick`):** ignored while loading.
  1. If `!chatbotFlag`: sets `global.majorCatSelected = item` and navigates to `MediumCategory` `{headerTitle}`.
  2. If `chatbotFlag` and the category maps to a trouble large category (`large_category[].qnavi_id == item.id`): navigates to `WebView` `{uri: ApiList.TROUBLE_WEB_VIEW_URL, offBack: true, troubleCategoryId, mode: 'select'}`.
  3. Otherwise it calls `CategoryRepository.validateCategories({chain_store_id: global.storeId, large_category_id})` → **POST `/api/mobile/troubles/validate-categories`**. On 200 it goes to `MediumCategory`. On a non-200 it shows an alert and throws, and the catch calls `onReloadData()`.
- **Simple search button:** navigates to `WebView` `{uri: TROUBLE_WEB_VIEW_URL, offBack: true, troubleCategoryId: undefined, mode: 'search'}`.
- **Gating:** `isStoreAdmin` (title), `isChainStore` (tab bar), and `chatbotFlag` from master config (WebView path and search button).
- **Modals:** none local.
- **Navigation:** `MediumCategory` `{headerTitle}`, or `WebView` `{uri, offBack, troubleCategoryId, mode}`.

### MediumCategory (`MediumCategoryScreen`)
- **File:** `screens/MediumCategory/MediumCategoryScreen.js`, a class component connected with empty maps. SC0011.
- **Purpose:** pick the medium category under `global.majorCatSelected`.
- **Params:** `headerTitle`.
- **UI:**
  - `Header` (back) with title `headerTitle`, then `TitleArea`.
  - `Breadcrumb`: [major label | empty | empty].
  - `FlatList` of `TitleItem` (label and icon) built from `global.masterConfig.medium_categories` where `large_category === majorCatSelected._id`.
  - "Cancel request" `ButtonCancel`.
  - `TabBarBottom` with no props.
- **API calls:** none (master config only).
- **Modals:** `ModalConfirmMessage` with the `cancelRequest` message. "Yes" calls `navigateToHome()`.
- **Navigation:** item tap sets `global.mediumCatSelected` and navigates to `MinorCategory` `{headerTitle}`. Cancel goes to `navigateToHome()` (MajorCategory or ManageBox).
- **Gating:** none.

### MinorCategory (`MinorCategoryScreen`)
- **File:** `screens/MinorCategory/MinorCategoryScreen.js`, a redux-connected class component. SC0012.
- **Purpose:** pick the small category. It then optionally walks the user through pre-check Q&A before the request form.
- **Params:** `headerTitle`.
- **UI:**
  - `Header` (back), `TitleArea`.
  - `Breadcrumb`: [major | medium | empty].
  - `FlatList` built from `masterConfig.small_categories` where `medium_category === mediumCatSelected._id`.
  - "Cancel request" button.
  - `ModalQuestion` (a sequential "Q n/total" card: Next, and close on the last question) and the cancel `ModalConfirmMessage`.
  - `TabBarBottom`.
- **Data and API calls:**
  - On mount, if there are small categories: `categoryAction.getCategoryQA({smallCategoryId: [ids], storeId})` → `CATEGORY_QA_REQUEST` → `categorySaga.fetchCategoryQA` → `CategoryRepository.GetCategoryQA` → **POST `/api/mobile/category/questions`** `{small_category_id: [...], store_id}`. The result goes to `categoryQAReducer`.
  - If there are no small categories, it dispatches an error alert (`sMinorCategory.errorNoData`).
- **Tap logic:** sets `global.minorCatSelected`, then filters the questions with `small_category_id === item._id`.
  - If there are any, it opens `ModalQuestion`. Finishing the last question calls `gotoFailureContentScreen()`.
  - Otherwise it calls `gotoFailureContentScreen()` directly.
- **`gotoFailureContentScreen` (gating):**
  - If `isIndividualStore() || global.assetFlag === 0`: navigates to `FailureContent` `{headerTitle}`.
  - Otherwise: navigates to `AssetSelection` `{headerTitle}`.
- **Modals:** `ModalQuestion`, and `ModalConfirmMessage` (cancel, which calls `navigateToHome()`).
- **Navigation:** `FailureContent` `{headerTitle}`, `AssetSelection` `{headerTitle}`, or home.

### AssetSelection (`AssetSelectionScreen`)
- **File:** `screens/AssetSelection/AssetSelectionScreen.tsx`, a function component. It has no SC id. Reached only when the store is not individual and `assetFlag !== 0`.
- **Purpose:** multi-select the store's registered assets (equipment) related to the request, or jump to registering a new asset.
- **Params:** `headerTitle` (in practice the store name).
- **UI:**
  - `Header` (back). `onBackPress` explicitly navigates to `MinorCategory` `{headerTitle}`.
  - `TitleArea`.
  - Breadcrumb: [major | medium | minor].
  - A hard-coded JP instruction text.
  - An "新しく機器を登録する" (register new equipment) link with `AddIcon`.
  - An infinite `FlatList` of rows with a `CheckboxOn`/`CheckboxOff` toggle and a `TitleItem`.
    - The row name is the item with `isCommon === ASSET_IS_COMMON && commonId === ASSET_COMMON_ID.NAME`.
    - The row image is the first file of the common item whose field type is IMAGE.
    - Load-more only fires after the user has dragged. Pull-to-refresh resets the query.
  - Bottom: the "詳細情報入力へ" (go to detail input) `Button` and "Cancel request".
  - `TabBarBottom`.
- **Data and API calls:**
  - react-query `useAssetsByChainStore(global.storeId)`: key `['useAssetsByChainStore','infinite', storeId]`, `gcTime: 0`. It calls `AssetRepository.getAssetsByChainStore` → **GET `/api/mobile/asset/chain-store/{storeId}?page=N`**.
  - Pagination: from `results.meta.pagination` or `results.pagination`, falling back to a page size of 20.
  - No redux-saga.
- **Key actions:** the checkbox toggles the id in local `assetCatSelected`. The Next button works even with **zero** selections; FailureContent then sends `isAsset=0`.
- **Modals:** `ModalConfirmMessage` (cancel, which calls `RootNavigation.navigateToHome()`).
- **Navigation:**
  - `AssetCreateScreen` `{storeName: headerTitle}`.
  - `FailureContent` `{headerTitle, assetCatSelected: number[]}`.
  - Back goes to `MinorCategory` `{headerTitle}`.
  - Cancel goes home.
- **Gating:** entry gated in MinorCategory (`!isIndividualStore() && assetFlag !== 0`).

### AssetCreateScreen (`AssetCreateScreen`)
- **File:** `screens/AssetSelection/AssetCreateScreen.tsx`, a function component built on react-hook-form with a yup resolver (`validations/assetSchema.ts`).
- **Purpose:** register a new asset for the current chain store, then return to AssetSelection.
- **Params:** `storeName`, used in the `TitleArea` "{storeName}の資産登録" (asset registration for {storeName}).
- **UI:**
  - `Header` (back) titled `sAssetSelection.list`.
  - A `KeyboardAwareScrollView` card "資産登録" (asset registration) with these fields:

| Field | Input | Validation |
|---|---|---|
| `assetImages` | `ImagePicker`, max 2 | none |
| `assetName` 名称 | text | **required**, trimmed, max `INPUT_MAX_LENGTH` |
| `manufacturerName` メーカー名 | `CustomAutocompleteDropdown` with suggestions | max length |
| `model` 型式 | text | max length; half-width alphanumeric/symbols, no spaces |
| `serialNumber` 製造番号 | text | same as `model` |
| `installationDeliveryDate` 設置・納入日 | `CalendarModal` (`dateOnly`, `minDate` = today) | valid `DATE_LONG` |
| `manufacturingYearMonth` 製造年月 | `CalendarMonthYearModal` | valid `YEAR_MONTH` |
| `additionalInformation` 補足説明 | multiline text | none |

  - Submit button "入力情報を保存する" (save the entered information). On invalid input it scrolls to the top.
- **Data and API calls (react-query plus direct repository calls):**
  - `useManufacturerSuggestions(debouncedKeyword)` (500 ms, leading): key `['manufacturerSuggestions', kw]`, calls **GET `/api/mobile/asset/suggestion-manufacturer?keyword=…`**.
  - On submit:
    1. `uploadAssetImages(files)` calls **POST `/api/mobile/asset/generate_presigned_url`** `{filenames}`. It then makes a **PUT to each S3 presigned URL** (`MessageRepository.apiUploadFileS3`, using `fetch`). It throws if the presigned count does not match the file count.
    2. `useCreateAsset` mutation calls **POST `/api/mobile/asset`** `{chainStoreId: global.storeId, assetImages: [{path, name, type}], assetName, manufacturerName, model, serialNumber, installationDeliveryDate (the "(曜)" day suffix is stripped), manufacturingYearMonth, additionalInformation}`.
    3. On success: `queryClient.resetQueries(['useAssetsByChainStore'])`, then `store.dispatch(getMasterConfig({}, navigateGoBack))`. That is POST `/api/mobile/auth/config` **without `chainSystem`**; the saga calls the callback, which navigates back.
  - `isSubmitting` toggles `LoadingSlice.showMainLoading` / `hideMainLoading`.
  - On error the screen only logs to the console. There is no user-facing message beyond the global API error handling.
- **Modals:** `CalendarModal` and `CalendarMonthYearModal`.
- **Navigation:** `navigateGoBack()` after success, which returns to AssetSelection.
- **Gating:** none in-screen.

### FailureContent (`FailureContentScreen`)
- **File:** `screens/Failure/FailureContentScreen.tsx`, a redux-connected TS class component. SC0014, the trouble-request creation form.
- **Purpose:** enter photos, description, visit date/time or urgency, and the store staff in charge, then create the trouble request.
- **Params:** `headerTitle`, and `assetCatSelected?: number[]` (from AssetSelection). The categories come from `global.majorCatSelected`, `mediumCatSelected` and `minorCatSelected`.
- **UI:**
  - `Header` (back), `TitleArea` "work content".
  - Breadcrumb: [major | medium | minor].
  - When `global.JTVT10 == false`: an "add photo" caption and `ImagePicker` (limit 20).
  - Description `InputTextArea` (4 lines).
  - `SelectDate`, which has two tabs:
    - Tab 0 is urgent "now": it calls `onEmergency(true)` and sets date option `'00'`.
    - Tab 1 opens `DateOptionModal`, or `AutoMatchingDateOptionModal` when `global.storeAutomatchingFlag` is set. Option enums: `01` date+time, `02` date, `03` period, `04`, `05`, `06`, `07` specify time, `08`, `09`.
  - `StaffSelect`: a modal with radio buttons listing the store staff.
  - Submit `Button` and Cancel `ButtonOutline`.
  - `TabBarBottom`.
- **Validation (`onShowModalConfirm`)**, using `requestAlertErrorAction` as the message channel:
  1. The description is required.
  2. The date must not be in the past and is required unless urgent, `04` or `07`. The expression's operator precedence is convoluted; treat the exact rules as uncertain.
  3. The staff is required.
  4. For a period (`03`), `dateTo` and `end` are required.
  - If all pass, the confirm modal opens.
- **Submit (`onSubmit`):** builds `{description, images, is_emergency, staff_*, category ids (_id), date, start, end, dateTo, dateOption, idempotencyKey: global.idempotencyKey}`.
  - Urgent requests send date `9999/12/31` and times `00:00`–`23:59`.
  - It adds `isAsset: 1, assetIds` if there are selected assets, else `isAsset: 0`.
  - Dispatch chain: `failureAction.createTrouble` → `CREATE_TROUBLE_REQUEST` → `failureSaga.createTrouble` → `FailureRepository.StoreCreateTrouble` → **POST `/api/mobile/troubles/create`** (multipart `FormData`) with the **`Idempotency-Key` header**.
  - Form fields: `storeId, expectedDate, expectedStart, toExpectedDate?, toExpectedEnd|expectedEnd, description, isEmergency (1/0), staffId, largeCategoryId, mediumCategoryId, smallCategoryId, isLock=0, dateOption, isAsset, assetIds[]…, troubleImages[]…`.
  - On success: `CREATE_TROUBLE_RESPONSE` (`failureReducer.createTroubleStatus='ok'`, and the reducer regenerates `global.idempotencyKey`). The saga then does `StackActions.replace('WorkInprogress', {headerTitle: results.name, troubleId: results._id})`.
  - On failure: `CREATE_TROUBLE_FAILED` plus an alert. The 409-conflict branch is commented out.
- **Staff list (react-query):** `StaffSelect` calls `useInfiniteStaffs` (key `['staffs', storeId]`) → `FailureRepository.getStaffByStore` → **POST `/api/mobile/stores/staffs`** (x-www-form-urlencoded) `{storeId, page, numberItem: 20}`.
- **Leave guard:** a `beforeRemove` listener blocks leaving when the form differs from its initial snapshot (`compareObject` over `formValueKeys`), creation is not `'ok'`, and the cancel modal is not open. It then shows the "leave?" confirm, and "Yes" re-dispatches the blocked action. On unmount it dispatches `resetTroubleState` (`RESET_TROUBLE_STATE`).
  - Caveat: two of the snapshot keys (`is_emergency`, `date`) are not state keys, so those comparisons are moot.
- **Modals:**
  - Cancel `ModalConfirmMessage`: `navigateToHome()`.
  - Submit confirm `ModalConfirmMessage` (`sFailureContent.confirmModal`): `onSubmit`.
  - Leave confirm (`sRegister.message.back`).
  - Inside `SelectDate`: `DateOptionModal` or `AutoMatchingDateOptionModal`, plus `ModalOkMessage`.
- **Gating:** the photo section depends on `global.JTVT10`. The date modal variant depends on `global.storeAutomatchingFlag`. `getBadgeSideBar` is mapped but never called.
- **Navigation:** success replaces the route with `WorkInprogress` `{headerTitle, troubleId}`. Cancel goes home.

---

## Trouble / request lists

### RequestList (`RequestListScreen`)
- **File:** `screens/Request/RequestListScreen.tsx`, a function component. SC0016.
- **Who sees it:** the progress list for users who are **not** `isStoreAdmin` or `isIndividualStore` (in practice chain-store `storeGenba`), via the Progress tab. It is also reached from other screens with a store id (for example StoreList; uncertain, outside this part).
- **Params:** `id` (storeId) and `name` (storeName).
- **UI:**
  - `MenuProvider` wrapper.
  - `Header`:
    - Title: `storeName`, or the `sChatList.title` fallback.
    - Back: `onBackPress` calls `navigateToHome()`.
    - `isShowTopHeader`; `isShowDrawer={isChainStore()}`; the refresh icon calls `handleReload`.
  - `TitleArea` caption.
  - `FilterListTrouble` popup sort menu: updated time (null), `SORT_BY_ID_DESC`, `URGENT_FLAG`.
  - Infinite `FlatList` of `TroubleRunningItem`. When `global.summaryTrouble` is set and `summary_list.length > 1`, the item shows an accordion.
  - "Add work request" button.
  - `ModalSelectTrouble`.
  - `TabBarBottom`, with `isTrouble` set when the user is not storeAdmin or individual.
- **Data and API calls:**
  - react-query `useTroubleRunningList({storeId, sortBy})`: key `['troubleRunningList', storeId, sortBy]`, calls `TroubleRepository.GetTroubleRunning` → **POST `/api/mobile/troubles/running`** `{page, storeId, sortBy?}`. The next page loads only when a page returns exactly 20 rows.
  - First load without cache dispatches `showMainLoading`.
  - When the list is empty it dispatches an alert (`sRequestList.modal.empty`).
  - On focus it refetches `['latestNews']`.
  - Reload (pull, header icon or tab) runs `refetch()`, the `latestNews` refetch, and `store.dispatch(getMasterConfig())`, which posts to `/api/mobile/auth/config` with no `chainSystem`.
  - Item routing (`goToTroubleDetail`) may call `CandidacyRepository.GetCandidacyList({troubleId})` → **POST `/api/mobile/candidacies/list`** directly, not through a saga.
- **Item routing (`goToTroubleDetail`):**

| Condition | Navigation |
|---|---|
| `status === 3` | `TroubleDetail` `{troubleId}` |
| `is_continuation` | `WorkContinueInprogress` `{headerTitle: name, troubleId}` |
| `status === 1`, candidacies > 0 and `trouble.automatching_flag !== 1` | `StackActions.push('WorkerSelection', {headerTitle, screenType: 'RequestList', troubleId, waitingImgUrl, refreshListTrouble: handleReload})` |
| `status === 1`, otherwise | `WorkInprogress` `{headerTitle, troubleId}` |
| any other status | `WorkInprogress` `{headerTitle, troubleId}` |

  - If `global.summaryTrouble` is set and the item has more than one `summary_list` entry, `ModalSelectTrouble` opens first (`isCheckShowBadge` shows `is_show_badge_store`). Picking an entry runs the same routing on it.
- **Add work request:** sets `global.storeId = id` and `global.storeName = name`, then navigates to `MajorCategory` with no params, so it is not root and shows a back button.
- **Gating:** `isChainStore` (drawer), `isStoreAdmin` / `isIndividualStore` (tab state), `global.summaryTrouble`. Note: `WorkerSelection` is where `is_allow_select_worker` applies; it is not checked here.
- **Modals:** `ModalSelectTrouble`, plus the global alert for an empty list.

### TroubleList (`TroubleListScreen`)
- **File:** `screens/Trouble/TroubleListScreen.js`, a function component. SC0009, the "working list" / news list.
- **Who sees it:** `isStoreAdmin` or `isIndividualStore` users via the Progress tab, and anyone via the ManageBox "working list" card.
- **Params:** `id` and `name` are passed by the tab bar but **not read**. The screen uses `global.storeId`.
- **UI:**
  - `MenuProvider`.
  - `Header`:
    - Title: `sTroubleList.title`.
    - Back: `onBackPress` resets to `MajorCategory` if `isChainStore()`, else to `ManageBox`.
    - `isShowTopHeader`, `isShowDrawer`; the refresh icon calls `handleReload`.
  - `InputSearch`: free-text, and the search is applied on submit.
  - `FilterListTrouble` sort.
  - Infinite `FlatList` of `RequestItem`, with a "no data" empty state.
  - `ModalSelectTrouble`.
  - `TabBarBottom`, with `isTrouble` set when the user is storeAdmin or individual.
- **Data and API calls:**
  - react-query `useTroubleList({storeId: global.storeId, search: keyword, sortBy})`: key `['troubleList', storeId, search, sortBy]`, calls `TroubleRepository.GetTroubleList` → **POST `/api/mobile/troubles/news`** `{page, search, sortBy?}`. Note: `storeId` is in the query key but **not sent** in the body. The next page loads when a page returns 20 or more rows.
  - First load dispatches `showMainLoading`.
  - On focus it refetches `['latestNews']`.
  - Reload clears the search and keyword, then runs `refetch()`, the `latestNews` refetch and `getMasterConfig()` (POST `/api/mobile/auth/config`).
  - Item routing may call POST `/api/mobile/candidacies/list` directly, as in RequestList.
- **Item routing:** identical to RequestList, except the WorkerSelection push uses `screenType: 'TroubleList'` and sends **no** `refreshListTrouble`. The summary modal closes before routing.
- **Gating:** `isChainStore` (back target), `isStoreAdmin` / `isIndividualStore` (tab state), `global.summaryTrouble`.
- **Modals:** `ModalSelectTrouble`.
- **Navigation:** `TroubleDetail` `{troubleId}`, `WorkContinueInprogress` `{headerTitle, troubleId}`, the `WorkerSelection` push `{headerTitle, screenType: 'TroubleList', troubleId, waitingImgUrl}`, or `WorkInprogress` `{headerTitle, troubleId}`. Back resets to `MajorCategory` or `ManageBox`.

---

## Endpoint index (this part)

| Endpoint | Method | Caller |
|---|---|---|
| `/api/mobile/troubles/home` | POST | ManageBox (saga `appSaga.getHomeInfo`) |
| `/api/mobile/auth/config` (from `MASTER_API_V2`, remapped by `ApiListNewMapper`) | POST | ManageBox, MajorCategory, RequestList, TroubleList, AssetCreate (saga `commonSaga.fetchMasterConfig`) |
| `/api/mobile/stores/get_side_bar` | GET | Header hamburger, ManageBox, MajorCategory (saga `commonSaga.fetchBadgeSideBar`), TabBarBottom Progress tab |
| `/api/mobile/notifications/store_newest` | GET | Header (`useLatestNews`, `['latestNews']`) |
| `/api/mobile/notifications/hide_notice/{id}` | GET | NotificationDropdown (`useHideNotice`) |
| `{TROUBLE_API_URL}/qa_data/get_large_category_mapped?chain_system_id=` | GET | MajorCategory (saga `troubleSaga.getLargeCategoryMapped`) |
| `/api/mobile/troubles/validate-categories` | POST | MajorCategory (direct repository call) |
| `/api/mobile/category/questions` | POST | MinorCategory (saga `categorySaga.fetchCategoryQA`) |
| `/api/mobile/asset/chain-store/{id}?page=` | GET | AssetSelection (`useAssetsByChainStore`) |
| `/api/mobile/asset/suggestion-manufacturer?keyword=` | GET | AssetCreate (`useManufacturerSuggestions`) |
| `/api/mobile/asset/generate_presigned_url`, then S3 presigned URL | POST, then PUT | AssetCreate (`uploadAssetImages`) |
| `/api/mobile/asset` | POST | AssetCreate (`useCreateAsset`) |
| `/api/mobile/stores/staffs` | POST, form-urlencoded | FailureContent `StaffSelect` (`useInfiniteStaffs`) |
| `/api/mobile/troubles/create` | POST, multipart + `Idempotency-Key` | FailureContent (saga `failureSaga.createTrouble`) |
| `/api/mobile/troubles/running` | POST | RequestList (`useTroubleRunningList`) |
| `/api/mobile/troubles/news` | POST | TroubleList (`useTroubleList`) |
| `/api/mobile/candidacies/list` | POST | RequestList and TroubleList item routing (direct repository call) |


# QnaviShop screens: Trouble detail / Worker selection / Approval / History

Base path for files: `qnavi-shop-app/QnaviShop/app/`. Endpoints are `Config.API_URL + '/api/mobile/' + <path>` (constant names from `api/ApiList.js`). The HTTP method comes from `ApiInstance.apiModule.post|get` (axios wrapper in `api/ApiModule.ts`).

Reference enums:
- `TroubleStatusEnum` (`interfaces/Trouble.ts`, D0002): `inquiring=1`, `working=2`, `done=3`.
- `TroubleDoneStatusEnum` (D0003): `creditCardPayment=1`, `invoiceSettlement=2`, `freeCancellation=3`, `paidCancellationK=4`, `paidCancellationR=5`, `workerCancellation=6`, `forceCancellation=7`.
- `ReportStatusEnum` (`interfaces/Report.ts`): `HIDDEN='01'`, `DISPLAY='02'`.
- `TroubleApprovalStatus` (`constants/Enum.ts`): `WAITING='01'`, `PENDING_APPROVAL='02'`, `APPROVED='03'`.

Shared saga plumbing used below:
- `TROUBLE_DETAIL_REQUEST` -> `troubleSaga.fetchTroubleDetail` -> `TroubleRepository.GetTroubleDetail({troubleId: id})` -> **POST `troubles/detail`** (`TROUBLE_DETAIL`). Side effect: if `results.is_summary_trouble` is a boolean, it sets `global.summaryTrouble`. On success it calls `params.successCallback(response)`. On failure it dispatches `TROUBLE_DETAIL_FAILED` and `alertAction.requestAlertErrorAction`. Reducer: `troubleDetailReducer`.
- `PERMISSION_REQUEST` -> `commonSaga.getPermission` -> `CommonRepository.GetPermission` -> **GET `stores/permission`** (`PERMISSION`). It writes to `permissionsReducer` and to `global.permissions = {isAllowSelectWorker, isAllowApproveEstimate, isAllowPayment}`.

---

## Trouble detail (completed / cancelled troubles)

### TroubleDetail (`TroubleDetailScreen`), SC0029
- **File**: `screens/TroubleDetail/TroubleDetailScreen.tsx`. This is a class component that extends `BaseMainScreen` and is connected via redux `connect`. The stack options are `headerShown:false` and title `sTroubleDetail.title`.
- **Purpose**: read-only detail of a trouble (work request) that is **done** (`status=3`). It covers completed-and-paid troubles and cancelled troubles. Status-dependent buttons link to the work report, the work statement or estimate, and the cancel fee. It also embeds the Firebase chat bottom sheet.
- **Params (`route.params`)**:
  - `troubleId: number` (required).
  - `fromHistory?: boolean`. HistoryList sets it to `true`. It changes the estimate webview query: `payment=true` is omitted when coming from history. It is also forwarded to EstimationList.
- **Inbound from**:
  - HistoryList, with `{troubleId, fromHistory:true}`.
  - TroubleList, when `item.status===3`.
  - RequestList.
  - ChatList (`navigatePush`).
  - TaskManager Tasks.
  - EstimationDetail.
  - WorkContinueInprogress.
  - WorkInprogressDetail (`push`).
  - WorkCancelFee (prev/next links).
  - Itself (prev/next push).
- **Data loading**:
  - In the constructor and on every `focus` event: `getTroubleDetail({id, successCallback: fetchSummaryTroubleEstimation})`.
  - Pull-to-refresh calls `onRefresh(id)`, which makes the same call.
  - `fetchSummaryTroubleEstimation` runs only when `global.summaryTrouble` is truthy. It dispatches `troubleAction.postSummaryTroubleEstimation({troubleId})`, which goes `SUMMARY_TROUBLE_ESTIMATION_REQUEST` -> `troubleSaga.fetchSummaryTroubleEstimation` -> `PostSummaryTroubleEstimation` -> **POST `troubles/summary-trouble-estimate`** (`SUMMARY_TROUBLE_ESTIMATE`). Reducer: `summaryTroubleEstimationReducer`. `results.data` is the summary list that drives the estimate button and modal.
  - Prev/next trouble link: a direct call `ApiInstance.apiModule.post(ApiList.TROUBLE_DETAIL, {troubleId})`, outside saga, which is **POST `troubles/detail`**. It chooses the target route from the returned status.
  - `getSummaryChat` (`SUMMARY_CHAT_REQUEST` -> POST `troubles/summary-chats-trouble-detail`) is mapped in `mapDispatchToProps` and `summaryChatReducer` is read for `loading`, but **it is never dispatched** in this screen (dead or legacy code). `userReadMessage` is declared in props but not mapped or used.
- **Statuses handled** (`done_status`; the screen assumes `status=3`, done):
  - Header subtitle (`TitleArea`):
    - 1 and 2 show "作業依頼詳細" (`workRequestDetail`).
    - 3, 4, 5 and 7 show "作業依頼キャンセル詳細" (`workRequestCancellation`).
    - 6 (`workerCancellation`) and 0 show an empty string.
    - **Note**: `headerTitle` in the constructor state is computed before the trouble loads, so it is effectively empty. The `TitleArea` re-evaluates it on render.
  - Accordion mode: `isShowAccordion = global.summaryTrouble && summary_list.length > 1`, forced `false` when `done_status > 2` (all cancellations).
- **Main UI sections**, in order:
  1. `Header`: title = `trouble.name`, back icon.
  2. `TitleArea` with the subtitle above.
  3. Next-trouble link: only when not in accordion mode and `previous_trouble_id === null && next_trouble_id`. Label `sTroubleCommon.toNextTroubleLabel`, link `toNextTrouble`.
  4. Previous/continuation link: only when not in accordion mode and `previous_trouble_id` is set. Label `toPreviousTroubleLabel`, link `toPreviousTrouble`.
  5. Staff info box, `ButtonBoxWrapeer` -> `BoxWrapeer`:
     - Shows the request number, the `urgent_flag` suspension tag, the `resubmission_status` tag (pending/approved), the worker name, the worker phone, the request date and the working date/time.
     - The worker phone is blanked when `done_status === freeCancellation (3)`.
     - Tapping the worker name calls `openDetail`, which opens **ModalStaffInfo**.
     - Tapping the phone opens **ModalCallPhone** (inside `BoxWrapeer`), which calls `Linking.openURL('tel:...')`.
     - The "見積書一覧" (quotation list) button appears when `checkShowEstimateButton()` is true.
     - The right-hand "詳細" button (would go to `WorkInprogressDetail`) is **disabled** (`disableBtnDetail`).
  6. Category `Breadcrumb`: `large_label_ja` > `medium_label_ja` > `label_ja`.
  7. Info rows (`renderInfoRequest`):
     - 担当者 (`staff_name`): always shown.
     - 依頼者 (`chain_store.name ?? individual_store.name`): only for done_status 1 or 2.
     - キャンセル依頼者 (`canceller.name`) plus `ExpectedDate` (urgent `is_emergency`, `date_option`, `date`/`to_expected_date`, `start`/`end`): only when `done_status > 2 && !== 6`, that is 3, 4, 5 and 7.
  8. Images (`work_images`): 0 images show 2 placeholders, 1 image shows the image plus a placeholder, 2 or more show a grid. `ImageBorder` supports download. Tapping an image goes to `WebView {uri}`.
  9. Description: read-only `InputTextArea` with `trouble.description`.
  10. Accordion area (summary mode only):
      - One `ButtonAccordion` per `summary_list` item where `showAccordionItem` is true: item `status===3` and `done_status` is 1, 2, 4 or 5.
      - Titles: 新規 / 継続 / 継続N, from `getIndexFromTroubleNumber`.
      - Each item renders `BoxWrapeer` plus that item's buttons.
      - The current trouble's item opens by default.
  11. Bottom buttons (non-accordion mode), `renderButton(trouble)`:
      - **作業報告書を確認する** (check work report): `done_status ∈ {1,2}` **and** `report` exists **and** `report.status === '02'` (DISPLAY). Goes to `WorkReport {troubleDetail: trouble, troubleSelected: troubleDisplay}`.
      - **作業明細書を確認する** (check work statement): `done_status ∈ {1,2}`.
        - If `troubleDisplay.isNewEstimationFlow`, it goes to `PWA_Webview {uri}`. The uri is `trouble/{id}/estimate?mode=summary[&payment=true]` in accordion mode. Otherwise it is `trouble/{id}/estimate/{estimation.id}?review=true`.
        - Otherwise it goes to `WorkDetailPayment {troubleId, isDone:true}`.
      - **キャンセル料金を確認する** (check cancel fee): `done_status ∈ {4,5}`. Goes to `WorkCancelFee {troubleDetail}`.
  12. `FirebaseChatBottomSheet` (`features/chat/components/ChatBottomSheet.tsx`):
      - Props: `firebaseChatEnabled = trouble.firebase_chat_enabled ?? true`, `troubleId`.
      - `showChatModeSwitch` is set when the trouble or any `summary_list` item `has_legacy_chat`. It switches between Firebase and legacy chat.
      - Also receives `summary_list` (id and number), used for per-trouble chat tabs.
  13. `TabBarBottom`: shown on iOS, or on Android only while the keyboard is hidden.
- **Quotation-list button logic** (`checkShowEstimateButton`):
  - If `global.summaryTrouble`: shown when the summary-estimate list has more than 0 items.
  - Otherwise: shown when `done_status ∈ {1,2}`, or when `done_status ∈ {4,5,7}` **and** `trouble.estimation !== null`.
  - On press (`gotoEstimationListScreen`):
    - If summary mode with more than 0 items, opens **ModalSelectTrouble** (`isTroubleEstimate=true`; it shows a 承認済 tag when `(new_flow>=7 || continuation_flow>=4) && is_approve`). Selecting an item goes to `PWA_Webview {uri: trouble/{item.id}/estimate{?mode=summary&payment=true}}` if `item.is_new_estimation_flow`. Otherwise it goes to `EstimationList {troubleId: item.id, fromHistory}`.
    - Otherwise, with `trouble.isNewEstimationFlow`, it goes to `PWA_Webview {uri: trouble/{id}/estimate{query}}`.
    - Otherwise it goes to `EstimationList {troubleId, fromHistory}` (SC0021).
- **Prev/next navigation**: POST `troubles/detail` for the target id. If the target status is 3, it does `navigation.push(TroubleDetail, {troubleId})`. Otherwise it does `push(WorkInprogressDetail, {troubleId})`.
- **Modals**:
  - `ModalStaffInfo` (`components/Modal/StaffInfo`), which wraps `CardProfStaff`. It shows the image, name, work date/time, store/app/system counts (`total_trouble_store`, `total_trouble_all`, `total_trouble_system`), zipcode, address, phone and description.
  - `ModalCallPhone` (`components/Modal/CallPhone`). The screen also renders its own instance (`renderModalCall`), but `visibleModalCall` is **never set true**. The working call modal is the one inside `BoxWrapeer`.
  - `ModalSelectTrouble` (`components/Modal/Trouble`).
- **Permissions/role gating**:
  - No `permissionsReducer` check in this screen. Price visibility is gated downstream (WorkCancelFee, WorkDetailPayment and the PWA).
  - Behaviour forks on `global.summaryTrouble` (set by the trouble-detail saga) and on `trouble.isNewEstimationFlow` / `firebase_chat_enabled`.
- **Back behaviour**: `onBack()` refreshes to `troubleBackId` if one is set, otherwise goes to `HistoryList`. `troubleBackId` is never set to non-null in this file. **Uncertain** whether `Header` calls `onBack`: the `Header` is rendered without `onBackPress`, so the default back is likely `goBack`.

### WorkCancelFee (`WorkCancelFeeScreen`), SC0030
- **File**: `screens/TroubleDetail/cancel/WorkCancelFeeScreen.tsx`. Function component.
- **Purpose**: shows the cancellation-fee statement for a paid cancellation (done_status 4 or 5).
- **Params**: `troubleDetail: TroubleDetail`, the full object passed from TroubleDetail. No fetch of the trouble.
- **Main UI**:
  - `Header` (title `troubleDetail.name`).
  - `TitleArea` (`sWorkCancelFee.caption`).
  - Next/previous trouble links, with the same conditions as TroubleDetail (next when `!previous_trouble_id && next_trouble_id`).
  - Card `troubleCardReportBox`:
    - Card title.
    - 依頼No (`number`).
    - Store name, which shows `troubleDetail.name`.
    - Work content (`large_category.label_ja`), work place (`medium_category.label_ja`) and symptoms (`small_category.label_ja`).
    - Work list: a single line "1. {cancelFeeTitle}" with the amount `cancel_fee`.
    - Subtotal (`cancel_fee`), tax (`invoice_cancel_fee - cancel_fee`) and total (`invoice_cancel_fee`).
    - `GlobarInfo pdf` (`payment_detail_pdf`).
  - The asset code/name block is commented out.
  - `TabBarBottom`.
- **Actions/API**:
  - On mount it dispatches `{type: PERMISSION_REQUEST}`, which goes to the saga and **GET `stores/permission`**.
  - It *also* makes a direct `ApiInstance.apiModule.get(ApiList.PERMISSION)` call, again **GET `stores/permission`**, and stores `is_allow_approve_estimate` in local state.
  - Net effect: `stores/permission` is called twice.
  - It reads `workDetailPaymentSlice.loading` but does not use it.
- **Permissions**: `is_allow_approve_estimate`. When false, all amounts are hidden: the line amount, subtotal, tax and total, and the PDF link (`GlobarInfo` gets `''`).
- **Navigation**: previous/next link taps go to `TroubleDetail {troubleId: previous|next_trouble_id}` when the *current* `troubleDetail.status === 3`. Otherwise they go to `WorkInprogressDetail {troubleId}`. **Note**: the check uses the current trouble's status, not the target's.
- **Modals**: none.

---

## Worker (candidate) selection

### WorkerSelection (`WorkerSelectionScreen`), SC0017 (shared with SC0015)
- **File**: `screens/WorkerSelection/WorkerSelectionScreen.tsx`. Class component, redux `connect`.
- **Purpose**: for an inquiring trouble (`status=1`), lists the worker candidacies (applicants) so store staff can choose one. When there are no candidates, or auto-matching is on, it shows a "request submitted / waiting" message. It also lets staff cancel the request.
- **Params**:
  - `troubleId`.
  - `headerTitle`: the trouble name.
  - `screenType`: `RequestSumit` or `RequestList` or `TroubleList`. It changes the back target.
  - `waitingImgUrl`: the waiting illustration.
  - `goBackToPrevious?: boolean`.
  - `navigateWorkInprogress?: boolean`: comes from push notification `ps39` and shows an OK modal.
  - `refreshListTrouble?: function`: called after a cancel.
- **Inbound from**:
  - TroubleList and RequestList (`StackActions.push` when the trouble has candidacies and `automatching_flag !== 1`).
  - TaskManager Tasks (`navigatePush`).
  - Push notification handlers in `constants/Common.tsx`, which reset to `[home, WorkerSelection{troubleId}]`. For `ps39` they add `navigateWorkInprogress:true`.
- **Data loading**:
  - `componentDidMount` calls `onReloadData()`. This dispatches `getTroubleDetail({id: troubleId, successCallback})` -> `TROUBLE_DETAIL_REQUEST` -> **POST `troubles/detail`**.
  - If the response is `status === 2` (working), it does `StackActions.replace(WorkInprogress, {headerTitle, troubleId})`.
  - In `componentDidUpdate`, when the trouble-detail results change and the trouble is not `working`, it dispatches `candidacyAction.getCandidacyList({page, troubleId})`. This goes `CANDIDACY_LIST_REQUEST` -> `candidacySaga.fetchCandidacyList` -> `CandidacyRepository.GetCandidacyList` -> **POST `candidacies/list`** (`CANDIDACIES_LIST`) with body `{troubleId, page}`. Reducer: `candidacyListReducer`; `results.candidacies` and `results.trouble`.
  - Header refresh and pull-to-refresh both call `onReloadData()`.
- **Main UI**:
  - `Header`: title is `headerTitle` when there are no candidacies or `automatchingFlag`, otherwise `sWorkerSelection.title`. It has the back icon, `onBackPress` -> `backToRequestList`, and a refresh icon.
  - `TitleArea`: `sRequestSubmit.subtitle` when there are no candidates or auto-matching is on, otherwise `sWorkerSelection.subtitle`.
  - Category `Breadcrumb` (large > medium > small labels).
  - Body:
    - If `trouble.automatchingFlag`: two auto-match messages (`autoMessage`, `autoMessage2`).
    - Else, on a RequestSubmit screen with 0 candidates: the "request submitted" message plus the waiting image.
    - Otherwise: a `FlatList` of candidacies. A candidate whose date is today or earlier renders as `CandidacyToday` (flagged `today`), later dates as `CandidacyTomorrow`. Each shows the worker name, date and time, and the store/app/system work counts.
  - "依頼一覧に戻る" (`backToRequestList`) button: when auto-matching or no candidates.
  - `ButtonCancel` "依頼をキャンセルする": opens **ModalConfirmMessage**.
  - `ButtonChat`: goes to `WorkInprogressDetail {headerTitle, troubleId, scrollToChat:true}`.
  - `TabBarBottom`.
  - The whole body hides while `mainLoading.loading`.
- **Key actions**:
  - Tapping a candidate goes to `WorkerDetail {headerTitle, candidacyId: item._id, troubleId, trouble}`.
  - Cancel confirm runs `cancelTrouble({storeId: global.storeId, troubleId, successCallback})` -> `TROUBLE_CANCEL_REQUEST` -> `troubleSaga.fetchCancelTrouble` -> `CancelTrouble` -> **POST `troubles/s_cancel`** (`CANCEL_TROUBLE_API`) with body `{troubleId, storeId}`. On success it calls `backToRequestList()` and then `route.params.refreshListTrouble?.()`.
- **Back/after-cancel navigation (`backToRequestList`)**:
  - `goBackToPrevious` -> `navigateGoBack()`.
  - `screenType === RequestSumit` -> `navigateAndResetStack(RequestList, {id: global.storeId, name: global.user.name}, [home])`. Home is `MajorCategory {isRootStack:true}` when `global.isChainStore()`, else `ManageBox`.
  - `screenType === RequestList`:
    - If `global.isStoreAdmin() || global.isIndividualStore()` -> `TroubleList`.
    - Else -> `navigateGoBack()`.
  - Otherwise -> `TroubleList`.
- **Modals**:
  - **ModalConfirmMessage** (`components/Modal/ConfirmMessage`): message `sWorkerSelection.cancel` with `{string: request}`. Yes runs `cancelRequest`.
  - **BaseModalOk** (when `navigateWorkInprogress`): title `sWorkerSelection.showWorkContinueInprogress`, button "confirm". It does `replace(WorkInprogress)`.
- **Permissions/roles**:
  - No `permissionsReducer` gating here. Selection gating happens on WorkerDetail.
  - The cancel button is shown to all roles.
  - Role checks only affect back navigation: `global.isChainStore()`, `isStoreAdmin()` and `isIndividualStore()`.
- **Quirk**: in `getDerivedStateFromProps` the switch falls through from `CANDIDACY_LIST_RESPONSE` into the `TROUBLE_DETAIL_RESPONSE` case. A code comment notes that this caused bugs.

### WorkerDetail (`WorkerDetailScreen`), SC0018
- **File**: `screens/WorkerDetail/WorkerDetailScreen.tsx`. Class component, redux `connect`.
- **Purpose**: profile of one candidate worker, with a button to assign that worker to the trouble.
- **Params**:
  - `headerTitle`.
  - `candidacyId`.
  - `troubleId`.
  - `trouble`: the object used for the breadcrumb, via `large_category`, `medium_category` and `small_category` through `Common.getLabelCategoryByLanguage`.
- **Data loading** (constructor):
  - `getCandidacyDetail({candidacyId})` -> `CANDIDACY_DETAIL_REQUEST` -> `candidacySaga.fetchCandidacyDetail` -> `GetCandidacyDetail` -> **POST `candidacies/detail`** (`CANDIDACY_DETAIL`) with body `{candidacyId}`. Reducer: `candidacyDetailReducer`.
  - `commonAction.getPermission()` -> `PERMISSION_REQUEST` -> **GET `stores/permission`**.
  - Header refresh reloads the candidacy detail.
- **Main UI**:
  - `Header` (`sWorkerDetail.title`, with refresh).
  - `TitleArea` (`sWorkerDetail.subtitle`).
  - Category breadcrumb.
  - `CardProfStaff`: worker image, name, date and time window, store/app/system counts, zipcode, `address1`, phone and description.
  - Button "この作業スタッフに決定" (decide on this worker).
  - `TabBarBottom`.
- **Permissions**: the decide button renders only when `permissionsReducer.is_allow_select_worker` is truthy.
- **Key action**:
  - Decide opens **ModalStaffRequest** (`components/Modal/Staff/ModalStaffRequest`, wrapping `BaseModalConfirm`). It shows title `sWorkerDetail.dialog.title`, content with `{WorkerName}` and the time. The buttons are Cancel / OK.
  - OK runs `postCandidacySelect({troubleId, candidacyId, successCallback})` -> `CANDIDACY_SELECT_REQUEST` -> `candidacySaga.fetchCandidacySelect` -> `PostCandidacySelect` -> **POST `candidacies/select`** (`CANDIDACY_SELECT`) with body `{troubleId, candidacyId}`.
- **Navigation on success**: `CommonActions.reset` with `index:1` and these routes:
  1. `MajorCategory` if `global.isChainStore()`, else `ManageBox`, with `{isRootStack:true}`.
  2. `RequestList` if chain store, else `TroubleList`, with `{id: global.storeId, name: global.user.chain?.name}`.
  3. `WorkInprogress {headerTitle, troubleId}`.
  - **Note**: three routes with `index:1` means the focused route would be the second one (RequestList or TroubleList), not WorkInprogress. This looks like a probable bug or quirk (**uncertain**; it should be verified at runtime).
- **Errors**: saga failure dispatches `requestAlertErrorAction` (global alert).

---

## Estimate approval progress

### ListApprovalScreen (`ListApprovalScreen`), no SC code
- **File**: `screens/Work/ListApprovalScreen.tsx`. Function component. Registered without options (default header config; the screen renders its own `Header`).
- **Purpose**: shows the estimate ringi (稟議) approval progress for a trouble. It lists the approval steps or groups with their status, and tapping a step shows its approvers (決裁者一覧) with an approved (承認済) tag.
- **Params**: `troubleId: number`, read via `useRoute()`.
- **Inbound from**:
  - `PWA_Webview` (a web message carrying `data.troubleId`).
  - `EstimationDetailScreen`.
  - `WorkInprogressScreen`.
  - `WorkContinueInprogressScreen`.
- **Data**:
  - Loads on focus (`useIsFocused`) and clears the list on blur. Header refresh reloads.
  - It calls `TroubleRepository.getListApprove(troubleId)` directly (no saga or react-query), which is **GET `troubles/{id}/list-approvers`** (`LIST_APPROVE` via `replaceUrl`).
  - It wraps the call in `showMainLoading` / `hideMainLoading` (RTK `LoadingSlice`).
  - Response: `results.data[]` with items `{id, name, status, approverList[{username, isApproved}]}`.
- **Main UI**:
  - `Header` titled "見積稟議進捗", with refresh.
  - `FlatList` rows: name and a status text via `formatApprovalStatus` (`sListApproval.status.waiting / pendingApproval / approved`) plus a chevron. Rows with status `'02'` (PENDING_APPROVAL) render in bold.
  - Empty state "データがありません" (no data).
  - `react-native-modal`: title "決裁者一覧", a scrollable approver list with a 承認済 badge when `isApproved`, an empty-state text, and a "閉じる" (close) button.
- **Permissions**: none in the screen. The backend decides what is visible.
- **Navigation**: none (back only).
- **Modals**: an inline `react-native-modal`, not a shared component. **Note**: `components/Modal/Approval/ModalApprovalPending.tsx` exists but is **not used** by this screen.

---

## History

### HistoryList (`HistoryListScreen`), SC0028
- **File**: `screens/History/HistoryListScreen.tsx`. Function component.
- **Purpose**: searchable, infinitely-scrolling list of past (completed or cancelled) troubles for the store.
- **Params**: none.
- **Inbound from**:
  - DrawerMenu (`layout/DrawerMenu.js:189`).
  - ManageBox.
  - TroubleDetail `onBack`.
  - The `PWA_Webview` reset.
  - The `WorkDetailPayment` reset after payment.
- **Data**:
  - react-query `useHistoryList({search: keyword})` (`hook/query/useHistoryTroubleQuery.ts`) is a `useInfiniteQuery` with key `['useHistoryList', search]`.
  - It calls `HistoryRepository.GetHistoryList({page, search})`, which is **POST `troubles/s_histories`** (`HISTORY_LIST`) with body `{page, storeId: undefined, search, numberItem: 20}`.
  - Pagination: the next page is `results.pagination.currentPage + 1` while it is below `totalPage`. Items come from `results.data`.
  - On first load without cache it dispatches `showMainLoading()`.
- **Main UI**:
  - `Header` (`sHistoryList.title`).
  - `InputSearch` (hint `sHistoryList.inputSearchHint`). Typing sets `searchText`; submit copies it to `keyword` and refetches with the new key.
  - `FlatList` of `RequestItem`, with load-more on end reached (momentum guard) and a footer spinner.
  - Pull-to-refresh clears the search and calls `refetch()`.
  - "No data" text (`fCommon.noData`).
  - `TabBarBottom`.
- **Key actions**:
  - Item tap: if `global.summaryTrouble && item.summary_list.length > 1`, opens **ModalSelectTrouble** (default mode, which shows `Common.getStatusLabel` and unread badges) with `item.summary_list`. Otherwise, or on selection, it goes to `TroubleDetail {troubleId, fromHistory:true}`.
- **Modals**:
  - `ModalSelectTrouble`.
  - `BaseModalOk` (`sHistoryList.modal.empty`), whose `visibleEmptyModal` is never set to true (dead code).
- **Permissions**: none in the screen. `global.summaryTrouble` (set by the last trouble-detail fetch) changes the click behaviour.

---

## Reusable modals referenced by these screens

| Modal | File | Used by | Behaviour |
|---|---|---|---|
| ModalStaffInfo | `components/Modal/StaffInfo/ModalStaffInfo.tsx` | TroubleDetail | `BaseModal` + `CardProfStaff` worker profile (read-only). |
| ModalCallPhone | `components/Modal/CallPhone/ModalCallPhone.tsx` | TroubleDetail (via `BoxWrapeer`/`ButtonBoxWrapeer`; the screen's own instance is unreachable) | Shows the phone number. "発信" (call) runs `Linking.openURL('tel:…')`; there is also a cancel button. |
| ModalSelectTrouble | `components/Modal/Trouble/ModalSelectTrouble.tsx` | TroubleDetail (`isTroubleEstimate=true`), HistoryList | Lists summary troubles as 新規/継続/継続N. In estimate mode it shows a 承認済 tag; otherwise it shows the status label and unread badges (`is_read`, `is_show_badge_store`, role-based `*_unread`). |
| ModalConfirmMessage | `components/Modal/ConfirmMessage/ModalConfirmMessage.tsx` | WorkerSelection | Yes/no confirm before cancelling a request. |
| ModalStaffRequest | `components/Modal/Staff/ModalStaffRequest.tsx` | WorkerDetail | `BaseModalConfirm` asking to confirm the selected worker and time (Cancel / OK). |
| BaseModalOk | `components/Modal/BaseModalOk.tsx` | WorkerSelection (ps39 push), HistoryList (unused) | Single-button OK dialog. |
| (inline) react-native-modal | in `ListApprovalScreen.tsx` | ListApprovalScreen | Approver list (決裁者一覧). |
| ModalApprovalPending / ModalEstimate | `components/Modal/Approval`, `components/Modal/Estimate` | **Not used** by these six screens | n/a |

## Endpoint summary (this group)

| Endpoint | Method | Called from |
|---|---|---|
| `troubles/detail` | POST | TroubleDetail (saga + direct for prev/next), WorkerSelection (saga) |
| `troubles/summary-trouble-estimate` | POST | TroubleDetail (only when `global.summaryTrouble`) |
| `troubles/s_cancel` | POST | WorkerSelection (cancel request) |
| `candidacies/list` | POST | WorkerSelection |
| `candidacies/detail` | POST | WorkerDetail |
| `candidacies/select` | POST | WorkerDetail (decide worker) |
| `stores/permission` | GET | WorkerDetail (saga), WorkCancelFee (saga + direct, twice) |
| `troubles/{id}/list-approvers` | GET | ListApprovalScreen |
| `troubles/s_histories` | POST | HistoryList (react-query infinite) |
| (Firebase / legacy chat) | n/a | TroubleDetail via `FirebaseChatBottomSheet`; its internals are not traced here |


# D. Work in progress / Estimation / Payment screens (qnavi-shop-app)

Base path: `qnavi-shop-app/QnaviShop/app/`. All endpoints are under `Config.API_URL + '/api/mobile/'` unless noted. `ApiInstance.apiModule.post` is HTTP POST and `.get` is HTTP GET.

## Shared reference: enums, data flows, shared modals

**Status enums** (`interfaces/TroubleEnum.ts`, `interfaces/Trouble.ts`, `constants/Enum.ts`, `constants/waitingType.ts`):
- `TroubleStatusEnum`: 1 inquiring, 2 working, 3 done.
- `TroubleNewFlowStatusEnum` (`new_flow`, used for new requests): 1 waiting, 2 orders, 3 moving, 4 arrival, 5 waitingQuoteApproval, 6 quoteRejection, 7 working, 8 done, 9 reported, 10 approved.
- `TroubleContinueFlowStatusEnum` (`continuation_flow`, used for continuation requests): 1 waitingQuote, 2 waitingQuoteApproval, 3 quoteRejection, 4 quoteApproval, 4.1 waitingScheduleApproval, 4.2 scheduleReRequest, 5 scheduleConfirmed, 6 moving, 6.1 arrival, 7 working, 8 done, 9 reported, 9.1 approved.
- `TroubleWaitingTypeEnum` (`waiting_type`): 0 canConfirm, 1 canConfirmAndApproved, 2 canNotConfirm, -1 noReApprove. `isCanApprove = [0, 1]` and `isNotApprove = [-1, 2]`.
- `APPROVAL_TYPE` (`chain_store.type_approval` / `estimation.type_approval`): '01' INDIVIDUAL, '02' HIERARCHICAL, '03' AMOUNT, '04' INDUSTRY.
- `ResubmissionStatusEnum`: 'approved' / 'pending'. `ReportStatusEnum`: '01' HIDDEN, '02' DISPLAY.

**Common redux-saga flows** (actions in `actions/troubleAction.js` and `actions/commonAction.js`, sagas in `sagas/troubleSaga.js`, `sagas/commonSaga.js` and `sagas/storeEditSaga.js`, repositories in `repositories/TroubleRepository.js`, `CommonRepository.js` and `StoreEditRepository.js`):

| Action creator | Action type | Saga | Repository | HTTP |
|---|---|---|---|---|
| `troubleAction.getTroubleDetail({id, successCallback})` | `TROUBLE_DETAIL_REQUEST` | `fetchTroubleDetail` (also sets `global.summaryTrouble` from `results.is_summary_trouble`) | `GetTroubleDetail` body `{troubleId}` | POST `troubles/detail` |
| `troubleAction.cancelTrouble({storeId, troubleId, successCallback})` | `TROUBLE_CANCEL_REQUEST` | `fetchCancelTrouble` | `CancelTrouble` `{troubleId, storeId}` | POST `troubles/s_cancel` |
| `troubleAction.getEstimationList({troubleId})` | `ESTIMATION_LIST_REQUEST` | `fetchEstimationList` | `GetEstimationList` | POST `troubles/list_estimations` |
| `troubleAction.postEstimationReview({troubleId, estimationId, isApproved, successCallback})` | `ESTIMATION_REVIEW_REQUEST` | `fetchEstimationReview` | `PostEstimationReview` | POST `troubles/review_estimation_v2` |
| `troubleAction.getEstimationDetail({estimationId})` | `ESTIMATION_DETAIL_REQUEST` | `fetchEstimationDetail` | `GetEstimationDetail` | POST `troubles/detail_estimation` |
| `troubleAction.estimationDetailInit()` | `ESTIMATION_DETAIL_INIT` | (reducer only) | - | - |
| `troubleAction.postScheduleUpdateStatus(params)` | `SCHEDULE_UPDATE_STATUS_REQUEST` | `fetchScheduleUpdateStatus` (on failure it re-dispatches `getTroubleDetail({id: params.troubleId})` and shows an alert) | `PostScheduleUpdateStatus` (sends the raw params) | POST `troubles/update_schedule_status` |
| `troubleAction.resetScheduleState()` | `SCHEDULE_UPDATE_STATUS_RESET` | (reducer only) | - | - |
| `troubleAction.postSummaryTroubleEstimation({troubleId})` | `SUMMARY_TROUBLE_ESTIMATION_REQUEST` | `fetchSummaryTroubleEstimation` | `PostSummaryTroubleEstimation` | POST `troubles/summary-trouble-estimate` |
| `troubleAction.getSummaryChat({troubleId})` | `SUMMARY_CHAT_REQUEST` | `fetchSummaryChat` | `GetSummaryChat` | POST `troubles/summary-chats-trouble-detail` |
| `troubleAction.approveReport({troubleId, is_continuation, name})` | `APPROVE_REPORT_REQUEST` | `approveReport` (on success: `navigate(is_continuation ? WorkContinueInprogress : WorkInprogress, {headerTitle: name, troubleId})`) | `ApproveReport` `{troubleId}` | POST `troubles/approve-report` |
| `commonAction.getPermission()` | `PERMISSION_REQUEST` | `getPermission` (stores the result in `permissionsReducer` and in `global.permissions`) | `GetPermission` | GET `stores/permission` |
| `commonAction.getMasterConfig({reloadTarget, chainSystem})` | `MASTER_CONFIG_REQUEST` | `fetchMasterConfig` (sets `global.masterConfig`, `global.summaryTrouble`, `global.assetFlag`) | `GetMasterConfigV2` `{version:0, chain_system, storeId}` | POST `/api/mobile/v2/auth/config` |
| `commonAction.getBadgeSideBar()` | `GET_BADGE_SIDE_BAR_REQUEST` | `fetchBadgeSideBar` (also dispatches `getMentionUnreadCountThunk`) | `getBadgeSideBar` | GET `stores/get_side_bar` |
| `{type: STORE_INFO_REQUEST, params:{id}}` | `STORE_INFO_REQUEST` | `storeEditSaga.fetchStoreInfo` | `GetStoreById` `{storeId}` | POST `stores/info` |
| (GlobarInfo) `getSummaryEstimationReports({estimationIds})` | `SUMMARY_ESTIMATION_REPORTS_REQUEST` | `fetchSummaryEstimationReports` | `GetSummaryEstimationReports` | POST `troubles/summary-estimate-reports` |
| (GlobarInfo) `getSummaryTroubleReports({troubleId})` | `SUMMARY_TROUBLE_REPORTS_REQUEST` | `fetchSummaryTroubleReports` | `GetSummaryTroubleReports` | POST `troubles/summary-reports` |

**Shared modals and components:**
- `ModalStaffInfo` (`components/Modal/StaffInfo/ModalStaffInfo.tsx`): a `BaseModal` that wraps `CardProfStaff` (worker image, name, work time, counts, address, phone, description). It is display-only and does not call an API.
- `ModalConfirmMessage` (`components/Modal/ConfirmMessage`): a `BaseModalConfirm`. The left button defaults to "no" and closes the modal. The right button defaults to "yes" and runs `onClickButtonYes`. It can show `scheduleSelected` as a date and time line. On the work screens it is often relabelled with left "スキップ" (`notApprove`) and right "確認する" (`approve`).
- `ModalOkMessage` / `ModalOkMessageExt` (`components/Modal/OkMessage`): a single OK button.
- `BaseModalOk` / `BaseModalConfirm` / `BaseModal` (`components/Modal/*.tsx`): the base modals.
- `ModalSelectTrouble` (`components/Modal/Trouble/ModalSelectTrouble.tsx`): a `BaseModalExt` that lists summary troubles (new / continuation N), with an "approved" tag when `(new_flow>=7 || continuation_flow>=4) && is_approve`. Selecting a row calls `onClickSelect(item)`.
- `ModalSelectSchedule` (`components/Modal/Select/ModalSelectSchedule.tsx`): a list of `schedules` with the title "訪問日時一覧". Tapping a row calls `onClickSelect`. The outline button "訪問日時の再提案を依頼する" calls `onClickReject`.
- `ButtonBoxWrapeer` (`components/Button/ButtonBoxWrapeer.tsx`): the request summary box (number, worker, dates, urgent/resubmission tags).
  - "見積書一覧" calls `quotationPressed` and is shown only when `isShowQuotation`.
  - "詳細" calls `navigate(WorkInprogressDetail, {troubleId})` and can be disabled with `disableBtnDetail`.
  - When `isEstDetail` is set, it shows a phone button that opens `ModalCallPhone` and then `tel:`.
- `ButtonChat`: a floating chat button. On these screens it calls `showDetail(true)`, which navigates to `WorkInprogressDetail` with `scrollToChat: true`.
- `FlowGroup` (`components/Flow/FlowGroups`): the step list. Each step has `{title, active, clickable, onPress, showBadge, badgeType}`.
- `GlobarInfo` (`components/Info/GlobarInfo.tsx`): company information and signature notes, plus PDF download and share buttons.
  - With a `pdf` value it uses `Common.downloadPDF` / `Common.shareEncryptPDF`. These go through `downloadPdfApi`, GET `/api/download-file`; the helper internals were not fully traced.
  - With `estimationIds` it calls POST `troubles/summary-estimate-reports`. With `troubleId` it calls POST `troubles/summary-reports`.
  - The buttons are hidden when `global.JTVT10 !== false` or `global.Paycas !== false`.
- `FirebaseChatBottomSheet` (`features/chat/components/ChatBottomSheet.tsx`): the chat bottom sheet, with Firebase chat and a switch to legacy chat. It uses the react-query hook `useUnreadChatStatus(troubleId)` (`hook/query/useUnreadChatStatus.ts`), which calls GET `troubles/{troubleId}/has-unread-message`. The chat internals are outside the scope of this catalog.

---

## Work in progress (new request flow)

### WorkInprogress (`WorkInprogressScreen`)
- **Route / SC**: `ScreenTypes.WorkInprogress` = 'WorkInprogress' (SC0019).
- **File**: `screens/Work/WorkInprogressScreen.tsx`. It is a class component connected to redux.
- **Purpose**: Shows the progress steps for a new (non-continuation) repair request: worker selection, moving, arrival, estimate approval, working, complete, report confirmation, and payment. It routes the store user into the estimate, report, and payment screens, and pops up action prompts that depend on the request's status.
- **Params received**:
  - `route.params.troubleId`: required.
  - `route.params.headerTitle`: optional. It is overridden by `troubleDetail.name` once the detail loads.
- **Redux state read**: `troubleDetailReducer`, `troubleCancelReducer`, `permissionsReducer`, `summaryTroubleEstimationReducer`.
- **Main UI sections**:
  - `Header`: back button, `isShowTopHeader`, and a refresh button (`onPressRefresh` calls `onReloadData`).
  - `TitleArea`: "作業依頼対応状況".
  - `ButtonBoxWrapeer`: number, worker, dates, `is_suspension_business=urgent_flag`, `resubmission_status`.
    - "見積書一覧" is shown when `new_flow == 5 || new_flow >= 7` and calls `gotoEstimationListScreen()`.
    - "詳細" calls `navigate(WorkInprogressDetail, {troubleId: troubleDetail._id})`.
    - Tapping the box (`openDetail`) opens `ModalStaffInfo`.
  - `FlowGroup` with `isRequesting`, built by `updateFlows(new_flow, report)` (described below).
  - `ButtonChat`.
  - Bottom `ButtonCancel` "依頼をキャンセルする", shown only when `new_flow < 7`.
  - `TabBarBottom`.
- **Flow step logic (`updateFlows`)**. There are 8 steps:
  - Step 0: staffSelecting, or staffConfirmed once `new_flow >= 2`.
  - Step 1: moving.
  - Step 2: arrived.
  - Step 3: estimate. Its title is waitForEstimation, or estimateApproved once `new_flow >= 7`.
  - Step 4: working.
  - Step 5: complete.
  - Step 6: reportConfirm.
  - Step 7: payment.

  Behavior by status:
  - **Steps fill progressively**: the switch statement falls through, so each status also activates the steps below it.
  - **Urgent override for step 3**: applies when `urgent_flag && (!estimation || !estimation.approver)` and `new_flow >= 7`.
    - The title becomes waitForEstimationApproval and the step shows the `SkipEstTag` badge.
    - The step is clickable when `estimations.length > 0` and calls `gotoEstimationListScreen(true)`.
  - **new_flow 5 (waitingQuoteApproval)**: step 3 shows "waitForEstimationApproval" with a badge. It is clickable and goes to the estimate list when `chain_store.type_approval == '04'` (INDUSTRY) or `waiting_type == 1`.
  - **new_flow 8 (done)**: the payment step is clickable.
    - If there is no `estimation`, it shows the warning modal. Otherwise it calls `gotoWorkDetailPaymentScreen()`.
    - The report step's `clickable` is first set to true when `report.status == '02'`, but a later line overwrites it to `false`. In practice the report step is **not clickable at flow 8**, which looks like a code quirk.
  - **new_flow 9 (reported) / 10 (approved)**: the payment step is clickable.
    - If there is no estimation or the estimation has no approver, it shows the `visibleModalWarningPayment` modal. Otherwise it calls `gotoWorkDetailPaymentScreen()`.
    - The report step is clickable when `report.status == '02'` and calls `gotoWorkReportScreen()`. At flow 10 the report step is active.
  - **No payment permission**: if `!permissionsReducer.is_allow_payment`, the payment step is removed (`flows.slice(0, -1)`).
- **Data loading**:
  - In the constructor: `getPermission()` calls GET `stores/permission`.
  - On every `focus`, `onReloadData()` runs:
    - It resets all modals and calls `getTroubleDetail({id})`, which is POST `troubles/detail`.
    - On success, if `global.summaryTrouble` is set, it calls `postSummaryTroubleEstimation({troubleId})`, which is POST `troubles/summary-trouble-estimate`.
    - It then calls `onHandleModalIsReport(detail)`.
- **Automatic modals (`onHandleModalIsReport`)**. These are skipped entirely when `global.isIndividualStore()`. They are checked in this order:
  1. **"Waiting for another approver" modal (`ModalOkMessage`, `visibleModalMessageOk2`)** opens when all of these hold:
     - The approval type is INDUSTRY ('04').
     - `waiting_type` is in `isNotApprove`.
     - Either `new_flow == 5`, or `isNewEstimationFlow` is set and `resubmission_status == 'pending'`.
     - `has_estimate_submitted` is set.

     The modal text is "他の担当者の見積承認待ちです。お待ち下さい。". If `isShowApproverList` is set, it also shows a "見積稟議進捗" link that navigates to `ListApprovalScreen` with `{troubleId}`.
  2. **Higher-manager modal (`visibleModalOkMessage`)** opens when the request is waiting on a higher manager:
     - `waiting_type == 2` (canNotConfirm) and the approval type is HIERARCHICAL ('02').
     - The same flow 5 / pending-resubmission condition as above.
     - `has_estimate_submitted` is set.

     It shows a `ModalOkMessage` with "確認中：上位マネージャー" and the waiting message.
  3. **Estimate-submitted confirm (`visibleModalConfirm`)** opens when `waiting_type` is in `isCanApprove` and `new_flow == 5`.
     - It shows a `ModalConfirmMessage` with "作業スタッフから見積書が提出されました…", left "スキップ", right "確認する".
     - "確認する" calls `gotoEstimationListScreen(true)`.
     - It renders only when `new_flow >= 5`, the estimation is unapproved, and `!urgent_flag`.
  4. **Report-submitted confirm (`visibleModalIsReport`)**:
     - Opens when `is_allow_payment` is set, `new_flow` is 9 or 10, and the trouble id is not in `AsyncStoreApp.getTroubleReportViewed()`. At flow 10 the id is then saved to the "viewed" list.
     - Without `is_allow_payment`, it opens whenever `new_flow == 9`.
     - It shows a `ModalConfirmMessage` with "作業スタッフから報告書が提出されました…". "確認する" calls `gotoWorkReportScreen()`.
- **Other modals**:
  - `ModalStaffInfo`.
  - `ModalSelectTrouble`, used for summary troubles.
  - Cancel confirm `ModalConfirmMessage`. Its message includes the cancel fee (`masterConfig.invoice_cancel_fee` / `cancel_fee`) when `new_flow` is in 1..6 and `status == 2`. Otherwise it shows the plain cancel message.
  - `BaseModalOk` with "決済する前に見積を承認してください。" (`warningPayment`). OK calls `gotoEstimationListScreen(true)`.
- **User actions to API calls**:
  - Cancel request, then "yes": `cancelTrouble({storeId: global.storeId, troubleId})` calls POST `troubles/s_cancel`. On success it calls `navigateToHome()`, which resets to `MajorCategory` for chain stores or `ManageBox` otherwise.
- **Navigation targets**:
  - `WorkReport` with `{troubleDetail}` (SC0024).
  - `gotoWorkDetailPaymentScreen`:
    - If `isNewEstimationFlow` is set, it navigates to `PWA_Webview` with `{uri: 'trouble/{id}/estimate?mode=summary&payment=true'}` when there are more than one summary troubles, or `{uri: 'trouble/{id}/estimate/{estimationId}?review=true'}` otherwise.
    - Otherwise it navigates to `WorkDetailPayment` with `{troubleId}`.
  - `gotoEstimationListScreen(goToEstimateList)`:
    - If `global.summaryTrouble` is set, the summary list is not empty, and `goToEstimateList` is false, it opens `ModalSelectTrouble`.
    - Otherwise it navigates to `PWA_Webview` with `{uri: 'trouble/{id}/estimate'}` when `isNewEstimationFlow` is set, or to `EstimationList` with `{troubleId, troubleWaitingType: waiting_type}`.
  - `ModalSelectTrouble` selection: navigates to `PWA_Webview` with `{uri:'trouble/{item.id}/estimate'}` if `item.is_new_estimation_flow` is set, otherwise to `EstimationList` with `{troubleId: item.id, troubleWaitingType: item.waiting_type}`.
  - `WorkInprogressDetail` with `{headerTitle, troubleId, scrollToChat}`, through the chat button.
  - `ListApprovalScreen` with `{troubleId}`.
  - `navigateToHome()` after a cancel.
  - `backToRequestList` (navigates to `TroubleList` or `RequestList`) is defined but **not wired**, because the Header has no `onBackPress`.
- **Permission / role gating**:
  - `is_allow_payment` controls whether the payment step exists and how the report modal behaves.
  - `global.isIndividualStore()` skips all of the automatic modals.
  - `global.summaryTrouble` switches the summary-trouble behaviour (select-trouble modal and summary payment URL).
  - `chain_store.type_approval` and `waiting_type` drive the approval prompts.

### WorkInprogressDetail (`WorkInprogressDetailScreen`)
- **Route / SC**: `ScreenTypes.WorkInprogressDetail` = 'WorkInprogressDetail' (SC0020).
- **File**: `screens/Work/WorkInprogressDetailScreen.tsx`. It is a class component connected to redux.
- **Purpose**: The detail view of an in-progress request. It shows worker info, the category breadcrumb, work photos, and the description. It also hosts the chat bottom sheet, links to the previous and next continuation troubles, and offers report and cancel buttons. For summary troubles it shows an accordion with one item per summary trouble.
- **Params received**:
  - `troubleId`.
  - `headerTitle`.
  - `scrollToChat`: stored in state. It is cleared on the first content size change and does not trigger any explicit scroll call.
  - `initialChatMode` (`ChatMode`): passed to the chat sheet.
- **Redux state read**: `troubleDetailReducer`, `chatMessagesReducer`, `sendMessageReducer`, `deleteChatMessageReducer`, `troubleCancelReducer`, `summaryTroubleEstimationReducer`, `summaryChatReducer`. These are combined into a single `loading` value.
- **Main UI sections**:
  - `Header` with a back button.
  - When there is no accordion:
    - A "to next trouble" link, shown when `previous_trouble_id === null && next_trouble_id`.
    - A "to previous trouble" link, shown when `previous_trouble_id`.
  - `ButtonBoxWrapeer` with `disableBtnDetail`:
    - "見積書一覧" is shown when `checkShowEstimateButton()`. For continuations that means `continuation_flow == 2 || >= 4`; for new requests it means `new_flow == 5 || >= 7`.
    - Tapping the box opens `ModalStaffInfo`.
  - A `Caption` and a `Breadcrumb` showing `large_label_ja`, `medium_label_ja`, and `label_ja`.
  - The photo area: `work_images` rendered as `ImageBorder` with download. Tapping an image navigates to `WebView` with `{uri}`.
  - A read-only `InputTextArea` with the description.
  - The buttons from `onRenderButton(trouble)`:
    - "作業報告書を確認する" is shown when `(new_flow === 9 || continuation_flow === 9) && report.status === '02'`.
    - "依頼をキャンセルする" is shown when `status === 2 && (!is_continuation ? new_flow < 7 : continuation_flow < 6)`.
  - The accordion, when `global.summaryTrouble && summary_list.length > 1`: one `ButtonAccordion` per `summary_list` item. Each holds a `BoxWrapeer` and that item's report and cancel buttons.
  - `FirebaseChatBottomSheet` with these props:
    - `firebaseChatEnabled = trouble.firebase_chat_enabled ?? true`.
    - `troubleId`.
    - `initialChatMode`.
    - `showChatModeSwitch`, true when `has_legacy_chat` is set on the trouble or on any summary item.
    - `summary_list`.
  - `TabBarBottom`, hidden on Android while the keyboard is open.
- **Data loading**:
  - On mount:
    - `getMasterConfig({reloadTarget:'all', chainSystem: global.user.manager?.system ?? global.user.chain?.system ?? null})` calls POST `/api/mobile/v2/auth/config`.
    - `getBadgeSideBar()` calls GET `stores/get_side_bar`.
  - On focus: `getTroubleDetail({id})` calls POST `troubles/detail`. On success, if `global.summaryTrouble` is set, it also calls:
    - `postSummaryTroubleEstimation`, which is POST `troubles/summary-trouble-estimate`.
    - `getSummaryChat`, which is POST `troubles/summary-chats-trouble-detail`.
  - Previous/next link tap: a direct `ApiInstance.apiModule.post(ApiList.TROUBLE_DETAIL, {troubleId})` (POST `troubles/detail`), bypassing redux. If the returned status is not 3 (done), it pushes `WorkInprogressDetail` with `{troubleId}`; otherwise it pushes `TroubleDetail` with `{troubleId}`.
  - The chat sheet uses react-query `useUnreadChatStatus`, which is GET `troubles/{id}/has-unread-message`.
  - `onReloadData()` calls `this.props.getChatMessages`, but that prop is not mapped, so the method is dead code.
- **Modals**:
  - `ModalStaffInfo`.
  - Cancel confirm `ModalConfirmMessage`. For continuations, the fee wording applies when `continuation_flow` is in [4, 4.1, 4.2, 5, 6, 6.1] and `status == 2`. For new requests it applies when `new_flow` is in 1..6 and `status == 2`.
  - `ModalSelectTrouble`.
- **User actions to API calls**:
  - Cancel, then "yes": `cancelTrouble` calls POST `troubles/s_cancel`, then `navigateToHome()`.
- **Navigation targets**:
  - `EstimationList` with `{troubleId}`, or with `{troubleId, troubleWaitingType}` from the select modal.
  - `PWA_Webview` with `{uri:'trouble/{id}/estimate'}`.
  - `WorkReport` with `{troubleDetail, troubleSelected: troubleDisplay}`.
  - `WebView` with `{uri}`.
  - Push `WorkInprogressDetail` or `TroubleDetail` with `{troubleId}`.
  - `navigateToHome()`.
- **Permission / role gating**:
  - No `permissionsReducer` checks on this screen.
  - `global.summaryTrouble` controls the accordion and the summary calls.
  - `global.user.manager/chain.system` is passed to the master config call.

### WorkContinueInprogress (`WorkContinueInprogressScreen`)
- **Route / SC**: `ScreenTypes.WorkContinueInprogress` = 'WorkContinueInprogress' (SC0026).
- **File**: `screens/Work/WorkContinueInprogressScreen.tsx`. It is a class component connected to redux.
- **Purpose**: The progress screen for a continuation request (継続依頼対応状況). It covers estimate approval, adjusting the visit schedule (approve a schedule or request a re-proposal), moving, arrival, working, complete, report, and payment.
- **Params received**:
  - `troubleId`.
  - `headerTitle`.
  - `goBackToPrevious`: when true, the header back button calls `navigateGoBack()`.
  - `scrollToChat`: when true, `handleButtonChat()` runs after 500ms and goes to `WorkInprogressDetail` with `scrollToChat: true`.
- **Redux state read**: `troubleDetailReducer`, `scheduleUpdateStatusReducer`, `troubleCancelReducer`, `permissionsReducer`, `summaryTroubleEstimationReducer`.
- **Main UI sections**:
  - `Header`:
    - Its back button calls the custom `backToRequestList()`. If `goBackToPrevious` is set, it calls goBack. Otherwise the target is `TroubleList` for store admins (`global.isStoreAdmin()`) and individual stores (`global.isIndividualStore()`), and `RequestList` with `{id: global.storeId, name: global.user.chain?.name}` for everyone else. If the target is already in the root stack it uses `navigate`; otherwise it uses `StackActions.replace`.
    - Refresh, through `onPressRefresh` and `onReloadData`.
  - `TitleArea`: "継続依頼対応状況".
  - The "継続対応" tag plus a "to previous trouble" link. The link does a direct POST `troubles/detail` with `previous_trouble_id`, then navigates to `TroubleDetail` if the result is done (status 3), otherwise to `WorkInprogressDetail` with `{troubleId: previous_trouble_id}`.
  - `ButtonBoxWrapeer`:
    - "見積書一覧" is shown when `continuation_flow == 2 || >= 4`.
    - "詳細" navigates to `WorkInprogressDetail`.
    - Tapping the box opens `ModalStaffInfo`.
  - `FlowGroup`.
  - `ButtonChat`.
  - `ButtonCancel`, shown when `continuation_flow < 6`.
  - `TabBarBottom`.
- **Flow step logic (`updateFlows(continuation_flow, report)`)**:
  1. **Estimate step**:
     - Title: waitForEstimation for flows 1 and 3, waitForEstimationApproval for flow 2, estimateApproved otherwise.
     - Active once the flow is past 1, 2, and 3. Shows a badge at flow 2.
     - Clickable when either (a) the approval type is INDUSTRY and an `estimation` exists, or (b) flow is 2 and `waiting_type == 1`. A click calls `gotoEstimationListScreen(true)`.
     - Urgent variant: applies when `urgent_flag` is set, the estimation is not approved, and the flow is past 1. It shows `SkipEstTag` and is clickable when `estimations.length > 0`.
  2. **Schedule step**:
     - Title: adjustingDatetime at 4.1 or 4.2, visitTimeConfirm at 5 or later, adjustingSchedule otherwise.
     - Active for flows other than 1, 2, 3, 4, and 4.1.
     - At 4.1 it is clickable with a badge and opens `ModalSelectSchedule`.
  3. **Moving**: active for 6, 6.1, 7, 8, 9, and 9.1.
  4. **Arrived**: active for 6.1 and later.
  5. **Working**: active for 7 and later.
  6. **Complete**: active for 8 and later.
  7. **Report confirm**:
     - Active at 9.1.
     - Clickable when the flow is 9 or 9.1 and `report.status == '02'`. A click goes to `WorkReport`.
  8. **Payment**:
     - Clickable at 8, 9, and 9.1.
     - If the estimation is missing or has no approver, it shows the warning modal. Otherwise it calls `gotoWorkDetailPaymentScreen()`.
     - The step is removed when `!is_allow_payment`.
- **Data loading**:
  - In the constructor: `getPermission()`.
  - On mount and on every focus, `onReloadData()` runs:
    - `getPermission()`.
    - `getTroubleDetail`, which is POST `troubles/detail`. On success:
      - If `global.summaryTrouble` is set, it calls `postSummaryTroubleEstimation`.
      - It then runs `checkDerivedStateFromProps(detail)` and `onHandleModalIsReport(detail)`.
    - `resetScheduleState()`.
- **Automatic modals**. `checkDerivedStateFromProps` checks these in order:
  1. At `continuation_flow == 4.1`, it opens `ModalSelectSchedule`.
  2. When `waiting_type` is in `isCanApprove`, the flow is 2, and `urgent_flag` is not set, it opens the estimate-submitted `ModalConfirmMessage` (left "スキップ", right "確認する"). "確認する" calls `gotoEstimationListScreen(true)`.
  3. When the approval type is INDUSTRY, `waiting_type` is in `isNotApprove`, either the flow is 2 or `isNewEstimationFlow` is set with `resubmission_status == 'pending'`, and `has_estimate_submitted` is set, it opens the waiting `ModalOkMessage` with the optional "見積稟議進捗" link to `ListApprovalScreen` with `{troubleId}`.

  `onHandleModalIsReport` is skipped for individual stores. It opens the report-submitted `ModalConfirmMessage` when:
  - `is_allow_payment` is set, the flow is 9 or 9.1, and the report has not been viewed yet. At 9.1 the id is then marked as viewed.
  - Or, without that permission, whenever the flow is 9.

  "確認する" goes to `WorkReport`. The "higher manager" `ModalOkMessage` (`visibleModalOkMessage`) is never set to true because that code is commented out, so it is dead.
- **Schedule approve / reject flow**:
  - **Select a schedule**:
    - Selecting a schedule in `ModalSelectSchedule` stores `scheduleSelected` and, after 100ms, opens `ModalConfirmMessage` titled "継続作業　日程調整". It shows the selected date and time and the message "この日程で承認します。よろしいですか？".
    - "Yes" calls `postScheduleUpdateStatus({scheduleId: scheduleSelected.id, isApproved: 1})`, which is POST `troubles/update_schedule_status`. This payload does not include `troubleId`, so if the call fails the saga re-fetches the detail with `id: undefined`. This is a likely bug.
    - On success, `scheduleUpdateStatusReducer.results` is set. `getDerivedStateFromProps`, combined with the static `isApprove = Approve`, then shows `ModalOkMessageExt` with "日程調整が完了しました" and the date and time. OK calls `onReloadData()`.
  - **Reject**:
    - "訪問日時の再提案を依頼する" calls `postScheduleUpdateStatus({scheduleId: scheduleSelected?.id ?? schedules[0].id, isApproved: 0, troubleId})`, which is POST `troubles/update_schedule_status`.
    - On success it shows `ModalOkMessage` with "訪問日時の再提案を依頼しました。". OK resets the flag and calls `onReloadData()`.
- **Other modals**:
  - `ModalStaffInfo`.
  - `ModalSelectTrouble`.
  - The cancel confirm. Its fee wording applies when `continuation_flow` is in [4, 4.1, 4.2, 5, 6, 6.1] and `status == 2`.
  - `BaseModalOk` with `warningPayment`. OK calls `gotoEstimationListScreen(true)`.
- **User actions to API calls**:
  - Cancel: POST `troubles/s_cancel`, then `navigateToHome()`.
  - Schedule approve / reject: POST `troubles/update_schedule_status`, as described above.
- **Navigation targets**:
  - `WorkReport` with `{troubleDetail}`.
  - `WorkDetailPayment` with `{troubleId}`, or the `PWA_Webview` payment/review URI (the same logic as SC0019).
  - `EstimationList` with `{troubleId, troubleWaitingType}`, or `PWA_Webview` with `{uri:'trouble/{id}/estimate'}`.
  - `ModalSelectTrouble`, the same as SC0019.
  - `WorkInprogressDetail` with `{headerTitle, troubleId, scrollToChat}`.
  - `TroubleDetail` or `WorkInprogressDetail` for the previous trouble.
  - `ListApprovalScreen` with `{troubleId}`.
  - Header back: `TroubleList` or `RequestList`, through navigate or replace, or goBack.
  - `navigateToHome()`.
- **Permission / role gating**:
  - `is_allow_payment` controls the payment step and the report modal.
  - `global.isIndividualStore()` skips the report modal and selects the `TroubleList` back target.
  - `global.isStoreAdmin()` also selects the `TroubleList` back target.
  - `global.user.chain?.name` and `global.storeId` are passed in the `RequestList` params.
  - `global.summaryTrouble` controls the summary behaviour.

### WorkReport (`WorkReportScreen`)
- **Route / SC**: `ScreenTypes.WorkReport` = 'WorkReport' (SC0024).
- **File**: `screens/Work/WorkReport.tsx`. It is a function component, connected for permissions and the summary estimate, and also uses `useSelector(troubleDetailReducer)`.
- **Purpose**: Shows the worker's work report: start and end time, contractor and worker, symptoms, cause, work content, special notes, whether a continuation exists, before and after photos, assets, and attached PDFs. From here the store either confirms the report or goes on to payment.
- **Params received**:
  - `troubleDetail`: an object. Its `id` is used as `troubleId`.
  - `troubleSelected`: optional. It defaults to the redux `troubleDetail` and selects which accordion item is open.
- **Main UI sections**:
  - `Header`, titled with `chain_store.name`. For individual stores, `individual_store` is copied into `chain_store`.
  - `Caption` "作業報告書".
  - `ButtonBoxWrapeer`:
    - "見積書一覧" is always shown and calls `gotoEstimationListScreen`.
    - Tapping the box opens `ModalStaffInfo`.
  - The report card (`renderReportInfo`), an `InformationCard`:
    - Download calls `Common.downloadPDF(report.pdf)`.
    - Share calls `Common.shareEncryptPDF(report.pdf)`.
    - Request id, store name, estimate title ("undetermined" if there is none), and report date.
    - Start and end datetime, contractor (`worker.name`), and worker (`worker.staff`).
    - Read-only text areas for symptom, reason, content, and notice.
    - Continuation yes/no, based on `next_trouble_id`.
    - Before and after image grids. Tapping an image navigates to `WebView` with `{uri}`.
    - The asset section (対応区分, 資産名, メーカー名, 型式, 製造番号), shown when `troubleDetail.assetFlag`.
    - The footer lists PDF attachments sorted by `orderNumber`. If `attachmentList` is a string (encrypted), it shows the masked text instead.
  - Approval status `BoxWrapeer` "報告書確認状況" (approvedBy, approvedAt). It is shown when the report is approved (`new_flow == 10`, `continuation_flow == 9.1`, or done) and `approvedAt` is set.
  - Action buttons:
    - **If `status !== 3` and `is_allow_payment`**: "決済情報へ進む". If the estimation is missing or has no approver, it opens the warning `BaseModalOk`. Otherwise it calls `gotoWorkDetailPaymentScreen(troubleDisplay)`.
    - **Otherwise, if `status !== 3` and the report is in `reported` state (`new_flow == 9` or `continuation_flow == 9`) or `!approvedAt`**: "作業報告書確認" calls `approveReport()`.
  - Accordion: when `global.summaryTrouble` is set and more than one `summary_list` item has a report with status '02', each item gets its own report card, followed by `GlobarInfo troubleId`.
  - The PDF preview overlay (`react-native-pdf`) has a Download button and a close (×) button. Android hardware back closes it.
- **Data loading**:
  - On focus (`useIsFocused`):
    - If the trouble is not done, `getPermission()` calls GET `stores/permission`.
    - `troubleAction.getTroubleDetail({id})` calls POST `troubles/detail`.
    - If `global.summaryTrouble` is set, `postSummaryTroubleEstimation` calls POST `troubles/summary-trouble-estimate`.
- **User actions to API calls**:
  - **Approve report**: `approveReport({troubleId: troubleDetail._id, is_continuation, name})` dispatches `APPROVE_REPORT_REQUEST`, handled by `troubleSaga.approveReport`, which calls POST `troubles/approve-report` with `{troubleId}`. On success the saga navigates to `WorkContinueInprogress` if `is_continuation` is set, otherwise to `WorkInprogress`, with `{headerTitle: name, troubleId}`. On failure it shows an alert.
    - The payload uses `troubleDetail._id`, not `id`. Whether `_id` is present in the detail response is not verified.
  - **Attachment download**: `Common.downloadReportAttachmentPDF(path, reportId, {troubleId, fileName, fileSize})` uses `downloadReportAttachmentPdfApi`, which is GET `/api/download-report-attachment` (outside `/mobile`).
  - **PDF preview load or error**: `Common.sendAuditLog({troubleId, fileName, fileSize, action:'preview', responseTime, response:{status, message}})` uses `postAuditLogApi`, which is POST `audit-logs`.
  - **Report PDF download / share**: goes through `Common` helpers. Download uses `downloadPdfApi`, which is GET `/api/download-file`; the internals were not fully traced.
- **Modals**:
  - `ModalStaffInfo`.
  - `ModalSelectTrouble`. Selecting an item navigates to `PWA_Webview` or `EstimationList` with `{troubleId, troubleWaitingType}`.
  - `BaseModalOk` with `warningPayment`. OK navigates to `PWA_Webview` with `{uri:'trouble/{id}/estimate'}` or to `EstimationList` with `{troubleId}`.
  - The PDF preview overlay.
- **Navigation targets**:
  - `EstimationList` with `{troubleId}`, or `PWA_Webview` with `trouble/{id}/estimate` (with `?mode=summary` when there are more than one summary items).
  - `WorkDetailPayment` with `{troubleId: troubleDisplay.id}`, or the `PWA_Webview` payment/review URI.
  - `WebView` with `{uri}`.
  - Through the saga: `WorkInprogress` or `WorkContinueInprogress`.
- **Permission / role gating**:
  - `is_allow_payment` decides between the "go to payment" button and the "confirm report" button.
  - `global.summaryTrouble` controls the accordion.
  - The asset section depends on `troubleDetail.assetFlag`.

---

## Estimation

### EstimationList (`EstimationListScreen`)
- **Route / SC**: `ScreenTypes.EstimationList` = 'EstimationList' (SC0021).
- **File**: `screens/Estimation/EstimationListScreen.tsx`. It is a class component connected to redux.
- **Purpose**: Lists the estimates submitted for a trouble. Each row is an `EstimationItem` with a title, the tax-included total, and an approved badge. The user can open an estimate's detail, or select estimates and request resubmission. Requesting resubmission rejects the selected estimates.
- **Params received**:
  - `troubleId`.
  - `troubleWaitingType`.
  - `fromHistory`: optional and passed through to the detail screen.
- **Redux state read**: `estimationListReducer`, `estimationReviewReducer`, `permissionsReducer`, `troubleDetailReducer`.
- **Main UI sections**:
  - `Header` "見積書一覧", with refresh.
  - A `FlatList` of `EstimationItem` with pull-to-refresh.
    - **Checkbox**: rendered only when no estimate is approved and the item itself is not approved. It toggles selection only if `item.is_approvable`.
    - **Checkbox disabled**: `isDisabled` applies for INDUSTRY items. If the trouble has no `estimation` yet, the checkbox is disabled when `waiting_type` is in `isNotApprove`. If an `estimation` exists, the checkbox is disabled unless `waiting_type` is in `isCanApprove` and the item is not `is_selected`.
    - **"申請中" tag**: shown when `is_selected` applies, meaning an INDUSTRY item that is selected while the flow is waiting for quote approval (new 5 or continuation 2), or during the urgent flow.
    - **Price**: shown only when `is_allow_approve_estimate` is set and no estimate is approved.
  - Bottom `ButtonCancel` "見積書の再提出を依頼する", with the note "※このボタンを押すと、現在出ている見積書は非承認となります。".
    - Visible when `isShowBtnApprove`. That is true when no estimate is approved, `is_allow_approve_estimate` is set, at least one item has `is_approvable`, and `waiting_type` is in [0, 1, -1].
    - It is also true during the urgent flow (`urgent_flag`, estimation unapproved, and `continuation_flow >= 4` or `new_flow >= 7`) when the approval type is not INDUSTRY.
    - Disabled when nothing is selected or `urgent_flag` is set.
  - The INDUSTRY note "他の担当者の見積承認待ちです。お待ち下さい。", shown when `waiting_type == 2` and the approval type is INDUSTRY.
- **Data loading**:
  - In the constructor: `getPermission()`.
  - `onReloadData()` runs on mount, on refresh, and on pull-to-refresh:
    - `getTroubleDetail({id})`, which is POST `troubles/detail`.
    - On success, `getPermission()`, which is GET `stores/permission`.
    - Then `getEstimationList({troubleId})`, which is POST `troubles/list_estimations`.
- **Reject (request resubmission) flow**:
  - The button opens `ModalConfirmMessage` with "見積もり再提出を依頼しますか？".
  - "Yes" calls `postEstimationReview({troubleId, estimationId: Object.values(estimationRejectIds), isApproved: 0})`, which dispatches `ESTIMATION_REVIEW_REQUEST`, handled by `fetchEstimationReview`, which calls POST `troubles/review_estimation_v2` with `{troubleId, estimationId: [ids], isApproved: 0}`.
  - On success it calls `navigateGoBack()`.
- **Modals**: the review-confirm `ModalConfirmMessage`.
- **Navigation targets**:
  - Row tap: `navigatePush(EstimationDetail, {troubleId, troubleWaitingType, estimationId: item.id, index: item.index, estApproved, isApprovable: item.is_approvable, fromHistory})`.
  - goBack after a reject.
  - `showDetail()` (navigates to `WorkInprogressDetail`) is defined but unused.
- **Permission / role gating**:
  - `is_allow_approve_estimate` shows prices and the reject button.
  - `item.is_approvable` is true only when the user is in the approval list for that estimate.
  - `waiting_type`, `type_approval`, and `urgent_flag` also apply, as described above.

### EstimationDetail (`EstimationDetailScreen`)
- **Route / SC**: `ScreenTypes.EstimationDetail` = 'EstimationDetail' (SC0022).
- **File**: `screens/Estimation/EstimationDetailScreen.tsx`. It is a class component connected to redux.
- **Purpose**: Shows one estimate (発注承認 / 見積書 / 作業明細書): trouble info, the category rows, the work list with prices, the subtotal, tax, and total, notices, the PDF, and the signature. The user can **approve** the estimate or cancel the request. For summary troubles it shows a "合算見積" total accordion plus one item per summary estimate.
- **Params received**:
  - `troubleId`.
  - `troubleWaitingType`.
  - `estimationId`.
  - `index`.
  - `estApproved`: whether any estimate is already approved.
  - `isApprovable`: whether the user is an approver for this estimate.
  - `fromHistory`.
  - `headerTitle`.
- **Redux state read**: `troubleDetailReducer`, `estimationReviewReducer`, `estimationDetailReducer`, `troubleCancelReducer`, `chatMessagesReducer`, `sendMessageReducer`, `deleteChatMessageReducer`, `permissionsReducer`, `summaryChatReducer`, `summaryTroubleEstimationReducer`.
- **Main UI sections**:
  - `Header`.
  - A `Caption` subtitle: "作業明細書" when `fromHistory`, otherwise "見積書" when `estApproved`, otherwise "発注承認".
  - For continuations without an accordion: the "継続対応" tag and a "to previous trouble" link. The link does a direct POST `troubles/detail`, then navigates to `TroubleDetail` or `WorkInprogressDetail`.
  - `ButtonBoxWrapeer`, hidden when `estApproved`:
    - "見積書一覧" is always shown and calls `navigateGoBack()`.
    - Tapping the box opens `ModalStaffInfo`.
  - The estimate card (`renderAccordionItem`) inside a `DropShadow`:
    - Request number and store name.
    - Estimate title and date.
    - The category rows (work content, place, symptoms) in the current i18n language.
    - The work list. Line totals are shown only with `is_allow_approve_estimate`.
    - Subtotal, tax, and total, shown only with `is_allow_approve_estimate`.
    - Notices.
    - `GlobarInfo`. Its `pdf` is set only with `is_allow_approve_estimate`. It also shows the signature.
  - The action area for each card (`renderAccordionItemButton`):
    - **INDUSTRY note** "他の担当者の見積承認待ちです…". Shown only for INDUSTRY estimates:
      - If `waiting_type == 2` and the trouble has no estimation yet, it is shown.
      - Otherwise, if `waiting_type` is in [-1, 0, 1], it is hidden.
      - Otherwise it is shown if `estimationDetail.is_selected`.
    - **Approve button**: "この見積書を承認する", or "合算見積書を承認する" in the total card. It carries the note "※承認後はキャンセル不可…".
      - For INDUSTRY estimates:
        - If the trouble has no `estimation`, the button is shown when `waiting_type` is in `isCanApprove`.
        - Otherwise it is shown when `waiting_type` is in [-1, 0, 1], `is_selected` is set, and the flow is new 5 or continuation 2, or during the urgent flow when `is_selected` is set.
        - The `is_approve_estimate` value computed by the caller is ignored for INDUSTRY.
      - For other approval types: the button is shown when `is_allow_approve_estimate` is set, `estApproved` is false, and `isApprovable` (the route param) is set. In the accordion, per-item cards never show it; the total card uses the same rule.
    - **Cancel request** "依頼をキャンセルする": shown when the card is the selected estimate and `!estApproved`. Disabled during the urgent flow. It sets `troubleCancelId` (to `troubleDisplay.trouble` in the accordion, otherwise `troubleDisplay.id`) and opens the cancel confirm.
  - Accordion mode (`global.summaryTrouble` and `summary_estimate.length > 1`):
    - A total card: the approval status per estimate ("approved" when `(new_flow>=7 || continuation_flow>=4) && approver && approve_date`), the total of `total_summary_estimate[0]`, and `GlobarInfo` with `estimationIds` (only with `is_allow_approve_estimate`).
    - One collapsed card per summary estimate.
  - A common area (`renderCommonArea`) with the "見積書一覧に戻る" back button, work images, and the description is defined but **never rendered**.
  - `FirebaseChatBottomSheet`, hidden when `fromHistory || estApproved`.
  - `TabBarBottom`.
- **Data loading**:
  - In the constructor: `getPermission()`.
  - On mount, `onReloadData()` runs:
    - `getPermission()`.
    - `getTroubleDetail`, which is POST `troubles/detail`. On success, if `global.summaryTrouble` is set, it also calls `getSummaryChat` (POST `troubles/summary-chats-trouble-detail`) and `postSummaryTroubleEstimation` (POST `troubles/summary-trouble-estimate`).
    - `getEstimationDetail({estimationId})`, which is POST `troubles/detail_estimation`.
  - On unmount: `estimationDetailInit()`, which dispatches `ESTIMATION_DETAIL_INIT`.
- **Approve flow**:
  - `onApproveEstimate()` checks the trouble's `waiting_type`.
  - **If it is in `isCanApprove` (0 or 1)**:
    - It opens `ModalConfirmMessage` with "この見積書を承認します。よろしいですか？".
    - "Yes" calls `postEstimationReview({troubleId, estimationId: state.estimationId, isApproved: 1})`, which is POST `troubles/review_estimation_v2`. The total card button also sends only the current `estimationId`; the server presumably handles the summary, but this is not verified.
    - On success it calls `navigationRef.dispatch(StackActions.pop(2))`, which returns past `EstimationList` to the work screen.
  - **Otherwise**: it opens `ModalOkMessage`.
    - For HIERARCHICAL estimates the message is "確認中：上位マネージャー" plus "他の担当者の見積承認待ちです…". For other types it is the waiting message only.
    - If `isShowApproverList` is set, a "見積稟議進捗" link navigates to `ListApprovalScreen` with `{troubleId}`.
- **Cancel flow**:
  - `ModalConfirmMessage` shows the fee wording. For continuations, the fee applies when `continuation_flow` is in [4, 4.1, 4.2, 5, 6, 6.1] and `status === 2`. For new requests it applies when `new_flow` is 1..6 and `status === 2`.
  - "Yes" calls `cancelTrouble({storeId: global.storeId, troubleId: troubleCancelId})`, which is POST `troubles/s_cancel`, then `navigateToHome()`.
- **Modals**:
  - `ModalStaffInfo`.
  - The approve `ModalConfirmMessage`.
  - The cancel `ModalConfirmMessage`.
  - `ModalOkMessage` for waiting on another approver.
  - `ModalSelectTrouble`: rendered, but nothing ever opens it, because `gotoEstimationListScreen` is unused.
- **Navigation targets**:
  - goBack, through "見積書一覧".
  - `pop(2)` after an approval.
  - `ListApprovalScreen` with `{troubleId}`.
  - `TroubleDetail` or `WorkInprogressDetail` with `{troubleId: previous_trouble_id}`.
  - `WebView` with `{uri}`, through image preview. The preview is only reachable through the unrendered common area, so it is effectively unused.
  - `navigateToHome()`.
  - Dead code: `gotoWorkReportScreen` (WorkReport), `gotoWorkDetailPaymentScreen` (WorkDetailPayment / PWA_Webview), and `gotoEstimationListScreen` (EstimationList / PWA_Webview) are defined but never called.
- **Permission / role gating**:
  - `is_allow_approve_estimate` controls prices, totals, the PDF, the summary PDF ids, and the approve button for non-INDUSTRY estimates.
  - The `isApprovable` route param also gates approval.
  - `waiting_type` and `type_approval` gate approval as described above.
  - `global.summaryTrouble` controls the accordion and summary calls.

---

## Payment

### WorkDetailPayment (`WorkDetailPaymentScreen`) + `PaymentFailModal`
- **Route / SC**: `ScreenTypes.WorkDetailPayment` = 'WorkDetailPayment'.
  - SC0025: the payment screen, reached from WorkInprogress, WorkContinueInprogress, WorkReport, or EstimationDetail (dead path) with `{troubleId}`.
  - SC0031: the done/receipt view, reached from `TroubleDetailScreen` with `{troubleId, isDone: true}`.
- **Files**: `screens/WorkDetailPayment/WorkDetailPaymentScreen.tsx` (a function component that uses RTK hooks and is also connected for permissions and the summary estimate) and `screens/WorkDetailPayment/PaymentFailModal.tsx`.
- **Purpose**: "決済情報・作業明細書". It shows the approved estimate and work details, takes a mandatory star rating and an optional comment, and runs the work-completion confirmation and payment (card or invoice). It also handles a card payment failure: register a new card, use another card, or switch to invoice.
- **Params received**:
  - `troubleId`.
  - `isDone`: defaults to false. It only switches the accordion titles between payment wording and estimation wording.
- **State read**:
  - RTK: `workDetailPaymentSlice` (`modalVisible`, `troubleDetail`, `paymentFailModal`, `failResponse`), `mainLoading.loading`, `paymentMananagementSlice` (`okModal`, `confirmModal`, `addCardError`), `storeListReducer.storeCheckedId`.
  - Redux: `estimationDetailReducer`, `storeEditReducer`, `permissionsReducer`, `summaryTroubleEstimationReducer`.
- **Data loading (on mount)**:
  1. `getPermission()`, which is GET `stores/permission`.
  2. If `global.summaryTrouble` is set, `postSummaryTroubleEstimation({troubleId})`, which is POST `troubles/summary-trouble-estimate`.
  3. `dispatch({type: STORE_INFO_REQUEST, params:{id: storeCheckedId ?? global.storeId}})`, handled by `storeEditSaga.fetchStoreInfo`, which calls POST `stores/info`. The result's `is_credit` becomes `paymentMethod`: '01' or 'クレジットカード' means card, anything else means invoice.
  4. The RTK thunk `WorkDetailPaymentSlice.getTroubleDetail({id})`, which calls `GetTroubleDetail` (POST `troubles/detail`) and stores the result in `workDetailPaymentSlice.troubleDetail`. It is a thunk with type prefix `TROUBLE_DETAIL_REQUEST`, so it emits `.../pending` and similar types and does **not** trigger the saga.
  5. After that, the saga action `troubleAction.getEstimationDetail({estimationId: troubleDetail.estimation?.id})`, which is POST `troubles/detail_estimation`.
- **Main UI sections**:
  - `Header`, titled with `troubleDetail.name`.
  - `Caption` "決済情報・作業明細書".
  - `ButtonBoxWrapeer`:
    - "見積書一覧" is shown when `(is_continuation && continuation_flow >= 4) || (!is_continuation && new_flow >= 7)` and calls `gotoEstimationListScreen`.
    - Tapping the box opens `ModalStaffInfo`.
  - The single estimate card (when there is no accordion), titled `cardTitle`:
    - Request number and store name.
    - Estimate title and date (taken from `report.updated_at`).
    - Start and end date and time.
    - The category rows.
    - The work list. Prices and totals are shown only with `is_allow_approve_estimate`.
    - Notices.
    - `GlobarInfo` with `fromSC0025` and the payment method text. Its `pdf` is set only with `is_allow_approve_estimate`.
  - The rating card and the pay button, shown when `isShowPaymentButton()`. That is `troubleDisplay.status !== 3 && is_allow_payment`; in the accordion it uses `trouble_status !== 3` instead.
    - "評価" with a `Rating` star input and an `InputTextArea` comment.
    - The pay button is labelled "作業完了確認・決済" for card payment and "作業完了確認" for invoice.
  - Accordion mode (`global.summaryTrouble` and `summary_estimate.length > 1`):
    - The total card ("合算見積" or the payment total title when `isDone`). It shows each item's paid/unpaid tag (paid when `trouble_status===3 && trouble_done_status<3`), the summary totals, and `GlobarInfo estimationIds`.
    - If `estimationDetail.all_pay` is set, the total card shows a "合算見積書を決済する" button.
    - One card per summary estimate, each with its own rating and pay button.
  - The payment status `BoxWrapeer` "決済状況" (paymentBy, paymentAt), shown when `status === 3 && paymentAt`.
  - `TabBarBottom`. On Android API 33 and above the screen is offset for the keyboard.
- **Payment flow** (RTK thunk `troublePay`, `types.TROUBLE_PAY`, in `slices/WorkDetailPaymentSlice.ts`). It calls `TroubleRepository.PayTrouble`, which is POST `troubles/payment`:
  - **Per-trouble pay**:
    - If `rating === 0`, it opens `BaseModalOk` with "評価は1～5の範囲で入力してください。" and does not pay.
    - Otherwise it calls `troublePay({troubleId: (accordion ? troubleDisplay.trouble ?? troubleDetail.id : troubleDetail.id), storeId:'', estimationId:'', rating, comments})`.
  - **Pay all**: `troublePay({troubleId: troubleDetail.id, storeId:'', estimationId:'', payAll: true})`. This path has **no rating and no rating validation**.
  - **Request body quirk**: `PayTrouble` builds a `paramsPost` object but posts the full `params` object. The actual body is therefore `{troubleId, storeId:'', estimationId:'', payAll?, nextCardId?, rating?, comments?}`.
  - **Thunk behaviour**:
    - On `statusCode === SUCCESS`, it awaits the `getTroubleDetail({id})` thunk, which is POST `troubles/detail`.
    - On `UPGRADE_REQUIRED`, it dispatches `requestAlertErrorAction`.
  - **Reducer behaviour**:
    - If `payload.results.data.isPaymentFailed === true`, it sets `paymentFailModal = true` and `failResponse = {cardNumber, isPaymentFailed, nextCardId}`.
    - Otherwise, if `statusCode == 200`, it sets `modalVisible = true`.
    - On rejection, it shows `Alert` in dev only.
- **Completion modals** (shown when `modalVisible`; each button first calls `dismissModal()`):
  - **A continuation is waiting for payment**: when `next_trouble_id && is_next_trouble_waiting_payment`. It shows `BaseModalOk` with "継続作業があります。フローへ戻ってください。" and the button "作業のフローへ進む". The button calls `StackActions.replace(WorkContinueInprogress, {troubleId: next_trouble_id})`.
  - **Can go back to history**: otherwise, when there is no accordion and `is_back_history` is set. It shows `BaseModalConfirm` with "ご利用ありがとうございました。".
    - Left "完了履歴一覧へ" calls `CommonActions.reset({index:1, routes:[{name: global.isChainStore() ? MajorCategory : ManageBox, params:{isRootStack:true}}, {name: HistoryList}]})`.
    - Right "トップ画面へ" calls `navigateToHome()`.
  - **Otherwise**: `BaseModalOk` with "ご利用ありがとうございました。" and "トップ画面へ", which calls `navigateToHome()`.
- **PaymentFailModal** (`PaymentFailModal.tsx`; props `troubleId`, `allPay = estimationDetail.all_pay`):
  - It is a `BaseModal` shown while `paymentFailModal` is set. Tapping outside calls `dismissModal()`.
  - The title comes from `component.modal.paymentFail.title` with `cardNumber`.
  - It has three radio options:
    1. "新規クレジットカードを登録する" (the default).
    2. "他の登録カードで決済する", shown only if `failResponse.nextCardId` is set. If it becomes empty, the selection falls back to option 1.
    3. "請求書払いに変更する".
  - The save button (`sPaymentManagement.save`) does the following for each option:
    - **Option 1**: `dismissModal()`, then opens `CardRegistrationModal` (`screens/PaymentManagement/CardRegistrationModal.tsx`) with `fromFailureModal`, `troubleId`, and `allPay`.
      - Submitting it runs `PaymentManagementSlice.addCard`.
      - `addCard` first POSTs to `Config.TOKEN_URL`, the external Veritrans token API, with `{token_api_key, card_number, card_expire, security_code}`.
      - It then calls POST `credit_cards/register` with `{token, chainStoreId | individualStoreId, isMainPayment}`.
      - On 201 (CREATED) it dispatches:
        - `getCards()`, which is GET `credit_cards` with `{chainStoreId, individualStoreId, chainSystemId: global.user.manager?.system ?? global.user.chain?.system}`.
        - `changePaymentMethod({isCredit:'01', mainCard})`, which is POST `credit_cards/change_payment` with `{chainStoreId, individualStoreId, isCredit, chainSystemId, mainCardId}`. On success that thunk also dispatches `STORE_INFO_REQUEST` and `getCards`.
        - `troublePay({troubleId, payAll: allPay})`.
      - On error it shows `openOkModal(message)` and sets `addCardError`. Closing the OK modal reopens the card form if `addCardError` is set.
    - **Option 2**: `troublePay({troubleId, storeId:'', estimationId:'', payAll: allPay, nextCardId})`, then `dismissModal()`.
    - **Option 3**: `changePaymentMethod({isCredit:'00'})`, which is POST `credit_cards/change_payment`, then `troublePay({troubleId, payAll: allPay})` and `dismissModal()`.
      - The two calls are dispatched without awaiting, so the payment may run before the method switch completes. This is a possible race.
      - The retry paths in options 1 to 3 do not resend `rating` or `comments`.
  - `PaymentFailModal` also renders `paymentMananagementSlice.confirmModal` as a `BaseModalConfirm`. "Right" dispatches the stored `confirmModal.action`, then `closeConfirmModal`. It also renders `okModal` as a `BaseModalOk` that calls `closeOkModal`.
- **Other modals**:
  - `ModalStaffInfo`.
  - `ModalSelectTrouble`. Selecting an item navigates to `PWA_Webview` with `{uri:'trouble/{id}/estimate'}` or to `EstimationList` with `{troubleId}`.
  - The rating validation `BaseModalOk`.
- **Navigation targets**:
  - `EstimationList` with `{troubleId}`, or `PWA_Webview` with `trouble/{id}/estimate[?mode=summary]`.
  - Replace with `WorkContinueInprogress` and `{troubleId: next_trouble_id}`.
  - Reset to `[MajorCategory | ManageBox, HistoryList]`.
  - `navigateToHome()`.
- **Permission / role gating**:
  - `is_allow_payment` shows the rating and pay buttons. The "pay all" button depends only on `estimationDetail.all_pay`.
  - `is_allow_approve_estimate` shows prices, totals, and the PDF.
  - `global.isChainStore()` decides the history reset root (`MajorCategory` or `ManageBox`).
  - `global.isChainStore()`, `global.isStoreAdmin()`, and `global.isIndividualStore()` decide whether card APIs receive `chainStoreId` or `individualStoreId`.
  - `global.user.manager?.system` / `global.user.chain?.system` supply the card `chainSystemId`.
  - `storeEditReducer.results.is_credit` picks the card or invoice wording.
  - `global.summaryTrouble` controls the accordion.

---

## Uncertainties and observations
- `WorkInprogress` flow 8: the report step's `clickable` is set to true and then overwritten to `false`, so the report step is not tappable until flow 9.
- `WorkContinueInprogress.handleConfirmSchedule` posts `{scheduleId, isApproved:1}` without `troubleId`. If it fails, the saga refetches the detail with an undefined id.
- `PayTrouble` posts the whole params object, not the `paramsPost` it builds. Pay-all and the fail-modal retries skip the rating.
- `WorkReport.approveReport` sends `troubleDetail._id`. Whether `_id` is populated in the `troubles/detail` response was not verified.
- Dead code:
  - `EstimationDetailScreen`: `renderCommonArea`, `gotoWorkReportScreen`, `gotoWorkDetailPaymentScreen`, `gotoEstimationListScreen`, `checkShowEstimateButton`, and `visibleModalCall`.
  - `WorkInprogressScreen.backToRequestList`.
  - `WorkInprogressDetailScreen.onReloadData`, which calls an unmapped `getChatMessages`.
  - `WorkContinueInprogress`: the `visibleModalOkMessage` trigger is commented out.
- Internals of the `Common.downloadPDF`, `Common.shareEncryptPDF`, and `Common.downloadReportAttachmentPDF` helpers and of the Firebase chat sheet were only partially traced. The endpoints listed for them come from the repository functions they import.


# QnaviShop: Chat, Notification, Message, and Task Screens (Part E)

All paths are relative to `qnavi-shop-app/QnaviShop/app/`. `API` means `Config.API_URL + '/api/mobile/'` (`api/ApiList.js`). `CHAT_API` means `Config.BE_CHAT_API_URL + '/v2/'` (`features/chat/repo/ChatApiList.ts`).

HTTP method conventions in `api/ApiModule.ts`: `apiModule.post` sends POST, `postFormData` sends a multipart POST, `get` sends GET, `update` sends PUT and `delete` sends DELETE. `ApiListNewMapper` only remaps `MASTER_API_V2`, so none of the endpoints below are remapped. When `Config.API_SERVER_TYPE` is the "new" server type, `convertParams`/`convertResponse` may change params and responses. This applies to POST only.

Shared behaviour across screens:
- **`Header` (`layout/Header.tsx`)**
  - Calls `useLatestNews` (GET `API notifications/store_newest`, react-query key `['latestNews']`).
  - Renders `NotificationDropdown` unless the screen passes `hideNotification`.
- **`TabBarBottom` (`components/TabBar/TabBarBottom.tsx`)**
  - Bottom tabs: Request, Progress, Task (`navigateAndResetStack(ListTask, {hideBtnBack:true})`, after it resets `taskSlice` params) and Chat (`navigateAndResetStack(ChatList, {hideBtnBack:true})`).
  - The Task tab shows the `countTaskNotDone` badge and the Chat tab shows the `countTroubleUnread` badge. Both come from `commonReducer.badgeSizeBar`.
- **Sidebar badge refresh**
  - `getBadgeSideBar()` dispatches `GET_BADGE_SIDE_BAR_REQUEST`.
  - `commonSaga.fetchBadgeSideBar` then calls `CommonRepository`, which sends GET `API stores/get_side_bar`.
- **Master config refresh**
  - `getMasterConfig()` dispatches `MASTER_CONFIG_REQUEST`.
  - `commonSaga.fetchMasterConfig` then sends POST `API auth/config` (or the V2 endpoint).
- **Permissions:** none of the screens in this part read `permissionsReducer`. All gating uses `global.*` role helpers (noted per screen).

---

## Chat

### ChatList (`ChatListScreen`), SC0027
- **File:** `screens/Chat/ChatListScreen.tsx` (registered in `navigation/StackNavigator.tsx` with `headerShown:false`).
- **Purpose:** a list of trouble chat threads in three tabs: all chats, mentions addressed to me, and legacy "to me" chats. Tapping a row opens the trouble screen and scrolls to its chat.
- **Entry points:**
  - DrawerMenu `navigation.navigate(ChatList)`. The drawer item shows a badge when `badgeSizeBar.troubleUnreadFlag` is set.
  - The TabBarBottom Chat tab (`{hideBtnBack:true}`).
  - ManageBox `gotoScreen(ChatList)`.
- **Params:** `hideBtnBack` is read but **unused**: `Header` always gets `leftIcon='back'`.
- **UI sections:**
  - The whole screen is wrapped in `MenuProvider` from react-native-popup-menu.
  - `Header`: title `sChatList.title`, a back button, a refresh button that calls `onReload`, and the top header (drawer row).
  - `InputSearch`:
    - `onFilter` stores the text locally.
    - `onSearch` dispatches `{type: CHAT_SET_KEY_SEARCH, params: searchText}`, which goes to `chatListReducer.keySearch`. All tabs read this value.
    - The input is cleared when `keySearch` becomes `''`.
  - **Inner top tabs** (`createMaterialTopTabNavigator`, custom `tabBar = components/TabBar/TopTabBar`). The initial tab is **`自分宛て` (Mention)**.

    | Tab name (route) | Component | initialParams |
    |---|---|---|
    | `すべて` (`TabKeyListChat.All`) | `screens/Chat/components/ListChat.tsx` | `{key: 'すべて', itemClick}` |
    | `自分宛て` (`TabKeyListChat.Mention`) | `features/chat/components/MentionList.tsx` | `{key: '自分宛て', mentionClick}` |
    | `自分宛て(旧チャット)` (`TabKeyListChat.ToMe`) | `ListChat` (in `isToMe` mode) | `{key: '自分宛て(旧チャット)', itemClick}` |

  - `ModalSelectTrouble`: a summary-trouble picker (see Modals).
  - `TabBarBottom` with `isChatList` and `onReload`.
- **Data flow:**
  - **On focus:** `queryClient.refetchQueries(['latestNews'])` and `getBadgeSideBar()`.
  - **`onReload`** (header refresh, or tapping the Chat tab while on this screen):
    - `getMasterConfig()` and `getBadgeSideBar()`.
    - Invalidates `['chatList']` and `['mentionList']`.
    - Refetches `['latestNews']`.
  - **`goToTroubleDetail(troubleId, …, isToMe)`:** calls `ApiInstance.apiModule.post(ApiList.TROUBLE_DETAIL, {troubleId})` directly, with no saga. This sends **POST `API troubles/detail`**. It then branches on `results.status`:
    - `status !== TroubleStatusEnum.done`: `navigatePush(WorkInprogressDetail, {scrollToChat:true, troubleId, initialChatMode: isToMe ? 'archive' : undefined})`.
    - Otherwise: `navigatePush(TroubleDetail, {troubleId, scrollToChat:true, initialChatMode: isToMe ? 'archive' : undefined})`.
    - Caveat: `TroubleDetailScreen` does **not** forward `initialChatMode` to `FirebaseChatBottomSheet`. Only `WorkInprogressDetailScreen` forwards it.
  - **`itemClick`:** when `global.summaryTrouble && item.summary_list.length > 1`, it opens `ModalSelectTrouble`. Otherwise it calls `goToTroubleDetail`.
  - **`mentionClick`:** `goToTroubleDetail(item.trouble_id, true)` with no `isToMe`, so the chat opens in active mode.
- **Modals:** `ModalSelectTrouble` (`components/Modal/Trouble/ModalSelectTrouble`). Props: `troubles = summaryList` and `isCheckMessageUnreadBadge`. `onClickSelect` calls `goToTroubleDetail(item.id, …, isToMeModal)`.
- **Role gating:**
  - `global.summaryTrouble` switches between the summary picker and direct navigation.
  - Badge-clear fields in ListChat depend on `global.isStoreAdmin()`, `isChainStore()` and `isIndividualStore()`.
- **Navigation targets:** `WorkInprogressDetail` and `TroubleDetail` (both via `navigatePush`, params above).

#### Inner tab: ListChat (`ListChat`), used for the `すべて` and `自分宛て(旧チャット)` tabs
- **File:** `screens/Chat/components/ListChat.tsx`.
- **Params:** `route.params.key`. `isToMe` is true when the key is `TabKeyListChat.ToMe`. `route.params.itemClick` is the click callback.
- **UI:**
  - `FilterListChat` popup menu: toggles `order` between `null` and `Constants.URGENT_FLAG` (urgent-first sort).
  - `FlatList` of `TroubleListChat` rows (`components/List/TroubleListChat`), with pull-to-refresh, infinite scroll, a footer spinner and an empty state ("no data").
- **Data (react-query):** `useChatList({isToMe, keySearch, order})` in `hook/query/useChatQuery.ts`.
  - It is a `useInfiniteQuery` with key `['chatList', isToMe, keySearch, order]`, `staleTime 0` and `refetchOnMount`.
  - It calls `MessageRepository.GetChatList({page, search, order?}, isToMe)`, which adds `storeId: global.storeId` when `global.isChainStore()`.
  - Endpoints:
    - isToMe false: **POST `API troubles/m_trouble_list_chat`**.
    - isToMe true: **POST `API troubles/m_trouble_list_chat_to_you`**.
  - Next page is `page+1` while the last page returned data.
  - The list refetches when the tab regains focus (except the first time). The first load without cache dispatches `showMainLoading()` (`LoadingSlice`).
  - Pull-to-refresh runs `getMasterConfig()`, `refetch()` and `getBadgeSideBar()`.
- **Optimistic badge clear (`updateItem`):**
  - isToMe: sets `is_show_badge_to_you:false`.
  - `global.summaryTrouble`: sets `is_show_badge_store_in_summary:false`.
  - Otherwise, by role: `chain_manager_unread` (store admin), `chain_store_unread` (chain store) or `individual_unread` (individual store) is set to false.
  - Skipped for summary rows with more than one summary item.
- **Unused imports:** `navigate`, `ScreenTypes`, `useAppDispatch` (`appDispatch` is never used).

#### Inner tab: MentionList (`MentionList`), used for the `自分宛て` tab
- **File:** `features/chat/components/MentionList.tsx`.
- **Params:** `route.params.mentionClick`.
- **UI:**
  - `FilterListChat` toggles `filter` between `null` and `URGENT_FLAG`.
  - `FlatList` of `MentionListItem` (`features/chat/components/MentionListItem.tsx`). Each row shows the sender name and the message text.
  - Pull-to-refresh, infinite scroll and an empty state.
- **Data:**
  - `useMentionList({keySearch, filter})` in `features/chat/redux/hook/query/useMentionQuery.ts`:
    - `useInfiniteQuery` with key `['mentionList', keySearch, filter]`.
    - Pagination is cursor-based: `{trouble_id, message_id, sent_at}` of the last item while `results.has_more`.
    - Call chain: `chatRepo.getMentionList`, then `ChatRepo` delegates to `BEChatRepo.getMentionList`, which sends **GET `CHAT_API chat/conversations/mentions?search=&filter=&trouble_id=&message_id=&sent_at=`**.
  - For each row's `message_id`: `appDispatch(ensureMessagesFetched([[trouble_id, message_id]…]))`, an RTK thunk in `features/chat/redux/chatThunks.ts`. It calls `fetchMessageThunk`, then `chatRepo.getMessage`, then `FirebaseChatRepo.getMessage`. That reads **Firestore `{FIRESTORE_CONVERSATIONS_COLLECTION_NAME}/trouble-{troubleId}/messages/{messageId}`**. The result is stored in `chatReducer.messages`.
  - For sender IDs: `ensureParticipantsFetched(senderIds)` calls `fetchParticipantsInfoBatch`, then `BEChatRepo.getParticipantsInfo`, which sends **GET `CHAT_API chat/map-participants-info?participants=…`**. The result goes to `chatReducer.participants`.
  - Clicking a row optimistically sets `is_read:true` on every row with the same `trouble_id` (`updateItems`), then calls `mentionClick`.

#### Legacy / unused chat components in `screens/Chat/`
- **`ChatBoxComponent.tsx`** is **not imported anywhere** in `app/`, so it is dead code. Kept for reference:
  - It is a class component wired with `connect`, wrapped in `components/QueryWrapper`. QueryWrapper runs lazy `useQuery` for `['useUserTrouble', troubleId]` (GET `API troubles/{id}/get-users`) and `['useGroupTrouble']` (GET `API troubles/{id}/get-groups`).
  - **Messages:** loaded with `MessageRepository.GetChatMessages`, which sends POST `API troubles/c_chats_v2` (`{troubleId, page, numberItem:20}`).
  - **Send:** `chatAction.sendMessage` dispatches `CHAT_SEND_MESSAGE_REQUEST`, handled by `chatSaga.fetchSendMessage`.
    - It first sends POST `API troubles/generate_presigned_url` and PUTs video files to S3.
    - It then calls `SendMessage`, which is **not exported** by `MessageRepository.js`. The repository only exports `fetchSendMessage`, which sends a multipart POST to `API troubles/c_send_chat_v2`. So this saga path would fail at runtime (latent bug).
  - **Delete:** `chatAction.deleteChatMessage` dispatches `CHAT_DELETE_MESSAGE_REQUEST`, handled by `chatSaga.fetchDeleteChatMessage`, which sends POST `API troubles/c_delete_chat`.
  - **Tasks link:** `goToTasks` dispatches `updateParamGetListTask` (taskSlice) and then `navigatePush(ListTask, {troubleId})`.
  - **Modals:** `ModalImagePicker`, `MultipleSelect` (assignees), `ModalConfirmMessage` (delete) and `BaseModalOk` (errors).
  - **Attachment link:** opens `navigate(WebView, {uri})`.
- **`ChatItem.tsx`** contains only a TypeScript interface (`ChatItem`). It is not a component.

### Firebase chat bottom sheet (`FirebaseChatBottomSheet`), not a route
- **File:** `features/chat/components/ChatBottomSheet.tsx` (default export `FirebaseChatBottomSheet`).
- **Mounted in:**
  - `screens/TroubleDetail/TroubleDetailScreen.tsx` (~L959). It does not pass `initialChatMode`.
  - `screens/Work/WorkInprogressDetailScreen.tsx` (~L769). It passes `initialChatMode = route.params.initialChatMode`.
  - `screens/Estimation/EstimationDetailScreen.tsx` (~L1267). It is hidden when `fromHistory || estApproved`.
  - In all three, `showChatModeSwitch` is true when the trouble, or any item in its `summary_list`, has `has_legacy_chat`.
  - `summary_list` maps to `{id, number}`. If it is missing, the screen passes the single current trouble instead.
- **Props:** `troubleId`, `summary_list`, `firebaseChatEnabled` (accepted but unused), `initialChatMode` (`'active' | 'archive'`, default `'active'`) and `showChatModeSwitch`. The component renders `null` when there is no `troubleId`.
- **UI:**
  - A `@gorhom/bottom-sheet` with 3 snap points: collapsed header, mid, and full. When the keyboard opens, the sheet snaps to full.
  - The handle is `components/Chat/ChatHeader`: title "チャット", expand/collapse via `goTo`, and an optional mode switch between `active` (realtime Firebase) and `archive` (legacy). The switch shows unread dots from `hasRealtimeChatUnread` and `hasLegacyChatUnread`.
  - **Inner top tabs:** a material top tab navigator with custom `tabBar = ConvoTopTabBar` (scrollable, lazy). It renders only when the sheet index is above 0.
    - There is **one tab per `summary_list` item**. The route name is `TroubleChatConversationComponent-{id}`, the label is the trouble `number`, and the initial tab is the current `troubleId`.
    - Tab content depends on `chatMode`:
      - `active` renders `ChatConversationComponent` (`route.params = {troubleId, avoidKeyboardInsetPadding:false}`).
      - `archive` renders `OldChatConversationComponent` (`{troubleId}`).
- **Data:**
  - **Unread status:** `useUnreadChatStatus(troubleId)` (`hook/query/useUnreadChatStatus.ts`, key `['unreadChatStatus', troubleId]`). It calls `TroubleRepository.GetHasUnreadMessage`, which sends **GET `API troubles/{troubleId}/has-unread-message`** and returns `{realtime, legacy}`.
    - It is refetched when the sheet changes from a non-zero index.
    - Once the conversation loads, it is cleared locally with `setUnreadStatus({realtime:false})` or `({legacy:false})`.
  - **`ChatConversationComponent` (active, Firestore):**
    - **Reads:**
      - `chatRepo.upsertConversation`: a Firestore transaction on `{conversations}/trouble-{id}`.
      - Initial and older messages: `messageBaseQuery(troubleId).get()`, a Firestore query on `{conversations}/trouble-{id}/messages` ordered by `sentAt desc`.
      - Live updates: `onSnapshot` listeners for new messages and the viewport.
    - **Permission:** on Firestore `permission-denied`, it dispatches the thunk `requestConversationPermission`, which sends **POST `CHAT_API chat/permissions/conversation/request?trouble_id={id}`**. This is debounced to once per minute (`entities/permits.ts`).
    - **Mark read:** `markConversationAsRead` thunk sends **PUT `CHAT_API chat/troubles/{id}/mark-conversation-as-read?trouble_id={id}`**.
    - **Participants and mentions:** `ensureParticipantsFetched` (GET `map-participants-info`) and `ensureMentionInfoFetched` (**GET `CHAT_API chat/map-mentions-info?mention_groups=&mention_users=`**).
    - **Files:** `fileUrls` thunks call `chatRepo.retrieveFiles`, which sends **GET `CHAT_API chat/retrieve-files?file_paths=…`**.
    - **Delete:** `chatRepo.deleteMessage` sends **DELETE `CHAT_API chat/conversations/{troubleId}/messages/{messageId}`**. It is preceded by a `ModalConfirmMessage`. Errors show in `ModalOkMessage`.
    - **Footer (`ChatFooter.tsx`):**
      - **Uploads:** the `uploadFiles` thunk sends **POST `CHAT_API chat/generate_presigned_url`** (`{file_names}`), then PUTs each file to S3 with axios.
      - **Send:** the `sendMessage` thunk calls `ChatRepo.sendMessage` (default `enableBEInsertToFb=true`), which sends **POST `CHAT_API chat/troubles/{id}/send-message`** (`{content, files, message_fb_uid, mention_users, mention_groups}`). The backend writes the Firestore message. The send status is tracked in `chatSlice`.
      - **Mention/assignee picker:** `useAssignees(troubleId)` (GET `API troubles/{id}/get-users` and `/get-groups`) feeds a `MultipleSelect`.
      - **Images:** the image picker uses `ModalImageEdit`.
      - **Tasks button:** `navigate(ListTask, {troubleId})`.
  - **`OldChatConversationComponent` (archive, read-only):**
    - `useChatMessages({troubleId})` (`hook/query/useChatMessages.ts`, key `['useChatMessages', troubleId]`) calls `GetChatMessages`, which sends **POST `API troubles/c_chats_v2`** (`numberItem:50`). It pages until `currentPage < totalPage`.
    - Delete is an optimistic mutation that sends **POST `API troubles/c_delete_chat`**.
    - It renders `components/Chat/ChatList` with sending disabled.

---

## Notifications (admin announcements)

### NotifyList (`NotificationListScreen`), SC0037
- **File:** `screens/Notification/NotificationListScreen.tsx`.
- **Purpose:** a paginated list of store notifications (CMS announcements) with a "mark all as read" button.
- **Entry points:**
  - DrawerMenu (badge when `badgeSizeBar.notificationFlag`).
  - ManageBox `gotoScreen(NotifyList)`.
  - NotificationDropdown "to list".
- **Params:** none.
- **UI:**
  - `Header`: back button, `hideNotification` (the dropdown is suppressed here) and a refresh button.
  - `FlashList` of `NotificationItem` (`contentVisible=false`), with pull-to-refresh, infinite scroll, a footer spinner and an empty state (`sNotifyList.noData`).
  - "See all" `Button` (`sNotifyList.btnSeeAll`), shown when the list is not empty. It is disabled while the mutation is pending.
  - `TabBarBottom`.
- **Data (react-query, `hook/query/useNotificationQuery.ts`):**
  - **List:** `useNotificationList()`, key `['notifications']`. Calls `getNotificationList`, which sends **GET `API notifications/store_list?page=&numberItem=30`**. The next page exists while a page returns 30 items.
  - **Mark all read:** `useSeeAllNotifications()` sends **GET `API notifications/mark_read_all`**. On success it sets `isRead:true` in the cache and the screen refetches `['latestNews']`.
  - The first load dispatches `showMainLoading()`.
- **Modals:** `ModalConfirmMessage` (`sNotifyList.qSeeAll`). Yes runs the mark-all mutation.
- **Navigation:** tapping an item runs `navigate(NotifyDetail, {item})`.
- **Role gating:** none.

### NotifyDetail (`NotificationDetailScreen`), SC0038
- **File:** `screens/Notification/NotificationDetailScreen.tsx`.
- **Params:** `item` (`Notification`). The screen destructures `{id, isRead}`.
  - Push notification `ps40` (`constants/Common.tsx` ~L686) resets the stack to `[home, NotifyDetail{item:{id}}]`, so `isRead` is undefined there.
  - `NotificationListScreen` and `NotificationDropdown` pass the full item.
- **UI:**
  - `Header`: back button and `hideNotification`.
  - A spinner while loading, then `NotificationItem` with `contentVisible=true`.
  - `TabBarBottom`.
  - Note: `notificationDetail` defaults to `{}`, so the fallback `?? route.params.item` never applies.
- **Data:**
  - `useNotificationDetail({id})` (key `['notificationDetail', id]`) sends **GET `API notifications/{id}`**.
  - When `id && !isRead`, `useMarkNotificationRead().mutate({id})` sends **GET `API notifications/mark_read/{id}`** and updates `isRead` in the `['notifications']` cache.
  - On blur: `queryClient.refetchQueries(['latestNews'])`.
- **Modals and navigation:** none (back only).

### NotificationDropdown (`NotificationDropdown`), component, not a route
- **File:** `screens/Notification/NotificationDropdown.tsx`.
- **Where used:** only in `layout/Header.tsx` (L60). It renders when `useLatestNews` returns a non-empty newest notification and the screen did not pass `hideNotification`. So it appears on any screen that uses `Header`, except NotifyList and NotifyDetail.
- **Props:** `item` (newest `Notification`).
- **UI:**
  - A shadowed banner pinned to the top: the title and a chevron that toggles the expanded state.
  - Expanded view:
    - The public date and the content (3 lines).
    - "To detail" link, shown only when the content has at least 3 lines.
    - "Mark read" link (`sNotificationItem.markRead`).
    - "To list" link.
- **Data:** "Mark read" runs `useHideNotice().mutate({id})`, which sends **GET `API notifications/hide_notice/{id}`**. It then invalidates `['notifications']`, collapses the banner and refetches `['latestNews']`.
- **Navigation:** `navigate(NotifyDetail, {item})` and `navigate(NotifyList)`.

---

## Messages (legacy store messages)

### MessageList (`MessageListScreen`), SC0032
- **File:** `screens/Message/MessageListScreen.tsx` (class component, redux `connect`).
- **Purpose:** the legacy "messages" inbox, a separate system from the notifications above.
- **Entry points:**
  - Only `screens/ManageBox/ManageBoxScreen.js` (`gotoScreen(MessageList)`).
  - Not in DrawerMenu or TabBarBottom.
- **Params:** none.
- **UI:**
  - `Header`: back button and a refresh button (`onReloadData`).
  - `FlatList` of `MessageItem` (`components/List/MessageItem`, `contentVisible=false`), with pull-to-refresh and load-more on end reached.
  - Empty state `sMessageList.noData`.
  - `TabBarBottom`.
- **Redux-saga:**
  - **Load:** `notifyAction.getNotifyList({page})` dispatches `NOTIFY_LIST_REQUEST`, handled by `notifySaga.fetchNotifyList` (`takeLatest`).
    - It calls `NotifyRepository.GetNotifyList`, which sends **POST `API messages/list`** (`{page}`).
    - On success it dispatches `NOTIFY_LIST_RESPONSE` into `notifyListReducer`.
    - On failure it dispatches `NOTIFY_LIST_FAILED` and `alertAction.requestAlertErrorAction`.
  - **Item tap:** `notifyAction.notifyRead({messageId: item.id})` dispatches `NOTIFY_READ`, handled by `notifySaga.notifyRead`, which sends **POST `API messages/read`** (`{messageId}`). It then navigates.
  - **Pagination:** merged in `getDerivedStateFromProps`. It sets `isEndLoadmore` when an empty page comes back.
  - Caveat: in `handleLoadMore`, `setState({page+1})` is followed immediately by `onGetNotifyList()`, which reads the stale `this.state.page`. This is likely an off-by-one request.
  - Caveat: pull-to-refresh does not reset `page` to 1 (the reset is commented out).
- **Navigation:** `navigate(MessageDetail, {item})`.
- **Modals and role gating:** none.

### MessageDetail (`MessageDetailScreen`), SC0033
- **File:** `screens/Message/MessageDetail.tsx`.
- **Params:** `item` (`MessageItemType`), stored in state.
  - Push notification `ps36` (`constants/Common.tsx` ~L663) resets the stack to `[home, MessageDetail{item:{title, created, content}}]`, with values from `remoteMessage.data`.
- **UI:**
  - `Header`: title `sMessageList.title` and a back button.
  - `MessageItem` with `contentVisible=true`.
  - `TabBarBottom`.
- **Data:** none. It is display-only and makes no API call.
- **Navigation:** back only.

---

## Task Manager

### ListTask (`ListTaskScreen`)
- **File:** `screens/TaskManager/Tasks/index.tsx`. It is registered with default stack options, but each screen renders its own `Header`.
- **Purpose:** the task list, either global (my tasks) or scoped to one trouble. Supports filter, complete, edit and drill-in.
- **Entry points:**
  - DrawerMenu `gotoScreen(ListTask)` (no params).
  - TabBarBottom Task tab (`{hideBtnBack:true}`, after resetting taskSlice params).
  - `ChatFooter` "tasks" (`{troubleId}`).
  - Legacy `ChatBoxComponent` (`navigatePush`, `{troubleId}`).
- **Params:** `troubleId?: number` (typed in `RootStackParamsList`) and `hideBtnBack?` (untyped). When `hideBtnBack` is set, the back icon is hidden.
- **UI:**
  - `Header`:
    - Title: `task.slistTask.titleWithTrouble` with a trouble, otherwise `title`.
    - Right icon: **add-task** with a trouble (navigates to CreateTaskScreen), otherwise **filter** (opens `ModalFilter`).
  - Total count text (`totalTask`).
  - `FlatList` of `TaskItem`, with pull-to-refresh, infinite scroll and `EmptyData`.
  - `ModalFilter`, `BaseModalConfirm` (delete confirm) and `TabBarBottom isTaskList`.
- **`TaskItem`** (`components/TaskItem/index.tsx`):
  - **Content:** trouble number (when global), an auto-task label, title, description, store name (non-auto tasks), assignees ("name (role)"), and the due date.
  - **Buttons:** an edit icon and a "完了" (complete) button. They show only when the task is not completed and not an auto task. `hasPermission` is hard-coded to `true`.
  - **Tap:**
    - Auto tasks (`type == '02'`) navigate directly to `WorkContinueInprogress` or `WorkInprogress` (`{headerTitle: createdBy.name, troubleId}`). The tap is disabled when the task is completed.
    - Otherwise the tap calls `onPress`.
  - `onPressDelete` is accepted in props but **never rendered**, so there is no delete button and the delete-confirm modal is unreachable in practice.
- **Filters** (local `useState`; `taskSlice` is not used for the query):
  - Defaults with a troubleId: status `''` (all) and scope `''` (all).
  - Defaults without a troubleId: status `'01'` (未着手, not started) and scope `'02'` (あなたのタスク, your tasks).
  - Options are defined in `components/data/index.ts`:
    - Status: `''` 全て (all), `'01'` 未着手 (not started), `'02'` 完了 (completed).
    - Scope: `''` 全て (all), `'02'` あなたのタスク (your tasks), `'01'` 作成したタスク (tasks you created).
- **`ModalFilter`** (`components/ModalFilter/index.tsx`):
  - An RN `Modal` with two `Dropdown`s: 状況 (status) and タスク種類 (task type / scope).
  - "Dismiss" and "Reset all" (back to defaults `'01'`/`'02'`), plus Cancel and Decision buttons.
  - Decision calls `handleClose(status, scope)`, which runs `setFilters`.
  - It reads `state.task.params`, but that value is unused.
- **Data (react-query):**
  - **List:** `useTaskQuery({troubleId, status, taskScope})` (`hook/query/useTaskQuery.ts`, key `['useTaskQuery', troubleId, status, taskScope]`). It calls `TaskManagerRepository.getTasks`, which sends **GET `API tasks?numberItem=30&page=&troubleId=&status=&taskScope=`**. The next page exists while a page returns 30 items.
  - **Complete:** `useUpdateTask` calls `updateTask`, which sends **PUT `API tasks/{taskId}`** with body `{troubleId, title, description, dueDate (YYYY/MM/DD to DATE_LONG), status:'02', assignees[], groupAssignees[]}`. On success:
    - Silent `refetch()`.
    - `setBadgeCountApplicationIcon('decrement')`.
    - Dispatches `{type: SET_BADGE_SIDE_BAR, payload: {...badgeSizeBar, countTaskNotDone: n-1}}`.
  - **Delete:** `useRemoveTask` calls `removeTask`, which sends **DELETE `API tasks/{taskId}`**, then `refetch()`. The path is unreachable from the UI, as noted above.
  - **Focus and refresh:** refetch `['latestNews']` and `getBadgeSideBar()`. Pull-to-refresh also runs `refetch()`.
  - **Drill-in (`onNavigate`):** for `status === '01'` (NEW), it calls `CandidacyRepository.GetCandidacyList({troubleId})`, which sends **POST `API candidacies/list`**.
- **Navigation targets:**
  - Edit: `navigate(CreateTaskScreen, {troubleId: item.troubleId, taskInfo: item})`.
  - Add (trouble-scoped only): `navigate(CreateTaskScreen, {troubleId})`.
  - Item tap: the target screen is chosen from the task:
    - `troubleStatus === done` → `TroubleDetail`.
    - Else `isContinuation` → `WorkContinueInprogress`.
    - Otherwise → `WorkInprogress`.
    - Params: `{headerTitle: storeName, troubleId, goBackToPrevious?}`.
    - Exception: for a NEW task with candidacies where `automatching_flag !== 1`, it runs `navigatePush(WorkerSelection, {...params, screenType: RequestList, goBackToPrevious:true})` instead.
- **Role gating:** none in code beyond the server-side `taskScope`. `userInfo` (from `AsyncStoreApp.getUser()`) is passed to `TaskItem` but is not used for gating.

### CreateTaskScreen (`CreateTaskScreen`)
- **File:** `screens/TaskManager/CreateTask/index.tsx`.
- **Purpose:** create a task for a trouble, edit an existing one, or show it read-only.
- **Params** (from `RootStackParamsList`):
  - `troubleId?: number`.
  - `taskInfo?: Task` (edit mode).
  - `isDisable?: boolean` (view-only). No caller in `app/` passes `isDisable`.
- **UI:**
  - `Header`:
    - Title: `sCreateTask.title` (view), `titleEdit` (edit) or `titleCreate` (create).
    - Right "保存" (save, `sCreateTask.keep`) button. It is disabled until the form is dirty and hidden in view mode.
  - Form (react-hook-form with a yup schema):
    - `title`: `InputForm`, required, max 50 characters (`isEmptySubject` error).
    - `description`: `InputTextArea`, max 500 characters.
    - `assignees`: `MultipleSelect`, required, min 1 (`isEmptyAssignees` error), with search. Users show as "name ( role )" and groups by name. Groups that are no longer in the trouble's group list appear as `disable:true`.
    - `dueDate`: `InputDate`, date only, stored as `YYYY年MM月DD日`-style `DATE_LONG_JP`.
  - `TabBarBottom`.
- **Data (react-query):**
  - **Assignee sources:**
    - `useUserTrouble(troubleId)` (key `['useUserTrouble']`, **no troubleId in the key**, so the cache can be shared across troubles) sends **GET `API troubles/{troubleId}/get-users`**.
    - `useGroupTrouble(troubleId)` (key `['useGroupTrouble']`) sends **GET `API troubles/{troubleId}/get-groups`**.
  - **Submit:** splits the selected IDs into `assignees` (items with a role) and `groupAssignees` (items without one). Then:
    - Edit: `useUpdateTask` sends **PUT `API tasks/{taskInfo.id}`**.
    - Create: `useCreateTask` sends **POST `API tasks`**.
    - Body: `{troubleId, title, description, dueDate (DATE_LONG), status: taskInfo.status || '01', assignees, groupAssignees}`.
  - **On success:** invalidates `['useTaskQuery']` and shows the success modal.
- **Modals:**
  - `BaseModalOk`: success (`createSuccess`). OK runs `navigateGoBack()`.
  - `BaseModalOk`: error message. OK replays any pending navigation action and invalidates `['useTaskQuery']`.
  - `ModalConfirmMessage`: discard changes (`component.modal.common.discardChanges`). It is triggered by a `beforeRemove` listener when the form is dirty. Yes dispatches the pending action.
- **Navigation:** back only (`navigateGoBack` or the replayed `beforeRemove` action).
- **Role gating:** none client-side.

---

## Navigation note: `navigation/CustomNavigation.js`
- This is a custom bottom-tab `tabBar` renderer. It takes `{state, navigation, descriptors}`, maps `state.routes` to home/paper/setting PNG icons, and on press emits `tabPress` and then calls `navigation.navigate`.
- **It is not used anywhere.** A search of `QnaviShop/` (excluding node_modules, ios and android) finds no importer. It appears only in `docs/rn-0.73.0-to-0.77.0-library-usage-scope.md`.
- The app uses a single Stack, the `DrawerLayout` side menu and the per-screen `components/TabBar/TabBarBottom.tsx` component.


