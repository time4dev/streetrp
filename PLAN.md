# План перехода StreetRP: RAGE MP → FiveM (Qbox, Lua, MariaDB)

Дата: 10.10.2026 · Статус: утверждаемый план, реализация не начата.

## 1. Принятые решения

| Вопрос | Решение |
|---|---|
| Платформа | FiveM (FXServer, OneSync, txAdmin) |
| Фреймворк | **Qbox**. На сервере стоит стандартный шаблон [`Qbox-project/txAdminRecipe/qbox.yaml`](https://raw.githubusercontent.com/Qbox-project/txAdminRecipe/main/qbox.yaml) |
| Язык игровой логики | **Lua 5.4** (`lua54 'yes'`) на сервере и клиенте. TypeScript-код не переносится, логика переписывается |
| СУБД | **MariaDB** через `oxmysql`. MongoDB и Redis выводятся из эксплуатации полностью |
| Данные игроков | **Чистый старт.** Аккаунты, персонажи, машины и имущество не переносятся. Из MongoDB берётся только статика: бизнесы, дома, фракции и ранги, зоны банд, сервисы, работы, каталог одежды, промокоды |
| Интерфейс | Существующий **Vue 3 UI** (`src_ui_vue`) работает как NUI. Это единственная часть на JS: NUI — это браузер, и на Lua его не написать. Транспорт `rage-rpc` заменяется NUI-мостом |
| Инвентарь | **`ox_inventory`** (логика и хранение). Его web-интерфейс перерисовывается в дизайне инвентаря StreetRP (раздел 4.4) |
| Голод и жажда | Обе потребности: `metadata.hunger` и `metadata.thirst` Qbox. В HUD появляется индикатор жажды, в игру добавляются напитки |
| Почта | **Mailtrap** Email Sending API (HTTP) |
| Принцип | Где у Qbox/ox есть стандартная система хранения, она становится **единственным владельцем данных**: персонаж, деньги, инвентарь, группы, транспорт, внешность. Механики и экраны StreetRP пишутся ресурсами `srp_*` и работают с Qbox только через публичные exports. Стандартные ресурсы рецепта, которые дублируют механики StreetRP, отключаются (раздел 3.1) |

Цель — перенести **весь функционал** StreetRP с сохранением поведения: формулы, цены, ограничения, сценарии.

## 2. Что переносим (инвентаризация репозитория)

| Часть | Объём |
|---|---|
| Сервер `src_server/src` | 241 TS-модуль, ~16 000 строк |
| Клиент `src_client/src` | 99 TS-модулей, ~9 000 строк |
| UI `src_ui_vue` | 39 маршрутов, 218 RPC-имён (см. `CONVERTATION.md`) |
| Модели Mongo | 16: User, Character, Vehicle, House, Business, Faction (ranks/members), GangZone, Job, Service, Clothes, Promo, Report, Token, Wanted, AdminLog/FactionLog, Counter |
| Статические данные в `database.sql` | businesses 64, houses 26, factions 9, gangzones 90, services 21, jobs 5, clothes 989 |
| Предметы (`data/inventory.json`) | 81: weapon 32, fish 11, clothes 9, tool 8, food 4, alcohol 4, ammo 3, armor 3, backpack 3, drugs 2, medicine 2 |
| Фракции | sang (армия), lspd, ems, armenian (мафия), ballas, vagos, bloods, families, marabunta |
| Работы | Building, Waterfront, Postal, Car_Theft, Smuggling (+ уровни, кулдауны) |
| Сервисы | gas, supermarket, licenses, 4 автосалона + bike/boat/air shop, weapons, clothing_shop, lscustoms, passport, tattoo_shop, barbershop, surgeon, bank, scooter/boat rent, vehicle_dump, fish_sale |
| Внешние интеграции | Express API (`POST /api/donation`, `GET /api/players`), почта (коды и сброс пароля), погода (`WEATHER_KEY`, `WEATHER_CITY`), Redis (только логи) |
| Ассеты | `client_packages/game_resources` (dlcpacks — внешний архив), `dotnet/vehicleData.json` |

`database.sql` — это дамп команд MongoDB с `drop()`, а не SQL. Импортировать его в MariaDB напрямую нельзя: он идёт на вход скрипта импорта статики (раздел 6).

## 3. Соответствие механик StreetRP и Qbox

| Домен StreetRP | Чем становится в FiveM | Владелец данных | Примечание |
|---|---|---|---|
| Аккаунт | Вход по `license` FiveM; при первом входе привязка email с подтверждением кодом через Mailtrap | `srp_accounts` | Пароль не нужен. Email служит для доната, связи и восстановления доступа при смене license (код на почту) |
| Персонаж (один на аккаунт) | Персонаж Qbox, 1 слот; экраны создания и выбора — Vue (`useExternalCharacters`) | `qbx_core` (`players`) | Встроенный выбор персонажа и `qbx_spawn` выключаются |
| Внешность, одежда, тату, барбер, хирург | `illenium-appearance` как хранилище и применение внешности; экраны магазинов — Vue | `playerskins` | Каталог `clothes` (989 позиций с ценами) — Lua-конфиг `srp_services` |
| Деньги cash/bank | `AddMoney/RemoveMoney` Qbox | `qbx_core` | Номер счёта в metadata |
| Банк (сервис) | Vue-экран банка + `srp_services` | `qbx_core` | `Renewed-Banking` выключается |
| Донат-валюта (`User.donate`) | Таблица на уровне аккаунта | `srp_accounts` | В money Qbox не кладём |
| Голод и жажда | `metadata.hunger` / `metadata.thirst` Qbox | `qbx_core` | Скорость убыли и эффекты на нуле — формулы StreetRP для голода, для жажды новые (согласовать). Где идёт убыль (`qbx_core` или `qbx_medical`), проверить на этапе 0 |
| Здоровье, смерть, лечение | `srp_player` (смерть, экран `player/death`) + `srp_police` (EMS) | metadata `isdead` | `qbx_medical` и `qbx_ambulancejob` выключаются |
| Опыт, навыки, задания, playedTime, payday/bonus-таймеры, лицензии | metadata персонажа (`srp_*` ключи) | `qbx_core` | |
| Инвентарь (ячейки, вес, стаки, экипировка, рюкзак) | `ox_inventory` с интерфейсом в дизайне StreetRP | `ox_inventory` | `cell` → `slot = cell + 1`, `amount` → `count`, `data` → `metadata` |
| Хранилища дома, фракции, багажник | Stash'и и trunk ox_inventory | `ox_inventory` | ID: `house:<id>`, `faction:<name>` |
| Оружие, патроны, броня | Предметы ox_inventory + урон по частям тела | `ox_inventory` + `srp_combat` | |
| Транспорт (владение, номер, топливо, тюнинг, состояние) | `player_vehicles` через exports `qbx_vehicles` | `qbx_vehicles` | `govNumber` → `plate` (≤ 8 символов). `vehicleSlots`, история владельцев — `srp_vehicles` |
| Ключи | `qbx_vehiclekeys` + правила замка из `vehicle/lock.ts` | — | |
| Топливо и АЗС | Расход и заправка StreetRP; значение в statebag `fuel` | `player_vehicles.fuel` | `ox_fuel` выключается (иная модель расхода и свой UI) |
| Автосалоны, аренда, свалка, LSC, продажа машин | `srp_services` / `srp_vehicles` + Vue | `qbx_vehicles` | `qbx_vehicleshop`, `qbx_vehiclesales`, `qbx_customs`, `qbx_garages` выключаются |
| Фракции lspd / ems / sang | Jobs Qbox `police`, `ambulance`, `army` | `qbx_core` (`player_groups`) | Касса, материалы, права рангов, журнал — `srp_factions`. `qbx_management` выключается (управление — Vue-планшет) |
| Банды и мафия | Gangs Qbox | `qbx_core` | Захваты, 90 зон — `srp_gangs` |
| Ранги с правами и зарплатой | Грейды job/gang + `srp_faction_grades` | смешанно | Правку рангов в игре через exports `qbx_core` проверить на этапе 1 |
| Розыск, штрафы, тюрьма, наручники, мешок | `srp_police` | `srp_wanted` | `qbx_police` и `xt-prison` выключаются |
| Работы (5 шт.) | Свои ресурсы, не job Qbox (слот job занят фракцией) | `srp_jobs` | Уровни и кулдауны в metadata |
| Дома (26) | `srp_housing`, изоляция через routing buckets | `srp_houses` | `qbx_properties` выключается |
| Бизнесы (64) | `srp_business` | `srp_businesses` | |
| PayDay | `srp_payday`; paycheck Qbox отключён в конфиге | — | Иначе зарплата начислится дважды |
| Паспорт, лицензии (сервисы) | Vue-экраны + `srp_services` | metadata | `qbx_idcard`, `qbx_cityhall` выключаются |
| Телефон (номер, контакты, звонки, ЧС) | Vue-телефон + `srp_phone`; звонки — каналы `pma-voice` | номер — `charinfo.phone`, остальное — `srp_phone_*` | `npwd` и `npwd_qbx_*` выключаются |
| Голос | `pma-voice` + обёртка `srp_voice` (смерть, мут, дистанция) | — | `mm_radio` — только если рация нужна фракциям (раздел 11) |
| HUD, спидометр | Vue HUD (+ жажда) | — | `qbx_hud` выключается |
| Чат | Vue-чат; команды через `RegisterCommand` / `lib.addCommand` | — | `chat` и `qbx_chat_theme` выключаются |
| Target-меню игрока и машины | `ox_target` | — | Действия `player/target/*` регистрируются как опции; Vue-экран Target не используется. `qbx_radialmenu` выключается |
| Двери | `ox_doorlock` | `ox_doorlock` | Импорт `data/doors.json` |
| Анимации, сценарии | `srp_player` по `data/animations.json`, `scenarios.json` | — | `scully_emotemenu` оставить только если не конфликтует с биндами StreetRP |
| Админка, репорты, деморган, журнал | Vue-админка + `srp_admin`; права через ACE | `srp_admin_*`, `bans` Qbox | `qbx_adminmenu` — только на dev-стенде |
| Награды, промо, рефералы, ежедневный бонус | `srp_awards` | `srp_promo*`, metadata | |
| Донат-API | `SetHttpHandler` в Lua: HMAC-подпись и идемпотентность по ID платежа | `srp_accounts`, `srp_donations` | Сейчас `POST /api/donation` работает без авторизации — в новой версии это закрывается |
| Погода и время | `srp_world`: реальная погода по HTTP → `Renewed-Weathersync` | — | Московское время |
| Зелёные зоны, AFK, FPS, катсцены, nametags, спектатор, fly, ESP | Клиентские модули `srp_world` / `srp_admin` | — | Конфликтующие модули `qbx_smallresources` (AFK-кик и т. п.) выключить в его конфиге |
| Мини-игры (lockpick, рыбалка) | Vue-экраны + Lua | — | |
| Логи (Redis) | Таблица `srp_logs` | MariaDB | Redis удаляется |
| Почта | Mailtrap Email Sending API через `PerformHttpRequest` | — | Раздел 4.5 |

### 3.1. Ресурсы шаблона Qbox: что оставить и что выключить

Список ниже снят с `qbox.yaml`. Фактические версии на сервере нужно зафиксировать на этапе 0.

| Решение | Ресурсы |
|---|---|
| **Оставить: основа** | `oxmysql`, `ox_lib`, `qbx_core`, `ox_inventory` (с новым web-UI), `ox_target`, `ox_doorlock`, `qbx_vehicles`, `qbx_vehiclekeys`, `pma-voice`, `illenium-appearance`, `Renewed-Weathersync`, `cfx-server-data` (кроме `chat`) |
| **Оставить: окружение** | `bob74_ipl`, `qbx_density`, `qbx_smallresources` (с ревизией конфига), `qbx_invimages` (как источник иконок, если нужных нет в StreetRP), `screencapture`, `MugShotBase64`, `mana_audio`, `loadscreen` (оформить под StreetRP) |
| **Выключить: дублируют StreetRP** | `qbx_hud`, `qbx_spawn`, `qbx_vehicleshop`, `qbx_vehiclesales`, `qbx_garages`, `qbx_customs`, `qbx_carwash`, `qbx_police`, `qbx_ambulancejob`, `qbx_medical`, `xt-prison`, `qbx_properties`, `qbx_management`, `qbx_cityhall`, `qbx_idcard`, `Renewed-Banking`, `ox_fuel`, `npwd`, `npwd_qbx_garages`, `npwd_qbx_mail`, `qbx_npwd`, `qbx_radialmenu`, `chat`, `qbx_chat_theme`, `qbx_adminmenu` (на проде) |
| **Выключить на запуске: контент, которого нет в StreetRP** | Работы `qbx_busjob`, `qbx_garbagejob`, `qbx_taxijob`, `qbx_towjob`, `qbx_truckerjob`, `qbx_newsjob`, `qbx_mechanicjob`, `qbx_recyclejob`, `qbx_vineyard`, `qbx_diving`, `qbx_divegear`; ограбления `qbx_bankrobbery`, `qbx_storerobbery`, `qbx_jewelery`, `qbx_truckrobbery`, `qbx_houserobbery`, `safecracker`, `mhacking`, `ultra-voltlab`; прочее `qbx_drugs`, `qbx_weed`, `qbx_pawnshop`, `qbx_scrapyard`, `qbx_lapraces`, `qbx_streetraces`, `qbx_fireworks`, `qbx_binoculars`, `qbx_seatbelt`, `qbx_scoreboard`, `mm_radio` |
| **Решить на этапе 1** | `vehiclehandler` (может конфликтовать с `vehicle/health` StreetRP), `scully_emotemenu`, `pillbox` (MLO больницы: оставить, если координаты `data/hospitals.json` будут под него переписаны) |

Контент из четвёртой строки можно включать после запуска как новые возможности. Это отдельное продуктовое решение, к паритету оно не относится. Перед выключением каждого ресурса нужно проверить, что от него не зависит что-то из оставленного (`dependencies` в `fxmanifest.lua`).

## 4. Целевая архитектура

```text
Vue UI (NUI, src_ui_vue/build)          ox_inventory web (React, дизайн StreetRP)
   ↕  SendNUIMessage / NUI callbacks              ↕  (родной мост ox_inventory)
srp_ui (client Lua: мост RPC, фокус)    ox_inventory (Lua, без изменений)
   ↕  lib.callback / события
srp_* (server Lua: игровые правила)
   ├─ exports qbx_core / qbx_vehicles / ox_inventory / pma-voice / illenium-appearance
   ├─ PerformHttpRequest → Mailtrap, погодный API
   └─ oxmysql → MariaDB (таблицы Qbox + srp_*)
```

### 4.1. Ресурсы

Ресурсы группируются по доменам: отдельный ресурс на каждый файл не нужен. Все лежат в `resources/[streetrp]/`.

| Ресурс | Содержимое (откуда переносится) |
|---|---|
| `srp_core` | Конфиг, утилиты (vectors, errors, logger), миграции схемы, `srp_logs`, аккаунты, привязка email, почта, донат-валюта (`auth/*`, `utils/*`, `basic/logs`) |
| `srp_ui` | Сборка Vue как `ui_page`, RPC-мост, фокус, чат (`helpers/browser`, `helpers/events`) |
| `srp_player` | Создание и выбор персонажа, спавн, HUD, голод и жажда, алкоголь, наркотики, смерть, лицензии, документы, уровни, follow, nametags, friends, анимации (`player/*`, `basic/hud`) |
| `srp_items` | Определения предметов для `ox_inventory` и обработчики использования (`data/inventory.json`, `player/inventory`, `player/equipment`) |
| `srp_combat` | Урон, броня, синхронизация оружия (`basic/weapons`, `weapons/*`) |
| `srp_vehicles` | Спавн, despawn, топливо, здоровье, тюнинг, пассажиры, сделки, спидометр, круиз, автопилот, rappelling (`vehicle/*`) |
| `srp_housing` | Дома (`house/*`, `trading/house`) |
| `srp_business` | Бизнесы (`business/*`, `trading/business`) |
| `srp_services` | Все 21 сервис, автосалоны, тест-драйв, аренда, PayDay (`services/*`, `basic/payday`) |
| `srp_jobs` | 5 работ, уровни, кулдауны, рабочий транспорт (`jobs/*`) |
| `srp_factions` | Ядро фракций: касса, материалы, склад, гардероб, мастерская, гараж, планшет, журнал, поставки |
| `srp_police` | lspd/army/ems: розыск, штрафы, вызовы, тюрьма, лечение, мед. лицензии, наручники, мешок |
| `srp_gangs` | Банды, мафия, зоны, захваты, форт (`factions/gangs`, `mafia`, `wars`) |
| `srp_phone` | Телефон, контакты, звонки, ЧС (`phone/*`) |
| `srp_admin` | Команды, панель, баны, репорты, деморган, телепорт, наблюдение (`admin/*`) |
| `srp_awards` | Ежедневные награды, бонус, рефералы, задания, промо, донат-API (`awards/*`, `donation`, `api/*`) |
| `srp_world` | Погода, время, зелёные зоны, AFK, античит, двери, сценарии, waypoint, катсцены (`basic/*`) |
| `srp_games` | Lockpick, рыбалка (`games/*`, `services/fishing`) |
| `srp_assets` | stream: модели, одежда, карты (`game_resources`) |

Порядок в `server.cfg`: `oxmysql` → `ox_lib` → `qbx_core` → оставленные ресурсы Qbox/ox → `srp_core` → `srp_ui` → остальные `srp_*`.

### 4.2. Правила кода

- Сервер — источник истины. Клиент шлёт намерение, сервер берёт `source` из контекста события и проверяет дистанцию, права, деньги и частоту запросов.
- В событиях передаются ID (`citizenid`, `netId`, ID дома), а не объекты. `source` никогда не пишется в БД.
- Публичное состояние (фракция для nametag, двигатель, замок, топливо) — через statebags. Приватное (деньги, инвентарь) в публичные statebags не попадает.
- Деньги и предметы меняются только через exports Qbox/ox_inventory. Покупка: `RemoveMoney`, затем выдача; если выдача не удалась, деньги возвращаются и событие пишется в лог. Многотабличные операции `srp_*` — через `MySQL.transaction`.
- Каждый NUI callback обязательно отвечает (`cb(...)`), у каждого серверного callback есть таймаут.
- Статические данные лежат в `shared/*.lua`, тексты — в `locales/ru.json` (`ox_lib` locale).
- При `onResourceStop` удаляются созданные сущности, блипы и зоны, снимается фокус NUI.

### 4.3. Мост Vue UI (замена `rage-rpc`)

Меняется только `src_ui_vue/src/utils/rpc.ts`, интерфейс остаётся прежним, поэтому 218 RPC-имён и экраны не трогаются:

| Вызов во Vue | Реализация в NUI |
|---|---|
| `rpc.callServer(name, args)` | `fetch('https://srp_ui/callServer', {name, args})` → client Lua `lib.callback.await('srp:'..name, ...)` → ответ в `cb` |
| `rpc.callClient(name, args)` | `fetch('https://srp_ui/callClient', ...)` → обработчик из клиентского реестра → `cb` |
| `rpc.register(name, fn)` | `window.addEventListener('message')`; Lua шлёт `SendNUIMessage({rpc = name, args = ...})` |
| `mp.invoke('focus')` и т. п. | `SetNuiFocus` через callback `srp_ui/focus` |
| `Browser-ShowPage` / `Browser-HidePage` | Экспорты `srp_ui:ShowPage(page, data)` / `HidePage()` |

Серверный RPC в Lua: `srp.rpc.register('Inventory-Use', function(source, ...) ... end)` — обёртка над `lib.callback.register` с валидацией и rate-limit. Соответствие «имя RPC в TS → обработчик в Lua» проверяется скриптом-реестром.

`vite.config.ts`: `base: './'`; сборка копируется в `srp_ui/web/`, в манифесте — `ui_page 'web/index.html'` и `files {'web/**'}`.

Экраны, которые уходят в стандартные ресурсы, во Vue-маршрутизации отключаются: `/inventory` (ox_inventory), Target (`ox_target`). Остальные 37 маршрутов работают через мост.

### 4.4. Инвентарь: ox_inventory в дизайне StreetRP

Логика `ox_inventory` (Lua) не меняется, иначе каждое обновление превращается в ручной мерж. Меняется только web-интерфейс:

1. Форк `overextended/ox_inventory`; правки только в `web/` (React + TypeScript + Vite). Upstream подключён вторым remote, обновления подтягиваются rebase'ом.
2. Перенести визуал из `src_ui_vue/src/components/Inventory`: сетку ячеек, карточку предмета, полосу веса, слоты экипировки, контекстное меню, вторичный инвентарь (багажник, дом, склад фракции, земля), хотбар. Стили, шрифты и иконки берутся из `src_ui_vue/src/assets`.
3. Экипировку одежды StreetRP (9 слотов: hat, jacket, shirt, pants, shoes, glasses, mask, accessories, watch) реализовать предметами с `metadata` + хуками `ox_inventory` (`registerHook('swapItems')`) в `srp_items`. Это возможно без форка Lua-части; проверить на этапе 1.
4. Рюкзак (3 типа): контейнер-предмет ox_inventory, вместимость и вес — из `data/inventory.json`.
5. Иконки предметов: `ox_inventory/web/images/<item>.png` из ассетов StreetRP, недостающие — из `qbx_invimages`.

**Готово:** визуальное сравнение со скриншотами текущего инвентаря StreetRP, все действия (drag&drop, split, use, give, drop, экипировка) работают.

### 4.5. Почта через Mailtrap

- Отправка: `PerformHttpRequest('https://send.api.mailtrap.io/api/send', cb, 'POST', body, {['Authorization'] = 'Bearer '..token, ['Content-Type'] = 'application/json'})`. Отправитель — домен, подтверждённый в Mailtrap.
- На dev-стенде — Mailtrap Sandbox (письма не уходят наружу, видны в Inbox Mailtrap).
- Токен хранится в `set srp_mailtrap_token "..."` в серверном конфиге (не `setr`, чтобы не попадал на клиент) и в git не коммитится.
- Шаблоны писем (код подтверждения, восстановление доступа) переносятся из `utils/mailer.ts` в `srp_core/templates/`.
- Коды: 6 цифр, срок 15 минут, не более 3 писем в час на аккаунт, хранятся в `srp_email_codes`.

### 4.6. Голод и жажда

- Убыль: тик раз в N минут уменьшает `hunger` по формуле StreetRP (`player/hunger.ts`) и `thirst` по новой формуле (по умолчанию быстрее голода, значения в `srp_player/shared/config.lua`). Встроенную убыль Qbox либо настроить на эти значения, либо отключить, чтобы не было двойного списания.
- Эффекты на нуле: урон здоровью и ограничения бега — как у голода в StreetRP, жажда аналогично.
- Предметы: добавить напитки (вода, газировка, кофе, сок) с `thirst`-значениями; алкоголь (4 шт.) получает `thirst` и сохраняет эффект опьянения; ассортимент супермаркета дополняется.
- HUD: индикатор жажды в стиле индикатора сытости StreetRP; Vue-стор `hud` получает `setThirst`, RPC `HUD-SetThirst`.

## 5. Схема MariaDB

Стандартные таблицы Qbox и ox (`players`, `player_groups`, `player_vehicles`, `playerskins`, `bans`, `ox_inventory`, `ox_doorlock`) **не меняются**: данные в них пишутся только через API ресурсов. Свои таблицы имеют префикс `srp_`, движок InnoDB, кодировку utf8mb4. Деньги хранятся в `BIGINT`.

| Таблица | Поля (основные) | Источник |
|---|---|---|
| `srp_accounts` | `id` PK, `license` UNIQUE, `email` UNIQUE NULL, `email_verified`, `donate` BIGINT, `admin_lvl`, `referral_award`, `created_at`, `last_login` | User |
| `srp_account_ips` | `account_id`, `ip`, `seen_at` | User.ip |
| `srp_email_codes` | `account_id`, `email`, `code_hash`, `type`, `expires_at`, `attempts` | Token |
| `srp_donations` | `payment_id` UNIQUE, `account_id`, `amount`, `created_at` | Новое (идемпотентность) |
| `srp_houses` | `id`, `type`, `x,y,z,h`, `owner_citizenid` NULL, `locked`, `paid_days`, `price` | House + `data/houses.json` |
| `srp_businesses` | `id`, `name`, `x,y,z`, `price`, `income`, `owner_citizenid`, `paid`, `payment_time` | Business |
| `srp_factions` | `name` PK, `money` BIGINT, `materials` | Faction |
| `srp_faction_grades` | `faction`, `grade`, `name`, `salary`, `permissions` JSON | Faction.ranks |
| `srp_faction_logs` | `faction`, `citizenid`, `action`, `thing`, `amount`, `created_at` | FactionLog |
| `srp_gang_zones` | `id`, `x,y,z`, `owner_gang`, `captured_at` | GangZone |
| `srp_wanted` | `id`, `creator`, `suspect`, `priority`, `reason`, `created_at` | Wanted |
| `srp_vehicle_history` | `plate`, `citizenid`, `owned_from`, `owned_to` | Vehicle.oldOwners |
| `srp_phone_contacts` | `citizenid`, `name`, `number` | phone.contacts |
| `srp_phone_blacklist` | `citizenid`, `number` | phone.blacklist |
| `srp_promo` / `srp_promo_uses` | `code` UNIQUE, `owner_account`, `income`, `bonus` / `code`, `account_id` | Promo |
| `srp_reports` | `id`, `sender`, `admin`, `message`, `created_at` | Report |
| `srp_admin_logs` | `admin`, `target`, `action`, `note`, `created_at` | AdminLog |
| `srp_logs` | `channel`, `payload` JSON, `created_at` | Redis-логи |
| `srp_schema_version` | `version`, `applied_at` | Миграции |

Номер телефона хранится в `charinfo.phone` Qbox; уникальность проверяет `srp_phone` при генерации номера.

Статические данные, которые меняет только разработчик: позиции 21 сервиса, чекпоинты 5 работ, каталог одежды (989), предметы, координаты фракций, больницы, тюрьма, анимации. Они лежат в `shared/*.lua` ресурсов, а не в БД.

Миграции схемы — `srp_core/sql/NNN_name.sql`, применяются при старте `srp_core` по `srp_schema_version`.

## 6. Импорт статики из MongoDB

Данные игроков не переносятся. Импортируется только статика:

1. `mongoexport --jsonArray` по коллекциям businesses, houses, factions, gangzones, services, jobs, clothes, promos. Если живой базы нет, источник — `database.sql`, развёрнутый во временный MongoDB.
2. Одноразовый ресурс `srp_import` (Lua, команда в серверной консоли) читает JSON через `LoadResourceFile` + `json.decode`:
   - businesses, houses, factions (+ ranks → `srp_faction_grades`), gangzones, promos пишет в таблицы `srp_*`. Владельцы (`owner`) обнуляются, кассы фракций и `paid` — к стартовым значениям;
   - services, jobs, clothes выгружает в `shared/*.lua` либо сверяет с готовыми конфигами.
3. Отчёт: количество записей по коллекциям и расхождения с дампом.

Исходный MongoDB-дамп архивируется вне сервера и в работе не используется.

## 7. Этапы

Оценки даны в рабочих днях одного Lua-разработчика, знакомого с FiveM/Qbox. Это ориентир, уточняется после этапа 1.

### Этап 0. Эталон и окружение (3–5 дн.)
1. Поднять копию RAGE-сервера и записать эталонные сценарии по каждому домену таблицы 3: вход, условия, цифры, результат.
2. Dev-стенд: копия Qbox-сборки, отдельная БД MariaDB, git-репозиторий `resources/[streetrp]`, версии всех ресурсов шаблона зафиксированы.
3. Применить раздел 3.1: выключить ресурсы, проверить зависимости, проверить запуск чистого сервера.
4. Скрипт-реестр: все `mp.events.add`, `rpc.register`, `callServer`/`callClient` (имя → файл) — по нему отслеживается прогресс.
5. Аккаунт Mailtrap: подтвердить домен, получить токены Sandbox и Sending.

**Готово:** реестр механик, dev-стенд с урезанным шаблоном, закрыты вопросы раздела 11.

### Этап 1. Каркас и ключевые риски (6–9 дн.)
1. `srp_core`: конфиг, логгер, миграции, `srp_accounts`, отправка письма через Mailtrap.
2. `srp_ui`: Vue как NUI + RPC-мост; HUD читает деньги, голод и жажду из Qbox.
3. Прототипы:
   - покупка → предмет в `ox_inventory` → экипировка одежды через хук → перенос в багажник → reconnect;
   - каркас форка `ox_inventory/web` в стиле StreetRP;
   - изменение грейда фракции в рантайме через exports `qbx_core`;
   - урон по частям тела и броня в сравнении с эталоном;
   - вход в дом через routing bucket с двумя игроками.

**Готово:** UI работает в игре, RPC идут через мост, по каждому прототипу записан результат. Если механику не удаётся воспроизвести без форка Lua-части Qbox/ox, решение принимается здесь.

### Этап 2. Игрок (8–12 дн.)
Вход по license, привязка email с кодом, создание и выбор персонажа (Vue) → `illenium-appearance`, спавн, HUD, голод и жажда (раздел 4.6), здоровье, смерть, лицензии, паспорт, уровни и опыт, сохранение позиции, AFK, nametags, друзья, follow, анимации и attachments.

**Готово:** персонаж создаётся, сохраняется и восстанавливается после рестарта; экраны `player/*` работают.

### Этап 3. Инвентарь, предметы, оружие (12–18 дн.)
Перерисовка web-UI `ox_inventory` (раздел 4.4); 81 предмет + напитки в формате `ox_inventory`; обработчики use (еда, напитки, алкоголь, наркотики, аптечки, броня, рюкзак, инструменты); экипировка одежды; оружие, патроны, урон, броня (`srp_combat`); предметы на земле, передача между игроками.

**Готово:** UI совпадает с дизайном StreetRP; нет дюпа и потерь при параллельных операциях и reconnect; боевые сценарии совпадают с эталоном.

### Этап 4. Транспорт и сервисы (12–18 дн.)
`srp_vehicles` (владение через `qbx_vehicles`, ключи, замок, топливо, здоровье, тюнинг, багажник, сделки, despawn, спидометр, круиз, автопилот), автосалоны и тест-драйв, аренда, свалка, АЗС, LSC, супермаркет, оружейный, одежда, барбер, тату, хирург, банк, лицензии, паспорт.

**Готово:** все 21 сервис проходят эталонные сценарии; цены и формулы совпадают.

### Этап 5. Недвижимость и экономика (8–12 дн.)
Дома (вход, изоляция, замок, stash, налоги, продажа), бизнесы (покупка, доход, налоги, продажа), PayDay, `trading/*`.

**Готово:** операции переживают рестарт; налоги и PayDay совпадают с эталоном за N циклов.

### Этап 6. Работы (8–12 дн.)
Building (driver/mover/welder), Waterfront (forklift/handler/mover), Postal (courier/driver/warehouse), Car_Theft (cheap/middle/premium), Smuggling; уровни, кулдауны, рабочий транспорт.

### Этап 7. Фракции (15–22 дн.)
Ядро фракций (касса, материалы, склад, поставки, гардероб, мастерская, гараж, планшет, ранги и права, журнал), полиция (розыск, штрафы, вызовы, тюрьма, наручники, мешок), армия, EMS (вызовы, лечение, мед. лицензии), банды и мафия (90 зон, захваты, форт).

### Этап 8. Общение, админка, награды (8–12 дн.)
Телефон и звонки через `pma-voice`, голосовые правила, чаты, админ-панель и команды, баны, репорты, деморган, спектатор/fly/ESP, журнал; ежедневные награды, бонусы, рефералы, задания, промокоды; донат-API (`SetHttpHandler` + HMAC + идемпотентность); погода, время, двери, зелёные зоны, античит (серверные проверки, конвары `sv_entityLockdown`, `sv_filterRequestControl`).

### Этап 9. Ассеты (3–5 дн., параллельно)
`game_resources/dlcpacks` → stream-ресурс `srp_assets` (распаковка RPF → `stream/`, `data_file` для meta), сверка индексов одежды с каталогом `clothes`, проверка моделей из `data/vehicles.json` на целевом `sv_enforceGameBuild`. Оформить `loadscreen` под StreetRP.

### Этап 10. Тестирование и запуск (6–9 дн.)
1. Импорт статики (`srp_import`) на чистую боевую БД, отчёт сверки.
2. Нагрузочный тест на целевом онлайне (в `conf.json` RAGE было `maxplayers 100`): `resmon`, профилирование клиентских циклов `Wait(0)`.
3. Мульти-клиентные сценарии: сделки, драки, машины, дома, звонки, захват.
4. Отказоустойчивость: рестарт ресурса и сервера, обрыв соединения с БД, ежедневный `mariadb-dump` + binlog, проверка восстановления.
5. Закрытый бета-тест, затем открытие. Сброс прогресса после беты — отдельное решение.

**Итого:** ориентировочно 90–135 рабочих дней на одного разработчика, 2,5–4 месяца для двух. После этапа 3 этапы 4–8 делятся между людьми по доменам. Перерисовку инвентаря (этап 3) может вести фронтенд-разработчик параллельно с этапом 2.

## 8. Критерии готовности

- Каждая строка реестра этапа 0 либо перенесена и проходит эталонный сценарий, либо имеет явно согласованное отклонение.
- Все 218 RPC из UI имеют обработчик в Lua (кроме экранов, переданных `ox_inventory`/`ox_target`), это проверяет скрипт-реестр.
- Инвентарь визуально соответствует StreetRP; голод и жажда работают и видны в HUD.
- В коде нет обращений к MongoDB/Redis; для запуска сервера не нужны Node/TS (Vue и ox web собираются заранее и кладутся статикой).
- Выключенные ресурсы шаблона из раздела 3.1 не запускаются, двойных начислений и дублирующих UI нет.
- `resmon`: ресурсы `srp_*` на клиенте в простое укладываются в согласованный бюджет (ориентир — < 0,1 ms каждый).

## 9. Структура репозитория после переноса

```text
streetrp/
├── resources/[streetrp]/srp_*/      # Lua-ресурсы (fxmanifest.lua, client/, server/, shared/, locales/, sql/)
├── resources/[ox]/ox_inventory/     # форк, изменён только web/ (submodule)
├── src_ui_vue/                      # Vue UI → сборка в resources/[streetrp]/srp_ui/web
├── tools/srp_import/                # одноразовый импорт статики
├── server.cfg.example               # порядок ensure, конвары (без секретов)
├── PLAN.md
└── legacy/                          # src_server, src_client, packages, client_packages — эталон до завершения переноса
```

Файлы RAGE (`ragemp-server.exe`, `BugTrap-x64.dll`, `bin/`, `dotnet/`, `linux_x64.tar.gz`, `conf.json`) удаляются после запуска. Секреты (`.env`: БД, Mailtrap, погода, донат-HMAC) переходят в `server.cfg` через `set` и в git не попадают.

## 10. Риски

| Риск | Мера |
|---|---|
| Обновления `ox_inventory` ломают перерисованный UI | Правки только в `web/`, upstream через rebase, версия зафиксирована; обновлять через dev-стенд |
| Экипировка одежды StreetRP не ложится на модель ox_inventory | Прототип на этапе 1 (хуки + metadata); если нужен форк Lua-части, решение принимается до этапа 3 |
| Права рангов StreetRP шире грейдов Qbox | Грейды Qbox — только членство и название, права — в `srp_faction_grades` |
| Выключенный ресурс шаблона нужен оставленному | Проверить `dependencies` на этапе 0, смоук-тест чистого сервера после урезания |
| Двойная убыль голода и жажды или двойная зарплата | Отключить встроенные тики/paycheck Qbox либо настроить их как единственный источник; тест за N циклов |
| Изоляция интерьеров домов | Routing buckets отрезают голос и синхронизацию с игроками снаружи; тест с двумя клиентами на этапе 1 |
| Обновления Qbox ломают интеграцию | Версии зафиксированы, обращения только к публичным exports |
| Ассеты dlcpacks доступны только по внешней ссылке | Скачать и сохранить архив на этапе 0 |
| Доставляемость писем | Подтверждённый домен в Mailtrap (SPF/DKIM), лимиты отправки, повторная отправка кода |

## 11. Открытые вопросы (закрыть на этапе 0)

1. Целевой онлайн и железо сервера.
2. Формула жажды: скорость убыли и эффекты на нуле. Предложение по умолчанию — в разделе 4.6.
3. Нужна ли фракциям рация (`mm_radio`): в StreetRP её не было.
4. Включать ли после запуска контент шаблона, которого не было в StreetRP (работы, ограбления).

## 12. Ближайшие шаги

1. Снять список ресурсов и версий с сервера, развернуть копию как dev-стенд, урезать по разделу 3.1.
2. Зарегистрировать домен в Mailtrap, получить токены.
3. Написать скрипт-реестр RPC/событий и составить эталонные сценарии.
4. Начать этап 1: `srp_core` + `srp_ui` + прототипы, включая каркас перерисовки `ox_inventory/web`.
