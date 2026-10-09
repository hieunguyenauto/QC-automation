# qnavi-repair-app — Screen Catalog

Source root: `/Users/protar/Desktop/work/qnavi/qnavi-repair-app/QnaviRepair/app` (paths below are relative to it).
Audience: repair workers (作業者/業者). UI language: Japanese (i18n `assets/locales/ja/strings.json`, keys in `assets/locales/StringNames.js`).
Method: GitNexus `query`/`context` (it returned no repair-app execution flows for navigation; `StackNavigator` resolves to `navigation/StackNavigator.tsx:143`), then the navigators and every screen file were read directly.

---

## 0. Navigation architecture

| Layer | File | Notes |
|---|---|---|
| App root | `App.tsx` | SafeAreaProvider > KeyboardProvider > AutocompleteDropdownContextProvider > **react-query** QueryClientProvider > I18nextProvider > Redux Provider > `ContainerNavigation`. Sets up Amplify (Cognito), FCM (permission request, token, `onMessage` toast, `onNotificationOpenedApp`, `getInitialNotification`), AppState handler (on resume: `getLatestNews`, `getMasterConfigAction`, `TopScreenActions.fetchTopScreenData`, Firebase re-auth). |
| Container | `navigation/ContainerNavigation.tsx` | `NavigationContainer` with `navigationRef`; tracks current route name; global **error modal** `BaseModalOk` driven by `alertReducer` (hidden for MAINTENANCE / BAD_GATEWAY). On `UPGRADE_REQUIRED` it opens the store link and exits the app (`react-native-exit-app`). Global `MainLoading` overlay. |
| **Root stack (the only live navigator)** | `navigation/StackNavigator.tsx` | `createStackNavigator<RootStackParamsList>`, `initialRouteName = Login`, `headerShown:false` on all (each screen draws its own `layout/Header.tsx`). Android: no animation, solid bg; iOS: horizontal slide. **Conditional root**: if `alertReducer.params.statusCode === MAINTENANCE` → only `Maintenance`; if `BAD_GATEWAY` → only `ServiceUnavailable`; otherwise the 33 regular screens. |
| Route names | `navigation/ScreenTypes.js` | String constants with SRS screen IDs (WC00xx) in comments. |
| Imperative nav | `navigation/RootNavigation.ts` | `navigate`, `navigateWithDelay`, `navigatePush` (StackActions.push), `navigateToHome` (reset to `TopScreen`), `navigateAndResetStack`, `navigateGoBack`, `getActiveRouteName`. |
| Side drawer (not a navigator) | `layout/DrawerMenu.js` rendered inside `react-native-gesture-handler` `DrawerLayout` in TopScreen / NewRequestList / PendingList / UnsentEstimate (+ ListWorkToday passes a ref) | See §2.2. |
| Bottom "tab" bar (not a navigator) | `components/TabBar/TabBarBottom.tsx` | Fake tab bar of buttons: 管理BOX → reset to `TopScreen`; 新規 → push `NewRequestListScreen`; 立候補中 → `PendingListScreen`; 再読み込み → screen's `onReload`; 受注一覧 → `OrderList`. Used on list/message/notification/history screens. |
| Work-flow bar (not a navigator) | `components/TabBar/TabBarWorkFlow.tsx` | 管理BOX → reset `TopScreen`; left (default マニュアル → `WebView` with `https://qnavi.club/manual/manual_gyousya.pdf`); center (default 再読み込み); right (default 案件詳細). Used on work-flow / estimate / photo / report screens; each screen overrides handlers. |
| Nested navigator (in chat sheet) | `features/chat/components/ChatBottomSheet.tsx` | `@gorhom/bottom-sheet` containing a **material-top-tabs** `Tab.Navigator` (tab bar hidden) with one screen per trouble: route name `TroubleChatConversationComponent-<troubleId>`, rendering `ChatConversationComponent` (Firebase realtime chat) or `OldChatConversationComponent` (legacy chat) based on chat-mode switch. |
| **Dead code** | `navigation/DrawerNavigation.js`, `navigation/BottomNavigation.js`, `navigation/CustomNavigation.js`, `screens/HomeScreen.js`, `screens/SettingScreen.js` | Template leftovers (Drawer → BottomTabs `Home`/`Settings`). Not imported by `StackNavigator`/`ContainerNavigation`; unreachable. |

### Async layer reality check
Despite the "Redux-Saga for all async" convention, the app mixes three mechanisms:
- **Redux-Saga** (`sagas/rootSagas.js`): login, alert, accountEdit, orderList, workInProgressFlow, workReportCreation, common (master config, footer count, side-bar badge, app-version check), logout, unsentEstimate, unsentReport, topScreen, listWorkToday, asset.
- **RTK `createAsyncThunk`** (in `slices/*`): NewRequestList, PendingList, NewRequestDetail (detail/chat/candidacy/schedule), Estimations, PreWorkPhotoShoot, WorkReport, MessageList, Notification, ChatList, HistoryList; chat feature thunks (`features/chat/redux/*Thunks.ts`).
- **TanStack react-query** (`hook/query/*`): tasks (list/create/update/remove), assignees/users-by-trouble, groups, asset create, chat messages/unread status.

### API base
`api/ApiList.js`: `DOMAIN_API = Config.API_URL + '/api/mobile/'`, `DOMAIN_API2 = .../api/mobile/v2/`. Chat service: `features/chat/repo/ChatApiList.ts` → `Config.BE_CHAT_API_URL + '/v2/chat/...'`. PWA: `Config.PWA_URL`. CMS pages: `Config.CMS_FE_URL`.

### Global permissions (declared)
- Android `AndroidManifest.xml`: CAMERA, POST_NOTIFICATIONS, READ_EXTERNAL_STORAGE, WRITE_EXTERNAL_STORAGE, ACCESS_MEDIA_LOCATION, DOWNLOAD_WITHOUT_NOTIFICATION, INTERNET.
- iOS `Info.plist`: NSCameraUsageDescription, NSPhotoLibraryUsageDescription, NSMicrophoneUsageDescription (placeholder text), NSAppleMusicUsageDescription, NSLocationWhenInUseUsageDescription (**empty string**).
- Runtime requests: push (iOS `messaging().requestPermission()`, Android `POST_NOTIFICATIONS`) in `App.tsx`; camera / photo library through `react-native-permissions` in `utils/permissionsImagePicker.ts` and `constants/Common.tsx`; save-to-gallery via `@react-native-camera-roll/camera-roll` + `react-native-blob-util` in `utils/permissionAndSaveImg.js` (long-press/download on `ImageBorder isDownLoadImage`, WebView image download).

