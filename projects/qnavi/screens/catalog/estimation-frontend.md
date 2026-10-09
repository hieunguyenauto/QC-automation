# qnavi-estimation-frontend: Screen Catalog

Source: `/Users/protar/Desktop/work/qnavi/qnavi-estimation-frontend` (Next.js 15 App Router, `src/app`, plus Vite web components).
Method: GitNexus `query` (it pointed to `src/constants/routes.constants.ts` `Routes.*`). Then every `page.tsx` / `layout.tsx` / `route.ts` and the components they render were read to confirm. Nothing was edited.

All paths below are relative to `qnavi-estimation-frontend/src/`.

---

## 0. Global conventions

### Locale routing
- `src/i18n/routing.ts`: locales `["en","ja"]`, `defaultLocale: "ja"`, **`localePrefix: "never"`**. Public URLs carry **no** `/ja` or `/en` prefix, even though every page lives under `app/[locale]/`. The locale is stored in a cookie. `components/language-switcher.tsx` sets it.
- Messages: `messages/{ja,en}/{auth,chat,common,estimate,stores,trouble}.json`.

### API clients (`api/clients/index.ts`)
| Client | Base URL env | Used for |
|---|---|---|
| `estimationApi` | `NEXT_PUBLIC_ESTIMATION_URL` | qnavi-estimation-backend (FastAPI): estimations CRUD, status transitions, calculate, download |
| `beApi` | `NEXT_PUBLIC_API_URL` | Core/CMS backend: auth, troubles, users/permission, settings, estcategories, payments, chat search |
| `firebaseApi` | `NEXT_PUBLIC_FIREBASE_API_URL` | Firebase chat backend: token exchange, send message, presigned URLs, participants |
| `localApi` | `/api` | Next.js route handlers |

### Middleware (`src/middleware.ts` → `lib/auth-middleware.ts#withAuth`, then `next-intl` middleware)
- Matcher: every path except `/api`, `/trpc`, `/_next`, `/_vercel`, and paths that contain a dot.
- Auth means "the `ACCESS_TOKEN` cookie exists". The middleware does not validate the token.
- **Non-dev** (`NEXT_PUBLIC_APP_ENV !== "dev"`):
  - `/unauthorized`: with a token, redirect to `/`. Without one, render the page.
  - Any other path without a token: redirect to **`/unauthorized`**. The login page is not reachable in staging or prod. Users must arrive with cookies already set by the native app or SSO.
  - Guest-only paths with a token: redirect to `/`.
- **Dev**:
  - Guest-only paths (`/auth/login`, `/auth/forgot-password`, `/auth/reset-password`, `/reset-password`, `/auth/callback`, `/auth/cognito/callback`) redirect to `/` when a token exists.
  - Every other path redirects to `/auth/login?redirect=<path>` when no token exists.

### Role model (client-side, `hooks/use-permissions.ts`, `constants/roles.constants.ts`)
Role codes: `01` STORE_ADMIN, `02` STORE_GENBA, `03` INDIVIDUAL, `04` WORKER, `05` WORKER_COMPANY, `98` SUB_ADMIN, `99` SYSTEM_ADMIN.
- Screens branch mostly on `isAnyStoreRole()` ("store" vs "worker/admin"). Fine-grained buttons come from the per-estimate `user_permissions.is_allow_*` flags returned by the estimation backend, plus `/users/permission` (`isAllowPayment`, `isAllowApproveEstimate`) and `/troubles/{id}/estimates/condition-display` (`hasStatusApproval`, `isAllowApproveEstimate`).
- `RoutePermissions` in `routes.constants.ts` is an empty `{}`. No route-level role guard is wired up. `components/auth/route-guard.tsx` and `permission-guard.tsx` exist, but only the unused `estimate-action-bar.tsx` imports `PermissionGuard`.
- The root layout's inline script adds a `role-store` CSS class when `localStorage['is-store-role'] === 'true'`.

