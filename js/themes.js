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
    renderThemeCards,
    renderSpeedButtons,
    renderModeToggle,
  };
})();

if (typeof module !== "undefined" && module.exports) module.exports = Themes;
