#!/usr/bin/env node
/* Proves every level is completable: BFS from the player start must reach
   every target. Run: node tools/validate-levels.js [--print N]
   Exits non-zero if any level fails. */

const path = require("path");
const MazeKit = require(path.join(__dirname, "..", "js", "maze.js"));

const args = process.argv.slice(2);
const printIndex = args.includes("--print") ? Number(args[args.indexOf("--print") + 1]) : null;
const STRESS_SEEDS = 40;

function render(level) {
  const targets = new Set(level.targets.map((t) => t.x + "," + t.y));
  const lines = [];
  for (let y = 0; y < level.th; y++) {
    let line = "";
    for (let x = 0; x < level.tw; x++) {
      if (x === level.start.x && y === level.start.y) line += "P ";
      else if (targets.has(x + "," + y)) line += "* ";
      else line += level.grid[y][x] === 1 ? "##" : "  ";
    }
    lines.push(line);
  }
  return lines.join("\n");
}

let failures = 0;
const rows = [];

for (let n = 1; n <= MazeKit.LEVEL_COUNT; n++) {
  const level = MazeKit.generateLevel(n);
  const report = MazeKit.validateLevel(level);

  let floors = 0;
  for (let y = 0; y < level.th; y++) {
    for (let x = 0; x < level.tw; x++) if (level.grid[y][x] === 0) floors++;
  }
  let reached = 0;
  for (let y = 0; y < level.th; y++) {
    for (let x = 0; x < level.tw; x++) if (report.dist[y][x] >= 0) reached++;
  }

  // A perfect maze plus braiding should leave the whole floor walkable.
  const orphanFloors = floors - reached;
  const ok = report.ok && orphanFloors === 0;
  if (!ok) {
    failures++;
    console.error(`FAIL  Level ${n} (${level.name})`);
    report.errors.forEach((e) => console.error(`        - ${e}`));
    if (orphanFloors > 0) console.error(`        - ${orphanFloors} floor tiles are walled off from the start`);
  }

  rows.push({
    n,
    name: level.name,
    size: `${level.tw}x${level.th}`,
    targets: level.targets.length,
    want: level.wantTargets,
    walk: reached,
    farthest: report.longest,
    retries: level.attempt,
    ok,
  });

  if (printIndex === n) {
    console.log(`\nLevel ${n} — ${level.name}\n${render(level)}\n`);
  }
}

console.log("  #  Level                  Size    Targets  Walkable  Farthest  Seed retries  Status");
console.log("  -  ---------------------  ------  -------  --------  --------  ------------  ------");
for (const r of rows) {
  console.log(
    "  " +
      String(r.n).padStart(2) +
      "  " +
      r.name.padEnd(21) +
      "  " +
      r.size.padEnd(6) +
      "  " +
      String(`${r.targets}/${r.want}`).padEnd(7) +
      "  " +
      String(r.walk).padEnd(8) +
      "  " +
      String(r.farthest).padEnd(8) +
      "  " +
      String(r.retries).padEnd(12) +
      "  " +
      (r.ok ? "PASS" : "FAIL")
  );
}

// Stress sweep: the same generator with many other seeds must also stay solvable.
let stressFail = 0;
for (let n = 1; n <= MazeKit.LEVEL_COUNT; n++) {
  const cfg = MazeKit.LEVELS[n - 1];
  for (let s = 0; s < STRESS_SEEDS; s++) {
    const rng = MazeKit.mulberry32(n * 104729 + s * 7907 + 17);
    const { grid, tw, th } = MazeKit.generateMaze(cfg.cols, cfg.rows, cfg.braid, rng);
    const start = { x: 1, y: 1 };
    const targets = MazeKit.placeTargets(grid, tw, th, start, cfg.targets, rng);
    const report = MazeKit.validateLevel({ grid, tw, th, start, targets, wantTargets: cfg.targets });
    if (!report.ok) {
      stressFail++;
      console.error(`STRESS FAIL level ${n} seed ${s}: ${report.errors.join("; ")}`);
    }
  }
}

console.log(
  `\nStress sweep: ${MazeKit.LEVEL_COUNT * STRESS_SEEDS} generated mazes, ${stressFail} unsolvable.`
);

if (failures || stressFail) {
  console.error(`\n${failures} level(s) and ${stressFail} stress case(s) FAILED.`);
  process.exit(1);
}
console.log(`All ${MazeKit.LEVEL_COUNT} levels are playable: every target is reachable from the start.`);