### React Native WebView integration
- `components/webview-route-guard.tsx` wraps all locale pages. Inside an RN WebView (`window.ReactNativeWebView`), only these paths are allowed: `/auth/*` and `^/trouble/\d+/estimate(/.*)?$`. Any other `/trouble/{id}/...` path is replaced with `/trouble/{id}/estimate`. Everything else shows a "blocked" screen with a button that posts `CLOSE_WEBVIEW`.
- `components/webview-auth-guard.tsx` (in the auth layout): inside a WebView it renders nothing and posts `{type:"TOKEN_EXPIRED"}` to the native app.
- `components/mobile-header.tsx`: the back button and the `RN_BACK` event post `CLOSE_WEBVIEW` on "start" pages. Those are paths ending `/estimate` or `/login`, or URLs containing `review=true` or `payment=true`. Otherwise it calls `router.back()`.
- Other postMessage types used by screens: `GO_TO_HOME`, `GO_TO_LIST_APPROVAL`, `PAYMENT_COMPLETED_ACTION` (actions `GO_TO_HISTORY`, `GO_TO_TOP`, `GO_TO_NEXT_TROUBLE`).

---

## 1. Layouts

| Layout | File | Wraps | Content |
|---|---|---|---|
| Root | `app/layout.tsx` | everything | `<html lang>`, PWA manifest and icons, `AppLoader`, `ThemeProvider` (light default), `Toaster` (sonner), inline script for `loading` and `role-store` classes |
| Locale | `app/[locale]/layout.tsx` | `[locale]/**` | Validates the locale (`notFound()` otherwise). Wraps pages in `QueryProvider` (TanStack Query) → `NextIntlClientProvider` → `AuthProvider` → `WebViewRouteGuard` |
| CMS shell (route group `(cms)`) | `app/[locale]/(cms)/layout.tsx` | trouble, estimate, chat, fcm-test | `PageTitleProvider`. `SidebarProvider` with `AppSidebar` (xl+ only). Fixed desktop header with `SidebarTrigger` and `HeaderActions` (LanguageSwitcher, ThemeSwitcher). `MobileHeader` below xl |
| Auth | `app/[locale]/auth/layout.tsx` | `/auth/**` | Centered card container wrapped in `WebViewAuthGuard` |
| Chat | `app/[locale]/(cms)/chat/layout.tsx` | `/chat`, `/chat/[chatId]` | Two panes: `ConversationList` (w-80 sidebar on md+), and children. On mobile, the list shows when no `chatId` is selected |

**Sidebar navigation** (`components/app-sidebar.tsx`, `nav-main.tsx`):
- トラブル一覧 → `/trouble`
- チャット → `/chat`
- Footer `NavUser` shows the user name and email, and has Logout (Amplify `signOut`, then `/auth/login`).

---

## 2. Screens by feature

Screen count: **17 routable UI pages** (S01-S17: 16 under `[locale]`, plus the legacy `/reset-password` redirect), **1 global overlay screen** (S18 WebView-blocked), **3 route handlers**, and **1 embeddable web component** (W01).

### 2.1 Home

#### S01 Home / launcher
- **URL:** `/`
- **File:** `app/[locale]/page.tsx` (server component, outside the `(cms)` shell, so no sidebar)
- **Purpose:** A developer-style landing page with two cards.
- **Guard:** Middleware requires a token.
- **UI:** Title "Qnavi Estimation". Card "Trouble list" with button "Go to trouble list". Card "FCM Test" with button "FCM Test Page". Strings are hard-coded English.
- **API:** none
- **Navigates to:** `/trouble`, `/fcm-test`

### 2.2 Authentication (guest-only, route folder `auth/`)

#### S02 Login
- **URL:** `/auth/login?redirect=<path>&error=<code>`
- **File:** `app/[locale]/auth/login/page.tsx` → `components/auth/login-form.tsx`
- **Purpose:** Sign in with a username and password (Cognito via Amplify), or with Microsoft SSO through the Cognito Hosted UI.
- **Guard:** Guest-only. Reachable only when `NEXT_PUBLIC_APP_ENV=dev`. In other environments a request without a token goes to `/unauthorized`, and a request with a token goes to `/`. Inside a WebView it renders nothing and posts `TOKEN_EXPIRED`.
- **UI:** A react-hook-form + zod form with `username` and `password` fields (show/hide toggle). Link "Forgot password". Submit "Sign in". Then a divider and a "Sign in with Microsoft" button. A general error alert reads `?error` codes from the Cognito callback.
- **Actions and API:**
  - Submit: `localStorage.clear()`, then `services/auth.ts#login`, which calls Amplify `signIn`. On some Cognito errors it falls back to `POST beApi /auth/validate {loginId,...}` and retries. Tokens are stored in cookies (`utils/auth-cookies.utils`). User info comes from `GET beApi /auth/info` (`stores/auth-store.ts`). Then it pushes to `redirect` (default `/`).
  - Microsoft: `useUnifiedAuth().signInWithCognito(provider)` redirects to Cognito. The `redirect` value is saved in `sessionStorage.auth_redirect`.
