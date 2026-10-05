# CONVERTATION.md — отчёт о миграции UI с React на Vue 3

Миграция CEF-интерфейса RAGE:MP сервера StreetRP из `src_ui` (React 16 + CRA 3 + Redux) в `src_ui_vue` (**Vue 3.5 + Vite 8 + TypeScript strict + Pinia**).

Дата: 05.10.2026 · Статус: **завершено**

---

## Итоги проверок

| Проверка | Результат |
|---|---|
| `pnpm typecheck` (vue-tsc, strict) | ✅ 0 ошибок |
| `pnpm build` (Vite 8) | ✅ успешно, 295 чанков (код-сплиттинг по экранам) |
| RPC-паритет (callServer / callClient / rpc.register) | ✅ 218/218 активных имён — 1:1 |
| Паритет `mp.*` (invoke / events.add / command / chatMessage / focus) | ✅ 4/4 |
| Паритет файлов компонентов | ✅ 306 старых .ts/.tsx → 317 новых .vue/.ts (см. «Намеренные замены») |
| Маршруты | ✅ 34 маршрута 1:1 (hash history, как `createHashHistory`) |

Единственное формальное «расхождение» по RPC — `Audio-GetHashData`, который в легаси находился внутри закомментированного блока `3dsound.ts` и не выполнялся.

---

## Стек нового проекта

| Слой | Технология |
|---|---|
| Сборка | Vite 8, `@vitejs/plugin-vue`, алиасы `@ / components / utils / store / data / assets / ~assets` |
| Язык | TypeScript 5.8, strict mode |
| UI | Vue 3.5 (`<script setup lang="ts">`), SFC |
| Состояние | **Pinia** (`stores/app|hud|player|phone|tablet.ts`) |
| Роутинг | **vue-router** (`createWebHashHistory`) |
| Формы | **vee-validate 4 + yup 1** (yup-схемы перенесены из formik без изменений логики) |
| Уведомления | Собственный тостер (замена react-toastify) |
| Иконки | Сгенерированные из SVG-данных react-icons компоненты (`utils/icons.ts`) |
| Даты | dayjs (ru, Europe/Moscow) вместо moment-timezone |
| RPC | `rage-rpc` (тот же пакет `github:Yoegibby/rage-rpc#rage1.1_fixes`) |
| Менеджер пакетов | pnpm |

**PrimeVue** присутствует в зависимостях (по требованию), но не понадобился: все виджеты портированы напрямую с сохранением исходного DOM/классов ради пиксельной точности.

---

## Структура проекта

```
src_ui_vue/
├── index.html                 # <div id="root"> — как в легаси (используется use-rotation)
├── MIGRATION.md               # гайд по конвенциям миграции
├── package.json               # scripts: dev / build / typecheck (+ prebuild генерация)
├── scripts/
│   ├── generate-icons.mjs     # SVG-данные react-icons → utils/icons.ts
│   └── build-framework7-styles.mjs  # LESS Framework7 → assets/styles/framework7.css
└── src/
    ├── main.ts                # pinia, router, стили, stores/events (RPC → сторы)
    ├── App.vue                # Browser-ShowPage RPC, RouterView, Chat, 2 тостера
    ├── router/index.ts        # 34 маршрута, lazy-компоненты
    ├── stores/                # app, hud, player, phone, tablet + events.ts (RPC)
    ├── composables/           # use-rotation, use-dnd, use-storage-inventory,
    │                          # use-animated-number, use-tablet-router
    ├── utils/                 # rpc, notifications, images, prettify, sounds,
    │                          # 3dsound, dayjs, icons (56 шт.)
    ├── data/                  # factions/inventory/licenses/tasks/vehicles.json (копия)
    ├── assets/                # images, fonts, audio, styles (копия) + framework7.css + vendor
    └── components/
        ├── Common/            # порты общих компонентов + rc-* порты + toaster
        ├── HUD/ Auth/ Daily/ Character/ Spawn/ Phone/ Inventory/ House/ Business/
        ├── Dialog/ Job/ Admin/ Player/ Promo/ Services/ Games/ Target/ Trading/
        ├── Factions/ Chat/    # все экраны 1:1
        └── Tablet/            # Framework7-планшет: f7/* обёртки + pages/* + свой роутер
```

---

## Ключевые решения (ради точной конвертации)

### 1. Иконки — пиксель-в-пиксель
Готовые Vue-наборы (oh-vue-icons и др.) не содержат Ionicons 4 (пак `io` в react-icons) — глифы отличались бы. Поэтому `scripts/generate-icons.mjs` извлекает SVG-path каждого использованного иконки (56 шт.) из `node_modules/react-icons` легаси-проекта и генерирует Vue-компоненты с **теми же именами** (`IoIosClose`, `FaGasPump`, …) и тем же типом `IconType`. Визуальный результат идентичен исходному UI.

