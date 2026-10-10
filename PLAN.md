# План перехода StreetRP: RAGE MP → FiveM (Qbox, Lua, MariaDB)

Дата: 10.10.2026 · Статус: утверждаемый план, реализация не начата.

Этот документ заменяет `FIVEM_MIGRATION_PLAN.md`. В старом плане сравнивались собственное ядро на TypeScript и Qbox. Теперь решение принято, и предыдущий документ остаётся только как история рассуждений.

## 1. Принятые решения

| Вопрос | Решение |
|---|---|
| Платформа | FiveM (FXServer, OneSync, txAdmin) |
| Фреймворк | **Qbox** (`qbx_core`); на сервере уже стоит чистая стандартная сборка по рецепту txAdmin |
| Язык игровой логики | **Lua 5.4** (`lua54 'yes'`) на сервере и клиенте. TypeScript-код не переносится, логика переписывается |
| СУБД | **MariaDB** через `oxmysql`. MongoDB и Redis выводятся из эксплуатации полностью |
| Интерфейс | Существующий **Vue 3 UI** (`src_ui_vue`) работает как NUI. Это единственная часть на JS: NUI — это браузер, и на Lua его не написать. Меняется только транспорт `rage-rpc` → NUI-мост |
| Библиотеки | `ox_lib` (callbacks, zones, points, keybinds, notify, progress), `ox_inventory`, `ox_target`, `pma-voice`, `illenium-appearance` — всё это уже есть в рецепте Qbox |
| Принцип | Где у Qbox/ox есть стандартная система, она становится **единственным владельцем данных** (деньги, персонаж, инвентарь, группы, транспорт). Уникальные механики StreetRP пишутся отдельными ресурсами `srp_*` и работают с Qbox только через публичные exports |

Цель — перенести **весь функционал** StreetRP. Поведение (формулы, цены, ограничения, сценарии) сохраняется. Там, где стандартная система Qbox меняет UX (инвентарь, target-меню), это отдельно отмечено в таблице соответствия (раздел 3).

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
| Внешние интеграции | Express API (`POST /api/donation`, `GET /api/players`), почта (сброс пароля и коды), погода (`WEATHER_KEY`, `WEATHER_CITY`), Redis (только логи) |
| Ассеты | `client_packages/game_resources` (dlcpacks — внешний архив), `dotnet/vehicleData.json` |

`database.sql` — это дамп команд MongoDB с `drop()`, а не SQL. Импортировать его в MariaDB напрямую нельзя: он идёт на вход скрипта миграции (раздел 6).

## 3. Соответствие механик StreetRP и Qbox