- **Navigates to:** `/auth/forgot-password`, the redirect target, Cognito Hosted UI

#### S03 Forgot password
- **URL:** `/auth/forgot-password`
- **File:** `app/[locale]/auth/forgot-password/page.tsx` → `components/auth/forgot-password-form.tsx`
- **Purpose:** Request a reset-password email.
- **Guard:** Guest-only. Dev only in practice, same as login.
- **UI:** Form fields: store name (optional), phone (required, `tel`), email (required). Button "Send reset link". Success and error alerts. Link "Back to login".
- **API:** `POST beApi /auth/reset-password`
- **Navigates to:** `/auth/login`

#### S04 Reset password
- **URL:** `/auth/reset-password?token=<token>`
- **File:** `app/[locale]/auth/reset-password/page.tsx` (server component) → `components/auth/reset-password-form.tsx`
- **Purpose:** Set a new password from an emailed token.
- **Guard:** Guest-only. The token is validated on the server before render.
- **UI:**
  - Error states: `TOKEN_MISSING`, `TOKEN_INVALID`, expired. Each shows an error card with "Back to login".
  - Form fields: loginId (prefilled from the token lookup), new password, confirm password (both with show/hide).
  - Success state with an automatic redirect after 3 s.
- **API:**
  - SSR: `POST beApi /auth/find-reset-password {token}` returns `loginId`.
  - Submit: `services/auth.ts` reset call (Amplify confirm reset using `username: loginId`).
- **Navigates to:** `/auth/login`

#### S05 Legacy reset-password redirect
- **URL:** `/reset-password?token=...`
- **File:** `app/reset-password/page.tsx`. It sits **outside** `[locale]`, so it gets no providers.
- **Purpose:** Backward-compatible link. It does a client-side `router.replace` to `/auth/reset-password`, keeping all query params.
- **UI:** A "Redirecting..." spinner.
- **Guard:** Guest-only (`RESET_PASSWORD_OLD`).

#### S06 Auth callback (generic)
- **URL:** `/auth/callback`
- **File:** `app/[locale]/auth/callback/page.tsx`
- **Purpose:** Placeholder spinner ("checking..."). The redirect logic is commented out, so the page does nothing beyond showing the spinner.
- **Guard:** Guest-only.
- **API:** none (only reads `useUnifiedAuth().user`)

#### S07 Cognito / Microsoft OAuth callback
- **URL:** `/auth/cognito/callback?code=...` (or `?error=&error_description=`)
- **File:** `app/[locale]/auth/cognito/callback/page.tsx`
- **Purpose:** Completes Microsoft SSO through the Amplify Cognito Hosted UI.
- **Guard:** Guest-only.
- **UI states:**
  - checking / processing: spinner and a Microsoft badge.
  - success: green check, the Microsoft account's name and email, "redirecting to dashboard".
  - error: red X, the message, "redirecting to login".
- **Flow:**
  1. Calls `cognitoAuthService.getCurrentUser()` and then `getAuthSession()`.
  2. `setAuthTokens(accessToken, idToken)` stores the tokens in cookies.
  3. `authStore.fetchUserInfo()` calls `GET beApi /auth/info`.
  4. After 2 s it redirects to `sessionStorage.auth_redirect` (or `/`).
- **On error:** redirects to `/auth/login?error=cognito_callback_failed | no_cognito_jwt_tokens | no_cognito_user | callback_processing_failed`.

#### S08 Unauthorized
- **URL:** `/unauthorized`
- **File:** `app/[locale]/unauthorized/page.tsx` → `components/auth/unauthorized-page.tsx`
- **Purpose:** The landing page for requests without a token in non-dev environments. Title: アクセス権限がありません.
- **Guard:** In non-dev, a request that has a token is redirected to `/`.
- **UI:** Card with an alert icon, the message, and "contact admin". Button "Go home" (`/`). A "Go admin" button (`/dashboard`) shows only when `isSystemAdmin()`. **`/dashboard` has no page, so that link would 404.**
- **API:** none

### 2.3 Trouble (案件)

