# MIGRATE.md — модульный перенос StreetRP на FiveM (Qbox, Lua, MySQL 8.4)

Рабочий план исполнения. Дополняет [PLAN.md](PLAN.md): там архитектура, решения и схема Qbox,
здесь — **порядок переноса по модулям** и критерии готовности каждого шага.

Дата: 30.10.2026 · Статус: план к исполнению, этап 0 начат.

## 1. Решения

| Вопрос | Решение |
|---|---|
| Платформа | FiveM (FXServer, OneSync, txAdmin) |
| Основа | **Qbox** (`qbx_core` из txAdmin-рецепта Qbox), версии ресурсов фиксируются на этапе 0 |
| Язык логики | **Lua 5.4** (`lua54 'yes'`), сервер и клиент. TypeScript-код не переносится |
| СУБД | **MySQL 8.4 LTS** через `oxmysql`. MongoDB и Redis выводятся полностью |
| Данные игроков | Чистый старт. Из MongoDB переносится только статика (бизнесы, дома, фракции, зоны, сервисы, работы, одежда, промокоды) |
| Интерфейс | Vue 3 UI (`src_ui_vue`) как NUI; меняется только транспорт (`utils/rpc.ts`), имена RPC (218 по `CONVERTATION.md`, 213 в UI по реестру) и экраны сохраняются |
| Инвентарь | `ox_inventory` как владелец данных; web-UI перерисовывается в дизайне StreetRP (отдельный фронтенд-поток) |
| Метод | Вертикальные срезы: модуль = сервер + клиент + UI + таблицы + тесты. Один модуль — один коммит/PR |
| Эталон | RAGE-сервер замораживается на снимке Mongo; эталонные сценарии пишутся до переноса каждого модуля |

PLAN.md обновлён под MySQL 8.4; MIGRATE.md задаёт модульный порядок и не меняет остальные решения PLAN.md.

## 2. Правила переноса (Definition of Done)

Модуль считается перенесённым, только если выполнены все пункты:

1. **Реестр.** Все RPC/события модуля есть в `tools/registry/REGISTRY.md` и имеют обработчик в Lua;
   `pnpm registry` не показывает новых пропусков.
2. **Данные.** Таблицы созданы миграцией; в коде нет mongoose-запросов, Mongo-Id и Redis-команд.
3. **UI.** Экран открывается через NUI-мост без правок компонентов; страница включена во флагах.
4. **Паритет.** Эталонный сценарий RAGE и FiveM совпадает: цифры, лимиты, порядок действий,
   тексты ошибок. Расхождения записаны как согласованные отклонения.
5. **Изоляция.** Только публичные exports Qbox/ox (`qbx_core`, `ox_inventory`, `ox_lib`, `pma-voice`,
   `illenium-appearance`); прямым чтением чужих таблиц не пользуемся.
6. **Тесты.** Два клиента, рестарт ресурса, reconnect, рестарт БД, повторный вход.
7. **Выключение старого.** Модуль RAGE-сборки больше не участвует в эталоне; в FiveM он заменён,
   страница UI включена, `srp_*`-ресурс добавлен в `server.cfg`.
8. **Коммит.** `feat(srp_x): модуль ...` + обновлённый реестр и отметка в журнале (раздел 14).

Правила кода — из PLAN.md, раздел 4.2 (сервер — источник истины, `source` из контекста,
statebags для публичного состояния, транзакции для денег/предметов, таймауты у callback).

### 2.1. Развязка модулей

Постепенный перенос невозможен, если ядро игрока импортирует дом, бизнес, фракции и машины
напрямую (так сейчас в `player/index.ts`). В FiveM-версии ядро только поднимает игрока и шлёт
события, а модули подписываются на них по мере появления:

| Событие | Кто шлёт | Кто слушает |
|---|---|---|
| `srp:playerLoaded` | `srp_player` | дом, бизнес, фракции, машины, телефон, награды |
| `srp:playerLogout` | `srp_player` | те же + сохранение модульных данных |
| `srp:characterCreated` | `srp_player` | стартовый инвентарь, награды, дом |
| `srp:vehicleSpawned` | `srp_vehicles` | топливо, ключи, тюнинг |

Правила: модуль не читает таблицы другого модуля; публичные операции — exports или `lib.callback`;
отсутствующий ресурс не ломает загрузку игрока (проверка `GetResourceState(...) == 'started'`).
Это позволяет держать в `ensure` только готовые модули.

## 3. Целевая архитектура

```text
Vue UI (NUI, src_ui_vue/build)              ox_inventory web (React, дизайн StreetRP)
   ↕  SendNUIMessage / NUI callbacks                  ↕  родной мост ox_inventory
srp_ui (client Lua: мост RPC, фокус, страницы)   ox_inventory (Lua, без изменений)
   ↕  lib.callback / события
srp_* (server Lua: правила, БД, экономика)
   ├─ exports qbx_core / qbx_vehicles / ox_inventory / pma-voice / illenium-appearance
   ├─ PerformHttpRequest → Mailtrap, погода
   └─ oxmysql → MySQL 8.4 (таблицы Qbox + srp_*)
```

