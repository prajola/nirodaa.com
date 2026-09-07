#!/usr/bin/env python3
"""
Generate the Paralelly PNG icon set from the logo's measured geometry.

── WHY THIS IS A SCRIPT AND NOT EIGHT HAND-DRAWN FILES ────────────────────
The dot positions here are the same measured set as src/components/Logo.tsx.
Eight PNGs maintained by hand drift from the component the first time a dot
moves, and nobody notices because a favicon is 16 pixels. Regenerating from
one table means the tab and the header cannot disagree.

    python3 scripts/make-icons.py      (or: npm run icons)

── HOW THE SIZES DIFFER ───────────────────────────────────────────────────
Browser favicons get a rounded white tile with a hairline edge, because a
white icon on a white tab strip needs a border to have a shape at all.
apple-touch-icon is full-bleed and square: iOS applies its own mask, and a
pre-rounded icon gets rounded twice and looks pinched.
"""

from PIL import Image, ImageDraw

# ── The mark ──────────────────────────────────────────────────────────────
# x, y, radius on a 0-100 grid, and the fill key. Measured off the supplied
# artwork; kept in step with src/components/Logo.tsx.
DOTS = [
    (45.8, 12.4, 12.5, "ink"),
    (81.6, 15.0, 10.7, "green"),
    (11.9, 49.6, 12.0, "ink"),
    (46.4, 49.6, 12.0, "green"),
    (82.5, 49.6, 11.7, "green"),
    (11.1, 85.1,  8.1, "muted"),
    (45.7, 87.5, 12.8, "ink"),
    (81.7, 84.7, 10.9, "ink"),
]
FILL = {"ink": (8, 21, 34), "green": (102, 209, 134), "muted": (38, 84, 62)}
WHITE, EDGE = (255, 255, 255), (227, 230, 233)

# The mark is 94.3 x 100.4, not square — the empty top-left cell makes it
# taller than it is wide, so both axes are needed to fit and centre it.
X0, X1, Y0, Y1 = -0.1, 94.2, -0.1, 100.3

SS = 8  # supersample factor; the dots are circles, so aliasing is obvious


def render(size: int, pad_ratio: float, radius_ratio: float, edge: bool) -> Image.Image:
    S = size * SS
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    r = radius_ratio * S
    if r > 0:
        d.rounded_rectangle([0, 0, S - 1, S - 1], radius=r, fill=WHITE)
        if edge:
            # Scaled with the icon, so it stays a hairline at every size
            # rather than a heavy ring on the small ones.
            d.rounded_rectangle([0, 0, S - 1, S - 1], radius=r,
                                outline=EDGE, width=max(1, round(S / size)))
    else:
        d.rectangle([0, 0, S, S], fill=WHITE)

    pad = S * pad_ratio
    avail = S - 2 * pad
    # Scale by the tighter axis: fitting on width alone clips the bottom row.
    s = min(avail / (X1 - X0), avail / (Y1 - Y0))
    ox = (S - (X1 - X0) * s) / 2 - X0 * s
    oy = (S - (Y1 - Y0) * s) / 2 - Y0 * s

    for x, y, rad, c in DOTS:
        cx, cy, rr = x * s + ox, y * s + oy, rad * s
        d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=FILL[c])

    return im.resize((size, size), Image.LANCZOS)


TARGETS = [
    # file,                    size, pad,   radius, edge
    ("favicon-16.png",           16, 0.10, 0.20,  True),
    ("favicon-32.png",           32, 0.11, 0.20,  True),
    ("favicon-48.png",           48, 0.11, 0.20,  True),
    ("favicon-180.png",         180, 0.12, 0.20,  True),
    # iOS masks and rounds this itself, so it ships square and opaque.
    ("apple-touch-icon.png",    180, 0.115, 0.0,  False),
    ("icon-192.png",            192, 0.12, 0.20,  True),
    ("icon-512.png",            512, 0.12, 0.20,  True),
]

if __name__ == "__main__":
    for name, size, pad, radius, edge in TARGETS:
        img = render(size, pad, radius, edge)
        if name == "apple-touch-icon.png":
            img = img.convert("RGB")  # no alpha; iOS composites it on black
        img.save(f"public/{name}")
        print(f"  public/{name:<22} {size}x{size}")

    # One .ico carrying 16/32/48 for the contexts that still ask for it by
    # that name — pinned sites, bookmark bars, older Windows shells.
    render(48, 0.11, 0.20, True).save(
        "public/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    print("  public/favicon.ico          16+32+48")
