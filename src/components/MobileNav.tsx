import { useEffect, useRef, useState } from "react";
import { NAV, CTA } from "@/content";

/**
 * The mobile menu.
 *
 * ── WHY THIS EXISTS ───────────────────────────────────────────────────────
 * The nav links were `display: none` below 880px with nothing in their place,
 * so on a phone the site had no navigation at all — eleven sections reachable
 * only by scrolling past all of them. The header rendered a wordmark and
 * nothing else.
 *
 * ── IT IS A DISCLOSURE, NOT A MODAL ───────────────────────────────────────
 * A panel under the bar rather than a full-screen overlay: the page stays
 * visible behind it, there is no transition to sit through, and closing it
 * cannot leave the reader somewhere they did not expect. The button is a real
 * <button> with aria-expanded and aria-controls, so it announces its state
 * instead of being a div that happens to respond to taps.
 *
 * Everything that can dismiss it, does: choosing a link, Escape, or a tap
 * outside. A menu that only closes via the button it opened from is a trap on
 * a touch screen, where there is no cursor to suggest where the button went.
 */
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      // Focus goes back to the control that opened it, or it lands on <body>
      // and the next Tab starts from the top of the document.
      btnRef.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
    };
    /* If the viewport grows past the breakpoint while the menu is open, the
       desktop links come back and the panel is left orphaned on screen —
       open, and controlled by a button that is now hidden. */
    const mq = window.matchMedia("(min-width: 881px)");
    const onChange = () => mq.matches && setOpen(false);

    document.addEventListener("keydown", onKey);
    // pointerdown, not click: it fires before the tap resolves, so the panel
    // is gone by the time a link underneath would activate.
    document.addEventListener("pointerdown", onPointer);
    mq.addEventListener("change", onChange);

    /* The page behind must not scroll while the panel is open, or a flick
       aimed at the menu scrolls the document instead. Padding replaces the
       scrollbar's width so the layout does not jump on desktop. */
    const bar = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;
    document.body.style.overflow = "hidden";
    if (bar > 0) document.body.style.paddingRight = `${bar}px`;

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      mq.removeEventListener("change", onChange);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="nr-burger"
        aria-expanded={open}
        aria-controls="nr-mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {/* Two bars that become a cross. Decorative — the accessible name is
            on the button, so this must not be announced as well. */}
        <span className="nr-burger-box" aria-hidden="true">
          <i /><i />
        </span>
      </button>

      <div
        ref={panelRef}
        id="nr-mobile-menu"
        className="nr-menu"
        /* hidden, not merely display:none in CSS — it keeps the links out of
           the tab order and out of the accessibility tree while closed. */
        hidden={!open}
      >
        <nav aria-label="Primary, mobile">
          <ul>
            {NAV.map((n) => (
              <li key={n.label}>
                <a href={n.href} onClick={() => setOpen(false)}>{n.label}</a>
              </li>
            ))}
          </ul>
          <a className="nr-btn nr-btn-solid nr-menu-cta" href="#cta" onClick={() => setOpen(false)}>
            {CTA.buttons[0]}
          </a>
        </nav>
      </div>
    </>
  );
}
