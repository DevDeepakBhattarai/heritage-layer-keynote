import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { HelpOverlay, NotesPanel, Overview, Progress } from "./components/Chrome";
import { clampLocation, firstBackupIndex, slides } from "./presentation";
import { SlideRenderer } from "./scenes/SlideRenderer";

type Location = { slide: number; beat: number };
type Overlay = "help" | "overview" | null;

const STAGE_WIDTH = 1920;
const STAGE_HEIGHT = 1080;
const CLICK_MOVE_TOLERANCE_PX = 6;
const CLICK_HOLD_THRESHOLD_MS = 250;

function readLocation(): Location {
  const params = new URLSearchParams(window.location.search);
  const slide = Number.parseInt(params.get("slide") ?? "1", 10) - 1;
  const beat = Number.parseInt(params.get("beat") ?? "1", 10) - 1;
  return clampLocation(Number.isFinite(slide) ? slide : 0, Number.isFinite(beat) ? beat : 0);
}

function updateUrl({ slide, beat }: Location) {
  const url = new URL(window.location.href);
  url.searchParams.set("slide", String(slide + 1));
  url.searchParams.set("beat", String(beat + 1));
  window.history.replaceState(null, "", url);
}

function useStageScale(viewportRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const fit = () => {
      const scale = Math.min(viewport.clientWidth / STAGE_WIDTH, viewport.clientHeight / STAGE_HEIGHT);
      viewport.style.setProperty("--scale", String(scale));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [viewportRef]);
}

