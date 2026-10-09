# qnavi-trouble-frontend: Screen Catalog

Source: `/Users/protar/Desktop/work/qnavi/qnavi-trouble-frontend` (Next.js 13 **pages router**, static export `output: "export"`, `trailingSlash: true`, dev port 3003).
Method: GitNexus (`qnavi` index; `context TroubleModule` confirmed the module's outgoing calls, but `query` returned no execution flows for this subproject and the per-subproject repo `qnavi-trouble-frontend` is not registered), then a full read of every file in `pages/`, `containers/`, `components/`, `modules/`, `services/`, `store/`, `hooks/` and `constants/`.

## 0. What this app is

"トラブルNAVI" (Trouble NAVI) is a small **embedded wizard**, not a CRUD admin app. It runs inside a React Native WebView (repair/shop apps) or an iframe in the CMS. It has **no list/detail/table screens, no login screen and no trouble status transitions**. The flow is linear:

```
/  (トラブル相談内容: choose category, by search or by select)
 ├─ search hit click ──> /select-category  (pre-filled category form)
 └─ 次へ ──────────────> /reference         (診断結果: diagnosis / self-help)
                            └─ このまま依頼する ──> /job  (作業依頼: chat-style trouble/job creation)
```

The app is closed with `closeTab()`, which sends `postMessage({type:"close_webview"|"back_to_home"})` to the parent and calls `ReactNativeWebView.postMessage("close_webview")`. There is no in-app navigation back to a "home".

**Screen count: 4 routable pages** (`/`, `/select-category`, `/reference`, `/job`), plus `_app`/`_document`, 1 global error modal and 4 notable in-page modals/dialogs. There is no custom `404.tsx`, `_error.tsx` or login page.

---

## 1. App shell and global guards

### 1.1 `pages/_app.tsx` (`RootLayout` default export)
- Imports `styles/index.css` and `reflect-metadata`; sets the viewport meta.
- Wraps every page in `RootContainer`, then `NextIntlClientProvider` (locale `ja`, `messages = pageProps.messages`).
- Pages set `Component.layoutType = LayoutType.PUBLIC`, but nothing reads `layoutType`, so it has no effect.

### 1.2 `pages/_document.tsx`
- `<Html lang="ja">`, inlines the Google Tag Manager script (`process.env.GTM_ID`) and a `gtag` stub, plus a GTM `<noscript>` iframe.
- Pages also set `window.*` globals for GTM/GA (see the `/` and `/reference` sections).

### 1.3 Provider chain: `containers/root.tsx` (`RootContainer`)
`ConfigProvider(theme, jaJP)` > Redux `Provider(store)` > antd `App` > `AxiosProvider` > `ReactQueryConfigProvider` > `RootLayout` > page. `dayjs.locale('ja')`.

### 1.4 Auth gate: `containers/layout.tsx` (`RootLayout`)
- **Token source:**
  1. cookie `token` (`getCookie("token")`), dispatched with `appActions.setToken`; or
  2. a `window.message` event `{type:"set_cookie", data:{value, largeCategoryId, storeId, chainSystemId, staff, role, mode, assetSelected}}` from the parent (CMS iframe). This sets the token plus `appActions.setInfoCMS(...)`, then replies `window.parent.postMessage({type:"iframe_loaded"})`.
- **Guard:** `if (!token) return null`. With no token the page renders blank; there is no redirect and no login UI.
- Wraps children in `Authentication`.
- Other context cookies read by the pages: `store_id`, `large_category`, `mode`. In the CMS case, `infoCMS.*` is the fallback.

### 1.5 `containers/authentication.tsx` (`Authentication`)
- `useQuery({queryKey:[{config:getInfo, instanceType:"apiInstanceQnavi"}]})` calls **GET `/auth/info`** (Qnavi API), then `appActions.isUser(data)` stores `User {id, loginId, name, role, chainSystemId, chainStoreId, ...}`.
- Renders the **global API error modal** (`ModalCloseTrouble`, open when `state.app.isErrorApi.showError`):
  - **401 / no message:** shows `MESSAGE_404` ("アクセスセッションが切れた為…アプリに再度ログインしてからお試しください。") with the button "トラブルNAVIを閉じる", which calls `closeTab()`.
  - **Other errors:** shows the backend `response.data.message` with the button "OK", which clears the error.
- **No client-side role check.** Role only changes the behaviour of the `/job` flow (see 5) and the GA `userRole` label. Trouble visibility and role-scoping are enforced server-side (Authorization: Bearer token).

### 1.6 HTTP layer: `containers/axiosProvider.tsx` and `containers/reactQuery.tsx`
- Two axios instances, both adding `Authorization: Bearer <token>` and both supporting `config.path` URL templating:
  - `apiInstanceQnavi`: `API_BASE_URL` (Qnavi CMS backend). This is the **default** when no `instanceType` is given.
  - `apiInstanceTrouble`: `API_BASE_URL_TROUBLE` (trouble backend).
- The response interceptor unwraps to `response.data` and clears the error. The error interceptor calls `handleApiError`, which sets `isErrorApi`.
  - The Qnavi instance rethrows.
  - **The Trouble instance swallows the error and resolves `undefined`.** A failed trouble-API query therefore resolves with `undefined` data instead of erroring.
- `QueryClient` defaults: `retry:false`, `refetchOnWindowFocus:false`, `gcTime:0`, `staleTime:0`.
  - Generic `queryFn`: queryKey `[0]` is `{config: AxiosRequestConfig, instanceType}`. `pageParam` is merged into `params.page`.
  - Generic `mutationFn`: same shape, returns `response.data`.
  - There are no custom hooks and no invalidation keys. Every screen calls `useQuery`/`useInfiniteQuery`/`useMutation` inline with a config from `services/api/*`.

### 1.7 Shared UI
- `components/pageWrapper.tsx` (`PageWrapper`):
  - Sticky header with a back button (`router.back()`, hidden when `isShowButton=false`), a `TitlePage` title, and a close (X) button `#close-trouble-navi` that calls `closeTab()`.
  - framer-motion slide-in; adds Android top padding.
- `components/modalCloseTrouble.tsx` (`ModalCloseTrouble`): antd `Modal` with no close icon and a single full-width link button (default label "トラブルNAVIを閉じる").
- `components/select.tsx`: antd `Select` wrapper with optional infinite scroll and body scroll-lock while open.
- `components/pageLoading.tsx`: ripple loader.

### 1.8 Global state (Redux Toolkit; saga middleware is wired but `appSaga` is empty)
- `app` slice: `token`, `user`, `qaTrouble` (the selected categories carried between screens), `isErrorApi`, `infoCMS` (`largeCategoryId`, `storeId`, `chainSystemId`, `staff`, `role`, `mode`, `assetSelected`).
- `category` slice: `query`, `hitSelected` (Algolia hit), `categories`, `masterCategories`, `modeSelected`, `isResetSelectCategory`.

---

## 2. Feature: Category selection

### 2.1 Trouble consultation: category entry (トラブル相談内容)

| Item | Detail |
|---|---|
| Route | `/` |
| Page file | `pages/index.tsx` (`getStaticProps` loads `messages/ja/trouble.json` and `common.json`) |
| Container | `modules/trouble/index.tsx` (`TroubleModule`) |
| Purpose | First screen: the user picks the trouble category (large/medium/small/symptom, plus asset) either by free-text search or from cascading dropdowns. |
| Guards | Global token gate (1.4). Data queries are `enabled: !!chainSystemId`, where `chainSystemId = user.chainSystemId \|\| infoCMS.chainSystemId`. A full-screen `Spin` shows until both category queries resolve. If either fails (the trouble instance resolves `undefined`), the spinner stays and the error modal appears. |
| Header | `PageWrapper` title "トラブル相談内容", **back button hidden** (`isShowButton={false}`), close X. Subtitle "お困り事のカテゴリーを選択してください". |

**Main UI**
- **Mode toggle** (antd `Radio.Group` of `Radio.Button`s):
  - "事象を入力して選択" (`ModeCategory.Search`), the default.
  - "カテゴリから選ぶ" (`ModeCategory.Select`).
  - The initial mode comes from cookie `mode`, then `infoCMS.mode`, then `search`. A previously selected mode in Redux overrides it on mount.
  - Changing the mode dispatches `setModeCategory` and `setIsResetSelectCategory(value==='select')`.
- **Search mode**: `SearchCategory` (Algolia InstantSearch with a custom search client).
  - `SearchInput`:
    - Search icon, a text input (placeholder "お困り事を入力してください", maxLength 150, autofocus on desktop only), a clear (X) icon, and a "検索" primary button (spinner while fetching).
    - Enter triggers the search. On mobile/tablet the input blurs after searching.
    - Example hints below: "トイレの水が流れない", "トイレが詰まった", "客席のエアコンから異音がする", "シンクの水が溢れている".
  - `ResultsPanel`: a dropdown listbox (max height 65vh) shown when the query is non-empty, with up to 10 hits per page via `useInfiniteHits`. When empty it shows "検索結果がありませんでした。別のキーワードをお試しください。"
  - `HitItem`:
    - Bold label of the deepest level, plus a breadcrumb `large > medium > small > symptom` with `<Highlight>` marks.
    - Hover or keyboard selection is supported (`useKeyboardNavigation`: ArrowUp/ArrowDown; **Shift+Enter** selects).
    - Click dispatches `setQuery(query)` and `setHitSelected(hit)`, then `router.push('/select-category')`.
  - Algolia filters:
    - Always `chainSystemId=<id>`.
    - `chainStores=<store_id>` only when `masterCategories.data.symptoms.length > 0`.
    - Index `process.env.ALGOLIA_INDEX_NAME`.
- **Select mode**: `SelectCategory` (see 2.3). No pre-filled hit; large category defaults as described there.

**On mount**
- `resetCategoryState()`.
- `sessionStorage[confirm_category_time_start] = Date.now()`. This timestamp feeds the audit-log response time.

**API calls**

| Call | Method / endpoint | API instance | Trigger |
|---|---|---|---|
| `getCategory(chainSystemId, chainStoreId)` | GET `/qa_data/get_qa_category?chain_system_id&chain_store_id` | Trouble API | `useQuery` |
| `getMasterCategories({chainSystemId, chainStoreId, isShow:'01'})` | GET `/largecategories` | Qnavi API | `useQuery` |
| Search | POST `/categories/search` (`API_ENDPOINT.SEARCH_CATEGORY`), body `{indexName, params:{filters, query, ...}}` | Qnavi API | Algolia proxy; skipped when the query is empty |

Both `useQuery` results are stored in the `category` slice.

The `SelectCategory` sub-component on this screen (select mode) also calls the endpoints in 2.3.

**Navigation**
- Search hit goes to `/select-category`.
- 次へ (select mode) goes to `/reference`.
- Close X calls `closeTab()`.

### 2.2 Category confirmation (pre-filled from search)

| Item | Detail |
|---|---|
| Route | `/select-category` |
| Page file | `pages/select-category.tsx` (`getStaticProps` loads the i18n messages) |
| Container | `modules/selectCategory/index.tsx` (`SelectCategoryPage`), which renders `modules/trouble/components/SelectCategory.tsx` with `hit = state.category.hitSelected` |
| Purpose | Shows the hit chosen on `/` as a pre-filled cascading form (大/中/小項目/症状). The user can adjust it, add assets, and confirm. |
| Guards | Global token gate. Relies on `state.category.categories`, which `/` loaded. Opened directly (e.g. after a reload), the dropdown options are empty because nothing here refetches categories. |
| Header | Title "トラブル相談内容", **back button visible** (goes back to `/`), close X. Subtitle "お困り事のカテゴリーを選択してください". |

Main UI, fields and actions: identical to 2.3, with `hit` pre-filling `largeCategory`, `mediumCategory`, `smallCategory` and `symTom = hit.symptom.name`.

**Navigation**
- 次へ goes to `/reference`.
- Back returns to `/`.

### 2.3 Shared component: `SelectCategory` (cascading category form)
File: `modules/trouble/components/SelectCategory.tsx`, logic in `modules/trouble/useLogic.ts` and `modules/trouble/asset/useLogic.ts`. It is used in `/` (select mode) and in `/select-category`.

**Fields** (antd `Select` via `components/select.tsx`, placeholder "選択してください")

| Label | Field | Behaviour |
|---|---|---|
| 大項目 | `largeCategory` | Options from `categories.data.large_category`. Default: cookie `large_category` (or `infoCMS.largeCategoryId`) if it matches an option, otherwise the first option. A previous `qaTrouble.largeCategoryTrouble` overrides this unless the reset flag is set. Changing it clears medium, small and symptom. |
| 中項目 | `mediumCategory` | Filtered by `largeCategoryId`. Changing it clears small and symptom. |
| 小項目 | `smallCategory` | Filtered by `mediumCategoryId`. Choosing it triggers `refetch()` of symptoms. |
| 症状 | `symTom` | Options from the symptom API (`label`, `qnavi_id`, `qnavi_labelJa`, `urgent_flag`). Disabled while loading. |
| 資産 (asset) | `assetIds` (multiple, searchable, sorted, clearable, `#asset-select`) | **Only shown when the store's `assetFlag == 1`.** Pre-selected once from `infoCMS.assetSelected` (sent by the CMS postMessage), keeping only IDs that exist in the options. |

**Button**: "次へ" (`#trouble-next-button`, primary).
- Disabled while any of large, medium, small or symptom is null, while the store detail is loading, when there is no role (`user.role || infoCMS.role`), or when `user === null`.

On click (`handleSubmit`):
1. **Audit log**: POST `/audit-logs` (Qnavi API, `hooks/useAuditLog.ts`).
   - Body: `{screen:"trouble_navi_confirm_category", action:"btn_confirm_click", data:{type: search|select, keyword?, data?:{large/medium/smallCategory{id,label}, symptom{label}}}, response_time}`.
   - The log is sent only if the session start timestamp exists, and the timestamp is removed on success.
2. `setHitSelected(undefined)`, then `router.push('/reference')`.
3. `appActions.isQaTrouble({...trouble-side and qnavi-side category ids/labels, symTom, urgent_flag, assetIds, assetTexts})`.

**API calls**

| Call | Method / endpoint | API instance | Trigger |
|---|---|---|---|
| `getSymptomList` | GET `/qa_data/get_qa_symptom?chain_system_id&large_category&medium_category&small_category&chain_store_id` | Trouble API | Manual `refetch()` (`enabled:false`) |
| `getStoreDetail(store_id)` | GET `/stores/{id}` | Qnavi API | Called twice: in `useLogic` (store name for GA) and in `asset/useLogic` (`assetFlag`) |
| `getAllAssetByChainStore(store_id)` | GET `asset/all-by-chain-store/{id}` | Qnavi API | Only when `assetFlag` is set and a `storeId` exists |

**Side effects**: sets `window.largeCategories`, `mediumCategory`, `smallCategory`, `sympTom`, `user` (loginId), `chainStoreName`, `storeName` and `userRole` (label from `RolePermissionLabel`) for GTM.

---

## 3. Feature: Diagnosis / self-help

### 3.1 Diagnosis result (診断結果)

| Item | Detail |
|---|---|
| Route | `/reference` |
| Page file | `pages/reference.tsx` (no `getStaticProps`, so there are no i18n messages; all strings are hard-coded Japanese) |
| Container | `modules/reference/index.tsx` (`ReferenceModule`), logic in `modules/reference/useLogic.ts` |
| Purpose | Shows the QA knowledge-base answer for the chosen category and symptom: likely causes, things the store can check, an emergency fix, an AI explanation from past cases, and the manufacturer contact. The user either marks the trouble resolved or continues to create a work request. |
| Guards | Global token gate. The query is `enabled: !!qaTrouble`, which is always truthy because the slice has an initial object. Opened directly, the request is sent with `"null"` category values. `chain_system_id` uses `user.chainSystemId` only, with **no `infoCMS` fallback**, unlike the other screens. |
| Header | Title "診断結果", back button (goes to the previous category screen), close X. A full-screen `PageLoading` shows while loading. |

**Main UI sections** (each rendered only when its data is present)
1. **考えられる原因** (likely causes): a blue card listing `reason[]`. When `link_detail[]` exists, the reason with the same index becomes an external link (`target=_blank`).
2. **店舗で対応や確認できること** (`#reference-suggest-action`): for each `suggest_action[]` item:
   - If `is_show_button`: a bordered card of answer lines and a **"解決した"** (resolved) button (`#resolve-{i}` overlay for GTM). It opens the thanks modal with `isBackToHome=true`.
   - Otherwise: the answer lines in red bold text.
3. **応急処置** (emergency fix): `hot_fix_suggest.suggest[]`, when `is_show`.
4. **過去事例から推測される現象の説明** (explanation inferred from past cases): `ai_suggest.suggest[]`, when `is_show`.
5. **上記で解決しない場合** (if the above does not help): `order_suggest.suggest`, when `is_show`.
6. **お問合せ先** (contact): one block per `manufacturers[]` entry, skipping entries whose name is `" "`. Shows the name, a `tel:` link with a description, and a `mailto:` "メールでのお問い合わせ" link with a description.
7. **Footer buttons**:
   - **"このまま依頼する"** (request as-is, primary, `#createJob` overlay) goes to `router.push('/job')`. **Hidden when any manufacturer contact exists.**
   - **"もどる"** (back, `#closeTroubleNavi` overlay) opens the thanks modal with `isBackToHome=false`.

**Modal: thanks / close** (`ModalCloseTrouble`)
- Text: "ご利用ありがとうございました。不明点があればまたお問い合わせください。"
- Button "トラブルNAVIを閉じる". It shows a loading state until GA `gtag('get', GA4_ID, 'client_id')` returns, plus 600 ms, so the GA event can fire before the WebView closes.
- OK calls `closeTab(isBackToHome)`, which sends `back_to_home` (from 解決した) or `close_webview` (from もどる).

**API calls**

| Call | Method / endpoint | API instance |
|---|---|---|
| `getQaAnswer` | GET `/qa_data/get_qa_answer?large_category&medium_category&small_category&symptom&chain_system_id` | Trouble API |

Category values are the trouble-side ids from `qaTrouble`. **Side effect**: `window.suggestAction = suggest_action answers joined`.

**Navigation**
- "このまま依頼する" goes to `/job`.
- 解決した or もどる close the WebView.
- The header back button returns to the previous category screen.

---

## 4. Feature: Work request creation (trouble ticket creation)

### 4.1 Work request chat wizard (作業依頼)

| Item | Detail |
|---|---|
| Route | `/job` |
| Page file | `pages/job.tsx` (no `getStaticProps`; hard-coded Japanese) |
| Container | `modules/job/index.tsx` (`JobModule`), logic in `modules/job/useLogic.tsx` (883 lines) |
| Purpose | A chat-style bot ("AIアシスタント") that collects store, contact staff, photos, description and preferred date/time, shows a confirmation card, then **creates the trouble** (POST `/troubles`) and shows the request number. |
| Guards / role | Global token gate. `PageLoading` shows until the store detail loads and the first bot message exists. **Role branching**: if `role == '01'` (STORE_ADMIN, from `user.role` or `infoCMS.role`), the flow starts with the **choose store** step. It is auto-answered with the cookie or CMS store (`store_id`); the user does not pick it. All other roles start at **choose staff**. If `infoCMS.staff.id` exists (CMS embed), the staff step is auto-answered. |
| Header | Title "作業依頼", back button, close X. |

**Conversation steps** (`ActionType` order; each step adds bot messages after a 1 s delay)

| # | Step | Bot message / UI | User input |
|---|---|---|---|
| 0 | `choose_store` (role 01 only) | "店舗を選択してください。" | Auto-reply with `store.storeName` |
| 1 | `choose_staff` | "連絡先担当者を選択してください。" with an option button **"連絡先担当者を選択"** | Opens the **staff selection modal** (4.2) |
| 2 | `choose_photos` | Photo guidance ("最低３枚写真撮影にご協力ください！" plus a list of the shots needed) with two buttons: **"写真が撮れない"** (cannot take photos, sends a text reply) and **"写真を撮影する"** (antd `Upload`, multiple, `image/*` except on Android) | Images: jpg/jpeg/png/gif, each under 10 MB, at most 20 (`LIMIT_DEFAULT`). The reply bubble shows the images with per-image remove (X) and a **"写真の追加"** (add photos) button. |
| 3 | `input_description` | "詳しい説明が事態の解決を早めます！" with bullet guidance. Below it, **依頼の前の確認事項** (pre-request checklist) shows the note text from `get_note`. | **Chat bar** (sticky): `TextArea` with 4 rows, maxLength 1000, placeholder "故障の詳細を記入してください。例：水道の水が出ない。", and a send icon. It is pre-filled with the search keyword (`category.query`). |
| 4 | `select_time` | "ご希望日時を教えてください。" with notes on surcharges, plus a **radio grid** (`#messageRadio`) | See the date/time options below. |
| 5 | `finish` | "ありがとうございます。メンテナンス依頼を作成しますので少々お待ちください。" followed by the **confirmation card** | **"もどる"** closes the WebView. **"依頼する"** submits. |
| 6 | `success` | "作業を依頼しました。依頼番号は **{number}** です。… 「進行中の作業依頼一覧」からご確認いただけます。" | **"トップ画面に戻る"** calls `closeTab(true)` (back_to_home) |

**Date/time options** (radio values)
- Store `automatchingFlag = 0`: 日時指定 (date and time), 日付指定 (date only), 期間指定 (period), 指定日時以前 (before a date/time), 指定日時以降 (after a date/time), 至急 (urgent).
- Store `automatchingFlag = 1`: 本日中（希望時間指定）(today, with time), 明日以降（希望時間指定）(tomorrow or later, with time), 明日以降（希望日付＆希望時間指定）(tomorrow or later, with date and time), 至急 (urgent).
  - 至急 is disabled after 20:00 JST (after 18:00 local time outside Tokyo).
- 至急 submits immediately with `isEmergency=1`. Every other option opens the **calendar modal** (4.3).

**Mapping to `dateOption`**

| `dateOption` | Option | Fields sent |
|---|---|---|
| 01 | 日時指定 | `expectedDate`, `expectedStart`, `expectedEnd` |
| 02 | 日付指定 | `expectedDate` |
| 03 | 期間指定 | `expectedDate`, `expectedStart`, `toExpectedDate`, `toExpectedEnd` (two calendar passes: start, then end) |
| 04 | 指定日時以前 | `toExpectedDate`, `toExpectedEnd` |
| 05 | 指定日時以降 | `expectedDate`, `expectedStart` |
| 06 | 本日中 | Same fields as 01 |
| 07 | 明日以降（時間）| Same fields as 01 |
| 08 | 明日以降（日付＆時間）| Same fields as 01 |
| (none) | 至急 | `isEmergency=1` only |

**Inline edit**: user reply bubbles show a pencil (`FormOutlined`) icon while `enabledEdit` is true. The store reply and the "依頼します。" reply have no icon.
- Staff: reopens the staff modal.
- Description: reopens the chat bar and replaces the text.
- Time: scrolls to the radio grid and re-enables it.
- Photos: re-enables selection and add.
- The confirmation card has the same pencil icons; they scroll to the matching message.

**Confirmation card** ("この内容で依頼しますか？")
- Rows: 店舗 (store), 担当者 (contact staff), 大項目, 中項目, 小項目 (large, medium and small category, from the trouble-side labels), 症状 (symptom), 資産 (assets, when present).
- Then: トラブルの詳細 (description), 希望日時 (preferred date/time), and the photos.
- Buttons: **もどる** and **依頼する**. Both are enabled only while the card is the latest message.

**Submit (依頼する)**: `useMutation`, multipart `FormData`.
- Endpoint: `createTrouble(user.id + '_' + uuid())`, i.e. **POST `/troubles`** with header `Idempotency-Key`.
- **API instance: Qnavi**, the default, because no `instanceType` is passed. The request goes to `API_BASE_URL`, not the trouble backend.
- Fields:
  - `troubleType=01`, `chainStoreId`, `isLock=0`, `staffId`.
  - `description` = user text + `\n----------------------\n大項目：…\n中項目：…\n小項目：…\n症状：…`.
  - `largeCategoryId`, `mediumCategoryId`, `smallCategoryId`: **Qnavi-side ids**.
  - `symptom`, `urgentFlag` (`01`/`00` from the symptom's `urgent_flag`).
  - `isAsset=1` and `assetIds[]`, when assets were selected.
  - `troubleImage[]`.
  - The `dateOption` / expected* / `isEmergency` fields.
- Note: `timeout: 600000` is placed inside `headers`, not in the axios config, so it does not act as a timeout.
- **onSuccess**: appends the success message with `data.number` and disables editing.
- **onError**: if the backend returns date-field errors (`expectedDate`, `expectedStart`, `expectedEnd`, `toExpectedDate`, `toExpectedEnd`) or HTTP 422, the chat is truncated back to the `select_time` step so the user can choose again. Any other error shows the global error modal (1.5).

**API calls**

| Call | Method / endpoint | API instance | Trigger |
|---|---|---|---|
| `getStoreDetail(store_id)` | GET `/stores/{id}` | Qnavi API | `useQuery`. Supplies `storeName`, `automatchingFlag` and `assetFlag`. |
| `getStaffList(store_id, {numberItem:20, name})` | GET `/stores/{id}/staffs?numberItem&name&page` | Qnavi API | `useInfiniteQuery`. The page comes from `pagination.currentPage/totalPage`. The name is debounced 500 ms. |
| `getNote({large/medium/small_category labels, symptom})` | GET `/qa_data/get_note` | Trouble API | `useQuery` |
| `createTrouble` | POST `/troubles` (multipart, Idempotency-Key) | Qnavi API | `useMutation` |

**Navigation**: there is no further in-app route. Exits are via `closeTab()`: もどる on the confirmation card, トップ画面に戻る after success, the header X, and the no-staff modal.

### 4.2 Modal: staff selection (連絡先担当者を選択)
- File: `modules/job/components/selectionModal.tsx`.
- antd `Modal`:
  - Search `Input` (placeholder "名前で検索できます", searches by name).
  - Scrollable `List` with a checkbox per staff member and infinite scroll; it loads the next page near the bottom and shows a `Spin` while fetching.
  - Clicking a row selects that staff member, closes the modal after 400 ms, and posts the name as the user's reply.
  - The search text is cleared after the modal closes.

### 4.3 Modal: date/time picker (`CustomCalendar`)
- File: `modules/job/components/calendarModal.tsx`.
- antd `Modal`, width 325, not mask-closable.
  - Custom month header (‹ "M月 YYYY" ›). Calendar cells show the selected day highlighted and weekends in red.
  - **Past dates are disabled.** For 明日以降（日付＆時間）, selecting today switches to tomorrow.
- Time section: `TimePicker`s with 15-minute steps only. The range start/end defaults to now rounded to the next quarter hour, plus 2 h (capped at 23:45). End must be after start; a minimum of 15 minutes is enforced.
  - **Calendar and time pickers** (calendar shown): 日時指定, 期間指定, 指定日時以前, 指定日時以降, 明日以降（日付＆時間）.
  - **Calendar only, no time pickers**: 日付指定.
  - **Time pickers only, no calendar**: 本日中, 明日以降（時間）.
- Buttons: **キャンセル** (cancel, red) and **決定** (confirm). Confirm calls `onDateChanged(type, start, end)`.
- For 期間指定 the modal opens twice: first for the start (`periodStart`), then for the end (`periodEnd`).

### 4.4 Modal: no store/staff (該当店舗がありません。)
- Shown in `JobModule` when the staff list is empty, no search has been typed (`staffSearchKey === null`) and loading has finished.
- `ModalCloseTrouble` text: "該当店舗がありません。" (no matching store).
- Button "トラブルNAVIを閉じる" calls `closeTab()`.

---

## 5. Role / visibility summary

| Concern | Where | Behaviour |
|---|---|---|
| Authentication | `layout.tsx`, `authentication.tsx` | Bearer token from cookie `token` or CMS `postMessage`. No token renders nothing. A 401 shows the "session expired, close" modal. |
| Role source | `user.role` (GET `/auth/info`) or `infoCMS.role` | Codes from `RolePermission`: 01 STORE_ADMIN, 02 STORE_GENBA, 03 INDIVIDUAL, 04 WORKER, 05 WORKER_COMPANY, 98 SUB_ADMIN, 99 SYSTEM_ADMIN |
| Role-dependent UI | `modules/job/useLogic.tsx` | Role `'01'` gets the extra "choose store" step, auto-filled with the context store. Other roles skip it. Nothing is hidden or blocked by role on the client. |
| "次へ" gating | `modules/trouble/useLogic.ts` | Disabled when there is no role or no user |
| Store scope | cookie `store_id` or `infoCMS.storeId`; `chainSystemId` | Every query is scoped to the context store and chain system passed in by the host app. Algolia is filtered by `chainSystemId` (and `chainStores` when store-specific symptoms exist). Real visibility enforcement is server-side. |
| Feature flags | Store detail `assetFlag` and `automatchingFlag` | `assetFlag` shows the asset multi-select. `automatchingFlag` switches the date-option set. |

## 6. Route constants vs. real pages
`constants/router.ts` defines `HOME:/`, `JOB:/job`, `TROUBLE:/trouble`, `REFERENCE:/reference` and `SELECT_CATEGORY:/select-category`. **`/trouble` has no page file**, so it is a dead constant; the trouble entry screen is `/`. `ROUTER` is only used for `SELECT_CATEGORY`. The other pushes use literal strings (`/reference`, `/job`).

## 7. Notable observations (for QA)
1. **Direct entry is unsafe.** `/select-category`, `/reference` and `/job` assume Redux state set by earlier screens and nothing persists it. A reload or deep link gives empty options or calls with `"null"` parameters.
2. **Errors swallowed.** The Trouble axios instance resolves `undefined` instead of throwing, so the spinner on `/` can hang forever if `get_qa_category` fails.
3. **Wrong backend for creation.** `createTrouble` uses the Qnavi instance (`API_BASE_URL`) because no `instanceType` is passed. Confirm this is intended: POST `/troubles` goes to the CMS/Qnavi API, not to qnavi-trouble-backend.
4. **Ineffective timeout.** The `createTrouble` timeout sits in `headers`, so it has no effect; the global axios timeout is 180 s (`3000*60` ms, although the code comment says 60 s).
5. **No `infoCMS` fallback on `/reference`.** `get_qa_answer` uses `user.chainSystemId` only.
6. **Repeated store-detail calls.** GET `/stores/{id}` runs from three places. With `gcTime:0` and `staleTime:0` it is refetched on each screen.
7. **Hard-coded strings.** i18n (`next-intl`) covers only `/` and `/select-category`. `/reference` and `/job` are hard-coded Japanese.