### Push-notification deep links (`constants/Common.tsx` `navigateFromNotification`)
All reset the stack to `[TopScreen, <target>]`:
| notiId | Target |
|---|---|
| ps36 | `MessageDetail` {item:{title, created, content}} |
| ps25 | `NewRequestDetailLostOrDeletedScreen` {candidacyId} |
| ps40 | `NotificationDetail` {item:{id}} (foreground ps40 just refreshes `getLatestNews`) |
| ps07, ps18, ps28 | `RequestDetailScreen` {troubleId} (after `POST troubles/w_detail` succeeds) |
| ps23 (chat) | `RequestDetailScreen` {troubleId, scrollToChat:true}; foreground ps23 is suppressed if that trouble's chat tab is open |
| ps06, ps13, ps14, ps21, ps22, ps26, ps44, ps45 | `WorkInProgressFlow` {troubleId} |

Cold-start notifications are stashed in `global.remoteMessage` and consumed by `TopScreen`.

---

## 1. Auth & system screens

### 1.1 Login — WC0001
- **Stack**: Root stack, initial route. **Route**: `Login`. **Component**: `LoginScreen` (connected) — `screens/Login/LoginScreen.tsx`.
- **Purpose**: Worker sign-in, auto-login, app version gate, Terms-of-Service acceptance.
- **Params**: none.
- **UI**: background image, logo, `Config.APP_NAME` title, `InputLogin` username (ログインID) + password (パスワード) with yup required validation, ログイン `Button`, "forgot password" link (hidden on JT-VT10 devices), `ModalToS` (WebView of `CMS_FE_URL/term-of-service`, 同意/不同意).
- **Actions / flows**:
  - On mount: `CHECK_APP_VERSION_REQUEST` (saga `commonSaga.fetchCheckAppVersion` → `POST auth/check_app_version`); success callback runs auto-login: reads `AsyncStoreApp.getUser()`, if policy accepted, probes `GET workers/w_home` (401 → clear user + `firebaseAuthSignOut`), then `GET_CURRENT_SESSION_FOR_FIREBASE_LOGIN`, `LOGIN_RESPONSE`, `navigateToHome()`.
  - Login button: `LOGIN_REQUEST` → `loginSaga.fetchLogin` → `POST auth/signin`, then `POST v2/auth/config` (master config), stores user; if `is_accept_policy != true` → `SHOW_POLICY` (opens ModalToS) else `SIGN_IN_COGNITO` (Amplify `signIn`) → `GET_CURRENT_SESSION_FOR_FIREBASE_LOGIN` (Cognito session / `POST auth/refresh_token` fallback → Firebase custom-token login) and `navigateToHome()`.
  - ToS agree: `POLICY_ACCEPTED` → `POST auth/policy/accept` → `navigateToHome()`. Disagree: clear stored user, `POLICY_DENIED`.
  - Errors: `alertAction.requestAlertErrorAction` → global modal. Also exists (Cognito-first path, not wired from this screen): `fetchAutValidateViaCognito` → `POST /api/auth/validate`, `POST auth/info`.
- **Permissions**: none on screen (push permission requested app-wide at launch).
- **Navigation targets**: `TopScreen` (reset); external `https://www.globar.co.jp/contact/qnavi-ask/`.
- Note: `__DEV__` pre-fills test credentials (`<dev-worker-account>` / `<password>` (đã che)) — dev builds only, but worth knowing.

### 1.2 Maintenance (conditional root)
- **Route**: `Maintenance` (only screen in stack when last API error had `statusCode === MAINTENANCE`). **Component**: `screens/Maintenance/Maintenance.tsx`.
- **UI**: full-screen WebView `CMS_FE_URL/maintenance-worker`; any other URL opens externally (`Linking.openURL`).
- No params, no API, no permissions.

### 1.3 ServiceUnavailable (conditional root)
- **Route**: `ServiceUnavailable` (when `statusCode === BAD_GATEWAY`). **Component**: `screens/ServiceUnvailable/ServiceUnvailable.tsx`.
- **UI**: WebView of a CMS "service unavailable" page; external links open in browser.

### 1.4 Global modals (not routes)
- **Error/Force-update modal** `components/Modal/BaseModalOk.tsx` in `ContainerNavigation` (alertReducer). UPGRADE_REQUIRED → "更新" button → store URL + exit app.
- **Logout confirm / complete** (`ModalConfirmMessage` / `ModalOkMessage`) in `DrawerMenu`.
- **ToS** `components/ToS/ModalToS.tsx` (Login).
- **Notification dropdown** `screens/Notification/NotificationDropdown.tsx` rendered by every `Header`: shows newest notice (`notificationReducer.newestNotification`), actions: open → `NotificationDetail`; hide → `hideNotice` (`GET notifications/hide_notice/{id}`); see all → `NotificationList`.
- **MainLoading** overlay (`components/Loading/MainLoading`, `slices/LoadingSlice`).

---

## 2. Home (管理BOX) & menu

### 2.1 TopScreen — WC0028 (管理BOX / home)
- **Route**: `TopScreen` (`navigateToHome()` resets here). **Component**: `screens/TopScreen/TopScreen.tsx`.
- **Params**: none.
- **UI**: `DrawerLayout` (left, `DrawerMenu`), `Header` (worker name, hamburger), caption, 2-column grid of 8 animated `ButtonBig` tiles with counts, pull-to-refresh.
- **Tiles → targets**:
  | Tile (ja) | Count field | Target |
  |---|---|---|
  | 本日の作業 | count_today | `ListWorkToday` (WC0029) |
  | 新規作業依頼 | count_new | `NewRequestListScreen` (WC0003) |
  | 立候補中の依頼 | count_candidacy | `PendingListScreen` (WC0005) |
  | 受注一覧 | count_selected | `OrderList` (WC0008) |
  | 未提出の見積書 | count_not_estimation | `UnsentEstimateList` (WC0030) |
  | 未提出の報告書 | count_not_report | `UnsentReportListScreen` (WC0031) |
  | 未読チャットを確認 (badge) | count_chat_unread | `ChatList` (WC0020) |
  | 未読メッセージを確認 (badge) | count_message_unread | `MessageList` (WC0021) |