#### S09 Trouble list (トラブル一覧)
- **URL:** `/trouble`
- **File:** `app/[locale]/(cms)/trouble/page.tsx` → `components/trouble/trouble-list.tsx`
- **Purpose:** Lists recent troubles (projects) as the entry point to their estimates.
- **Guard:** Token required. No role guard. Inside a WebView it is blocked, because it does not match `/trouble/\d+/estimate`.
- **UI:** `PageHeader` (トラブル一覧) above a vertical list of `TroubleCard`s. Each card shows the ID, a status chip, a "Locked" chip when `isLock`, the category path (large / medium / small, in JP), the symptom, the company name, and the created date. There are loading, error, and empty (`FileSearch` icon) states.
- **API:** `GET beApi /troubles?numberItem=20` (`services/trouble.service.ts#getTroubleList`)
- **Navigates to:** clicking a card opens `/trouble/{troubleId}/estimate`

### 2.4 Estimation (見積書). This is the core feature, and these routes are WebView-allowed.

Shared data on these screens:
- `GET beApi /troubles/{troubleId}` (trouble detail)
- `GET beApi /settings/config` (cancel fees)
- `GET beApi /troubles/{troubleId}/estimates/condition-display`
- `GET beApi /users/permission`
- `GET estimationApi /troubles/{troubleId}/estimations?limit=50&offset=0` (list grouped by trouble)
- `GET estimationApi /troubles/{troubleId}/estimations/{estimateId}` (detail, items, revisions, `user_permissions`)

#### S10 Estimate list (見積書一覧)
- **URL:** `/trouble/[troubleId]/estimate`
  - Query `?mode=summary` gives the multi-trouble summary of approved estimates (initial plus continuation troubles).
  - Query `?payment=true` adds payment mode on top of summary mode.
- **File:** `app/[locale]/(cms)/trouble/[troubleId]/estimate/page.tsx` → `components/estimate/estimate-list.tsx`
- **Purpose:** All estimates for a trouble. Workers create, submit, edit, copy, and delete them. Stores review them and can cancel the trouble.
- **Guard:**
  - Token required.
  - **Store roles** (`isAnyStoreRole`): no checkboxes, no create or submit. Cards are disabled when `!condition-display.isAllowApproveEstimate`.
  - **Worker / admin roles:** selection checkboxes appear on DRAFT and CANCELLED cards where `user_permissions.is_allow_submit` is true.
  - The create button shows only when the trouble flow allows it: for a new trouble, `newFLowStatus>=2 && status>=2`; for a continuation, `continuationFlowStatus>=10 && status>=2`.
- **UI sections:**
  - `PageHeader` (見積書一覧) with a refresh button (xl). On mobile, a pull-to-refresh title comes from `useMobileTitle`.
  - **Empty state** (`estimate-list-empty.tsx`) with a "見積書を作成する" button (non-store, flow-allowed).
  - **Orange notice** for stores: "waiting for approval by others" (industry approval, `waitingType=canNotConfirm`, has submitted estimates).
  - **Summary mode:**
    - A summary accordion that embeds `EstimateDetail` for each approved estimate. Download and share of the combined summary is enabled on the last one.
    - One accordion per trouble group (初回見積 / 継続見積 / 継続見積N), each embedding `EstimateDetail`. In payment mode those embeds include the review form.
  - **Estimate cards** (`estimate-card-common.tsx`):
    - Status badges, plus the old status when EXPIRED.
    - Checkbox, title, amounts, notice box (approved / returned reasons), detail chevron.
    - EXPIRED and RETURNED cards are blurred.
    - Kebab actions (`components/button-action.tsx`), each gated by a `user_permissions` flag:
      - 取り下げ申請 (request cancel, `is_allow_request_cancel`)
      - 編集 (edit, `is_allow_edit`)
      - 複製 (copy, `is_allow_copy`)
      - 削除 (delete, `is_allow_delete`)
  - **Bottom action bar:**
    - Store: 依頼をキャンセルする (cancel trouble). Hidden when the trouble is approved, done, or past the flow threshold.
    - Worker: 見積書を追加する (max 30 estimates, otherwise an error toast) and 提示する (submit the selected estimates).
  - **Dialogs:**
    - Delete confirm (destructive).
    - Submit confirm (lists the selected titles).
    - Cancel-trouble confirm. Shows the cancel fee incl. and excl. tax from `/settings/config` when `new_flow>7` on a working new trouble.
    - `CopyEstimateDialog` (new title input).
    - `RequestCancelConfirmDialog` (a required reason textarea). Its wording changes with the store reject or return permission.
