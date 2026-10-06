# Bonus Chance

The separate Bonus Chance switch increases both door and Treasury trigger probabilities by exactly 5×. It starts off, blocks Bonus Buy while enabled, and cannot change during a round or autoplay. It costs 2.5 base stakes per spin. Bet control and bet menu show the charged amount; the book and payouts use the base stake. Rules are available in Info.

Published mode: `bonus_boost`. Local development serves the calibrated pool via `/__calibrated-math?mode=bonus_boost`. Live RGS receives this mode with the base stake, so its new math package must be uploaded before deploying the frontend to production.

Exact weighted frequencies: doors 0.5% → 2.5%; Treasury 1% → 5%. Both can occur in the same round. Conditional feature payouts and all book events remain unchanged. Feature weights are multiplied by five; ordinary paying outcomes are reweighted upward, and zero outcomes absorb the mass difference. Final integer correction gives exactly 96% RTP relative to the 2.5× charge.

From math-sdk, after base calibration and treasury-frequency adjustment:

```
PYTHONPATH=. env/bin/python games/lost_idol/generate_bonus_boost.py
PYTHONPATH=. env/bin/python games/lost_idol/verify_publication.py
```

The generator writes the new lookup tables, index entry, calibrated preview and backend/frontend config hashes. Existing base books are shared by the enhanced mode. Re-running preview export regenerates Boost after export. No production upload is performed by these scripts.

Frontend integration check: `node tests/bonus-boost.mjs` verifies exact RTP, both event frequencies, 2.5× debit at three stakes, base-stake payout, restored round mode and single settlement.
