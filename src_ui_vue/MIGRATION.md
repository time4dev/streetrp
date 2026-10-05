# MIGRATION GUIDE — React → Vue 3 (StreetRP UI)

Контекст: миграция CEF-интерфейса RAGE:MP с React 16 (CRA) на Vue 3 + TS + Vite.
Правило №1: **точная конвертация**. Функциональность, RPC-имена, DOM-структура и CSS-классы
должны остаться идентичными. Никаких "улучшений".

## Файловая модель

- `src_ui/src/components/<Folder>/xxx.tsx` → `src_ui_vue/src/components/<Folder>/xxx.vue`
- Классовые компоненты → `<script setup lang="ts">` + Composition API.
- Сохраняй имена файлов (kebab-case), имена классов, имена пропсов в kebab-case в шаблонах.
- Стили уже скопированы (src/assets/styles) и импортированы глобально — НИЧЕГО не пиши в
  `<style>` блок, кроме случаев, когда старый код генерировал inline-стили (тогда `:style`).
- Импорты: `@/components/...`, `@/utils/...`, `@/stores/...`, `@/data/...`.
- Алиасы `components|utils|store|data|assets` тоже настроены, но предпочитай `@/`.

## Каркас (уже готов, не трогать)

- `main.ts`, `App.vue` (Browser-ShowPage RPC + RouterView + Chat + 2 Toaster)
- `router/index.ts` — все маршруты уже описаны (hash history, как раньше createHashHistory)
- `stores/` — Pinia: `app.ts`, `hud.ts`, `player.ts`, `phone.ts`, `tablet.ts` (+ `events.ts` с RPC)
- `utils/rpc.ts` — тот же RPC (rage-rpc)
- `utils/notifications.ts` — `showNotification(type, message, inMenu=true)` вместо react-toastify
- `utils/images.ts` — `images.getImage(name, folder?)` вместо webpack `require`
- `utils/icons.ts` — точные SVG-иконки react-icons (`IoIosClose`, `FaGasPump`, ... + тип `IconType`)
- `utils/dayjs.ts` — dayjs (ru, Europe/Moscow) вместо moment
- `components/Common/*` — порты всех общих компонентов (см. ниже)

## Основные замены

| React (legacy) | Vue (новый) |
|---|---|
| `import React from 'react'` | не нужно |
| `import classNames from 'classnames'` | `:class="[...]"/:class="{...}"` |
| `class X extends Component` | `<script setup lang="ts">` + `ref/reactive/computed/onMounted` |
| `this.state` / `this.setState` | `ref()` / `.value =` (или reactive) |
| `componentDidMount` | `onMounted` |
| `componentWillUnmount` | `onBeforeUnmount` (или `onUnmounted`) |
| `componentDidUpdate` | `watch()` |
| `render()` | `<template>` |
| JSX `{cond && <X/>}` | `<X v-if="cond" />` |
| `{list.map(item => <X key={...} />)}` | `<X v-for="item in list" :key="item.xxx" />` |
| `className={classNames('a', { b: cond })}` | `:class="['a', { b: cond }]"` |
| `style={{ left: '5%' }}` | `:style="{ left: '5%' }"` |
| `onClick={fn}` | `@click="fn"` |
| `<input value onChange />` | `<input :value="v" @input="..." />` (или v-model) |
| `React.createRef()` | `ref<HTMLElement>()` + `ref="name"` |
| `connect(mapStateToProps)(X)` | `const player = usePlayerStore()` — поля/действия напрямую |
| redux actions (`store/*/actions`) | методы Pinia-стора (уже созданы) |
| `CSSTransition classNames="alert" timeout={300}` | `<Transition name="alert">` (алиасы в vue-transitions.scss) |
| `CSSTransition timeout={0}` | просто `v-if` (без Transition — анимации не было) |
| `unmountOnExit` | `v-if` |
| react-icons `import { IoIosClose } from 'react-icons/io'` | `import { IoIosClose } from '@/utils/icons'` (имена идентичны) |
| formik `Formik/Form/Field/ErrorMessage` | vee-validate 4 (см. раздел "Формы") |
| yup `import * as Yup from 'yup'` | `import * as yup from 'yup'` — yup@1, API тот же |
| moment / moment-timezone | `import dayjs from '@/utils/dayjs'`; `moment(...)` → `dayjs(...)`, `moment.tz` → `dayjs.tz` |
| `lodash` | `lodash-es` (именованные импорты те же) |
| react-router `useHistory/location` | `useRouter()/useRoute()`; **state маршрута** — `history.state` (см. ниже) |
| `<Route>`-экран | страница-компонент, уже прописан в `router/index.ts` |
| react-toastify | `showNotification(...)` из `@/utils/notifications` |
| `require('../assets/images/x.png')` | `images.getImage('x.png')` / `images.getImage('x.png', 'folder')` |
| HOC `withPayment(X)` | обёртка `<WithPayment v-slot="{ showPayment }">` |
| HOC `withRotation(X)` | вызов `useRotation()` в setup |
| `animated-number-react` | готовый порт внутри `Common/total-price.vue` |

## Стор (Pinia)

Старые экшены/редьюсеры уже в сторах, имена методов совпадают со старыми action-креаторами:

```ts
import { usePlayerStore } from '@/stores/player';
const player = usePlayerStore();
player.money.cash          // state
player.setSatiety(50)      // action (мутирует стор, компоненты обновятся)
```
- app: `date`, `online`, `chat`, `setDate`, `sendMessage`, `setOnline`
- hud: `visible`, `tasks`, `capture`, `setVisible`, `setCapture`
- player: `id`, `satiety`, `money`, `tasks`, `bonus`, `setSatiety`, `setMoney`, `setTasks`, `setId`, `setBonus`
- phone: `call`, `wallpaper`, `setCall`, `acceptCall`, `setWallpaper`
- tablet: `useTabletMembersStore()` (items, loadMembers, updateMember, removeMember, resetMembers, reset), `useTabletRanksStore()` (items, loadRanks, reset)