Ресурсы (`resources/[streetrp]/`): `srp_core`, `srp_ui`, `srp_player`, `srp_items`, `srp_combat`,
`srp_vehicles`, `srp_housing`, `srp_business`, `srp_services`, `srp_jobs`, `srp_factions`,
`srp_police`, `srp_gangs`, `srp_phone`, `srp_admin`, `srp_awards`, `srp_world`, `srp_games`,
`srp_compat`, `srp_assets`. Разбиение — как в PLAN.md, раздел 4.1; на этапе 0 создаются только
`srp_core`, `srp_ui` и пустые заготовки остальных.

`server.cfg`: `oxmysql` → `ox_lib` → `qbx_core` → ресурсы Qbox/ox → `srp_core` → `srp_ui` → домены.
Пока модуль не перенесён, его `srp_*` не добавлен в `ensure` — сервер стартует без него.

## 4. MySQL 8.4

### 4.1. Сервер и подключение

- MySQL **8.4 LTS**, InnoDB, `utf8mb4`, collation `utf8mb4_0900_ai_ci`.
- Пользователь БД — с `caching_sha2_password` (в 8.4 `mysql_native_password` выключен по умолчанию;
  включать его только если инструмент миграции не умеет иначе).
- `oxmysql`: `set mysql_connection_string "mysql://srp:password@127.0.0.1:3306/streetrp?charset=utf8mb4"`.
  Проверить на этапе 0, что `oxmysql` подключается к 8.4 и не ругается на auth plugin.
- `sql_mode` — строгий (дефолт 8.4), `time_zone = '+00:00'`, все `DATETIME(3)` — UTC.
- `innodb_buffer_pool_size` 256–512 МБ на тестовом стенде, `max_connections = 50`,
  `performance_schema = OFF` для 2 ГБ RAM.
- `lower_case_table_names`: имена таблиц/колонок только в нижнем регистре (Linux-дефолт 0).

### 4.2. Конвенции схемы

| Правило | Значение |
|---|---|
| Деньги | `BIGINT` (целые доллары/поинты), не `FLOAT` |
| ID | `BIGINT UNSIGNED AUTO_INCREMENT`; старый Mongo `_id` — в `legacy_id CHAR(24)` для сверки |
| Даты | `DATETIME(3)`, значения в UTC; в JSON — ISO-строки только на границе API |
| Координаты | `pos_x/pos_y/pos_z DOUBLE`, `heading DOUBLE NULL` (не JSON — нужны индексы и сортировка) |
| Вложенные объекты | `JSON` + `CHECK (JSON_VALID(col))`; горячие поля — generated columns с индексом |
| Массивы-справочники | дочерние таблицы (контакты, IP, использования промо), не JSON |
| Идентификаторы игрока | `citizenid VARCHAR(50)` — ключ Qbox; `charid` не дублируем |
| Миграции | `srp_core/sql/NNN_name.sql`, идемпотентные (`CREATE TABLE IF NOT EXISTS`), версия в `srp_schema_version` |

### 4.3. Отличия от MariaDB, которые важны

- Нет `INSERT ... RETURNING` — использовать `LAST_INSERT_ID()`.
- `utf8mb4_0900_ai_ci` вместо `utf8mb4_general_ci`; не смешивать collations в JOIN.
- `CHECK`-ограничения реально работают (с 8.0.16) — не полагаться на проверки только в коде.
- `JSON` — нативный тип; `->>` и `JSON_EXTRACT` доступны, `JSON_TABLE` — для отчётов.
- `ON DUPLICATE KEY UPDATE` — основной способ upsert статики.
- `mysqldump --single-transaction` для бэкапов (не `mariadb-dump`).

## 5. Порядок модулей: обзор

**Минимальная цепочка запуска:** 0.1 → 0.2 → 0.3 → 0.4 → 0.5. Без 0.6 сервер уже стартует,
но дома/бизнесы/фракции пустые. Всё остальное подключается по одному модулю и не блокирует старт.

| Этап | Содержание | Результат (milestone) | Дни |
|---|---|---|---|
| 0 | Фундамент: ресурсы, `srp_core`, NUI-мост, сессии, схема, импорт статики | Сервер FiveM стартует, UI открывается, БД готова | 10–14 |
| 1 | Вход в игру: auth, персонаж, ядро игрока, спавн, HUD, время/погода, чат, голос | **M1:** игрок входит, создаёт персонажа, спавнится, видит HUD | 18–24 |
| 2 | Мир и транспорт: зоны, блипы, двери, машины (spawn/sync/ownership) | **M2:** работает мир, машины, взаимодействия | 12–16 |
| 3 | Инвентарь, предметы, оружие, одежда | **M3:** предметы, экипировка, бой | 12–16 |
| 4 | Сервисы и экономика: банк, лицензии, магазины, АЗС, LSC, автосалоны, PayDay | **M4:** все 21 сервис | 18–24 |
| 5 | Недвижимость: дома, бизнесы, сделки | **M5:** дома/бизнесы переживают рестарт | 8–12 |
| 6 | Работы: ядро + 5 работ | **M6:** работы с уровнями и кулдаунами | 12–18 |
| 7 | Фракции: ядро, полиция, армия, EMS, склады, банды, планшет | **M7:** фракционные механики | 22–30 |
| 8 | Телефон: номера, контакты, звонки | **M8:** звонки через pma-voice | 5–7 |
| 9 | Админка, награды, промо, донат, API | **M9:** админ-панель и экономика наград | 8–12 |
| 10 | Мини-игры, target, мир, античит, ассеты, loadscreen | **M10:** контент и полировка | 10–14 |
| 11 | Тесты, нагрузка, бэкапы, запуск | **Launch** | 6–9 |