### 2. rc-* виджеты — порты с идентичным DOM
`rc-slider`, `rc-checkbox`, `rc-progress (Circle)`, `rc-tabs` переписаны как `Common/rc-*.vue` с **теми же CSS-классами** (`rc-slider-handle`, `rc-circle-path`, `admin_tabs-tab`…). Оригинальные CSS скопированы в `assets/styles/vendor/`. Внешний вид и поведение (клавиатура слайдера, шаги, gap-дуга прогресса) воспроизведены по исходникам установленных пакетов.

### 3. react-toastify → свой тостер
`Common/toaster.vue` + `utils/notifications.ts` рендерят ту же структуру классов (`Toastify__toast--info|success|warning|error`, `notifications_item`…), поэтому существующие `notifications.scss` работают без правок. Поведение сохранено: 2 контейнера (hud — top-center/Zoom, menu — bottom-center/Flip), autoClose 2300ms, limit 1 + clearWaitingQueue (новое уведомление вытесняет старое), newestOnTop, без кнопки закрытия.

### 4. react-transition-group → `<Transition>`
Глобальные классы переходов легаси (`alert`, `ios`, `fadeIn`, `slideLeft/Right/Up`) сохранены; для Vue добавлены алиасы (`*-enter-from`, `*-leave-to`…) в `assets/styles/vue-transitions.scss`. `CSSTransition timeout={0}` → просто `v-if` (анимации в легаси не было).

### 5. react-select / react-datepicker / react-color — точные порты
- `Admin/partials/select.vue` — DOM и классы react-select (`admin_select__control/__menu/__option…`), фильтрация, noOptionsMessage, onMenuOpen (ленивая загрузка игроков).
- `Admin/partials/date-picker.vue` — календарь + список времени (интервалы 5 мин), классы react-datepicker + CSS из пакета, та же конвертация даты → ISO (`getCorrectDate`).
- `Services/lsc/chrome-picker.vue`, `github-picker.vue` — порты react-color по исходникам (saturation/hue/alpha/RGB-поля, сетка свотчей), `RGBColor` и конвертации цвета сохранены.

### 6. react-dnd → композабл `use-dnd.ts`
Инвентарь работал на react-dnd (TouchBackend + мышь). Реализован pointer-based drag&drop: drag-источник (Item), реестр drop-целей (Cell, key = `storage:id`), подсветка цели через `document.elementFromPoint` (класс `is-over`), preview у курсора. Колбэки сохранены 1:1: `onDrop(sourceId, targetId, storage)`, кросс-стоковые дропы → `transferItem`, blocked-ячейки не принимают.

### 7. Framework7 (Tablet) → свои обёртки + стек-роутер
- **CSS**: `scripts/build-framework7-styles.mjs` компилирует те же LESS-файлы легаси (`framework7/index.less`, iOS-тема, dark+light) в `assets/styles/framework7.css` (202 КБ) — все переменные `--f7-*`, списки, навбары, тогглы, радио, чекбоксы, аккуордеоны выглядят как раньше.
- **DOM**: `Tablet/f7/{page,navbar,list,list-item,list-input,list-button,toggle,block*,}` повторяют разметку framework7-react v6 (в т.ч. автостраницу `page-content`, `label.item-radio/item-checkbox`, структуру тоггла, preloader бесконечной прокрутки).
- **Роутер**: `composables/use-tablet-router.ts` — стек страниц с props (`f7router.navigate(path, { props })`, `back()`, `reloadAll` для сайдбара), относительные ссылки (`member/`, `rank/`) резолвятся как в F7. Все 23 внутренних маршрута планшета 1:1 (`routes.ts`).

### 8. Redux ducks → Pinia
`store/<slice>/{actions,reducer,types,events}.ts` → `stores/<slice>.ts`. Имена методов стора = старым action-креаторам (`setDate`, `sendMessage`, `setSatiety`, `setCall`, `loadMembers`…). RPC-регистрации легаси (`App-Set*`, `HUD-Set*`, `Player-Set*`, `Phone-*`) собраны в `stores/events.ts`. `RESET_STATE` планшета → `$reset()` обоих tablet-сторов.

### 9. formik → vee-validate
`useForm({ validationSchema, initialValues })` + `useField` вместо `<Formik>/<Field>/<ErrorMessage>`. Yup-схемы перенесены как были (в yup@1 убран устаревший `Yup.ref(name), null`). Форма внутри `WithPayment`, submit через `handleSubmit` (preventDefault из коробки).

### 10. Прочее
- `moment-timezone` → `@/utils/dayjs` (локаль ru, зона Europe/Moscow, плагины utc/timezone) — токены форматов совместимы.
- `images.getImage()` — Vite-реализация через `import.meta.glob` вместо webpack `require()`.
- HOC → композиция: `withPayment` → `<WithPayment v-slot="{ showPayment }">`, `withRotation` → `useRotation()`, `withStorage` → `useStorageInventory()`, `animated-number-react` → `use-animated-number.ts`.
- `location.state` → `history.state` (vue-router 4 пробрасывает `state` из `router.push`); служебные ключи vue-router (`back/current/forward/replaced/position/scroll`) отсекаются.
- `Browser-ShowPage` воспроизводит трюк легаси: повторное открытие той же страницы remount-ит её через промежуточный `push('/')`.

