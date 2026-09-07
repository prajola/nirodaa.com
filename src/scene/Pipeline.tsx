import { useEffect, useRef, useState } from "react";
import { HOW } from "@/content";

/**
 * Pipeline — the six stages, as one 3D scene that morphs.
 *
 * A single particle system with six target layouts. The particles do not
 * cross-fade between pictures; they MOVE from one arrangement to the next, so
 * the same points that were data blocks become the bitstream, then coil into
 * the chain, then uncoil and reassemble. That is the whole point of doing
 * this in 3D rather than as six icons: the viewer can see it is the same
 * data throughout, which is the one thing a reader needs to believe about an
 * archive — what comes out is what went in.
 *
 *   Select     a loose grid of blocks            (data as it sits today)
 *   Encode     the grid straightens to a stream  (binary, in order)
 *   Synthesize the stream coils into a helix     (the molecular medium)
 *   Preserve   the helix compacts and stills     (held, nothing running)
 *   Retrieve   the helix uncoils back to stream  (read back out)
 *   Verify     the stream returns to the grid    (identical, and checked)
 *
 * Select and Verify are the SAME layout on purpose, and so are Encode and
 * Retrieve. The symmetry is the argument.
 *
 * ── DRIVEN BY SCROLL, OPERABLE BY CLICK ───────────────────────────────────
 * The active stage advances as the step list scrolls past — the pattern the
 * research for this build found on comparable sites. But scroll alone is not
 * an interface: each step is also a real <button>, so the sequence is
 * reachable by keyboard and by anyone who wants to jump straight to stage 4.
 */

const N = 96;
const INK = "8,21,34";
const GREEN = "18,112,74";
const SOFT = "102,209,134";

type P = { x: number; y: number; z: number };

/** Deterministic — the same drawing on every load, so it can be judged. */
function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The six target layouts. Index i is the same particle in every one. */
function layouts(): P[][] {
  const rand = rng(20260907);
  const jitter = Array.from({ length: N }, () => ({
    a: (rand() - 0.5) * 0.26, b: (rand() - 0.5) * 0.26, c: (rand() - 0.5) * 0.26,
  }));

  const grid = (spread: number): P[] => {
    // 4 x 4 x 6 block cluster — "data as it currently sits".
    const out: P[] = [];
    for (let i = 0; i < N; i++) {
      const x = i % 6, y = Math.floor(i / 6) % 4, z = Math.floor(i / 24) % 4;
      out.push({
        x: (x - 2.5) * 0.30 * spread + jitter[i].a * 0.5,
        y: (y - 1.5) * 0.30 * spread + jitter[i].b * 0.5,
        z: (z - 1.5) * 0.30 * spread + jitter[i].c * 0.5,
      });
    }
    return out;
  };

  const stream = (): P[] =>
    Array.from({ length: N }, (_, i) => ({
      x: (i / (N - 1) - 0.5) * 3.0,
      y: jitter[i].b * 0.30,
      z: jitter[i].c * 0.30,
    }));

  const helix = (turns: number, radius: number, span: number): P[] =>
    Array.from({ length: N }, (_, i) => {
      const u = i / (N - 1);
      const a = u * Math.PI * 2 * turns;
      return { x: (u - 0.5) * span, y: Math.cos(a) * radius, z: Math.sin(a) * radius };
    });

  return [
    grid(1),                    // 0 Select
    stream(),                   // 1 Encode
    helix(3.2, 0.52, 2.6),      // 2 Synthesize
    helix(4.6, 0.34, 1.7),      // 3 Preserve — tighter, compacted
    stream(),                   // 4 Retrieve
    grid(1),                    // 5 Verify
  ];
}