- **Selection rule:** You can multi-select only DRAFT and CANCELLED cards from the same trouble. Picking any other card resets the selection to that one card.
- **Actions and API:**
  - Submit: `POST estimationApi /troubles/{id}/estimations/submit {estimation_ids}`
  - Delete draft: `DELETE estimationApi /troubles/{id}/estimations/{estimateId}`
  - Request cancel (worker): `POST estimationApi /troubles/{id}/estimations/send-request-cancel {estimation_ids, reason}`
  - Return / reject (store with `is_allow_reject`): `POST estimationApi /troubles/{id}/estimations/reject {estimation_ids, reason}`
  - Reject request-cancel (store): `POST estimationApi /troubles/{id}/estimations/reject-request-cancel {estimation_ids, reason}`
  - Cancel trouble: `POST beApi /troubles/cancel {troubleId}`, then posts `GO_TO_HOME` to the WebView.
  - Copy: writes `sessionStorage['copy-estimate'] = {sourceEstimateId, title}` and navigates to create with `?mode=copy`.
- **Navigates to:** `/trouble/{tid}/estimate/{eid}` (card click), `/trouble/{tid}/estimate/{eid}/edit`, `/trouble/{tid}/estimate/create`, `/trouble/{tid}/estimate/create?mode=copy`

#### S11 Estimate create (見積書作成), including copy mode
- **URL:** `/trouble/[troubleId]/estimate/create`, or `/trouble/[troubleId]/estimate/create?mode=copy` (the copy source comes from `sessionStorage['copy-estimate']`)
- **File:** `app/[locale]/(cms)/trouble/[troubleId]/estimate/create/page.tsx` → `components/estimate/estimate-create.tsx` → `estimate-form.tsx`
- **Purpose:** Create a new estimate, or clone an existing one with a new title.
- **Guard:** Token required. The page has no role check. Entry points are only shown to non-store users when the trouble flow allows creation, and the backend enforces the rest. In copy mode with no session data, it shows an error.
- **UI sections (`EstimateForm`):**
  - **Basic fields** (`estimate-basic-fields.tsx`):
    - Title (required).
    - 宛名 / recipient company name (required, defaults to `trouble.chainSystemName`).
    - Valid-until date picker (defaults to today + 30 days).
  - **Fees list** (`fees-list.tsx`, `estimate-fee-item.tsx`):
    - Drag-and-drop sortable rows (`@dnd-kit`), plus move up / down.
    - Each row has quantity, unit, comment, and remove. A category badge shows 作業 / 部材 / 諸経費 / 現場調査費 / 出張費.
    - The worker amount is shown when the user is not a store.
    - Server validation errors appear on each row.
    - Button "Add fee", with a maximum item count enforced.
  - **Add Fee dialog** (`add-fee-dialog.tsx`):
    - Tabs 作業 (working) / 部材 (element) / 諸経費 (expenses).
    - Each tab has a manual form: name (required, max length) and worker amount (required).
    - The 作業 tab also has a predefined suggested work-item list. Picking an item triggers a calculate call, and duplicates are rejected.
  - **Payment amounts** (`payment-amounts-display.tsx`): subtotal, tax, and total from the calculate response. Store and worker views differ.
  - **Note** (`note-field.tsx`), defaulting to `estimate.create.defaultNote`.
  - **Bottom bar:** Save (保存). Validation: title and company required, and no fee may have quantity 0.
  - **Dialogs:** save confirm, and a discard-changes confirm when going back with a dirty form.
- **API:**
  - Suggested items: `GET beApi /estcategories/all?chainSystemId=&largeCategoryId=&isShow=`
  - Live totals: `POST estimationApi /troubles/{id}/estimations/calculate-items`
  - Create: `POST estimationApi /troubles/{id}/estimations`
  - Copy source: `GET estimationApi /troubles/{id}/estimations/{sourceId}`
- **Navigates to:** on success, `router.replace('/trouble/{tid}/estimate')`. Back goes to the list (or `router.back()` after the discard confirm).

