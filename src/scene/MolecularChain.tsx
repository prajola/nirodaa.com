import { useEffect, useRef } from "react";

/**
 * MolecularChain — the hero's 3D object.
 *
 * A peptide backbone coiled as a helix, turning slowly in real 3D, with bits
 * streaming in from the left and landing as residues on the chain. It is the
 * hero's own sentence drawn:
 *
 *   enterprise data → molecular encoding → amino acids → long-term archive
 *
 * The residues that have already landed sit still and dim. The incoming bits
 * are the only bright things. So the motion says "this is being written",
 * which is the product, rather than "this is spinning", which is decoration.
 *
 * ── WHY NOT three.js ───────────────────────────────────────────────────────
 * Researching comparable sites for this build (Modal, Resend) showed both
 * hand-rolling their hero rather than shipping a scene graph, and the reason
 * holds here: three.js is ~800KB before you draw anything. This is a helix,
 * some spheres and a depth sort — rotate, divide by depth, paint. Real 3D,
 * a few KB, no dependency, and it starts on the first frame instead of after
 * a chunk downloads.
 *
 * ── IT STOPS WHEN NOBODY IS WATCHING ───────────────────────────────────────
 * Gated three ways: never starts under prefers-reduced-motion (a resolved
 * still frame is drawn instead, so the object is still there), stops when
 * scrolled out of view, stops when the tab is hidden.
 */

/** Residues on the visible backbone. */
const N = 46;
/** Bits in flight toward the chain at any moment. */
const BITS = 14;

/* Inverted for the light ground. On white, "bright" means saturated and
   dark — a pale mint streak would be invisible — so the incoming bits use
   the readable green (#12704A, 6.1:1) rather than the mark's fill green
   (#66D186, 1.9:1). The mark's green is correct on a dot and wrong on a
   1px line, which is the same split the stylesheet makes. */
const INK = "8,21,34";          /* the mark's ink */
const DIM = "8,21,34";          /* backbone, carried at low alpha */
const ACCENT = "18,112,74";     /* deep green — reads on white */

/** Deterministic PRNG — the object must be the same drawing on every load,
 *  or it cannot be judged and could not be tested. */