Итого: **≈140–195 рабочих дней** одного Lua-разработчика. Оценка выше PLAN.md (120–180), потому что
постепенный перенос добавляет накладные расходы: feature-flags, двойная проверка каждого модуля,
поддержка двух серверов на время миграции. Два разработчика — 3,5–4,5 месяца при параллельном
фронтенд-потоке (инвентарь/планшет/полировка UI) и разделении доменов после M3.

## 6. Полный список модулей в порядке переноса

Порядок внутри этапа = порядок коммитов. Зависимости указаны по номерам модулей.

### Этап 0 — фундамент

| № | Модуль | Сервер | Клиент / UI | Зависит |
|---|---|---|---|---|
| 0.1 | Каркас репозитория и сборки | `fxmanifest.lua`, `server.cfg`, `srp_assets` stub, NUI build | `srp_ui` skeleton, `vite base './'` | — |
| 0.2 | `srp_core` | `src_server/src/utils/*` (logger, errors, vectors, vehicle, encryption), bootstrap `index.ts` | — | 0.1 |
| 0.3 | NUI-мост и реестр RPC | gateway `srp:rpc`, allowlist, rate-limit | `client/helpers/{events,browser,storage}`, `UI/Common` | 0.1, 0.2 |
| 0.4 | Сессии и реестр игроков | `helpers/{players,events}`, statebags, connect/disconnect | `client/helpers/events` | 0.2 |
| 0.5 | Схема БД и миграции | `models/*` → `srp_core/sql/*` | — | 0.1 |
| 0.6 | Импорт статики | `src_server/src/data/*`, `database.sql` → `srp_import` | — | 0.5 |

### Этап 1 — вход в игру

| № | Модуль | Сервер | Клиент / UI | Зависит |
|---|---|---|---|---|
| 1.1 | Auth: вход, регистрация, коды, сброс | `auth/{index,login,register,reset,token}`, `utils/mailer` | `client/auth`, `UI/Auth` | 0.4, 0.5 |
| 1.2 | Персонаж: создание, выбор, внешность | `player/character` | `client/player/character`, `UI/Character` | 1.1 |
| 1.3 | Ядро игрока: деньги, здоровье, голод, сохранение | `player/{player,index,events,health,hunger,armor,death,clothes,level}`, `helpers/money`, `utils/savepos` | `client/player/{index,sync,controls,death,follow,friends,nametags}`, `UI/Player` | 1.2 |
| 1.4 | Спавн | `player/spawn` | `client/player/spawn`, `UI/Spawn` | 1.3 |
| 1.5 | HUD | `helpers/hud` | `client/basic/hud`, `UI/HUD` | 1.3 |
| 1.6 | Время и погода | `basic/{time,weather}` | `client/basic/{weather,time}` | 1.3 |
| 1.7 | Чат и команды | `basic/chat/{index,commands,faction}` | `UI/Chat` | 1.3 |
| 1.8 | Голос | `basic/voice` | `client/basic/voice`, `pma-voice` | 1.3 |

### Этап 2 — мир и транспорт

| № | Модуль | Сервер | Клиент / UI | Зависит |
|---|---|---|---|---|
| 2.1 | Зоны и взаимодействие (E) | `helpers/colshapes`, `helpers/offers`, `helpers/hud` (interact) | `client/helpers/colshapes`, `client/basic/{dialog,offer}`, `UI/Dialog` | 1.5 |
| 2.2 | Блипы, маркеры, пикапы, точки | `helpers/{blips,pickups,points}`, `basic/point` | `client/helpers/{blips,objects,effects}`, `client/basic/{location,waypoint}` | 2.1 |
| 2.3 | Двери | `basic/doors` | `client/basic/doors` | 2.1 |
| 2.4 | Транспорт: спавн, синхронизация, замок, топливо, здоровье | `vehicle/{spawn,state,sync,lock,health,passengers,despawn,fuel}` | `client/vehicle/*`, `client/natives` | 1.3 |
| 2.5 | Владение, тюнинг, сделки, багажник | `vehicle/{owning,trade,tuning,inventory,creator,builder}` | `client/vehicle/tuning`, `UI` (спидометр) | 2.4 |

### Этап 3 — инвентарь, предметы, бой

| № | Модуль | Сервер | Клиент / UI | Зависит |
|---|---|---|---|---|
| 3.1 | Инвентарь и хранилища | `basic/inventory/*`, `player/inventory/*`, `player/equipment` | `client/basic/inventory`, `UI/Inventory`, `ox_inventory` | 1.3, 0.6 |
| 3.2 | Оружие, урон, броня, эффекты | `basic/weapons/*`, `weapons/*`, `player/{armor,alcohol,drugs}` | `client/weapons/*` | 3.1 |
| 3.3 | Одежда и экипировка | `player/clothes`, `data/clothes/*` | `client/services/clothing-shop` (позже) | 3.1 |

### Этап 4 — сервисы и экономика