- **Flows on focus**: `TopScreenActions.fetchTopScreenData` (saga `topScreenSaga` → `GET workers/w_home`), `GET_BADGE_SIDE_BAR_REQUEST` (`GET workers/w_get_side_bar`), `MASTER_CONFIG_REQUEST` (`POST auth/config`). On mount: FCM `getToken`, consume `global.remoteMessage` deep link, `getLatestNews` (`GET notifications/worker_newest`).
- **Permissions**: none directly (FCM token read).

### 2.2 DrawerMenu (side menu component) — WC0002
- **File**: `layout/DrawerMenu.js`. Opened from Header hamburger (also dispatches `getBadgeSideBar`).
- **Items → targets**:
  | Item (ja) | Target |
  |---|---|
  | アカウント情報 | `AccountEdit` |
  | タスク管理 | `ListTask` (after resetting task filter params to all) |
  | お知らせ一覧 (badge `notificationFlag`) | `NotificationList` |
  | 依頼対応済履歴 | `TroubleHistory` |
  | プライバシーポリシー | `WebView` {uri:`https://www.globar.co.jp/privacypolicy/`} |
  | 利用規約 | `WebView` {uri:`CMS_FE_URL/term-of-service`, leftIcon:'back'} |
  | マニュアル | `WebView` {uri:`https://qnavi.club/manual/manual_gyousya.pdf`} |
  | 運営会社 | `WebView` {uri:`https://www.globar.co.jp/company/`} |
  | ログアウト | confirm modal → `LOGOUT_REQUEST` (saga → `POST auth/signout`, Cognito signOut, clear WebView session) + clear 8 slices → OK modal → `Login` |
- Shows app version and "自動マッチングON" badge if `worker.automatchingFlag`.

---

## 3. Request lists (bottom-bar screens)

All use `Header`, `InputSearch` (free-word filter, client-side `filter` + server `search`), `FlatList` with pull-to-refresh and infinite paging, and `TabBarBottom`.

### 3.1 NewRequestListScreen — WC0003 (新規作業依頼一覧)
- **Route**: `NewRequestListScreen`. **Component**: `screens/NewRequestList/NewRequestListScreen.tsx`; row `NewRequestItem.tsx` (tags: suspension-of-business, resubmission status).
- **Params**: none. Includes DrawerLayout.
- **Flows**: `fetchTroubles` thunk (`slices/NewRequestListSlice.ts`) → `POST troubles/w_news` {page, workerId, search}; `GET_COUNT_FOOTER_REQUEST` (`GET workers/w_count_footer`) on page change & focus; UPGRADE_REQUIRED → alert.
- **Navigation**: row → `RequestDetailScreen` {troubleId}.

### 3.2 PendingListScreen — WC0005 (立候補中作業依頼一覧)
- **Route**: `PendingListScreen`. **Component**: `screens/PendingList/PendingListScreen.tsx`; row `PendingItem.tsx`.
- **Flows**: `fetchTroublesCandidacies` thunk → `POST troubles/w_candidacies` {page, workerId, search}.
- **Navigation**: row with `result == '01'` → `NewRequestDetailAfter30minScreen` {candidacyId}; otherwise → `NewRequestDetailLostOrDeletedScreen` {candidacyId}.

### 3.3 OrderList — WC0008 (受注作業依頼一覧)
- **Route**: `OrderList`. **Component**: `screens/OrderList/OrderListScreen.js` (class, extends `BaseMainScreen`, connected); row `components/List/RequestWorkItem`.
- **Params (untyped)**: `needRefresh?` triggers reload.
- **Flows**: saga `SELECTED_TROUBLE_REQUEST` (`orderListSaga`) → `POST troubles/w_selected` {id: workerId, page, search}; `getCountFooter`.
- **Navigation**: row → `WorkInProgressFlow` {troubleId}.

### 3.4 ListWorkToday — WC0029 (本日の作業)
- **Route**: `ListWorkToday`. **Component**: `screens/TodayWorkList/ListWorkTodayScreen.tsx`.
- **Params (untyped)**: `needRefresh?`.
- **UI**: header title = selected date (MM/DD), calendar icon opens `CalendarDateModal` to pick a date; search; list.
- **Flows**: `ListWorkTodayActions.fetchTroubles` → saga `listWorkTodaySaga` → `POST workers/w_work_list_today`.
- **Navigation**: row → `WorkInProgressFlow` {troubleId}.

### 3.5 UnsentEstimateList — WC0030 (見積書未提出一覧)
- **Route**: `UnsentEstimateList`. **Component**: `screens/UnsentEstimate/UnsentEstimateScreen.tsx` (DrawerLayout).
- **Flows**: `UnsentEstimateActions.fetchUnsentEstimates` → saga → `POST workers/w_unsent_estimation_list`.
- **Navigation**: row → `WorkInProgressFlow` {troubleId}.

### 3.6 UnsentReportListScreen — WC0031 (報告書未提出一覧)
- **Route**: `UnsentReportListScreen`. **Component**: `screens/UnsentReport/UnsentReportScreen.tsx`.
- **Flows**: `UnsentReportActions.fetchUnsentReport` → saga → `POST workers/w_unsent_report_list`.
- **Navigation**: row → `WorkReportCreation` {troubleId, scrollToChat:false (not in param type)}.

### 3.7 ChatList — WC0020 (チャット一覧)
- **Route**: `ChatList`. **Component**: `screens/ChatList/ChatList.tsx`; row `components/List/TroubleSelectedItem`.
- **Flows**: `fetchTroublesChatList` thunk → `POST troubles/m_trouble_list_chat`; `changeWorkerUnread` (local).
- **Navigation**: row → `RequestDetailScreen` {troubleId, scrollToChat:true}.

### 3.8 TroubleHistory — WC0023 (依頼対応済履歴)
- **Route**: `TroubleHistory`. **Component**: `screens/History/HistoryListScreen.tsx`; row `components/List/RequestItem`.
- **Flows**: `getTroubleHistories` thunk → `POST troubles/w_histories` {workerId, page, search}.
- **Navigation**: row → `RequestDetailScreen` {troubleId} (from there a skipped report can still be submitted).