function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function MolecularChain({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const c2d = cv.getContext("2d");
    if (!c2d) return;
    /* Bound after the guard: TypeScript's narrowing on `ctx` does not survive
       into the nested draw functions, so every use inside them would be
       `possibly null`. One const keeps the type and costs nothing. */
    const g2 = c2d;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rand = rng(20260907);

    /* Helix geometry. The backbone runs along x; radius and pitch are chosen
       so roughly two turns are visible, which reads as a coil rather than as
       a sine wave. */
    const R = 0.46, SPAN = 2.5;
    const residue = (i: number) => {
      const u = i / (N - 1);
      const a = u * Math.PI * 2 * 2.1;
      return { x: (u - 0.5) * SPAN * 2, y: Math.cos(a) * R, z: Math.sin(a) * R };
    };

    /* Bits fly in from the left and land on a residue. `t` is progress; on
       arrival the residue lights and the bit is recycled further back. */
    const bits = Array.from({ length: BITS }, () => ({
      target: Math.floor(rand() * N),
      t: rand(),
      speed: 0.20 + rand() * 0.30,
      off: (rand() - 0.5) * 0.9,
    }));
    const lit = new Float32Array(N);

    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      g2.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const FOCAL = 5.2;
    function project(p: { x: number; y: number; z: number }, ax: number, ay: number, s: number) {
      const cy = Math.cos(ay), sy = Math.sin(ay);
      let X = p.x * cy + p.z * sy;
      let Z = -p.x * sy + p.z * cy;
      const cx = Math.cos(ax), sx = Math.sin(ax);
      const Y = p.y * cx - Z * sx;
      Z = p.y * sx + Z * cx;
      const d = FOCAL / (FOCAL - Z);
      return { x: w / 2 + X * s * d, y: h / 2 + Y * s * d, d };
    }

    let raf = 0, t0 = 0, elapsed = 0, last = 0;
    const INTRO = 1.3;
    const ease = (u: number) => 1 - Math.pow(1 - u, 3);

    function step(dt: number) {
      for (const b of bits) {
        b.t += dt * b.speed;
        if (b.t >= 1) {
          b.t = 0;
          lit[b.target] = 1;                       // arrival lights the residue
          b.target = Math.floor(rand() * N);       // next one to write
          b.off = (rand() - 0.5) * 0.9;
          b.speed = 0.20 + rand() * 0.30;
        }
      }
      for (let i = 0; i < N; i++) if (lit[i] > 0) lit[i] = Math.max(0, lit[i] - dt * 0.85);
    }

    function draw(time: number) {
      g2.clearRect(0, 0, w, h);
      const intro = reduced ? 1 : ease(Math.min(1, time / INTRO));
      g2.globalAlpha = intro;
      const s = Math.min(w, h) * 0.30 * (0.9 + 0.1 * intro);
      const ay = reduced ? 0.5 : time * 0.13;
      const ax = -0.22 + (reduced ? 0 : Math.sin(time * 0.09) * 0.07);

      const P = Array.from({ length: N }, (_, i) => project(residue(i), ax, ay, s));

      // Backbone. Drawn as segments so each takes its own depth.
      g2.lineWidth = 1;
      for (let i = 0; i < N - 1; i++) {
        const d = (P[i].d + P[i + 1].d) / 2;
        g2.strokeStyle = `rgba(${DIM},${0.22 * d})`;
        g2.beginPath();
        g2.moveTo(P[i].x, P[i].y);
        g2.lineTo(P[i + 1].x, P[i + 1].y);
        g2.stroke();
      }

      // Bits in flight: a short streak arriving at its residue.
      for (const b of bits) {
        const tgt = P[b.target];
        const from = { x: -w * 0.18, y: h / 2 + b.off * s };
        const x = from.x + (tgt.x - from.x) * b.t;
        const y = from.y + (tgt.y - from.y) * b.t;
        const back = Math.max(0, b.t - 0.16);
        const bx = from.x + (tgt.x - from.x) * back;
        const by = from.y + (tgt.y - from.y) * back;
        const g = g2.createLinearGradient(bx, by, x, y);
        g.addColorStop(0, `rgba(${ACCENT},0)`);
        g.addColorStop(1, `rgba(${ACCENT},0.9)`);
        g2.strokeStyle = g;
        g2.lineWidth = 1.2;
        g2.beginPath();
        g2.moveTo(bx, by);
        g2.lineTo(x, y);
        g2.stroke();
      }

      // Residues, far to near, so a near one overlaps the ones behind it.
      const order = P.map((p, i) => ({ p, i })).sort((a, b) => a.p.d - b.p.d);
      for (const { p, i } of order) {
        const l = lit[i];
        const r = (1.5 + l * 2.4) * p.d;
        g2.beginPath();
        g2.arc(p.x, p.y, r, 0, Math.PI * 2);
        // A residue that has just been written glows; the rest are structure.
        g2.fillStyle = l > 0.02
          ? `rgba(${ACCENT},${Math.min(0.95, 0.45 + l * 0.5)})`
          : `rgba(${INK},${Math.min(0.42, 0.16 * p.d)})`;
        g2.fill();
      }
      g2.globalAlpha = 1;
    }

    function frame(now: number) {
      if (!t0) { t0 = now; last = now; }
      const dt = Math.min(0.05, (now - last) / 1000);  // a backgrounded tab
      last = now;                                       // must not teleport
      elapsed = (now - t0) / 1000;
      step(dt);
      draw(elapsed);
      raf = requestAnimationFrame(frame);
    }

    let visible = true;
    const start = () => {
      if (reduced || raf || !visible || document.hidden) return;
      t0 = performance.now() - elapsed * 1000;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start(); else stop();
    }, { threshold: 0.01 });
    io.observe(cv);

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    const ro = new ResizeObserver(() => { resize(); draw(elapsed); });
    ro.observe(cv);

    draw(0);
    start();
    return () => {
      stop(); io.disconnect(); ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // Decorative: the hero states everything this shows, in text.
  return <canvas ref={ref} className={`nr-chain ${className}`} aria-hidden="true" role="presentation" />;
}