| № | Модуль | Сервер | Клиент / UI | Зависит |
|---|---|---|---|---|
| 4.1 | Каркас сервисов | `services/{service,data,index}` | `UI/Services` (роутинг) | 2.1 |
| 4.2 | Банк, лицензии, паспорт | `services/{bank,licenses,passport}`, `player/{licenses,docs}` | `UI/Services`, `UI/Player` | 4.1 |
| 4.3 | Супермаркет, оружейный, одежда | `services/{supermarket,weapons,clothing-shop}` | `UI/Services` | 4.1, 3.1 |
| 4.4 | АЗС и расход топлива | `services/gas`, `vehicle/fuel` | `client/services/gas` | 2.4, 4.1 |
| 4.5 | LSC / тюнинг | `services/lsc`, `vehicle/tuning` | `client/services/lsc` | 2.5, 4.1 |
| 4.6 | Автосалоны, аренда, свалка | `services/vehicle-shop/*`, `services/vehicle-rent/*`, `services/vehicle-dump` | `UI/Services` | 2.5, 4.1 |
| 4.7 | Барбер, тату, хирург | `services/{barbershop,tattoo-shop,surgeon}` | `UI/Services` | 1.2, 4.1 |
| 4.8 | PayDay и логи | `basic/{payday,logs}`, `helpers/money` | — | 1.3 |

### Этап 5 — недвижимость

| № | Модуль | Сервер | Клиент / UI | Зависит |
|---|---|---|---|---|
| 5.1 | Дома | `house/*` | `client/property`, `UI/House` | 2.1, 3.1, 4.8 |
| 5.2 | Бизнесы | `business/*` | `UI/Business` | 5.1, 4.1 |
| 5.3 | Сделки (дом/бизнес/машина) | `house/trade`, `business/trade`, `vehicle/trade` | `client/trading/*`, `UI/Trading` | 2.5, 5.1, 5.2 |

### Этап 6 — работы

| № | Модуль | Сервер | Клиент / UI | Зависит |
|---|---|---|---|---|
| 6.1 | Ядро работ | `jobs/{job,branch,cooldown,levels,points,vehicle,workers,index}` | `client/jobs/index`, `UI/Job` | 2.4, 3.1, 4.1 |
| 6.2 | Building | `jobs/building/*` | `client/jobs/cargo` | 6.1 |
| 6.3 | Waterfront | `jobs/waterfront/*` | `client/jobs/cargo` | 6.1 |
| 6.4 | Postal | `jobs/postal/*` | `client/jobs/cargo` | 6.1 |
| 6.5 | Car_Theft | `jobs/car-theft/*` | `client/jobs/cargo` | 6.1 |
| 6.6 | Smuggling | `jobs/smuggling/*` | `client/jobs/cargo` | 6.1 |

### Этап 7 — фракции

| № | Модуль | Сервер | Клиент / UI | Зависит |
|---|---|---|---|---|
| 7.1 | Ядро фракций, ранги, касса, журнал | `factions/{faction/*,journal,leader,api,builder,index}` | `UI/Factions` | 1.3, 4.8 |
| 7.2 | Действия и полиция | `factions/actions/*`, `factions/police/*` | `client/factions/actions`, `UI/Factions` | 7.1 |
| 7.3 | Армия и EMS | `factions/{army,ems}/*` | `UI/Factions` | 7.1, 7.2 |
| 7.4 | Гараж, гардероб, мастерская, склад, поставки | `factions/{garage,wardrobe,workshop,warehouse,supply,materials,inventory}/*` | `client/factions/{garage,wardrobe,workshop}` | 2.5, 3.1, 7.1 |
| 7.5 | Банды, мафия, зоны, войны, форт | `factions/{gangs,mafia,wars}/*` | `client/factions/gang/*`, `UI/Factions` | 7.1, 2.1 |
| 7.6 | Планшет фракций | — | `client/factions/tablet`, `UI/Tablet` | 7.1, 7.4 |

### Этап 8 — телефон

| № | Модуль | Сервер | Клиент / UI | Зависит |
|---|---|---|---|---|
| 8.1 | Телефон: номер, контакты, ЧС, звонки | `phone/*` | `client/basic/phone`, `UI/Phone` | 1.8, 3.1 |

### Этап 9 — админка, награды, донат

| № | Модуль | Сервер | Клиент / UI | Зависит |
|---|---|---|---|---|
| 9.1 | Админка: баны, репорты, деморган, права, телепорт | `admin/*` | `client/admin/*`, `UI/Admin` | 1.3, 2.4, 5.1 |
| 9.2 | Награды, бонусы, рефералы, задания, промо | `awards/*` | `UI/Daily`, `UI/Promo` | 1.3, 3.1 |
| 9.3 | Донат и HTTP API | `donation/*`, `api/*` | — | 1.1 |

### Этап 10 — дополнительное и ассеты

| № | Модуль | Сервер | Клиент / UI | Зависит |
|---|---|---|---|---|
| 10.1 | Мини-игры: lockpick, рыбалка | `games/*`, `services/fishing/*` | `client/games/*`, `UI/Games` | 4.1 |
| 10.2 | Target-меню | `ox_target` (или свой) | `client/player/target/*`, `UI/Target` | 2.1, 2.4 |
| 10.3 | Мир: AFK, зелёные зоны, сценарии, катсцены, waypoint | `basic/point`, `helpers/{animations,attachments}` | `client/basic/{afk,green-zone,scenarios,cutscene,location,waypoint,fps}`, `client/helpers/camera` | 2.1 |
| 10.4 | Античит и тюрьма | `basic/{anti-cheat,prison}` | `client/basic/anti-cheat` | 1.3, 7.2 |
| 10.5 | Ассеты, loadscreen, полировка UI | `srp_assets` (dlcpacks, vehicleData) | `UI/Common` | 0.1 |