#### S12 Estimate detail (見積書詳細)
- **URL:** `/trouble/[troubleId]/estimate/[estimateId]`, optionally `?review=true` (or any truthy `review`), which enables the store's work-completion review form. `?mode=summary` is also read.
- **File:** `app/[locale]/(cms)/trouble/[troubleId]/estimate/[estimateId]/page.tsx` → `components/estimate/estimate-detail.tsx`. The same component is embedded in S10's summary mode with `hideHeader`.
- **Purpose:** Read-only estimate view plus every status transition: edit, request cancel, return, approve, approve or reject a cancel request, cancel the trouble, and the work-completion payment review.
- **Guard:**
  - Token required.
  - Each button is gated by `user_permissions.is_allow_edit / is_allow_request_cancel / is_allow_reject / is_allow_reject_request_cancel / is_allow_approve_request_cancel / is_allow_approved`.
  - Approve and reject buttons are disabled when `!condition-display.isAllowApproveEstimate`.
  - The review form (`canShowReview`) requires all of the following:
    - `?review`
    - Store role
    - Trouble status 2 (working)
    - Estimate status APPROVED
    - `newFLowStatus>=8` or `continuationFlowStatus>=80`
    - `/users/permission`: `isAllowPayment && isAllowApproveEstimate`
- **UI sections:**
  - `PageHeader` 見積書詳細, whose back button goes to the list.
  - Status badges (old and current when EXPIRED).
  - Orange "waiting for approval by others" notice (store, industry approval).
  - `EstimateBasicInfo`: title, number, dates, company, trouble info.
  - 作業項目一覧: `EstimateItemCardView` for each line item.
  - `PaymentAmountsDisplay`.
  - `EstimateBasicInfo2`:
    - Notices.
    - Rejection-reason block with a "View history" link to revisions.
    - Worker company info (phone).
    - **Share PDF** (Web Share API) and **Download PDF** buttons, unless `hideDownloadAndShare`.
  - `MaintenanceFeedback` (review form): a 1-5 star rating (required) and a comment textarea. In summary or payment mode it adds its own submit button.
  - **Bottom action bar** (each conditional):
    - 依頼をキャンセルする (store cancels the trouble)
    - 編集 (edit)
    - 取り下げ申請 (request cancel)
    - 差し戻し (return) or 取り下げ却下 (reject cancel request)
    - 承認する (approve) or 取り下げ承認 (approve cancel request)
    - 作業完了確認 (complete work, which submits the review)
  - **Dialogs:**
    - `RequestCancelConfirmDialog` (reason required).
    - Submit confirm.
    - Approve confirm.
    - Cancel-trouble confirm with fee text.
    - "Waiting for other approvers" info dialog. On mobile it includes a 稟議進捗 link that posts `GO_TO_LIST_APPROVAL`.
    - Payment-success modal: "next continuation trouble" (`GO_TO_NEXT_TROUBLE`), or `GO_TO_HISTORY` / `GO_TO_TOP` (`PAYMENT_COMPLETED_ACTION`).
- **API:**
  - Detail: `GET estimationApi /troubles/{tid}/estimations/{eid}`
  - Approve (store, `is_allow_approved`): `POST beApi /troubles/review_estimation_service {troubleId, estimationId}`
  - Approve cancel request: `POST estimationApi /troubles/{tid}/estimations/approve-request-cancel {estimation_ids}`
  - Reject / return, request cancel, reject cancel request: same endpoints as S10
  - Submit: `POST estimationApi /troubles/{tid}/estimations/submit`. The component has this handler, but no button triggers it on this screen.
  - Cancel trouble: `POST beApi /troubles/cancel`
  - Payment / review: `POST beApi /v2/troubles/{tid}/payments {estimateId, rating, comments}`. Outside a WebView it then pushes `/trouble/{tid}/estimate/` after 800 ms.
  - PDF:
    - Single estimate: `estimationApi.downloadFile GET /troubles/{tid}/estimations/{eid}/download`
    - Summary: `GET /estimations/export-summary` with `trouble_number`
- **Navigates to:** `/trouble/{tid}/estimate/{eid}/edit`, `/trouble/{tid}/estimate/{eid}/revisions`, back to the list (`router.back()` after each transition)

