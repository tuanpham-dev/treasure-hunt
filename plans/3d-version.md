# Plan: 3D Version (2D/3D toggle)

- **Session:** 882bad03-3252-4de5-bb9a-5f3fcd3f5ddb

## Goal
Add a real-time 3D rendering mode to Treasure Hunt, switchable with a 2D/3D toggle on the start screen, reusing all existing game logic (maze, input, audio, themes) and the same 30 levels.

## Approach
- **New branch `feature/3d-version`** for all of this work.
- **Renderer abstraction, one game brain.** Extract the current DOM/CSS board rendering out of `game.js` into a `Renderer2D` object, and add a parallel `Renderer3D`. Both implement the **same interface**; `game.js` keeps 100% of the logic (movement, wall checks, eating, level flow, HUD, saving) and just calls the active renderer. This is what makes a *toggle* safe — the game rules can't diverge between modes because there's only one copy of them.
- **Three.js, vendored locally (decided).** Ship `js/vendor/three.min.js` (r149 UMD global build, ~594KB, confirmed reachable). It exposes `window.THREE`, loads from `file://` via a classic `<script>` — no CDN at runtime, no build step, double-click-to-play preserved. This is a deliberate, documented exception to the repo's zero-dependency rule, scoped to one vendored file.
- **Tilted overhead camera (decided).** A `PerspectiveCamera` angled down over the whole maze so every target stays visible — same "plan your route" feel as 2D. Framing is recomputed per level from the maze bounds and on resize, so even level 30 (25×19 tiles) fits.
- **Reuse the SVG art as 3D sprites — no new artwork.** Player and targets become camera-facing `THREE.Sprite`s textured with the *existing* theme SVGs. `sprites.js` gains a `standalone(id)` that returns a self-contained SVG (all defs + symbols inline, so `<use>` resolves inside a single `<img>`), which is rasterized to a `THREE.CanvasTexture`. All 6 themes keep their identical look with zero redraw.
- **Walls & floor as lit geometry.** Floor = a colored plane; walls = `BoxGeometry` blocks in the theme wall color; ambient + directional light with a **shadow map enabled on every level (decided)** for depth. Colors come straight from the theme palette already in `themes.js`.
- **WebGL fallback (decided).** On `mount`, if a WebGL context can't be created, `game.js` quietly forces `renderMode = "2d"` and shows a small "this device can't show 3D" note beside the toggle — no black screen, nobody stuck.
- **Movement:** `Renderer3D` runs its own `requestAnimationFrame` loop (needed to draw the scene anyway) and lerps the player mesh to its target cell over the same `moveMs` the 2D path uses; the camera stays fixed. `Renderer2D` keeps its CSS-transition approach. The interface hides this difference.
- **Everything else is shared and untouched:** HUD, start screen, level select, overlays, confetti, touch D-pad, gamepad/keyboard input, audio, localStorage. Only the board area swaps between `#board` (2D DOM) and the 3D `<canvas>`, both hosted in `#board-wrap`.

## Architecture

```
                 ┌──────────────────────────────────────────┐
   Input ───────▶│                 game.js                   │
 (gamepad/kbd/   │  state • movement+wall logic • level flow │
  touch, shared) │  eating • HUD • save/load • confetti      │
                 └───────────────┬──────────────────────────┘
                                 │  Renderer interface
                                 │  mount/unmount, applyTheme,
                                 │  buildLevel, movePlayer,
                                 │  bumpPlayer, eatTarget,
                                 │  popScore, resize
                    ┌────────────┴─────────────┐
                    ▼                           ▼
            ┌───────────────┐          ┌──────────────────┐
            │  Renderer2D   │          │   Renderer3D     │
            │  render2d.js  │          │   render3d.js    │
            │  DOM tiles +  │          │  THREE scene:    │
            │  CSS actors   │          │  camera, lights, │
            │  (#board)     │          │  wall boxes,     │
            └───────────────┘          │  billboarded     │
                                       │  SVG sprites,    │
                                       │  rAF lerp loop   │
   MazeKit ── level data ──▶ game.js   │  (<canvas>)      │
   Themes ── palette+sprite ids ──────▶└──────────────────┘
   Sprites ── standalone(id) → texture ──────▲
```