### Полнота: каждый каталог исходников имеет свой модуль

| Серверный каталог | Модули |
|---|---|
| `admin` | 9.1 |
| `api` | 9.3 |
| `auth` | 1.1 |
| `awards` | 9.2 |
| `basic` | 1.6, 1.7, 1.8, 2.3, 3.1, 3.2, 4.8, 10.4 |
| `business` | 5.2 |
| `data` | 0.6 |
| `donation` | 9.3 |
| `factions` | 7.1–7.5 |
| `helpers` | 0.4, 1.5, 2.1, 2.2, 2.4, 4.8, 10.3 |
| `house` | 5.1 |
| `jobs` | 6.1–6.6 |
| `models` | 0.5 |
| `phone` | 8.1 |
| `player` | 1.2, 1.3, 1.4, 3.1, 3.2, 3.3, 4.2 |
| `services` | 4.1–4.7, 10.1 (рыбалка) |
| `utils` | 0.2 |
| `vehicle` | 2.4, 2.5, 4.4, 4.5 |

| Клиентский каталог | Модули |
|---|---|
| `admin` | 9.1 |
| `auth` | 1.1 |
| `basic` | 1.5–1.8, 2.3, 3.1, 10.3 |
| `factions` | 7.2, 7.4, 7.5, 7.6 |
| `games` | 10.1 |
| `helpers` | 0.3, 2.1, 2.2, 10.3 |
| `jobs` | 6.2–6.6 |
| `natives` | 2.4 |
| `player` | 1.2, 1.3, 1.4, 10.2, 10.3 |
| `property` | 5.1 |
| `services` | 4.2–4.7 |
| `trading` | 5.3 |
| `utils` | 0.3, 10.3 |
| `vehicle` | 2.4, 2.5 |
| `weapons` | 3.2 |

| UI-экран | Модуль |
|---|---|
| `Admin` | 9.1 |
| `Auth` | 1.1 |
| `Business` | 5.2 |
| `Character` | 1.2 |
| `Chat` | 1.7 |
| `Common` | 0.3 |
| `Daily` | 9.2 |
| `Dialog` | 2.1 |
| `Factions` | 7.1–7.5 |
| `Games` | 10.1 |
| `HUD` | 1.5 |
| `House` | 5.1 |
| `Inventory` | 3.1 |
| `Job` | 6.1 |
| `Phone` | 8.1 |
| `Player` | 1.3, 4.2 |
| `Promo` | 9.2 |
| `Services` | 4.1–4.7 |
| `Spawn` | 1.4 |
| `Tablet` | 7.6 |
| `Target` | 10.2 |
| `Trading` | 5.3 |

## 7. Детали по этапам

### Этап 0 — фундамент (10–14 дн.)

1. **0.1.** Скелет `resources/[streetrp]`, `fxmanifest.lua` для `srp_core`/`srp_ui`, `server.cfg`
   (порядок ensure, конвары), MySQL 8.4, `oxmysql`, `ox_lib`, `qbx_core`, сборка Vue → `srp_ui/web`.
2. **0.2.** `srp_core`: конфиг из конваров, логгер, классы ошибок, векторы, миграции, `srp_schema_version`.
3. **0.3.** NUI-мост: `callServer`/`callClient`/`register`/`send`, фокус, страницы, feature-flags.
   UI определяет транспорт сам (`window.mp` → rage-rpc, иначе NUI) — один билд для обоих серверов.
4. **0.4.** Сессии: `playerDropped`/`playerJoining`, реестр `source → Player`, statebags
   (`authorized`, `isDying`, `colshape`), сохранение при выходе и рестарте.
5. **0.5.** Схема: 20+ таблиц (раздел 8), миграции, индексы, `legacy_id` для статики.
6. **0.6.** `srp_import`: JSON из дампа (раздел 9), импорт статики, отчёт сверки.

**Готово:** пустой FiveM-сервер стартует с Qbox, `srp_core`, `srp_ui`; UI открывается и показывает
заглушку; БД создана; статика импортирована; `pnpm registry` — 0 пропусков среди перенесённых имён.

### Этап 1 — вход в игру (18–24 дн.)

1. **1.1 Auth.** Вход по `license` с привязкой email; коды на почту; сброс доступа при смене license.
   Пароль/соцсеть RAGE (`socialClub`, `serial`) заменяются на `license`/`discord`/`ip`.
   Баны проверяются до спавна.
2. **1.2 Character.** Один персонаж Qbox; создание через Vue (`Character-Create`); внешность —
   `illenium-appearance`; одежда стартового набора кладётся в ox_inventory.
3. **1.3 Player core.** Деньги — `qbx_core` (cash/bank), поинты — `srp_accounts.donate`; голод/жажда —
   metadata Qbox; здоровье/смерть — `srp_player`; сохранение позиции — `utils/savepos`.
   Дом/бизнес/фракции/машины/награды подключаются через `srp:playerLoaded` (раздел 2.1);
   до этапов 5–9 их загрузка — no-op, `tasks`/`bonus` — заглушки.
