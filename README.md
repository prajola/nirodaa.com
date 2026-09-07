# nirodaa.com

The marketing site for **Nirodaa** — the molecular layer for long-term
enterprise data storage.

Vite 6 · React 18 · TypeScript. No UI framework, no 3D library.

```bash
npm install
npm run dev      # http://localhost:8090
npm run build    # typecheck + production build
npm run check    # typecheck only
npm run icons    # regenerate the PNG icon set from the logo geometry
```

## Before you edit the copy

`src/content.ts` holds **all** text. The constraint that governs it:

> Do not claim what has not been validated. No certifications until they are
> actually held. No storage density, lifespan or cost figures that internal
> testing has not produced.

This is enforced structurally so it cannot be lost in an edit — entries carry
`target` and `illustrative` flags, anything unproven renders inside a visible
`<Note>`, and figures carry an `est.` badge. If you add a number, it needs a
source or one of those markers.

## Layout

```
src/content.ts        all copy; presentation lives elsewhere
src/App.tsx           section composition; ORDER drives the numbering
src/styles.css        one stylesheet, palette derived from the mark
src/components/       Logo (measured, not traced), MobileNav
src/scene/            the three canvases
scripts/make-icons.py the icon set, generated from the same dot table as Logo
```

## The scenes

Hand-written 3D: rotation matrices, a perspective divide, a painter's-algorithm
depth sort on a 2D canvas. `three.js` would have added ~800KB to a page whose
job is to load fast.

- **MolecularChain** — the hero. A peptide helix with bits streaming in.
- **Pipeline** — *one* 96-particle system morphing through six layouts, so the
  viewer can see it is the same data throughout. Select and Verify are the same
  layout on purpose, and so are Encode and Retrieve. The symmetry is the
  argument.
- **Ecosystem** — hub-and-spoke, seven sources into seven tiers.

All three seed with mulberry32, so they render identically on every load and can
be diffed. Every animation frame is gated three ways: never starts under
`prefers-reduced-motion`, stops when scrolled out of view, stops on
`visibilitychange`.

## Conventions worth keeping

- Section numbering derives from the `ORDER` array in `App.tsx`. Insert or
  remove a section and the numbers follow; never hard-code one.
- Tap targets are keyed to `(pointer: coarse)`, not viewport width — a tablet is
  a touch device at a desktop width.
- Text colours must clear WCAG AA on **both** white and the tinted bands.
  `--text-3` is `#67717D` because the previous value passed on one and failed on
  the other.
- The logo's dot table appears in two places, `components/Logo.tsx` and
  `scripts/make-icons.py`. Change one, run `npm run icons`.
