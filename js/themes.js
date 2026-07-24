/* Themes are pure data: add an entry here (plus two symbols in sprites.js)
   and a new character shows up on the start screen automatically. */

const Themes = (function () {
  const THEMES = [
    {
      id: "chomper",
      name: "Chomper",
      blurb: "Gobble the dots",
      player: "sp-chomper",
      target: "sp-dot",
      playerClass: "anim-chomp",
      face: "spin",
      faceBase: "right",
      chomp: true,
      playerScale: 0.85, // the pac shape fills its whole circle, so shrink it a bit in 3D
      colors: {
        bg: "#141748",
        bgGlow: "#242a86",
        wall: "#3b47e0",
        wallEdge: "#6b78ff",
        floor: "#1d2160",
        floorLine: "#262b78",
        ink: "#ffffff",
        accent: "#ffd93d",
        accentInk: "#4a3800",
      },
    },
    {
      id: "hero",
      name: "Cap Hero",
      blurb: "Collect the mushrooms",
      player: "sp-hero",
      target: "sp-mushroom",
      playerClass: "anim-hop",
      colors: {
        bg: "#7ec8f5",
        bgGlow: "#a8ddff",
        wall: "#c97040",
        wallEdge: "#e59a68",
        floor: "#fff2dc",
        floorLine: "#ffe3bd",
        ink: "#40260f",
        accent: "#e23b3b",
        accentInk: "#ffffff",
      },
    },
    {
      id: "princess",
      name: "Ice Princess",
      blurb: "Catch the snowflakes",
      player: "sp-princess",
      target: "sp-snowflake",
      playerClass: "anim-sway",
      faceInvert: true,
      colors: {
        bg: "#cfeeff",
        bgGlow: "#eafaff",
        wall: "#78c4e6",
        wallEdge: "#a6e0f7",
        floor: "#f6fdff",
        floorLine: "#e3f5ff",
        ink: "#173a4d",
        accent: "#7a5ecb",
        accentInk: "#ffffff",
      },
    },
    {
      id: "kitty",
      name: "Kitty",
      blurb: "Find the fish",
      player: "sp-kitty",
      target: "sp-fish",
      playerClass: "anim-hop",
      colors: {
        bg: "#ffeed6",
        bgGlow: "#fff8ee",
        wall: "#f5a55f",
        wallEdge: "#ffc48c",
        floor: "#fffaf1",
        floorLine: "#ffeeda",
        ink: "#5a3413",
        accent: "#ec6f3f",
        accentInk: "#ffffff",
      },
    },
    {
      id: "puppy",
      name: "Blue Pup",
      blurb: "Fetch the bones",
      player: "sp-puppy",
      target: "sp-bone",
      playerClass: "anim-hop",
      colors: {
        bg: "#7ec6ef",
        bgGlow: "#b6e4fb",
        wall: "#f0a860",
        wallEdge: "#ffca8c",
        floor: "#fff6e6",
        floorLine: "#ffe8c8",
        ink: "#37301f",
        accent: "#ff8f3f",
        accentInk: "#ffffff",
      },
    },
    {
      id: "rocket",
      name: "Rocket",
      blurb: "Scoop up the stars",
      player: "sp-rocket",
      target: "sp-star",
      playerClass: "anim-hover",
      face: "spin",
      faceBase: "up",
      colors: {
        bg: "#1a1147",
        bgGlow: "#2e1f75",
        wall: "#7a52d8",
        wallEdge: "#a487ff",
        floor: "#251a63",
        floorLine: "#31257a",
        ink: "#ffffff",
        accent: "#ffd93d",
        accentInk: "#4a3800",
      },
    },
    {
      id: "squid",
      name: "Squid",
      blurb: "Pop the bubbles",
      player: "sp-squid",
      target: "sp-bubble",
      playerClass: "anim-hover",
      face: "spin",
      faceBase: "up",
      colors: {
        bg: "#8fd9ec",
        bgGlow: "#c2eef7",
        wall: "#ff9a6a",
        wallEdge: "#ffbc94",
        floor: "#eafaff",
        floorLine: "#d3f0f8",
        ink: "#124a5e",
        accent: "#ff5e93",
        accentInk: "#ffffff",
      },
    },
    {
      id: "octopus",
      name: "Octopus",
      blurb: "Collect the shells",
      player: "sp-octopus",
      target: "sp-shell",
      playerClass: "anim-sway",
      colors: {
        bg: "#123a52",
        bgGlow: "#1e5877",
        wall: "#7d5fd6",
        wallEdge: "#a488ef",
        floor: "#16465e",
        floorLine: "#205a75",
        ink: "#ffffff",
        accent: "#ffd35e",
        accentInk: "#4a3800",
      },
    },
    {
      id: "ghost",
      name: "Ghost",
      blurb: "Grab the pumpkins",
      player: "sp-ghost",
      target: "sp-pumpkin",
      playerClass: "anim-hover",
      colors: {
        bg: "#241a3d",
        bgGlow: "#392a58",
        wall: "#6d4bb0",
        wallEdge: "#9070d8",
        floor: "#2c2148",
        floorLine: "#372a55",
        ink: "#ffffff",
        accent: "#ff9838",
        accentInk: "#4a2800",
      },
    },
    {
      id: "spider",
      name: "Spider",
      blurb: "Catch the flies",
      player: "sp-spider",
      target: "sp-fly",
      playerClass: "anim-hop",
      face: "spin",
      faceBase: "up",
      colors: {
        bg: "#2b2233",
        bgGlow: "#413650",
        wall: "#6b7280",
        wallEdge: "#8b93a1",
        floor: "#332a3d",
        floorLine: "#3f3449",
        ink: "#ffffff",
        accent: "#a3e635",
        accentInk: "#26400a",
      },
    },
    {
      id: "pirate",
      name: "Pirate",
      blurb: "Find the treasure",
      player: "sp-pirate",
      target: "sp-chest",
      playerClass: "anim-hop",
      colors: {
        bg: "#2f86b0",
        bgGlow: "#54a8cc",
        wall: "#a86a3c",
        wallEdge: "#c98a5a",
        floor: "#f2e2ba",
        floorLine: "#e6d0a0",
        ink: "#3a2410",
        accent: "#ffcf3d",
        accentInk: "#4a3000",
      },
    },
  ];

  const SPEEDS = [
    { id: "slow", name: "Slow", ms: 250, chevrons: 1 },
    { id: "normal", name: "Normal", ms: 165, chevrons: 2 },
    { id: "fast", name: "Fast", ms: 110, chevrons: 3 },
  ];

  function byId(id) {
    return THEMES.find((t) => t.id === id) || THEMES[0];
  }

  function speedById(id) {
    return SPEEDS.find((s) => s.id === id) || SPEEDS[1];
  }

  /** Push a theme's palette onto :root so all CSS follows along. */
  function apply(theme) {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty("--" + key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase()), value);
    });
    root.dataset.theme = theme.id;
  }

  function chevronIcon(count) {
    let paths = "";
    for (let i = 0; i < count; i++) {
      const x = 24 + i * 22;
      paths += `<path d="M${x},28 L${x + 16},50 L${x},72" />`;
    }
    return `<svg class="chevrons" viewBox="0 0 100 100" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-width="11" stroke-linecap="round" stroke-linejoin="round">${paths}</g>
    </svg>`;
  }

  function renderThemeCards(container, selectedId, onPick) {
    container.innerHTML = THEMES.map(
      (t) => `
      <button class="theme-card ${t.id === selectedId ? "is-selected" : ""}"
              data-focus data-theme-id="${t.id}" type="button">
        <span class="theme-art" data-palette="${t.id}">
          ${Sprites.svg(t.player, "theme-card-player " + (t.playerClass || ""))}
          ${Sprites.svg(t.target, "theme-card-target anim-float")}
        </span>
        <span class="theme-name">${t.name}</span>
        <span class="theme-blurb">${t.blurb}</span>
      </button>`
    ).join("");

    THEMES.forEach((t) => {
      const art = container.querySelector(`[data-palette="${t.id}"]`);
      if (art) {
        art.style.background = `radial-gradient(circle at 50% 35%, ${t.colors.bgGlow}, ${t.colors.bg})`;
      }
    });

    container.querySelectorAll(".theme-card").forEach((btn) => {
      btn.addEventListener("click", () => onPick(btn.dataset.themeId));
    });
  }

  function renderSpeedButtons(container, selectedId, onPick) {
    container.innerHTML = SPEEDS.map(
      (s) => `
      <button class="speed-btn ${s.id === selectedId ? "is-selected" : ""}"
              data-focus data-speed-id="${s.id}" type="button">
        ${chevronIcon(s.chevrons)}
        <span>${s.name}</span>
      </button>`
    ).join("");

    container.querySelectorAll(".speed-btn").forEach((btn) => {
      btn.addEventListener("click", () => onPick(btn.dataset.speedId));
    });
  }

  /* How the player sprite orients to the travel direction.
     Returns { rot: degrees-clockwise, mirror: bool } or null (keep current).
     Renderers bake this into the image (2D: a transform on the sprite wrapper;
     3D: a re-oriented texture), so it applies in both modes.
     - Chomper (spin, art points right): mirror for left/right so the eye stays
       up, rotate for up/down.
     - Rocket (spin, art points up): pure rotation for all four.
     - "flip" themes (Hero, Ice Princess, Kitty, Blue Pup): mirror on left/right,
       unchanged on up/down. `faceInvert` swaps which side mirrors — Ice Princess
       uses it so her braid sits left when walking right, right when walking left. */
  function faceTransform(dir, theme) {
    const mode = theme.face || "flip";
    const dirAngle = { right: 0, down: 90, left: 180, up: -90 };
    if (mode === "spin") {
      if ((theme.faceBase || "right") === "up") {
        return { rot: dirAngle[dir] + 90, mirror: false }; // base points up
      }
      // base points right: mirror horizontally for left/right, rotate up/down
      if (dir === "left") return { rot: 0, mirror: true };
      if (dir === "right") return { rot: 0, mirror: false };
      return { rot: dirAngle[dir], mirror: false };
    }
    const mirrorDir = theme.faceInvert ? "right" : "left";
    if (dir === "left" || dir === "right") return { rot: 0, mirror: dir === mirrorDir };
    return null;
  }

  const RENDER_MODES = [
    { id: "2d", name: "2D", blurb: "Flat & classic" },
    { id: "3d", name: "3D", blurb: "Pop-up world" },
  ];

  function renderModeToggle(container, selectedId, onPick) {
    container.innerHTML = RENDER_MODES.map(
      (m) => `
      <button class="speed-btn mode-btn ${m.id === selectedId ? "is-selected" : ""}"
              data-focus data-mode-id="${m.id}" type="button">
        <span class="mode-name">${m.name}</span>
        <span class="theme-blurb">${m.blurb}</span>
      </button>`
    ).join("");

    container.querySelectorAll(".mode-btn").forEach((btn) => {
      btn.addEventListener("click", () => onPick(btn.dataset.modeId));
    });
  }

  return {
    THEMES,
    SPEEDS,
    RENDER_MODES,
    byId,
    speedById,
    apply,
    faceTransform,
    renderThemeCards,
    renderSpeedButtons,
    renderModeToggle,
  };
})();

if (typeof module !== "undefined" && module.exports) module.exports = Themes;