4. **1.4 Spawn.** Стартовая точка; варианты «дом»/«фракция» включаются после 5.1/7.1, до этого — только старт.
5. **1.5 HUD.** Деньги, онлайн, микрофон, подсказка взаимодействия; данные — statebags + RPC.
6. **1.6 Time/Weather.** Синхронизация времени и погоды через `Renewed-Weathersync` или свой цикл.
7. **1.7 Chat.** Свой NUI-чат в дизайне StreetRP; команды — из `basic/chat/commands`.
8. **1.8 Voice.** `pma-voice`, диапазон 10 м, слушатели/том — замена `enableVoiceTo`.

**M1:** игрок заходит, подтверждает email, создаёт персонажа, спавнится, видит HUD, говорит в голосовой чат.

### Этап 2 — мир и транспорт (12–16 дн.)

1. **2.1 Зоны.** `ox_lib` zones/PolyZone на клиенте + серверная проверка дистанции; событие `E`;
   подсказка в HUD. Серверных colshape с enter/exit в FiveM нет — не эмулируем тиками без нужды.
2. **2.2 Блипы/маркеры/пикапы.** Сервер создаёт блипы, клиент рисует маркеры; пикапы — сущности
   с owner-check.
3. **2.3 Двери.** `ox_doorlock` + импорт `data/doors.json` (если есть) или свои точки.
4. **2.4 Транспорт.** Спавн/удаление — через `qbx_vehicles`; топливо — statebag
   `fuel`, расход из StreetRP; ключи/замок — `qbx_vehiclekeys`; здоровье/двери/индикаторы — statebags.
5. **2.5 Владение.** `player_vehicles` Qbox: plate ≤ 8 символов, `govNumber` → `plate`; история
   владельцев — `srp_vehicle_history`; тюнинг — `VehicleProperties` ox_lib.

**M2:** машины спавнятся/удаляются, замок и топливо работают, зоны и двери срабатывают.

### Этап 3 — инвентарь и бой (12–16 дн.)

1. **3.1 Инвентарь.** `ox_inventory` — владелец данных; `cell` → `slot = cell + 1`, `amount` → `count`,
   `data` → `metadata`; хранилища `house:<id>`, `faction:<name>`, багажник. Web-UI — форк `ox_inventory/web`
   в дизайне StreetRP (параллельный фронтенд-поток, начинается на M1).
2. **3.2 Оружие/бой.** Урон по частям тела, броня, синхронизация — `srp_combat`; предметы оружия/патронов
   в ox_inventory; запрет дюпа при передаче.
3. **3.3 Одежда.** 9 слотов экипировки через metadata + хуки ox_inventory; каталог 989 позиций — Lua-конфиг.

**M3:** предметы используются, экипируются, передаются; бой совпадает с эталоном.

### Этап 4 — сервисы и экономика (18–24 дн.)

Каркас `service.lua` (точки, радиус, меню, оплата), затем по одному: банк/лицензии/паспорт,
супермаркет/оружейный/одежда, АЗС, LSC, автосалоны/аренда/свалка, барбер/тату/хирург, PayDay.
Каждый сервис — отдельный коммит и эталонный сценарий (цена, отказ, повтор).

**M4:** все 21 сервис проходят сценарии; деньги списываются ровно один раз.

### Этап 5 — недвижимость (8–12 дн.)

Дома: вход/выход, routing bucket (замена `dimension`), замок, stash, налоги, продажа.
Бизнесы: покупка, доход, налоги, продажа. Сделки — через серверные транзакции.

**M5:** операции переживают рестарт; налоги и доход совпадают за N циклов.

### Этап 6 — работы (12–18 дн.)

Ядро: уровни, кулдауны, точки, рабочий транспорт, награды. Затем 5 работ отдельными коммитами.
Работа и фракция — мультиджоб Qbox (активная работа переключается, фракция сохраняется).

**M6:** каждая работа проходится от найма до выплаты; уровни/кулдауны совпадают.

### Этап 7 — фракции (22–30 дн.)

1. Ядро: ранги/права, касса, материалы, журнал, лидер, приглашения.
2. Полиция: розыск, штрафы, вызовы, тюрьма, наручники, мешок; EMS: вызовы, лечение, лицензии;
   армия: билеты, поставки.
3. Гараж/гардероб/мастерская/склад/поставки/материалы/фракционный инвентарь.
4. Банды/мафия: 90 зон, захваты, форт.
5. Планшет: 23 внутренних маршрута, Framework7-обёртки уже готовы во Vue.

**M7:** фракционные сценарии на двух клиентах; касса и склад не дюпаются.

### Этап 8 — телефон (5–7 дн.)

Номер, контакты, ЧС, звонки (pma-voice), история; UI-телефон без изменений.

**M8:** звонок между двумя клиентами, сброс, чёрный список.

### Этап 9 — админка, награды, донат (8–12 дн.)

Админ-панель и команды, баны, репорты, деморган, спектатор/fly/ESP, журнал; ежедневные награды,
бонус, рефералы, задания, промокоды; донат-API (`SetHttpHandler` + HMAC + идемпотентность).

**M9:** админ-действия пишутся в журнал; награды нельзя получить дважды.

### Этап 10 — дополнительное и ассеты (10–14 дн.)

Мини-игры, target, мир (AFK, зелёные зоны, сцены), античит, тюрьма; dlcpacks → stream-ресурс,
`vehicleData.json`, loadscreen, полировка UI.

