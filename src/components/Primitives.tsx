import { motion } from "framer-motion";
import { useMemo, type CSSProperties, type ReactNode } from "react";
import { easeOut } from "./motion";

/** Deterministic QR-like module grid with real finder patterns. Geometry, not a scannable code. */
export function Qr({ size = 25, seed = 7, animate = false, style, className }: { size?: number; seed?: number; animate?: boolean; style?: CSSProperties; className?: string }) {
  const cells = useMemo(() => {
    let state = seed * 2654435761;
    const random = () => {
      state = (state * 1103515245 + 12345) & 0x7fffffff;
      return state / 0x7fffffff;
    };
    const inFinder = (x: number, y: number) => {
      const boxes = [
        [0, 0],
        [size - 7, 0],
        [0, size - 7],
      ];
      for (const [bx, by] of boxes) {
        const dx = x - bx;
        const dy = y - by;
        if (dx >= 0 && dx < 7 && dy >= 0 && dy < 7) {
          const ring = Math.max(Math.abs(dx - 3), Math.abs(dy - 3));
          return ring === 3 || ring <= 1;
        }
        if (dx >= -1 && dx < 8 && dy >= -1 && dy < 8) return false;
      }
      return null;
    };
    const result: boolean[] = [];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const finder = inFinder(x, y);
        result.push(finder ?? random() > 0.55);
      }
    }
    return result;
  }, [seed, size]);

  return (
    <div className={`qr ${className ?? ""}`} style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, ...style }} aria-hidden="true">
      {cells.map((on, index) =>
        animate ? (
          <motion.i
            key={index}
            className={on ? "" : "off"}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 + ((index * 7919) % 97) * 0.012, ease: easeOut }}
          />
        ) : (
          <i key={index} className={on ? "" : "off"} />
        ),
      )}
    </div>
  );
}

/** Five signal bars. `level` 0–5 lights that many from the left. */
export function Signal({ level, delay = 0, className }: { level: number; delay?: number; className?: string }) {
  return (
    <div className={`signal ${className ?? ""}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((bar) => (
        <motion.i
          key={bar}
          initial={false}
          animate={{ opacity: bar < level ? 1 : 0.18, scaleY: bar < level ? 1 : 0.55 }}
          transition={{ duration: 0.5, delay: delay + (bar < level ? bar : 4 - bar) * 0.09, ease: easeOut }}
        />
      ))}
    </div>
  );
}

export function Phone({ children, style, className }: { children: ReactNode; style?: CSSProperties; className?: string }) {
  return (
    <div className={`phone ${className ?? ""}`} style={style}>
      <div className="phone-screen">{children}</div>
    </div>
  );
}
