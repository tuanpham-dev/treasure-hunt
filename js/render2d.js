/* Renderer2D — the original DOM/CSS board, behind the shared renderer interface.
   Draws only; all game rules live in game.js. Theme colors arrive globally via
   Themes.apply() on :root, which the board CSS reads, so applyTheme just notes
   the theme for sprite markup. */

const Renderer2D = (function () {
  const $ = (id) => document.getElementById(id);

  let theme = null;
  let level = null;
  let playerEl = null;
  let facingEl = null;
  let lastFace = null;
  let doorEl = null;
  let keyEl = null;
  const targetEls = new Map();

  function place(el, x, y) {
    el.style.setProperty("--x", x);
    el.style.setProperty("--y", y);
  }

  function mount() {
    $("board").hidden = false;
    return true;
  }

  function unmount() {
    $("board").hidden = true;
  }

  function applyTheme(t) {
    theme = t;
  }

  function buildLevel(lvl, t) {
    level = lvl;
    theme = t;
    const tiles = $("tiles");
    const actors = $("actors");

    $("board").style.setProperty("--cols", level.tw);
    $("board").style.setProperty("--rows", level.th);

    let html = "";
    for (let y = 0; y < level.th; y++) {
      for (let x = 0; x < level.tw; x++) {
        const v = level.grid[y][x];
        const cls = v === 1 ? "wall" : v === 2 ? "door" : "floor";
        html += `<div class="tile ${cls}"></div>`;
      }
    }
    tiles.innerHTML = html;
    doorEl = level.door ? tiles.children[level.door.y * level.tw + level.door.x] : null;

    actors.innerHTML = "";
    targetEls.clear();

    if (level.key) {
      keyEl = document.createElement("div");
      keyEl.className = "actor keyitem";
      keyEl.innerHTML = Sprites.svg("sp-key", "anim-float");
      place(keyEl, level.key.x, level.key.y);
      actors.appendChild(keyEl);
    } else {
      keyEl = null;
    }

    level.targets.forEach((tt, i) => {
      const el = document.createElement("div");
      el.className = "actor target";
      el.style.setProperty("--delay", (i % 6) * 0.12 + "s");
      el.innerHTML = Sprites.svg(theme.target, "anim-float");
      place(el, tt.x, tt.y);
      actors.appendChild(el);
      targetEls.set(tt.x + "," + tt.y, el);
    });

    const player = document.createElement("div");
    player.className = "actor player";
    // Facing lives on a wrapper so it doesn't fight the idle animation on .sprite.
    player.innerHTML =
      `<div class="player-facing">` + Sprites.svg(theme.player, theme.playerClass || "") + `</div>`;
    place(player, level.start.x, level.start.y);
    actors.appendChild(player);
    playerEl = player;
    facingEl = player.querySelector(".player-facing");
    lastFace = null;

    resize();
  }

  function movePlayer(x, y, facing, moveMs, teleport) {
    if (!playerEl) return;
    const f = Themes.faceTransform(facing, theme);
    if (f && facingEl) {
      lastFace = f;
      facingEl.style.transform = `rotate(${f.rot}deg) scaleX(${f.mirror ? -1 : 1})`;
    }
    // teleport (warp tunnel) snaps across instead of sliding the whole board
    playerEl.style.setProperty("--move-ms", (teleport ? 0 : moveMs) + "ms");
    place(playerEl, x, y);
  }

  function bumpPlayer(dir) {
    if (!playerEl) return;
    playerEl.classList.remove("bump-up", "bump-down", "bump-left", "bump-right");
    void playerEl.offsetWidth; // restart the animation
    playerEl.classList.add("bump-" + dir);
  }

  function eatTarget(x, y) {
    const key = x + "," + y;
    const el = targetEls.get(key);
    if (!el) return;
    targetEls.delete(key);
    el.classList.add("eaten");
    setTimeout(() => el.remove(), 420);
  }

  function popScore(x, y) {
    const el = document.createElement("div");
    el.className = "actor pop";
    el.textContent = "+1";
    place(el, x, y);
    $("actors").appendChild(el);
    setTimeout(() => el.remove(), 800);
  }

  function openDoor() {
    if (doorEl) {
      doorEl.classList.remove("door");
      doorEl.classList.add("floor", "door-open");
      doorEl = null;
    }
    if (keyEl) {
      const el = keyEl;
      el.classList.add("eaten");
      setTimeout(() => el.remove(), 420);
      keyEl = null;
    }
  }

  function resize() {
    if (!level) return;
    const wrap = $("board-wrap");
    const availW = wrap.clientWidth - 12;
    const availH = wrap.clientHeight - 12;
    if (availW <= 0 || availH <= 0) return;
    const tile = Math.max(
      12,
      Math.min(96, Math.floor(Math.min(availW / level.tw, availH / level.th)))
    );
    $("board").style.setProperty("--tile", tile + "px");
  }

  return {
    mount,
    unmount,
    applyTheme,
    buildLevel,
    movePlayer,
    bumpPlayer,
    eatTarget,
    popScore,
    openDoor,
    resize,
  };
})();
