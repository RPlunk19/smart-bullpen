# Crate Crash — beta 0.1

Smart Bullpen is an arcade-style baseball command trainer. This build is a static, dependency-free browser game. Use fictional nicknames; the app intentionally has no persistent records, authentication, cloud sync, downloads, service worker, or camera/microphone access.

## Review and test before deployment
- Inspect index.html, css/game.css, js/engine.js, js/game.js and the two original SVG assets.
- The Content Security Policy blocks external scripts, network connections, forms and embedded objects. No third-party packages are used. Ordinary same-origin requests load the static page and assets.
- No formal malware scan or independent security audit has been performed.
- Run `node tests/engine.test.cjs` from the repository root if Node is available. Tests cover combo, miss, randomized target exclusion, cap, stop and metrics.
- Test on physical iPhone/iPad and desktop: portrait/landscape, taps, sound opt-in, reduced motion, stop during animation, mission results and pitch log. Do not use actual athlete names or records until privacy/access-control requirements are implemented.
- After review, merge the branch and enable GitHub Pages: Settings > Pages > Deploy from a branch > main > /(root).

## Gameplay
Every recorded pitch changes the target. Hit a crate for 100 points times the current streak (maximum multiplier 5). A miss resets the streak without removing points. Goals are 300/600/900/1400 for Rookie/Pro/All-Star/Legend. Coaches set the maximum count independently of difficulty, and can stop at any point. Game points are separate from objective command metrics. In-zone location is manually classified rather than verified ball tracking.

## Roadmap
Reusable game logic, Robot Boss Battle, Paint the Corners, persistent privacy-reviewed player records, and optional video integration.
