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
| Голод и жажда | Обе потребности: стандартный механизм `qbx_core` (`metadata.hunger` / `metadata.thirst`). Жажда — по стандарту Qbox. В HUD появляется индикатор жажды, в игру добавляются напитки (раздел 4.6) |
| Рация | **`mm_radio`** из шаблона, закрытые частоты фракций (раздел 4.7) |
| Работы и фракции Qbox | Работы шаблона включаются; job-фракции шаблона (механики, такси, эвакуаторы, репортёры) добавляются к фракциям StreetRP. Дополнительный контент шаблона (ограбления, криминал, гонки, удобства) тоже включается (раздел 3.2) |
| Почта | **Mailtrap** Email Sending API (HTTP) |
| Тестовый сервер | 2 vCPU, 2 ГБ RAM, 20 ГБ SSD (раздел 4.8) |
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
| Голод и жажда | `metadata.hunger` / `metadata.thirst`, убыль и урон на нуле — циклы `qbx_core` | `qbx_core` | Раздел 4.6. От выключенного `qbx_medical` не зависит |
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
| Голос | `pma-voice` + обёртка `srp_voice` (смерть, мут, дистанция) | — | |
| Рация (новое) | `mm_radio` + предмет `radio` в ox_inventory | — | Закрытые частоты фракций — раздел 4.7 |
| Работы шаблона (новое) | `qbx_busjob`, `qbx_garbagejob`, `qbx_truckerjob` и др. рядом с 5 работами StreetRP | `qbx_core` (job) | Найм через точки/экраны StreetRP, выплаты под экономику StreetRP — раздел 3.2 |
| HUD, спидометр | Vue HUD (+ жажда) | — | `qbx_hud` выключается |
| Чат | Vue-чат; команды через `RegisterCommand` / `lib.addCommand` | — | `chat` и `qbx_chat_theme` выключаются |
| Target-меню игрока и машины | `ox_target` | — | Действия `player/target/*` регистрируются как опции; Vue-экран Target не используется. `qbx_radialmenu` выключается |
| Двери | `ox_doorlock` | `ox_doorlock` | Импорт `data/doors.json` |
| Анимации, сценарии | `srp_player` по `data/animations.json`, `scenarios.json` | — | `scully_emotemenu` остаётся для `qbx_mechanicjob`, его меню скрыто |
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
| **Оставить: основа** | `oxmysql`, `ox_lib`, `qbx_core`, `ox_inventory` (с новым web-UI), `ox_target`, `ox_doorlock`, `qbx_vehicles`, `qbx_vehiclekeys`, `pma-voice`, `mm_radio`, `illenium-appearance`, `Renewed-Weathersync`, `cfx-server-data` (кроме `chat`) |
| **Оставить: работы и job-фракции (одобрено)** | `qbx_busjob`, `qbx_garbagejob`, `qbx_truckerjob`, `qbx_recyclejob`, `qbx_vineyard`, `qbx_diving` + `qbx_divegear`, `qbx_taxijob`, `qbx_towjob`, `qbx_mechanicjob`, `qbx_newsjob` (раздел 3.2) |
| **Оставить: окружение** | `bob74_ipl`, `qbx_density`, `scully_emotemenu` (нужен `qbx_mechanicjob`), `qbx_smallresources` (с ревизией конфига), `qbx_invimages` (как источник иконок, если нужных нет в StreetRP), `screencapture`, `MugShotBase64`, `mana_audio`, `loadscreen` (оформить под StreetRP) |
| **Выключить: дублируют StreetRP** | `qbx_hud`, `qbx_spawn`, `qbx_vehicleshop`, `qbx_vehiclesales`, `qbx_garages`, `qbx_customs`, `qbx_carwash`, `qbx_police`, `qbx_ambulancejob`, `qbx_medical`, `xt-prison`, `qbx_properties`, `qbx_management`, `qbx_cityhall`, `qbx_idcard`, `Renewed-Banking`, `ox_fuel`, `npwd`, `npwd_qbx_garages`, `npwd_qbx_mail`, `qbx_npwd`, `qbx_radialmenu`, `chat`, `qbx_chat_theme`, `qbx_adminmenu` (на проде) |
| **Оставить: дополнительный контент (одобрено)** | Ограбления, криминал, гонки, удобства, карта — раздел 3.2 |
| **Решить на этапе 1** | `vehiclehandler` (может конфликтовать с `vehicle/health` StreetRP) |