---

## 4. Request detail family

### 4.1 RequestDetailScreen — WC0004 / WC0010A / WC0010B / WC0019 (作業依頼詳細)
- **Route**: `RequestDetailScreen`. **Component**: `screens/NewRequestDetail/RequestDetailScreen.tsx` (connected). A router screen that renders one of four sub-views based on the trouble:
  | Condition | Sub-view (file) | Title |
  |---|---|---|
  | `is_continuation` | WC0019 `ContinueWorkDetailScreen.tsx` | 継続作業依頼詳細 |
  | `status === 1` (新規) | WC0004 `NewRequestDetailScreen.tsx` | 作業依頼詳細 |
  | `status === 2` (対応中) | WC0010A `InProgressRequestDetailScreen.tsx` | 作業依頼詳細 |
  | `status === 3` (完了) | WC0010B `CloseWorkRequestDetailScreen.tsx` | 作業済依頼詳細 |
  | other | pops the screen |
- **Params**: `troubleId: number`, `scrollToChat: boolean`, `isFromContinueWorkInProgress?: boolean`.
- **Common flows**: on focus `fetchTroubleDetail` thunk → `POST troubles/w_detail`; `resetState` on blur.
- **Common UI**: `Header` (back), `Location` (store name + address; tap → Google Maps `google.navigation:q=` on Android / Apple Maps `maps://` on iOS), `TagState`, `Breadcrumb` (category L/M/S), photos grid (`ImageBorder`, tap → `WebView` image preview, long-press/download to gallery), description `InputTextArea`, **`FirebaseChatBottomSheet`** (enabled per sub-view: always for WC0019/WC0010B, read-only for WC0004, WC0010A only once new_flow ≥ waiting) with legacy/realtime mode switch.
- **Chat sheet (features/chat)**: messages via Firestore (`services/firestore.ts`) + BE chat API: `POST v2/chat/troubles/{id}/send-message`, `.../mark-conversation-as-read`, `GET chat/permissions/conversation/request`, `chat/map-participants-info`, `chat/map-mentions-info`, `chat/generate_presigned_url` + S3 PUT, `chat/retrieve-files`, `DELETE chat/conversations/{troubleId}/messages/{messageId}`; legacy chat: `POST troubles/c_chats_v2`, `troubles/c_send_chat_v2`, `troubles/c_delete_chat`; unread: `GET troubles/{id}/has-unread-message`. Footer actions: pick image (camera/library, `react-native-image-picker`), pick PDF (`react-native-document-picker`), tasks button → `ListTask` {troubleId}, mention assignees (`GET troubles/{id}/get-users`, `get-groups`), send.
- **Permissions**: camera + photo library (chat attachments), photo library write (save image), none for maps (external app).

#### 4.1a WC0004 — New request (status 1)
- Sections: location, tags, breadcrumb, photos, description, `SelectDate` (choose visit date + time window), comment.
- Button: この作業依頼に立候補する → confirm `BaseModalConfirm` → `createCandidacy` thunk → `POST candidacies/create` → success `BaseModalOk` (依頼の立候補が完了しました) → goBack. Leave-guard on `beforeRemove` if dirty.

#### 4.1b WC0010A — In progress (status 2)
- Sections: previous/next trouble links (`navigatePush RequestDetailScreen` {troubleId: previous/next_trouble_id}), `ButtonBoxWrapeer` / `ButtonBoxWrapeerHasQuotation` (number, staff, dates, **phone call** buttons `tel:` store/staff), quotation link.
- Quotation link: if `isNewEstimationFlow` → `PWA_Webview` {uri:`trouble/{id}/estimate`}; else after arrival → `ApprovedEstimations` {troubleId}, before → `EstimateList` {troubleId}.
- Button: work report → `WorkReport` {troubleDetail}.

#### 4.1c WC0010B — Closed (status 3)
- Same layout as 4.1b. Report button: if `report.status == '02'` → `WorkReport` {troubleDetail}; else → `WorkReportCreation` {troubleId, isFromCloseWorkRequest:true}.

#### 4.1d WC0019 — Continuation work detail
- Sections: prev/next links, quotation link (PWA / ApprovedEstimations / EstimateList), 作業報告書を確認する → `WorkReport` {troubleDetail}, **schedule proposal** list (`addSchedule`/`removeSchedule` multiple `SelectDate` rows).
- Submit → confirm → `submitSchedule` thunk → `POST troubles/schedule` → OK modal → pop.

### 4.2 NewRequestDetailAfter30minScreen — WC0006 (立候補中の詳細)
- **Route**: `NewRequestDetailAfter30minScreen`. **Component**: `screens/NewRequestDetail/NewRequestDetailAfter30minScreen.tsx`.
- **Params**: `candidacyId: string`.
- **Flows**: `fetchCandidacyDetail` → `POST candidacies/w_detail` (then `fetchTroubleChat` → `POST troubles/c_chats_v2`).
- **UI**: header, location (maps), tags, breadcrumb, photos (→ `WebView` preview), description, proposed date (`SelectDate`), `FirebaseChatBottomSheet`.
- **Button**: 立候補をキャンセルする (`ButtonOutline`) → confirm → `deleteCandidacy` → `POST candidacies/delete` → OK → goBack.

### 4.3 NewRequestDetailLostOrDeletedScreen — WC0007 (失注/削除)
- **Route**: `NewRequestDetailLostOrDeletedScreen` (also deep link ps25). **Component**: `screens/NewRequestDetail/NewRequestDetailLostOrDeletedScreen.tsx`.
- **Params**: `candidacyId: string`.
- **Flows**: `fetchCandidacyDetail` (`POST candidacies/w_detail`).
- **Button**: 失注した作業依頼情報を削除する → confirm → `deleteCandidacy` (`POST candidacies/delete`) → 立候補を削除しました → pop. No chat sheet.

---

## 5. Work-in-progress flow

