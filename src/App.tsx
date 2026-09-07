/**
 * Paralelly — the homepage.
 *
 * Section order follows the brief: hero, problem, the new layer, how it
 * works, platform, ingestion, policy, dashboard, security, why molecular,
 * solutions, integration, research, sustainability, pricing, CTA.
 *
 * ── SHAPE CARRIES MEANING ────────────────────────────────────────────────
 * Seventeen sections all shaped "eyebrow, title, three cards" read as one
 * undifferentiated scroll and the reader stops distinguishing them by about
 * the fourth. So each has its own shape: the pipeline is a stack, how-it-
 * works is a numbered rail, the policy is a code block, the dashboard is
 * stats plus a table, readiness is bars.
 *
 * ── AND SO DOES THE CLAIM MARKER ─────────────────────────────────────────
 * The brief's hardest rule is not to claim what has not been validated.
 * Anything unproven renders inside <Note>, and figures carry a visible
 * badge. It is deliberately not subtle — a marker nobody notices enforces
 * nothing.
 */

import { lazy, Suspense, useEffect, useRef } from "react";
import {
  BRAND, CTA, DASHBOARD, EVIDENCE, FOOTER, HERO, HOW, INGEST, LAYER,
  CAPS, NAV, PROBLEM, PRODUCTS, RESEARCH, SOLUTIONS, WHY,
} from "@/content";
import Logo from "@/components/Logo";
import MobileNav from "@/components/MobileNav";
import "@/styles.css";

/* The hero object is decoration and the page reads without it, so it never
   blocks first paint. */
const MolecularChip = lazy(() => import("@/scene/MolecularChip"));
/* The six-stage scene. Also lazy — it is below the fold by definition. */
const Pipeline = lazy(() => import("@/scene/Pipeline"));
const Ecosystem = lazy(() => import("@/scene/Ecosystem"));

/** Fades a block in as it reaches reading position. Observer rather than
 *  `animation-timeline: scroll()`, which is still Chromium-only. */
function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("is-in"); io.disconnect(); } },
      { rootMargin: "-8% 0px -12% 0px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`nr-reveal ${className}`}>{children}</div>;
}

/* Section order, and the single source of the numbering. Insert here and
   every index downstream renumbers itself. */
const ORDER = [
  PROBLEM, LAYER, HOW, PRODUCTS, INGEST, CAPS, DASHBOARD,
  WHY, SOLUTIONS, RESEARCH,
];
const num = (o: unknown) => String(ORDER.indexOf(o as never) + 1).padStart(2, "0");

function Head({ n, eyebrow, title, lede }: { n: string; eyebrow: string; title: string; lede?: string }) {
  return (
    <header className="nr-head">
      <p className="nr-eyebrow"><b>{n}</b> {eyebrow}</p>
      <h2 className="nr-h2">{title}</h2>
      {lede && <p className="nr-lede">{lede}</p>}
    </header>
  );
}

/** Everything unproven goes through here. */
function Note({ children }: { children: React.ReactNode }) {
  return <p className="nr-note">{children}</p>;
}

/* ── GROUND ────────────────────────────────────────────────────────────────
   Fifteen sections separated only by hairlines is one long undifferentiated
   run. The ground changes where the page changes MODE, not on a mechanical
   alternation:

     tint   the world before (Problem), the product shown (Dashboard), and
            the evidence (Research) — the three places the page stops
            arguing and starts showing
     ink    the close, once

   Everything else stays white, so the three tinted bands land roughly every
   five sections and each one means something. */
