import { AnimatePresence, motion } from "framer-motion";
import dusk from "../assets/patan-dusk.webp";
import { Reveal, arrive } from "../components/motion";
import { Qr, Signal } from "../components/Primitives";
import { VideoSlot } from "../components/VideoSlot";

const online = ["Full stories and images", "Questions grounded in reviewed content", "Supported language selection", "Planning and booking access"];
const offline = ["A compact essential story", "Reading through our installed scanner", "Languages included or downloaded", "A visible content version"];

function ConnectionDrop({ dropped }: { dropped: boolean }) {
  return (
    <div className="connection">
      <Signal level={dropped ? 0 : 5} className="connection-signal" />
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={String(dropped)} className="connection-label" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={arrive(0, 0.4)}>
          {dropped ? "No connection" : "Connected"}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function Column({ heading, rows, when, className }: { heading: string; rows: string[]; when: boolean; className?: string }) {
  return (
    <Reveal when={when} className={`column ${className ?? ""}`} y={20}>
      <h2 className="title">{heading}</h2>
      <ul>
        {rows.map((row, index) => (
          <motion.li key={row} className="body" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={arrive(0.25 + index * 0.14, 0.6)}>
            {row}
          </motion.li>
        ))}
      </ul>
    </Reveal>
  );
}

export function OfflineScene({ beat }: { beat: number }) {
  // The signal drops when the offline column appears, so the status always matches what is on screen.
  const dropped = beat >= 2;
  return (
    <div className="offline">
      <motion.img className="photo offline-backdrop" src={dusk} alt="" initial={{ scale: 1.05 }} animate={{ scale: 1 }} transition={{ duration: 18, ease: "linear" }} />
      <div className="offline-shade" />

      <h1 className="headline offline-headline">
        <Reveal as="span" when y={0} style={{ display: "block" }}>
          Essential context when connectivity drops
        </Reveal>
      </h1>

      <motion.div className="offline-signal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={arrive(0.4, 0.8)}>
        <VideoSlot kind="offline" style={{ width: 520, height: 300 }}>
          <ConnectionDrop dropped={dropped} />
        </VideoSlot>
      </motion.div>

      <div className="compare">
        <Column heading="Online experience" rows={online} when={beat >= 1} />
        <Column heading="Planned offline experience" rows={offline} when={beat >= 2} className="planned" />
      </div>

      <Reveal when={beat >= 3} className="capsule" y={24}>
        <Qr size={21} seed={11} animate style={{ width: 120, color: "var(--amber)" }} />
        <p className="lead">
          The proposed QR capsule carries a small amount of text.
          <br />
          <span className="muted">Downloaded packs can provide more.</span>
        </p>
      </Reveal>
    </div>
  );
}