### 5.1 WorkInProgressFlow — WC0009 / WC0018 (作業依頼対応状況 / 継続作業依頼対応状況)
- **Route**: `WorkInProgressFlow`. **Component**: `screens/WorkInProgressFlow/WorkInProgressFlowScreen.tsx` (class extends `BaseMainScreen`, connected). Renders `WorkInProgressScreen.tsx` (WC0009) or `ContinueWorkInProgressScreen.tsx` (WC0018, when `is_continuation`).
- **Params**: `troubleId: number` (also `needRefresh` via deep links/other screens).
- **Flows (saga `workInProgressFlowSaga`)**: on focus `TROUBLE_DETAIL_REQUEST` → `POST troubles/w_detail`; step buttons each behind a `BaseModalConfirm`:
  | Step (ja) | Action | Endpoint |
  |---|---|---|
  | 受注 (accept) | `ACCEPT_REQUEST` | `POST troubles/accept` |
  | 出発 (departure) | `DEPARTURE_REQUEST` | `POST troubles/departure` |
  | 到着・現場確認 (arrival) | `ARRIVED_REQUEST` | `POST troubles/arrived` |
  | 見積提示 (submit estimate) | navigation | `PWA_Webview` {uri:`trouble/{id}/estimate`} if `isNewEstimationFlow`, else `EstimateList` {troubleId} |
  | 見積承認待ち / 見積書承認済 | display / link | `ApprovedEstimations` {troubleId} or PWA |
  | 作業前に写真を撮影してください (pre-work photo) | navigation | `PreWorkPhotoShoot` {troubleId} |
  | 作業完了 (done) | `DONE_TROUBLE_REQUEST` | `POST troubles/done` |
  | 作業報告書作成 | navigation | `WorkReportCreation` {troubleId} |
  | 決済待ち | display only | — |
  Continuation flow adds 日程調整 / 訪問日時承認待ち / 訪問日時確定 states, linking to `RequestDetailScreen` (schedule).
- **UI**: `Location` (maps), prev/next trouble `TextLink`s, `ButtonBoxWrapeer(HasQuotation)` (phone `tel:`), `FlowGroup` step list, floating `IconChat` → `RequestDetailScreen` {troubleId, scrollToChat:true}, estimate `DocIcon` → PWA, modals for reject/closed (→ `navigateAndResetStack(NewRequestListScreen)`), `TabBarWorkFlow` (center reload, right 案件詳細 → `RequestDetailScreen`).
- **Permissions**: none directly.

### 5.2 PreWorkPhotoShoot — WC0017 (作業前写真撮影)
- **Route**: `PreWorkPhotoShoot`. **Component**: `screens/PreWorkPhotoShoot/PreWorkPhotoShoot.tsx`.
- **Params**: `troubleId: number`.
- **Flows**: `fetchTroublesDetail` thunk (`slices/PreWorkPhotoShootSlice`) → `POST troubles/w_detail`; images uploaded via presigned URL (`POST troubles/generate_presigned_url` + S3 PUT, `components/Image/SelectImage`); submit → `postSavePreWork` → `POST troubles/prework` {troubleId, newBeforeImages[{path, description, order_number}]}.
- **UI**: header, `Location` (maps), `SelectImage` draggable grid with per-photo description, Submit `Button` → `ModalConfirmMessage` → submit; leave-guard confirm if dirty; `TabBarWorkFlow`.
- **Permissions**: **camera + photo library** (`react-native-image-picker`, `react-native-permissions`).
- **Navigation**: success → goBack (and effect navigates `WorkInProgressFlow` {troubleId}).

---

## 6. Estimation (legacy flow; new flow uses PWA)

### 6.1 EstimateList — WC0011–WC0014 (見積書一覧)
- **Route**: `EstimateList`. **Component**: `screens/Estimation/EstimationList.tsx`.
- **Params**: `troubleId: string`, `needRefresh?: boolean`.
- **Flows (thunks in `slices/EstimationsSlice.ts`)**: `fetchEstimationConfig` → `POST troubles/estimation_config`; `fetchEstimations` → `POST troubles/list_estimations`; `fetchTroublesDetail` → `POST troubles/w_detail`; `deleteEstimation` → `POST troubles/delete_estimation`; `submitListEstimations` → `POST troubles/submit_list_estimations`.
- **UI**: `EstimateItem` list (select checkbox via `toggleEstimationSelection`), buttons: new estimate (opens `EstimateCreationModal` title input), copy selected estimate (modal), submit selected (confirm), delete; OK modals; pull-to-refresh; custom back that strips estimation routes from stack; `TabBarWorkFlow` (left → `OrderList`, center reload, right → `RequestDetailScreen`).
- **Navigation**: row → `EstimateDetail` {estimationId, index}; create/copy → `EstimateCreateEdit` {action:'create', estimationTitle, estimation, troubleId}; submit success → `WorkInProgressFlow` {troubleId}.

### 6.2 EstimateCreateEdit — WC0012 (見積書作成/編集)
- **Route**: `EstimateCreateEdit`. **Component**: `screens/Estimation/EstimationCreateEdit.tsx` (+ `WorkItem.tsx`, `WorkItemEst.tsx`).
- **Params**: `action: 'create'|'edit'`, `estimation: Estimation`, `troubleId: number`, `estimationTitle?`, `index?`.
- **UI**: `KeyboardAwareScrollView`, work-item list (add via `AmountInputModal` — item, qty, unit price, tax), `MoneyCard` totals, notice `InputTextArea`, save button, discard-changes confirm, OK/confirm modals, `TabBarWorkFlow`.
- **Flows**: local reducers `createEstimationStart`/`editEstimationStart`/`addWork`/`saveCreate`/`saveEdit`/`discardChanges`; `fetchTroublesDetail`; `troubleSubmitEstimation` → `POST troubles/submit_estimation` then `fetchEstimations`.
- **Navigation**: success → `EstimateList` {troubleId}; cancel → pop; tab bar → `RequestDetailScreen` / `OrderList`.

### 6.3 EstimateDetail — WC0015 (見積書詳細)
- **Route**: `EstimateDetail`. **Component**: `screens/Estimation/EstimationDetail.tsx`.
- **Params**: `estimationId: string`, `index?`.
- **Flows**: `fetchEstimationDetail` → `POST troubles/detail_estimation`.
- **UI**: `GlobalInfo` header block, line items, `MoneyCard` subtotal/tax/total, status (`EstimationStatus`), edit `Button` (when editable), `TabBarWorkFlow`.
- **Navigation**: edit → `EstimateCreateEdit` {action:'edit', estimation, index, troubleId}; detail tab → `RequestDetailScreen`.