- **Components:**
  - `game.js` — the single source of game rules; owns `state`, chooses `renderer` from `state.renderMode`, and drives it. No 2D-specific DOM left inline except shared overlays (confetti).
  - `render2d.js` (`Renderer2D`) — today's DOM/CSS board, moved verbatim behind the interface. Behaviorally identical to current game.
  - `render3d.js` (`Renderer3D`) — Three.js scene, camera framing, wall/floor meshes, billboarded sprites, its own animation loop.
  - `sprites.js` — adds `standalone(id)` (self-contained SVG string) reused by the 3D texture builder; existing `svg()`/`inject()` unchanged.
  - `themes.js` — adds render-mode toggle rendering (`renderModeToggle`), like the existing speed picker; palette/data unchanged.
- **Data flow:** `state.renderMode` ∈ `{ "2d", "3d" }`, persisted in the existing `treasure-hunt-v1` localStorage blob. On level start / mode switch, `game.js` calls `renderer.unmount()` on the old one and `mount()`+`buildLevel()` on the new one. Per move, `game.js` computes the destination and calls `movePlayer`/`bumpPlayer`; per pickup, `eatTarget`+`popScore`.
- **Decisions:**
  - Renderer interface over a 2D/3D branch scattered through `game.js` — because a toggle demands both modes share one rule-set; an interface guarantees it.
  - Billboarded SVG sprites over hand-modeled 3D characters — because it reuses all 6 themes for free and keeps them visually identical to 2D.
  - Vendored UMD `three.min.js` over ES-module Three — because ES-module imports are CORS-blocked on `file://`, which would break double-click-to-play.
  - Perspective overhead over follow-cam — chosen by user; keeps all targets visible for young kids.

## Files to Change
- `js/vendor/three.min.js` (new file) — vendored Three.js r149 UMD global build
- `js/render2d.js` (new file) — `Renderer2D`, the current DOM board extracted behind the interface
- `js/render3d.js` (new file) — `Renderer3D`, the Three.js overhead renderer
- `js/sprites.js` — add `standalone(id)`; refactor `SHEET` to reuse a shared `INNER` (defs+symbols) string
- `js/themes.js` — add `renderModeToggle(container, selected, onPick)` and a `RENDER_MODES` list
- `js/game.js` — remove inlined 2D rendering; add `state.renderMode`, renderer selection, mode-switch teardown/mount, and toggle wiring; keep all game logic
- `index.html` — add vendored `<script>` + `render2d.js`/`render3d.js` includes; add the 2D/3D toggle to the start screen
- `css/style.css` — style the render-mode toggle; make `#board-wrap` host the 3D `<canvas>`; hide the inactive board
- `README.md` — document 3D mode and the vendored-dependency exception
- `tools/validate-levels.js` — unchanged (levels are shared); used as-is in QA

## Phases

### Phase 1: Vendor Three.js and prove it loads
**Goal:** Three.js is available as `window.THREE` from `file://`, and the existing 2D game is untouched and still works.
**Checkpoint:** open `index.html`, console shows `typeof THREE === "object"` and `THREE.REVISION` prints; playing level 1 in 2D still works.

- [x] **T1 — Create the branch**
  - Files: (git)
  - Do: `git checkout -b feature/3d-version` from `main`.
  - Depends on: —
  - Done when: `git rev-parse --abbrev-ref HEAD` prints `feature/3d-version`.

- [x] **T2 — Vendor the library**
  - Files: `js/vendor/three.min.js`
  - Do: download the r149 UMD build to `js/vendor/three.min.js` (`curl -L https://cdnjs.cloudflare.com/ajax/libs/three.js/0.149.0/three.min.js -o js/vendor/three.min.js`). Verify it's ~594KB and contains `THREE`.
  - Depends on: T1
  - Done when: file exists, `grep -c "REVISION" js/vendor/three.min.js` > 0, and `node -e "global.self=global;require('./js/vendor/three.min.js')"` or a browser exposes `THREE`.

- [x] **T3 — Load it, non-breaking**
  - Files: `index.html`
  - Do: add `<script src="js/vendor/three.min.js"></script>` before the existing game scripts. Nothing else references it yet.
  - Depends on: T2
  - Done when: in the browser console `THREE.REVISION` is `"149"` and the 2D game still starts.

### Phase 2: Extract Renderer2D (zero behavior change)
**Goal:** all board rendering lives behind the renderer interface, driven by `game.js`, with the 2D game behaving exactly as before.
**Checkpoint:** the automated 30-level keyboard playthrough (from prior QA) completes all 30 with 0 leftover targets and matching player positions — proving no regression.