export function App() {
  const initialLocation = readLocation();
  const [location, setLocation] = useState<Location>(initialLocation);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const overlayRef = useRef<Overlay>(null);
  const overlayReturnFocusRef = useRef<HTMLElement | null>(null);
  const previousOverlayRef = useRef<Overlay>(null);
  const locationRef = useRef<Location>(initialLocation);
  const deckRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLElement | null>(null);
  const pointerGestureRef = useRef<{ pointerId: number; x: number; y: number; startedAt: number } | null>(null);
  const suppressNextClickRef = useRef(false);
  const reviewMode = new URLSearchParams(window.location.search).get("review") === "1";

  useStageScale(viewportRef);

  const commit = useCallback((next: Location) => {
    const safe = clampLocation(next.slide, next.beat);
    // The ref is the authoritative cursor so rapid inputs never read stale state.
    locationRef.current = safe;
    updateUrl(safe);
    setLocation(safe);
  }, []);

  const forward = useCallback(() => {
    const current = locationRef.current;
    if (current.beat < slides[current.slide].beats - 1) {
      commit({ slide: current.slide, beat: current.beat + 1 });
    } else if (current.slide < slides.length - 1) {
      commit({ slide: current.slide + 1, beat: 0 });
    }
  }, [commit]);

  const back = useCallback(() => {
    const current = locationRef.current;
    if (current.beat > 0) {
      commit({ slide: current.slide, beat: current.beat - 1 });
    } else if (current.slide > 0) {
      const previous = current.slide - 1;
      commit({ slide: previous, beat: slides[previous].beats - 1 });
    }
  }, [commit]);

  const changeOverlay = useCallback((next: Overlay) => {
    if (overlayRef.current === null && next !== null) {
      overlayReturnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    }
    overlayRef.current = next;
    setOverlay(next);
  }, []);

  const jump = useCallback(
    (slide: number, beat = 0) => {
      commit({ slide, beat });
      changeOverlay(null);
    },
    [changeOverlay, commit],
  );

  const toggleOverlay = useCallback(
    (next: Exclude<Overlay, null>) => {
      setNotesOpen(false);
      changeOverlay(overlayRef.current === next ? null : next);
    },
    [changeOverlay],
  );

  useEffect(() => {
    if (deckRef.current) deckRef.current.inert = overlay !== null;
    if (previousOverlayRef.current !== null && overlay === null) {
      overlayReturnFocusRef.current?.focus();
    }
    previousOverlayRef.current = overlay;
  }, [overlay]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      const target = event.target;
      if (target instanceof HTMLElement && target.matches("input, textarea, select, [contenteditable='true']")) return;

      if (event.key === "Escape") {
        changeOverlay(null);
        setNotesOpen(false);
        return;
      }
      if (event.key === "?" || event.key.toLowerCase() === "h") {
        event.preventDefault();
        toggleOverlay("help");
        return;
      }
      if (event.key.toLowerCase() === "o") {
        event.preventDefault();
        toggleOverlay("overview");
        return;
      }
      // A modal owns the keyboard while open.
      if (overlay !== null) return;

      const key = event.key.toLowerCase();
      if (key === "n") {
        setNotesOpen((value) => !value);
      } else if (key === "f") {
        void (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());
      } else if (key === "b") {
        jump(firstBackupIndex);
      } else if ([" ", "Enter", "ArrowRight", "PageDown"].includes(event.key)) {
        event.preventDefault();
        forward();
      } else if (["ArrowLeft", "Backspace", "PageUp"].includes(event.key)) {
        event.preventDefault();
        back();
      } else if (event.key === "Home") {
        event.preventDefault();
        jump(0);
      } else if (event.key === "End") {
        event.preventDefault();
        jump(slides.length - 1, slides[slides.length - 1].beats - 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [back, changeOverlay, forward, jump, overlay, toggleOverlay]);

  useEffect(() => {
    const onPopState = () => {
      const next = readLocation();
      locationRef.current = next;
      setLocation(next);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const onStagePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;
    // A fresh press starts a fresh gesture, so stale suppression can never eat a later click.
    suppressNextClickRef.current = false;
    pointerGestureRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      startedAt: performance.now(),
    };
  };

  const onStagePointerUp = (event: React.PointerEvent<HTMLElement>) => {
    const gesture = pointerGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    const moved = Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) > CLICK_MOVE_TOLERANCE_PX;
    const held = performance.now() - gesture.startedAt >= CLICK_HOLD_THRESHOLD_MS;
    const selection = window.getSelection();
    const selectedText = Boolean(selection && !selection.isCollapsed);

    suppressNextClickRef.current = moved || held || selectedText;
    pointerGestureRef.current = null;
  };

  const onStagePointerCancel = () => {
    pointerGestureRef.current = null;
    suppressNextClickRef.current = true;
  };

  const onStageClick = (event: React.MouseEvent<HTMLElement>) => {
    if (suppressNextClickRef.current) {
      suppressNextClickRef.current = false;
      return;
    }

    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) return;

    const target = event.target as HTMLElement;
    if (target.closest("button, a, video, input, textarea, select, [data-no-advance]")) return;
    forward();
  };

  return (
    <MotionConfig reducedMotion="user">
      <main className="viewport" ref={viewportRef}>
        <div className="stage">
          <section
            ref={deckRef}
            className="deck"
            onPointerDown={onStagePointerDown}
            onPointerUp={onStagePointerUp}
            onPointerCancel={onStagePointerCancel}
            onClick={onStageClick}
            aria-live="polite"
            aria-hidden={overlay !== null ? true : undefined}
          >
            <AnimatePresence initial={false}>
              <motion.div
                className="scene"
                key={location.slide}
                initial={reviewMode ? false : { opacity: 0, scale: 1.04, filter: "blur(18px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={reviewMode ? { opacity: 0 } : { opacity: 0, scale: 0.985, filter: "blur(10px)" }}
                transition={reviewMode ? { duration: 0 } : { duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <SlideRenderer slide={location.slide} beat={location.beat} />
              </motion.div>
            </AnimatePresence>
            <Progress slide={location.slide} beat={location.beat} />
            <nav className="nav" data-no-advance aria-label="Slide navigation">
              <button onClick={() => jump(0)} aria-label="First slide">«</button>
              <button onClick={back} aria-label="Previous">‹</button>
              <button onClick={forward} aria-label="Next">›</button>
              <button onClick={() => jump(slides.length - 1)} aria-label="Last slide">»</button>
              <button className="help-trigger" onClick={() => toggleOverlay("help")} aria-label="Show presentation help">
                ?
              </button>
            </nav>
            <NotesPanel open={notesOpen} slide={location.slide} beat={location.beat} />
          </section>
          <HelpOverlay open={overlay === "help"} onClose={() => changeOverlay(null)} />
          <Overview open={overlay === "overview"} active={location.slide} onSelect={jump} onClose={() => changeOverlay(null)} />
        </div>
      </main>
    </MotionConfig>
  );
}
