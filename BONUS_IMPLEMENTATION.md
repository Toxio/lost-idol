> Обновлено 2026-09-09: актуальные файлы `math-sdk/games/lost_idol/library/publish_files` проверены на 95% RTP во всех режимах. [Текущий статус](audits/approval-fixes-2026-09-09.md). Указания ниже о старых книгах и непроверенных целях относятся к первоначальному этапу реализации.

# Free Spins — first implementation

The base game now awards 10 free spins for 3+ symbol `10` SCATTER gifts (called dollars in the original math). Stars do not trigger the feature. The triggering stake is fixed. Free-spin wilds use multipliers 2, 3, 5, 10 with raw draw weights 60, 25, 12, 3; these are generation weights, not final published probabilities. There are no retriggers. The 5000× cap applies to the whole round and ends free spins early.

The client renders every reveal, separates spin wins from cumulative round wins, shows entry/summary screens and a free-spin counter, blocks new paid rounds/bet changes during the feature, and closes the RGS round after the summary. It uses the original round amount for restored rounds. The existing scatter decoder now derives count from SDK positions when count/kind is absent.

## Local review

Run `npm run dev`, then open the printed local URL with `?bonus=1&lang=ru` (or `lang=en`). Press Spin to play a deterministic math fixture with an additional evaluator-checked win: $1 stake, $5 trigger win, $26 free-spin win, $31 round payout. The first free spin wins on lines 2 (20×) and 7 (5×). This shortcut is available only in development or explicit test builds and only runs through the mock client without a real RGS session. Normal release builds do not include the fixture shortcut.

The dev 🧪 panel also provides `3× Scatter + Free Spins`. It replays the same full book at the current stake without calling play/end-round or changing the wallet. `Win anim · Scatter` remains an animation-only preview.

## Checks

- `node tests/bonus-playback.mjs`: actual SDK fixture, 11 reveals, four stake sizes, cumulative/individual payouts, zero-win reset, scatter count.
- From `../math-sdk`: `PYTHONPATH=.:games/lost_idol env/bin/python games/lost_idol/test_bonus.py`: 120 rounds across zero/base/bonus/wincap criteria, feature count, multipliers, cap and event indices.
- `npm run build`; `npm run lint`.

## Before resubmission

The existing published math books/lookup tables are still the previous base-only version. Regenerate and optimize the math with `games/lost_idol/run.py`, verify actual RTP, bonus frequency and payout distribution, run SDK format checks, and upload matching math and frontend builds together. Optimization targets (95% RTP, including 30 percentage points allocated to bonus-triggering rounds, proposed 1/200 bonus frequency) are configuration targets, not measured or certified results. Do not reuse old lookup tables with the new books.

Bonus copy and SCATTER descriptions use all 16 supported locales (including the Polish pl alias) and English/Spanish social-game overrides. Bonus purchase is implemented below.

## Build variants

- `npm run dev`: test panel and mock RGS enabled.
- `npm run build`: release in `dist/`; test UI and forced spins disabled at compile time.
- `npm run build:test`: test build in `dist-test/`, with test panel and mock RGS (when no session is supplied).
- `npm run preview:test`: serve the test build locally.

Test tools cannot be enabled in a release through URL parameters. Only the explicit test build includes them. The separate output directory keeps test artifacts out of the normal release folder.


## Bonus purchase (5 / 10 / 15 spins)

The shared catalog is `src/config/bonusBuys.json`, read directly by the Python math config. Modes are `bonus_5` (25×), `bonus_10` (45×), `bonus_15` (65×). The base bet remains unchanged: `/wallet/play` receives the base amount and the exact selected mode; the RGS debits base amount × mode cost. Each purchase includes the normal three-SCATTER entry spin (5× payout) and the purchased number of spins. No retriggers or guaranteed Wilds. The entire round, including entry payout, is capped at 5000× base bet. Prices are design choices calibrated through the generated probability tables, not estimates of unweighted reel RTP.

Purchase UI uses the supplied background and first three card assets, with the embedded example prices/text clipped out by layout and real localized values rendered as text. The buy menu shows the stake and total price; pressing Buy starts the selected mode directly with no second confirmation screen. There is an insufficient-balance check, a synchronous round lock, and the `disabledBuyFeature` jurisdiction gate. The chosen mode does not persist into ordinary paid spins. Purchased spins use the existing playback, full-round restore, max speed and settlement paths. Restoring a round currently replays it from its beginning, not its last viewed spin. Local mock purchases are deterministic and use real generated books; they are for functional testing, not a statistical demo of the published weights.

### Generated math files

`../math-sdk/games/lost_idol/library/bonus_buys/` contains a three-mode index, compressed books, integer-weight lookup tables and a report. Each mode has 10,000 ordinary generated bonus rounds plus one deliberately generated 5000× capped outcome. The ordinary outcomes are reweighted with a log-payout exponential tilt to target 95% RTP without changing their payouts. Integer rounding leaves each mode within 0.000001 absolute RTP of the target. The weights—not raw sampling frequencies—define the generated distribution. This is a reproducible initial distribution; broader volatility/session analysis remains appropriate before publication.

Regenerate from `math-sdk`:

```sh
PYTHONPATH=.:games/lost_idol env/bin/python games/lost_idol/build_bonus_buys.py
PYTHONPATH=.:games/lost_idol env/bin/python games/lost_idol/verify_bonus_buys.py
PYTHONPATH=.:games/lost_idol env/bin/python games/lost_idol/test_bonus.py
```

Frontend checks: `node tests/bonus-buy.mjs`, `node tests/bonus-playback.mjs`, `npm run build`.

**Publication:** the generated index contains only the three new purchase modes. It must be combined with the regenerated/verified base-mode publication files; uploading it alone would omit the base game. Existing base-only published math has not been overwritten and is still unsuitable for the new natural free-spin behavior. `run.py` now includes all four modes for a complete SDK regeneration/optimization. That full run produces a different probability distribution from the separate fast purchase generator and must be checked again. No files have been uploaded to Stake Engine in this task.

## Wild Spin purchase

- Catalog mode `wild_spin`, kind `wild_spin`, cost **10× base stake**; one paid spin (not a free-spin package).
- Uses scatter-free `WILD_BUY` strips derived from BR0. If no Wild lands, math inserts one on an inner reel before emitting the reveal. All Wilds expand with ×2/×3/×5/×10; there is at least one Wild reel, but a payout is not guaranteed. SCATTER, stars and free-spin triggers are absent.
- Ordinary outcomes include zero wins. A dedicated valid cap board reaches the existing 5000× base-stake limit. Line evaluation and RGS events use the existing single-spin playback path; no bonus intro or extra confirmation.
- Generated 10,001 books in `math-sdk/games/lost_idol/library/bonus_buys`, with positive integer LUT weights. Measured weighted RTP **95.00004675% of purchase cost**. Local mock uses one deterministic generated fixture and does not represent the weighted distribution.
- The purchase UI now has four options, a two-column mobile layout, selected-mode rules in all 16 locales, and no multiplier labels over the reels. All four modes are covered by debit, payout, restore, settlement and playback checks.
- These are local implementation and generated purchase artifacts. Production activation still requires regenerating/combining the base publication data and uploading the matching complete math package to Stake Engine; the purchase-only index must not replace the base manifest by itself.