#### S13 Estimate edit (見積編集)
- **URL:** `/trouble/[troubleId]/estimate/[estimateId]/edit`
- **File:** `app/[locale]/(cms)/trouble/[troubleId]/estimate/[estimateId]/edit/page.tsx` → `components/estimate/estimate-edit.tsx` → `estimate-form.tsx`
- **Purpose:** Edit an existing estimate's title, company, valid-until date, fee items, and note.
- **Guard:** Token required. Entry is gated by `user_permissions.is_allow_edit` (S10 and S12). The page itself has no check. If the estimate is CANCELLED and `is_first_edit_after_cancelled`, valid-until resets to today + 30 days.
- **UI:** The same form as S11, prefilled from the detail response, including `is_manual`, `worker_total`, and `expired_time`. Save confirm dialog. Discard confirm, whose text is a hard-coded Japanese string.
- **API:** `GET estimationApi /troubles/{tid}/estimations/{eid}`, `POST .../calculate-items`, **`PATCH estimationApi /troubles/{tid}/estimations/{eid}`**. New fee rows are sent with `id: 0`.
- **Navigates to:** `router.back()` on success or back. The header's `backTo` is the detail page.

#### S14 Estimate revisions / history (操作履歴)
- **URL:** `/trouble/[troubleId]/estimate/[estimateId]/revisions`
- **File:** `app/[locale]/(cms)/trouble/[troubleId]/estimate/[estimateId]/revisions/page.tsx` → `components/estimate/revisions-list.tsx`
- **Purpose:** Timeline of status changes and their reasons for one estimate.
- **Guard:** Token required.
- **UI:** `PageHeader` with a back button to the detail page, then a list of `TimelineRow` cards. Each shows 担当者 (assignee, `updated_by_name` or `created_by_name`), `[status_label] datetime`, and the rejection reason (`note`). Mobile and desktop layouts differ.
- **API:** `GET estimationApi /troubles/{tid}/estimations/{eid}`, reading `revisions[]` from it.
- **Navigates to:** detail page (back)

### 2.5 Chat

#### S15 Chat home / conversation list (チャット)
- **URL:** `/chat`
- **File:** `app/[locale]/(cms)/chat/page.tsx` → `chat-page-content.tsx`, inside `chat/layout.tsx`
- **Purpose:** Pick a conversation.
- **Guard:** Token required. Blocked in a WebView.
- **UI:** The left pane is `ConversationList`: an infinite list of conversations with an optional search filter, each linking to `/chat/{id}`. The right pane is a welcome empty state.
- **API:** `GET beApi /chat/search?...` (`services/conversation.service.ts`)
- **Navigates to:** `/chat/{conversationId}`

#### S16 Chat conversation detail
- **URL:** `/chat/[chatId]`
- **File:** `app/[locale]/(cms)/chat/[chatId]/page.tsx` → `chat-detail-page-content.tsx`
- **Purpose:** Realtime messaging for one trouble conversation.
- **Guard:** Token required. Firebase auth must succeed: `FirebaseAuthService.signInWithTokenExchange()` calls `POST firebaseApi /v2/firebase-auth/exchange`. Until then the page shows a skeleton, and on failure an error.
- **UI:**
  - `ChatMessages`:
    - Firestore `onSnapshot` realtime messages.
    - Infinite scroll, "new messages" counter, scroll-to-bottom.
    - Participant names.
    - Delete message.
    - Media grid with a preview dialog.
  - `ChatInput`: text with @mention, image and file upload with previews, Enter to send.
  - A floating `ChatPopup` (bottom-right, "Support Chat").
- **API (firebaseApi):**
  - `POST /v2/chat/troubles/{troubleId}/send-message`
  - `POST /v2/chat/generate_presigned_url`, then a PUT to S3
  - `GET /v2/chat/retrieve-files`
  - `GET /v2/chat/map-participants-info`
  - `DELETE /v2/chat/conversations/{conversationId}/messages/{messageId}`
  - `POST /v2/chat/permissions/conversation/request?trouble_id=`
- **Navigates to:** other conversations through the list

### 2.6 Developer / diagnostics

#### S17 FCM test
- **URL:** `/fcm-test`
- **File:** `app/[locale]/(cms)/fcm-test/page.tsx`
- **Purpose:** Push-notification diagnostics for Firebase Cloud Messaging on browser, PWA, and iOS.
- **Guard:** Token required. No role check. Blocked in a WebView.
- **UI:**
  - System Information card: Notification API, permission, platform (iOS / PWA / Browser), Firebase SDK support.
  - Test Controls: "Request Notification Permission" and "Send Test Notification", plus an iOS hint.
  - An FCM Token card with a readonly textarea and "Copy Token".
  - A Debug Logs console (last 20 lines) with "Clear".
- **API:** No backend calls. It uses the Firebase Messaging SDK `getToken` (VAPID) and registers `/firebase-messaging-sw.js`.

