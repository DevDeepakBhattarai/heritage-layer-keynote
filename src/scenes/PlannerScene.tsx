import { motion } from "framer-motion";
import dusk from "../assets/patan-dusk.webp";
import { Reveal, arrive, easeOut } from "../components/motion";
import { VideoSlot } from "../components/VideoSlot";

const request = "I have four hours. I love architecture and local food, and I want to walk less than three kilometres.";
const constraints = ["4 hours", "Architecture", "Local food", "Under 3 km"];

const stops = [
  { label: "Explore the current heritage site", x: 60, y: 400, above: false },
  { label: "Stop for local food", x: 330, y: 270, above: true },
  { label: "Visit an artisan workshop", x: 560, y: 350, above: false },
  { label: "Discover another nearby landmark", x: 800, y: 150, above: true },
  { label: "Arrange a ride back", x: 1020, y: 250, above: false },
];

const routePath = "M60 400 C 160 400, 230 270, 330 270 C 430 270, 460 350, 560 350 C 660 350, 700 150, 800 150 C 900 150, 940 250, 1020 250";

export function PlannerScene({ beat }: { beat: number }) {
  const routed = beat >= 2;
  return (
    <div className="planner">
      <motion.img className="photo" src={dusk} alt="" initial={{ scale: 1.08, x: 0 }} animate={{ scale: routed ? 1.02 : 1.08, x: routed ? -30 : 0 }} transition={arrive(0, 1.8)} />
      <div className="planner-shade" />

      <h1 className="headline planner-headline">
        <Reveal as="span" when y={0} style={{ display: "block" }}>
          A plan built around the visitor
        </Reveal>
      </h1>

      <Reveal when={beat === 1} className="planner-request" y={20}>
        <p className="title">“{request}”</p>
        <ul className="constraints">
          {constraints.map((item, index) => (
            <motion.li key={item} initial={{ opacity: 0, y: 12, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={arrive(0.15 + index * 0.12, 0.5)}>
              {item}
            </motion.li>
          ))}
        </ul>
      </Reveal>

      <Reveal when={routed} className="planner-compact" y={12}>
        <p className="body">“{request}”</p>
        <ul className="constraints">
          {constraints.map((item, index) => (
            <motion.li key={item} initial={false} animate={{ scale: beat === 3 ? [1, 1.08, 1] : 1, borderColor: beat >= 3 ? "var(--amber)" : "var(--line-strong)" }} transition={{ duration: 0.6, delay: index * 0.08, ease: easeOut }}>
              {item}
            </motion.li>
          ))}
        </ul>
      </Reveal>

      <Reveal when={routed} className="route" y={30} duration={0.9}>
        <p className="caption">Illustrative afternoon</p>
        <VideoSlot kind="journey" style={{ width: 1100, height: 520 }}>
          <svg viewBox="0 0 1100 520" className="route-svg" aria-hidden="true">
            <motion.path d={routePath} fill="none" stroke="var(--amber)" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.4, delay: 0.3, ease: easeOut }} />
            {stops.map((stop, index) => (
              <motion.circle key={stop.label} cx={stop.x} cy={stop.y} r={index === 0 ? 12 : 9} fill={index === 0 ? "var(--amber)" : "var(--ink)"} stroke="var(--amber)" strokeWidth="3" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={arrive(0.35 + index * 0.5, 0.5)} style={{ transformOrigin: `${stop.x}px ${stop.y}px` }} />
            ))}
          </svg>
          <ol className="stops">
            {stops.map((stop, index) => (
              <motion.li key={stop.label} style={{ left: stop.x, top: stop.above ? stop.y - 30 : stop.y + 26 }} initial={{ opacity: 0, x: index === 0 ? "-12%" : "-50%", y: stop.above ? "-92%" : "8%" }} animate={{ opacity: 1, x: index === 0 ? "-12%" : "-50%", y: stop.above ? "-100%" : "0%" }} transition={arrive(0.55 + index * 0.5, 0.6)}>
                {stop.label}
                {index === 1 && (
                  <motion.em initial={{ opacity: 0, y: 6 }} animate={beat >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }} transition={arrive(0.3, 0.5)}>
                    Check hours
                  </motion.em>
                )}
              </motion.li>
            ))}
          </ol>
        </VideoSlot>
      </Reveal>

      <div className="planner-notes">
        <Reveal as="p" when={beat >= 3} className="lead" y={16}>
          Adjust for time, interests, budget, and walking distance.
        </Reveal>
        <Reveal as="p" when={beat >= 4} className="lead muted" y={16}>
          Check opening hours and availability before confirming.
        </Reveal>
      </div>
    </div>
  );
}