## Формы (formik → vee-validate)

Шаблон конвертации Formik-формы:

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const validationSchema = yup.object({ /* тот же схема из старого кода */ });

const { handleSubmit, setFieldError, values, errors } = useForm({
	validationSchema,
	initialValues: { /* те же initialValues */ }
});

const onSubmit = handleSubmit(async (formValues) => {
	// тело старого onSubmit; setFieldError доступна как раньше
});
</script>

<template>
	<form class="..." @submit="onSubmit">...</form>
</template>
```

- Старый `<Field name="x">` → локальный компонент на `useField` (как в `Auth/field.vue`) — просто
  переиспользуй/скопируй этот паттерн.
- `<ErrorMessage name="x" component="p" className="..."/>` → `<p v-if="errors.x" :class="...">{{ errors.x }}</p>`.
- `formik.values.x` → `values.x`, `formik.setFieldValue(x, v)` → из `useForm()` `setFieldValue`.
- `actions.setSubmitting` игнорировать (не использовался критично), если нужен — `isSubmitting` из useForm.

## Роутинг и state маршрута

- Экран получает данные через `history.push(path, data)` (Browser-ShowPage). В Vue эти данные
  лежат в `history.state` (vue-router 4 пробрасывает их). Чтение:
  ```ts
  const state = history.state as { email?: string };
  ```
  Читать в `onMounted` (эквивалент componentDidMount, как раньше из location.state).
- `history.push('/x', data)` → `router.push({ path: '/x', state: data })`.
- `history.goBack()` → `router.back()`.
- location.pathname → `route.path`.

## RPC

- `rpc.register('Event', cb)` — те же имена. В компонентах регистрировать в `onMounted` и
  снимать через `rpc.unregister('Event')` в `onBeforeUnmount` (как в with-storage).
- Если старый код регистрировал события глобально при импорте модуля (events.ts) — они уже
  перенесены в `stores/events.ts`.
- `mp.invoke`, `mp.events.add/remove` — те же вызовы (тип `mp` глобальный).
- Внимание: `mp.events.add(name, cb)` в чате — снимать через `mp.events.remove(name, cb)` при
  размонтировании, если старый код этого не делал и компонент живёт вечно (Chat) — не снимать.

## Общие компоненты (components/Common)

| Файл | Использование |
|---|---|
| `gradient-button.vue` | props: type, color, className, disabled, form; слот — текст; @click |
| `outline-button.vue` | props: type, className, disabled, form, isClose; @click (isClose сам зовёт Browser-HidePage) |
| `primary-title.vue` | props: className; слот |
| `hint.vue` | props: className, action ('click'|'drag'|'exit'); слот |
| `point.vue` | props: className, amount |
| `outline-input.vue` | props: value, min, max, className; @change(number) |
| `selector.vue` | props: items, value, circleButton, customValue, title, className; @change(value) |
| `total-price.vue` | props: value, formatter, title, className, titleClassName, valueClassName |
| `with-payment.vue` | `<WithPayment v-slot="{ showPayment }"> ... </WithPayment>` |
| `@/composables/use-rotation.ts` | `useRotation()` в setup страницы (Character/Spawn) |
| `rc-slider.vue` | props: value, min, max, step, disabled; @change(number). Классы rc-slider |
| `rc-circle.vue` | props: percent, strokeWidth, trailWidth, strokeColor, trailColor, strokeLinecap, gapDegree, gapPosition, className |
| `rc-checkbox.vue` | props: checked, disabled, className; @change(checked) |
| `rc-tabs.vue` / `rc-tab-pane.vue` | `<RcTabs prefixCls="admin_tabs" tab-position="left" destroy-inactive-tab-pane>` + `<RcTabPane :tab-key="i" :tab="name" :disabled="...">` |
| `toaster.vue` | уже в App.vue, не трогать |

## Композаблы

Общие композаблы лежат в `src/composables/`:
- `use-rotation.ts` — порт HOC `withRotation` (вращение персонажа мышью).
- `use-animated-number.ts` — порт `animated-number-react` (твин числа).
- `use-dnd.ts` — заменитель react-dnd для инвентаря (drag&drop на pointer events).
- `use-storage-inventory.ts` — порт HOC `withStorage` (состояние инвентаря/хранилища).
- `use-tablet-router.ts` — заменитель роутера Framework7 внутри планшета (стек страниц + props).

Новые композаблы тоже создавай там (`use-<name>.ts`), а не внутри компонентов.

## Служебное

- `props.location.state` в типах — заменять на чтение `history.state`.
- `this.props.history` — не использовался, кроме push (см. выше).
- Ссылки между экранами внутри Phone/Tablet: Phone — свой внутренний роутер уже спроектирован
  (см. phone/index.vue), Tablet — вложенный vue-router (см. tablet/index.vue).
- НЕ добавлять новые npm-пакеты. Не менять stores/utils/router/Common без необходимости.

## Проверка перед коммитом задачи

- `pnpm typecheck` (из src_ui_vue) — 0 ошибок в твоих файлах.
- Сверить список файлов старой папки с новой: каждый .tsx/.ts → .vue/.ts 1:1.
- Сверить RPC-имена (`grep rpc.register/callServer/callClient`) со старыми файлами.
