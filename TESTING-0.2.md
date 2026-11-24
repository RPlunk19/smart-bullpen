# Beta 0.2 — Arcade upgrade
## Beta 0.1 user-reported results
Ten of eleven checks passed: website display, 10-pitch mission setup, five consecutive hits, 5× multiplier, miss resets multiplier, comeback, randomized targets, pitch cap, coach report, iPhone/iPad portrait and landscape. Sound was not yet verified.
## 0.2 changes
Five original SVG reward-tier illustrations; more debris; flying prize and score count-up; arcade focus view; optional browser full screen with fallback; last-pitch correction (including final pitch). The correction re-enters a pitch already thrown, not an additional throw. Existing scoring rules and coach data preserved. No new libraries, network calls, storage, accounts or permissions.
## Acceptance tests
- Repeat all 0.1 tests, including opt-in sound on a real device.
- Check all five reward illustrations, score count-up and flying prize on a hit, and no reward on a miss.
- Correct a hit, a miss and the final pitch: original target restored, score/streak/history recalculated, budget enforced. Re-enter actual location without throwing again.
- Check arcade/coach view toggling, orientation, full-screen fallback, and reduced motion.
- End during an animation; ensure report is correct.
- Run node tests/engine.test.cjs if Node is available.
Browser/device testing and independent security review remain outstanding. Use fictional nicknames. No persistent athlete data.
