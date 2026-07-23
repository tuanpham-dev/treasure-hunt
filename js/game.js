/* Treasure Hunt — board rendering, movement, level flow. */

(function () {
  const STORE_KEY = "treasure-hunt-v1";
  const HAS_TOUCH = "ontouchstart" in window || (navigator.maxTouchPoints || 0) > 0;

  const STEP = {
    up: { dx: 0, dy: -1 },
    down: { dx: 0, dy: 1 },
    left: { dx: -1, dy: 0 },
    right: { dx: 1, dy: 0 },
  };

  const $ = (id) => document.getElementById(id);

  const state = {
    themeId: "chomper",
    speedId: "normal",
    muted: false,
    levelNumber: 1,
    unlocked: 1,
    screen: "start",
    level: null,
    player: { x: 1, y: 1 },
    remaining: 0,
    picked: 0,
    busy: false,
    facing: "right",
    targetEls: new Map(),
    playerEl: null,
  };

  /* ---------------- persistence ---------------- */

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.themeId) state.themeId = saved.themeId;
      if (saved.speedId) state.speedId = saved.speedId;
      if (typeof saved.muted === "boolean") state.muted = saved.muted;
      if (saved.levelNumber) state.levelNumber = clampLevel(saved.levelNumber);
      if (saved.unlocked) state.unlocked = clampLevel(saved.unlocked);
    } catch (err) {
      /* corrupt or unavailable storage just means a fresh start */
    }
  }

  function save() {
    try {
      localStorage.setItem(
        STORE_KEY,
        JSON.stringify({
          themeId: state.themeId,
          speedId: state.speedId,
          muted: state.muted,
          levelNumber: state.levelNumber,
          unlocked: state.unlocked,
        })
      );
    } catch (err) {
      /* private mode — the game still plays, it just won't remember */
    }
  }

  function clampLevel(n) {
    return Math.max(1, Math.min(MazeKit.LEVEL_COUNT, Number(n) || 1));
  }

  /* ---------------- screens ---------------- */

  function showScreen(name) {
    state.screen = name;
    ["start", "level", "game"].forEach((s) => {
      $(s + "-screen").hidden = s !== name;
    });
    const screen = $(name + "-screen");
    const first =
      screen.querySelector("[data-focus-default]:not([disabled])") ||
      screen.querySelector("[data-focus]:not([disabled])");
    if (first) first.focus();
  }

  function focusables() {
    const scope = state.screen === "overlay" ? $("overlay-card") : $(state.screen + "-screen");
    if (!scope) return [];
    return Array.from(scope.querySelectorAll("[data-focus]")).filter((el) => !el.disabled);
  }

  function moveFocus(dir) {
    const list = focusables();
    if (!list.length) return;
    const index = list.indexOf(document.activeElement);
    if (index < 0) {
      list[0].focus();
      return;
    }
    const container = list[index].parentElement;
    const cols = parseInt((container && container.dataset.focusCols) || "1", 10) || 1;
    const step = dir === "left" || dir === "right" ? 1 : cols;
    const delta = dir === "left" || dir === "up" ? -step : step;
    const next = Math.max(0, Math.min(list.length - 1, index + delta));
    list[next].focus();
  }

  /* ---------------- start screen ---------------- */

  function renderStart() {
    Themes.renderThemeCards($("theme-grid"), state.themeId, (id) => {
      state.themeId = id;
      Themes.apply(Themes.byId(id));
      Sound.pickup(2);
      save();
      renderStart();
      const card = $("theme-grid").querySelector(`[data-theme-id="${id}"]`);
      if (card) card.focus();
    });

    Themes.renderSpeedButtons($("speed-row"), state.speedId, (id) => {
      state.speedId = id;
      Input.setRepeatMs(Themes.speedById(id).ms);
      Sound.step();
      save();
      renderStart();
      const btn = $("speed-row").querySelector(`[data-speed-id="${id}"]`);
      if (btn) btn.focus();
    });

    $("play-label").textContent =
      state.levelNumber > 1 ? `Play level ${state.levelNumber}` : "Play";
  }

  /* ---------------- level select ---------------- */

  function renderLevelSelect() {
    const grid = $("level-grid");
    let html = "";
    for (let n = 1; n <= MazeKit.LEVEL_COUNT; n++) {
      const locked = n > state.unlocked;
      const done = n < state.unlocked;
      const isCurrent = n === state.levelNumber;
      html += `<button class="level-btn ${locked ? "is-locked" : ""} ${done ? "is-done" : ""}"
                 type="button" data-level="${n}"
                 ${locked ? "disabled" : "data-focus"} ${!locked && isCurrent ? "data-focus-default" : ""}>
                 <span class="level-num">${n}</span>
                 <span class="level-name">${MazeKit.LEVELS[n - 1].name}</span>
                 ${locked ? Sprites.svg("ic-lock", "lock-icon") : ""}
               </button>`;
    }
    grid.innerHTML = html;
    grid.querySelectorAll(".level-btn:not([disabled])").forEach((btn) => {
      btn.addEventListener("click", () => startLevel(Number(btn.dataset.level)));
    });

    $("level-progress-note").textContent =
      state.unlocked >= MazeKit.LEVEL_COUNT
        ? "You unlocked every level. Nice work!"
        : `Levels 1 to ${state.unlocked} are open — finish one to unlock the next.`;
  }

  /* ---------------- board ---------------- */

  function startLevel(number) {
    state.levelNumber = clampLevel(number);
    state.level = MazeKit.generateLevel(state.levelNumber);
    state.player = { x: state.level.start.x, y: state.level.start.y };
    state.remaining = state.level.targets.length;
    state.picked = 0;
    state.busy = false;
    state.facing = "right";
    save();
    buildBoard();
    updateHud();
    hideOverlay();
    showScreen("game");
    sizeBoard(); // must run once the screen is visible, or the wrap measures 0
    document.activeElement && document.activeElement.blur();
  }

  function buildBoard() {
    const level = state.level;
    const theme = Themes.byId(state.themeId);
    const tiles = $("tiles");
    const actors = $("actors");

    $("board").style.setProperty("--cols", level.tw);
    $("board").style.setProperty("--rows", level.th);

    let html = "";
    for (let y = 0; y < level.th; y++) {
      for (let x = 0; x < level.tw; x++) {
        const wall = level.grid[y][x] === 1;
        html += `<div class="tile ${wall ? "wall" : "floor"}"></div>`;
      }
    }
    tiles.innerHTML = html;

    actors.innerHTML = "";
    state.targetEls.clear();

    level.targets.forEach((t, i) => {
      const el = document.createElement("div");
      el.className = "actor target";
      el.style.setProperty("--delay", (i % 6) * 0.12 + "s");
      el.innerHTML = Sprites.svg(theme.target, "anim-float");
      place(el, t.x, t.y);
      actors.appendChild(el);
      state.targetEls.set(t.x + "," + t.y, el);
    });

    const player = document.createElement("div");
    player.className = "actor player";
    player.innerHTML = Sprites.svg(theme.player, theme.playerClass || "");
    place(player, state.player.x, state.player.y);
    actors.appendChild(player);
    state.playerEl = player;

    sizeBoard();
  }

  function place(el, x, y) {
    el.style.setProperty("--x", x);
    el.style.setProperty("--y", y);
  }

  function sizeBoard() {
    if (!state.level) return;
    const wrap = $("board-wrap");
    const availW = wrap.clientWidth - 12;
    const availH = wrap.clientHeight - 12;
    if (availW <= 0 || availH <= 0) return;
    const tile = Math.max(
      12,
      Math.min(96, Math.floor(Math.min(availW / state.level.tw, availH / state.level.th)))
    );
    $("board").style.setProperty("--tile", tile + "px");
  }

  /* ---------------- movement ---------------- */

  function tryMove(dir) {
    if (state.screen !== "game" || state.busy || !state.level) return;
    const step = STEP[dir];
    if (!step) return;

    const nx = state.player.x + step.dx;
    const ny = state.player.y + step.dy;
    const grid = state.level.grid;

    if (dir === "left" || dir === "right") {
      state.facing = dir;
      state.playerEl.classList.toggle("face-left", dir === "left");
    }

    if (ny < 0 || nx < 0 || ny >= state.level.th || nx >= state.level.tw || grid[ny][nx] === 1) {
      bump(dir);
      return;
    }

    state.player.x = nx;
    state.player.y = ny;
    const speed = Themes.speedById(state.speedId).ms;
    state.playerEl.style.setProperty("--move-ms", Math.round(speed * 0.7) + "ms");
    place(state.playerEl, nx, ny);
    Sound.step();

    eatAt(nx, ny);
  }

  function bump(dir) {
    state.playerEl.classList.remove("bump-up", "bump-down", "bump-left", "bump-right");
    // restart the animation
    void state.playerEl.offsetWidth;
    state.playerEl.classList.add("bump-" + dir);
    Sound.bump();
  }

  function eatAt(x, y) {
    const key = x + "," + y;
    const el = state.targetEls.get(key);
    if (!el) return;

    state.targetEls.delete(key);
    el.classList.add("eaten");
    setTimeout(() => el.remove(), 420);

    state.remaining--;
    state.picked++;
    Sound.pickup(state.picked - 1);
    updateHud();
    popScore(x, y);

    if (state.remaining <= 0) finishLevel();
  }

  function popScore(x, y) {
    const el = document.createElement("div");
    el.className = "actor pop";
    el.textContent = "+1";
    place(el, x, y);
    $("actors").appendChild(el);
    setTimeout(() => el.remove(), 800);
  }

  /* ---------------- level flow ---------------- */

  function finishLevel() {
    state.busy = true;
    const last = state.levelNumber >= MazeKit.LEVEL_COUNT;

    if (state.levelNumber + 1 > state.unlocked && !last) {
      state.unlocked = clampLevel(state.levelNumber + 1);
    }
    if (last) state.unlocked = MazeKit.LEVEL_COUNT;
    save();

    confetti(last ? 120 : 60);
    if (last) Sound.fanfare();
    else Sound.levelClear();

    setTimeout(() => (last ? showGameComplete() : showLevelClear()), 450);
  }

  function showLevelClear() {
    const next = state.levelNumber + 1;
    showOverlay(`
      <h2 class="overlay-title">Level ${state.levelNumber} done!</h2>
      <p class="overlay-sub">You found everything in "${state.level.name}".</p>
      <div class="overlay-actions" data-focus-cols="2">
        <button class="big-btn play-btn" id="ov-next" data-focus type="button">Next level</button>
        <button class="big-btn ghost-btn" id="ov-home" data-focus type="button">Home</button>
      </div>
    `);
    $("ov-next").addEventListener("click", () => startLevel(next));
    $("ov-home").addEventListener("click", goHome);
  }

  function showGameComplete() {
    showOverlay(`
      <h2 class="overlay-title">All ${MazeKit.LEVEL_COUNT} levels finished!</h2>
      <p class="overlay-sub">You are a treasure hunting champion.</p>
      <div class="overlay-actions" data-focus-cols="2">
        <button class="big-btn play-btn" id="ov-again" data-focus type="button">Play again</button>
        <button class="big-btn ghost-btn" id="ov-home" data-focus type="button">Home</button>
      </div>
    `);
    $("ov-again").addEventListener("click", () => {
      state.levelNumber = 1;
      startLevel(1);
    });
    $("ov-home").addEventListener("click", goHome);
  }

  function showOverlay(html) {
    const overlay = $("overlay");
    $("overlay-card").innerHTML = html;
    overlay.hidden = false;
    state.screen = "overlay";
    const first = $("overlay-card").querySelector("[data-focus]");
    if (first) first.focus();
  }

  function hideOverlay() {
    $("overlay").hidden = true;
  }

  function goHome() {
    hideOverlay();
    state.busy = false;
    renderStart();
    showScreen("start");
  }

  /* ---------------- hud ---------------- */

  function updateHud() {
    const theme = Themes.byId(state.themeId);
    $("hud-level").textContent = state.levelNumber;
    $("hud-level-name").textContent = state.level ? state.level.name : "";
    $("hud-remaining").textContent = state.remaining;
    $("hud-target-icon").innerHTML = Sprites.svg(theme.target, "");
  }

  function updateSoundButton() {
    $("btn-sound").innerHTML = Sprites.svg(state.muted ? "ic-sound-off" : "ic-sound-on", "");
    $("btn-sound").classList.toggle("is-off", state.muted);
  }

  function renderHudIcons() {
    $("btn-restart").innerHTML = Sprites.svg("ic-restart", "");
    $("btn-home").innerHTML = Sprites.svg("ic-home", "");
  }

  function updatePadStatus() {
    const connected = Input.isPadConnected();
    const text = connected ? "Gamepad ready!" : "No gamepad — arrow keys work too";
    [["start-pad-status"], ["game-pad-status"]].forEach(([id]) => {
      const el = $(id);
      if (!el) return;
      el.innerHTML = Sprites.svg("ic-pad", "pad-icon") + `<span>${text}</span>`;
      el.classList.toggle("is-connected", connected);
    });

    // The on-screen D-pad is a touch fallback: show it only when there is no
    // gamepad. A real controller always takes over the moment it connects.
    const showTouch = HAS_TOUCH && !connected;
    if (document.body.classList.contains("show-touchpad") !== showTouch) {
      document.body.classList.toggle("show-touchpad", showTouch);
      if (!showTouch) releaseTouch();
      sizeBoard(); // the pad reserves board space, so the tile size changes
    }
  }

  function releaseTouch() {
    document.querySelectorAll(".dpad-btn.pressed").forEach((b) => b.classList.remove("pressed"));
    Input.setTouchDir(null);
  }

  function setupTouchpad() {
    const pad = $("touchpad");
    let activeBtn = null;

    const press = (btn) => {
      if (btn === activeBtn) return;
      if (activeBtn) activeBtn.classList.remove("pressed");
      activeBtn = btn;
      if (btn) {
        btn.classList.add("pressed");
        Sound.unlock();
        Input.setTouchDir(btn.dataset.dir);
      } else {
        Input.setTouchDir(null);
      }
    };

    // Track the finger across buttons so sliding from one arrow to another works.
    const btnAtPoint = (x, y) => {
      const el = document.elementFromPoint(x, y);
      return el && el.classList.contains("dpad-btn") ? el : null;
    };

    pad.addEventListener(
      "pointerdown",
      (e) => {
        if (!e.target.classList.contains("dpad-btn")) return;
        e.preventDefault();
        pad.setPointerCapture(e.pointerId);
        press(e.target);
      },
      { passive: false }
    );
    pad.addEventListener("pointermove", (e) => {
      if (!activeBtn) return;
      press(btnAtPoint(e.clientX, e.clientY));
    });
    const end = (e) => {
      if (activeBtn) e.preventDefault();
      press(null);
      activeBtn = null;
    };
    pad.addEventListener("pointerup", end);
    pad.addEventListener("pointercancel", end);
    pad.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  /* ---------------- confetti ---------------- */

  function confetti(count) {
    const layer = $("confetti");
    const colors = ["#ffd93d", "#ff6b9d", "#6bcBff", "#8ce99a", "#ffa94d", "#b197fc"];
    for (let i = 0; i < count; i++) {
      const bit = document.createElement("i");
      bit.className = "confetti-bit";
      bit.style.setProperty("--left", Math.random() * 100 + "%");
      bit.style.setProperty("--drift", (Math.random() * 160 - 80).toFixed(0) + "px");
      bit.style.setProperty("--spin", (Math.random() * 900 - 450).toFixed(0) + "deg");
      bit.style.setProperty("--delay", (Math.random() * 0.6).toFixed(2) + "s");
      bit.style.setProperty("--dur", (1.6 + Math.random() * 1.2).toFixed(2) + "s");
      bit.style.background = colors[i % colors.length];
      if (i % 3 === 0) bit.style.borderRadius = "50%";
      layer.appendChild(bit);
      setTimeout(() => bit.remove(), 3200);
    }
  }

  /* ---------------- wiring ---------------- */

  function onMove(dir) {
    if (state.screen === "game") tryMove(dir);
    else moveFocus(dir);
  }

  function onConfirm() {
    if (state.screen === "game") return;
    const el = document.activeElement;
    if (el && typeof el.click === "function" && el.dataset && "focus" in el.dataset) el.click();
  }

  function onBack() {
    if (state.screen === "game") goHome();
    else if (state.screen === "level") showScreen("start");
  }

  function init() {
    Sprites.inject("sprite-host");
    load();
    Themes.apply(Themes.byId(state.themeId));
    Sound.setMuted(state.muted);
    $("hud-total").textContent = MazeKit.LEVEL_COUNT;
    $("levels-btn-count").textContent = MazeKit.LEVEL_COUNT;
    renderStart();
    updateSoundButton();
    renderHudIcons();

    $("play-btn").addEventListener("click", () => {
      Sound.unlock();
      startLevel(state.levelNumber);
    });
    $("levels-btn").addEventListener("click", () => {
      Sound.unlock();
      renderLevelSelect();
      showScreen("level");
    });
    $("level-back").addEventListener("click", () => showScreen("start"));
    $("btn-home").addEventListener("click", goHome);
    $("btn-restart").addEventListener("click", () => startLevel(state.levelNumber));
    $("btn-sound").addEventListener("click", () => {
      state.muted = !state.muted;
      Sound.setMuted(state.muted);
      updateSoundButton();
      if (!state.muted) Sound.pickup(3);
      save();
    });

    setupTouchpad();

    Input.setRepeatMs(Themes.speedById(state.speedId).ms);
    Input.init({
      onMove: onMove,
      onConfirm: onConfirm,
      onBack: onBack,
      onPadChange: updatePadStatus,
    });

    window.addEventListener("resize", sizeBoard);
    updatePadStatus();
    showScreen("start");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
