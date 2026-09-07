import { useEffect, useRef, useState } from "react";
import { INGEST } from "@/content";

/**
 * Ecosystem — ingestion, classification and the platform between them.
 *
 * An outer ring of ingestion sources, a hub, and an inner ring of
 * classification tiers, with packets travelling source → hub → tier
 * continuously. It draws the section's actual claim: data arrives from
 * wherever it already lives, and comes out the other side sorted.
 *
 * The two rings sit in different planes on purpose. Coplanar rings read as
 * a flat target diagram; crossed rings read as a system with an inside and
 * an outside, which is what makes the hub look like it is doing something
 * rather than just being the middle of a circle.
 *
 * ── THE CHIPS ARE THE LABELS ───────────────────────────────────────────────
 * Fourteen labels drawn into the canvas would be unreadable at any size the
 * section can afford, and they would not be selectable, translatable or
 * reachable by a screen reader. So the chips beside the scene stay the real
 * content, and hovering one lights its node and fires a packet down its
 * path. The canvas carries the topology; the list carries the words.
 */

const HUB = "8,21,34";
const GREEN = "18,112,74";
const SOFT = "102,209,134";

type V = { x: number; y: number; z: number };

const SOURCES = INGEST.ingestion.length;   // 7
const TIERS = INGEST.classes.length;       // 7

/** Outer ring, tilted one way; inner ring, tilted the other. */
function sourcePos(i: number): V {
  const a = (i / SOURCES) * Math.PI * 2;
  const r = 1.62;
  return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.42, z: Math.sin(a) * r * 0.86 };
}
function tierPos(i: number): V {
  const a = (i / TIERS) * Math.PI * 2 + Math.PI / TIERS;
  const r = 0.86;
  return { x: Math.cos(a) * r * 0.5, y: Math.sin(a) * r, z: Math.cos(a) * r * 0.8 };
}

type Packet = { src: number; tier: number; t: number; speed: number };

