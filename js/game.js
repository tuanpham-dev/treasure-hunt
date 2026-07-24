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
    renderMode: "2d",
    targetSet: new Set(), // logical "x,y" of uncollected targets; rendering is the renderer's job
  };

  // The active board renderer. Swapped for Renderer3D when render mode is "3d".
  let renderer = Renderer2D;

  function activeRenderer() {
    return state.renderMode === "3d" ? Renderer3D : Renderer2D;
  }

  /* Make `renderer` match the chosen mode and mount it. If a 3D mount fails
     (no WebGL), fall back to 2D and surface the note by the toggle. */
  function ensureRenderer() {
    const want = activeRenderer();
    if (want !== renderer) {
      renderer.unmount();
      renderer = want;
    }
    const ok = renderer.mount($("board-wrap"));
    if (ok === false && renderer === Renderer3D) {
      renderer = Renderer2D;
      state.renderMode = "2d";
      save();
      $("render-mode-note").hidden = false;
      renderer.mount($("board-wrap"));
    }
  }

  /* ---------------- persistence ---------------- */

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.themeId) state.themeId = saved.themeId;
      if (saved.speedId) state.speedId = saved.speedId;
      if (typeof saved.muted === "boolean") state.muted = saved.muted;
      if (saved.renderMode === "2d" || saved.renderMode === "3d") state.renderMode = saved.renderMode;
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
          renderMode: state.renderMode,
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

    Themes.renderModeToggle($("render-mode-row"), state.renderMode, (id) => {
      state.renderMode = id;
      Sound.step();
      save();
      renderStart();
      const btn = $("render-mode-row").querySelector(`[data-mode-id="${id}"]`);
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
    state.targetSet = new Set(state.level.targets.map((t) => t.x + "," + t.y));
    save();

    const theme = Themes.byId(state.themeId);
    ensureRenderer();
    renderer.applyTheme(theme);
    renderer.buildLevel(state.level, theme);

    updateHud();
    hideOverlay();
    hideCoach();
    showScreen("game");
    renderer.resize(); // must run once the screen is visible, or the wrap measures 0
    showCoach(); // one-time first-play hint
    document.activeElement && document.activeElement.blur();
  }

  /* ---------------- movement ---------------- */

  function tryMove(dir) {
    if (state.screen !== "game" || state.busy || !state.level) return;
    const step = STEP[dir];
    if (!step) return;

    let nx = state.player.x + step.dx;
    let ny = state.player.y + step.dy;
    const grid = state.level.grid;

    state.facing = dir; // renderer decides how to present it per theme

    let teleport = false;
    if (ny < 0 || nx < 0 || ny >= state.level.th || nx >= state.level.tw) {
      // off the edge — take a warp tunnel if this tile has one, else bump
      const link = state.level.tunnels && state.level.tunnels[state.player.x + "," + state.player.y];
      if (!link) {
        renderer.bumpPlayer(dir);
        Sound.bump();
        return;
      }
      nx = link.x;
      ny = link.y;
      teleport = true;
    } else if (grid[ny][nx] === 1) {
      renderer.bumpPlayer(dir);
      Sound.bump();
      return;
    }

    state.player.x = nx;
    state.player.y = ny;
    const moveMs = Math.round(Themes.speedById(state.speedId).ms * 0.7);
    renderer.movePlayer(nx, ny, state.facing, moveMs, teleport);
    if (teleport) Sound.pickup(1);
    else Sound.step();
    hideCoach(); // player got the idea

    eatAt(nx, ny);
  }

  function eatAt(x, y) {
    const key = x + "," + y;
    if (!state.targetSet.has(key)) return;

    state.targetSet.delete(key);
    renderer.eatTarget(x, y);

    state.remaining--;
    state.picked++;
    Sound.pickup(state.picked - 1);
    updateHud();
    renderer.popScore(x, y);

    if (state.remaining <= 0) finishLevel();
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

  /* ---------------- onboarding: controls guide + coach hint ---------------- */

  function controlsRows() {
    const pad = Input.isPadConnected();
    const move = pad ? "D-pad / Stick" : HAS_TOUCH ? "On-screen arrows" : "Arrow keys / WASD";
    return [
      ["Move", move],
      ["Pick / Play", pad ? "A button" : HAS_TOUCH ? "Tap" : "Enter / Space"],
      ["Back / Home", pad ? "B button" : HAS_TOUCH ? "Home button" : "Esc"],
      ["Restart level", pad ? "Y button" : "Restart button"],
      ["Sound on / off", pad ? "X button" : "Sound button"],
    ];
  }

  function showControls(returnScreen) {
    const rows = controlsRows()
      .map(([a, b]) => `<div class="ctrl-row"><span>${a}</span><b>${b}</b></div>`)
      .join("");
    showOverlay(`
      <h2 class="overlay-title">How to play</h2>
      <p class="overlay-sub">Move your character to grab every treasure. No timer, no losing — just explore!</p>
      <div class="controls-list">${rows}</div>
      <div class="overlay-actions" data-focus-cols="1">
        <button class="big-btn play-btn" id="ctrl-ok" data-focus type="button">Got it!</button>
      </div>
    `);
    $("ctrl-ok").addEventListener("click", () => {
      hideOverlay();
      try {
        localStorage.setItem("th-seen-controls", "1");
      } catch (err) {
        /* private mode — just won't remember */
      }
      state.screen = returnScreen || "start";
      const scope = $(state.screen + "-screen");
      const back =
        scope &&
        (scope.querySelector("[data-focus-default]:not([disabled])") ||
          scope.querySelector("[data-focus]:not([disabled])"));
      if (back) back.focus();
    });
  }

  let coachTimer = null;
  function showCoach() {
    let seen = false;
    try {
      seen = !!localStorage.getItem("th-seen-tutorial");
      if (!seen) localStorage.setItem("th-seen-tutorial", "1");
    } catch (err) {
      seen = true; // no storage → don't nag every level
    }
    if (seen) return;
    const c = $("coach");
    c.textContent = "Move to grab all the treasures!";
    c.hidden = false;
    clearTimeout(coachTimer);
    coachTimer = setTimeout(hideCoach, 5000);
  }

  function hideCoach() {
    clearTimeout(coachTimer);
    $("coach").hidden = true;
  }

  function goHome() {
    hideOverlay();
    state.busy = false;
    renderer.unmount(); // stop the 3D loop / release the board while on the menu
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
      renderer.resize(); // the pad reserves board space, so the tile size changes
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
    $("help-btn").addEventListener("click", () => showControls("start"));
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
      onMute: () => $("btn-sound").click(), // X — toggle sound anywhere
      onRestart: () => {
        if (state.screen === "game") startLevel(state.levelNumber); // Y — restart the level
      },
    });

    window.addEventListener("resize", () => renderer.resize());
    updatePadStatus();
    showScreen("start");

    // First-ever visit: show the controls guide once.
    let seenControls = true;
    try {
      seenControls = !!localStorage.getItem("th-seen-controls");
    } catch (err) {
      seenControls = true;
    }
    if (!seenControls) showControls("start");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
