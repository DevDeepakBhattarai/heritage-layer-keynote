import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import scan from "../assets/scan-closeup.webp";
import { Reveal, arrive, easeOut } from "../components/motion";
import { Signal } from "../components/Primitives";

function SignGlyph() {
  return (
    <div className="glyph glyph-sign">
      {[0, 1, 2].map((line) => (
        <motion.i
          key={line}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: line === 0 ? 1 : 0.16, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.3 + line * 0.18, ease: easeOut }}
          style={{ width: line === 0 ? "70%" : line === 1 ? "90%" : "55%" }}
        />
      ))}
    </div>
  );
}

const scatter = [
  [-58, -26, 0.95],
  [46, -34, 0.6],
  [-24, 30, 0.45],
  [60, 22, 0.75],
  [4, -2, 0.3],
] as const;

function ScatterGlyph() {
  return (
    <div className="glyph glyph-scatter">
      {scatter.map(([x, y, o], index) => (
        <motion.i
          key={index}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{ x, y, opacity: o, rotate: (index - 2) * 9 }}
          transition={{ duration: 1.1, delay: 0.25 + index * 0.05, ease: easeOut }}
        />
      ))}
    </div>
  );
}

const scripts = ["कथा", "物語", "قصة", "Story"];

function LanguageGlyph() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (index >= scripts.length - 1) return;
    const id = window.setTimeout(() => setIndex((value) => value + 1), index === 0 ? 900 : 700);
    return () => window.clearTimeout(id);
  }, [index]);
  return (
    <div className="glyph glyph-language">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={scripts[index]}
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: index === scripts.length - 1 ? 1 : 0.55, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
          transition={{ duration: 0.45, ease: easeOut }}
        >
          {scripts[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function SignalGlyph() {
  const [level, setLevel] = useState(5);
  useEffect(() => {
    const id = window.setTimeout(() => setLevel(0), 900);
    return () => window.clearTimeout(id);
  }, []);
  return (
    <div className="glyph glyph-signal">
      <Signal level={level} />
    </div>
  );
}

const fragments = [
  { text: "Signs offer limited context.", Glyph: SignGlyph },
  { text: "Searches scatter the story across different sources.", Glyph: ScatterGlyph },
  { text: "Language barriers make information harder to understand.", Glyph: LanguageGlyph },
  { text: "Guides and reliable internet are not always available.", Glyph: SignalGlyph },
];

export function ProblemScene({ beat }: { beat: number }) {
  const resolved = beat >= 5;
  return (
    <div className="problem">
      <motion.img
        className="photo"
        src={scan}
        alt=""
        initial={{ scale: 1.06, x: 0 }}
        animate={{ scale: resolved ? 1.1 : 1.06, x: -beat * 8 }}
        transition={arrive(0, 1.6)}
      />
      <div className="problem-shade" />

      <motion.h1 className="headline problem-headline" initial={false} animate={{ opacity: resolved ? 0.35 : 1 }} transition={arrive()}>
        <Reveal as="span" when y={0} style={{ display: "block" }}>Curiosity happens at the site.</Reveal>
        <Reveal as="span" when delay={0.25} y={0} style={{ display: "block" }}>
          <span className="muted">Answers can be harder to find.</span>
        </Reveal>
      </motion.h1>

      <motion.ul className="fragments" initial={false} animate={{ opacity: resolved ? 0.22 : 1, filter: resolved ? "blur(6px)" : "blur(0px)", y: resolved ? -20 : 0 }} transition={arrive(0, 0.9)}>
        {fragments.map(({ text, Glyph }, index) => (
          <Reveal as="li" key={text} when={beat >= index + 1} className="fragment">
            <Glyph />
            <p className="lead">{text}</p>
          </Reveal>
        ))}
      </motion.ul>

      <Reveal when={resolved} className="problem-resolution" y={36} duration={1}>
        <p className="title">Visitors leave with photographs and unanswered questions.</p>
      </Reveal>
    </div>
  );
}
