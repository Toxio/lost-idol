# Lost Idol

Игра для Stake Engine на React, TypeScript и PixiJS.

## Локальный запуск

```sh
npm install
npm run dev -- --host 127.0.0.1
```

Без `sessionID` и `rgs_url` запускается локальный mock RGS.

```sh
npm run build
```

## Структура проекта

- `src/` — фронтенд игры.
- `../math-sdk/games/lost_idol/` — математика, идентификатор `lost_idol`.
- `../example/` — экспорт Lost Idol с новыми ассетами для переноса.

Текущая механика и графические ассеты унаследованы от исходной игры; их перенос и адаптация выполняются отдельно.
