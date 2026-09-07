import { useEffect, useRef } from "react";

/**
 * MolecularChip — the hero's 3D object.
 *
 * A storage chip, turning in real 3D, being written to. Data arrives from the
 * left as bits and lands in the die as a lit cell, so the object draws the
 * back half of the hero's own sentence:
 *
 *   enterprise data → molecular encoding → amino acids → long-term archive
 *
 * ── WHY A CHIP, WHEN THE MEDIUM IS NOT SILICON ─────────────────────────────
 * Because the chip is what an archive LOOKS like to the person buying one,
 * and the entire pitch is that this slots into that role. Drawn as bare
 * chemistry the product reads as an experiment; drawn as a chip being
 * written to it reads as infrastructure with a different substrate — which
 * is the positioning. The die is deliberately not a silicon lattice: the
 * cells sit on peptide backbones that run the length of the package, which
 * is where the molecule shows, rather than in an ornament beside it.
 *
 * ── WHY NOT three.js, AND WHY NOT A VIDEO ──────────────────────────────────
 * three.js is ~800KB before anything is drawn. This is a box, some pins and a
 * depth sort — rotate, divide by depth, paint — so it is a few KB with no
 * dependency, and it starts on the first frame instead of after a chunk
 * downloads. That reasoning is inherited from MolecularChain, which this
 * replaces in the hero.
 *
 * A rendered video would be worse still: hundreds of KB to megabytes, fixed
 * resolution on a display this thing is 500px wide on, a decode on the
 * critical path, and no way to honour prefers-reduced-motion beyond not
 * playing it at all. Canvas gives a still frame for free — see below.
 *
 * ── IT STOPS WHEN NOBODY IS WATCHING ───────────────────────────────────────
 * Gated three ways: never starts under prefers-reduced-motion (a resolved
 * still frame is drawn instead, so the object is still there), stops when
 * scrolled out of view, stops when the tab is hidden.
 */

/** Storage cells across the die, along the package's long axis. */
const COLS = 14;
/** Cell rows across the die. */
const ROWS = 6;
/** Bits in flight toward the chip at any moment. */
const BITS = 10;
/** Contact pins per side. */
const PINS = 13;

/* Inverted for the light ground, exactly as MolecularChain documents it: on
   white, "bright" means saturated and dark, so the written cells use the
   readable green (#12704A, 6.1:1) rather than the mark's fill green
   (#66D186, 1.9:1), which is correct on a dot and wrong on a 1px line. */
const INK = "8,21,34";        /* the mark's ink */
const ACCENT = "18,112,74";   /* deep green — reads on white */

/* Package geometry, in object units. Wide, shallow and thin: the proportions
   of a memory package rather than a cube, which is what stops it reading as
   a generic spinning box. */
const HW = 1.16;   /* half-width  — the long axis, where the bits feed in */
const HH = 0.15;   /* half-height — thickness */
const HD = 0.74;   /* half-depth */

/* Screen-up is NEGATIVE y: the projection below adds Y to a canvas
   coordinate, and canvas y grows downward. Naming it once here keeps every
   later "top face" from having to re-derive that. */
const TOP = -HH;

type P3 = { x: number; y: number; z: number };
type P2 = { x: number; y: number; d: number };

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

