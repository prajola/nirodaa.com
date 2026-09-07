/**
 * The Paralelly mark.
 *
 * A 3x3 dot matrix with the top-left cell empty and the bottom-left dot
 * smaller and muted — it reads as a matrix mid-write, which is exactly what
 * the product does: cells filling in as data is encoded.
 *
 * ── THIS IS NOT A TRACE ────────────────────────────────────────────────────
 * The supplied artwork is eight circles, so it is reproduced rather than
 * traced: positions, radii and fills were measured off the PNG (flood-fill
 * each blob, take its centroid, its mean radius, and the mean colour of its
 * core away from the anti-aliased rim) and are written out below on a 0-100
 * grid. The result is the geometry itself, not an approximation of it, and
 * it stays sharp at any size — which a 186x148 screenshot would not.
 *
 * Measured fills:
 *   dark   #061423 #091523 #061425 #0A1925  -> one ink, they are the same dot
 *   green  #65D383 #68D28C #63CE81          -> one green
 *   muted  #26543E                          -> the small one, deliberately
 *                                              different, kept as its own value
 */

type Dot = { x: number; y: number; r: number; c: "ink" | "green" | "muted" };

/** Grid columns land on 12 / 46 / 82; rows on 13 / 50 / 86. The top-left
 *  cell is empty on purpose — it is the gap that makes it a matrix rather
 *  than a block. */
const DOTS: Dot[] = [
  { x: 45.8, y: 12.4, r: 12.5, c: "ink" },
  { x: 81.6, y: 15.0, r: 10.7, c: "green" },
  { x: 11.9, y: 49.6, r: 12.0, c: "ink" },
  { x: 46.4, y: 49.6, r: 12.0, c: "green" },
  { x: 82.5, y: 49.6, r: 11.7, c: "green" },
  { x: 11.1, y: 85.1, r: 8.1, c: "muted" },
  { x: 45.7, y: 87.5, r: 12.8, c: "ink" },
  { x: 81.7, y: 84.7, r: 10.9, c: "ink" },
];

const FILL = { ink: "#081522", green: "#66D186", muted: "#26543E" };

export default function Logo({ size = 26, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      // Decorative: the wordmark beside it carries the accessible name, so
      // announcing this too would read "Paralelly Paralelly".
      aria-hidden="true"
      focusable="false"
    >
      {DOTS.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={FILL[d.c]} />
      ))}
    </svg>
  );
}