function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function Ecosystem() {
  /* `hot` is what the reader is pointing at: a source index, a tier index, or
     nothing. Hover only — this scene has no scroll-driven state, because
     unlike the pipeline it is not a sequence. */
  const [hot, setHot] = useState<{ kind: "src" | "tier"; i: number } | null>(null);
  const hotRef = useRef(hot);
  hotRef.current = hot;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canHover = typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const c = cv.getContext("2d");
    if (!c) return;
    const g = c;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rand = rng(20260907);
    const S = Array.from({ length: SOURCES }, (_, i) => sourcePos(i));
    const T = Array.from({ length: TIERS }, (_, i) => tierPos(i));
    const srcLit = new Float32Array(SOURCES);
    const tierLit = new Float32Array(TIERS);

    const packets: Packet[] = Array.from({ length: 7 }, () => ({
      src: Math.floor(rand() * SOURCES),
      tier: Math.floor(rand() * TIERS),
      t: rand() * 2,
      speed: 0.30 + rand() * 0.25,
    }));

    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(1, Math.round(r.width)); h = Math.max(1, Math.round(r.height));
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const FOCAL = 5.4;
    const project = (p: V, ax: number, ay: number, s: number) => {
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

    function step(dt: number) {
      for (const p of packets) {
        p.t += dt * p.speed;
        if (p.t >= 2) {
          // Arrived at its tier: light it, then start again from a new source.
          tierLit[p.tier] = 1;
          p.t = 0;
          p.src = Math.floor(rand() * SOURCES);
          p.tier = Math.floor(rand() * TIERS);
          p.speed = 0.30 + rand() * 0.25;
        } else if (p.t >= 1 && p.t - dt * p.speed < 1) {
          srcLit[p.src] = 1;   // passed through the hub
        }
      }
      for (let i = 0; i < SOURCES; i++) if (srcLit[i] > 0) srcLit[i] = Math.max(0, srcLit[i] - dt * 1.1);
      for (let i = 0; i < TIERS; i++) if (tierLit[i] > 0) tierLit[i] = Math.max(0, tierLit[i] - dt * 1.1);
    }

    function draw() {
      g.clearRect(0, 0, w, h);
      const s = Math.min(w, h) * 0.27;
      const ay = reduced ? 0.6 : t * 0.10;
      const ax = -0.30;
      const hub = project({ x: 0, y: 0, z: 0 }, ax, ay, s);
      const PS = S.map((p) => project(p, ax, ay, s));
      const PT = T.map((p) => project(p, ax, ay, s));
      const H = hotRef.current;

      // Spokes. Every source and every tier is wired to the hub — that is the
      // claim, so it is drawn rather than implied.
      g.lineWidth = 1;
      PS.forEach((p, i) => {
        const on = H?.kind === "src" && H.i === i;
        g.strokeStyle = `rgba(${on ? GREEN : HUB},${on ? 0.5 : 0.13 * p.d})`;
        g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(hub.x, hub.y); g.stroke();
      });
      PT.forEach((p, i) => {
        const on = H?.kind === "tier" && H.i === i;
        g.strokeStyle = `rgba(${on ? GREEN : HUB},${on ? 0.5 : 0.13 * p.d})`;
        g.beginPath(); g.moveTo(hub.x, hub.y); g.lineTo(p.x, p.y); g.stroke();
      });

      // Packets: first leg source→hub, second leg hub→tier.
      for (const p of packets) {
        const leg = p.t < 1 ? 0 : 1;
        const u = leg === 0 ? p.t : p.t - 1;
        const a = leg === 0 ? PS[p.src] : hub;
        const b = leg === 0 ? hub : PT[p.tier];
        const x = a.x + (b.x - a.x) * u, y = a.y + (b.y - a.y) * u;
        const back = Math.max(0, u - 0.3);
        const bx = a.x + (b.x - a.x) * back, by = a.y + (b.y - a.y) * back;
        const grd = g.createLinearGradient(bx, by, x, y);
        grd.addColorStop(0, `rgba(${GREEN},0)`);
        grd.addColorStop(1, `rgba(${GREEN},0.85)`);
        g.strokeStyle = grd; g.lineWidth = 1.4;
        g.beginPath(); g.moveTo(bx, by); g.lineTo(x, y); g.stroke();
        g.beginPath(); g.arc(x, y, 2, 0, Math.PI * 2);
        g.fillStyle = `rgba(${GREEN},0.95)`; g.fill();
      }

      // Tier nodes, then sources, then the hub last so it always sits on top.
      PT.forEach((p, i) => {
        const on = H?.kind === "tier" && H.i === i;
        const l = Math.max(tierLit[i], on ? 1 : 0);
        g.beginPath(); g.arc(p.x, p.y, (2.6 + l * 2.2) * p.d, 0, Math.PI * 2);
        g.fillStyle = l > 0.02 ? `rgba(${GREEN},${0.5 + l * 0.45})` : `rgba(${HUB},${0.28 * p.d})`;
        g.fill();
      });
      PS.forEach((p, i) => {
        const on = H?.kind === "src" && H.i === i;
        const l = Math.max(srcLit[i], on ? 1 : 0);
        g.beginPath(); g.arc(p.x, p.y, (3.4 + l * 2.6) * p.d, 0, Math.PI * 2);
        g.fillStyle = l > 0.02 ? `rgba(${GREEN},${0.55 + l * 0.4})` : `rgba(${HUB},${0.42 * p.d})`;
        g.fill();
        if (on) {
          g.beginPath(); g.arc(p.x, p.y, 9 * p.d, 0, Math.PI * 2);
          g.strokeStyle = `rgba(${SOFT},0.65)`; g.lineWidth = 1; g.stroke();
        }
      });
      g.beginPath(); g.arc(hub.x, hub.y, 7.5, 0, Math.PI * 2);
      g.fillStyle = `rgba(${HUB},0.92)`; g.fill();
      g.beginPath(); g.arc(hub.x, hub.y, 12.5, 0, Math.PI * 2);
      g.strokeStyle = `rgba(${HUB},0.20)`; g.lineWidth = 1; g.stroke();
    }

    function frame(now: number) {
      if (!last) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now; t += dt;
      step(dt); draw();
      raf = requestAnimationFrame(frame);
    }

    let visible = true;
    const start = () => { if (reduced || raf || !visible || document.hidden) return; last = 0; raf = requestAnimationFrame(frame); };
    const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }, { threshold: 0.01 });
    io.observe(cv);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    const ro = new ResizeObserver(() => { resize(); draw(); });
    ro.observe(cv);

    draw();
    start();
    // Under reduced motion the topology is still drawn, and hover still
    // lights a node — it simply does not animate packets.
    if (reduced) {
      const id = window.setInterval(draw, 140);
      return () => { window.clearInterval(id); stop(); io.disconnect(); ro.disconnect(); document.removeEventListener("visibilitychange", onVis); };
    }
    return () => { stop(); io.disconnect(); ro.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  const on = (kind: "src" | "tier", i: number) =>
    canHover ? { onMouseEnter: () => setHot({ kind, i }), onMouseLeave: () => setHot(null) } : {};

  return (
    <div className="nr-eco">
      <div className="nr-eco-lists">
        <p className="nr-eyebrow"><b>–</b> Ingestion</p>
        <ul className="nr-chips">
          {INGEST.ingestion.map((label, i) => (
            <li key={label}>
              <button
                type="button"
                className="nr-chip-btn"
                aria-pressed={hot?.kind === "src" && hot.i === i}
                onFocus={() => setHot({ kind: "src", i })}
                onBlur={() => setHot(null)}
                {...on("src", i)}
              >{label}</button>
            </li>
          ))}
        </ul>

        {/* The ladder. Rendered as a run with separators so it reads hot to
            cold, rather than as seven equal chips where the gradient is
            invisible. Indices still line up with the tier ring in the scene. */}
        <p className="nr-eyebrow" style={{ marginTop: 30 }}><b>–</b> Classification</p>
        <ul className="nr-chips nr-ladder">
          {INGEST.classes.slice(0, INGEST.ladderCount).map((label, i) => (
            <li key={label}>
              <button
                type="button"
                className="nr-chip-btn"
                aria-pressed={hot?.kind === "tier" && hot.i === i}
                onFocus={() => setHot({ kind: "tier", i })}
                onBlur={() => setHot(null)}
                {...on("tier", i)}
              >{label}</button>
            </li>
          ))}
        </ul>

        <p className="nr-eyebrow" style={{ marginTop: 24 }}><b>–</b> Flags</p>
        <ul className="nr-chips">
          {INGEST.classes.slice(INGEST.ladderCount).map((label, j) => {
            const i = j + INGEST.ladderCount;
            return (
              <li key={label}>
                <button
                  type="button"
                  className="nr-chip-btn"
                  aria-pressed={hot?.kind === "tier" && hot.i === i}
                  onFocus={() => setHot({ kind: "tier", i })}
                  onBlur={() => setHot(null)}
                  {...on("tier", i)}
                >{label}</button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="nr-eco-stage">
        {/* Decorative: every node is named in the lists beside it. */}
        <canvas ref={canvasRef} aria-hidden="true" role="presentation" />
        <p className="nr-pipe-label">
          <span>{hot ? (hot.kind === "src" ? "Source" : "Tier") : "Flow"}</span>
          {hot ? (hot.kind === "src" ? INGEST.ingestion[hot.i] : INGEST.classes[hot.i]) : "Ingest → classify → archive"}
        </p>
      </div>
    </div>
  );
}
