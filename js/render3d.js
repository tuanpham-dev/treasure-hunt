/* Renderer3D — a tilted-overhead 3D board (Three.js r149, vendored).
   Same interface as Renderer2D; game.js drives it identically. Reuses the
   existing theme SVGs as billboarded sprites, so no new art is needed. */

const Renderer3D = (function () {
  const WALL_H = 0.9;
  const PLAYER_Y = 0.72;
  const PLAYER_SIZE = 1.25;
  const TARGET_Y = 0.5;
  const TARGET_SIZE = 0.82;
  const TILT_DEG = 55;

  let three = null; // WebGLRenderer
  let canvas = null;
  let scene, camera, sun, sunTarget, boardGroup;
  let running = false;
  let mounted = false;

  let colors = null; // theme palette
  let theme3 = null; // full theme (for facing + chomp config)
  let level = null;

  let player = null; // { sprite, blob, from, to, moveStart, moveMs, facing, size, bumpDir, bumpStart }
  let targets = []; // { sprite, halo, x, y, baseY, phase, eaten, eatenStart }
  let doorMesh = null;
  let keySprite = null;

  const texCache = new Map();

  /* ---- helpers ---- */

  function col(hex) {
    return new THREE.Color(hex).convertSRGBToLinear();
  }

  function cellToWorld(x, y) {
    return new THREE.Vector3(x - (level.tw - 1) / 2, 0, y - (level.th - 1) / 2);
  }

  /* Rasterize any SVG string into a cached CanvasTexture. */
  function svgTexture(cacheKey, svg) {
    if (texCache.has(cacheKey)) return texCache.get(cacheKey);
    const size = 256;
    const cvs = document.createElement("canvas");
    cvs.width = cvs.height = size;
    const tex = new THREE.CanvasTexture(cvs);
    tex.encoding = THREE.sRGBEncoding;
    const img = new Image();
    img.onload = () => {
      const ctx = cvs.getContext("2d");
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      tex.needsUpdate = true;
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    texCache.set(cacheKey, tex);
    return tex;
  }

  function spriteTexture(id, orient) {
    const o = orient || "";
    return svgTexture("sp:" + id + ":" + o, Sprites.standalone(id, 256, o || undefined));
  }

  function chompTexture(deg, orient) {
    const o = orient || "";
    return svgTexture("chomp:" + deg + ":" + o, Sprites.chomperFrame(deg, 256, o || undefined));
  }

  /* SVG transform that faces the sprite art per faceTransform(). 3D bakes the
     orientation into the texture rather than scaling the billboard. */
  function orientStr(f) {
    if (!f) return "";
    if (f.mirror) return "translate(100,0) scale(-1,1)";
    if (f.rot) return "rotate(" + f.rot + " 50 50)";
    return "";
  }

  function makeSprite(id, size) {
    const mat = new THREE.SpriteMaterial({ map: spriteTexture(id), transparent: true, depthWrite: false });
    const sp = new THREE.Sprite(mat);
    sp.scale.set(size, size, size);
    return sp;
  }

  /* ---- interface ---- */

  function mount(host) {
    if (mounted) return true;
    if (!three) {
      try {
        three = new THREE.WebGLRenderer({ antialias: true });
        if (!three || !three.getContext()) return false;
      } catch (e) {
        return false;
      }
      three.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      three.outputEncoding = THREE.sRGBEncoding;
      three.shadowMap.enabled = true;
      three.shadowMap.type = THREE.PCFSoftShadowMap;
      canvas = three.domElement;
      canvas.className = "board3d";

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, 1, 0.1, 300);

      scene.add(new THREE.AmbientLight(0xffffff, 0.78));
      sun = new THREE.DirectionalLight(0xffffff, 0.95);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      sun.shadow.bias = -0.0005;
      sunTarget = new THREE.Object3D();
      scene.add(sun, sunTarget);
      sun.target = sunTarget;

      boardGroup = new THREE.Group();
      scene.add(boardGroup);
    }
    host.appendChild(canvas);
    mounted = true;
    running = true;
    animate();
    resize();
    return true;
  }

  function unmount() {
    running = false;
    mounted = false;
    if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
  }

  function applyTheme(theme) {
    colors = theme.colors;
    theme3 = theme;
    if (scene) scene.background = col(colors.bg);
  }

  function clearBoard() {
    if (!boardGroup) return;
    boardGroup.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material && !(o.material instanceof THREE.SpriteMaterial)) o.material.dispose();
    });
    boardGroup.clear();
    targets = [];
    player = null;
    doorMesh = null;
    keySprite = null;
  }

  function openDoor() {
    if (doorMesh) {
      boardGroup.remove(doorMesh);
      doorMesh.geometry.dispose();
      doorMesh.material.dispose();
      doorMesh = null;
    }
    if (keySprite) {
      boardGroup.remove(keySprite);
      keySprite.material.dispose();
      keySprite = null;
    }
  }

  function buildLevel(lvl, theme) {
    level = lvl;
    colors = theme.colors;
    theme3 = theme;
    if (scene) scene.background = col(colors.bg);
    clearBoard();

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(level.tw, level.th),
      new THREE.MeshLambertMaterial({ color: col(colors.floor) })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    boardGroup.add(floor);

    // Walls as one instanced mesh
    const wallCells = [];
    for (let y = 0; y < level.th; y++) {
      for (let x = 0; x < level.tw; x++) {
        if (level.grid[y][x] === 1) wallCells.push([x, y]);
      }
    }
    const wallMesh = new THREE.InstancedMesh(
      new THREE.BoxGeometry(1, WALL_H, 1),
      new THREE.MeshLambertMaterial({ color: col(colors.wall) }),
      wallCells.length
    );
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    const m = new THREE.Matrix4();
    wallCells.forEach(([x, y], i) => {
      const w = cellToWorld(x, y);
      m.makeTranslation(w.x, WALL_H / 2, w.z);
      wallMesh.setMatrixAt(i, m);
    });
    wallMesh.instanceMatrix.needsUpdate = true;
    boardGroup.add(wallMesh);

    // Locked door: a distinct wooden block that gets removed when the key is grabbed
    doorMesh = null;
    if (level.door) {
      const dw = cellToWorld(level.door.x, level.door.y);
      doorMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1, WALL_H, 1),
        new THREE.MeshLambertMaterial({ color: col("#a86a3c") })
      );
      doorMesh.position.set(dw.x, WALL_H / 2, dw.z);
      doorMesh.castShadow = true;
      doorMesh.receiveShadow = true;
      boardGroup.add(doorMesh);
      const lock = new THREE.Mesh(
        new THREE.CircleGeometry(0.16, 16),
        new THREE.MeshBasicMaterial({ color: col("#ffcf3d") })
      );
      lock.position.set(dw.x, WALL_H / 2 + 0.05, dw.z + 0.51);
      doorMesh.add(lock);
    }

    // Ice: pale-blue plates laid on the floor
    const iceCells = [];
    for (let y = 0; y < level.th; y++) {
      for (let x = 0; x < level.tw; x++) {
        if (level.grid[y][x] === 3) iceCells.push([x, y]);
      }
    }
    if (iceCells.length) {
      const iceMesh = new THREE.InstancedMesh(
        new THREE.BoxGeometry(1, 0.06, 1),
        new THREE.MeshLambertMaterial({ color: col("#c2ecff") }),
        iceCells.length
      );
      iceMesh.receiveShadow = true;
      const im = new THREE.Matrix4();
      iceCells.forEach(([x, y], i) => {
        const w = cellToWorld(x, y);
        im.makeTranslation(w.x, 0.03, w.z);
        iceMesh.setMatrixAt(i, im);
      });
      iceMesh.instanceMatrix.needsUpdate = true;
      boardGroup.add(iceMesh);
    }

    // Boost pads: a bright accent disc with a white centre on the floor
    const boostCells = [];
    for (let y = 0; y < level.th; y++)
      for (let x = 0; x < level.tw; x++) if (level.grid[y][x] === 4) boostCells.push([x, y]);
    boostCells.forEach(([x, y]) => {
      const w = cellToWorld(x, y);
      const pad = new THREE.Mesh(
        new THREE.CircleGeometry(0.42, 24),
        new THREE.MeshBasicMaterial({ color: col(colors.accent) })
      );
      pad.rotation.x = -Math.PI / 2;
      pad.position.set(w.x, 0.05, w.z);
      boardGroup.add(pad);
      const dot = new THREE.Mesh(
        new THREE.CircleGeometry(0.16, 20),
        new THREE.MeshBasicMaterial({ color: col("#ffffff") })
      );
      dot.rotation.x = -Math.PI / 2;
      dot.position.set(w.x, 0.06, w.z);
      boardGroup.add(dot);
    });

    // Targets: billboarded sprite + a soft accent halo disc on the floor
    const haloMat = new THREE.MeshBasicMaterial({
      color: col(colors.accent),
      transparent: true,
      opacity: 0.28,
    });
    level.targets.forEach((t, i) => {
      const w = cellToWorld(t.x, t.y);
      const sprite = makeSprite(theme.target, TARGET_SIZE);
      sprite.position.set(w.x, TARGET_Y, w.z);
      boardGroup.add(sprite);

      const halo = new THREE.Mesh(new THREE.CircleGeometry(0.42, 24), haloMat.clone());
      halo.rotation.x = -Math.PI / 2;
      halo.position.set(w.x, 0.03, w.z);
      boardGroup.add(halo);

      targets.push({ sprite, halo, x: t.x, y: t.y, baseY: TARGET_Y, phase: i * 0.7, eaten: false, eatenStart: 0 });
    });

    // Player: billboarded sprite + a blob shadow disc
    const pw = cellToWorld(level.start.x, level.start.y);
    const pSize = PLAYER_SIZE * (theme.playerScale || 1);
    const sprite = makeSprite(theme.player, pSize);
    sprite.position.set(pw.x, PLAYER_Y, pw.z);
    boardGroup.add(sprite);
    const blob = new THREE.Mesh(
      new THREE.CircleGeometry(0.42, 24),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.22 })
    );
    blob.rotation.x = -Math.PI / 2;
    blob.position.set(pw.x, 0.04, pw.z);
    boardGroup.add(blob);

    // Key collectible
    keySprite = null;
    if (level.key) {
      const kw = cellToWorld(level.key.x, level.key.y);
      keySprite = makeSprite("sp-key", TARGET_SIZE);
      keySprite.position.set(kw.x, TARGET_Y, kw.z);
      boardGroup.add(keySprite);
    }

    player = {
      sprite,
      blob,
      from: sprite.position.clone(),
      to: sprite.position.clone(),
      moveStart: 0,
      moveMs: 1,
      size: pSize,
      bumpDir: null,
      bumpStart: 0,
      chomp: null,
      orient: "", // baked facing transform; "" = default (art's resting direction)
    };

    // Pre-warm the oriented textures this theme can show, so turning doesn't
    // wait on a texture rasterizing.
    ["right", "left", "up", "down"].forEach((d) => {
      const o = orientStr(Themes.faceTransform(d, theme));
      if (theme.chomp) [40, 26, 10, 26].forEach((deg) => chompTexture(deg, o));
      else spriteTexture(theme.player, o);
    });

    // Chomper can't run the CSS mouth animation on a static texture, so cycle a
    // few mouth-open frames instead (each baked at the current facing).
    if (theme.chomp) {
      player.chomp = { degs: [40, 26, 10, 26], idx: -1 };
      sprite.material.map = chompTexture(player.chomp.degs[0], player.orient);
      sprite.material.needsUpdate = true;
    }

    frameBoard();
  }

  function frameBoard() {
    if (!camera || !level) return;
    const fov = (camera.fov * Math.PI) / 180;
    const aspect = camera.aspect || 1;
    const halfW = level.tw / 2 + 0.8;
    const halfD = level.th / 2 + 0.8;
    const distV = halfD / Math.tan(fov / 2);
    const distH = halfW / (Math.tan(fov / 2) * aspect);
    const dist = Math.max(distV, distH) * 1.2 + WALL_H;

    const elev = (TILT_DEG * Math.PI) / 180;
    camera.position.set(0, Math.sin(elev) * dist, Math.cos(elev) * dist);
    camera.lookAt(0, 0, 0);

    // Shadow frustum sized to the board
    const r = Math.max(level.tw, level.th) * 0.7 + 2;
    sun.position.set(r * 0.55, r * 1.5, r * 0.7);
    sunTarget.position.set(0, 0, 0);
    const sc = sun.shadow.camera;
    sc.left = -r;
    sc.right = r;
    sc.top = r;
    sc.bottom = -r;
    sc.near = 0.5;
    sc.far = r * 4;
    sc.updateProjectionMatrix();
  }

  function movePlayer(x, y, facing, moveMs, teleport) {
    if (!player) return;
    const w = cellToWorld(x, y);
    const target = new THREE.Vector3(w.x, PLAYER_Y, w.z);
    if (teleport) {
      // warp tunnel: snap across instead of sliding the whole board
      player.from = target.clone();
      player.to = target;
      player.sprite.position.copy(target);
      player.blob.position.set(target.x, 0.04, target.z);
      player.moveStart = performance.now() - 1000;
    } else {
      player.from = player.sprite.position.clone();
      player.to = target;
      player.moveStart = performance.now();
      player.moveMs = Math.max(1, moveMs);
    }

    // Face the travel direction by swapping to a re-oriented texture (a mirror
    // or rotation baked into the image), which reads reliably on a billboard.
    // A null result (flip themes moving up/down) keeps the current image.
    const f = Themes.faceTransform(facing, theme3);
    if (f) {
      player.orient = orientStr(f);
      if (!player.chomp) {
        player.sprite.material.map = spriteTexture(theme3.player, player.orient);
        player.sprite.material.needsUpdate = true;
      }
    }
  }

  function bumpPlayer(dir) {
    if (!player) return;
    player.bumpDir = dir;
    player.bumpStart = performance.now();
  }

  function eatTarget(x, y) {
    const t = targets.find((o) => o.x === x && o.y === y && !o.eaten);
    if (!t) return;
    t.eaten = true;
    t.eatenStart = performance.now();
  }

  function popScore(x, y) {
    if (!camera || !canvas) return;
    const wrap = document.getElementById("board-wrap");
    const w = cellToWorld(x, y);
    w.y = TARGET_Y;
    const v = w.project(camera);
    const rect = canvas.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();
    const sx = (v.x * 0.5 + 0.5) * rect.width + rect.left - wrapRect.left;
    const sy = (-v.y * 0.5 + 0.5) * rect.height + rect.top - wrapRect.top;
    const el = document.createElement("div");
    el.className = "pop3d";
    el.textContent = "+1";
    el.style.left = sx + "px";
    el.style.top = sy + "px";
    wrap.appendChild(el);
    setTimeout(() => el.remove(), 800);
  }

  function resize() {
    if (!three || !mounted || !canvas.parentNode) return;
    // Measure the canvas's own CSS box (it fills the board area via width/height
    // 100%), so it honors the touch-D-pad padding on mobile. Keep the CSS size
    // (setSize's 3rd arg = false) and only update the drawing buffer.
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w <= 0 || h <= 0) return;
    three.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    frameBoard();
  }

  /* ---- animation loop ---- */

  function update() {
    const now = performance.now();

    if (player) {
      const t = Math.min(1, (now - player.moveStart) / player.moveMs);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // easeInOutQuad
      const p = player.from.clone().lerp(player.to, e);

      // wall bump: a brief nudge toward the wall and back
      if (player.bumpDir) {
        const bt = (now - player.bumpStart) / 180;
        if (bt >= 1) {
          player.bumpDir = null;
        } else {
          const push = Math.sin(bt * Math.PI) * 0.22;
          if (player.bumpDir === "left") p.x -= push;
          else if (player.bumpDir === "right") p.x += push;
          else if (player.bumpDir === "up") p.z -= push;
          else if (player.bumpDir === "down") p.z += push;
        }
      }
      player.sprite.position.copy(p);
      player.blob.position.set(p.x, 0.04, p.z);

      // chomp: cycle the mouth-open frames, baked at the current facing
      if (player.chomp) {
        const i = Math.floor(now / 130) % player.chomp.degs.length;
        const tex = chompTexture(player.chomp.degs[i], player.orient);
        if (player.sprite.material.map !== tex) {
          player.chomp.idx = i;
          player.sprite.material.map = tex;
          player.sprite.material.needsUpdate = true;
        }
      }
    }

    for (let i = targets.length - 1; i >= 0; i--) {
      const t = targets[i];
      if (t.eaten) {
        const et = Math.min(1, (now - t.eatenStart) / 320);
        const s = (1 - et) * TARGET_SIZE;
        t.sprite.scale.set(s, s, s);
        t.halo.material.opacity = 0.28 * (1 - et);
        if (et >= 1) {
          boardGroup.remove(t.sprite, t.halo);
          t.sprite.material.dispose();
          t.halo.geometry.dispose();
          t.halo.material.dispose();
          targets.splice(i, 1);
        }
      } else {
        t.sprite.position.y = t.baseY + Math.sin(now / 500 + t.phase) * 0.09;
      }
    }
  }

  function animate() {
    if (!running) return;
    requestAnimationFrame(animate);
    update();
    three.render(scene, camera);
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