### 6.4 ApprovedEstimations — WC0016 (承認済み見積書一覧)
- **Route**: `ApprovedEstimations`. **Component**: `screens/Estimation/ApprovedEstimations.tsx`.
- **Params**: `troubleId: number`.
- **Flows**: `fetchTroublesDetail`; `fetchWEstimations` → `POST troubles/w_list_estimations`.
- **UI**: `ButtonBoxWrapeer` (phone), estimate cards with `MoneyCard`, `TabBarWorkFlow`.
- **Navigation**: card → `EstimateDetail` {estimationId}; tab → `RequestDetailScreen`.

### 6.5 PWA_Webview (new estimation flow)
- **Route**: `PWA_Webview`. **Component**: `screens/WebView/PWA_Webview.tsx`.
- **Params**: `uri: string` (relative path, e.g. `trouble/{id}/estimate`; full URL = `Config.PWA_URL/uri`).
- **Behavior**: fetches Cognito session (Amplify `fetchAuthSession` / token orchestrator), sets `access_token` / `refresh_token` cookies in the native cookie store (`@react-native-cookies`) + `injectedJavaScriptBeforeContentLoaded`, optional basic-auth/Authorization header from PWA config; retries once on `TOKEN_EXPIRED` after refresh.
- **Bridge messages from PWA**: `CLOSE_WEBVIEW` (goBack), `DOWNLOAD_PDF` (save base64 PDF), `SHARE_PDF` (share sheet), `TOKEN_EXPIRED`.
- **Permissions**: storage write for PDF download (Android).
- Security note for `auth-security-reviewer`: Cognito access + refresh tokens are written into WebView cookies/JS.

---

## 7. Work report

### 7.1 WorkReportCreation — WC0026 (作業報告書作成)
- **Route**: `WorkReportCreation`. **Component**: `screens/WorkReportCreation/WorkReportCreationScreen.tsx` (class, connected) + form `WorkReportForm.tsx` + `ResponseTypeDropdown.tsx`.
- **Params**: `troubleId: number`, `isFromCloseWorkRequest?: boolean` (callers also pass untyped `scrollToChat`).
- **Form fields** (react-hook-form + yup): 作業開始日時 / 作業終了日時 (`InputDate`, start<end), 確認できた症状 (symptom), 原因と発生起因 (reason), 作業内容 (content; response-type dropdown), 特記事項 (notice), 継続作業有り/無し (`RadioButton` isContinue), 作業前写真 / 作業後写真 (`SelectImage`, after-photos required), report type; header box shows 依頼No., 店舗名, 発行年月日, 施工業者, 施工担当者; if `trouble.assetFlag` → 修理対象資産選択 button + selected-asset chips (remove).
- **Buttons**: 作業報告書を提出する (submit), 提出をスキップする (skip; note: can be submitted later from 依頼対応済履歴).
- **Flows (saga `workReportCreationSaga`)**: `getTroubleDetail` → `POST troubles/w_detail`; `SAVE_REPORT_REQUEST` → `POST troubles/save_report_v2` (images via `troubles/generate_presigned_url` + S3; deletions via `troubles/delete_attachment`); `CONTINUE_TROUBLE_REQUEST` → `POST troubles/continue`; `AssetScreenDataScreenActions.setAssetListSelect`.
- **Modals**: 作業報告書を提出しました / スキップしました / 継続作業フローへ移ります / error CMSG00006 / discard-changes guard.
- **Navigation**: asset select → `ListAssetSelection` {storeName, troubleId, chainStoreId}; success → pop + push `WorkInProgressFlow` {troubleId} (or continuation flow); location → maps; detail tab → `RequestDetailScreen`.
- **Permissions**: camera + photo library.

### 7.2 ListAssetSelection (修理対象資産選択)
- **Route**: `ListAssetSelection`. **Component**: `screens/WorkReportCreation/ListAssetSelectionScreen.tsx`.
- **Params**: typed `{troubleId, storeName, asset}` but actually called with `{storeName, troubleId, chainStoreId}`.
- **Flows (saga `assetSaga`)**: `getAssetListRequest` / `getAssetListRefreshRequest` / `getAssetListMoreRequest` → `GET asset/chain-store/{chainStoreId}` (paged, `PAGE_SIZE`); auto-selects a newly created asset.
- **UI**: caption `{storeName}の資産一覧`, multi-select asset rows, `ButtonBigAsset` "add asset", pull-to-refresh, 決定 button (`setAssetListSelect` → goBack).
- **Navigation**: add → `AssetCreateScreen` {storeName, chainStoreId}; save → goBack.

### 7.3 AssetCreateScreen (資産登録)
- **Route**: `AssetCreateScreen` — **missing from `RootStackParamsList`** (registered in stack only). **Component**: `screens/WorkReportCreation/AssetCreateScreen.tsx`.
- **Params (untyped)**: `storeName`, `chainStoreId`.
- **Fields**: asset images (`ImagePicker`), 名称 (assetName, required), メーカー (manufacturer autocomplete → `GET asset/suggestion-manufacturer?keyword=` debounced), 型番 (model), 製造番号 (serialNumber), 設置/納品日 (`CalendarDateTimeModal`, yyyy/MM/DD), 製造年月 (`CalendarMonthYearModal`, yyyy/MM), 補足情報.
- **Flows**: `uploadAssetImages` (`POST asset/generate_presigned_url` + S3), `useCreateAsset` (react-query) → `POST asset`; `setNewlyCreatedAssetId`; Main loading overlay.
- **Button**: 入力情報を保存する → goBack.
- **Permissions**: camera + photo library.
- Note: header title literal typo `'作業報告害作成'` (should be 作業報告書作成).

### 7.4 WorkReport — WC0027 (作業報告書 view)
- **Route**: `WorkReport`. **Component**: `screens/WorkReport/WorkReport.tsx`.
- **Params**: `troubleDetail: TroubleDetail`.
- **Flows**: `fetchReport` thunk → `POST troubles/report`.
- **UI**: header = store name, `InformationCard`, read-only fields (dates, symptom, reason, content, notice), selected assets, before (type 2) / after (type 3) photo grids (`SelectImage isOnlyView`), `ButtonBoxWrapeer` (phone, estimate link).
- **Navigation**: estimate link → `PWA_Webview` {uri:`trouble/{id}/estimate`} or `ApprovedEstimations` {troubleId}.