**M10:** контент включён, `resmon` в простое < 0,1 мс на ресурс.

### Этап 11 — тесты и запуск (6–9 дн.)

Импорт статики в боевую БД, нагрузка, мультиклиентные сценарии, отказоустойчивость, бэкапы,
закрытая бета.

## 8. Схема MySQL 8.4

Стандартные таблицы Qbox/ox (`players`, `player_groups`, `player_vehicles`, `playerskins`, `bans`,
`ox_inventory`, `ox_doorlock`) не меняются — запись только через API ресурсов.

| Таблица | Поля (основные) | Источник |
|---|---|---|
| `srp_accounts` | `id` PK AI, `license` UNIQUE, `email` UNIQUE NULL, `email_verified`, `password_hash` NULL, `admin_lvl`, `donate`, `referral_award`, `created_at`, `last_login`, `legacy_id` | User |
| `srp_account_ips` | `account_id`, `ip` VARBINARY(16), `seen_at` | User.ip |
| `srp_email_codes` | `id`, `account_id`, `email`, `code_hash`, `type` ENUM, `expires_at`, `attempts`, `created_at` | Token |
| `srp_donations` | `payment_id` UNIQUE, `account_id`, `amount`, `created_at` | новое (идемпотентность) |
| `srp_houses` | `id`, `legacy_id`, `type`, `pos_x/y/z`, `heading`, `owner_citizenid` NULL, `locked`, `paid_days`, `price` | House |
| `srp_businesses` | `id`, `legacy_id`, `name`, `pos_x/y/z`, `price`, `income`, `owner_citizenid` NULL, `paid`, `payment_time` | Business |
| `srp_factions` | `name` PK, `money`, `materials` | Faction |
| `srp_faction_grades` | `faction`, `grade`, `name`, `salary`, `permissions` JSON, PK(`faction`,`grade`) | Faction.ranks |
| `srp_faction_logs` | `id`, `faction`, `citizenid`, `action`, `thing`, `amount`, `created_at` | FactionLog |
| `srp_gang_zones` | `id`, `legacy_id`, `pos_x/y/z`, `owner_gang` NULL, `captured_at` NULL | GangZone |
| `srp_wanted` | `id`, `creator`, `suspect`, `priority`, `reason`, `created_at` | Wanted |
| `srp_vehicle_history` | `id`, `plate`, `citizenid`, `owned_from`, `owned_to` NULL | Vehicle.oldOwners |
| `srp_phone_contacts` | `id`, `citizenid`, `name`, `number`, UNIQUE(`citizenid`,`number`) | phone.contacts |
| `srp_phone_blacklist` | `citizenid`, `number`, PK | phone.blacklist |
| `srp_promos` | `id`, `code` UNIQUE, `owner_account` NULL, `income`, `bonus` | Promo |
| `srp_promo_uses` | `promo_id`, `account_id`, `used_at`, PK | новое |
| `srp_reports` | `id`, `sender`, `admin` NULL, `message` TEXT, `resolved`, `created_at` | Report |
| `srp_admin_logs` | `id`, `admin`, `target` NULL, `action`, `note`, `created_at` | AdminLog |
| `srp_logs` | `id`, `channel`, `payload` JSON, `created_at`, INDEX(`channel`,`created_at`) | Redis-логи |
| `srp_schema_version` | `version` PK, `applied_at` | миграции |

Что уходит в metadata Qbox: опыт, навыки, задания, `dailyBonus`, `arrest`, `vehicleSlots`,
`bankAccount`, лицензии, телефонный номер, `paydayTime`, `bonusTime`. Внешность — `playerskins`;
деньги — `players.cash/bank`; инвентарь — `ox_inventory`; машины — `player_vehicles`.

`Counter` (uid персонажа) заменяется на `AUTO_INCREMENT`/`cid` Qbox; отдельная таблица не нужна.
`Clothes`, `Service`, `Job` — статические Lua-конфиги, не БД.

## 9. Импорт статики из MongoDB

`database.sql` — mongosh-скрипт, не SQL. План импорта:

1. `tools/import/parse-dump.mjs` выполняет дамп в песочнице `vm` с заглушками `db`,
   `ObjectId`, `ISODate`, `NumberInt`; на выходе — `static/<collection>.json`.
   (Альтернатива: временный MongoDB + `mongoexport --jsonArray`; песочница быстрее и не требует Mongo.)
2. Ресурс `srp_import` читает JSON через `LoadResourceFile`, `json.decode`, пишет в MySQL батчами
   в транзакции; повторный запуск идемпотентен (`ON DUPLICATE KEY UPDATE` по `legacy_id`).
3. Владельцы домов/бизнесов и кассы фракций обнуляются; `_id`, `__v`, `createdAt`-строки
   конвертируются; `ObjectId`-ссылки сохраняются как `legacy_id` для сверки.
4. Отчёт: количество записей по коллекциям, пропуски, расхождения с дампом.
5. Дамп архивируется вне сервера; в работе не используется.

Игровые данные (аккаунты, персонажи, машины, инвентарь) не импортируются. Если позже понадобится
перенос аккаунтов — отдельный модуль `srp_import_accounts` (email/донат), без персонажей.

## 10. NUI-мост и флаги страниц

