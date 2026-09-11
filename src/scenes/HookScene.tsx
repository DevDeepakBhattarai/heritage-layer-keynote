import { motion } from "framer-motion";
import hero from "../assets/hero-courtyard.webp";
import { Reveal, Words, arrive } from "../components/motion";
import { VideoSlot } from "../components/VideoSlot";
import { PRODUCT_NAME } from "../presentation";

const taglines = ["Scan a heritage site.", "Discover its story in your language.", "Find what to explore next."];

export function HookScene({ beat }: { beat: number }) {
  const branded = beat >= 2;
  return (
    <div className="hook">
      <VideoSlot kind="opening" style={{ inset: 0, borderRadius: 0 }}>
        <motion.img
          className="photo"
          src={hero}
          alt=""
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 26, ease: "linear" }}
        />
      </VideoSlot>
      <div className="hook-vignette" />
      <motion.div className="hook-dim" initial={false} animate={{ opacity: branded ? 1 : 0 }} transition={arrive(0, 1.1)} />

      <Reveal when={!branded} className="hook-copy" y={0} duration={0.5}>
        <h1 className="display">
          <Words text="Every place has a story." delay={0.35} />
        </h1>
        <Reveal when={beat >= 1} className="hook-sub">
          <p className="lead muted">A visit should help you understand it.</p>
        </Reveal>
      </Reveal>

      <Reveal when={branded} className="hook-brand" y={0} duration={0.9} delay={0.35}>
        <motion.h2 className="hook-wordmark" layout transition={arrive(0, 0.8)}>
          <span className="faint">[</span>
          {PRODUCT_NAME.replace(/^\[|\]$/g, "")}
          <span className="faint">]</span>
        </motion.h2>
        <Reveal when={beat >= 3} className="hook-taglines" y={20}>
          {taglines.map((line, index) => (
            <motion.p
              key={line}
              className="lead"
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={arrive(0.15 + index * 0.22)}
            >
              {line}
            </motion.p>
          ))}
        </Reveal>
      </Reveal>
    </div>
  );
}
