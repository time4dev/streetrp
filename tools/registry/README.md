# Реестр RPC и событий

Статический анализ RAGE:MP-исходников и Vue-UI: собирает все имена RPC и событий
(обработчики и места вызова) и строит чек-лист переноса на FiveM/Qbox.

```bash
node tools/registry/scan.mjs   # или pnpm registry
```

Выход:

- `registry.json` — машинный список: `name`, `side` (`server`/`client`/`ui`),
  `kind` (`handler`/`call`), `transport` (`rpc`/`raw`), `target`, файл и строка.
- `REGISTRY.md` — сводка, таблица покрытия и списки вызовов без обработчиков.

Как читать таблицу покрытия:

| Колонка | Значение |
|---|---|
| `UI→S` / `UI→C` | UI вызывает сервер / клиент (`rpc.callServer` / `rpc.callClient`) |
| `C→S` / `C→UI` | клиент вызывает сервер / UI (`mp.events.callServer` / `callBrowser`) |
| `S→C` | сервер шлёт клиенту (`callClient`, `player.call`, `callInStream`) |
| `S/C/UI handler` | имя зарегистрировано как обработчик (RPC или raw-событие) |

Ограничения:

- Имена, собранные динамически (шаблонные строки, переменные), не попадают в реестр —
  такие места ищутся глазами (`rpc.callServer(event, ...)`).
- `raw`-события (`mp.events.add`, `subscribeToDefault`, `player.call`) — это нативные
  события RAGE:MP; на FiveM им соответствуют `RegisterNetEvent`/`AddEventHandler`
  или серверные statebag-хендлеры (см. `PLAN.md`, раздел 4).
- Повторный запуск после правок обязателен: реестр — источник истины для
  «все 218 RPC имеют обработчик» (критерий готовности, раздел 8).