function Section({ id, tone, children }: { id?: string; tone?: "tint" | "ink"; children: React.ReactNode }) {
  return (
    <section className={`nr-sec${tone ? ` nr-sec--${tone}` : ""}`} id={id}>
      <div className="nr-wrap">{children}</div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <header className="nr-nav">
        <a className="nr-brand" href="#top"><Logo className="nr-mark" size={30} />{BRAND.name}</a>
        <nav className="nr-nav-links" aria-label="Primary">
          {NAV.map((n) => <a key={n.label} href={n.href}>{n.label}</a>)}
        </nav>
        <MobileNav />
      </header>

      <main id="top">
        {/* ── 01 Hero ─────────────────────────────────────────────────── */}
        <div className="nr-wrap">
          <section className="nr-hero">
            <div>
              <p className="nr-eyebrow"><b>—</b> {HERO.eyebrow}</p>
              <h1 className="nr-h1">{HERO.titleA} <em>{HERO.titleB}</em></h1>
              <p className="nr-hero-sub">{HERO.sub}</p>
              <div className="nr-cta">
                <a className="nr-btn nr-btn-solid" href="#cta">{HERO.primary}</a>
                <a className="nr-btn nr-btn-ghost" href="#technology">{HERO.secondary}</a>
              </div>
              {/* The hero's own sentence, and what the object animates. */}
              <div className="nr-flow">
                {HERO.chain.map((s, i) => (
                  <span key={s}>{s}{i < HERO.chain.length - 1 && <i aria-hidden="true"> → </i>}</span>
                ))}
              </div>
              <p className="nr-kicker">{HERO.kicker}</p>
            </div>
            <Suspense fallback={null}><MolecularChip /></Suspense>
          </section>
        </div>

        {/* ── 02 Problem ──────────────────────────────────────────────── */}
        <Section id="problem" tone="tint">
          <Reveal><Head n={num(PROBLEM)} eyebrow={PROBLEM.eyebrow} title={PROBLEM.title} lede={PROBLEM.lede} /></Reveal>
          <Reveal>
            <div className="nr-grid nr-g3">
              {PROBLEM.items.map((it) => (
                <div className="nr-cell" key={it.k}><h3>{it.k}</h3><p>{it.v}</p></div>
              ))}
            </div>
          </Reveal>
        </Section>

        {/* ── 03 The new layer ────────────────────────────────────────── */}
        <Section id="platform">
          <Reveal><Head n={num(LAYER)} eyebrow={LAYER.eyebrow} title={LAYER.title} lede={LAYER.lede} /></Reveal>
          <Reveal>
            <div className="nr-stack">
              {LAYER.stack.map((s, i) => (
                <div key={s}>
                  <span>{String(i + 1).padStart(2, "0")}</span>{s}
                </div>
              ))}
            </div>
            <div className="nr-flow" style={{ marginTop: 26 }}>
              {LAYER.ladder.map((s, i) => (
                <span key={s}>{s}{i < LAYER.ladder.length - 1 && <i aria-hidden="true"> → </i>}</span>
              ))}
            </div>
          </Reveal>
        </Section>

        {/* ── 04 How it works ─────────────────────────────────────────── */}
        <Section id="how">
          <Reveal><Head n={num(HOW)} eyebrow={HOW.eyebrow} title={HOW.title} /></Reveal>
          <Suspense fallback={null}><Pipeline /></Suspense>
        </Section>

        {/* ── 05 Platform ─────────────────────────────────────────────── */}
        <Section id="product">
          <Reveal><Head n={num(PRODUCTS)} eyebrow={PRODUCTS.eyebrow} title={PRODUCTS.title} lede={PRODUCTS.lede} /></Reveal>
          <Reveal>
            {/* The control plane sits ACROSS the path rather than beside it,
                because that is what it does. A tile in a row of five said the
                opposite. */}
            <div className="nr-plane">
              <div className="nr-plane-head">
                <h3>{PRODUCTS.plane.name}</h3>
                <span>{PRODUCTS.plane.role}</span>
              </div>
              <p>{PRODUCTS.plane.body}</p>
              <ul>{PRODUCTS.plane.spans.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>

            <div className="nr-path" role="list">
              {PRODUCTS.path.map((c, i) => (
                <div className="nr-path-item" role="listitem" key={c.name}>
                  <span className="nr-path-role">{c.role}</span>
                  <h3>{c.name}</h3>
                  <p>{c.body}</p>
                  {i < PRODUCTS.path.length - 1 && (
                    <i className="nr-path-arrow" aria-hidden="true">→</i>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </Section>

        {/* ── 06 Ingestion & classification ───────────────────────────── */}
        <Section id="enterprise">
          <Reveal><Head n={num(INGEST)} eyebrow={INGEST.eyebrow} title={INGEST.title} lede={INGEST.lede} /></Reveal>
          <Suspense fallback={null}><Ecosystem /></Suspense>
        </Section>

        {/* ── Capabilities ────────────────────────────────────────────── */}
        <Section id="capabilities">
          <Reveal><Head n={num(CAPS)} eyebrow={CAPS.eyebrow} title={CAPS.title} lede={CAPS.lede} /></Reveal>
          <Reveal>
            <div className="nr-grid nr-g3">
              {CAPS.now.map((c) => <div className="nr-cell" key={c}><p style={{ color: "var(--text)" }}>{c}</p></div>)}
            </div>
            <p className="nr-eyebrow" style={{ marginTop: 34 }}>
              <b>—</b> On the roadmap<span className="nr-tag">Not available</span>
            </p>
            <ul className="nr-chips">{CAPS.next.map((c) => <li key={c}>{c}</li>)}</ul>
            <Note>{CAPS.note}</Note>
          </Reveal>
        </Section>

        {/* ── 08 Dashboard ────────────────────────────────────────────── */}
        <Section id="dashboard" tone="tint">
          <Reveal>
            <Head n={num(DASHBOARD)} eyebrow={DASHBOARD.eyebrow} title={DASHBOARD.title} />
          </Reveal>
          <Reveal>
            <dl className="nr-stats">
              {DASHBOARD.stats.map((s) => (
                <div key={s.k}><dt>{s.k}</dt><dd>{s.v}</dd></div>
              ))}
            </dl>
            <div className="nr-tablewrap" style={{ marginTop: 20 }}>
              <table className="nr-table">
                <thead><tr>{DASHBOARD.cols.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
                <tbody>
                  {DASHBOARD.rows.map((r) => (
                    <tr key={r[0]}>
                      {r.map((cell, i) => (
                        <td key={i} className={i === r.length - 1 ? "nr-ok" : undefined}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Note>
              Sample data. These figures illustrate the shape of the dashboard and
              are not measurements — replace them with a real tenant's numbers, or
              label the section as a preview, before this page is public.
            </Note>
          </Reveal>
        </Section>

        {/* ── 10 Why molecular ────────────────────────────────────────── */}
        <Section id="technology">
          <Reveal><Head n={num(WHY)} eyebrow={WHY.eyebrow} title={WHY.title} /></Reveal>
          <Reveal>
            <div className="nr-grid nr-g3">
              {WHY.cols.map((c) => (
                <div className="nr-cell" key={c.name}>
                  <h3 style={{ color: "var(--text-3)" }}>{c.name}</h3>
                  <p>{c.items.join(" · ")}</p>
                </div>
              ))}
            </div>
            <div className="nr-grid" style={{ marginTop: 16 }}>
              <div className="nr-cell">
                <h3 style={{ color: "var(--accent)" }}>{WHY.ours.name}</h3>
                <p>{WHY.ours.items.join(" · ")}</p>
              </div>
            </div>
            <Note>{WHY.note}</Note>
          </Reveal>
        </Section>

        {/* ── 11 Solutions ────────────────────────────────────────────── */}
        <Section id="solutions">
          <Reveal><Head n={num(SOLUTIONS)} eyebrow={SOLUTIONS.eyebrow} title={SOLUTIONS.title} /></Reveal>
          <Reveal>
            <div className="nr-grid nr-g3">
              {SOLUTIONS.items.map((s) => (
                <div className="nr-cell" key={s.name}><h3>{s.name}</h3><p>{s.body}</p></div>
              ))}
            </div>
          </Reveal>
        </Section>

        {/* ── 13 Research ─────────────────────────────────────────────── */}
        <Section id="research" tone="tint">
          <Reveal><Head n={num(RESEARCH)} eyebrow={RESEARCH.eyebrow} title={RESEARCH.title} /></Reveal>
          <Reveal>
            <dl className="nr-rows">
              {RESEARCH.parts.map((p) => <div key={p.k}><dt>{p.k}</dt><dd>{p.v}</dd></div>)}
            </dl>
            <p className="nr-eyebrow" style={{ marginTop: 34 }}>
              <b>—</b> Technology readiness<span className="nr-tag">Self-assessed</span>
            </p>
            <div className="nr-bars">
              {RESEARCH.readiness.map((r) => (
                <div className="nr-bar" key={r.k}>
                  <span>{r.k}</span>
                  <u><b style={{ width: `${r.v}%` }} /></u>
                  <span>{r.v}%</span>
                </div>
              ))}
            </div>
            <Note>{RESEARCH.note}</Note>
          </Reveal>

          {/* Published evidence. Deliberately the last thing in this section
              and visually the heaviest: it is the only block on the page whose
              numbers are measurements, and the self-assessed bars above read
              very differently once a reader has seen citations underneath
              them. Each figure names its paper and links out, because a claim
              a reader cannot check is worth what an uncited one is worth. */}
          <Reveal>
            <p className="nr-eyebrow" style={{ marginTop: 44 }}>
              <b>—</b> {EVIDENCE.eyebrow}<span className="nr-tag">Third-party</span>
            </p>
            <h3 className="nr-h2" style={{ fontSize: "clamp(21px, 2.2vw, 29px)" }}>
              {EVIDENCE.title}
            </h3>
            <p className="nr-lede">{EVIDENCE.lede}</p>
            <dl className="nr-rows" style={{ marginTop: 26 }}>
              {EVIDENCE.items.map((it) => (
                <div key={it.k}>
                  <dt>{it.k}</dt>
                  <dd>
                    {it.v}{" "}
                    {/* rel=noopener on every outbound link: these go to
                        publishers, and a new tab with window.opener is a
                        handover this page has no reason to make. */}
                    <a
                      className="nr-cite"
                      href={it.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {it.src}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
            <Note>{EVIDENCE.note}</Note>
          </Reveal>
        </Section>

        {/* ── 16 Architecture ─────────────────────────────────────────── */}

        {/* ── 17 CTA ──────────────────────────────────────────────────── */}
        <Section id="cta" tone="ink">
          <Reveal>
            <h2 className="nr-h2" style={{ maxWidth: "18ch" }}>{CTA.title}</h2>
            <p className="nr-lede" style={{ marginBottom: 30 }}>{CTA.lede}</p>
            <div className="nr-cta">
              <a className="nr-btn nr-btn-solid" href="mailto:hello@paralelly.com">{CTA.buttons[0]}</a>
            </div>
          </Reveal>
        </Section>
      </main>

      <footer className="nr-foot">
        <div className="nr-wrap nr-foot-grid">
          <div className="nr-foot-brand">
            <a className="nr-brand" href="#top"><Logo className="nr-mark" size={34} />{BRAND.name}</a>
            <p>{BRAND.line}</p>
          </div>
          {FOOTER.columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2>{col.title}</h2>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}><a href={l.href}>{l.label}</a></li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="nr-wrap nr-foot-bottom">
          <p>© {new Date().getFullYear()} {BRAND.name}</p>
          <p>{BRAND.line}</p>
        </div>
      </footer>
    </>
  );
}
