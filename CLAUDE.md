# PixiJS Slot Game — Project Conventions

## Project Structure

```
src/
├── api/           # API clients, payload parsers (pure functions)
├── animation/     # PixiJS spine animations (per asset)
├── audio/         # Sound manager + sound assets
├── components/    # Generic reusable UI (e.g. <Modal> wrapper)
├── config/        # Static config (paylines, etc.)
├── features/      # Feature modules (splash, slot, gameLoader)
├── hooks/         # Reusable React hooks
├── locales/       # i18n strings (one file per language)
└── utils/         # Pure utility functions
```

## Modal Organization

Three categories — pick the right one:

### 1. Generic Modal wrapper → `components/modal/`

The `<Modal>` component is a UI preset with fixed layout (title/subtitle/badge/icon/close).
Use it when you need a simple titled dialog.

### 2. Slot dialogs → `features/slot/modals/`

Short-lived confirmation/info dialogs scoped to the slot feature.
**They use the generic `<Modal>` wrapper** for consistent styling.
Examples: `InsufficientFundsModal`, `ConnectionLostModal`, `AutoSpinModal`.

Import via the barrel:

```ts
import { InsufficientFundsModal } from "@/features/slot/modals";
```

### 3. Sub-feature modals → live in their own folder

Modals that contain a **whole sub-feature** (tabs, panels, complex internal state) stay next
to their related code, NOT in `modals/`. They're conceptually full screens that happen to
overlay the game.

Examples:

- `features/slot/menu/MenuModal.tsx` — wraps Paytable/Info/Sound tabs
- `features/slot/test/TestModal.tsx` — dev-only spin preset picker

Don't move these to `modals/` — that splits them from their content.

## Hooks Naming & Location

- Reusable hooks (shared across features) → `src/hooks/`
- Feature-private hooks → live next to the feature (e.g. `features/gameLoader/useGameLoader.ts`)

Naming: `useThing()` describes what it returns or owns. Examples:

- `useAutoplay` — autoplay state machine
- `useRgsSession` — RGS authenticate / play / end-round facade
- `useResponsiveCanvas` — keeps Pixi renderer synced to container

## Imports

- Use `@/…` absolute imports for cross-feature deps (e.g. `@/utils/currency`).
- Use relative imports (`./`, `../`) within the same feature.
- When a folder has 3+ siblings re-exported, add an `index.ts` barrel.

## State Management

Currently: pure React hooks + prop drilling through `SlotMachinePixi`.
No Redux or Context. If you need to share state across siblings, lift to the nearest common
parent before reaching for context.

## RGS session

`useRgsSession` is a **facade** composed of:

- `src/api/rgs/` — thin REST client (`authenticate` / `play` / `endRound` / `event`)
- `features/slot/player/BookPlayer` — walks a math `book` into the existing reel visual state
- `api/gameTypes` — `WinLine` / `PaytableEntry` shared by UI and the player

Don't merge them back. Each module has one reason to change.

Until math lands, `npm run dev` without `sessionID`+`rgs_url` uses a mock RGS so the Pixi player stays playable.
