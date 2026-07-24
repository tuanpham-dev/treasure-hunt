# Treasure Hunt

A maze game for kids learning to use a gamepad. Steer your character through the
maze, collect every treasure, and move on to the next of 30 levels.

No build step, no internet. Double-click `index.html` and play. (One vendored
library — Three.js, for the optional 3D mode — see "2D and 3D" below.)

## How to play

| Action | Gamepad | Keyboard | Touch |
| --- | --- | --- | --- |
| Move / menu navigate | D-pad or left stick | Arrow keys or WASD | On-screen D-pad |
| Choose / confirm | A or Start | Enter or Space | Tap |
| Back / home | B or Select | Esc | Home button |
| Restart level | Y | (restart button) | Restart button |
| Sound on/off | X | (sound button) | Sound button |

The whole game is fully playable with a gamepad alone — no mouse needed. The
D-pad navigates every menu (characters, speed, 2D/3D, level select) and confirms
with A; in a level it moves the player, B returns home, Y restarts, X mutes.

Hold a direction to keep moving. Bumping into a wall is harmless — there is no
way to lose, no timer, and no game over.

On phones and tablets an on-screen D-pad appears at the bottom of the game
screen. It shows only on touch devices that have **no gamepad connected** — plug
in a controller and it disappears automatically; unplug it and it returns.

## What's in the box

- **6 characters**, each with its own treasure and colour scheme: Chomper (dots),
  Cap Hero (mushrooms), Ice Princess (snowflakes), Kitty (fish), Puppy (bones),
  Rocket (stars). Pick one on the start screen; it's remembered next time.
- **3 movement speeds** (Slow / Normal / Fast) so the game can match a small
  child's reaction time.
- **30 levels**, growing from a 4×3 open yard with one treasure to a 12×9
  labyrinth with 18. Progress, unlocked levels, chosen character, speed and the
  mute setting are all saved in the browser.
- All artwork is hand-drawn SVG defined in `js/sprites.js` — no image files and
  no emoji, so it stays sharp at any size.
- **2D or 3D**, switchable on the start screen (see below).

## 2D and 3D

A "How do you want to see it?" toggle on the start screen switches between the
flat 2D board and a tilted-overhead 3D world; the choice is saved.

Both modes share one set of game rules. All logic — movement, wall collision,
level flow — lives in `js/game.js`, which draws through a small renderer
interface implemented twice: `js/render2d.js` (DOM/CSS board) and
`js/render3d.js` (Three.js scene). Because there is only one copy of the rules,
the two modes can't drift apart. The same six themes are reused in 3D by
turning each character's SVG into a billboarded sprite — no extra artwork.

3D uses **Three.js, vendored locally** at `js/vendor/three.min.js` (the r149 UMD
global build). It's the one dependency, checked into the repo on purpose so the
game still runs from `file://` with no CDN and no build step. If a device has no
WebGL, the game quietly falls back to 2D and shows a note by the toggle.

## Every level is guaranteed completable

Levels are built by a recursive-backtracker maze generator, which produces a
*perfect maze*: every open tile is reachable from every other one. The optional
"braiding" pass that opens up the easier levels only ever removes walls, so it
cannot disconnect anything. Treasures are then placed only on tiles a
breadth-first search has already proven reachable from the player's start.

That's checked, not just claimed:

```bash
node tools/validate-levels.js          # all 30 levels + a 1,200-maze stress sweep
node tools/validate-levels.js --print 7  # also draw level 7 as ASCII
```

The script exits non-zero if any treasure is ever unreachable, sits inside a
wall, or if any floor tile is walled off from the start.

Levels are generated from a seed derived from the level number, so level 7 is
always the same maze for every player on every device.

## Project layout

```
index.html              page shell: start screen, level select, board, HUD
css/style.css           all styling, theme variables and animations
js/sprites.js           SVG symbol sheet (+ standalone() for 3D textures)
js/themes.js            theme + speed + render-mode data, start-screen pickers
js/maze.js              PRNG, the 30-level table, generator, validator
js/input.js             gamepad polling, keyboard, touch, hold-to-repeat
js/audio.js             WebAudio sound effects (no audio files)
js/game.js              game rules: movement, level flow, saving (renderer-agnostic)
js/render2d.js          Renderer2D — the DOM/CSS board
js/render3d.js          Renderer3D — the Three.js tilted-overhead board
js/vendor/three.min.js  vendored Three.js r149 (UMD), only used by render3d.js
tools/validate-levels.js  playability checker (Node)
```

## Adding things

**A new character:** add two `<symbol>` drawings to the sheet in
`js/sprites.js`, then add an entry to `THEMES` in `js/themes.js` pointing at
those symbol ids and giving it a palette. It appears on the start screen
automatically.

**A new level:** append an entry to `LEVELS` in `js/maze.js` with `cols`, `rows`,
`targets`, `braid` (0 = a tight maze, 1 = wide open) and a `name`. Run
`node tools/validate-levels.js` afterwards; the HUD's "/30" count and the level
grid both follow the table's length.
