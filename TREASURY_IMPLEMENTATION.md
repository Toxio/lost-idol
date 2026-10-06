# Treasury — active mechanic

Exactly three chest symbols (ID 2), one on each of reels 2, 3 and 4 in any row of the initial base-game board, trigger one Treasury. The final collector board is authoritative. Chests never appear on reels 1 or 5; all circular three-cell reel windows contain at most one chest. Collector replacement symbols cannot create extra chests and the monkey does not overwrite a chest. Chest line payouts are removed in all modes; WILD cannot substitute for the trigger. Respins, free spins and the other purchased modes do not trigger it. The dedicated Treasury purchase guarantees entry.

The player opens any three of six chests. The engine supplies an ordered sequence of awards; a choice determines where the next award is revealed, not its value. Cash awards are 1/2/4/6/10 times the triggering bet. At most one emerald appears. It sets the multiplier to ×2, ×3, ×5 or ×10, applying retrospectively to all cash. At least two awards are cash. The existing 5000× round cap applies.

Base line presentation completes before entry. Treasury then precedes awarded Free Spins or remaining collector respins. Round settlement waits for the complete feature sequence. A completed Treasury cannot credit the wallet twice. Progress is stored per round ID in sessionStorage; an active authenticated book restores the round on reload. Local mock wallet also persists in the browser tab. Replay does not settle a round.

## Event contract

`treasury`: `rewards` (three `{kind: cash|multiplier, value}` entries), `amount`, `uncappedAmount`, `positions`, `picks: 3`, `chests: 6`. Cash and total amounts use book units (100 = one base bet); new events include `multiplierMode: set`, and a multiplier reward value is 2, 3, 5 or 10. At most one multiplier is valid. Legacy events without the marker retain additive decoding for active rounds/replays created before migration. These awards are separate from `winInfo` and included in cumulative `setTotalWin` and `finalWin`.

The frontend validates the reward sum and displays the authoritative capped amount. Existing chest sprite frames 0–10 play once, ending open. The exit transition begins automatically after three openings and a result hold. Digits use the game's glyph sheet.

## Math and publication

Math lives in `../math-sdk/games/lost_idol/treasury.py`. Generated and verified files are in `../math-sdk/games/lost_idol/library_treasury_single/publish_files`.

1,000,000 base books and 100,000 books for each of four buy modes were generated. `rtp-verification.json` and `verification.json` confirm exactly 96% weighted RTP for all six modes, unchanged reference standard deviation and hit/cover/cap probabilities. The current Treasury frequency is reported in verification.json. Free-spin trigger probability remains 0.005. Only the dedicated Treasury purchase guarantees a Treasury trigger.

Local Vite middleware now reads `library_treasury_single/calibrated_preview`. Embedded offline visual samples were regenerated. External RGS publication/upload is a separate deployment step and has not been performed.

## Validation

- Full SDK publication verifier: payout sums, line math samples, event indices, cap, Treasury awards, weighted RTP and feature frequencies.
- SDK test_collector.py: 240 generated rounds verify WILD positions, multipliers, respins and line payouts.
- tests/treasury-playback.mjs: separate line/feature awards, bet scaling, coexistence with Free Spins, capped/invalid totals.
- tests/treasury-settlement.mjs: active-round restoration, debit/credit once, reload and repeated endRound.
- Existing collector playback and settlement tests; frontend ESLint and production build.

## Treasury purchase

The `treasury` buy costs 9× the base bet, opens the same 3-of-6 feature, and pays no opening-board lines, scatters or Free Spins. Purchase-only cash weights for 1/2/4/6/10× are 760/564/348/190/38 (sum 1900); natural Treasury weights remain unchanged. The purchase has 79% probability of three cash awards and 21% probability of two cash awards plus one emerald. Conditional emerald weights for ×2/×3/×5/×10 are 74/19/5/2; reward order is shuffled. Natural candidate awards use these gem parameters before base-book calibration; their published probabilities come from the LUT.

Expected cash reward = 48/19×. Mean emerald multiplier is 2.5. The expected cash-count × multiplier factor is .79×3 + .21×2×2.5 = 3.42. Expected purchase payout = 8.64×; 8.64 / 9 = 96% exactly. Minimum payout 3×, maximum 200× base bet. A payout can be lower than the 9× purchase cost.

`generate_treasury_buy.py` enumerates all 425 ordered outcomes with integer weights and creates native SDK books, LUT, manifest entry, and preview. `verify_publication.py` verifies the full six-mode publication; `tests/treasury-buy.mjs` verifies every purchase book and wallet settlement. No external RGS upload has been performed.

## Natural entry frequency

Natural Treasury entry is calibrated to exactly 1% per base round (1 in 100 on average, not a guarantee). `treasury_frequency.py` redistributes integer weights only between books with identical total payout, Free Spin tier and Collector presence. The complete joint payout histogram remains unchanged, so RTP, volatility, hit rate and the other feature frequencies are preserved. All books retain positive weights. `collector_calibration.balance()` reapplies this constraint on future calibrations; publication verification checks the exact frequency. The natural-frequency pass does not modify the separate Treasury-buy distribution.

## In-reel presentation

After the first win presentation completes, Treasury mounts inside the existing canvas wrapper at REEL_GRID bounds (no portal/modal). The CollectorSmoke effect plays for 1200 ms, covering the swap at 450 ms. Six chests appear in a 3×2 grid; revealed cash, multiplier and monetary total use FeaturePlaque's existing two slots. After the third reveal the result holds for 2200 ms, then another 1200 ms smoke transition restores the retained underlying scene. Only after that does continueTreasury settle or advance the book. Timers cancel on unmount; persisted picks still restore on reload.