Перед выключением каждого ресурса нужно проверить, что от него не зависит что-то из оставленного (`dependencies` в `fxmanifest.lua`).

### 3.2. Контент шаблона, которого не было в StreetRP

**Одобрено: работы и job-фракции.** Общие условия интеграции:
- Работы Qbox держат игрока в job-слоте. У игрока, состоящего во фракции, используется мультиджоб Qbox (`player_groups`): активная работа переключается, фракция сохраняется.
- `qbx_cityhall` выключен, поэтому найм идёт через точки и экран `Job` StreetRP: `srp_jobs` вызывает `exports.qbx_core:AddPlayerToJob` / `SetPlayerPrimaryJob`.
- Выплаты (`AddMoney` внутри ресурсов) приводятся к ценам StreetRP через их конфиги; правок кода ресурсов избегаем.
- Рабочий транспорт этих ресурсов получает топливо и ключи через `srp_vehicles` (statebag `fuel`, `qbx_vehiclekeys`).
- `qbx_mechanicjob` вызывает exports `scully_emotemenu` (`playEmoteByCommand`, `cancelEmote`), поэтому `scully_emotemenu` остаётся включённым. Основное меню анимаций — StreetRP, команды меню scully скрываются в его конфиге.

**Совместимость с выключенными ресурсами.** Контент шаблона шлёт события ресурсов, которые мы выключили. Ресурс `srp_compat` принимает их и передаёт в системы StreetRP:

| Событие / export | Кто шлёт | Куда идёт |
|---|---|---|
| `police:server:policeAlert` | ограбления, `qbx_drugs` | Вызовы `srp_police` (планшет, метка на карте) |
| `evidence:server:CreateFingerDrop` | ограбления | Пока no-op (улик в StreetRP нет) |
| `hud:server:GainStress` | ограбления | No-op (стресса в StreetRP нет) |
| `qb-phone:server:sendNewMail` | `qbx_drugs`, `qbx_pawnshop`, `qbx_truckrobbery` | Сообщение в Vue-телефон `srp_phone` |
| `qb-scoreboard:server:SetActivityBusy` | ограбления | Статус активности в `qbx_scoreboard` (проверить, слушает ли он это имя события) |
| `qb-banking:server:SetBankClosed` | `qbx_bankrobbery` | Закрытие отделения банка StreetRP (`srp_services`) на время ограбления |
| `exports['qb-weathersync']` (блэкаут) | `qbx_bankrobbery` | Проверить совместимость `Renewed-Weathersync`, иначе shim |

| Ресурс | Что даёт | Тип |
|---|---|---|
| `qbx_busjob` | Водитель автобуса по маршруту | работа |
| `qbx_garbagejob` | Мусоровоз | работа |
| `qbx_truckerjob` | Дальнобойщик, доставка грузов | работа |
| `qbx_recyclejob` | Сортировка на складе переработки | работа |
| `qbx_vineyard` | Сбор винограда, производство вина | работа |
| `qbx_diving` + `qbx_divegear` | Подводный поиск кораллов + акваланг | работа |
| `qbx_taxijob` | Такси с таксометром | job-фракция (`taxi`) |
| `qbx_towjob` | Эвакуаторщик | job-фракция (`tow`) |
| `qbx_mechanicjob` | Механики: ремонт и обслуживание | job-фракция (`mechanic`) |
| `qbx_newsjob` | Репортёры: камера, микрофон, вертолёт | job-фракция (`reporter`) |

Полиция и EMS шаблона (`qbx_police`, `qbx_ambulancejob`) не включаются: эти фракции уже есть в StreetRP (lspd, ems), два параллельных набора механик конфликтуют.

