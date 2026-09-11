import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { globalBeatIndex, slides, totalBeats } from "../presentation";

const focusableSelector = [
  "button:not([disabled])",
  "a[href]",
  "input:not([disabled])",
  "textarea:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function useDialogFocus(open: boolean) {
  const dialogRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const first = dialog.querySelector<HTMLElement>(focusableSelector);
    (first ?? dialog).focus();

    const trap = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector));
      if (items.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [open]);

  return dialogRef;
}

export function Progress({ slide, beat }: { slide: number; beat: number }) {
  const progress = (globalBeatIndex(slide, beat) + 1) / totalBeats;
  return (
    <div className="progress" aria-label={`Slide ${slide + 1} of ${slides.length}, beat ${beat + 1}`}>
      <i>
        <motion.span initial={false} animate={{ scaleX: progress }} transition={{ type: "spring", stiffness: 120, damping: 24 }} />
      </i>
      <b>{String(slide + 1).padStart(2, "0")}</b>
    </div>
  );
}

const keys: [string, string][] = [
  ["Advance", "Click · Space · Enter · →"],
  ["Back", "← · Backspace"],
  ["Jump", "Home · End · B for backup slides"],
  ["Presenter", "N notes · O overview"],
  ["Display", "F fullscreen"],
  ["Help", "? or H · Esc closes"],
];

export function HelpOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useDialogFocus(open);
  if (!open) return null;
  return (
    <motion.div className="overlay" data-no-advance initial={{ opacity: 0 }} animate={{ opacity: 1 }} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <motion.section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Presentation controls" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <button className="overlay-close" onClick={onClose} aria-label="Close help">
          Close
        </button>
        <h2>Presenting</h2>
        <dl className="keys">
          {keys.map(([label, value]) => (
            <div key={label} style={{ display: "contents" }}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </motion.section>
    </motion.div>
  );
}

export function NotesPanel({ open, slide, beat }: { open: boolean; slide: number; beat: number }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.aside className="notes-panel" data-no-advance initial={{ x: 560 }} animate={{ x: 0 }} exit={{ x: 560 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
          <small>
            {slides[slide].backup ? "Backup slide" : `Slide ${slide + 1}`} · beat {beat + 1} of {slides[slide].beats}
          </small>
          <h2>{slides[slide].title}</h2>
          <p>{slides[slide].script}</p>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export function Overview({ open, active, onSelect, onClose }: { open: boolean; active: number; onSelect: (slide: number) => void; onClose: () => void }) {
  const dialogRef = useDialogFocus(open);
  if (!open) return null;
  return (
    <motion.div className="overlay overview" data-no-advance initial={{ opacity: 0 }} animate={{ opacity: 1 }} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Slide overview">
        <button className="overlay-close" onClick={onClose} aria-label="Close overview">
          Close
        </button>
        <h2>Slides</h2>
        <div className="overview-list">
          {slides.map((item, index) => (
            <button key={item.title} onClick={() => onSelect(index)} className={index === active ? "active" : ""}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.title}</strong>
              {item.backup && <small>Backup</small>}
            </button>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
