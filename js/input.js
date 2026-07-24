/* One direction stream from either a gamepad or the keyboard.
   Gamepads vary a lot, so we read the D-pad buttons AND the left stick. */

const Input = (function () {
  const DPAD = { 12: "up", 13: "down", 14: "left", 15: "right" };
  const CONFIRM_BUTTONS = [0, 9]; // A / Start
  const BACK_BUTTONS = [1, 8]; // B / Select
  const MUTE_BUTTONS = [2]; // X — toggle sound
  const RESTART_BUTTONS = [3]; // Y — restart the level
  const LOOK_BUTTONS = [5]; // RB — change character / 2D-3D
  const DEAD_ZONE = 0.45;
  const FIRST_REPEAT_DELAY = 260; // grace period so one tap = one step

  let handlers = {};
  let repeatMs = 165;
  let currentDir = null;
  let padDir = null;
  let touchDir = null;
  let nextStepAt = 0;
  let padConnected = false;
  let prevPressed = {};
  const keyStack = [];

  const KEY_DIRS = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
    w: "up",
    a: "left",
    s: "down",
    d: "right",
  };

  function keyDir(e) {
    if (typeof e.key !== "string") return null;
    return KEY_DIRS[e.key] || KEY_DIRS[e.key.toLowerCase()] || null;
  }

  function onKeyDown(e) {
    const dir = keyDir(e);
    if (dir) {
      e.preventDefault();
      if (!keyStack.includes(dir)) keyStack.push(dir);
      // Act on the keypress itself: a tap shorter than one frame must not be lost.
      syncDir(performance.now());
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      // Buttons handle their own activation; only intercept when nothing is focused.
      if (!document.activeElement || document.activeElement === document.body) {
        e.preventDefault();
        fire("confirm");
      }
      return;
    }
    if (e.key === "Escape" || e.key === "Backspace") {
      e.preventDefault();
      fire("back");
      return;
    }
    if (e.key === "c" || e.key === "C") {
      e.preventDefault();
      fire("look"); // change character / 2D-3D
    }
  }

  function onKeyUp(e) {
    const dir = keyDir(e);
    if (!dir) return;
    const i = keyStack.indexOf(dir);
    if (i >= 0) keyStack.splice(i, 1);
    // Clear the held direction now so an immediate re-tap counts as a new press.
    syncDir(performance.now());
  }

  function activePad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const p of pads) if (p && p.connected) return p;
    return null;
  }

  function padDirection(pad) {
    for (const index of Object.keys(DPAD)) {
      const b = pad.buttons[index];
      if (b && (b.pressed || b.value > 0.5)) return DPAD[index];
    }
    const ax = pad.axes[0] || 0;
    const ay = pad.axes[1] || 0;
    if (Math.abs(ax) > Math.abs(ay)) {
      if (ax > DEAD_ZONE) return "right";
      if (ax < -DEAD_ZONE) return "left";
    } else {
      if (ay > DEAD_ZONE) return "down";
      if (ay < -DEAD_ZONE) return "up";
    }
    return null;
  }

  function edgePressed(pad, indices) {
    let hit = false;
    for (const i of indices) {
      const b = pad.buttons[i];
      const down = !!(b && (b.pressed || b.value > 0.5));
      if (down && !prevPressed[i]) hit = true;
      prevPressed[i] = down;
    }
    return hit;
  }

  function fire(name, arg) {
    const fn = handlers["on" + name[0].toUpperCase() + name.slice(1)];
    if (fn) fn(arg);
  }

  /** Gamepad first, then the on-screen pad, then the newest key held. */
  function wantedDir() {
    if (padDir) return padDir;
    if (touchDir) return touchDir;
    return keyStack.length ? keyStack[keyStack.length - 1] : null;
  }

  /* A new direction steps at once, then auto-repeats after a short grace period. */
  function syncDir(now) {
    const dir = wantedDir();
    if (dir !== currentDir) {
      currentDir = dir;
      if (dir) {
        fire("move", dir);
        nextStepAt = now + FIRST_REPEAT_DELAY;
      }
    } else if (dir && now >= nextStepAt) {
      fire("move", dir);
      nextStepAt = now + repeatMs;
    }
  }

  function tick(now) {
    const pad = activePad();

    if (!!pad !== padConnected) {
      padConnected = !!pad;
      fire("padChange", padConnected ? pad.id : null);
    }

    padDir = null;
    if (pad) {
      padDir = padDirection(pad);
      if (edgePressed(pad, CONFIRM_BUTTONS)) fire("confirm");
      if (edgePressed(pad, BACK_BUTTONS)) fire("back");
      if (edgePressed(pad, MUTE_BUTTONS)) fire("mute");
      if (edgePressed(pad, RESTART_BUTTONS)) fire("restart");
      if (edgePressed(pad, LOOK_BUTTONS)) fire("look");
    }

    syncDir(now);
    requestAnimationFrame(tick);
  }

  function init(opts) {
    handlers = opts || {};
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", () => {
      keyStack.length = 0;
      padDir = null;
      touchDir = null;
      currentDir = null;
    });
    window.addEventListener("gamepadconnected", () => {});
    window.addEventListener("gamepaddisconnected", () => {});
    requestAnimationFrame(tick);
  }

  function setRepeatMs(ms) {
    repeatMs = ms;
  }

  /* The on-screen D-pad calls this. Acting immediately (not on the next poll)
     means a quick tap still registers one step. Pass null on release. */
  function setTouchDir(dir) {
    touchDir = dir || null;
    syncDir(performance.now());
  }

  function isPadConnected() {
    return padConnected;
  }

  return { init, setRepeatMs, setTouchDir, isPadConnected };
})();
