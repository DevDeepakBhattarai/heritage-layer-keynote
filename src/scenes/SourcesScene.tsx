import { motion } from "framer-motion";
import details from "../assets/heritage-details.webp";
import { Reveal, arrive, easeOut } from "../components/motion";

const panels = [
  { title: "Published sources", text: "Heritage records, museum material, academic research, and official publications." },
  { title: "Field research", text: "Interviews with historians, guides, caretakers, and local communities." },
  { title: "Community contributions", text: "Missing stories, corrections, photographs, and translation feedback." },
];

const record = ["Sources", "Review status", "Revision history", "Last review date"];

export function SourcesScene({ beat }: { beat: number }) {
  const started = beat >= 1;
  return (
    <div className="sources">
      <img className="photo sources-backdrop" src={details} alt="" />

      <Reveal when={!started} className="sources-intro" y={0} duration={0.5}>
        <h1 className="headline">Published research and local knowledge belong together</h1>
      </Reveal>

      <div className="panels">
        {panels.map((panel, index) => (
          <motion.section
            key={panel.title}
            className="panel"
            initial={false}
            animate={{ clipPath: beat >= index + 1 ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }}
            transition={{ duration: 1.1, ease: easeOut }}
          >
            <div className="panel-image" style={{ backgroundImage: `url(${details})`, backgroundPosition: `${-index * 640}px 0` }} />
            <div className="panel-copy">
              <motion.h2 className="title" initial={{ opacity: 0, y: 20 }} animate={beat >= index + 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={arrive(0.5)}>
                {panel.title}
              </motion.h2>
              <motion.p className="body" initial={{ opacity: 0, y: 16 }} animate={beat >= index + 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }} transition={arrive(0.65)}>
                {panel.text}
              </motion.p>
            </div>
          </motion.section>
        ))}
      </div>

      <Reveal when={started} className="sources-kicker" y={0}>
        <h1 className="title">Published research and local knowledge belong together</h1>
      </Reveal>

      <motion.div className="review-bar" initial={false} animate={{ y: beat >= 4 ? 0 : 240, opacity: beat >= 4 ? 1 : 0 }} transition={arrive(0, 0.9)}>
        <p className="lead">Reviewers check submissions before publication.</p>
        <ul className="record">
          {record.map((item, index) => (
            <motion.li key={item} initial={{ opacity: 0, y: 8 }} animate={beat >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }} transition={arrive(0.4 + index * 0.12, 0.5)}>
              {item}
            </motion.li>
          ))}
        </ul>
        <motion.p className="caption" initial={{ opacity: 0 }} animate={beat >= 4 ? { opacity: 1 } : { opacity: 0 }} transition={arrive(0.9)}>
          Each article records its sources, review status, revision history, and last review date.
        </motion.p>
      </motion.div>
    </div>
  );
}