- [x] **T1 — Define the interface + move DOM rendering**
  - Files: `js/render2d.js`, `js/game.js`
  - Do: create `Renderer2D` exposing `mount(hostEl)`, `unmount()`, `applyTheme(theme)`, `buildLevel(level, theme)`, `movePlayer(x,y,facing,moveMs)`, `bumpPlayer(dir)`, `eatTarget(x,y)`, `popScore(x,y)`, `resize()`. Move `buildBoard`, `place`, `sizeBoard`, the player/target element handling, `bump`, target removal, and `popScore` out of `game.js` into it. `Renderer2D` owns its `#board`/`#tiles`/`#actors` DOM and the `targetEls`/`playerEl` refs.
  - Depends on: Phase 1
  - Done when: `game.js` contains no `document.createElement`/tile/actor code for the board; it only calls `renderer.*`.

- [x] **T2 — Wire game.js to the renderer**
  - Files: `js/game.js`, `index.html`
  - Do: add `<script src="js/render2d.js"></script>` before `game.js`. In `game.js`, hold `let renderer` set to `Renderer2D` for now; `startLevel` calls `renderer.buildLevel`; `tryMove` calls `renderer.movePlayer`/`bumpPlayer`; `eatAt` calls `renderer.eatTarget` + `renderer.popScore`; resize handler calls `renderer.resize()`. Confetti stays in `game.js`.
  - Depends on: Phase 2 T1
  - Done when: level 1 plays via keyboard and touch exactly as before.

- [x] **T3 — Regression guard**
  - Files: (browser QA)
  - Do: run the automated 30-level playthrough (pathfind + synthetic keys) used in earlier QA, in 2D mode.
  - Depends on: Phase 2 T2
  - Done when: all 30 report `leftover:0`, `posMatch:true`, overlay shown; `node tools/validate-levels.js` still passes.

### Phase 3: Sprites as 3D textures
**Goal:** any theme sprite can be turned into a Three.js texture from the existing SVG art.
**Checkpoint:** a scratch call renders `sp-chomper` and `sp-snowflake` onto sprites in a minimal scene and they appear correctly (visual screenshot).

- [x] **T1 — Standalone SVG export**
  - Files: `js/sprites.js`
  - Do: refactor the sheet so a shared `INNER` const holds the `<defs>`+`<symbol>`s; build `SHEET` from it (unchanged output) and add `standalone(id, px)` returning `<svg xmlns viewBox="0 0 100 100" width=px height=px>${INNER}<use href="#id"/></svg>` so a single `<img>` resolves the `<use>` internally (incl. the chomper mask).
  - Depends on: Phase 1
  - Done when: `Sprites.standalone("sp-chomper")` is a string containing both `mask-chomp` and `<use href="#sp-chomper"`; existing `Sprites.svg`/`inject` still work and the 2D game is unaffected.

