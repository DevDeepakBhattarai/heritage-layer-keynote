import { AnimatePresence, motion, type Transition } from "framer-motion";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

export const easeOut = [0.16, 1, 0.3, 1] as const;

export const arrive = (delay = 0, duration = 0.7): Transition => ({ duration, delay, ease: easeOut });

/**
 * Mounts children with a blur-and-rise entrance once `when` is true and removes
 * them with a faster fade when it turns false, so stepping back reads as undo.
 */
export function Reveal({
  when,
  delay = 0,
  y = 28,
  duration = 0.75,
  as = "div",
  className,
  style,
  children,
}: {
  when: boolean;
  delay?: number;
  y?: number;
  duration?: number;
  as?: "div" | "span" | "li" | "p";
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const Tag = motion[as];
  return (
    <AnimatePresence>
      {when && (
        <Tag
          className={className}
          style={style}
          initial={{ opacity: 0, y, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -12, filter: "blur(8px)", transition: { duration: 0.3, ease: easeOut } }}
          transition={arrive(delay, duration)}
        >
          {children}
        </Tag>
      )}
    </AnimatePresence>
  );
}

/** Splits a line into words and raises them one by one. */
export function Words({ text, delay = 0, stagger = 0.06, className }: { text: string; delay?: number; stagger?: number; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((word, index) => (
        <span key={`${word}-${index}`} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.08em", marginBottom: "-0.08em" }} aria-hidden="true">
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 0.9, delay: delay + index * stagger, ease: easeOut }}
          >
            {word}
          </motion.span>
          {index < text.split(" ").length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

/** Returns a growing prefix of `text` once `active` is true. */
export function useTypewriter(text: string, active: boolean, charsPerSecond = 34, startDelay = 0.2) {
  const [count, setCount] = useState(active ? 0 : text.length);
  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }
    let frame = 0;
    const start = performance.now() + startDelay * 1000;
    const tick = (now: number) => {
      const next = Math.min(text.length, Math.max(0, Math.floor(((now - start) / 1000) * charsPerSecond)));
      setCount(next);
      if (next < text.length) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, text, charsPerSecond, startDelay]);
  return { visible: text.slice(0, count), done: count >= text.length };
}

/** Counts from 0 to `value` over `duration` seconds once `active` is true. */
export function useCountUp(value: number, active: boolean, duration = 1.4, delay = 0.2) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!active) {
      setCurrent(0);
      return;
    }
    let frame = 0;
    const start = performance.now() + delay * 1000;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / (duration * 1000)));
      const eased = 1 - Math.pow(1 - t, 4);
      setCurrent(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, value, duration, delay]);
  return current;
}