**Одобрено: дополнительный контент (всё из списка).** Включается после переноса основных систем (этап 8а).

| # | Ресурс | Что даёт | Что сделать при интеграции |
|---|---|---|---|
| 1 | `qbx_storerobbery` | Ограбление касс и сейфов магазинов | Вызовы полиции через `srp_compat`; добыча — в шкале цен StreetRP |
| 2 | `qbx_bankrobbery` | Ограбление банков (Fleeca, Paleto, Pacific), электростанция | Мини-игра `mhacking`, двери `ox_doorlock`; блэкаут — проверить совместимость с `Renewed-Weathersync`; вызовы через `srp_compat`. Банки StreetRP (сервис `bank`) на время ограбления закрываются |
| 3 | `qbx_jewelery` | Ограбление ювелирного | Двери `ox_doorlock`; вызовы через `srp_compat` |
| 4 | `qbx_truckrobbery` | Ограбление инкассатора | Письмо-наводка в Vue-телефон через `srp_compat` |
| 5 | `qbx_houserobbery` | Кражи из домов NPC | Дома StreetRP не затрагивает; вызовы через `srp_compat` |
| 6 | `safecracker`, `mhacking`, `ultra-voltlab` | Мини-игры взлома | Нужны ограблениям; без доработок |
| 7 | `qbx_drugs` | Продажа наркотиков NPC на углах, доставки | Предметы-наркотики `qbx_drugs` и 2 наркотика StreetRP свести в один набор в `srp_items` (эффекты StreetRP сохраняются); письма и вызовы через `srp_compat` |
| 8 | `qbx_weed` | Выращивание марихуаны на улице и в доме | Ресурс берёт дом из `metadata.currentPropertyId`: `srp_housing` выставляет его при входе в дом StreetRP и сбрасывает при выходе. Растения хранятся в своей таблице `weed_plants`; при продаже или изъятии дома они удаляются |
| 9 | `qbx_pawnshop` | Ломбард: скупка и плавка предметов | Цены скупки — в шкале StreetRP; письма через `srp_compat` |
| 10 | `qbx_scrapyard` | Разбор машин на материалы | Ресурс не даёт разбирать только машины из `player_vehicles`, а аренда, рабочий и фракционный транспорт StreetRP туда не входят. Нужна однострочная правка: дополнительная проверка statebag `srp:noScrap`, который `srp_vehicles` ставит на такие машины. Награды не должны обесценивать работу Car_Theft |
| 11 | `qbx_streetraces` | Уличные гонки на ставки | Ставки — через `RemoveMoney`/`AddMoney`, журнал в `srp_logs` |
| 12 | `qbx_lapraces` | Кольцевые гонки с трассами и рейтингом | Своя SQL-таблица; доступ к созданию трасс — по ACE |
| 13 | `qbx_fireworks` | Фейерверки-предметы | Продажа в магазинах StreetRP |
| 14 | `qbx_binoculars` | Бинокль-предмет | Продажа в магазинах StreetRP |
| 15 | `qbx_seatbelt` | Ремень безопасности, вылет из машины | Индикатор ремня — в Vue-спидометр StreetRP |
| 16 | `qbx_scoreboard` | Список игроков онлайн | Оформление под StreetRP — по желанию |
| 17 | `qbx_carwash` | Мойка машины за деньги | Точки моек совместить с бизнесом «Автомойка»: часть оплаты идёт владельцу бизнеса через `srp_business` |
| 18 | `pillbox` | MLO больницы Pillbox | Переписать координаты `data/hospitals.json` и точки EMS под интерьер |

Каждое «да» добавляет 1–3 дня на интеграцию: экономика, вызовы полиции, иконки предметов в стиле StreetRP.

### 3.3. Уточнения по одобренному контенту

Проверено по исходному коду ресурсов шаблона (ветка `main` на 10.10.2026).