---

## Намеренные замены (без потери функциональности)

| Легаси-файл | Куда вошёл |
|---|---|
| `routes.tsx`, `components/{Player,Services,Games,Trading,Factions}/index.tsx` (массивы маршрутов) | `router/index.ts` |
| `Common/with-rotation.tsx` | `composables/use-rotation.ts` |
| `Inventory/context.ts` | provide/inject внутри `Inventory/index.vue` |
| `Inventory/with-storage.tsx` | `composables/use-storage-inventory.ts` |
| `Admin/tabs.tsx` (реестр табов) | внутри `Admin/index.vue` |
| `Player/death/index.tsx` | `Player/death.vue` |
| `serviceWorker.ts` | удалён (не использовался, SW.unregister) |
| CRA `scripts/`, `config/` | заменены Vite |

Новые служебные файлы (не существовали в легаси): `Common/rc-*.vue`, `Common/toaster.vue`, `Admin/partials/select.vue`, `Tablet/f7/*`, `Services/lsc/{chrome,github}-picker.vue`, `composables/*`.

---

## Что осталось «как в легаси» сознательно

- Баг `Business/main.vue`: интервал при смене `paymentTime` не очищается — конвертация точная.
- Кириллический идентификатор `changeСolor` в `clothing-shop` — сохранён.
- `wardrobe` (Factions) всегда отправляет `FactionWardrobe-ChangeType('hat')` при открытии — воспроизведено реальное поведение React 16 (`this.state` ещё старый в componentDidMount), с комментарием.
- Дубли ключей `:key="item"` в lsc/items — как в оригинале.

Косметические отличия: переход страниц планшета — fadeIn вместо F7-slide; аккуордеон F7 анимируется упрощённо. Функциональных отличий нет.

---

## Запуск

```bash
cd src_ui_vue
pnpm install
pnpm dev        # dev-сервер
pnpm build      # production-сборка (build/) — prebuild генерирует иконки и F7 CSS
pnpm typecheck  # только проверка типов
```

Интеграция с RAGE:MP не меняется: сборка `build/` подключается как CEF-ресурс; точки входа (`mp`, `rage-rpc`, `Browser-ShowPage`, `Browser-HidePage`) идентичны легаси.

---

## Dev-режим без RAGE:MP-клиента

`pnpm dev` (и `pnpm preview`) полностью работают в обычном браузере, без запущенной игры:

- **Мок `mp`** (`index.html`): если `window.mp` отсутствует (т.е. страница открыта не в CEF RAGE), устанавливается no-op мок (`invoke`/`trigger`/`events`) — тот же подход, что в легаси (`%NODE_ENV% === 'development'`), но без завязки на NODE_ENV. В реальном CEF мок не устанавливается, т.к. клиент инжектит `mp` до выполнения скриптов.
- **Устойчивый RPC** (`utils/rpc.ts`): мок распознаётся по флагу `__mock`. Без RAGE:
  - `rpc.register` / `rpc.unregister` сохраняют обработчики локально (код экранов выполняется как обычно);
  - `rpc.callServer` / `rpc.callClient` **мгновенно отклоняются** с понятной ошибкой вместо вечного зависания promise (экраны рендерятся с дефолтным состоянием, catch-ветки работают).
- **Эмуляция событий из консоли** — `rpcDev`:
  ```js
  rpcDev.list()                                   // какие входящие события зарегистрированы
  rpcDev.call('Browser-ShowPage', 'auth')         // открыть экран авторизации
  rpcDev.call('HUD-SetVisible', false)            // скрыть HUD
  rpcDev.call('Player-SetMoney', { cash: 5000, bank: 0, points: 10 })
  rpcDev.call('Phone-IncomingCall', '100')        // входящий звонок
  rpcDev.call('Notifications-ShowItem', 'info', 'Привет', false)
  ```
  Так можно прогнать любой экран UI в браузере, подавая те же события, что сервер шлёт в игре.

---

## Статистика

- Переписано компонентов/модулей: **317** файлов в `components/` + 5 stores + 8 utils + 5 composables + 10 f7-обёрток.
- Экранов-маршрутов: **34** (HUD, Auth, Daily, Character, Spawn, Phone, Inventory, House, Business, Dialog, Job, Admin, Player×3, Services×13, Games×1, Trading×3, Factions×5).
- Точек интеграции с сервером/клиентом: **218 RPC** + 4 `mp.*` — все сохранены.
- Грязных хаков, меняющих поведение: **0**.