| Домен StreetRP | Чем становится в FiveM | Владелец данных | Примечание |
|---|---|---|---|
| Аккаунт (email/пароль, `socialName`, `serial`) | Вход по `license` FiveM; email/пароль нужен только для однократной привязки старого аккаунта | `qbx_core` + `srp_accounts` | Регистрация по email больше не нужна. `socialClub`/`serial` к FiveM не сопоставляются |
| Персонаж (один на аккаунт) | Персонаж Qbox; в multichar 1 слот | `qbx_core` (`players`) | `uid` → `citizenid` (таблица соответствия) |
| Внешность, одежда, тату, барбер, хирург | `illenium-appearance` как хранилище; экраны магазинов из Vue | `playerskins` | Каталог `clothes` (989 позиций с ценами) — в Lua-конфиг `srp_services` |
| Деньги cash/bank | `AddMoney/RemoveMoney` Qbox | `qbx_core` | Банковский счёт (`bankAccount`) хранится в metadata |
| Донат-валюта (`User.donate`) | Своя таблица на уровне аккаунта | `srp_accounts` | Не персонажная валюта, в money Qbox не кладём |
| Голод, здоровье | `metadata.hunger`; жажду отключить или зафиксировать на 100 | `qbx_core` | Формулы голода — из `player/hunger.ts` |
| Опыт, навыки, задания, playedTime, payday/bonus-таймеры, лицензии | metadata персонажа (`srp_*` ключи) | `qbx_core` | Для топов и отчётов отдельные таблицы — по необходимости |
| Инвентарь (ячейки, вес, стаки, экипировка, рюкзак) | `ox_inventory`: слоты, вес, хотбар, контейнеры | `ox_inventory` | `cell` → `slot = cell + 1`, `amount` → `count`, `data` → `metadata`. Vue-экран инвентаря заменяется UI ox_inventory (см. раздел 10) |
| Хранилища дома, фракции, багажник | Stash'и и trunk ox_inventory | `ox_inventory` | ID stash'а: `house:<id>`, `faction:<name>` |
| Оружие, патроны, броня | Предметы ox_inventory + серверный урон | `ox_inventory` + `srp_combat` | Урон по частям тела — из `basic/weapons` и клиента |
| Транспорт (владение, номер, топливо, тюнинг, состояние) | `player_vehicles` Qbox; `lib.getVehicleProperties` | `qbx_core` | `govNumber` → `plate` (лимит FiveM — 8 символов, проверить формат). `oldOwners`, `vehicleSlots` — в `srp_vehicles` |
| Ключи, замок | `qbx_vehiclekeys` + правила из `vehicle/lock.ts` | — | |
| Топливо | Логика StreetRP в `srp_vehicles`, значение в statebag `fuel` | `player_vehicles.fuel` | Совместимо с ресурсами, читающими `Entity(veh).state.fuel` |
| Фракции lspd / ems / sang | Jobs Qbox (`police`, `ambulance`, `army`) | `qbx_core` (`player_groups`) | Касса, материалы, права рангов и журнал — `srp_factions` |
| Банды и мафия | Gangs Qbox | `qbx_core` | Захваты, 90 зон — `srp_gangs` |
| Ранги с правами и зарплатой | Грейды job/gang + таблица прав `srp_faction_grades` | смешанно | Правка рангов в игре через exports `qbx_core` — проверить на этапе 1 |
| Работы (5 шт.) | Свои ресурсы, не job Qbox (слот job занят фракцией) | `srp_jobs` | Уровни и кулдауны — в metadata |
| Дома (26) | `srp_housing`, изоляция через routing buckets | `srp_houses` | Налоги, продажа, запирание — из `house/*` |
| Бизнесы (64) | `srp_business` | `srp_businesses` | Доход, налоги, `paymentTime` |
| PayDay | `srp_payday`; встроенные paycheck Qbox отключены | — | Иначе зарплата начислится дважды |
| Телефон (контакты, звонки, ЧС) | Vue-телефон + Lua-бэкенд, звонки через каналы `pma-voice` | `srp_phone_*` | |
| Голос (`enableVoiceTo`) | `pma-voice` (proximity, radio, call) | — | Правила (смерть, мут, дистанция) — в обёртке `srp_voice` |
| Target-меню игрока и машины | `ox_target` | — | Действия из `player/target/*` регистрируются как опции |
| Двери | `ox_doorlock` | `ox_doorlock` | Импорт `data/doors.json` |
| Админка, репорты, деморган, журнал | Vue-админка + `srp_admin`; права — ACE и `adminLvl` | `srp_admin_*`, `bans` Qbox | Баны в таблице `bans` Qbox |
| Розыск, штрафы, тюрьма, наручники, мешок | `srp_police` | `srp_wanted` | |
| Награды, промо, рефералы, ежедневный бонус | `srp_awards` | `srp_promo*`, metadata | |
| Донат-API | `SetHttpHandler` в Lua с HMAC-подписью запроса | `srp_accounts` | Заменяет Express |
| Погода и время | `srp_world`: HTTP к погодному API, передача в погодный ресурс рецепта | — | Московское время |
| Зелёные зоны, AFK, FPS, катсцены, nametags, спектатор, fly, ESP | Клиентские модули `srp_world` / `srp_admin` | — | |
| Мини-игры (lockpick, рыбалка) | Vue-экраны + Lua | — | |
| Логи (Redis) | Таблица `srp_logs` | MariaDB | Redis удаляется |
| Почта | HTTP API почтового провайдера через `PerformHttpRequest` | — | SMTP из Lua недоступен |

## 4. Целевая архитектура

```text
Vue UI (NUI, src_ui_vue/build)
   ↕  SendNUIMessage / RegisterNUICallback       ← замена rage-rpc
srp_ui (client Lua: мост RPC, фокус, ESC)
   ↕  lib.callback / TriggerServerEvent
srp_* (server Lua: игровые правила)
   ├─ exports qbx_core / ox_inventory / pma-voice / illenium-appearance
   └─ oxmysql → MariaDB (таблицы Qbox + srp_*)
```

### 4.1. Ресурсы

Ресурсы группируются по доменам: отдельный ресурс на каждый файл не нужен. Все лежат в `resources/[streetrp]/`.

