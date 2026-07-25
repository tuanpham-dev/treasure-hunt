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
    <path d="M20,44 L23,14 L46,30 z" fill="#fafafa" stroke="#dcdce4" stroke-width="3" stroke-linejoin="round"/>
    <path d="M80,44 L77,14 L54,30 z" fill="#fafafa" stroke="#dcdce4" stroke-width="3" stroke-linejoin="round"/>
    <path d="M28,38 L30,23 L42,31 z" fill="#ffd0dc"/>
    <path d="M72,38 L70,23 L58,31 z" fill="#ffd0dc"/>
    <circle cx="50" cy="57" r="33" fill="#fafafa" stroke="#dcdce4" stroke-width="3"/>
    <circle cx="30" cy="63" r="5" fill="#ffc2d4" opacity="0.75"/>
    <circle cx="70" cy="63" r="5" fill="#ffc2d4" opacity="0.75"/>
    <g stroke="#cfcfd8" stroke-width="2.4" stroke-linecap="round">
      <line x1="12" y1="57" x2="29" y2="60"/><line x1="12" y1="68" x2="29" y2="66"/>
      <line x1="88" y1="57" x2="71" y2="60"/><line x1="88" y1="68" x2="71" y2="66"/>
    </g>
    <ellipse cx="38" cy="56" rx="4.6" ry="6.8" fill="#3b2a2e"/>
    <ellipse cx="62" cy="56" rx="4.6" ry="6.8" fill="#3b2a2e"/>
    <circle cx="39.6" cy="53.6" r="1.6" fill="#fff"/>
    <circle cx="63.6" cy="53.6" r="1.6" fill="#fff"/>
    <path d="M46,64 l4,4 l4,-4 z" fill="#ff9fb8"/>
    <path d="M50,69 q-6,6 -11,1 M50,69 q6,6 11,1" stroke="#c98aa0" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M72,25 L60,18 Q55,25 60,32 L72,27 Z" fill="#ff5b8a" stroke="#e0436f" stroke-width="2" stroke-linejoin="round"/>
    <path d="M72,25 L84,18 Q89,25 84,32 L72,27 Z" fill="#ff5b8a" stroke="#e0436f" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="72" cy="26" r="4" fill="#ff86a8" stroke="#e0436f" stroke-width="2"/>
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
    <g class="fx" data-fx="flame">
      <path class="rocket-flame" d="M50,96 q-11,-12 -8,-22 h16 q3,10 -8,22 z" fill="#ff9f1c"/>
      <path class="rocket-flame" d="M50,88 q-6,-7 -4,-14 h8 q2,7 -4,14 z" fill="#ffd93d"/>
    </g>
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

  <!-- ============ SQUID (points up; turns all 4 ways) ============ -->
  <symbol id="sp-squid" viewBox="0 0 100 100">
    <!-- side fins near the pointed top -->
    <path d="M40,20 L25,23 L38,34 z" fill="#e05a8f"/>
    <path d="M60,20 L75,23 L62,34 z" fill="#e05a8f"/>
    <!-- mantle (teardrop body) -->
    <path d="M50,9 C63,16 69,32 67,49 C66,61 59,67 50,67 C41,67 34,61 33,49 C31,32 37,16 50,9 Z"
          fill="#ff7ea8" stroke="#e05a8f" stroke-width="3"/>
    <!-- tentacles -->
    <g class="fx" data-fx="sway" data-cx="50" data-cy="63" stroke="#ff7ea8" stroke-width="5" fill="none" stroke-linecap="round">
      <path d="M38,62 q-6,14 -9,28"/>
      <path d="M45,65 q-3,15 -5,27"/>
      <path d="M50,66 q0,16 0,28"/>
      <path d="M55,65 q3,15 5,27"/>
      <path d="M62,62 q6,14 9,28"/>
    </g>
    <!-- eyes -->
    <circle cx="42" cy="46" r="8" fill="#fff"/>
    <circle cx="58" cy="46" r="8" fill="#fff"/>
    <circle cx="42.5" cy="47" r="4.2" fill="#2a2320"/>
    <circle cx="58.5" cy="47" r="4.2" fill="#2a2320"/>
    <circle cx="44" cy="45.5" r="1.5" fill="#fff"/>
    <circle cx="60" cy="45.5" r="1.5" fill="#fff"/>
  </symbol>

  <symbol id="sp-bubble" viewBox="0 0 100 100">
    <circle cx="26" cy="30" r="9" fill="#cdeeff" stroke="#8fd0ef" stroke-width="3"/>
    <circle cx="74" cy="72" r="7" fill="#cdeeff" stroke="#8fd0ef" stroke-width="3"/>
    <circle cx="52" cy="54" r="27" fill="#cdeeff" stroke="#8fd0ef" stroke-width="4"/>
    <circle cx="43" cy="45" r="8" fill="#ffffff" opacity="0.85"/>
  </symbol>

  <!-- ============ OCTOPUS (flips left/right) ============ -->
  <symbol id="sp-octopus" viewBox="0 0 100 100">
    <!-- tentacles (behind the head) -->
    <g class="fx" data-fx="sway" data-cx="50" data-cy="60" fill="#b07de0" stroke="#8a5bc4" stroke-width="2.5" stroke-linejoin="round">
      <path d="M26,56 q-11,9 -8,25 q6,3 9,-2 q-4,-13 5,-19 z"/>
      <path d="M40,60 q-6,13 -9,25 q6,3 9,-2 q-2,-15 4,-21 z"/>
      <path d="M60,60 q6,13 9,25 q-6,3 -9,-2 q2,-15 -4,-21 z"/>
      <path d="M74,56 q11,9 8,25 q-6,3 -9,-2 q4,-13 -5,-19 z"/>
      <path d="M50,62 q-3,14 -3,25 q5,2 8,-2 q-1,-15 2,-21 z"/>
    </g>
    <!-- head -->
    <path d="M50,13 C71,13 82,30 82,47 C82,57 76,63 68,63 L32,63 C24,63 18,57 18,47 C18,30 29,13 50,13 Z"
          fill="#b07de0" stroke="#8a5bc4" stroke-width="3"/>
    <!-- eyes + smile -->
    <circle cx="40" cy="40" r="8.5" fill="#fff"/>
    <circle cx="60" cy="40" r="8.5" fill="#fff"/>
    <circle cx="41" cy="41" r="4.4" fill="#2a2320"/>
    <circle cx="61" cy="41" r="4.4" fill="#2a2320"/>
    <circle cx="42.6" cy="39.5" r="1.6" fill="#fff"/>
    <circle cx="62.6" cy="39.5" r="1.6" fill="#fff"/>
    <path d="M42,51 q8,7 16,0" stroke="#8a5bc4" stroke-width="3" fill="none" stroke-linecap="round"/>
  </symbol>

  <symbol id="sp-shell" viewBox="0 0 100 100">
    <path d="M50,22 C24,22 16,62 22,74 q6,-6 9,0 q5,-7 9,-1 q5,-8 10,-1 q5,-7 9,1 q3,-6 9,0
             C84,62 76,22 50,22 Z"
          fill="#ffcfe1" stroke="#e79bb8" stroke-width="3" stroke-linejoin="round"/>
    <g stroke="#e79bb8" stroke-width="2.6" fill="none" stroke-linecap="round">
      <path d="M50,30 L50,72"/>
      <path d="M50,30 L34,70"/>
      <path d="M50,30 L66,70"/>
      <path d="M50,30 L24,62"/>
      <path d="M50,30 L76,62"/>
    </g>
    <circle cx="50" cy="25" r="5" fill="#ffb8d4"/>
  </symbol>

  <!-- ============ GHOST ============ -->
  <symbol id="sp-ghost" viewBox="0 0 100 100">
    <g class="fx" data-fx="tail">
      <path d="M22,80 L22,52 A28,28 0 0 1 78,52 L78,80 q-7,8 -14,0 q-7,-8 -14,0 q-7,8 -14,0 q-7,-8 -14,0 Z"
            fill="#f4f7ff" stroke="#c8d2e8" stroke-width="3"/>
    </g>
    <ellipse cx="40" cy="50" rx="6" ry="8" fill="#3a3550"/>
    <ellipse cx="60" cy="50" rx="6" ry="8" fill="#3a3550"/>
    <ellipse cx="50" cy="66" rx="6" ry="7" fill="#3a3550"/>
    <circle cx="42" cy="47" r="1.8" fill="#fff"/>
    <circle cx="62" cy="47" r="1.8" fill="#fff"/>
    <ellipse cx="32" cy="60" rx="4.5" ry="3.5" fill="#ffb3c1" opacity="0.7"/>
    <ellipse cx="68" cy="60" rx="4.5" ry="3.5" fill="#ffb3c1" opacity="0.7"/>
  </symbol>

  <symbol id="sp-pumpkin" viewBox="0 0 100 100">
    <rect x="46" y="15" width="8" height="14" rx="3" fill="#6a8f3a"/>
    <path d="M53,18 q9,-9 15,-6 q-5,6 -14,10 z" fill="#7fa84a"/>
    <ellipse cx="50" cy="58" rx="33" ry="28" fill="#ff8f2e" stroke="#e6741a" stroke-width="3"/>
    <path d="M50,32 v52 M31,36 q-7,22 0,44 M69,36 q7,22 0,44"
          stroke="#e6741a" stroke-width="2.5" fill="none"/>
    <path d="M38,50 L48,50 L43,59 Z" fill="#5a2e00"/>
    <path d="M62,50 L52,50 L57,59 Z" fill="#5a2e00"/>
    <path d="M50,55 L45,62 L55,62 Z" fill="#5a2e00"/>
    <path d="M34,64 Q50,79 66,64 L61,64 L58,69 L54,64 L50,69 L46,64 L42,69 L39,64 Z" fill="#5a2e00"/>
  </symbol>

  <!-- ============ SPIDER ============ -->
  <symbol id="sp-spider" viewBox="0 0 100 100">
    <g stroke="#241f33" stroke-width="4" fill="none" stroke-linecap="round">
      <path d="M34,44 L14,34 L8,44"/>
      <path d="M32,52 L10,50 L6,60"/>
      <path d="M32,60 L12,66 L10,76"/>
      <path d="M36,67 L21,80 L23,90"/>
      <path d="M66,44 L86,34 L92,44"/>
      <path d="M68,52 L90,50 L94,60"/>
      <path d="M68,60 L88,66 L90,76"/>
      <path d="M64,67 L79,80 L77,90"/>
    </g>
    <ellipse cx="50" cy="58" rx="24" ry="22" fill="#3a3350" stroke="#241f33" stroke-width="3"/>
    <circle cx="50" cy="40" r="15" fill="#3a3350" stroke="#241f33" stroke-width="3"/>
    <circle cx="44" cy="40" r="6" fill="#fff"/>
    <circle cx="56" cy="40" r="6" fill="#fff"/>
    <circle cx="44.5" cy="41" r="3" fill="#2a2320"/>
    <circle cx="56.5" cy="41" r="3" fill="#2a2320"/>
    <path d="M45,48 q5,4 10,0" stroke="#241f33" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  </symbol>

  <symbol id="sp-fly" viewBox="0 0 100 100">
    <ellipse cx="34" cy="40" rx="16" ry="10" fill="#d5edff" stroke="#9cc9e8" stroke-width="2.5" transform="rotate(-25 34 40)"/>
    <ellipse cx="66" cy="40" rx="16" ry="10" fill="#d5edff" stroke="#9cc9e8" stroke-width="2.5" transform="rotate(25 66 40)"/>
    <ellipse cx="50" cy="58" rx="15" ry="20" fill="#6cbf4a" stroke="#4a9430" stroke-width="3"/>
    <path d="M37,58 h26 M39,68 h22" stroke="#4a9430" stroke-width="2.5"/>
    <circle cx="44" cy="47" r="5" fill="#fff"/>
    <circle cx="56" cy="47" r="5" fill="#fff"/>
    <circle cx="44.5" cy="47.5" r="2.6" fill="#2a2320"/>
    <circle cx="56.5" cy="47.5" r="2.6" fill="#2a2320"/>
  </symbol>

  <!-- ============ PIRATE ============ -->
  <symbol id="sp-pirate" viewBox="0 0 100 100">
    <path d="M26,92 v-6 a24,20 0 0 1 48,0 v6 z" fill="#3f7fd8"/>
    <path d="M26,84 h48" stroke="#ffffff" stroke-width="4"/>
    <circle cx="25" cy="54" r="5" fill="#f2c9a0"/>
    <circle cx="75" cy="54" r="5" fill="#f2c9a0"/>
    <path d="M25,60 a4,4 0 1 0 0.1,0" fill="none" stroke="#ffcf3d" stroke-width="2.5"/>
    <circle cx="50" cy="52" r="27" fill="#f2c9a0"/>
    <path d="M23,44 q3,-26 27,-26 q24,0 27,26 q-13,-9 -27,-9 q-14,0 -27,9 z" fill="#e23b3b"/>
    <path d="M23,44 q27,-11 54,0 l0,-3 q-27,-11 -54,0 z" fill="#c62828"/>
    <circle cx="22" cy="44" r="5" fill="#e23b3b"/>
    <path d="M18,42 l-11,-5 l4,10 z" fill="#c62828"/>
    <path d="M18,47 l-10,6 l8,5 z" fill="#c62828"/>
    <circle cx="40" cy="33" r="2.4" fill="#fff"/>
    <circle cx="54" cy="30" r="2.4" fill="#fff"/>
    <circle cx="66" cy="35" r="2.4" fill="#fff"/>
    <path d="M40,40 L70,48" stroke="#2a2320" stroke-width="3"/>
    <ellipse cx="60" cy="52" rx="8" ry="9" fill="#2a2320"/>
    <circle cx="40" cy="53" r="4" fill="#2a2320"/>
    <circle cx="41.3" cy="51.7" r="1.3" fill="#fff"/>
    <path d="M37,64 q11,9 22,1" stroke="#a05a33" stroke-width="3" fill="none" stroke-linecap="round"/>
  </symbol>

  <symbol id="sp-chest" viewBox="0 0 100 100">
    <rect x="18" y="46" width="64" height="33" rx="4" fill="#9c5f34" stroke="#6f4220" stroke-width="3"/>
    <path d="M18,46 a32,22 0 0 1 64,0 Z" fill="#a86a3c" stroke="#6f4220" stroke-width="3"/>
    <path d="M30,40 q20,-9 40,0" stroke="#8a5228" stroke-width="2" fill="none" opacity="0.6"/>
    <rect x="15" y="43" width="70" height="7" rx="2" fill="#e8c25a" stroke="#a07c30" stroke-width="1.5"/>
    <rect x="29" y="49" width="7" height="30" fill="#e8c25a" stroke="#a07c30" stroke-width="1.5"/>
    <rect x="64" y="49" width="7" height="30" fill="#e8c25a" stroke="#a07c30" stroke-width="1.5"/>
    <rect x="44" y="49" width="13" height="14" rx="2" fill="#ffcf3d" stroke="#c9992a" stroke-width="2"/>
    <rect x="48.5" y="53" width="4" height="7" rx="2" fill="#7a4a24"/>
  </symbol>

  <!-- ============ SANTA ============ -->
  <symbol id="sp-santa" viewBox="0 0 100 100">
    <path d="M26,52 q2,34 24,36 q22,-2 24,-36 q-24,12 -48,0 z" fill="#f7fbff" stroke="#dbe4ef" stroke-width="2.5"/>
    <circle cx="50" cy="46" r="23" fill="#ffd6b0"/>
    <circle cx="36" cy="50" r="5" fill="#ff9e9e" opacity="0.65"/>
    <circle cx="64" cy="50" r="5" fill="#ff9e9e" opacity="0.65"/>
    <circle cx="43" cy="43" r="3" fill="#2a2320"/>
    <circle cx="57" cy="43" r="3" fill="#2a2320"/>
    <circle cx="50" cy="50" r="5" fill="#ffb894"/>
    <path d="M38,55 q-9,1 -13,7 q11,3 25,-3 q14,6 25,3 q-4,-6 -13,-7 q-12,5 -24,0 z" fill="#f7fbff"/>
    <path d="M73,33 Q71,12 52,11 Q30,10 18,22 Q12,29 18,33 Q27,35 33,29 Q44,18 57,21 Q69,24 70,33 Z" fill="#e14b4b"/>
    <rect x="22" y="30" width="56" height="9" rx="4.5" fill="#f7fbff"/>
    <circle cx="16" cy="25" r="7.5" fill="#f7fbff"/>
  </symbol>

  <symbol id="sp-gift" viewBox="0 0 100 100">
    <rect x="24" y="44" width="52" height="40" rx="4" fill="#3fa85c" stroke="#2e7a44" stroke-width="3"/>
    <rect x="20" y="36" width="60" height="14" rx="4" fill="#4cc06e" stroke="#2e7a44" stroke-width="3"/>
    <rect x="45" y="36" width="10" height="48" fill="#ffcf3d"/>
    <path d="M50,36 q-14,-14 -18,-4 q-2,8 18,4 z" fill="#ffcf3d" stroke="#e0a91f" stroke-width="2"/>
    <path d="M50,36 q14,-14 18,-4 q2,8 -18,4 z" fill="#ffcf3d" stroke="#e0a91f" stroke-width="2"/>
    <circle cx="50" cy="34" r="4" fill="#ffe07a"/>
  </symbol>

  <!-- ============ RACE CAR (side view; turns all 4 ways) ============ -->
  <symbol id="sp-racecar" viewBox="0 0 100 100">
    <path d="M8,40 h14 v6 h-14 z M10,40 h5 v24 h-5 z" fill="#b52020"/>
    <path d="M12,66 L17,54 Q23,49 35,49 Q41,39 53,38 Q65,37 73,44 L83,50 Q93,52 93,60 L93,66 Z"
          fill="#e8342e" stroke="#b52020" stroke-width="3" stroke-linejoin="round"/>
    <path d="M18,61 H88" stroke="#ffffff" stroke-width="3" opacity="0.85"/>
    <path d="M39,49 Q45,40 54,40 Q63,40 68,45 L69,49 Z" fill="#cdeeff" stroke="#a9d4ea" stroke-width="2"/>
    <circle cx="50" cy="46" r="4.6" fill="#fff"/><circle cx="51.5" cy="46.5" r="2.4" fill="#2a2320"/>
    <circle cx="60" cy="46" r="4.6" fill="#fff"/><circle cx="61.5" cy="46.5" r="2.4" fill="#2a2320"/>
    <circle cx="32" cy="57" r="7.5" fill="#fff"/>
    <path d="M32,52 l1.6,3.8 l4.1,0.3 l-3.1,2.5 l1.1,4 l-3.7,-2.4 l-3.7,2.4 l1.1,-4 l-3.1,-2.5 l4.1,-0.3 z" fill="#ffcf3d"/>
    <circle cx="89" cy="55" r="3" fill="#ffe58a"/>
    <path d="M79,59 q5,3 9,-1" stroke="#8a1414" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <circle cx="30" cy="68" r="12" fill="#2a2320"/><circle cx="30" cy="68" r="5.5" fill="#cbd0d6"/>
    <circle cx="72" cy="68" r="12" fill="#2a2320"/><circle cx="72" cy="68" r="5.5" fill="#cbd0d6"/>
  </symbol>

  <symbol id="sp-trophy" viewBox="0 0 100 100">
    <path d="M32,26 h36 v10 a18,18 0 0 1 -36,0 z" fill="#ffcf3d" stroke="#d9a520" stroke-width="3"/>
    <path d="M32,30 q-12,0 -12,10 q0,8 10,8" fill="none" stroke="#d9a520" stroke-width="4"/>
    <path d="M68,30 q12,0 12,10 q0,8 -10,8" fill="none" stroke="#d9a520" stroke-width="4"/>
    <rect x="46" y="52" width="8" height="12" fill="#e0b030"/>
    <rect x="36" y="64" width="28" height="7" rx="2" fill="#d9a520"/>
    <rect x="40" y="71" width="20" height="7" rx="2" fill="#c99518"/>
    <path d="M50,31 l2.5,6 l6.5,0.4 l-5,4 l1.5,6.5 l-5.5,-3.6 l-5.5,3.6 l1.5,-6.5 l-5,-4 l6.5,-0.4 z" fill="#fff6cf"/>
  </symbol>

  <!-- ============ T-REX (side-profile running dino) ============ -->
  <symbol id="sp-trex" viewBox="0 0 100 100">
    <path d="M6,46 L28,54 L24,66 L12,62 Q6,56 6,46 Z" fill="#5aad3d" stroke="#4e9633" stroke-width="3" stroke-linejoin="round"/>
    <rect x="30" y="72" width="10" height="17" rx="3.5" fill="#4e9633"/>
    <ellipse cx="36" cy="90" rx="8" ry="2.8" fill="#3f7d29"/>
    <path d="M22,58 Q22,74 38,76 L54,76 Q62,76 62,64 L62,52 Q62,44 50,44 L34,44 Q22,46 22,58 Z"
          fill="#6cc24a" stroke="#4e9633" stroke-width="3" stroke-linejoin="round"/>
    <path d="M50,52 L50,34 Q50,24 62,24 L84,24 Q91,24 91,32 L91,41 Q91,44 87,44 L60,44 Q50,44 50,52 Z"
          fill="#6cc24a" stroke="#4e9633" stroke-width="3" stroke-linejoin="round"/>
    <path d="M67,44 L91,44 L91,52 Q79,54 69,51 Z" fill="#8a3b3b"/>
    <path d="M64,49 Q63,58 72,59 L84,59 Q88,59 87,53 L86,50 Q79,52 72,52 Q67,52 64,49 Z"
          fill="#6cc24a" stroke="#4e9633" stroke-width="3" stroke-linejoin="round"/>
    <path d="M30,60 Q40,70 52,64 Q46,72 38,70 Q31,68 30,60 Z" fill="#cfe8a8"/>
    <rect x="46" y="72" width="10" height="17" rx="3.5" fill="#6cc24a"/>
    <ellipse cx="52" cy="90" rx="8" ry="2.8" fill="#3f7d29"/>
    <path d="M56,54 q5,1 7,5" stroke="#4e9633" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M74,44 l1.5,4 M80,44 l1.5,4 M86,44 l1.5,3.5" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
    <path d="M78,53 l1.5,-4 M84,53 l1.5,-3.5" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
    <circle cx="80" cy="32" r="4.5" fill="#fff"/><circle cx="81.5" cy="32.5" r="2.3" fill="#2a2320"/>
  </symbol>

  <symbol id="sp-meat" viewBox="0 0 100 100">
    <g transform="rotate(-18 46 46)">
      <ellipse cx="42" cy="44" rx="25" ry="21" fill="#c85a3c" stroke="#a04528" stroke-width="3"/>
      <path d="M30,34 q7,-5 15,-2" stroke="#e08a6a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    </g>
    <rect x="52" y="56" width="30" height="10" rx="5" fill="#fff6e8" stroke="#d9c3a5" stroke-width="2.5" transform="rotate(38 66 61)"/>
    <circle cx="82" cy="74" r="7" fill="#fff6e8" stroke="#d9c3a5" stroke-width="2.5"/>
    <circle cx="88" cy="67" r="7" fill="#fff6e8" stroke="#d9c3a5" stroke-width="2.5"/>
  </symbol>

  <!-- ============ BABY ============ -->
  <symbol id="sp-baby" viewBox="0 0 100 100">
    <path d="M30,92 v-14 a20,18 0 0 1 40,0 v14 z" fill="#8fc8f0"/>
    <path d="M30,84 h40" stroke="#ffffff" stroke-width="3.5"/>
    <circle cx="50" cy="46" r="26" fill="#ffd9be"/>
    <circle cx="34" cy="52" r="5" fill="#ff9e9e" opacity="0.65"/>
    <circle cx="66" cy="52" r="5" fill="#ff9e9e" opacity="0.65"/>
    <path d="M50,21 q-2,-9 5,-12 q2,5 -1,10 q4,-1 6,3 q-6,1 -10,-1 z" fill="#8a5a30"/>
    <circle cx="41" cy="45" r="5.4" fill="#fff"/>
    <circle cx="59" cy="45" r="5.4" fill="#fff"/>
    <circle cx="42" cy="46" r="3" fill="#2a2320"/>
    <circle cx="60" cy="46" r="3" fill="#2a2320"/>
    <path d="M43,57 q7,6 14,0" stroke="#c86a4a" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  </symbol>

  <symbol id="sp-bottle" viewBox="0 0 100 100">
    <path d="M44,16 q6,-7 12,0 v6 h-12 z" fill="#ffcf9e" stroke="#e0a870" stroke-width="2"/>
    <rect x="39" y="22" width="22" height="8" rx="2" fill="#ff8fb0"/>
    <rect x="36" y="30" width="28" height="50" rx="10" fill="#eaf6ff" stroke="#bcd8ea" stroke-width="3"/>
    <path d="M39,50 h22 v22 a7,7 0 0 1 -7,7 h-8 a7,7 0 0 1 -7,-7 z" fill="#ffffff"/>
    <path d="M57,38 h5 M57,44 h5 M57,50 h5" stroke="#bcd8ea" stroke-width="2" stroke-linecap="round"/>
  </symbol>

  <!-- ============ BEE (side view; turns 4 ways) ============ -->
  <symbol id="sp-bee" viewBox="0 0 100 100">
    <ellipse cx="42" cy="33" rx="12" ry="9" fill="#dff2ff" stroke="#a9d4ea" stroke-width="2.5" transform="rotate(-18 42 33)"/>
    <ellipse cx="56" cy="33" rx="11" ry="8" fill="#dff2ff" stroke="#a9d4ea" stroke-width="2.5" transform="rotate(18 56 33)"/>
    <path d="M26,56 l-9,-4 l9,-4 z" fill="#3a2f1a"/>
    <ellipse cx="52" cy="56" rx="26" ry="19" fill="#ffcf3d" stroke="#e0a91f" stroke-width="3"/>
    <path d="M48,40 v32 M60,42 v28" stroke="#3a2f1a" stroke-width="6" stroke-linecap="round"/>
    <circle cx="76" cy="52" r="12" fill="#3a2f1a"/>
    <path d="M80,42 q3,-8 8,-8 M74,42 q1,-9 5,-11" stroke="#3a2f1a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <circle cx="88" cy="34" r="2" fill="#3a2f1a"/><circle cx="84" cy="31" r="2" fill="#3a2f1a"/>
    <circle cx="79" cy="50" r="3.5" fill="#fff"/><circle cx="80" cy="50.5" r="1.8" fill="#2a2320"/>
    <path d="M72,58 q5,3 9,0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
  </symbol>
  <symbol id="sp-honey" viewBox="0 0 100 100">
    <path d="M40,38 q0,-14 10,-14 q10,0 10,14 q-4,-3 -10,-3 q-6,0 -10,3 z" fill="#ffcf3d"/>
    <rect x="46" y="14" width="8" height="14" rx="3" fill="#d9a24a"/>
    <path d="M28,44 h44 l-4,32 a6,6 0 0 1 -6,5 h-24 a6,6 0 0 1 -6,-5 z" fill="#e0a04a" stroke="#b87a2a" stroke-width="3"/>
    <rect x="24" y="38" width="52" height="10" rx="4" fill="#c98a34" stroke="#b87a2a" stroke-width="3"/>
    <circle cx="50" cy="62" r="7" fill="#ffcf3d" stroke="#e0a91f" stroke-width="2"/>
  </symbol>

  <!-- ============ BUNNY ============ -->
  <symbol id="sp-bunny" viewBox="0 0 100 100">
    <ellipse cx="40" cy="24" rx="7" ry="20" fill="#fafafa" stroke="#e0d8e0" stroke-width="3"/>
    <ellipse cx="60" cy="24" rx="7" ry="20" fill="#fafafa" stroke="#e0d8e0" stroke-width="3"/>
    <ellipse cx="40" cy="24" rx="3" ry="13" fill="#ffc2d4"/>
    <ellipse cx="60" cy="24" rx="3" ry="13" fill="#ffc2d4"/>
    <circle cx="50" cy="58" r="26" fill="#fafafa" stroke="#e0d8e0" stroke-width="3"/>
    <circle cx="34" cy="62" r="4.5" fill="#ffc2d4" opacity="0.7"/>
    <circle cx="66" cy="62" r="4.5" fill="#ffc2d4" opacity="0.7"/>
    <circle cx="40" cy="55" r="3.6" fill="#3b2a2e"/><circle cx="60" cy="55" r="3.6" fill="#3b2a2e"/>
    <path d="M46,63 l4,3 l4,-3 z" fill="#ff9fb8"/>
    <path d="M50,66 v3 M50,69 q-4,4 -8,1 M50,69 q4,4 8,1" stroke="#c98aa0" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <rect x="47" y="70" width="6" height="6" rx="1.5" fill="#fff" stroke="#e0d8e0" stroke-width="1"/>
  </symbol>
  <symbol id="sp-carrot" viewBox="0 0 100 100">
    <path d="M50,32 q-4,-16 -12,-18 q2,10 8,16 z" fill="#5aad3d"/>
    <path d="M50,32 q0,-18 0,-20 q6,8 4,18 z" fill="#6cc24a"/>
    <path d="M50,32 q4,-16 12,-18 q-2,10 -8,16 z" fill="#5aad3d"/>
    <path d="M50,30 Q66,34 62,52 L50,84 L38,52 Q34,34 50,30 Z" fill="#ff8f2e" stroke="#e0781a" stroke-width="3" stroke-linejoin="round"/>
    <path d="M44,44 l10,3 M42,54 l12,3 M46,64 l8,2" stroke="#e0781a" stroke-width="2" stroke-linecap="round"/>
  </symbol>

  <!-- ============ PANDA ============ -->
  <symbol id="sp-panda" viewBox="0 0 100 100">
    <circle cx="26" cy="30" r="12" fill="#2a2320"/>
    <circle cx="74" cy="30" r="12" fill="#2a2320"/>
    <circle cx="50" cy="55" r="32" fill="#fafafa" stroke="#e2e2e6" stroke-width="3"/>
    <ellipse cx="38" cy="52" rx="9" ry="11" fill="#2a2320" transform="rotate(-15 38 52)"/>
    <ellipse cx="62" cy="52" rx="9" ry="11" fill="#2a2320" transform="rotate(15 62 52)"/>
    <circle cx="39" cy="53" r="4" fill="#fff"/><circle cx="61" cy="53" r="4" fill="#fff"/>
    <circle cx="39.5" cy="53.5" r="2" fill="#2a2320"/><circle cx="61.5" cy="53.5" r="2" fill="#2a2320"/>
    <ellipse cx="50" cy="64" rx="4" ry="3" fill="#2a2320"/>
    <path d="M50,67 v3 M50,70 q-4,4 -8,1 M50,70 q4,4 8,1" stroke="#5a5048" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  </symbol>
  <symbol id="sp-bamboo" viewBox="0 0 100 100">
    <rect x="40" y="16" width="20" height="70" rx="6" fill="#8fd06a" stroke="#5aad3d" stroke-width="3"/>
    <path d="M40,38 h20 M40,58 h20 M40,78 h20" stroke="#5aad3d" stroke-width="3"/>
    <path d="M60,30 q16,-6 22,-18 q-14,2 -22,12 z" fill="#6cc24a" stroke="#4e9633" stroke-width="2"/>
    <path d="M60,44 q14,-2 20,-12 q-12,0 -20,6 z" fill="#7ac74f" stroke="#4e9633" stroke-width="2"/>
  </symbol>

  <!-- ============ MONKEY ============ -->
  <symbol id="sp-monkey" viewBox="0 0 100 100">
    <circle cx="22" cy="52" r="11" fill="#a5723f" stroke="#7a5227" stroke-width="3"/>
    <circle cx="78" cy="52" r="11" fill="#a5723f" stroke="#7a5227" stroke-width="3"/>
    <circle cx="22" cy="52" r="5" fill="#e0b48a"/>
    <circle cx="78" cy="52" r="5" fill="#e0b48a"/>
    <circle cx="50" cy="52" r="30" fill="#a5723f" stroke="#7a5227" stroke-width="3"/>
    <ellipse cx="50" cy="60" rx="22" ry="20" fill="#f0d2b0"/>
    <circle cx="42" cy="50" r="4" fill="#2a2320"/><circle cx="58" cy="50" r="4" fill="#2a2320"/>
    <circle cx="43" cy="49" r="1.5" fill="#fff"/><circle cx="59" cy="49" r="1.5" fill="#fff"/>
    <circle cx="46" cy="62" r="1.6" fill="#7a5227"/><circle cx="54" cy="62" r="1.6" fill="#7a5227"/>
    <path d="M40,66 q10,8 20,0" stroke="#7a5227" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  </symbol>
  <symbol id="sp-banana" viewBox="0 0 100 100">
    <path d="M22,40 Q26,72 58,80 Q80,84 84,72 Q66,78 48,66 Q30,54 30,38 Z" fill="#ffd93d" stroke="#e0b91f" stroke-width="3" stroke-linejoin="round"/>
    <path d="M30,38 l-4,-6 M84,72 l6,2" stroke="#8a6a2a" stroke-width="4" stroke-linecap="round"/>
    <path d="M30,44 Q34,66 56,74" stroke="#e0b91f" stroke-width="2" fill="none"/>
  </symbol>

  <!-- ============ PENGUIN ============ -->
  <symbol id="sp-penguin" viewBox="0 0 100 100">
    <ellipse cx="50" cy="54" rx="28" ry="34" fill="#33384a" stroke="#242838" stroke-width="3"/>
    <ellipse cx="50" cy="60" rx="18" ry="26" fill="#fafafa"/>
    <path d="M24,52 q-6,16 4,26 q4,-14 2,-26 z" fill="#33384a"/>
    <path d="M76,52 q6,16 -4,26 q-4,-14 -2,-26 z" fill="#33384a"/>
    <circle cx="42" cy="42" r="4.5" fill="#fff"/><circle cx="58" cy="42" r="4.5" fill="#fff"/>
    <circle cx="43" cy="43" r="2.4" fill="#2a2320"/><circle cx="59" cy="43" r="2.4" fill="#2a2320"/>
    <path d="M44,50 l6,6 l6,-6 q-6,-3 -12,0 z" fill="#ff9f2e" stroke="#e0781a" stroke-width="1.5"/>
    <path d="M38,86 q-6,4 -10,2 q2,-6 8,-6 z" fill="#ff9f2e"/>
    <path d="M62,86 q6,4 10,2 q-2,-6 -8,-6 z" fill="#ff9f2e"/>
  </symbol>
  <symbol id="sp-icecream" viewBox="0 0 100 100">
    <path d="M38,54 L50,90 L62,54 Z" fill="#e0a04a" stroke="#b87a2a" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M43,60 l8,8 M51,58 l8,8" stroke="#b87a2a" stroke-width="1.5"/>
    <circle cx="42" cy="46" r="14" fill="#ff9ec4"/>
    <circle cx="58" cy="46" r="14" fill="#a9e0f5"/>
    <circle cx="50" cy="34" r="14" fill="#fff0a0"/>
    <circle cx="50" cy="20" r="5" fill="#e2453c"/>
    <path d="M50,16 q3,-6 7,-6" stroke="#5aad3d" stroke-width="2" fill="none"/>
  </symbol>

  <!-- ============ FROG ============ -->
  <symbol id="sp-frog" viewBox="0 0 100 100">
    <circle cx="34" cy="34" r="12" fill="#7ac74f" stroke="#4e9633" stroke-width="3"/>
    <circle cx="66" cy="34" r="12" fill="#7ac74f" stroke="#4e9633" stroke-width="3"/>
    <circle cx="34" cy="32" r="6" fill="#fff"/><circle cx="66" cy="32" r="6" fill="#fff"/>
    <circle cx="34" cy="33" r="3" fill="#2a2320"/><circle cx="66" cy="33" r="3" fill="#2a2320"/>
    <path d="M18,54 a32,26 0 0 1 64,0 q0,20 -32,20 q-32,0 -32,-20 z" fill="#7ac74f" stroke="#4e9633" stroke-width="3"/>
    <ellipse cx="50" cy="64" rx="20" ry="12" fill="#cfe8a8"/>
    <path d="M32,56 q18,16 36,0" stroke="#4e9633" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="46" cy="48" r="1.6" fill="#4e9633"/><circle cx="54" cy="48" r="1.6" fill="#4e9633"/>
    <circle cx="28" cy="58" r="4" fill="#ff9eb0" opacity="0.6"/><circle cx="72" cy="58" r="4" fill="#ff9eb0" opacity="0.6"/>
  </symbol>
  <symbol id="sp-lily" viewBox="0 0 100 100">
    <ellipse cx="50" cy="60" rx="30" ry="18" fill="#4e9e3f" stroke="#3f7d29" stroke-width="2.5"/>
    <path d="M50,60 L76,52" stroke="#3f7d29" stroke-width="3"/>
    <g fill="#ff9ec4" stroke="#e97aa8" stroke-width="1.5">
      <ellipse cx="50" cy="42" rx="5" ry="12"/>
      <ellipse cx="40" cy="46" rx="5" ry="11" transform="rotate(-40 40 46)"/>
      <ellipse cx="60" cy="46" rx="5" ry="11" transform="rotate(40 60 46)"/>
    </g>
    <circle cx="50" cy="46" r="5" fill="#ffe07a"/>
  </symbol>

  <!-- ============ BUTTERFLY ============ -->
  <symbol id="sp-butterfly" viewBox="0 0 100 100">
    <path d="M50,50 Q22,26 16,42 Q12,58 34,58 Q46,58 50,50 Z" fill="#ff8fbf" stroke="#e05a97" stroke-width="2.5"/>
    <path d="M50,50 Q78,26 84,42 Q88,58 66,58 Q54,58 50,50 Z" fill="#ff8fbf" stroke="#e05a97" stroke-width="2.5"/>
    <path d="M50,52 Q26,66 24,80 Q34,88 44,74 Q50,64 50,52 Z" fill="#ffb3d6" stroke="#e05a97" stroke-width="2.5"/>
    <path d="M50,52 Q74,66 76,80 Q66,88 56,74 Q50,64 50,52 Z" fill="#ffb3d6" stroke="#e05a97" stroke-width="2.5"/>
    <circle cx="30" cy="44" r="4" fill="#fff"/><circle cx="70" cy="44" r="4" fill="#fff"/>
    <rect x="47" y="42" width="6" height="34" rx="3" fill="#4a3b2a"/>
    <circle cx="50" cy="42" r="5" fill="#4a3b2a"/>
    <path d="M48,40 q-4,-8 -8,-9 M52,40 q4,-8 8,-9" stroke="#4a3b2a" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="47.5" cy="42" r="1.4" fill="#fff"/><circle cx="52.5" cy="42" r="1.4" fill="#fff"/>
  </symbol>
  <symbol id="sp-flower" viewBox="0 0 100 100">
    <path d="M50,58 v24" stroke="#4e9e3f" stroke-width="4" stroke-linecap="round"/>
    <path d="M50,72 q10,-2 14,-10 q-12,-2 -14,6 z" fill="#5aad3d"/>
    <g fill="#ff6b9d">
      <circle cx="50" cy="34" r="10"/><circle cx="34" cy="44" r="10"/>
      <circle cx="66" cy="44" r="10"/><circle cx="40" cy="60" r="10"/>
      <circle cx="60" cy="60" r="10"/>
    </g>
    <circle cx="50" cy="48" r="10" fill="#ffd93d"/>
  </symbol>

  <!-- ============ DRAGON ============ -->
  <symbol id="sp-dragon" viewBox="0 0 100 100">
    <!-- wings -->
    <path d="M24,48 Q6,38 8,58 Q17,53 28,58 Z" fill="#3f9a4a" stroke="#357f3d" stroke-width="2"/>
    <path d="M76,48 Q94,38 92,58 Q83,53 72,58 Z" fill="#3f9a4a" stroke="#357f3d" stroke-width="2"/>
    <!-- ear frills -->
    <path d="M27,40 Q13,33 11,45 Q20,46 29,51 Z" fill="#7ad487" stroke="#3f9a4a" stroke-width="2"/>
    <path d="M73,40 Q87,33 89,45 Q80,46 71,51 Z" fill="#7ad487" stroke="#3f9a4a" stroke-width="2"/>
    <!-- horns -->
    <path d="M38,25 Q33,10 44,15 Q42,22 44,29 Z" fill="#f0d24a" stroke="#d9b830" stroke-width="1.5"/>
    <path d="M62,25 Q67,10 56,15 Q58,22 56,29 Z" fill="#f0d24a" stroke="#d9b830" stroke-width="1.5"/>
    <!-- back spike -->
    <path d="M44,24 l6,-9 l6,9 z" fill="#3f9a4a"/>
    <!-- head -->
    <circle cx="50" cy="54" r="28" fill="#5ec26a" stroke="#3f9a4a" stroke-width="3"/>
    <!-- snout -->
    <ellipse cx="50" cy="66" rx="17" ry="13" fill="#8fdc9a"/>
    <circle cx="44" cy="65" r="1.8" fill="#3f9a4a"/><circle cx="56" cy="65" r="1.8" fill="#3f9a4a"/>
    <!-- eyes -->
    <circle cx="40" cy="50" r="6" fill="#fff"/><circle cx="60" cy="50" r="6" fill="#fff"/>
    <circle cx="41" cy="51" r="3" fill="#2a2320"/><circle cx="61" cy="51" r="3" fill="#2a2320"/>
    <circle cx="42.4" cy="49.5" r="1.1" fill="#fff"/><circle cx="62.4" cy="49.5" r="1.1" fill="#fff"/>
    <!-- smile + teeth -->
    <path d="M42,70 q8,6 16,0" stroke="#3f9a4a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M45,71 l0,4 l3,-3 z" fill="#fff"/>
    <path d="M55,71 l0,4 l-3,-3 z" fill="#fff"/>
    <!-- cheeks -->
    <circle cx="32" cy="60" r="3.5" fill="#ff9eb0" opacity="0.5"/><circle cx="68" cy="60" r="3.5" fill="#ff9eb0" opacity="0.5"/>
  </symbol>
  <symbol id="sp-gem" viewBox="0 0 100 100">
    <path d="M30,38 h40 l16,16 -36,34 -36,-34 z" fill="#5ac8f0" stroke="#2f9fd0" stroke-width="3" stroke-linejoin="round"/>
    <path d="M30,38 l20,16 20,-16 M14,54 h72 M50,54 v34" stroke="#2f9fd0" stroke-width="2" fill="none"/>
    <path d="M38,44 l8,8" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
  </symbol>

  <!-- ============ WIZARD ============ -->
  <symbol id="sp-wizard" viewBox="0 0 100 100">
    <!-- hat with a floppy tip -->
    <path d="M28,50 Q40,16 56,12 Q50,22 53,32 L72,50 Z" fill="#5b4bd0" stroke="#4437a8" stroke-width="3" stroke-linejoin="round"/>
    <path d="M22,50 Q50,43 78,50 Q50,59 22,50 Z" fill="#4437a8"/>
    <circle cx="56" cy="12" r="4" fill="#ffd93d"/>
    <path d="M46,34 l1.8,4.6 l4.8,0.4 l-3.6,3 l1.2,4.8 l-4.2,-2.7 l-4.2,2.7 l1.2,-4.8 l-3.6,-3 l4.8,-0.4 z" fill="#ffd93d"/>
    <circle cx="40" cy="44" r="1.6" fill="#ffe07a"/><circle cx="52" cy="26" r="1.6" fill="#ffe07a"/>
    <!-- face -->
    <circle cx="50" cy="62" r="17" fill="#ffd6b0"/>
    <path d="M41,57 q4,-2 8,-0.5 M51,56.5 q4,-1.5 8,0.5" stroke="#eef0f5" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="45" cy="61" r="2.8" fill="#2a2320"/><circle cx="55" cy="61" r="2.8" fill="#2a2320"/>
    <circle cx="50" cy="66" r="3" fill="#f0b48a"/>
    <circle cx="39" cy="66" r="3.5" fill="#ff9eb0" opacity="0.5"/><circle cx="61" cy="66" r="3.5" fill="#ff9eb0" opacity="0.5"/>
    <!-- beard + mustache -->
    <path d="M34,70 Q35,94 50,94 Q65,94 66,70 Q58,77 50,74 Q42,77 34,70 Z" fill="#f0f2f7" stroke="#d5dae4" stroke-width="2"/>
    <path d="M38,69 Q44,75 50,71 Q56,75 62,69 Q56,78 50,74 Q44,78 38,69 Z" fill="#f0f2f7"/>
  </symbol>
  <symbol id="sp-potion" viewBox="0 0 100 100">
    <rect x="44" y="16" width="12" height="10" rx="2" fill="#a5723f"/>
    <rect x="45" y="24" width="10" height="12" fill="#cfe0ea"/>
    <path d="M40,34 L40,44 A22,22 0 1 0 60,44 L60,34 Z" fill="#dff2ff" stroke="#a9d4ea" stroke-width="3"/>
    <path d="M31,52 A22,22 0 0 0 69,52 A24,20 0 0 1 31,52 Z" fill="#b06bd0"/>
    <circle cx="44" cy="62" r="3" fill="#d6a8ea"/><circle cx="56" cy="68" r="2.4" fill="#d6a8ea"/>
  </symbol>

  <!-- ============ UNICORN ============ -->
  <symbol id="sp-unicorn" viewBox="0 0 100 100">
    <path d="M34,34 l-3,-12 l9,8 z" fill="#fafafa" stroke="#e0d8e6" stroke-width="2.5"/>
    <path d="M66,34 l3,-12 l-9,8 z" fill="#fafafa" stroke="#e0d8e6" stroke-width="2.5"/>
    <path d="M50,10 l5,20 h-10 z" fill="#ffd93d" stroke="#e0a91f" stroke-width="2"/>
    <path d="M32,36 q-8,10 -4,24 q6,-4 8,-10 q-2,10 4,14 q4,-6 4,-14 z" fill="#ff8fbf"/>
    <path d="M32,44 Q32,30 50,30 Q68,30 68,44 L68,58 Q68,74 50,76 Q40,76 36,66 L32,58 Z" fill="#fafafa" stroke="#e0d8e6" stroke-width="3"/>
    <ellipse cx="52" cy="66" rx="12" ry="9" fill="#fff0f5"/>
    <circle cx="46" cy="52" r="4" fill="#2a2320"/><circle cx="47" cy="51" r="1.4" fill="#fff"/>
    <circle cx="50" cy="66" r="1.5" fill="#e0a9c0"/>
    <circle cx="42" cy="60" r="4" fill="#ffc2d4" opacity="0.7"/>
  </symbol>
  <symbol id="sp-rainbow" viewBox="0 0 100 100">
    <g fill="none" stroke-width="6">
      <path d="M16,68 A34,34 0 0 1 84,68" stroke="#ff5e5e"/>
      <path d="M22,68 A28,28 0 0 1 78,68" stroke="#ffb03d"/>
      <path d="M28,68 A22,22 0 0 1 72,68" stroke="#ffe03d"/>
      <path d="M34,68 A16,16 0 0 1 66,68" stroke="#5ad06a"/>
      <path d="M40,68 A10,10 0 0 1 60,68" stroke="#5aa0f0"/>
    </g>
    <ellipse cx="20" cy="70" rx="12" ry="8" fill="#fff"/>
    <ellipse cx="80" cy="70" rx="12" ry="8" fill="#fff"/>
  </symbol>

  <!-- ============ ROBOT ============ -->
  <symbol id="sp-robot" viewBox="0 0 100 100">
    <line x1="50" y1="24" x2="50" y2="14" stroke="#8a93a1" stroke-width="3"/>
    <circle cx="50" cy="12" r="4" fill="#ff5e5e"/>
    <rect x="18" y="40" width="8" height="12" rx="2" fill="#8a93a1"/>
    <rect x="74" y="40" width="8" height="12" rx="2" fill="#8a93a1"/>
    <rect x="24" y="24" width="52" height="44" rx="10" fill="#b7c0cc" stroke="#8a93a1" stroke-width="3"/>
    <rect x="31" y="32" width="38" height="24" rx="6" fill="#2b3a4a"/>
    <circle cx="42" cy="44" r="5" fill="#5fe0d0"/><circle cx="58" cy="44" r="5" fill="#5fe0d0"/>
    <path d="M42,50 q8,5 16,0" stroke="#5fe0d0" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <rect x="38" y="68" width="24" height="10" rx="4" fill="#9aa4b2"/>
    <rect x="30" y="78" width="40" height="12" rx="5" fill="#b7c0cc" stroke="#8a93a1" stroke-width="3"/>
  </symbol>
  <symbol id="sp-battery" viewBox="0 0 100 100">
    <rect x="40" y="12" width="20" height="10" rx="3" fill="#3f9a4a"/>
    <rect x="30" y="20" width="40" height="64" rx="8" fill="#5ad06a" stroke="#3f9a4a" stroke-width="3"/>
    <path d="M54,32 L42,56 h9 l-4,18 16,-24 h-9 z" fill="#fff" stroke="#e0e0e0" stroke-width="1"/>
    <rect x="36" y="74" width="28" height="6" rx="3" fill="#3f9a4a"/>
  </symbol>

  <!-- ============ ALIEN ============ -->
  <symbol id="sp-alien" viewBox="0 0 100 100">
    <path d="M40,28 q-3,-10 -8,-12 M60,28 q3,-10 8,-12" stroke="#5ac26a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="31" cy="15" r="3.5" fill="#8fe06a"/><circle cx="69" cy="15" r="3.5" fill="#8fe06a"/>
    <ellipse cx="50" cy="52" rx="26" ry="30" fill="#7ad46a" stroke="#4e9e44" stroke-width="3"/>
    <ellipse cx="40" cy="52" rx="7" ry="10" fill="#2a2320"/>
    <ellipse cx="60" cy="52" rx="7" ry="10" fill="#2a2320"/>
    <circle cx="42" cy="48" r="2.4" fill="#fff"/><circle cx="62" cy="48" r="2.4" fill="#fff"/>
    <path d="M42,68 q8,6 16,0" stroke="#4e9e44" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <circle cx="30" cy="60" r="4" fill="#b3f08a" opacity="0.6"/><circle cx="70" cy="60" r="4" fill="#b3f08a" opacity="0.6"/>
  </symbol>
  <symbol id="sp-planet" viewBox="0 0 100 100">
    <circle cx="50" cy="52" r="24" fill="#c07ad0" stroke="#9b4fc0" stroke-width="3"/>
    <circle cx="42" cy="46" r="5" fill="#a85fc0" opacity="0.6"/>
    <circle cx="58" cy="58" r="4" fill="#a85fc0" opacity="0.6"/>
    <ellipse cx="50" cy="54" rx="38" ry="12" fill="none" stroke="#ffd93d" stroke-width="5" transform="rotate(-20 50 54)"/>
  </symbol>

  <!-- ============ MERMAID ============ -->
  <symbol id="sp-mermaid" viewBox="0 0 100 100">
    <path d="M50,60 Q40,78 46,90 Q50,84 54,90 Q60,78 50,60 Z" fill="#3fc4c0" stroke="#2a9c98" stroke-width="3"/>
    <path d="M40,88 Q50,84 60,88 Q54,80 50,80 Q46,80 40,88 Z" fill="#5ad8d4"/>
    <path d="M30,44 Q26,70 36,80 Q40,66 40,54 Z" fill="#ff8f5a"/>
    <path d="M70,44 Q74,70 64,80 Q60,66 60,54 Z" fill="#ff8f5a"/>
    <circle cx="50" cy="42" r="20" fill="#ffd6b0"/>
    <path d="M30,42 Q30,20 50,20 Q70,20 70,42 Q60,32 50,32 Q40,32 30,42 Z" fill="#ff9a5e"/>
    <circle cx="43" cy="42" r="2.6" fill="#2a2320"/><circle cx="57" cy="42" r="2.6" fill="#2a2320"/>
    <path d="M45,50 q5,4 10,0" stroke="#c07a5a" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <circle cx="38" cy="47" r="3.5" fill="#ff9eb0" opacity="0.6"/><circle cx="62" cy="47" r="3.5" fill="#ff9eb0" opacity="0.6"/>
    <path d="M40,60 q10,8 20,0 q-2,-6 -10,-6 q-8,0 -10,6 z" fill="#ff9ec4"/>
  </symbol>
  <symbol id="sp-pearl" viewBox="0 0 100 100">
    <path d="M20,56 Q50,66 80,56 Q84,74 50,82 Q16,74 20,56 Z" fill="#ff9ec4" stroke="#e97aa8" stroke-width="3" stroke-linejoin="round"/>
    <g stroke="#e97aa8" stroke-width="2" fill="none"><path d="M50,80 V60 M38,78 l-2,-16 M62,78 l2,-16"/></g>
    <circle cx="50" cy="48" r="16" fill="#f4f7ff" stroke="#d5dae8" stroke-width="2"/>
    <circle cx="44" cy="42" r="5" fill="#ffffff"/>
  </symbol>

  <!-- ============ CHEF ============ -->
  <symbol id="sp-chef" viewBox="0 0 100 100">
    <path d="M30,34 a10,10 0 0 1 -2,-19 a11,11 0 0 1 20,-4 a11,11 0 0 1 20,4 a10,10 0 0 1 -2,19 z" fill="#fafafa" stroke="#dcdce4" stroke-width="3"/>
    <rect x="32" y="32" width="36" height="8" rx="2" fill="#fafafa" stroke="#dcdce4" stroke-width="3"/>
    <circle cx="50" cy="58" r="20" fill="#ffd6b0"/>
    <circle cx="43" cy="56" r="2.8" fill="#2a2320"/><circle cx="57" cy="56" r="2.8" fill="#2a2320"/>
    <path d="M38,64 q6,5 12,2 q6,3 12,-2 q-4,6 -12,4 q-8,2 -12,-4 z" fill="#7a5230"/>
    <path d="M44,71 q6,4 12,0" stroke="#c07a5a" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <circle cx="36" cy="62" r="4" fill="#ff9eb0" opacity="0.55"/><circle cx="64" cy="62" r="4" fill="#ff9eb0" opacity="0.55"/>
  </symbol>
  <symbol id="sp-cupcake" viewBox="0 0 100 100">
    <path d="M32,54 L38,84 h24 l6,-30 z" fill="#ffcf8a" stroke="#e0a850" stroke-width="3" stroke-linejoin="round"/>
    <path d="M43,54 l3,30 M50,54 v30 M57,54 l-3,30" stroke="#e0a850" stroke-width="2"/>
    <path d="M28,54 Q28,38 42,38 Q44,26 58,32 Q72,32 70,46 Q78,50 70,56 Q50,60 30,56 Q26,56 28,54 Z" fill="#ff9ec4" stroke="#e97aa8" stroke-width="2.5"/>
    <circle cx="50" cy="30" r="5" fill="#e2453c"/>
    <path d="M40,48 l3,-3 M52,50 l3,-3 M60,46 l3,-3" stroke="#ffd93d" stroke-width="2.5" stroke-linecap="round"/>
  </symbol>

  <!-- ============ KNIGHT ============ -->
  <symbol id="sp-knight" viewBox="0 0 100 100">
    <path d="M50,14 q14,-6 12,10 q-6,-4 -12,-2 z" fill="#e2453c"/>
    <path d="M28,40 a22,22 0 0 1 44,0 L72,74 Q72,82 62,82 L38,82 Q28,82 28,74 Z" fill="#b7c0cc" stroke="#8a93a1" stroke-width="3"/>
    <rect x="34" y="44" width="32" height="7" rx="3" fill="#2b3a4a"/>
    <rect x="46" y="52" width="8" height="24" rx="3" fill="#2b3a4a"/>
    <circle cx="42" cy="47.5" r="2" fill="#7fe0ff"/><circle cx="58" cy="47.5" r="2" fill="#7fe0ff"/>
    <circle cx="32" cy="60" r="2" fill="#8a93a1"/><circle cx="68" cy="60" r="2" fill="#8a93a1"/>
  </symbol>
  <symbol id="sp-shield" viewBox="0 0 100 100">
    <path d="M50,16 L80,26 Q80,60 50,84 Q20,60 20,26 Z" fill="#6b8fd8" stroke="#4a6ab0" stroke-width="3" stroke-linejoin="round"/>
    <rect x="45" y="30" width="10" height="40" rx="2" fill="#ffd93d"/>
    <rect x="32" y="42" width="36" height="10" rx="2" fill="#ffd93d"/>
    <circle cx="50" cy="22" r="2.5" fill="#cdd8ef"/>
  </symbol>

  <!-- ============ SNOWMAN ============ -->
  <symbol id="sp-snowman" viewBox="0 0 100 100">
    <rect x="34" y="10" width="32" height="16" rx="3" fill="#33384a"/>
    <rect x="28" y="24" width="44" height="6" rx="3" fill="#33384a"/>
    <rect x="34" y="20" width="32" height="4" fill="#e2453c"/>
    <path d="M32,74 a20,14 0 0 1 36,0 z" fill="#fafafa" stroke="#dbe4ef" stroke-width="3"/>
    <circle cx="50" cy="50" r="24" fill="#fafafa" stroke="#dbe4ef" stroke-width="3"/>
    <circle cx="42" cy="46" r="3" fill="#2a2320"/><circle cx="58" cy="46" r="3" fill="#2a2320"/>
    <path d="M50,52 l14,4 l-14,4 z" fill="#ff8f2e" stroke="#e0781a" stroke-width="1.5"/>
    <circle cx="40" cy="60" r="1.6" fill="#2a2320"/><circle cx="46" cy="63" r="1.6" fill="#2a2320"/>
    <circle cx="54" cy="63" r="1.6" fill="#2a2320"/><circle cx="60" cy="60" r="1.6" fill="#2a2320"/>
    <circle cx="50" cy="76" r="2.5" fill="#e2453c"/>
  </symbol>
  <symbol id="sp-cocoa" viewBox="0 0 100 100">
    <path d="M42,20 q6,-6 0,-12 M52,20 q-6,-6 0,-12 M62,20 q6,-6 0,-12" stroke="#dbe4ef" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M30,34 h40 v30 a10,10 0 0 1 -10,10 h-20 a10,10 0 0 1 -10,-10 z" fill="#ff6b6b" stroke="#d84a4a" stroke-width="3"/>
    <path d="M70,40 q14,0 14,14 q0,10 -14,10" fill="none" stroke="#d84a4a" stroke-width="5"/>
    <ellipse cx="50" cy="36" rx="20" ry="6" fill="#6b3f28"/>
    <circle cx="44" cy="35" r="3.5" fill="#fff"/><circle cx="54" cy="34" r="3.5" fill="#fff"/><circle cx="49" cy="37" r="3" fill="#fff"/>
  </symbol>

  <!-- ============ KEY (door mechanic) ============ -->
  <symbol id="sp-key" viewBox="0 0 100 100">
    <g transform="rotate(-35 50 50)">
      <circle cx="30" cy="50" r="15" fill="none" stroke="#ffcf3d" stroke-width="9"/>
      <circle cx="30" cy="50" r="5" fill="#e0a91f"/>
      <rect x="42" y="45.5" width="38" height="9" rx="3" fill="#ffcf3d"/>
      <rect x="70" y="54" width="8" height="12" rx="2" fill="#ffcf3d"/>
      <rect x="60" y="54" width="7" height="9" rx="2" fill="#ffcf3d"/>
    </g>
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

  /* The transform to apply to an ".fx" group at a given loop phase (radians).
     Each animation moves only its part, pivoting so the rest of the body holds
     still: a flame flickers taller/shorter, tentacles sway, a ghost's skirt
     waggles side to side. */
  function fxTransform(type, cx, cy, phase) {
    if (type === "flame") {
      const k = 0.7 + 0.4 * (0.5 + 0.5 * Math.sin(phase)); // vertical flicker
      const sx = 1 + 0.16 * Math.sin(phase * 1.9 + 1); // slight width wobble
      return `translate(50 74) scale(${sx.toFixed(3)} ${k.toFixed(3)}) translate(-50 -74)`;
    }
    if (type === "sway") {
      return `rotate(${(14 * Math.sin(phase)).toFixed(2)} ${cx} ${cy})`;
    }
    if (type === "tail") {
      // skew grows with distance below the pivot, so the bottom edge waggles
      return `translate(0 30) skewX(${(7 * Math.sin(phase)).toFixed(2)}) translate(0 -30)`;
    }
    return "";
  }

  /* One animation frame of a sprite: the same art as standalone(), but with its
     ".fx" part transformed for the given phase. The 3D renderer cycles these as
     textures (a billboard can't run CSS/SMIL), exactly like chomperFrame. */
  function animFrame(id, phase, px, orient) {
    const sym = typeof document !== "undefined" && document.getElementById(id);
    if (!sym) return standalone(id, px, orient);
    const clone = sym.cloneNode(true);
    clone.querySelectorAll(".fx").forEach((g) => {
      const t = fxTransform(
        g.getAttribute("data-fx"),
        g.getAttribute("data-cx") || 50,
        g.getAttribute("data-cy") || 50,
        phase
      );
      g.setAttribute("transform", t);
    });
    const s = px || 128;
    const inner = clone.innerHTML;
    const body = orient ? `<g transform="${orient}">${inner}</g>` : inner;
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${s}" height="${s}">` +
      body +
      `</svg>`
    );
  }

  /* The animation type of a sprite's ".fx" part, or null if it has none. */
  function fxType(id) {
    const sym = typeof document !== "undefined" && document.getElementById(id);
    if (!sym) return null;
    const g = sym.querySelector(".fx");
    return g ? g.getAttribute("data-fx") : null;
  }

  return { inject, svg, standalone, chomperFrame, animFrame, fxType, SHEET };
})();

if (typeof module !== "undefined" && module.exports) module.exports = Sprites;