- **`qbx_weed` подключается к домам StreetRP без правок.** Ресурс определяет дом игрока по `metadata.currentPropertyId` (сервер и клиент). `srp_housing` выставляет это поле при входе в дом StreetRP (ID из `srp_houses`) и обнуляет при выходе. При продаже, изъятии или смене владельца дома `srp_housing` удаляет растения этого дома из таблицы `weed_plants`.
- **`qbx_scrapyard` — единственная правка кода Qbox в плане.** Сейчас ресурс отказывает в разборке, только если номер машины есть в `player_vehicles`. Арендованный, рабочий и фракционный транспорт StreetRP туда не попадает, и его можно сдать на свалку за награду. Правка — одна строка в `server/main.lua` рядом с проверкой `player_vehicles`: отказ, если у машины statebag `srp:noScrap`. `srp_vehicles` ставит этот statebag на весь такой транспорт. Правка хранится патчем в репозитории (`patches/qbx_scrapyard.patch`) и заново применяется при обновлении ресурса.
- **Блэкаут при ограблении банка не проверен.** `qbx_bankrobbery` (электростанция) вызывает `exports['qb-weathersync']`, а в шаблоне стоит `Renewed-Weathersync`. Есть ли у него совместимые exports под этим именем, не проверено. Проверка — на этапе 8а на стенде. Если совместимости нет, `srp_compat` предоставляет shim с теми же функциями поверх `Renewed-Weathersync`.

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
| `srp_compat` | Приём событий выключенных ресурсов от контента шаблона (раздел 3.2) |
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

Обе потребности обслуживает стандартный механизм `qbx_core`. Своего цикла убыли в `srp_player` нет, чтобы не было двойного списания.

| Параметр | StreetRP сейчас | Qbox (стандарт) | Решение |
|---|---|---|---|
| Убыль голода | −0,5 в минуту (−2,5 за 5 мин) | `hungerRate = 4.2` за `updateInterval = 5` мин | `hungerRate = 2.5`, скорость StreetRP |
| Убыль жажды | — | `thirstRate = 3.8` за 5 мин | Стандарт Qbox |
| Урон на нуле | −5 HP в минуту | −5…10 HP каждые 5 с (`statusIntervalSeconds`), общий для голода и жажды | Стандарт Qbox. Это жёстче, чем в StreetRP; раздельный урон потребовал бы форка `qbx_core` |
| Исключения | Нет убыли в тюрьме и в режиме бога админа | Нет | `srp_police` и `srp_admin` возвращают значения после тика Qbox |

- Предметы: напитки (вода, газировка, кофе, сок) с полем `thirst` в формате `ox_inventory`. Алкоголь (4 шт.) получает `thirst` и сохраняет эффект опьянения. Еда сохраняет `satiety` StreetRP. Ассортимент супермаркета дополняется.
- HUD: индикатор жажды в стиле индикатора сытости StreetRP. Значения читаются из statebag игрока (`LocalPlayer.state.hunger/thirst`) и передаются во Vue (`HUD-SetSatiety`, новое `HUD-SetThirst`).

### 4.7. Рация

- `mm_radio` (зависимости: `pma-voice`, `ox_lib`, OneSync — все есть) + предмет `radio` в `ox_inventory`. Рация продаётся в магазине электроники/супермаркете и выдаётся на складах фракций.
- Закрытые частоты: за каждой фракцией StreetRP (lspd, ems, sang, банды, мафия, job-фракции Qbox) закрепляется диапазон. Доступ проверяется на сервере через `exports['pma-voice']:addChannelCheck(channel, fn)` по членству в job/gang Qbox и праву ранга из `srp_faction_grades`.
- Правила StreetRP для голоса распространяются и на рацию: мёртвый, в тюрьме или замученный игрок не может говорить.
- Интерфейс рации — стандартный `mm_radio`, перерисовка в стиле StreetRP по желанию, отдельной задачей.

### 4.8. Тестовый сервер (2 vCPU, 2 ГБ RAM, 20 ГБ SSD)