| Ресурс | Содержимое (откуда переносится) |
|---|---|
| `srp_core` | Конфиг, общие утилиты (vectors, errors, logger), миграции схемы, `srp_logs`, аккаунты/донат, привязка старых аккаунтов (`auth/*`, `utils/*`, `basic/logs`) |
| `srp_ui` | Сборка Vue как `ui_page`, RPC-мост, фокус, чат-интеграция (`helpers/browser`, `helpers/events`) |
| `srp_player` | Спавн, создание персонажа, HUD, голод, алкоголь, наркотики, смерть, лицензии, документы, уровни, follow, nametags, friends (`player/*`, `basic/hud`) |
| `srp_items` | Определения 81 предмета для `ox_inventory` и обработчики использования (`data/inventory.json`, `player/inventory`, `player/equipment`) |
| `srp_combat` | Урон, броня, синхронизация оружия (`basic/weapons`, `weapons/*`) |
| `srp_vehicles` | Создание и спавн, despawn, топливо, здоровье, тюнинг, пассажиры, сделки, спидометр, круиз, автопилот, rappelling (`vehicle/*`) |
| `srp_housing` | Дома: владение, налоги, торговля, вход и изоляция (`house/*`, `trading/house`) |
| `srp_business` | Бизнесы (`business/*`, `trading/business`) |
| `srp_services` | Все 21 сервис и автосалоны, тест-драйв, аренда (`services/*`) |
| `srp_jobs` | 5 работ, уровни, кулдауны, рабочий транспорт (`jobs/*`) |
| `srp_factions` | Общее ядро фракций: касса, материалы, склад, гардероб, мастерская, гараж, планшет, журнал, поставки (`factions/*` кроме специализированных) |
| `srp_police` | lspd/army/ems: розыск, штрафы, вызовы, тюрьма, лечение, лицензии (`factions/police`, `army`, `ems`, `basic/prison`, `factions/actions`) |
| `srp_gangs` | Банды, мафия, зоны, захваты, форт (`factions/gangs`, `mafia`, `wars`) |
| `srp_phone` | Телефон, номера, контакты, звонки (`phone/*`) |
| `srp_admin` | Команды, панель, баны, репорты, деморган, телепорт, наблюдение (`admin/*`) |
| `srp_awards` | Ежедневные награды, бонус, рефералы, задания, промо, донат-API (`awards/*`, `donation`, `api/*`) |
| `srp_world` | Погода, время, зелёные зоны, AFK, античит, двери, сценарии, waypoint, катсцены (`basic/*`) |
| `srp_games` | Lockpick, рыбалка (`games/*`, `services/fishing`) |
| `srp_assets` | stream: модели, одежда, карты (`game_resources`) |

Порядок в `server.cfg`: `oxmysql` → `ox_lib` → `qbx_core` → стандартные ресурсы Qbox → `srp_core` → `srp_ui` → остальные `srp_*`.

### 4.2. Правила кода

- Сервер — источник истины. Клиент шлёт намерение («купить X»), сервер берёт `source` из контекста события и сам проверяет дистанцию, права, деньги и частоту запросов.
- В событиях передаются ID (`citizenid`, `netId`, ID дома), а не объекты. Постоянный ID персонажа, `source` сессии и `netId` сущности — три разных типа, `source` никогда не пишется в БД.
- Публичное состояние (фракция для nametag, двигатель, замок, топливо) передаётся через statebags. Приватное (деньги, инвентарь) в публичные statebags не попадает.
- Денежные и предметные операции — только через exports Qbox/ox_inventory. Покупка состоит из одного шага: `RemoveMoney`, затем выдача предмета; если выдача не удалась, деньги возвращаются и событие пишется в лог. Многотабличные операции `srp_*` — через `MySQL.transaction`.
- Каждый NUI callback обязательно отвечает (`cb(...)`), у каждого серверного callback есть таймаут. Promise, который никогда не завершается (как в старом `helpers/events.ts`), не переносится.
- Константы и статические данные лежат в `shared/config.lua`, а не в коде. Тексты на русском хранятся в `locales/ru.json` (через `ox_lib` locale).
- Ресурс корректно останавливается: при `onResourceStop` удаляются созданные сущности, блипы, зоны и снимается фокус NUI.

### 4.3. Мост UI (замена `rage-rpc`)

