# Treasure Hunt

A maze game for kids learning to use a gamepad. Steer your character through the
maze, collect every treasure, and move on to the next of 30 levels.

No build step, no dependencies, no internet. Double-click `index.html` and play.

## How to play

| Action | Gamepad | Keyboard | Touch |
| --- | --- | --- | --- |
| Move | D-pad or left stick | Arrow keys or WASD | On-screen D-pad |
| Choose / confirm | A or Start | Enter or Space | Tap |
| Back | B or Select | Esc | Home button |

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
js/sprites.js           SVG symbol sheet (characters, treasures, UI icons)
js/themes.js            theme + speed data, start-screen pickers
js/maze.js              PRNG, the 30-level table, generator, validator
js/input.js             gamepad polling, keyboard, hold-to-repeat
js/audio.js             WebAudio sound effects (no audio files)
js/game.js              board rendering, movement, level flow, saving
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