---

## 8. Messages & notifications

### 8.1 MessageList — WC0021 (メッセージ一覧)
- **Route**: `MessageList`. **Component**: `screens/Message/MessageListScreen.tsx`; row `components/List/MessageItem`.
- **Flows**: `getMessages` thunk → `POST messages/list` {page}.
- **Navigation**: row → `MessageDetail` {item}.

### 8.2 MessageDetail — WC0022 (メッセージ詳細)
- **Route**: `MessageDetail` (also deep link ps36). **Component**: `screens/Message/MessageDetailScreen.tsx`.
- **Params**: `item: MessageItemType`.
- **Flows**: `readMessage` → `POST messages/read` {messageId}.
- **UI**: header, `MessageItem` full content, `TabBarBottom`.

### 8.3 NotificationList — WC0032 (お知らせ一覧)
- **Route**: `NotificationList`. **Component**: `screens/Notification/NotificationListScreen.tsx`; row `components/List/NotificationItem`.
- **Flows**: `workerList` → `GET notifications/worker_list` {page, limit}; `markRead` → `GET notifications/mark_read/{id}`; "mark all read" button → `ModalConfirmMessage` → `seeAll` → `GET notifications/mark_read_all`.
- **Navigation**: row → `NotificationDetail` {item}.

### 8.4 NotificationDetail — WC0033 (お知らせ詳細)
- **Route**: `NotificationDetail` (deep link ps40). **Component**: `screens/Notification/NotificationDetailScreen.tsx`.
- **Params**: `item: Notification` (deep link passes only `{id}`).
- **Flows**: `getNotificationDetail` → `GET notifications/{id}`; `markRead`; on blur `getLatestNews` (`GET notifications/worker_newest`).

---

## 9. Account

### 9.1 AccountEdit — WC0024 (アカウント情報)
- **Route**: `AccountEdit`. **Component**: `screens/AccountEdit/AccountEditScreen.js` (class extends `BaseMainScreen`, connected) + `AccountForm.js`.
- **Params**: none (drawer passes the route-name string).
- **Form** (作業者情報): 会社名・屋号 (name), 担当者 (staff), 電話番号 (phone, 10–12 digits), メールアドレス (email), 郵便番号 (zipcode), 都道府県 (prefecture `Dropdown`), 住所1/住所2; (作業可能項目、プロフィール): 対応可能都道府県 (`MultipleSelect` workablePrefectureList), 対応可能作業項目 大項目/小項目 (`MultipleSelect`), プロフィール (`InputTextArea`), logo/profile image (`ImagePick` camera/library).
- **Buttons**: 入力情報を保存する (confirm AMSG00040 → save), Qナビを解約する (`ButtonOutline` → confirm → deactivate).
- **Flows (saga `accountEditSaga`)**: `ACCOUNT_INFO_REQUEST` → `POST workers/w_get`; `ACCOUNT_EDIT_REQUEST` → `POST workers/w_update` (multipart); `ACCOUNT_DEACTIVE_REQUEST` → `POST workers/deactive`; `getMasterConfig` → `POST auth/config`.
- **Modals**: save success → `navigateToHome()`; cancel success → logout to Login; discard-changes guard.
- **Permissions**: camera + photo library.

---

## 10. Task management

### 10.1 ListTask (タスク一覧)
- **Route**: `ListTask`. **Component**: `screens/TaskManager/Tasks/index.tsx`; `components/TaskItem`, `components/ModalFilter`.
- **Params**: `troubleId?: number` (from chat footer → task list for that trouble; from drawer → all tasks).
- **Flows (react-query + `slices/taskSlice`)**: `useTaskQuery` → `GET tasks` {troubleId, numberItem, page, status, taskScope}; `useUpdateTask` → `PUT tasks/{id}` (mark complete); `useRemoveTask` → `DELETE tasks/{id}` (confirm modal).
- **UI**: header (title differs with/without trouble), filter icon → `ModalFilter` (status: 全て/未着手/完了; scope: 全て/あなたのタスク/作成したタスク), task rows (edit, complete), `EmptyData`, pull-to-refresh/infinite, FAB "create" (only when `troubleId`).
- **Navigation**: create → `CreateTaskScreen` {troubleId}; row → `CreateTaskScreen` {troubleId, taskInfo, isDisable}; edit → `CreateTaskScreen` {troubleId, taskInfo}.

### 10.2 CreateTaskScreen (タスク詳細 / 作成 / 編集)
- **Route**: `CreateTaskScreen`. **Component**: `screens/TaskManager/CreateTask/index.tsx`.
- **Params**: `troubleId?`, `taskInfo?: Task`, `isDisable?: boolean` (view-only).
- **Fields**: title (`InputForm`, required), description (`InputTextArea`), due date (`InputDate`), assignees (`MultipleSelect`, required; source `useUserTrouble` → `GET troubles/{id}/get-users`).
- **Flows**: `useCreateTask` → `POST tasks`; `useUpdateTask` → `PUT tasks/{id}`; refresh list via `useTasks().onLoadTasks`.
- **Modals**: success `BaseModalOk`, discard-changes `ModalConfirmMessage` (beforeRemove guard).
- **Navigation**: save → goBack.

---

## 11. Utility web screens

### 11.1 WebView
- **Route**: `WebView`. **Component**: `screens/WebView/WebViewScreen.tsx`.
- **Params**: `uri: string`, `leftIcon?: 'back'`, `isDownLoadImage?: boolean` (default true).
- **Behavior**: image URL / base64 → image viewer with download icon (`downloadAndSave` → camera roll); PDF → `react-native-pdf`; other → WebView; ToS mode (`leftIcon:'back'`) shows header 利用規約. Close button → goBack.
- **Callers**: drawer links, manual (TabBarWorkFlow), photo preview from detail screens.
- **Permissions**: photo library write / storage for image download.

