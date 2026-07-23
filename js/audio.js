/* Tiny WebAudio noisemaker — no audio files, nothing to download. */

const Sound = (function () {
  let ctx = null;
  let muted = false;

  function ensure() {
    if (!ctx) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freq, start, duration, type, gain) {
    const ac = ensure();
    if (!ac || muted) return;
    const osc = ac.createOscillator();
    const vol = ac.createGain();
    const t0 = ac.currentTime + start;

    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, t0);
    vol.gain.setValueAtTime(0.0001, t0);
    vol.gain.exponentialRampToValueAtTime(gain || 0.18, t0 + 0.015);
    vol.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    osc.connect(vol).connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  function sweep(from, to, start, duration, gain) {
    const ac = ensure();
    if (!ac || muted) return;
    const osc = ac.createOscillator();
    const vol = ac.createGain();
    const t0 = ac.currentTime + start;

    osc.type = "triangle";
    osc.frequency.setValueAtTime(from, t0);
    osc.frequency.exponentialRampToValueAtTime(to, t0 + duration);
    vol.gain.setValueAtTime(0.0001, t0);
    vol.gain.exponentialRampToValueAtTime(gain || 0.16, t0 + 0.02);
    vol.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    osc.connect(vol).connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  /* Each pickup in a level rises in pitch, so a streak sounds like a little tune. */
  function pickup(index) {
    const scale = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5];
    tone(scale[Math.min(index || 0, scale.length - 1)], 0, 0.18, "triangle", 0.2);
    tone(scale[Math.min(index || 0, scale.length - 1)] * 2, 0.02, 0.1, "sine", 0.08);
  }

  function step() {
    tone(180, 0, 0.05, "sine", 0.05);
  }

  function bump() {
    tone(90, 0, 0.09, "square", 0.05);
  }

  function levelClear() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => tone(f, i * 0.11, 0.35, "triangle", 0.2));
    sweep(400, 1400, 0.45, 0.5, 0.12);
  }

  function fanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5];
    notes.forEach((f, i) => tone(f, i * 0.14, 0.45, "triangle", 0.22));
  }

  function unlock() {
    ensure();
  }

  function setMuted(value) {
    muted = !!value;
  }

  function isMuted() {
    return muted;
  }

  return { pickup, step, bump, levelClear, fanfare, unlock, setMuted, isMuted };
})();