export default function Pipeline() {
  /* Three inputs, one resolved stage.
     `base`    what scroll last set, and what a click pins until you scroll on
     `preview` a transient override from hover or keyboard focus
     Hover wins while it lasts, then hands control straight back to scroll —
     so pointing at step 5 shows step 5, and moving away does not leave the
     scene stranded on a stage you are no longer reading. */
  const [base, setBase] = useState(0);
  const [preview, setPreview] = useState<number | null>(null);
  const active = preview ?? base;
  /* Hover is only an input where hovering is real. On a touch screen
     mouseenter can fire on a tap while mouseleave never does, which would
     pin the scene on whatever was last touched. */
  const canHover = typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const activeRef = useRef(0);
  activeRef.current = active;

  /* Scroll drives the stage. Each step reports when it reaches the reading
     band; the last one to do so wins. */
  useEffect(() => {
    const els = stepRefs.current.filter(Boolean) as HTMLLIElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = els.indexOf(e.target as HTMLLIElement);
          if (i >= 0) setBase(i);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const c = cv.getContext("2d");
    if (!c) return;
    const g = c;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const L = layouts();
    // Current positions start resolved at stage 0 so the first frame is not
    // an explosion of particles flying in from the origin.
    const cur: P[] = L[0].map((p) => ({ ...p }));

    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(1, Math.round(r.width)); h = Math.max(1, Math.round(r.height));
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const FOCAL = 5.0;
    const project = (p: P, ax: number, ay: number, s: number) => {
      const cy = Math.cos(ay), sy = Math.sin(ay);
      let X = p.x * cy + p.z * sy;
      let Z = -p.x * sy + p.z * cy;
      const cx = Math.cos(ax), sx = Math.sin(ax);
      const Y = p.y * cx - Z * sx;
      Z = p.y * sx + Z * cx;
      const d = FOCAL / (FOCAL - Z);
      return { x: w / 2 + X * s * d, y: h / 2 + Y * s * d, d };
    };

    let raf = 0, last = 0, t = 0;

    function frame(now: number) {
      if (!last) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now; t += dt;

      const target = L[activeRef.current];
      // Critically damped-ish approach: fast enough to feel responsive to a
      // scroll, slow enough that the morph is legible as a movement.
      const k = 1 - Math.pow(0.0016, dt);
      for (let i = 0; i < N; i++) {
        cur[i].x += (target[i].x - cur[i].x) * k;
        cur[i].y += (target[i].y - cur[i].y) * k;
        cur[i].z += (target[i].z - cur[i].z) * k;
      }
      draw();
      raf = requestAnimationFrame(frame);
    }

    function draw() {
      g.clearRect(0, 0, w, h);
      const s = Math.min(w, h) * 0.30;
      const stage = activeRef.current;
      // Preserve is the one stage that holds still — the archive is not doing
      // anything, and the visual should not either.
      const spin = stage === 3 ? 0.02 : 0.13;
      const ay = reduced ? 0.6 : t * spin;
      const ax = -0.26;

      const P2 = cur.map((p) => project(p, ax, ay, s));

      // Chain bonds, only while the particles form a chain.
      if (stage >= 1 && stage <= 4) {
        g.lineWidth = 1;
        for (let i = 0; i < N - 1; i++) {
          const d = (P2[i].d + P2[i + 1].d) / 2;
          g.strokeStyle = `rgba(${stage === 2 || stage === 3 ? GREEN : INK},${0.16 * d})`;
          g.beginPath(); g.moveTo(P2[i].x, P2[i].y); g.lineTo(P2[i + 1].x, P2[i + 1].y); g.stroke();
        }
      }

      const order = P2.map((p, i) => ({ p, i })).sort((a, b) => a.p.d - b.p.d);
      for (const { p, i } of order) {
        // Molecular stages are green; digital stages are ink. Verify adds a
        // soft green ring — the data is back, and it has been checked.
        const molecular = stage === 2 || stage === 3;
        const verified = stage === 5;
        const r = (molecular ? 2.0 : 2.4) * p.d;
        g.beginPath(); g.arc(p.x, p.y, r, 0, Math.PI * 2);
        g.fillStyle = molecular
          ? `rgba(${GREEN},${Math.min(0.9, 0.5 * p.d)})`
          : `rgba(${INK},${Math.min(0.8, 0.42 * p.d)})`;
        g.fill();
        if (verified && i % 6 === 0) {
          g.beginPath(); g.arc(p.x, p.y, r + 3.2, 0, Math.PI * 2);
          g.strokeStyle = `rgba(${SOFT},0.55)`; g.lineWidth = 1; g.stroke();
        }
      }
    }

    let visible = true;
    const start = () => { if (raf || !visible || document.hidden) return; last = 0; raf = requestAnimationFrame(frame); };
    const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }, { threshold: 0.01 });
    io.observe(cv);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    const ro = new ResizeObserver(() => { resize(); draw(); });
    ro.observe(cv);

    draw();
    // Under reduced motion the scene still updates when the stage changes —
    // it just snaps rather than travels, and nothing spins.
    if (reduced) {
      const snap = () => { const T = L[activeRef.current]; for (let i = 0; i < N; i++) cur[i] = { ...T[i] }; draw(); };
      const id = window.setInterval(snap, 120);
      return () => { window.clearInterval(id); io.disconnect(); ro.disconnect(); document.removeEventListener("visibilitychange", onVis); };
    }
    start();
    return () => { stop(); io.disconnect(); ro.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  return (
    <div className="nr-pipe">
      <ol className="nr-pipe-steps">
        {HOW.steps.map((s, i) => (
          <li key={s.tag} ref={(el) => { stepRefs.current[i] = el; }}>
            <button
              type="button"
              className="nr-pipe-step"
              aria-current={i === active ? "step" : undefined}
              onClick={() => { setPreview(null); setBase(i); }}
              onMouseEnter={canHover ? () => setPreview(i) : undefined}
              onMouseLeave={canHover ? () => setPreview(null) : undefined}
              /* Focus previews too, so tabbing through the list drives the
                 scene exactly as hovering does. */
              onFocus={() => setPreview(i)}
              onBlur={() => setPreview(null)}
            >
              <span className="nr-pipe-n">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <strong>{s.tag}</strong>
                <em>{s.body}</em>
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div className="nr-pipe-stage">
        {/* Decorative: the six stages are fully described in the list beside
            it, so nothing here is the only source of anything. */}
        <canvas ref={canvasRef} aria-hidden="true" role="presentation" />
        <p className="nr-pipe-label">
          <span>{String(active + 1).padStart(2, "0")}</span> {HOW.steps[active].tag}
        </p>
      </div>
    </div>
  );
}