### 11.2 ManualScreen (マニュアル)
- **Route**: `ManualScreen`. **Component**: `screens/Manual/ManualScreen.tsx` — WebView of `Common.viewerUri(pdf)`.
- **Params**: none. **No navigation caller found**: the drawer and TabBarWorkFlow open the manual through `WebView` instead (the drawer's `'Manual'` switch case is never called). Looks like dead code.

---

## 12. Summary table

| # | Route name | Component file | SRS ID | Entry from |
|---|---|---|---|---|
| 1 | Login | screens/Login/LoginScreen.tsx | WC0001 | initial / logout |
| 2 | TopScreen | screens/TopScreen/TopScreen.tsx | WC0028 | login, 管理BOX tab, deep-link base |
| 3 | NewRequestListScreen | screens/NewRequestList/NewRequestListScreen.tsx | WC0003 | Top tile, 新規 tab |
| 4 | RequestDetailScreen (4 variants) | screens/NewRequestDetail/RequestDetailScreen.tsx | WC0004/0010A/0010B/0019 | lists, chat, push |
| 5 | NewRequestDetailAfter30minScreen | screens/NewRequestDetail/NewRequestDetailAfter30minScreen.tsx | WC0006 | PendingList |
| 6 | NewRequestDetailLostOrDeletedScreen | screens/NewRequestDetail/NewRequestDetailLostOrDeletedScreen.tsx | WC0007 | PendingList, push ps25 |
| 7 | PendingListScreen | screens/PendingList/PendingListScreen.tsx | WC0005 | Top tile, 立候補中 tab |
| 8 | OrderList | screens/OrderList/OrderListScreen.js | WC0008 | Top tile, 受注一覧 tab |
| 9 | ListWorkToday | screens/TodayWorkList/ListWorkTodayScreen.tsx | WC0029 | Top tile |
| 10 | UnsentEstimateList | screens/UnsentEstimate/UnsentEstimateScreen.tsx | WC0030 | Top tile |
| 11 | UnsentReportListScreen | screens/UnsentReport/UnsentReportScreen.tsx | WC0031 | Top tile |
| 12 | ChatList | screens/ChatList/ChatList.tsx | WC0020 | Top tile |
| 13 | MessageList | screens/Message/MessageListScreen.tsx | WC0021 | Top tile |
| 14 | MessageDetail | screens/Message/MessageDetailScreen.tsx | WC0022 | MessageList, push ps36 |
| 15 | NotificationList | screens/Notification/NotificationListScreen.tsx | WC0032 | drawer, dropdown |
| 16 | NotificationDetail | screens/Notification/NotificationDetailScreen.tsx | WC0033 | list, dropdown, push ps40 |
| 17 | TroubleHistory | screens/History/HistoryListScreen.tsx | WC0023 | drawer |
| 18 | AccountEdit | screens/AccountEdit/AccountEditScreen.js | WC0024 | drawer |
| 19 | WorkInProgressFlow (2 variants) | screens/WorkInProgressFlow/WorkInProgressFlowScreen.tsx | WC0009/WC0018 | OrderList, today, unsent estimate, push |
| 20 | PreWorkPhotoShoot | screens/PreWorkPhotoShoot/PreWorkPhotoShoot.tsx | WC0017 | WIP flow |
| 21 | EstimateList | screens/Estimation/EstimationList.tsx | WC0011–14 | WIP flow, detail |
| 22 | EstimateCreateEdit | screens/Estimation/EstimationCreateEdit.tsx | WC0012 | EstimateList, EstimateDetail |
| 23 | EstimateDetail | screens/Estimation/EstimationDetail.tsx | WC0015 | EstimateList, Approved |
| 24 | ApprovedEstimations | screens/Estimation/ApprovedEstimations.tsx | WC0016 | detail, WIP, report |
| 25 | PWA_Webview | screens/WebView/PWA_Webview.tsx | (new estimate flow) | WIP, detail, report |
| 26 | WorkReportCreation | screens/WorkReportCreation/WorkReportCreationScreen.tsx | WC0026 | WIP, closed detail, unsent report |
| 27 | ListAssetSelection | screens/WorkReportCreation/ListAssetSelectionScreen.tsx | — | WorkReportForm |
| 28 | AssetCreateScreen | screens/WorkReportCreation/AssetCreateScreen.tsx | — | ListAssetSelection |
| 29 | WorkReport | screens/WorkReport/WorkReport.tsx | WC0027 | detail screens |
| 30 | ListTask | screens/TaskManager/Tasks/index.tsx | — | drawer, chat footer |
| 31 | CreateTaskScreen | screens/TaskManager/CreateTask/index.tsx | — | ListTask |
| 32 | WebView | screens/WebView/WebViewScreen.tsx | — | drawer, previews, manual |
| 33 | ManualScreen | screens/Manual/ManualScreen.tsx | — | (no caller found) |
| 34 | Maintenance | screens/Maintenance/Maintenance.tsx | — | conditional root |
| 35 | ServiceUnavailable | screens/ServiceUnvailable/ServiceUnvailable.tsx | — | conditional root |
| + | TroubleChatConversationComponent-{id} | features/chat/components/ChatBottomSheet.tsx (material top tabs) | — | nested in RequestDetail / After30min |

## 13. Findings worth flagging
1. `AssetCreateScreen` is registered in the stack but missing from `RootStackParamsList` (its params are untyped).
2. `ListAssetSelection` param type `{troubleId, storeName, asset}` does not match the call site `{storeName, troubleId, chainStoreId}`.
3. Untyped params in use: `needRefresh` (OrderList, ListWorkToday, UnsentEstimate, UnsentReport, ChatList, History), `scrollToChat` passed to `WorkReportCreation`.
4. `RequestDetailScreen.scrollToChat` is typed as required, but most callers leave it out.
5. Dead navigators/screens: `DrawerNavigation`, `BottomNavigation`, `CustomNavigation`, `HomeScreen`, `SettingScreen`; `ManualScreen` has no caller.
6. The stack `options.title` values are unused because `headerShown:false`. Some are wrong copies: WebView/WorkReport/ListAssetSelection/AssetCreate use the sWorkReportCreation title, and ListWorkToday uses the LostOrDeleted title.
7. Typo in the AssetCreate header: `作業報告害作成`.
8. Async is split across saga, RTK thunks and react-query. This does not match the "saga for all async" rule.
9. iOS `NSLocationWhenInUseUsageDescription` is an empty string and `NSMicrophoneUsageDescription` is placeholder text. Both could cause App Store review problems if those APIs are ever triggered.
10. `PWA_Webview` puts Cognito access and refresh tokens into WebView cookies. Send this to `auth-security-reviewer`.
11. `LoginScreen` pre-fills test credentials in `__DEV__`.