Меняется только `src_ui_vue/src/utils/rpc.ts`, интерфейс остаётся прежним, поэтому 218 RPC-имён и экраны не трогаются:

| Вызов во Vue | Реализация в NUI |
|---|---|
| `rpc.callServer(name, args)` | `fetch('https://srp_ui/callServer', {name, args})` → client Lua `lib.callback.await('srp:'..name, ...)` → ответ в `cb` |
| `rpc.callClient(name, args)` | `fetch('https://srp_ui/callClient', ...)` → client Lua handler из реестра → `cb` |
| `rpc.register(name, fn)` | `window.addEventListener('message')`: Lua делает `SendNUIMessage({rpc = name, args = ...})` |
| `mp.invoke('focus')` и т. п. | `SetNuiFocus` через callback `srp_ui/focus` |
| `Browser-ShowPage` / `Browser-HidePage` | Экспорты `srp_ui:ShowPage(page, data)` / `HidePage()` |

Регистрация серверного RPC в Lua: `srp.rpc.register('Inventory-Use', function(source, ...) ... end)` — обёртка над `lib.callback.register` с валидацией и rate-limit. Так соответствие «имя RPC в TS → обработчик в Lua» прослеживается один к одному и проверяется скриптом.

`vite.config.ts`: `base: './'`; результат сборки копируется в `srp_ui/web/`, в `fxmanifest.lua` прописываются `ui_page 'web/index.html'` и `files {'web/**'}`.

## 5. Схема MariaDB

Стандартные таблицы Qbox и ox (`players`, `player_groups`, `player_vehicles`, `playerskins`, `bans`, `ox_inventory`, `ox_doorlock`) **не меняются**: данные пишутся только через их API. Свои таблицы имеют префикс `srp_`, движок InnoDB, кодировку utf8mb4. Деньги хранятся в `BIGINT`, не в `FLOAT`.

| Таблица | Поля (основные) | Источник |
|---|---|---|
| `srp_accounts` | `id` PK, `license` UNIQUE, `donate` BIGINT, `admin_lvl`, `referral_award`, `legacy_email`, `created_at`, `last_login` | User |
| `srp_account_ips` | `account_id`, `ip`, `seen_at` | User.ip |
| `srp_legacy_users` / `srp_legacy_characters` / `srp_legacy_vehicles` | Сырые данные Mongo (JSON) + `claimed_by` | Staging для привязки (раздел 6) |
| `srp_id_map` | `kind`, `mongo_id`, `new_id` | Все ссылки ObjectId |
| `srp_claim_codes` | `email`, `code`, `expires_at`, `type` | Token |
| `srp_houses` | `id`, `type`, `x,y,z,h`, `owner_citizenid` NULL, `locked`, `paid_days`, `price` | House + `data/houses.json` |
| `srp_businesses` | `id`, `name`, `x,y,z`, `price`, `income`, `owner_citizenid`, `paid`, `payment_time` | Business |
| `srp_factions` | `name` PK, `money` BIGINT, `materials` | Faction |
| `srp_faction_grades` | `faction`, `grade`, `name`, `salary`, `permissions` JSON | Faction.ranks |
| `srp_faction_logs` | `faction`, `citizenid`, `action`, `thing`, `amount`, `created_at` | FactionLog |
| `srp_gang_zones` | `id`, `x,y,z`, `owner_gang`, `captured_at` | GangZone |
| `srp_wanted` | `id`, `creator`, `suspect`, `priority`, `reason`, `created_at` | Wanted |
| `srp_vehicle_history` | `plate`, `citizenid`, `owned_from`, `owned_to` | Vehicle.oldOwners |
| `srp_phone_numbers` | `citizenid` PK, `number` UNIQUE | Character.phone.number |
| `srp_phone_contacts` | `citizenid`, `name`, `number` | phone.contacts |
| `srp_phone_blacklist` | `citizenid`, `number` | phone.blacklist |
| `srp_promo` / `srp_promo_uses` | `code` UNIQUE, `owner_account`, `income`, `bonus` / `code`, `account_id` | Promo |
| `srp_reports` | `id`, `sender`, `admin`, `message`, `created_at` | Report |
| `srp_admin_logs` | `admin`, `target`, `action`, `note`, `created_at` | AdminLog |
| `srp_logs` | `channel`, `payload` JSON, `created_at` | Redis-логи |
| `srp_schema_version` | `version`, `applied_at` | Миграции |

