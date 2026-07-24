/* Hand-drawn original SVG sprites, shipped as a template string so the game
   works when index.html is opened directly from disk (file://). */

const Sprites = (function () {
  // Shared inner markup (defs + every symbol), reused by the injected sheet and
  // by standalone() so a single <img> can resolve <use> for 3D textures.
  const INNER = `
  <defs>
    <mask id="mask-chomp">
      <rect x="-10" y="-10" width="120" height="120" fill="#fff"/>
      <polygon class="chomp-mouth" points="50,50 118,8 118,92" fill="#000"/>
    </mask>
  </defs>

  <!-- ============ CHOMPER ============ -->
  <symbol id="sp-chomper" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="42" fill="#ffd93d" stroke="#e8a800" stroke-width="4" mask="url(#mask-chomp)"/>
    <circle cx="55" cy="27" r="6" fill="#4a3800"/>
    <circle cx="57" cy="25" r="2" fill="#fff8dc"/>
  </symbol>

  <symbol id="sp-dot" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="32" fill="#ffe9a8" opacity=".3"/>
    <circle cx="50" cy="50" r="20" fill="#fff3c4"/>
    <circle cx="50" cy="50" r="13" fill="#ffd93d"/>
    <circle cx="44" cy="43" r="4" fill="#fffdf0"/>
  </symbol>

  <!-- ============ HERO ============ -->
  <symbol id="sp-hero" viewBox="0 0 100 100">
    <path d="M24,98 v-12 a26,24 0 0 1 52,0 v12 z" fill="#3f7fd8"/>
    <path d="M38,76 v22 M62,76 v22" stroke="#2f63ae" stroke-width="5" stroke-linecap="round"/>
    <circle cx="50" cy="76" r="4" fill="#ffd93d"/>
    <circle cx="22" cy="56" r="7" fill="#f7c9a0"/>
    <circle cx="78" cy="56" r="7" fill="#f7c9a0"/>
    <circle cx="50" cy="52" r="27" fill="#f7c9a0"/>
    <path d="M23,44 a27,27 0 0 1 54,0 z" fill="#e23b3b"/>
    <ellipse cx="41" cy="45" rx="29" ry="8" fill="#c62828"/>
    <circle cx="50" cy="28" r="10" fill="#fff"/>
    <circle cx="50" cy="28" r="4" fill="#e23b3b"/>
    <circle cx="41" cy="54" r="3.4" fill="#33291f"/>
    <circle cx="59" cy="54" r="3.4" fill="#33291f"/>
    <circle cx="50" cy="62" r="6.5" fill="#eeae86"/>
    <path d="M32,68 q9,-7 18,-1 q9,-6 18,1 q-7,9 -18,6 q-11,3 -18,-6 z" fill="#5b3a1e"/>
  </symbol>

  <symbol id="sp-mushroom" viewBox="0 0 100 100">
    <rect x="33" y="54" width="34" height="38" rx="13" fill="#ffeccf" stroke="#dfb083" stroke-width="3"/>
    <circle cx="42" cy="72" r="3.2" fill="#43331f"/>
    <circle cx="58" cy="72" r="3.2" fill="#43331f"/>
    <path d="M10,58 a40,34 0 0 1 80,0 z" fill="#e23b3b" stroke="#ab2626" stroke-width="3"/>
    <circle cx="29" cy="43" r="9" fill="#fff"/>
    <circle cx="69" cy="41" r="11" fill="#fff"/>
    <circle cx="49" cy="26" r="7" fill="#fff"/>
  </symbol>

  <!-- ============ ICE PRINCESS ============ -->
  <symbol id="sp-princess" viewBox="0 0 100 100">
    <path d="M50,58 L24,98 h52 z" fill="#8fd8f2" stroke="#57b2da" stroke-width="3"/>
    <path d="M50,72 l4,8 l-4,8 l-4,-8 z" fill="#eaf9ff"/>
    <path d="M66,44 q16,18 9,44" stroke="#f2d18b" stroke-width="11" fill="none" stroke-linecap="round"/>
    <circle cx="50" cy="42" r="23" fill="#fbd9bd"/>
    <path d="M27,42 q0,-25 23,-25 q23,0 23,25 q-7,-13 -23,-13 q-16,0 -23,13 z" fill="#f2d18b"/>
    <circle cx="42" cy="43" r="3.2" fill="#3c3a5e"/>
    <circle cx="58" cy="43" r="3.2" fill="#3c3a5e"/>
    <path d="M44,52 q6,6 12,0" stroke="#cf7a7a" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M37,20 l3,-12 l10,8 l10,-8 l3,12 z" fill="#d6f2ff" stroke="#7fc9e8" stroke-width="2.4" stroke-linejoin="round"/>
  </symbol>

  <symbol id="sp-snowflake" viewBox="0 0 100 100">
    <g stroke="#6fc3e8" stroke-width="8" stroke-linecap="round">
      <line x1="50" y1="12" x2="50" y2="88"/>
      <line x1="17" y1="31" x2="83" y2="69"/>
      <line x1="17" y1="69" x2="83" y2="31"/>
    </g>
    <g stroke="#4aa8d4" stroke-width="5" stroke-linecap="round">
      <line x1="50" y1="24" x2="39" y2="15"/><line x1="50" y1="24" x2="61" y2="15"/>
      <line x1="50" y1="76" x2="39" y2="85"/><line x1="50" y1="76" x2="61" y2="85"/>
      <line x1="26" y1="36" x2="22" y2="24"/><line x1="74" y1="64" x2="78" y2="76"/>
      <line x1="26" y1="64" x2="22" y2="76"/><line x1="74" y1="36" x2="78" y2="24"/>
    </g>
    <circle cx="50" cy="50" r="8" fill="#eaf9ff" stroke="#4aa8d4" stroke-width="3"/>
  </symbol>

  <!-- ============ KITTY ============ -->
  <symbol id="sp-kitty" viewBox="0 0 100 100">
    <path d="M20,44 L23,14 L46,29 z" fill="#ffb877" stroke="#ec8f3f" stroke-width="3" stroke-linejoin="round"/>
    <path d="M80,44 L77,14 L54,29 z" fill="#ffb877" stroke="#ec8f3f" stroke-width="3" stroke-linejoin="round"/>
    <path d="M27,38 L29,22 L41,31 z" fill="#ffd7bb"/>
    <path d="M73,38 L71,22 L59,31 z" fill="#ffd7bb"/>
    <circle cx="50" cy="57" r="33" fill="#ffb877" stroke="#ec8f3f" stroke-width="3"/>
    <ellipse cx="38" cy="53" rx="6.5" ry="7.5" fill="#fff"/>
    <ellipse cx="62" cy="53" rx="6.5" ry="7.5" fill="#fff"/>
    <circle cx="38" cy="54" r="3.6" fill="#3b2a1c"/>
    <circle cx="62" cy="54" r="3.6" fill="#3b2a1c"/>
    <path d="M44,68 l6,5 l6,-5 z" fill="#f0768c"/>
    <path d="M50,73 q-5,7 -11,3 M50,73 q5,7 11,3" stroke="#8a5a33" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <g stroke="#8a5a33" stroke-width="2.4" stroke-linecap="round">
      <line x1="16" y1="60" x2="32" y2="63"/><line x1="16" y1="70" x2="32" y2="69"/>
      <line x1="84" y1="60" x2="68" y2="63"/><line x1="84" y1="70" x2="68" y2="69"/>
    </g>
  </symbol>

  <symbol id="sp-fish" viewBox="0 0 100 100">
    <path d="M74,50 L96,32 v36 z" fill="#ff9f68" stroke="#e87a3c" stroke-width="3" stroke-linejoin="round"/>
    <ellipse cx="46" cy="50" rx="36" ry="23" fill="#ffc48c" stroke="#e87a3c" stroke-width="3"/>
    <path d="M44,29 q10,-11 20,-3" fill="none" stroke="#e87a3c" stroke-width="3" stroke-linecap="round"/>
    <path d="M52,62 q10,10 18,4" fill="none" stroke="#e87a3c" stroke-width="3" stroke-linecap="round"/>
    <circle cx="27" cy="44" r="6.5" fill="#fff"/>
    <circle cx="26" cy="44" r="3.4" fill="#3b2a1c"/>
    <path d="M18,54 q6,4 12,1" stroke="#e87a3c" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  </symbol>

  <!-- ============ BLUE PUP (blue heeler) ============ -->
  <symbol id="sp-puppy" viewBox="0 0 100 100">
    <!-- upright ears (dark blue) -->
    <path d="M25,38 L17,10 L47,28 z" fill="#3c5c96" stroke="#30507f" stroke-width="3" stroke-linejoin="round"/>
    <path d="M75,38 L83,10 L53,28 z" fill="#3c5c96" stroke="#30507f" stroke-width="3" stroke-linejoin="round"/>
    <path d="M29,32 L25,18 L41,28 z" fill="#7f9fce"/>
    <path d="M71,32 L75,18 L59,28 z" fill="#7f9fce"/>
    <!-- square head base (light blue-grey) -->
    <rect x="18" y="24" width="64" height="60" rx="20" fill="#8fb3dc" stroke="#5f86ba" stroke-width="3"/>
    <!-- darker cap over the top of the head, scalloped lower edge -->
    <path d="M18,46 A20,20 0 0 1 38,24 L62,24 A20,20 0 0 1 82,46
             C74,43 68,45 63,50
             C58,42 54,44 50,50
             C46,44 42,42 37,50
             C32,45 26,43 18,46 Z" fill="#42639f"/>
    <!-- lighter blaze up the middle of the face -->
    <path d="M50,38 q6,12 4,24 q-4,4 -8,0 q-2,-12 4,-24 z" fill="#c2d6ee"/>
    <!-- tan heeler cheek dabs -->
    <ellipse cx="27" cy="62" rx="8" ry="8" fill="#d6a869" opacity="0.6"/>
    <ellipse cx="73" cy="62" rx="8" ry="8" fill="#d6a869" opacity="0.6"/>
    <!-- squarish cream muzzle -->
    <rect x="31" y="60" width="38" height="26" rx="12" fill="#efe4cf"/>
    <!-- eyes -->
    <circle cx="38" cy="53" r="6.6" fill="#fff"/>
    <circle cx="62" cy="53" r="6.6" fill="#fff"/>
    <circle cx="38.6" cy="54" r="3.9" fill="#2a2320"/>
    <circle cx="62.6" cy="54" r="3.9" fill="#2a2320"/>
    <circle cx="40" cy="52.5" r="1.6" fill="#fff"/>
    <circle cx="64" cy="52.5" r="1.6" fill="#fff"/>
    <!-- square-ish nose + mouth + tongue -->
    <rect x="42" y="62" width="16" height="11" rx="5" fill="#2a2320"/>
    <path d="M50,73 v5 M50,78 q-7,6 -13,1 M50,78 q7,6 13,1" stroke="#6b5030" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M44,82 q6,9 12,0 q-6,4 -12,0 z" fill="#f0768c"/>
  </symbol>

  <symbol id="sp-bone" viewBox="0 0 100 100">
    <g fill="#fffaf0" stroke="#d9c3a5" stroke-width="3.5">
      <circle cx="22" cy="36" r="14"/><circle cx="22" cy="60" r="14"/>
      <circle cx="78" cy="36" r="14"/><circle cx="78" cy="60" r="14"/>
      <rect x="20" y="38" width="60" height="20" rx="8"/>
    </g>
    <rect x="24" y="41" width="52" height="6" rx="3" fill="#fff" opacity=".85"/>
  </symbol>

  <!-- ============ ROCKET ============ -->
  <symbol id="sp-rocket" viewBox="0 0 100 100">
    <path class="rocket-flame" d="M50,96 q-11,-12 -8,-22 h16 q3,10 -8,22 z" fill="#ff9f1c"/>
    <path class="rocket-flame" d="M50,88 q-6,-7 -4,-14 h8 q2,7 -4,14 z" fill="#ffd93d"/>
    <path d="M30,74 q-8,-6 -8,-18 l12,6 z" fill="#e2445c"/>
    <path d="M70,74 q8,-6 8,-18 l-12,6 z" fill="#e2445c"/>
    <path d="M50,6 q19,17 19,42 v22 h-38 v-22 q0,-25 19,-42 z" fill="#f4f7ff" stroke="#c2ccdf" stroke-width="3"/>
    <path d="M50,6 q19,17 19,42 h-19 z" fill="#dfe6f5"/>
    <circle cx="50" cy="44" r="11" fill="#7ad0f5" stroke="#3f9fd0" stroke-width="3.5"/>
    <path d="M44,39 q5,-4 10,-1" stroke="#eafaff" stroke-width="3" fill="none" stroke-linecap="round"/>
    <rect x="31" y="64" width="38" height="8" rx="4" fill="#e2445c"/>
  </symbol>

  <symbol id="sp-star" viewBox="0 0 100 100">
    <path d="M50,8 L62,38 L95,41 L70,62 L78,94 L50,76 L22,94 L30,62 L5,41 L38,38 z"
          fill="#ffd93d" stroke="#e8a800" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="40" cy="42" r="5" fill="#fff6cf"/>
  </symbol>

  <!-- ============ UI ICONS ============ -->
  <symbol id="ic-sound-on" viewBox="0 0 100 100">
    <path d="M20,38 h16 L56,20 v60 L36,62 h-16 z" fill="currentColor"/>
    <path d="M66,34 q12,16 0,32 M78,24 q20,26 0,52" stroke="currentColor" stroke-width="7" fill="none" stroke-linecap="round"/>
  </symbol>
  <symbol id="ic-sound-off" viewBox="0 0 100 100">
    <path d="M20,38 h16 L56,20 v60 L36,62 h-16 z" fill="currentColor"/>
    <path d="M68,36 L92,64 M92,36 L68,64" stroke="currentColor" stroke-width="8" fill="none" stroke-linecap="round"/>
  </symbol>
  <symbol id="ic-restart" viewBox="0 0 100 100">
    <path d="M50,18 a32,32 0 1 0 32,32" stroke="currentColor" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M50,4 L50,32 L28,18 z" fill="currentColor"/>
  </symbol>
  <symbol id="ic-home" viewBox="0 0 100 100">
    <path d="M50,12 L92,50 h-12 v36 h-60 v-36 h-12 z" fill="currentColor"/>
  </symbol>
  <symbol id="ic-lock" viewBox="0 0 100 100">
    <rect x="24" y="44" width="52" height="44" rx="10" fill="currentColor"/>
    <path d="M34,44 v-12 a16,16 0 0 1 32,0 v12" stroke="currentColor" stroke-width="9" fill="none" stroke-linecap="round"/>
  </symbol>
  <symbol id="ic-pad" viewBox="0 0 100 100">
    <rect x="6" y="30" width="88" height="44" rx="20" fill="currentColor"/>
    <rect x="20" y="44" width="20" height="6" rx="3" fill="#fff"/>
    <rect x="27" y="37" width="6" height="20" rx="3" fill="#fff"/>
    <circle cx="66" cy="44" r="5" fill="#fff"/><circle cx="78" cy="54" r="5" fill="#fff"/>
  </symbol>`;

  const SHEET =
    `<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" focusable="false">` +
    INNER +
    `</svg>`;

  function inject(hostId) {
    const host = document.getElementById(hostId || "sprite-host");
    if (host) host.innerHTML = SHEET;
  }

  /** Markup for one sprite; `cls` lands on the <svg> so themes can animate it. */
  function svg(id, cls) {
    return `<svg class="sprite ${cls || ""}" viewBox="0 0 100 100" aria-hidden="true"><use href="#${id}"/></svg>`;
  }

  /* A self-contained SVG for one symbol: all defs + symbols inlined plus a <use>,
     so a single <img> (e.g. a 3D CanvasTexture source) resolves it with no sheet.
     Includes xlink:href alongside href for the widest <img> raster support.
     `orient` is an optional SVG transform (rotate/mirror) baked into the image,
     so 3D can face a direction by swapping textures instead of scaling sprites. */
  function standalone(id, px, orient) {
    const s = px || 128;
    const use = `<use href="#${id}" xlink:href="#${id}"/>`;
    const body = orient ? `<g transform="${orient}">${use}</g>` : use;
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ` +
      `viewBox="0 0 100 100" width="${s}" height="${s}">` +
      INNER +
      body +
      `</svg>`
    );
  }

  /* A standalone chomper at a given mouth openness (half-angle in degrees).
     3D can't run the CSS mouth animation on a rasterized texture, so the 3D
     renderer cycles a few of these frames instead. Mouth opens to the right;
     the renderer rotates/mirrors the sprite to face the travel direction. */
  function chomperFrame(openDeg, px, orient) {
    const s = px || 128;
    const r = 42;
    const a = (openDeg * Math.PI) / 180;
    const lx = (50 + r * Math.cos(a)).toFixed(2);
    const ly = (50 + r * Math.sin(a)).toFixed(2);
    const ux = (50 + r * Math.cos(-a)).toFixed(2);
    const uy = (50 + r * Math.sin(-a)).toFixed(2);
    const path = `M50,50 L${lx},${ly} A${r},${r} 0 1 1 ${ux},${uy} Z`;
    const body =
      `<path d="${path}" fill="#ffd93d" stroke="#e8a800" stroke-width="4" stroke-linejoin="round"/>` +
      `<circle cx="55" cy="27" r="6" fill="#4a3800"/>` +
      `<circle cx="57" cy="25" r="2" fill="#fff8dc"/>`;
    const g = orient ? `<g transform="${orient}">${body}</g>` : body;
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${s}" height="${s}">` +
      g +
      `</svg>`
    );
  }

  return { inject, svg, standalone, chomperFrame, SHEET };
})();

if (typeof module !== "undefined" && module.exports) module.exports = Sprites;