Для разработки и закрытого теста на 5–15 игроков этого хватит при следующих условиях:
- **Память.** FXServer с ресурсами Qbox занимает примерно 0,8–1,2 ГБ, MariaDB — 0,3–0,4 ГБ, остальное уходит ОС. Нужен swap 2 ГБ. MariaDB: `innodb_buffer_pool_size = 256M`, `max_connections = 50`, `performance_schema = OFF`. Выключенные ресурсы раздела 3.1 физически не запускаются (`ensure` убран), а не просто «не используются».
- **Диск.** Артефакты FXServer — около 0,3 ГБ, шаблон и ресурсы — 1–2 ГБ, кеш FXServer растёт со стримингом. Размер dlcpacks StreetRP неизвестен — замерить на этапе 0. Бэкапы БД отправляются за пределы сервера, логи ротируются (`logrotate`, txAdmin).
- **Нагрузка.** Нагрузочный тест на этом сервере непоказателен; его результаты не переносятся на боевой онлайн.
- **Боевой сервер** (ориентир для онлайна до 100, уточнить после теста): 4+ vCPU с высокой частотой ядра (FXServer упирается в одно ядро), 8 ГБ RAM, NVMe от 80 ГБ, MariaDB на том же хосте или отдельно.

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

### Этап 6. Работы (13–20 дн.)
1. Работы StreetRP: Building (driver/mover/welder), Waterfront (forklift/handler/mover), Postal (courier/driver/warehouse), Car_Theft (cheap/middle/premium), Smuggling; уровни, кулдауны, рабочий транспорт.
2. Работы шаблона (раздел 3.2): найм через точки StreetRP, мультиджоб, выплаты под экономику StreetRP, топливо и ключи рабочего транспорта, иконки предметов в стиле StreetRP.

### Этап 7. Фракции (19–28 дн.)
1. Ядро фракций (касса, материалы, склад, поставки, гардероб, мастерская, гараж, планшет, ранги и права, журнал), полиция (розыск, штрафы, вызовы, тюрьма, наручники, мешок), армия, EMS (вызовы, лечение, мед. лицензии), банды и мафия (90 зон, захваты, форт).
2. Job-фракции шаблона (такси, эвакуаторы, механики, репортёры): подключение к ядру фракций (касса, планшет, ранги и права), их спецмеханики остаются в ресурсах Qbox.
3. Рация: частоты фракций и проверка доступа (раздел 4.7).
4. `srp_compat`: вызовы полиции от контента шаблона.

### Этап 8. Общение, админка, награды (8–12 дн.)
Телефон и звонки через `pma-voice`, голосовые правила, чаты, админ-панель и команды, баны, репорты, деморган, спектатор/fly/ESP, журнал; ежедневные награды, бонусы, рефералы, задания, промокоды; донат-API (`SetHttpHandler` + HMAC + идемпотентность); погода, время, двери, зелёные зоны, античит (серверные проверки, конвары `sv_entityLockdown`, `sv_filterRequestControl`).

### Этап 8а. Дополнительный контент шаблона (18–28 дн.)
1. `srp_compat`: события выключенных ресурсов (вызовы полиции, письма, улики, стресс, блэкаут).
2. Ограбления (1–6), ломбард, наркотики и выращивание — с привязкой к домам, телефону и полиции StreetRP.
3. Свалка с защитой транспорта StreetRP, гонки, фейерверки, бинокль, ремень, scoreboard, автомойки, Pillbox.
4. Баланс: добыча, скупка и ставки в шкале экономики StreetRP; журнал начислений.

**Готово:** каждый ресурс из раздела 3.2 проходит свой сценарий на двух клиентах, вызовы приходят полиции StreetRP, дюпа денег и предметов нет.

### Этап 9. Ассеты (3–5 дн., параллельно)
`game_resources/dlcpacks` → stream-ресурс `srp_assets` (распаковка RPF → `stream/`, `data_file` для meta), сверка индексов одежды с каталогом `clothes`, проверка моделей из `data/vehicles.json` на целевом `sv_enforceGameBuild`. Оформить `loadscreen` под StreetRP.