Статические данные, которые меняются только разработчиком: позиции 21 сервиса, чекпоинты 5 работ, каталог одежды (989), предметы, координаты фракций, больницы, тюрьма, анимации. Они переносятся в `shared/*.lua` соответствующих ресурсов, а не в БД.

Миграции схемы лежат в `srp_core/sql/NNN_name.sql` и применяются при старте `srp_core` по `srp_schema_version`.

## 6. Перенос данных MongoDB → MariaDB

Сначала нужно ответить на вопрос, есть ли живая база с игроками (раздел 11). От этого зависит, нужна ли ветка «Игроки».

**Статика (обязательно).** Выполнить `mongoexport --jsonArray` по коллекциям businesses, houses, factions, gangzones, services, jobs, clothes, promos. Одноразовый ресурс `srp_migrate` (Lua, команда в серверной консоли) читает JSON через `LoadResourceFile` + `json.decode` и пишет:
- businesses, houses, factions (+ ranks → `srp_faction_grades`), gangzones, promos — в таблицы `srp_*`;
- services, jobs, clothes — генерирует `shared/*.lua` (или проверяет готовые конфиги на совпадение с дампом).

**Игроки (если нужен перенос аккаунтов).** Таблица `players` Qbox требует `license`, а license старых игроков неизвестна. Поэтому перенос проходит в два шага:
1. Импорт `users`, `characters`, `vehicles` в `srp_legacy_*` как есть (JSON), с проверкой количества и `srp_id_map`.
2. **Привязка в игре.** Новый игрок на экране входа выбирает «У меня был аккаунт StreetRP» и вводит email. На почту приходит код (`srp_claim_codes`); после ввода кода сервер в одной транзакции:
   - создаёт персонажа Qbox с прежним `citizenid`-маппингом, именем, деньгами (cash/bank), metadata (опыт, навыки, лицензии, задания, голод);
   - переносит внешность в `playerskins`;
   - конвертирует инвентарь (`cell+1 → slot`, `amount → count`, `data → metadata`; неизвестные предметы попадают в отчёт, а не теряются молча);
   - создаёт `player_vehicles` (plate, mods, fuel) и багажники;
   - переписывает владельца в `srp_houses` / `srp_businesses` / членство во фракции (`player_group`);
   - ставит `claimed_by`, повторная привязка запрещена.

   Пароли хранятся как bcrypt, а в Lua нет надёжной реализации bcrypt. Поэтому подтверждение идёт по коду на email, а не по паролю. Если почта у игрока недоступна, привязку выполняет администратор вручную командой с записью в журнал.

**Контроль.** Нужен отчёт `srp_migrate report`: количество записей по коллекциям, суммы денег до и после, предметы, которых нет в `srp_items`, владельцы-«сироты», дубли номеров (`plate`/телефон). Перед боевым переносом — минимум одна полная репетиция на копии.

## 7. Этапы

Оценки даны в рабочих днях одного Lua-разработчика, знакомого с FiveM/Qbox. Это предварительный ориентир, его нужно уточнить после этапа 1.

### Этап 0. Эталон и окружение (3–5 дн.)
1. Поднять копию RAGE-сервера с копией базы и записать эталонные сценарии по каждому домену таблицы 3: вход, условия, цифры, результат, изменения в БД.
2. Подготовить dev-сервер FiveM: клон чистой Qbox-сборки, отдельная БД MariaDB, git-репозиторий `resources/[streetrp]`, зафиксированные версии Qbox и ox-ресурсов.
3. Скрипт-реестр: все `mp.events.add`, `rpc.register`, `callServer`/`callClient` (имя → файл). По нему потом отслеживается прогресс переноса.
4. Сверить в рецепте конкретный набор ресурсов (погода, топливо, гаражи, полиция) и выключить стандартные, которые дублируют StreetRP (paycheck, `qbx_vehicleshop`, `qbx_police` и т. п.), чтобы не было двойной логики.

**Готово:** реестр механик со сценариями, dev-стенд, решения по открытым вопросам раздела 11.

### Этап 1. Каркас и проверка ключевых рисков (5–8 дн.)
1. `srp_core`: конфиг, логгер, миграции, `srp_accounts`.
2. `srp_ui`: Vue-сборка как NUI + RPC-мост; HUD показывает деньги Qbox и обновляется по событию `QBCore:Player:SetPlayerData`.
3. Прототипы рисков:
   - покупка в магазине → предмет в `ox_inventory` → перенос в багажник → переподключение;
   - создание и правка грейда фракции в рантайме через exports `qbx_core`;
   - урон по частям тела и броня в сравнении с эталоном;
   - вход в дом через routing bucket с двумя игроками.

