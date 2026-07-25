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
        bg: "#ffd6e6",
        bgGlow: "#ffe9f2",
        wall: "#ff87ab",
        wallEdge: "#ffacc6",
        floor: "#fff5f9",
        floorLine: "#ffe4ef",
        ink: "#7a2a48",
        accent: "#ff4d7d",
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
      face: "spin",
      faceBase: "up",
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
    {
      id: "santa",
      name: "Santa",
      blurb: "Deliver the gifts",
      player: "sp-santa",
      target: "sp-gift",
      playerClass: "anim-hop",
      colors: {
        bg: "#9ecfe8",
        bgGlow: "#c6e6f5",
        wall: "#3fa85c",
        wallEdge: "#66c584",
        floor: "#f4fbff",
        floorLine: "#dcecf5",
        ink: "#24405a",
        accent: "#e14b4b",
        accentInk: "#ffffff",
      },
    },
    {
      id: "racecar",
      name: "Race Car",
      blurb: "Grab the trophies",
      player: "sp-racecar",
      target: "sp-trophy",
      playerClass: "anim-hop",
      face: "spin",
      faceBase: "right",
      colors: {
        bg: "#2f3644",
        bgGlow: "#454e60",
        wall: "#f0b429",
        wallEdge: "#ffd35e",
        floor: "#3a4250",
        floorLine: "#454e5e",
        ink: "#ffffff",
        accent: "#ff5e5e",
        accentInk: "#ffffff",
      },
    },
    {
      id: "trex",
      name: "T-Rex",
      blurb: "Chomp the meat",
      player: "sp-trex",
      target: "sp-meat",
      playerClass: "anim-hop",
      colors: {
        bg: "#86c56a",
        bgGlow: "#a8dd8c",
        wall: "#a8683a",
        wallEdge: "#c98a56",
        floor: "#efe3b0",
        floorLine: "#e3d29a",
        ink: "#2e3d1a",
        accent: "#e05038",
        accentInk: "#ffffff",
      },
    },
    {
      id: "baby",
      name: "Baby",
      blurb: "Find the bottles",
      player: "sp-baby",
      target: "sp-bottle",
      playerClass: "anim-hop",
      colors: {
        bg: "#ffe3ef",
        bgGlow: "#fff2f8",
        wall: "#b39ae6",
        wallEdge: "#cdb8f0",
        floor: "#fffdf6",
        floorLine: "#fbeede",
        ink: "#5a4a6a",
        accent: "#ff9ec4",
        accentInk: "#ffffff",
      },
    },
    {
      id: "bee",
      name: "Bee",
      blurb: "Gather the honey",
      player: "sp-bee",
      target: "sp-honey",
      playerClass: "anim-hover",
      face: "spin",
      faceBase: "right",
      colors: {
        bg: "#bfe89a", bgGlow: "#d8f5bc", wall: "#f0b429", wallEdge: "#ffd35e",
        floor: "#f6ffe8", floorLine: "#e8f5cf", ink: "#4a3b1a", accent: "#ff9838", accentInk: "#ffffff",
      },
    },
    {
      id: "bunny",
      name: "Bunny",
      blurb: "Pick the carrots",
      player: "sp-bunny",
      target: "sp-carrot",
      playerClass: "anim-hop",
      colors: {
        bg: "#d6f0d6", bgGlow: "#ecf9ec", wall: "#ff9ab0", wallEdge: "#ffbccb",
        floor: "#fbfff7", floorLine: "#eaf7e6", ink: "#5a3a4a", accent: "#ff8f3a", accentInk: "#ffffff",
      },
    },
    {
      id: "panda",
      name: "Panda",
      blurb: "Munch the bamboo",
      player: "sp-panda",
      target: "sp-bamboo",
      playerClass: "anim-hop",
      colors: {
        bg: "#cfeecb", bgGlow: "#e6f7e2", wall: "#6cc24a", wallEdge: "#8fd66f",
        floor: "#f4fbef", floorLine: "#e2f2da", ink: "#2e3d1a", accent: "#ff8f5a", accentInk: "#ffffff",
      },
    },
    {
      id: "monkey",
      name: "Monkey",
      blurb: "Grab the bananas",
      player: "sp-monkey",
      target: "sp-banana",
      playerClass: "anim-hop",
      colors: {
        bg: "#8fd0e8", bgGlow: "#b6e4f5", wall: "#a8683a", wallEdge: "#c98a56",
        floor: "#efe3b0", floorLine: "#e3d29a", ink: "#4a3416", accent: "#ffcf3d", accentInk: "#4a3800",
      },
    },
    {
      id: "penguin",
      name: "Penguin",
      blurb: "Scoop the ice cream",
      player: "sp-penguin",
      target: "sp-icecream",
      playerClass: "anim-hop",
      colors: {
        bg: "#a9e0f5", bgGlow: "#d0f0fb", wall: "#5a86c0", wallEdge: "#86aad8",
        floor: "#f2fbff", floorLine: "#dcecf5", ink: "#1a3a52", accent: "#ff9f2e", accentInk: "#ffffff",
      },
    },
    {
      id: "frog",
      name: "Frog",
      blurb: "Hop to the lilies",
      player: "sp-frog",
      target: "sp-lily",
      playerClass: "anim-hop",
      colors: {
        bg: "#7fc9d8", bgGlow: "#a6dde8", wall: "#4e9e3f", wallEdge: "#6fbf5a",
        floor: "#eafaf0", floorLine: "#d3f0dc", ink: "#1f4a2a", accent: "#ff9ec4", accentInk: "#ffffff",
      },
    },
    {
      id: "butterfly",
      name: "Butterfly",
      blurb: "Visit the flowers",
      player: "sp-butterfly",
      target: "sp-flower",
      playerClass: "anim-hover",
      face: "spin",
      faceBase: "up",
      colors: {
        bg: "#d6f0ff", bgGlow: "#ecf8ff", wall: "#a884e0", wallEdge: "#c2a6f0",
        floor: "#fdf7ff", floorLine: "#f0e6fb", ink: "#4a2a5a", accent: "#ff6b9d", accentInk: "#ffffff",
      },
    },
    {
      id: "dragon",
      name: "Dragon",
      blurb: "Hoard the gems",
      player: "sp-dragon",
      target: "sp-gem",
      playerClass: "anim-hop",
      colors: {
        bg: "#f2a35c", bgGlow: "#ffbe80", wall: "#b04a3c", wallEdge: "#d06a5a",
        floor: "#f5e0c0", floorLine: "#ecd0a8", ink: "#4a2418", accent: "#5ac8f0", accentInk: "#ffffff",
      },
    },
    {
      id: "wizard",
      name: "Wizard",
      blurb: "Brew the potions",
      player: "sp-wizard",
      target: "sp-potion",
      playerClass: "anim-sway",
      colors: {
        bg: "#1e2a52", bgGlow: "#33447a", wall: "#4a6ad0", wallEdge: "#7a94e8",
        floor: "#26325e", floorLine: "#33407a", ink: "#ffffff", accent: "#c07ad0", accentInk: "#ffffff",
      },
    },
    {
      id: "unicorn",
      name: "Unicorn",
      blurb: "Chase the rainbows",
      player: "sp-unicorn",
      target: "sp-rainbow",
      playerClass: "anim-hop",
      colors: {
        bg: "#e6ddff", bgGlow: "#f3edff", wall: "#ff9ec4", wallEdge: "#ffbcd8",
        floor: "#fff7fd", floorLine: "#f6e6f5", ink: "#5a3a5a", accent: "#5ad0e0", accentInk: "#ffffff",
      },
    },
    {
      id: "robot",
      name: "Robot",
      blurb: "Charge the batteries",
      player: "sp-robot",
      target: "sp-battery",
      playerClass: "anim-hop",
      colors: {
        bg: "#2b3a4a", bgGlow: "#3f5468", wall: "#5f8fb0", wallEdge: "#86b0cc",
        floor: "#33424f", floorLine: "#3f5160", ink: "#ffffff", accent: "#5fe0d0", accentInk: "#16403a",
      },
    },
    {
      id: "alien",
      name: "Alien",
      blurb: "Collect the planets",
      player: "sp-alien",
      target: "sp-planet",
      playerClass: "anim-hover",
      colors: {
        bg: "#1a2a3a", bgGlow: "#2e4458", wall: "#5aad3d", wallEdge: "#7ac74f",
        floor: "#22323f", floorLine: "#2e404e", ink: "#ffffff", accent: "#c07ad0", accentInk: "#ffffff",
      },
    },
    {
      id: "mermaid",
      name: "Mermaid",
      blurb: "Gather the pearls",
      player: "sp-mermaid",
      target: "sp-pearl",
      playerClass: "anim-sway",
      face: "spin",
      faceBase: "up", // she swims toward the way she's moving (like the squid/octopus)
      colors: {
        bg: "#3aa0c0", bgGlow: "#5fc0d8", wall: "#3fc4c0", wallEdge: "#6fd8d4",
        floor: "#eafaff", floorLine: "#cdeff5", ink: "#164055", accent: "#ff9ec4", accentInk: "#ffffff",
      },
    },
    {
      id: "chef",
      name: "Chef",
      blurb: "Bake the cupcakes",
      player: "sp-chef",
      target: "sp-cupcake",
      playerClass: "anim-hop",
      colors: {
        bg: "#ffe8cf", bgGlow: "#fff4e6", wall: "#ff8f6a", wallEdge: "#ffb08f",
        floor: "#fffaf2", floorLine: "#ffeeda", ink: "#5a3420", accent: "#ff5e8a", accentInk: "#ffffff",
      },
    },
    {
      id: "knight",
      name: "Knight",
      blurb: "Collect the shields",
      player: "sp-knight",
      target: "sp-shield",
      playerClass: "anim-hop",
      colors: {
        bg: "#8fa0c0", bgGlow: "#b0bdd6", wall: "#6b7280", wallEdge: "#8b93a1",
        floor: "#e6e2d6", floorLine: "#d6d2c4", ink: "#2a2f3a", accent: "#6b8fd8", accentInk: "#ffffff",
      },
    },
    {
      id: "snowman",
      name: "Snowman",
      blurb: "Sip the cocoa",
      player: "sp-snowman",
      target: "sp-cocoa",
      playerClass: "anim-hop",
      colors: {
        bg: "#cfe8f5", bgGlow: "#e6f4fb", wall: "#7fb0d8", wallEdge: "#a6ccec",
        floor: "#f7fcff", floorLine: "#e2eef5", ink: "#24405a", accent: "#ff6b6b", accentInk: "#ffffff",
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