### Этап 10. Тестирование и запуск (6–9 дн.)
1. Импорт статики (`srp_import`) на чистую боевую БД, отчёт сверки.
2. Нагрузочный тест на целевом онлайне (в `conf.json` RAGE было `maxplayers 100`): `resmon`, профилирование клиентских циклов `Wait(0)`.
3. Мульти-клиентные сценарии: сделки, драки, машины, дома, звонки, захват.
4. Отказоустойчивость: рестарт ресурса и сервера, обрыв соединения с БД, ежедневный `mariadb-dump` + binlog, проверка восстановления.
5. Закрытый бета-тест, затем открытие. Сброс прогресса после беты — отдельное решение.

**Итого:** ориентировочно 120–180 рабочих дней на одного разработчика, 3,5–5 месяцев для двух, с учётом всего контента из раздела 3.2. Этап 8а можно вести параллельно этапам 6–8 после готовности `srp_police` и `srp_phone`. После этапа 3 этапы 4–8 делятся между людьми по доменам. Перерисовку инвентаря (этап 3) может вести фронтенд-разработчик параллельно с этапом 2.

## 8. Критерии готовности

- Каждая строка реестра этапа 0 либо перенесена и проходит эталонный сценарий, либо имеет явно согласованное отклонение.
- Все 218 RPC из UI имеют обработчик в Lua (кроме экранов, переданных `ox_inventory`/`ox_target`), это проверяет скрипт-реестр.
- Инвентарь визуально соответствует StreetRP; голод и жажда работают и видны в HUD.
- В коде нет обращений к MongoDB/Redis; для запуска сервера не нужны Node/TS (Vue и ox web собираются заранее и кладутся статикой).
- Выключенные ресурсы шаблона из раздела 3.1 не запускаются, двойных начислений и дублирующих UI нет.
- Дополнительный контент из раздела 3.2 работает с системами StreetRP (полиция, телефон, дома, экономика).
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
| Двойная зарплата | Paycheck Qbox отключить (зарплаты только в `srp_payday`); голод и жажду списывает только `qbx_core`; тест за N циклов |
| Изоляция интерьеров домов | Routing buckets отрезают голос и синхронизацию с игроками снаружи; тест с двумя клиентами на этапе 1 |
| Обновления Qbox ломают интеграцию | Версии зафиксированы, обращения только к публичным exports |
| Ассеты dlcpacks доступны только по внешней ссылке | Скачать и сохранить архив на этапе 0 |
| Доставляемость писем | Подтверждённый домен в Mailtrap (SPF/DKIM), лимиты отправки, повторная отправка кода |
| Контент шаблона шлёт события выключенных ресурсов | `srp_compat` (раздел 3.2); при включении каждого нового ресурса — поиск `TriggerEvent`/`exports` к выключенным |
| Работы и контент шаблона ломают экономику StreetRP | Выплаты в их конфигах приводятся к шкале StreetRP до запуска; журнал начислений в `srp_logs` |
| Нехватка памяти на тестовом сервере (2 ГБ) | Swap, урезанный шаблон, настройки MariaDB из раздела 4.8; мониторинг памяти в txAdmin |
| Патч `qbx_scrapyard` теряется при обновлении | Патч в `patches/`, проверка после каждого обновления ресурса; тест «аренда/рабочая машина не разбирается» в смоук-наборе |
| Блэкаут `qbx_bankrobbery` не работает с `Renewed-Weathersync` | Проверка на этапе 8а; при несовместимости — shim `qb-weathersync` в `srp_compat` (раздел 3.3) |

## 11. Открытые вопросы

1. Боевой сервер: целевой онлайн и железо (ориентир — раздел 4.8).

## 12. Ближайшие шаги

1. Развернуть копию сборки на тестовом сервере как dev-стенд, урезать по разделу 3.1, настроить swap и MariaDB (раздел 4.8).
2. Зарегистрировать домен в Mailtrap, получить токены.
3. Написать скрипт-реестр RPC/событий и составить эталонные сценарии.
4. Начать этап 1: `srp_core` + `srp_ui` + прототипы, включая каркас перерисовки `ox_inventory/web`.