**Готово:** UI работает в игре, все RPC проходят через мост, по каждому прототипу записан результат. Если какой-то механики не воспроизвести на Qbox без форка, это решается здесь.

### Этап 2. Игрок (8–12 дн.)
Привязка аккаунта, multichar на 1 слот, создание персонажа (Vue `character`) → `illenium-appearance`, спавн (`spawn`), HUD, голод, здоровье, смерть, лицензии, паспорт, уровни и опыт, телепорт и сохранение позиции, AFK, nametags, друзья, follow, анимации и attachments.

**Готово:** персонаж создаётся, сохраняется и восстанавливается после рестарта; HUD и все экраны `player/*` работают.

### Этап 3. Инвентарь, предметы, оружие (8–12 дн.)
81 предмет в формате `ox_inventory` (вес, стак, иконки из `src_ui_vue/assets`), обработчики use (еда, алкоголь, наркотики, аптечки, броня, рюкзак, инструменты), экипировка одежды как предметы, оружие и патроны, урон и броня (`srp_combat`), предметы на земле, передача между игроками.

**Готово:** нет дюпа и потерь при параллельных операциях и reconnect; боевые сценарии совпадают с эталоном.

### Этап 4. Транспорт и сервисы (12–18 дн.)
`srp_vehicles` (владение, ключи, замок, топливо, здоровье, тюнинг, багажник, сделки, despawn, спидометр, круиз, автопилот), все автосалоны и тест-драйв, аренда, свалка, АЗС, LSC, супермаркет, оружейный, одежда, барбер, тату, хирург, банк, лицензии, паспорт.

**Готово:** все 21 сервис проходят эталонные сценарии; цены и формулы совпадают.

### Этап 5. Недвижимость и экономика (8–12 дн.)
Дома (вход, изоляция, замок, stash, налоги, продажа игроку и государству), бизнесы (покупка, доход, налоги, продажа), PayDay с формулами StreetRP, `trading/*`.

**Готово:** операции переживают рестарт; налоги и PayDay совпадают с эталоном за N циклов.

### Этап 6. Работы (8–12 дн.)
Building (driver/mover/welder), Waterfront (forklift/handler/mover), Postal (courier/driver/warehouse), Car_Theft (cheap/middle/premium), Smuggling; уровни, кулдауны, рабочий транспорт, точки.

### Этап 7. Фракции (15–22 дн.)
Ядро фракций (касса, материалы, склад, поставки, гардероб, мастерская, гараж, планшет, ранги и права, журнал), полиция (розыск, штрафы, вызовы, тюрьма, наручники, мешок, follow), армия, EMS (вызовы, лечение, мед. лицензии), банды и мафия (90 зон, захваты, стратегия, форт).

### Этап 8. Общение, админка, награды (8–12 дн.)
Телефон и звонки через `pma-voice`, голосовые правила, чаты (обычный, фракционный, команды), админ-панель и все команды, баны, репорты, деморган, спектатор/fly/ESP, журнал; ежедневные награды, бонусы, рефералы, задания, промокоды; донат-API (`SetHttpHandler` + HMAC); погода, время, двери (`ox_doorlock`), зелёные зоны, античит (серверные проверки + конвары `sv_entityLockdown`, `sv_filterRequestControl`).

### Этап 9. Ассеты (3–5 дн., параллельно)
Перенести `game_resources/dlcpacks` в stream-ресурс `srp_assets` (распаковка RPF → `stream/`, `data_file` для meta-файлов), сверить индексы одежды с каталогом `clothes`, проверить модели транспорта из `data/vehicles.json` на целевом `sv_enforceGameBuild`.

### Этап 10. Миграция данных, тестирование, запуск (8–12 дн.)
1. `srp_migrate`: репетиция на копии, отчёт сверки, замер времени окна.
2. Нагрузочный тест на целевом онлайне (в `conf.json` сейчас стоит `maxplayers 100`): `resmon` и профилирование тяжёлых тиков, особенно клиентских циклов `Wait(0)`.
3. Мульти-клиентные сценарии: сделки, драки, машины, дома, звонки, захват.
4. Отказоустойчивость: рестарт ресурса и сервера, обрыв соединения с БД, бэкап и восстановление MariaDB (ежедневный `mariadb-dump` + binlog).
5. Запуск: заморозка RAGE → финальный бэкап Mongo → импорт статики и `srp_legacy_*` → smoke-тест → открытие. Mongo остаётся read-only архивом и не используется как второе хранилище.
6. План отката: до открытия — возврат на RAGE без потерь. После открытия прогресс на FiveM при откате не переносится, поэтому правило компенсации нужно согласовать заранее.