- UI определяет окружение: `window.mp` → rage-rpc (RAGE-эталон), иначе NUI. Один билд UI на оба сервера.
- `rpc.callServer(name, args)` → `fetch('https://srp_ui/callServer')` → client Lua →
  `lib.callback.await('srp:rpc', false, name, args)`; серверный gateway ищет обработчик в реестре,
  проверяет `authorized`, rate-limit, таймаут.
- `rpc.callClient` → NUI callback `callClient` → клиентский реестр обработчиков.
- `rpc.register` → `window.addEventListener('message')`; сервер/клиент шлют `SendNUIMessage({rpc, args})`.
- `mp.invoke('focus')` → callback `focus` → `SetNuiFocus`.
- `Browser-ShowPage`/`HidePage` → экспорты `srp_ui:ShowPage(page, data)` / `HidePage()`.
- Флаги: `srp_ui/shared/pages.lua` — список включённых страниц; UI при старте получает `UI-Boot`
  и закрывает непортированные маршруты заглушкой «в разработке». Это позволяет запускать сервер
  после каждого этапа.

## 11. Тестирование и паритет

- **Реестр:** `pnpm registry`; для каждого этапа — 0 пропусков среди его RPC, список отклонений
  ведётся в `REGISTRY.md`.
- **Эталон:** до переноса модуля записывается сценарий на RAGE (шаги, цифры, тексты), после — тот же
  сценарий на FiveM. Распечатка прикладывается к коммиту.
- **Мультиклиент:** сделки, драки, машины, дома, звонки, захваты — минимум два клиента.
- **Отказоустойчивость:** рестарт ресурса, рестарт сервера, обрыв MySQL, reconnect, повторный вход.
- **Нагрузка:** `resmon`, профилирование клиентских циклов `Wait(0)`, 30–50 ботов на тестовом стенде.
- **Экономика:** журнал начислений; проверка двойных списаний/начислений за N циклов PayDay.

## 12. Риски

| Риск | Мера |
|---|---|
| MySQL 8.4 auth plugin (`caching_sha2_password`) не подходит инструменту | Проверить oxmysql на этапе 0; при необходимости включить `mysql_native_password` явно |
| Смешение collations после импорта | Все таблицы `utf8mb4_0900_ai_ci`; проверка `information_schema` в миграции |
| Qbox обновляется и ломает интеграцию | Версии зафиксированы, только публичные exports, обновление через dev-стенд |
| Двойные системы (paycheck Qbox + `srp_payday`, голод Qbox + свой цикл) | Владелец данных один; выключение дублей в конфиге на этапе 1 |
| Инвентарь: ox_inventory UI не совпадёт 1:1 | Форк только `web/`, сверка скриншотами, fallback — свой UI поверх exports |
| `dimension` → routing bucket меняет видимость/голос | Тест с двумя клиентами в доме/интерьере на M2/M5 |
| Постепенный перенос оставляет «полуживые» экраны | Feature-flags страниц + заглушка «в разработке» |
| Потеря данных при миграции статики | `legacy_id`, отчёт сверки, повторный идемпотентный импорт |
| Рост сроков из-за UI-полировки | Фронтенд-поток параллельно, начиная с M1 (инвентарь, планшет) |

## 13. Ближайшие шаги

1. Поднять стенд: MySQL 8.4, FXServer, Qbox-рецепт, `oxmysql`/`ox_lib`/`qbx_core`, зафиксировать версии.
2. Создать `resources/[streetrp]` со скелетом `srp_core` и `srp_ui`; собрать Vue в `srp_ui/web`.
3. Реализовать 0.3–0.4: NUI-мост, gateway `srp:rpc`, сессии, statebags, feature-flags.
4. Написать миграции 0.5 и парсер дампа 0.6; импортировать статику в тестовую БД.
5. Записать эталон M1 (вход/персонаж/спавн/HUD) на RAGE и перенести модули 1.1–1.8.

После каждого этапа обновлять этот файл: отметка «сделано», фактические даты, отклонения.

## 14. Журнал прогресса

| Модуль | Статус | Дата | Коммит | Отклонения / заметки |
|---|---|---|---|---|
| Реестр RPC/событий (подготовка к 0.3) | готово | 30.10.2026 | `2e0ee54` | найдены мёртвые вызовы `playerWeaponShot`, `VehicleSync-SetDirtLevel` |
| 0.1 Каркас и стенд | не начато | — | — | нужен FXServer + MySQL 8.4 |
| 0.2 `srp_core` | не начато | — | — | — |
| 0.3 NUI-мост | не начато | — | — | — |
| 0.4 Сессии | не начато | — | — | — |
| 0.5 Схема БД | не начато | — | — | — |
| 0.6 Импорт статики | не начато | — | — | — |
| 1.1–1.8 Вход в игру | не начато | — | — | M1 |
| 2.x Мир и транспорт | не начато | — | — | M2 |
| 3.x Инвентарь и бой | не начато | — | — | M3 |
| 4.x Сервисы | не начато | — | — | M4 |
| 5.x Недвижимость | не начато | — | — | M5 |
| 6.x Работы | не начато | — | — | M6 |
| 7.x Фракции | не начато | — | — | M7 |
| 8.x Телефон | не начато | — | — | M8 |
| 9.x Админ/награды/донат | не начато | — | — | M9 |
| 10.x Дополнительное | не начато | — | — | M10 |
| 11 Тесты и запуск | не начато | — | — | Launch |
