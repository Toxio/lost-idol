# Collector Wild — calibrated implementation

The new publication contains 1,000,000 base books and 100,000 books for each of the four
purchases. All five modes have exactly 96% theoretical RTP in integer-weight arithmetic.
The source publication before this change had 95% RTP, not 96%.

`math-sdk/games/lost_idol/math_reference_95.json` preserves its payout histograms.
Calibration retains payout standard deviation per paid stake, hit probability,
probability of covering the paid stake, and maximum-win probability in every mode.
Base free spins remain 1/200 rounds. Matching standard deviation does not imply that
every percentile, tail metric, or visual cadence is identical to the former mechanic.

| Mode | RTP | Old/new standard deviation (paid stakes) | Hit probability |
| --- | --- | --- | --- |
| base | 96% | 8.560926 | 29.071449% |
| bonus_5 | 96% | 2.254050 | 84.939773% |
| bonus_10 | 96% | 1.583604 | 97.544280% |
| bonus_15 | 96% | 1.362560 | 99.570016% |
| wild_spin | 96% | 2.377204 | 84% |

Dev Vite serves calibrated books through `/__calibrated-math`. The preview pools retain
the exact payout distribution, bonus-tier frequency and collector-presence frequency,
with one representative animation for each combination. Production RGS uses the full
publication. These pools live in the math library and do not enter the frontend bundle.
Offline built mocks and the test panel still use visual fixtures, not calibrated probabilities.
If calibrated dev data is missing, normal dev spins report an error instead of silently
falling back to the uncalibrated fixture distribution.

## Rules

- One monkey, one cell, initial multiplier ×1. It can occupy any reel.
- Base landing grants exactly three extra respins, without another debit.
- A simultaneous BONUS trigger takes precedence: free spins replace the respin series.
- Free spins start a fresh monkey at ×1 and retain it and its multiplier throughout the feature.
- The monkey moves before line evaluation. A stone adds +1, capped at ×20.
- Candidate-generation stone chance is 45% per respin/free spin. Weighted published
  book selection determines final frequencies. It never replaces BONUS or Scatter.
- Only lines passing through the final Wild cell receive its multiplier.
- Respins do not trigger more respins or free spins. No free-spin retriggers.
- Each new paid round resets collector state. Saved books replay exact positions and multipliers.

## Event and presentation

`reveal` contains the landed board with the monkey at its previous position.
`collectorWild` contains zero-based `from`, `wild`, `stone`, `underlyingMatrix`, final `matrix`,
`respin`, and `totalRespins`. A null wild explicitly disables expanding-wild inference.
The UI plays a 1.1-second collection phase with no paylines, commits the final board, then
uses the existing line presentation. Old books retain legacy expansion playback.

## Verification

From `math-sdk`:

```
PYTHONPATH=.:games/lost_idol env/bin/python games/lost_idol/test_collector.py
PYTHONPATH=.:games/lost_idol env/bin/python games/lost_idol/generate_collector_samples.py
```

Rebuild and verify the calibrated publication (includes analytics and dev preview export):

```
PYTHONPATH=.:games/lost_idol env/bin/python games/lost_idol/run.py
```

`generate_publication.py` only generates candidates; it does not calibrate them.
Run `balance_publication.py`, `verify_publication.py`, and `export_calibrated_preview.py`
after it. Never publish raw candidate weights. Restart Vite after regenerating preview pools.

Verification streams all 1.4 million books, checks event order, payout sums, single-cell
Wild/multiplier rules, bonus tiers, exact RTP, reference hit rates and standard deviation.
It independently recalculates paylines for the first 1,000 books per mode and every cap book.
SDK checks additionally validate SHA-256, payout-array hashes and publication format.
Reports: `math-sdk/games/lost_idol/library/publish_files/{rtp-verification,verification}.json`.
The old library backup is `/tmp/lost-idol-pre-collector-96/library`.

From `lost-idol`:

```
node tests/collector-playback.mjs
node tests/bonus-playback.mjs
npm run build
```

Test panel: **Collector Wild** and **Collector Free Spins** run without wallet changes.
English and Russian feature rules are updated. Other translations require review before release.
The calibrated local publication has not been uploaded to RGS. Production rollout still
requires publishing these new books and lookup tables together with the new frontend.
Old purchased-feature fixtures remain for legacy replay regression tests.