**Итого:** ориентировочно 85–130 рабочих дней на одного разработчика, 2,5–4 месяца для двух. Этапы 4–8 после этапа 3 можно делить между людьми по доменам.

## 8. Критерии готовности переноса

- Каждая строка реестра этапа 0 либо перенесена и проходит эталонный сценарий, либо имеет явно согласованное отклонение.
- Все 218 RPC из UI имеют обработчик в Lua (проверяется скриптом-реестром), 39 маршрутов UI открываются в игре.
- В коде нет обращений к MongoDB/Redis; `node_modules`/TS не нужны для запуска сервера (Vue собирается заранее и кладётся как статика).
- Сверка миграции: суммы денег, количество предметов и владельцы совпадают с исходной базой.
- `resmon`: ресурсы `srp_*` на клиенте в простое укладываются в бюджет, согласованный на этапе 0 (ориентир — < 0,1 ms каждый).

## 9. Структура репозитория после переноса

```text
streetrp/
├── resources/[streetrp]/srp_*/      # Lua-ресурсы (fxmanifest.lua, client/, server/, shared/, locales/, sql/)
├── src_ui_vue/                      # Vue UI → сборка в resources/[streetrp]/srp_ui/web
├── tools/srp_migrate/               # одноразовый ресурс миграции
├── server.cfg.example               # порядок ensure, конвары (без секретов)
├── PLAN.md
└── legacy/                          # src_server, src_client, packages, client_packages — до завершения переноса как эталон
```

Файлы RAGE (`ragemp-server.exe`, `BugTrap-x64.dll`, `bin/`, `dotnet/`, `linux_x64.tar.gz`, `conf.json`) удаляются из репозитория после запуска. Секреты (`.env`) переносятся в `server.cfg` через `set`/`setr` и в git не попадают.

## 10. Риски

| Риск | Мера |
|---|---|
| UI ox_inventory отличается от Vue-инвентаря StreetRP | Принять UI ox_inventory (рекомендуется) или оставить Vue-экран поверх API ox_inventory. Второй вариант тяжелее (дополнительно 5–8 дн.) и ломается при обновлениях ox. Решить на этапе 1 |
| Права рангов StreetRP шире грейдов Qbox | Грейды Qbox — только для членства и имени ранга, права — в `srp_faction_grades` |
| Двойная логика со стандартными ресурсами рецепта | На этапе 0 составить список выключенных ресурсов, в каждом `srp_*` проверять отсутствие дублей |
| Изоляция интерьеров домов | Routing buckets ломают голос и синхронизацию с игроками снаружи; тестировать на этапе 1 с двумя клиентами |
| Обновления Qbox ломают интеграцию | Зафиксировать версии; обращаться только к публичным exports; обновлять через dev-стенд |
| Ассеты dlcpacks недоступны (внешняя ссылка) | Скачать и зафиксировать архив на этапе 0 |
| Привязка старых аккаунтов (bcrypt, нет почты) | Коды на email + ручная привязка администратором |

## 11. Открытые вопросы (закрыть на этапе 0)

1. Есть ли живая база игроков и нужно ли переносить аккаунты, или запуск идёт с чистого листа (переносится только статика)?
2. Инвентарь: UI ox_inventory или сохранение Vue-экрана?
3. Целевой онлайн и железо сервера.
4. Почтовый провайдер для кодов (HTTP API) или отказ от email и привязка через администратора / Discord.
5. Остаётся ли жажда (Qbox) или только голод, как в StreetRP.
6. Какие ресурсы рецепта Qbox уже установлены на сервере (точный список и версии) — от этого зависит раздел 3.

## 12. Ближайшие шаги

1. Ответить на вопросы раздела 11.
2. Снять список ресурсов и версий с боевой Qbox-сборки, развернуть её копию как dev-стенд.
3. Написать скрипт-реестр RPC/событий и составить эталонные сценарии.
4. Начать этап 1: `srp_core` + `srp_ui` (мост RPC) + четыре прототипа рисков.