### 2.7 Global overlay screen

#### S18 WebView blocked screen (not a route)
- **Rendered by:** `components/webview-route-guard.tsx` for any non-estimate route opened inside an RN WebView when no troubleId can be extracted.
- **UI:** Shield icon, `common.webviewRouteError.title/description`, and a "Back to app" button that posts `CLOSE_WEBVIEW`.

---

## 3. Route handlers (non-UI)

| URL | File | Purpose |
|---|---|---|
| `GET /api/auth/validate` | `app/api/auth/validate/route.ts` | Reads the `ACCESS_TOKEN` cookie and calls `GET {API_URL}/auth/info`. On a 401 it refreshes through `POST {API_URL}/auth/refresh_token {loginId, refreshToken}` and resets the cookies. On failure it clears the cookies. The middleware does not call this route. |
| `GET /api/health` | `app/api/health/route.ts` | Health JSON (status, uptime, env, version) for ECS / ALB |
| `GET /firebase-messaging-sw.js` | `app/firebase-messaging-sw.js/route.ts` | Generates the FCM service worker with Firebase config from env. Handles background messages, and notification clicks open `data.url` or `/troubles`. That `/troubles` path has no page; the page route is `/trouble`. |

Static: `public/sw.js`, `public/manifest.json`, and `public/chat-demo.html`, a demo host page for `<globar-chat>`.

---

## 4. Embeddable web components (Vite, `webcomponents.config.json`)

Build: `pnpm run build:webcomponents` (`vite.config.webcomponents.ts`). Output formats are ES and UMD, minified, with sourcemaps and CSS injected into the Shadow DOM.

### W01 `<globar-chat>` (Chat popup)
- **Config name:** `chat-popup`. Entry `src/web-components/chat/index.tsx`, class `GlobarChatPopup`. The implementation class is `ChatWebComponent` (`src/web-components/chat/ChatWebComponent.tsx`), which extends `web-components/base/WebComponentBase.tsx`.
- **Purpose:** Embeds the trouble chat in external apps (for example the CMS) as a floating popup with a toggle button, messaging, file upload, and mentions.
- **Attributes:** `chat-id` (default `"1"`), `initial-open` (bool), `position` (`bottom-right|bottom-left|top-right|top-left`), `theme` (`light|dark|system`), `locale` (`ja|en`), `title` (default "Chat"), `width` (600), `height` (700), `primary-color`.
- **Rendering:** `ReactWrapper` (locale messages from `MessagesBundle.ts`, theme, shadow root, `EnhancedPortalProvider` for dialogs and popovers) → `components/chat-popup.tsx` → `chat-content.tsx` (ChatMessages and ChatInput). It uses the Shadow-DOM-aware UI primitives in `web-components/ui/*` (dialog, dropdown-menu, popover, select, sheet, tooltip, command, date-time-picker, searchable-select).
- **API:** Same firebaseApi and Firestore endpoints as S16. Auth relies on the host providing tokens through cookies or token exchange.
- **Demo:** `public/chat-demo.html`.

---

## 5. Notes and gaps found

1. **Unused route constants:** `Routes.DASHBOARD` (`/dashboard`), `Routes.ESTIMATE` (`/estimate`), and `Routes.ESTIMATE_CREATE` (`/estimate/create`) have no `page.tsx`. The "Go admin" button on Unauthorized links to `/dashboard`, which would 404.
2. **No route-level RBAC:** `RoutePermissions = {}`. `RouteGuard` is unused, and `PermissionGuard` is used only by the unused `estimate-action-bar.tsx`. Access control relies on middleware cookie presence and backend `user_permissions` flags.
3. **Login is dev-only:** outside `NEXT_PUBLIC_APP_ENV=dev`, a request without a token always lands on `/unauthorized`, never `/auth/login`.
4. **Dead or unused components:** `estimate-action-bar.tsx`, `clone-estimate-dialog.tsx`, `estimate-summary.tsx`, `estimate-review-notice.tsx` (no importers besides themselves). `/auth/callback` has its logic commented out.
5. The service worker's notification-click fallback URL `/troubles` does not match the `/trouble` page route.
6. S12 defines a submit handler and confirm dialog, but has no button that opens them. Submitting happens from S10.
7. Approve uses `beApi /troubles/review_estimation_service` (core backend), while every other transition goes to `estimationApi`.
