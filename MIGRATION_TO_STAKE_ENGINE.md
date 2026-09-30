# План миграции проекта на Stake Engine

Цель: перенести текущий слот на платформу [stake-engine.com](https://stake-engine.com),
используя **их math-модель и RGS**, но **свой уже готовый React/PixiJS фронтенд**.

---

## 0. Что такое Stake Engine (коротко)

Платформа состоит из трёх слоёв:

1. **Math SDK** — Python-движок, где описываются правила игры (paytable, барабаны,
   betmodes), запускаются симуляции и оптимизируется RTP. Генерирует `books`
   (последовательности событий раунда), `lookup tables` (веса раундов) и `configs`.
2. **RGS (Remote Gaming Server)** — production-бэкенд Stake: авторизация игрока,
   валидация ставок, кошелёк, выдача заранее сгенерированных раундов, логирование.
3. **ACP (Admin Control Panel)** — веб-панель, где загружаются `publish_files`
   математики и билд фронтенда, публикуются и тестируются игры.

Мы **используем 1 и 2** (math + RGS), а вместо стандартного Svelte-фронта грузим
свой React/PixiJS билд.

---

## 1. Регистрация и доступы

- [ ] Зарегистрировать аккаунт разработчика на stake-engine.com, получить доступ к ACP.
- [ ] Создать новую игру в ACP — получить `gameId` и dev-`rgs_url`.
- [ ] Получить тестовый `sessionID` для локальной разработки против stage-RGS.
- [ ] Прочитать актуальный approval-чеклист (RTP, hit-rate, max-win, stateless).

---

## 2. Подготовка окружения для Math SDK

- [x] Установить **Python ≥ 3.12** и **Rust/Cargo** (нужен оптимизатору).
      *(Python 3.14.2 через Homebrew, Rust 1.98 через rustup.)*
- [x] Склонировать [`StakeEngine/math-sdk`](https://github.com/StakeEngine/math-sdk)
      в отдельную папку рядом с проектом (не внутрь фронта).
      *(Лежит в `../math-sdk/`, форк на GitHub рекомендуется — см. секцию 10.)*
- [x] `make setup` — создать venv и поставить зависимости.
- [x] Прогнать sample-игру `make run GAME=0_0_lines`, убедиться, что в
      `games/0_0_lines/library/publish_files/` появились файлы.

---

## 3. Описание нашей игры в Math SDK

Основа — скопировать подходящий sample:

```bash
cp -r math-sdk/games/0_0_lines math-sdk/games/lost_idol
```

Дальше по приоритету настраиваем:

- [x] **Символы и paytable** — 11 символов, значения выплат сняты с прод-сервера
      (StartGame response). Wild не платит, seven от 2×, аксессуары общие,
      два независимых scatter (dollar 5/20/100, star только за 3).
- [x] **Reelstrips / барабаны** — сгенерирован `BR0.csv` (base) + `WCAP.csv`
      (для force-wincap). Optimizer подобрал веса lookup table под RTP.
- [x] **Betmodes** — только `base` (cost=1.0, rtp=0.965, wincap=5000). Freegame
      и bonus buy выпилены.
- [x] **Win-логика** — lines evaluator из SDK + кастомный `evaluate_scatter_wins`
      в `game_executables.py` (wild не substitute для scatter).
- [x] **События (events/)** — используем стандартные `reveal / winInfo / setWin /
      setTotalWin / finalWin / wincap`. Scatter'ы сливаются в общий `win_data`,
      wild-expand выводится на фронте из board+winLines.

---

## 4. Симуляции и оптимизация RTP

- [x] Начать с малого — `num_sim_args = {"base": 100}`, `run_optimization=False`.
      *(Начали с 10 k, дожали до 1 M.)*
- [x] `make run GAME=lost_idol` → проверить, что books/configs генерятся.
- [x] Поднять число симуляций (миллионы), включить `run_optimization=True`.
      *(1 M симуляций за ~100 сек.)*
- [x] Подогнать под approval:
  - **RTP = 0.9650** — попал точно в цель, в диапазоне 90–98 %.
  - **Hit-rate = 1/3.5** — сильно выше минимума 1/20.
  - **Max-win 5000× = 1/5 000 022** — выше минимума 1/10 M.
  - Freegame/jackpot/gamble/cashout не задействованы — RGS stateless. ✓
- [x] `run_analysis=True` — сгенерить отчёты, положить в PR/дизайн-док для ревью.
      *(Excel-отчёт: `library/lost_idol_full_statistics.xlsx`.)*

На выходе — `games/lost_idol/library/publish_files/`:
```
books_base.jsonl.zst   # 46 MB, 1M сжатых раундов
index.json             # метаданные
lookUpTable_base_0.csv # 19 MB, веса раундов по criteria
```

---

## 5. Адаптация фронтенда под RGS

Сейчас фронт ходит в RGS по REST (`useRgsSession` + `src/api/rgs/`).
Старый SignalR-хаб снят. Math-книги пока проигрываются через существующий
Pixi-пайплайн (reveal → matrix, winInfo → линии, expandingWild → вайлды);
пока math не готов, в `npm run dev` без `sessionID`/`rgs_url` поднимается mock RGS.

### 5.1 Новый API-слой

- [x] Добавить `src/api/rgs/` с тонким HTTP-клиентом. Можно взять готовый
      [`stake-engine-client`](https://github.com/Raw-Fun-Gaming/stake-engine-client)
      как reference — но не тянуть его целиком, если он приносит лишние зависимости.
- [x] Реализовать методы:
  - `authenticate()` → `POST /wallet/authenticate` — баланс, `config.betLevels`,
    активный `round` (для ресумa).
  - `play({ amount, mode })` → `POST /wallet/play` — возвращает `round.payoutMultiplier`,
    `round.id` и **весь `book`** (список событий).
  - `endRound()` → `POST /wallet/end-round` — обязателен, если выигрыш > 0.
  - `event(...)` — прокидывать прогресс проигрывания (endEvent) если понадобится.
- [x] Парсить query-параметры из URL: `sessionID`, `rgs_url`, `lang`, `currency`
      + replay-режим (`replay`, `amount`, `mode`, `event`) для ACP-плеера.
- [x] Учесть конверсию сумм: **API-формат `1_000_000 = $1.00`**, book-формат
      `100 = $1.00`. Одна утилита в `utils/currency.ts`.

### 5.2 Замена SignalR

- [x] Заменить `useSlotsHubSignalR` фасадом `useRgsSession` с той же формой
      наружу (balance, spin(), lastResult, connectionState), чтобы `SlotMachinePixi`
      не переписывать целиком.
- [x] Удалить `useGameAuth` (RGS сам держит сессию) и `useGameConnection`
      (нет постоянного сокета — только REST). Хук `useAutoplay` остаётся.
- [x] `payloadParsers` переписать под book-события Stake, а не под нынешний payload.

### 5.3 Плеер событий (главное)

RGS отдаёт **весь раунд заранее** в виде `book` — фронт должен проиграть его
последовательно и анимации должны совпадать по времени.

- [x] Написать `features/slot/player/BookPlayer.ts` — стейт-машина, которая идёт
      по массиву событий и триггерит соответствующие анимации/звуки.
- [x] Замапить каждое `event.type` из math-модели на существующие анимации
      Pixi/Spine из `src/animation/`. *(реальные события `reveal / winInfo /
      setWin / setTotalWin / finalWin / wincap` → matrix / winLines / expandingWild;
      `boardToMatrix` пропускает padding-строки; `expandingWild` выводится из
      board+winLines, потому что math его отдельно не эмитит)*
- [x] Обработать skip / turbo (мгновенное проигрывание с суммарным результатом).
      *(текущие spinSpeed + slam-stop; BookPlayer.skip готов, задержки в хендлерах появятся с math)*
- [x] Ресум прерванного раунда: после `authenticate` может прилететь `round` —
      нужно догрывать с последнего сохранённого `event`.

### 5.4 Что не должно попасть на прод

- [x] Убрать / зафлагать TestModal (`features/slot/test/`) — только в dev-билде.
- [x] Отключить прямые запросы к текущему бэкенду и любые dev-URL.
- [x] Ревизия i18n — Stake присылает `lang` в URL, использовать его как источник правды.

---

## 6. Билд и упаковка фронта под ACP

- [x] Vite-конфиг: `base: './'` — ACP отдаёт статику из подкаталога с рандомным путём.
- [x] Один HTML-энтри (`index.html`), все ассеты — relative пути.
      *(Проверено: `href="./assets/…"`, `src="./assets/…"`.)*
- [x] Убедиться, что фронт не делает hard-coded запросов к origin — только
      `rgs_url` из query. *(`useRgsSession` → `resolveRgsBaseUrl` из URL.)*
- [ ] `npm run build` → залить **всю папку `dist/`** через "Import Files" на
      странице Files нужной игры в ACP. *(билд собирается — заливка ждёт ACP.)*

---

## 7. Публикация в ACP

- [ ] На странице Files игры залить `publish_files/` из math-sdk.
- [ ] Залить билд фронта (`dist/`).
- [ ] Publish Game → Math (выбрать загруженные конфиги).
- [ ] Publish Game → Front End (выбрать загруженный build).
- [ ] Прокликать в ACP-плеере: авторизация, base-спины, бонус, ресум,
      replay конкретных раундов.

---

## 8. Тестирование

- [ ] **Локально** против stage-RGS: `?sessionID=...&rgs_url=https://stage-rgs...&lang=en&currency=USD`.
- [ ] Проверить edge-кейсы: обрыв сети между `play` и `endRound`, повторный
      `authenticate` с активным раундом, недостаток баланса, автоспин с лимитами.
- [ ] Сверить RTP по большому прогону симуляций с фактическим по логам ACP —
      должны сходиться.
- [ ] Прогнать max-win сценарий через replay, проверить визуальный пик.
- [ ] Проверить на разных разрешениях (у нас есть `useResponsiveCanvas`).

---

## 9. Approval и релиз

- [ ] Собрать отчёт по математике (RTP, hit-rate, распределение выигрышей,
      достижимость max-win) — приложить к заявке на approval.
- [ ] Дождаться ревью Stake, поправить замечания (обычно к math, реже к фронту).
- [ ] Финальная публикация → выкатывается в prod.

---

## 10. Что переписываем в текущем репо (чеклист файлов)

Удалить / переписать:
- `src/features/slot/**` — часть, где идёт коммуникация со старым бэкендом. *(снято)*
- `useSlotsHubSignalR`, `useGameAuth`, `useGameConnection`. *(снято → `useRgsSession`)*
- `src/api/payloadParsers` — под новый book-формат. *(снято → `features/slot/player`)*

Добавить:
- [x] `src/api/rgs/{client.ts, types.ts, currency.ts}`. *(currency живёт в `utils/currency.ts`)*
- [x] `src/hooks/useRgsSession.ts` (фасад вместо SignalR-фасада).
- [x] `src/features/slot/player/BookPlayer.ts` + маппинг `eventType → animation`.
- [ ] Отдельный репозиторий/подпапка `math/lost_idol/` (либо git submodule на
  форк `math-sdk`) — математика хранится рядом с фронтом, но собирается отдельно.

---

## Полезные ссылки

- Math SDK: <https://github.com/StakeEngine/math-sdk>
- Frontend SDK (для reference): <https://stakeengine.github.io/math-sdk/fe_home/>
- RGS TS-клиент (reference): <https://github.com/Raw-Fun-Gaming/stake-engine-client>
- Docs: <https://stake-engine.com/docs>