export default function MolecularChip({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const c2d = cv.getContext("2d");
    if (!c2d) return;
    /* Bound after the guard: TypeScript's narrowing on the context does not
       survive into the nested draw functions, so every use inside them would
       be `possibly null`. One const keeps the type and costs nothing. */
    const g2 = c2d;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rand = rng(20260907);

    /* ── Cells ──────────────────────────────────────────────────────────────
       The die does not fill the package — a real one leaves a margin, and the
       margin is what makes the outline read as packaging rather than as a
       flat rectangle with dots on it. */
    const DIE_W = HW * 0.74, DIE_D = HD * 0.62;
    /* COLS and ROWS are const literals above, so no divide-by-zero guard:
       tsc rejects the comparison as unreachable rather than allowing a
       defensive branch that can never run. */
    const cell = (c: number, r: number): P3 => ({
      x: (c / (COLS - 1) - 0.5) * DIE_W * 2,
      y: TOP,
      z: (r / (ROWS - 1) - 0.5) * DIE_D * 2,
    });
    /** Written-ness per cell, decaying — the glow of a recent write. */
    const lit = new Float32Array(COLS * ROWS);

    /* Bits fly in from the left and land on a cell. `t` is progress; on
       arrival the cell lights and the bit is recycled further back. */
    const bits = Array.from({ length: BITS }, () => ({
      target: Math.floor(rand() * COLS * ROWS),
      t: rand(),
      speed: 0.22 + rand() * 0.26,
      off: (rand() - 0.5) * 0.9,
    }));

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
    function project(p: P3, ax: number, ay: number, s: number): P2 {
      const cy = Math.cos(ay), sy = Math.sin(ay);
      const X = p.x * cy + p.z * sy;
      let Z = -p.x * sy + p.z * cy;
      const cx = Math.cos(ax), sx = Math.sin(ax);
      const Y = p.y * cx - Z * sx;
      Z = p.y * sx + Z * cx;
      const d = FOCAL / (FOCAL - Z);
      return { x: w / 2 + X * s * d, y: h / 2 + Y * s * d, d };
    }

    /* The eight corners, as sign triples. Faces index into this. */
    const CORNER: P3[] = [];
    for (const sy of [-1, 1]) for (const sz of [-1, 1]) for (const sx of [-1, 1]) {
      CORNER.push({ x: sx * HW, y: sy * HH, z: sz * HD });
    }
    const ci = (sx: number, sy: number, sz: number) =>
      ((sy > 0 ? 1 : 0) << 2) | ((sz > 0 ? 1 : 0) << 1) | (sx > 0 ? 1 : 0);
    /* Winding does not matter and nothing is back-face culled: the faces are
       OPAQUE and painted far-to-near, which for a convex solid is exact.
       This was translucent at first and the chip read as an empty glass tray
       — you saw its own far wall through the lid, and the die appeared to
       float inside a box rather than sit on a package.

       The tones are the stylesheet's own surfaces, so the chip is lit as if
       from the page: lid at paper white, walls one step down, underside two.
       That is the whole shading model — three flats and the outline — which
       is what keeps it a drawing rather than a render. */
    const FACES: { q: number[]; fill: string }[] = [
      { q: [ci(-1, -1, -1), ci(1, -1, -1), ci(1, -1, 1), ci(-1, -1, 1)], fill: "#FFFFFF" }, // lid
      { q: [ci(-1, 1, -1), ci(1, 1, -1), ci(1, 1, 1), ci(-1, 1, 1)], fill: "#E2E6EA" },     // underside
      { q: [ci(-1, -1, 1), ci(1, -1, 1), ci(1, 1, 1), ci(-1, 1, 1)], fill: "#EFF1F3" },     // front
      { q: [ci(-1, -1, -1), ci(1, -1, -1), ci(1, 1, -1), ci(-1, 1, -1)], fill: "#EFF1F3" }, // back
      { q: [ci(-1, -1, -1), ci(-1, -1, 1), ci(-1, 1, 1), ci(-1, 1, -1)], fill: "#E8EBEE" }, // left
      { q: [ci(1, -1, -1), ci(1, -1, 1), ci(1, 1, 1), ci(1, 1, -1)], fill: "#E8EBEE" },     // right
    ];

    let raf = 0, t0 = 0, elapsed = 0, last = 0;
    const INTRO = 1.3;
    const ease = (u: number) => 1 - Math.pow(1 - u, 3);

    function step(dt: number) {
      for (const b of bits) {
        b.t += dt * b.speed;
        if (b.t >= 1) {
          b.t = 0;
          lit[b.target] = 1;                                  // arrival writes
          b.target = Math.floor(rand() * COLS * ROWS);        // next cell
          b.off = (rand() - 0.5) * 0.9;
          b.speed = 0.22 + rand() * 0.26;
        }
      }
      for (let i = 0; i < lit.length; i++) {
        if (lit[i] > 0) lit[i] = Math.max(0, lit[i] - dt * 0.5);
      }
    }

    function draw(time: number) {
      g2.clearRect(0, 0, w, h);
      const intro = reduced ? 1 : ease(Math.min(1, time / INTRO));
      g2.globalAlpha = intro;

      const s = Math.min(w, h) * 0.345 * (0.9 + 0.1 * intro);
      /* Rotation about the vertical only, plus a slow breathing tilt. The
         chip never rolls past level, so its top face is always the top face
         and the die never has to be hidden. */
      const ay = reduced ? 0.62 : 0.62 + time * 0.11;
      const ax = -0.34 + (reduced ? 0 : Math.sin(time * 0.09) * 0.05);
      const at = (p: P3) => project(p, ax, ay, s);

      // ── Contact shadow ──────────────────────────────────────────────────
      // Grounds the package. Without it an opaque box on white floats.
      const gnd = at({ x: 0, y: HH, z: 0 });
      const sh = g2.createRadialGradient(gnd.x, gnd.y + s * 0.10, 0, gnd.x, gnd.y + s * 0.10, s * 1.5);
      sh.addColorStop(0, `rgba(${INK},0.13)`);
      sh.addColorStop(1, `rgba(${INK},0)`);
      g2.save();
      g2.translate(gnd.x, gnd.y + s * 0.10);
      g2.scale(1, 0.24);                       // an ellipse, not a halo
      g2.translate(-gnd.x, -(gnd.y + s * 0.10));
      g2.fillStyle = sh;
      g2.fillRect(gnd.x - s * 1.6, gnd.y - s * 1.6, s * 3.2, s * 3.2);
      g2.restore();

      /* ── Contact pins ─────────────────────────────────────────────────────
         Split around the body, not drawn in one pass. The pins sit at
         mid-thickness, so the near row is INSIDE the package's silhouette
         until it clears the edge: drawn before the body it vanishes behind
         the front wall, and drawn after it, the far row shows through a
         package that is deliberately opaque.

         Which row is near is a question about the side's normal. For a face
         normal (0,0,sz) the projection's depth term reduces to sz·cos(ay)·
         cos(ax), so its sign is the test — no dot product needed. */
      const near = Math.cos(ay) * Math.cos(ax) > 0 ? 1 : -1;
      const pins = (sz: number) => {
        g2.lineWidth = 1.5;
        for (let i = 0; i < PINS; i++) {
          const x = (i / (PINS - 1) - 0.5) * HW * 1.72;
          const a = at({ x, y: 0.04, z: sz * HD });
          const b = at({ x, y: 0.04, z: sz * (HD + 0.19) });
          g2.strokeStyle = `rgba(${INK},${0.34 * a.d})`;
          g2.beginPath();
          g2.moveTo(a.x, a.y);
          g2.lineTo(b.x, b.y);
          g2.stroke();
        }
      };
      pins(-near);

      // ── Package, far face to near face ──────────────────────────────────
      const C = CORNER.map(at);
      const faces = FACES
        .map((f) => ({ f, d: (C[f.q[0]].d + C[f.q[1]].d + C[f.q[2]].d + C[f.q[3]].d) / 4 }))
        .sort((a, b) => a.d - b.d);
      for (const { f, d } of faces) {
        g2.beginPath();
        g2.moveTo(C[f.q[0]].x, C[f.q[0]].y);
        for (let k = 1; k < 4; k++) g2.lineTo(C[f.q[k]].x, C[f.q[k]].y);
        g2.closePath();
        g2.fillStyle = f.fill;
        g2.fill();
        g2.lineWidth = 1;
        g2.strokeStyle = `rgba(${INK},${0.24 * d})`;
        g2.stroke();
      }
      pins(near);   // the row in front of the package, so over the top of it

      // ── Die outline on the top face ─────────────────────────────────────
      const die = [
        at({ x: -DIE_W * 1.14, y: TOP, z: -DIE_D * 1.3 }),
        at({ x: DIE_W * 1.14, y: TOP, z: -DIE_D * 1.3 }),
        at({ x: DIE_W * 1.14, y: TOP, z: DIE_D * 1.3 }),
        at({ x: -DIE_W * 1.14, y: TOP, z: DIE_D * 1.3 }),
      ];
      g2.beginPath();
      g2.moveTo(die[0].x, die[0].y);
      for (let k = 1; k < 4; k++) g2.lineTo(die[k].x, die[k].y);
      g2.closePath();
      g2.strokeStyle = `rgba(${INK},0.16)`;
      g2.lineWidth = 1;
      g2.stroke();

      // ── The backbone the cells sit on ───────────────────────────────────
      // One line per row, so the die reads as chains rather than as a grid.
      for (let r = 0; r < ROWS; r++) {
        g2.beginPath();
        for (let c = 0; c < COLS; c++) {
          const p = at(cell(c, r));
          if (c === 0) g2.moveTo(p.x, p.y); else g2.lineTo(p.x, p.y);
        }
        g2.strokeStyle = `rgba(${INK},0.10)`;
        g2.lineWidth = 1;
        g2.stroke();
      }

      // ── Bits in flight ──────────────────────────────────────────────────
      // A short streak arriving at the cell it is about to write.
      for (const b of bits) {
        const tgt = at(cell(b.target % COLS, Math.floor(b.target / COLS)));
        const from = { x: -w * 0.16, y: h / 2 + b.off * s };
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

      // ── Cells, far to near ──────────────────────────────────────────────
      const cells = [];
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) cells.push({ p: at(cell(c, r)), i: r * COLS + c });
      }
      cells.sort((a, b) => a.p.d - b.p.d);
      for (const { p, i } of cells) {
        const l = lit[i];
        /* A written cell blooms. This is the one place the mark's fill green
           is correct — it is a halo, not type, which is the distinction the
           stylesheet draws — and it is what makes a write read as an event
           at this size rather than as a dot changing colour. */
        if (l > 0.02) {
          const rg = g2.createRadialGradient(p.x, p.y, 0, p.x, p.y, 9 * p.d);
          rg.addColorStop(0, `rgba(102,209,134,${0.5 * l})`);
          rg.addColorStop(1, "rgba(102,209,134,0)");
          g2.fillStyle = rg;
          g2.fillRect(p.x - 9 * p.d, p.y - 9 * p.d, 18 * p.d, 18 * p.d);
        }
        g2.beginPath();
        g2.arc(p.x, p.y, (1.5 + l * 2.2) * p.d, 0, Math.PI * 2);
        // A cell just written glows; the rest are capacity.
        g2.fillStyle = l > 0.02
          ? `rgba(${ACCENT},${Math.min(0.95, 0.45 + l * 0.5)})`
          : `rgba(${INK},${Math.min(0.34, 0.13 * p.d)})`;
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

    /* Under reduced motion this is the ONLY draw: a resolved frame, mid-write,
       with a scatter of cells already written. The object is present and
       legible; it simply does not move. */
    if (reduced) for (let i = 0; i < lit.length; i += 5) lit[i] = 0.55;
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