- [x] **T2 — Texture builder**
  - Files: `js/render3d.js`
  - Do: add a helper that turns `Sprites.standalone(id)` into a `THREE.CanvasTexture` (load the SVG data URL into an `Image`, draw to a 128×128 canvas, `texture.needsUpdate = true`), cached by id so each sprite rasterizes once.
  - Depends on: Phase 3 T1
  - Done when: the helper returns a texture whose image is loaded (verified by drawing a sprite in T3's scene).

### Phase 4: Renderer3D
**Goal:** a full 3D board you can actually play, forced on via `state.renderMode = "3d"`.
**Checkpoint:** with 3D forced, play level 8 (`Big Yard`): the player moves cell-by-cell, walls block movement, targets disappear when reached, HUD counts down, and the level-complete overlay fires — verified by the automated playthrough driving real keys.

- [x] **T1 — Scene, camera framing, lights**
  - Files: `js/render3d.js`
  - Do: `mount(hostEl)` creates a `THREE.WebGLRenderer` (`shadowMap.enabled = true`) canvas appended to `hostEl`, a `Scene`, a `PerspectiveCamera`, `AmbientLight` + a shadow-casting `DirectionalLight`, and starts a rAF `animate()` loop. If `WebGLRenderer` construction throws / no GL context, `mount` returns a falsy/failed result so `game.js` can fall back to 2D. Add `frameCamera(tw, th)` positioning the camera above-and-back looking at board center so the whole tw×th board fits (with margin); called from `buildLevel` and `resize`.
  - Depends on: Phase 1
  - Done when: mounting shows a lit empty stage sized to the viewport; resizing keeps it centered; a forced WebGL failure makes `mount` report failure instead of throwing.

- [x] **T2 — Floor and walls**
  - Files: `js/render3d.js`
  - Do: in `buildLevel(level, theme)` clear the previous board group; add a floor plane (theme `floor` color) and one `BoxGeometry` block per wall tile (theme `wall` color, receiving/casting shadow). Use 1 world-unit per tile with board centered at origin. `applyTheme` updates material colors and the scene background (theme `bg`).
  - Depends on: Phase 4 T1
  - Done when: the maze walls for a level render in 3D with correct theme colors.

- [x] **T3 — Player, targets, movement, feedback**
  - Files: `js/render3d.js`
  - Do: add billboarded `THREE.Sprite`s for the player (theme `player` texture) and each target (theme `target` texture, gentle bob + a glow via a faint colored point light or emissive ground ring). `movePlayer(x,y,facing,moveMs)` sets a lerp target for the player sprite (and flips `sprite.scale.x` sign by `facing`); the animate loop advances the lerp. `bumpPlayer(dir)` does a small nudge-back tween. `eatTarget(x,y)` scales the matching target sprite to zero and removes it. `popScore(x,y)` projects the target's world position to screen via `camera` and places the **same shared DOM "+1"** as 2D (decided — exact parity, not a particle substitute).
  - Depends on: Phase 4 T2, Phase 3 T2
  - Done when: forcing `renderMode="3d"`, the automated level 8 playthrough clears with `leftover:0` and the level-complete overlay appears.

### Phase 5: The 2D/3D toggle
**Goal:** players pick 2D or 3D on the start screen; the choice persists and switches renderers cleanly.
**Checkpoint:** toggle to 3D, play and finish a level; toggle back to 2D, play and finish a level; reload the page and the last-chosen mode is active — no console errors, board area never shows both renderers at once.

- [x] **T1 — Toggle UI + data**
  - Files: `js/themes.js`, `index.html`, `css/style.css`
  - Do: add `RENDER_MODES = [{id:"2d",name:"2D"},{id:"3d",name:"3D"}]` and `renderModeToggle(container, selectedId, onPick)` to `themes.js` (mirroring `renderSpeedButtons`); add a `#render-mode-row` block to the start screen with a heading like "How do you want to see it?"; style it like the speed picker.
  - Depends on: Phase 4
  - Done when: two labelled buttons appear on the start screen and highlight the selected one.

- [x] **T2 — Persist + switch**
  - Files: `js/game.js`
  - Do: add `state.renderMode` (default `"2d"`), load/save it in the existing localStorage blob, render the toggle in `renderStart`, and on pick update state, save, and rebuild the active renderer. Add `activeRenderer()` returning `Renderer3D` when `renderMode==="3d"` else `Renderer2D`; on `startLevel` and on mode change, call `oldRenderer.unmount()` then `renderer = activeRenderer(); renderer.mount(hostEl); renderer.applyTheme; renderer.buildLevel(...)`. **If a 3D `mount()` reports failure (no WebGL), force `state.renderMode="2d"`, save, re-select `Renderer2D`, and reveal the "can't show 3D" note by the toggle.** Ensure `#board` (2D) is hidden while the 3D canvas is mounted and vice-versa.
  - Depends on: Phase 5 T1
  - Done when: switching modes on the start screen then pressing Play launches the chosen renderer; a simulated WebGL failure lands the player in a working 2D board with the note shown; `goHome` and re-Play keep working in both.

### Phase 6: QA and polish
**Goal:** both modes are correct and kid-friendly across themes and levels.
**Checkpoint:** automated 30-level playthrough passes in **both** 2D and 3D; the largest level (30) fully fits the 3D camera; each theme renders with the right colors/sprites in 3D; touch D-pad still drives the player in 3D.

- [x] **T1 — Dual-mode automated playthrough**
  - Files: (browser QA)
  - Do: run the pathfinding synthetic-key playthrough for all 30 levels in 2D, then all 30 in 3D. Capture any level that fails to clear or mismatches.
  - Depends on: Phase 5
  - Done when: 60/60 level clears, 0 failures.

- [x] **T2 — Visual + input pass**
  - Files: `js/render3d.js`, `css/style.css` (as needed)
  - Do: screenshot 3D for a dark theme (Chomper) and a light theme (Ice Princess), and level 30 to confirm framing; verify the touch D-pad (mobile-emulated) moves the player in 3D and the toggle is reachable by gamepad focus.
  - Depends on: Phase 6 T1
  - Done when: screenshots show correct colors/sprites and full-maze framing; touch + gamepad confirmed working in 3D.

## Constraints
- Runs from `file://` (double-click) — the vendored Three.js must be the classic UMD global build, loaded via `<script src>`; no ES-module imports, no importmap, no CDN at runtime.
- No build step, no package manager, no other new dependencies beyond the single vendored `three.min.js`.
- One game brain: all rules (movement, wall collision, target reachability, level flow) stay in `game.js`/`maze.js`; renderers only draw. The 30 levels and their guaranteed solvability are unchanged.
- The 2D mode must remain behaviorally identical to `main` after the Renderer2D extraction.

## Open Questions / Risks
- (decided) **Renderer2D regression guard** → full 30-level automated replay in 2D after extraction, before any 3D work (Phase 2 T3).
- (decided) **3D pickup feedback** → project the target's world position to screen and reuse the shared DOM "+1" for exact parity with 2D (Phase 4 T3).
- (decided) **Shadows** → shadow map enabled on every level, no per-level downgrade (Phase 4 T1/T2).
- (decided) **WebGL unavailable** → `mount()` reports failure; `game.js` forces 2D and shows a small note by the toggle (Phase 4 T1, Phase 5 T2).
- **Shadows-always-on perf on level 30** (25×19): risk accepted per the shadows decision; if the biggest board visibly stutters during QA, flag it rather than silently changing the decision.
- **Three.js download at implementation time** depends on network; already verified reachable (HTTP 200, 594KB). If it were to fail, implementation stops until the file can be obtained — there is no runtime CDN fallback by design.

## As Shipped

Built as planned — the renderer-interface split, vendored Three.js r149, tilted
overhead camera, SVG-billboard sprites, always-on shadows, projected DOM "+1",
2D/3D toggle with persistence, and the WebGL→2D fallback all landed on-spec.
All six phases completed in one implementation pass; no user revise cycles.

Deviations:

- **Added — out-of-band 3D QA harness.** The plan's Phase 6 assumed the
  automated 30-level playthrough would just run in the QA browser. The
  DevTools-MCP Chrome in this environment has **no WebGL** (GPU process can't
  create a context), so `Renderer3D` correctly fell back to 2D there and could
  not be visually or functionally verified through it. To actually exercise 3D I
  had to: (1) render stills through a standalone `chromium --headless
  --use-angle=swiftshader --enable-unsafe-swiftshader` (software WebGL), and
  (2) drive a full 30-level 3D playthrough by launching that Chromium with
  `--remote-debugging-port` and writing a minimal CDP client in Node (using the
  global `WebSocket` in Node ≥21). Both confirmed green (30/30 in real 3D, mode
  switching, fallback note). None of this tooling was in the plan.

- **Diverged (minor) — camera framing constant.** Planned "framing recomputed
  from maze bounds"; the first value (`* 1.45`) framed the board too far away, so
  I tuned it to `* 1.2` after looking at the SwiftShader stills. Same approach,
  tuned number.

- **On-spec — WebGL fallback.** Worth calling out because the environment
  exercised it for real: the no-WebGL Chrome hit exactly the planned path
  (force 2D + show note), so the decided behavior was validated by accident.

## Plan Retrospective

- **What changed:** a whole secondary QA toolchain (SwiftShader stills + a Node
  CDP driver) had to be built that the plan didn't budget for.
  - **Why:** the automation browser had no WebGL, so the primary QA path (drive
    the real page in the MCP browser) could not verify the 3D deliverable at all.
  - **Root cause:** an unverified assumption — the plan treated "run the
    playthrough in the browser" as mode-agnostic, without checking that the QA
    browser could create a WebGL context. For a WebGL feature, GPU capability of
    the *test* environment is a first-class prerequisite, not a detail.

- **What changed:** camera distance multiplier tuned post-hoc.
  - **Why:** framing quality is only judgeable visually, and the first stills
    came late (after the SwiftShader path existed).
  - **Root cause:** none really — visual constants are expected to be tuned
    against a render; this is normal, not a planning miss.

## How to tighten next time

1. **When a feature needs a GPU/WebGL/canvas capability, verify the QA
   environment has it *before* planning the QA phase** — and if the default
   automation browser doesn't, bake the software-rendering path
   (`--use-angle=swiftshader --enable-unsafe-swiftshader`) and a driving method
   into the plan from the start, rather than discovering it at QA time.
2. **A Node CDP driver (global `WebSocket`, no puppeteer) is a cheap, reusable
   way to drive a headless browser** when the MCP browser can't do what's
   needed — worth reaching for directly instead of fighting the constrained one.
