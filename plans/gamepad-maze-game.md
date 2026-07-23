# Plan: Kids' Gamepad Maze Game ("Treasure Hunt")

- **Session:** 882bad03-3252-4de5-bb9a-5f3fcd3f5ddb

## Goal
Build a browser-based maze game that teaches young kids to use a gamepad: steer a themed player through a maze, eat all targets, advance through progressively harder levels.

## Approach
- **Vanilla HTML/CSS/JS, zero build step, zero dependencies.** Open `index.html` and play. Simplest possible thing to run and maintain.
- **DOM/CSS-grid board (not canvas).** The board is a CSS grid of tile divs; player and targets are absolutely-positioned cells containing SVG sprites, and CSS transitions give smooth sliding movement for free.
- **Hand-authored inline SVG sprites (no emoji, no downloaded images).** Each theme's player and target is an original SVG symbol, shipped as a template string in `js/sprites.js` and injected into the page on load (decided: keeps `file://` double-click-to-play working; referenced via `<use>`). SVG scales crisply on any screen, stays a text asset (no binaries, no CDN), animates nicely (CSS on SVG parts, e.g. Pac-Man's chomping mouth), and original art sidesteps Mario/Elsa trademark art issues — characters are "inspired-by" originals (red-cap hero, ice princess), not copies.
- **Input: Gamepad API + keyboard fallback.** Poll `navigator.getGamepads()` in the `requestAnimationFrame` loop; read D-pad buttons (12–15) *and* left analog stick with a dead-zone, since kids' controllers vary. Arrow keys/WASD work identically (useful for testing and for kids without a pad). Show a "🎮 connected" indicator so kids get feedback when they plug in.
- **Grid-step movement.** One button press = one cell move; holding a direction auto-repeats on a timer. Discrete steps are easier for small kids than continuous physics, and wall collision is a trivial cell check. **Speed is a UI setting (decided):** a turtle 🐢 / rabbit 🐇 toggle on the start screen (e.g. 240ms / 160ms / 110ms per cell), persisted in `localStorage`.
- **Procedural mazes via recursive backtracker → reachability guaranteed by construction.** A recursive-backtracker maze is a *perfect maze*: every cell is reachable from every other cell. Targets are placed on random open cells (biased toward dead-ends/far cells so they're fun to hunt), so every target is provably reachable — no path-checking needed. To keep early levels kid-easy, low levels additionally knock out extra walls (braiding), making wide-open boards.
- **30 fixed, deterministic levels (decided).** A `LEVELS` table of 30 entries controls maze size (4×3 cells → 12×9 cells), target count (1 → 15), and braid factor (open → tight maze). Levels are generated from a **seeded PRNG keyed on the level number**, so level 7 is always the same maze for every player and every session — reproducible, testable, and shareable.
- **Playability proven twice.** (1) By construction: a recursive-backtracker maze is a perfect maze — every open cell reaches every other — and braiding only *removes* walls, so connectivity can never be broken. (2) By verification: `validateLevel()` runs a BFS from the player start and asserts every target is on a floor tile and reachable; generation retries with a new seed if it ever fails. A standalone `tools/validate-levels.js` runs the same check over all 30 levels (plus a stress sweep over extra seeds) and exits non-zero on any failure.
- **Progression.** Eat all targets → celebration overlay (confetti + sound) → next level. After level 30, a "you finished all 30" celebration. Current level, highest unlocked level, theme, speed and mute persisted in `localStorage`; a level-select screen shows all 30 with unlocked ones playable.
- **Themes = data, not code.** A `THEMES` array of `{ id, name, playerSpriteId, targetSpriteId, wall/floor/bg colors }` pointing at symbols in the SVG sprite sheet. Shipping themes (original SVG art):
  - **Chomper (Pac-Man style):** yellow chomping circle player / glowing dot targets, navy maze
  - **Hero (Mario style):** red-cap mustachioed hero player / spotted mushroom targets, sky-blue + brick maze
  - **Ice Princess (Elsa style):** blonde princess in ice-blue dress player / snowflake targets, icy blue-purple maze
  - **Bonus kid themes:** cat/fish, puppy/bone, rocket/star (cheap to add — draw two more SVG symbols each)
  Theme picker shown on a start screen (big tappable cards showing the actual sprites, also navigable with the gamepad) and switchable any time from the HUD; choice persisted in `localStorage`.
- **Sound via WebAudio oscillators** (short "pop" on eat, rising jingle on level complete) — no audio files; muted toggle in HUD. Audio context created on first user interaction to satisfy autoplay policies.
- **Kid-friendly UI:** big rounded tiles, bright high-contrast palette (per theme), Fredoka-style rounded system font stack, huge level/score numbers, bouncing/wiggling animations on player and targets, confetti on level clear. No fail state, no timer, no game-over — only positive feedback.

## Files to Change
- `index.html` (new file) — page shell: start/theme screen, level-select screen, game board, HUD, level-clear overlay
- `js/sprites.js` (new file) — SVG symbol sheet as a template string (one player + one target symbol per theme, hand-drawn original art), injected into the page on load
- `css/style.css` (new file) — kid-friendly styling, theme CSS variables, animations (player wiggle, target bounce, eat pop, confetti, SVG part animations like the chomper mouth)
- `js/maze.js` (new file) — seeded PRNG, the 30-entry `LEVELS` table, recursive-backtracker generator + braiding, target placement, BFS `validateLevel()`; usable from both browser and Node
- `js/game.js` (new file) — board rendering, movement + collision, eat/level-clear flow, level select, localStorage persistence
- `js/input.js` (new file) — Gamepad API polling (D-pad + analog stick + dead-zone), keyboard handler, unified direction events with hold-to-repeat, menu focus navigation
- `js/themes.js` (new file) — `THEMES` data array + theme picker rendering/selection
- `js/audio.js` (new file) — WebAudio blip/jingle helpers + mute state
- `tools/validate-levels.js` (new file) — Node script asserting all 30 levels are fully playable
- `README.md` (new file) — how to play and how to add themes/levels

## Steps
1. `index.html` skeleton with start screen, board, HUD, and overlay containers; wire up script/CSS includes
2. `js/sprites.js`: draw player + target symbols for all six themes (chomper/dot, hero/mushroom, princess/snowflake, cat/fish, puppy/bone, rocket/star) as an SVG template string; inject the sheet into the page on load so `<use>` works from `file://`
3. `js/themes.js`: THEMES data referencing sprite symbol ids, start-screen theme cards, selection + localStorage persistence, applying theme CSS variables to `:root`
4. `js/game.js`: recursive-backtracker maze generator returning a wall grid; braiding pass for low levels; level config (size/targets/braiding by level number)
5. Board rendering: CSS-grid tiles from the wall grid, player + target elements using `<use>` sprite references, per-theme colors
6. `js/input.js`: keyboard first (fast to test), then gamepad polling with connect/disconnect events feeding the HUD indicator; unified `move(dir)` callback with hold-repeat
7. Movement + collision + eating: cell-step with wall check, CSS-transition slide, target removal + pop animation + sound on overlap, targets-remaining HUD update
8. Level-clear flow: detect zero targets → confetti overlay + jingle → advance level, regenerate maze, persist level
9. `js/audio.js`: WebAudio eat-pop and level-jingle, mute toggle, init-on-first-gesture
10. Speed setting: turtle/rabbit toggle on the start screen (240/160/110ms per cell), persisted in `localStorage`, feeding the input hold-repeat timer
11. Polish pass: idle animations, responsive sizing (board fits viewport on TV/tablet), start-screen navigable by gamepad, sprite direction flip when moving left/right
12. QA: play several levels with keyboard in browser; verify gamepad path via Gamepad API code review + connected-pad test if hardware present

## Constraints
- No frameworks, no build step, no external assets/CDNs — must run from `file://` or any static server
- All targets must always be reachable (guaranteed by perfect-maze generation — never place targets or player inside walls)
- No fail states or scary feedback — kid-positive UX only

## Open Questions / Risks
- (decided) SVG loading → JS template string in `js/sprites.js`, injected on load; works on `file://`
- (decided) Gamepad compatibility → D-pad buttons 12–15 + left analog stick with dead-zone; revisit only if a real pad fails
- (decided) Move speed → turtle/rabbit UI setting on the start screen, persisted in `localStorage`
