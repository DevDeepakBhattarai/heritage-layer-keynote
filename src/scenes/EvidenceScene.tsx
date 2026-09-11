import { motion } from "framer-motion";
import { Reveal, arrive, easeOut } from "../components/motion";

const stages = ["Source collection", "Claim and evidence review", "Approved knowledge base", "AI translation and explanation", "Visitor access"];

const kinds = [
  { label: "Historical fact", text: "A documented construction date." },
  { label: "Scholarly interpretation", text: "A researcher’s reading of the form." },
  { label: "Oral tradition", text: "A story told by temple custodians." },
  { label: "Legend", text: "A sacred origin story." },
];

const startX = 160;
const endX = 1760;
const stepX = (endX - startX) / (stages.length - 1);

export function EvidenceScene({ beat }: { beat: number }) {
  const resolved = beat >= 3;
  return (
    <div className="evidence">
      <motion.div className="evidence-body" initial={false} animate={{ opacity: resolved ? 0.18 : 1, filter: resolved ? "blur(8px)" : "blur(0px)", scale: resolved ? 0.98 : 1 }} transition={arrive(0, 0.9)}>
        <h1 className="headline evidence-headline">
          <Reveal as="span" when y={0} style={{ display: "block" }}>
            Every published claim needs evidence
          </Reveal>
        </h1>

        <Reveal when={beat >= 1} className="pipeline" y={20}>
          <p className="caption">Our proposed workflow</p>
          <svg viewBox="0 0 1920 120" className="pipeline-svg" aria-hidden="true">
            <motion.path d={`M${startX} 60 H${endX}`} stroke="var(--line-strong)" strokeWidth="2" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, delay: 0.2, ease: easeOut }} />
            {stages.map((stage, index) => {
              const authority = index === 2;
              return (
                <motion.g key={stage} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={arrive(0.3 + index * 0.32, 0.6)} style={{ transformOrigin: `${startX + index * stepX}px 60px` }}>
                  <circle cx={startX + index * stepX} cy={60} r={authority ? 22 : 12} fill={authority ? "var(--amber)" : "var(--ink)"} stroke={authority ? "var(--amber)" : "var(--paper)"} strokeWidth={2} />
                  {authority && <path d={`M${startX + index * stepX - 9} 60 l6 6 l12 -12`} fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
                </motion.g>
              );
            })}
          </svg>
          <ol className="pipeline-labels">
            {stages.map((stage, index) => (
              <motion.li key={stage} style={{ left: startX + index * stepX }} initial={{ opacity: 0, y: 10, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} transition={arrive(0.45 + index * 0.32, 0.6)} className={index === 2 ? "authority" : ""}>
                {stage}
              </motion.li>
            ))}
          </ol>
        </Reveal>

        <Reveal when={beat >= 2} className="kinds" y={24}>
          <h2 className="title">Every account keeps its classification</h2>
          <ul className="kinds-list">
            {kinds.map((kind, index) => (
              <li key={kind.label}>
                <motion.span className="stamp" initial={{ opacity: 0, scale: 1.6, rotate: -6 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.55, delay: 0.35 + index * 0.22, ease: easeOut }}>
                  {kind.label}
                </motion.span>
                <motion.p className="body" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={arrive(0.55 + index * 0.22, 0.5)}>
                  {kind.text}
                </motion.p>
              </li>
            ))}
          </ul>
        </Reveal>
      </motion.div>

      <Reveal when={resolved} className="evidence-resolution" y={30} duration={1}>
        <p className="headline">
          When evidence is missing,
          <br />
          the answer says so.
        </p>
      </Reveal>
    </div>
  );
}
