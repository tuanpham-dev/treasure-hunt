/* Maze generation + level data + playability validation.
   Runs in the browser (global `MazeKit`) and in Node (module.exports),
   so tools/validate-levels.js checks exactly the code the game runs. */

const MazeKit = (function () {
  const DIRS = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];

  /* Deterministic PRNG (mulberry32): level N is the same maze for everyone. */
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* 30 levels. `cols`/`rows` are maze cells; the tile grid is (cols*2+1) x (rows*2+1).
     `braid` = chance of opening each dead end, so high braid = roomy and forgiving,
     low braid = a tight, twisty maze. */
  const LEVELS = [
    { cols: 4, rows: 3, targets: 1, braid: 0.95, name: "First Steps" },
    { cols: 4, rows: 3, targets: 2, braid: 0.95, name: "Two to Find" },
    { cols: 5, rows: 3, targets: 3, braid: 0.9, name: "Warm Up" },
    { cols: 5, rows: 4, targets: 3, braid: 0.85, name: "Open Field" },
    { cols: 5, rows: 4, targets: 4, braid: 0.8, name: "Four Corners" },
    { cols: 6, rows: 4, targets: 4, braid: 0.8, name: "Wander" },
    { cols: 6, rows: 4, targets: 5, braid: 0.7, name: "Loop the Loop" },
    { cols: 6, rows: 5, targets: 5, braid: 0.7, tunnels: 1, name: "Big Yard" },
    { cols: 6, rows: 5, targets: 6, braid: 0.65, name: "Six Pack" },
    { cols: 7, rows: 5, targets: 6, braid: 0.6, name: "Crossroads" },
    { cols: 7, rows: 5, targets: 7, braid: 0.55, name: "Hide and Seek" },
    { cols: 7, rows: 6, targets: 7, braid: 0.5, name: "Winding Way" },
    { cols: 8, rows: 6, targets: 8, braid: 0.5, name: "The Long Hall" },
    { cols: 8, rows: 6, targets: 8, braid: 0.45, tunnels: 1, name: "Twist" },
    { cols: 8, rows: 6, targets: 9, braid: 0.4, name: "Nine Lives" },
    { cols: 9, rows: 6, targets: 9, braid: 0.4, name: "Side Streets" },
    { cols: 9, rows: 7, targets: 10, braid: 0.35, name: "Ten Treasures" },
    { cols: 9, rows: 7, targets: 10, braid: 0.32, name: "Corner Pockets" },
    { cols: 10, rows: 7, targets: 11, braid: 0.3, name: "The Maze Grows" },
    { cols: 10, rows: 7, targets: 11, braid: 0.28, tunnels: 1, name: "Dead End Alley" },
    { cols: 10, rows: 8, targets: 12, braid: 0.25, name: "Twelve Trail" },
    { cols: 11, rows: 8, targets: 12, braid: 0.22, name: "Deep Woods" },
    { cols: 11, rows: 8, targets: 13, braid: 0.2, name: "Hidden Nooks" },
    { cols: 11, rows: 8, targets: 13, braid: 0.18, name: "The Spiral" },
    { cols: 12, rows: 8, targets: 14, braid: 0.15, name: "Far and Wide" },
    { cols: 12, rows: 9, targets: 14, braid: 0.12, tunnels: 2, name: "Lost and Found" },
    { cols: 12, rows: 9, targets: 15, braid: 0.1, name: "The Labyrinth" },
    { cols: 12, rows: 9, targets: 15, braid: 0.08, name: "Every Corner" },
    { cols: 12, rows: 9, targets: 16, braid: 0.05, name: "Almost There" },
    { cols: 12, rows: 9, targets: 18, braid: 0.02, name: "Grand Treasure Hunt" },
    { cols: 13, rows: 9, targets: 18, braid: 0.2, name: "Bigger Hunt" },
    { cols: 13, rows: 10, targets: 19, braid: 0.15, name: "The Warren" },
    { cols: 14, rows: 10, targets: 20, braid: 0.12, tunnels: 2, name: "Twist and Turn" },
    { cols: 14, rows: 10, targets: 20, braid: 0.1, name: "Maze Master" },
    { cols: 14, rows: 11, targets: 21, braid: 0.08, name: "Deep Dive" },
    { cols: 15, rows: 11, targets: 22, braid: 0.15, name: "The Gauntlet" },
    { cols: 15, rows: 11, targets: 22, braid: 0.1, name: "Tangle" },
    { cols: 15, rows: 11, targets: 23, braid: 0.06, name: "Far Reaches" },
    { cols: 16, rows: 11, targets: 24, braid: 0.1, name: "The Sprawl" },
    { cols: 16, rows: 11, targets: 24, braid: 0.05, tunnels: 2, name: "Treasure Trove" },
    { cols: 16, rows: 12, targets: 25, braid: 0.12, name: "The Puzzle Box" },
    { cols: 16, rows: 12, targets: 25, braid: 0.08, name: "Winding Roads" },
    { cols: 17, rows: 12, targets: 26, braid: 0.1, name: "Hidden Depths" },
    { cols: 17, rows: 12, targets: 26, braid: 0.05, name: "The Big Maze" },
    { cols: 17, rows: 12, targets: 27, braid: 0.04, name: "Scavenger Hunt" },
    { cols: 18, rows: 12, targets: 28, braid: 0.08, name: "The Labyrinth II" },
    { cols: 18, rows: 12, targets: 28, braid: 0.04, tunnels: 3, name: "Every Nook" },
    { cols: 18, rows: 13, targets: 30, braid: 0.06, name: "The Long Haul" },
    { cols: 18, rows: 13, targets: 30, braid: 0.03, name: "Almost Endless" },
    { cols: 18, rows: 13, targets: 32, braid: 0.0, tunnels: 3, name: "Grand Finale" },
  ];

  const LEVEL_COUNT = LEVELS.length;

  /* Recursive backtracker => a perfect maze: every open tile reaches every other.
     Braiding only ever removes walls, so it cannot disconnect anything. */
  function generateMaze(cols, rows, braid, rng) {
    const tw = cols * 2 + 1;
    const th = rows * 2 + 1;
    const grid = [];
    for (let y = 0; y < th; y++) grid.push(new Array(tw).fill(1));

    const visited = [];
    for (let y = 0; y < rows; y++) visited.push(new Array(cols).fill(false));

    visited[0][0] = true;
    grid[1][1] = 0;
    const stack = [[0, 0]];

    while (stack.length) {
      const [cx, cy] = stack[stack.length - 1];
      const options = [];
      for (const [dx, dy] of DIRS) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx >= 0 && ny >= 0 && nx < cols && ny < rows && !visited[ny][nx]) {
          options.push([nx, ny, dx, dy]);
        }
      }
      if (!options.length) {
        stack.pop();
        continue;
      }
      const [nx, ny, dx, dy] = options[Math.floor(rng() * options.length)];
      visited[ny][nx] = true;
      grid[cy * 2 + 1 + dy][cx * 2 + 1 + dx] = 0; // knock out the shared wall
      grid[ny * 2 + 1][nx * 2 + 1] = 0;
      stack.push([nx, ny]);
    }

    if (braid > 0) {
      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const tx = cx * 2 + 1;
          const ty = cy * 2 + 1;
          let open = 0;
          const closed = [];
          for (const [dx, dy] of DIRS) {
            const wx = tx + dx;
            const wy = ty + dy;
            if (grid[wy][wx] === 0) open++;
            else if (wx > 0 && wy > 0 && wx < tw - 1 && wy < th - 1) closed.push([wx, wy]);
          }
          if (open <= 1 && closed.length && rng() < braid) {
            const [wx, wy] = closed[Math.floor(rng() * closed.length)];
            grid[wy][wx] = 0;
          }
        }
      }
    }

    return { grid, tw, th };
  }

  /** Breadth-first distances from `start` over floor tiles; -1 means unreachable. */
  function bfs(grid, tw, th, start) {
    const dist = [];
    for (let y = 0; y < th; y++) dist.push(new Array(tw).fill(-1));
    if (grid[start.y][start.x] !== 0) return dist;

    dist[start.y][start.x] = 0;
    const queue = [start];
    for (let i = 0; i < queue.length; i++) {
      const cur = queue[i];
      for (const [dx, dy] of DIRS) {
        const nx = cur.x + dx;
        const ny = cur.y + dy;
        if (nx < 0 || ny < 0 || nx >= tw || ny >= th) continue;
        if (grid[ny][nx] !== 0 || dist[ny][nx] !== -1) continue;
        dist[ny][nx] = dist[cur.y][cur.x] + 1;
        queue.push({ x: nx, y: ny });
      }
    }
    return dist;
  }

  /* Prefer far-away dead ends (fun to hunt) and spread targets out. Only ever
     picks tiles the BFS already proved reachable, so placement can't wall one off. */
  function placeTargets(grid, tw, th, start, count, rng) {
    const dist = bfs(grid, tw, th, start);
    const candidates = [];

    for (let y = 0; y < th; y++) {
      for (let x = 0; x < tw; x++) {
        if (grid[y][x] !== 0) continue;
        if (x === start.x && y === start.y) continue;
        if (dist[y][x] < 0) continue;
        let open = 0;
        for (const [dx, dy] of DIRS) {
          if (grid[y + dy] && grid[y + dy][x + dx] === 0) open++;
        }
        candidates.push({ x, y, score: dist[y][x] + (open <= 1 ? 20 : 0) + rng() * 9 });
      }
    }
    candidates.sort((a, b) => b.score - a.score);

    const chosen = [];
    const taken = new Set();
    const startSep = Math.max(2, Math.floor(Math.min(tw, th) / 2));

    for (let sep = startSep; sep >= 0 && chosen.length < count; sep--) {
      for (const c of candidates) {
        if (chosen.length >= count) break;
        const key = c.x + "," + c.y;
        if (taken.has(key)) continue;
        const farEnough = chosen.every((o) => Math.abs(o.x - c.x) + Math.abs(o.y - c.y) >= sep);
        if (!farEnough) continue;
        taken.add(key);
        chosen.push({ x: c.x, y: c.y });
      }
    }

    return chosen.slice(0, count);
  }

  /** Every target must sit on a floor tile the player can actually walk to. */
  function validateLevel(level) {
    const errors = [];
    const { grid, tw, th, start, targets } = level;

    if (grid[start.y][start.x] !== 0) errors.push("player start is inside a wall");

    const dist = bfs(grid, tw, th, start);
    const seen = new Set();

    targets.forEach((t, i) => {
      const key = t.x + "," + t.y;
      if (grid[t.y][t.x] !== 0) errors.push(`target ${i + 1} at (${t.x},${t.y}) is inside a wall`);
      else if (dist[t.y][t.x] < 0) errors.push(`target ${i + 1} at (${t.x},${t.y}) is unreachable`);
      if (t.x === start.x && t.y === start.y) errors.push(`target ${i + 1} sits on the player start`);
      if (seen.has(key)) errors.push(`two targets share tile (${t.x},${t.y})`);
      seen.add(key);
    });

    if (typeof level.wantTargets === "number" && targets.length !== level.wantTargets) {
      errors.push(`expected ${level.wantTargets} targets, placed ${targets.length}`);
    }

    const reachable = targets.filter((t) => grid[t.y][t.x] === 0 && dist[t.y][t.x] >= 0);
    const longest = reachable.reduce((m, t) => Math.max(m, dist[t.y][t.x]), 0);

    return { ok: errors.length === 0, errors, dist, longest };
  }

  /* Warp tunnels: open the border on a few interior rows so the two openings on
     opposite sides link up (walk off one edge, appear on the other). Only ever
     removes wall, so it can't disconnect anything. Returns a tile->partner map. */
  function addTunnels(grid, tw, th, rows, count, rng) {
    const tunnels = {};
    const used = new Set();
    let added = 0;
    for (let tries = 0; added < count && tries < 60; tries++) {
      const cy = Math.floor(rng() * rows);
      const Y = cy * 2 + 1;
      if (used.has(Y)) continue;
      used.add(Y);
      grid[Y][0] = 0;
      grid[Y][tw - 1] = 0;
      tunnels["0," + Y] = { x: tw - 1, y: Y };
      tunnels[tw - 1 + "," + Y] = { x: 0, y: Y };
      added++;
    }
    return tunnels;
  }

  /** Build level `number` (1-based). Retries with a fresh seed if validation ever fails. */
  function generateLevel(number, attempt) {
    attempt = attempt || 0;
    const cfg = LEVELS[number - 1];
    if (!cfg) throw new Error("No such level: " + number);

    const rng = mulberry32(number * 9176 + attempt * 7919 + 1013);
    const { grid, tw, th } = generateMaze(cfg.cols, cfg.rows, cfg.braid, rng);
    const start = { x: 1, y: 1 };
    const targets = placeTargets(grid, tw, th, start, cfg.targets, rng);
    const tunnels = cfg.tunnels ? addTunnels(grid, tw, th, cfg.rows, cfg.tunnels, rng) : null;

    const level = {
      tunnels,
      number,
      name: cfg.name,
      grid,
      tw,
      th,
      cols: cfg.cols,
      rows: cfg.rows,
      start,
      targets,
      wantTargets: cfg.targets,
      attempt,
    };

    const report = validateLevel(level);
    if (!report.ok) {
      if (attempt < 40) return generateLevel(number, attempt + 1);
      throw new Error(`Level ${number} failed validation: ${report.errors.join("; ")}`);
    }
    level.longest = report.longest;
    return level;
  }

  return {
    LEVELS,
    LEVEL_COUNT,
    DIRS,
    mulberry32,
    generateMaze,
    generateLevel,
    validateLevel,
    bfs,
    placeTargets,
  };
})();

if (typeof module !== "undefined" && module.exports) module.exports = MazeKit;
