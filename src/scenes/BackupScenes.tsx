import { motion } from "framer-motion";
import { Reveal, arrive, easeOut } from "../components/motion";
import { Qr } from "../components/Primitives";

const claimSteps = [
  "Record the claim and its source.",
  "Classify the account.",
  "Compare supporting and conflicting evidence.",
  "Assign an appropriate reviewer.",
  "Publish the decision with attribution.",
  "Track corrections and review dates.",
];

export function VerificationBackup({ beat }: { beat: number }) {
  return (
    <div className="backup verification">
      <h1 className="headline">
        <Reveal as="span" when y={0} style={{ display: "block" }}>
          How a claim becomes published information
        </Reveal>
      </h1>

      <Reveal when={beat >= 1} className="claim-steps" y={20}>
        <ol>
          {claimSteps.map((step, index) => (
            <motion.li key={step} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={arrive(0.15 + index * 0.12, 0.6)}>
              <span className="tnum">{index + 1}</span>
              <p className="lead">{step}</p>
            </motion.li>
          ))}
        </ol>
      </Reveal>

      <div className="claim-cases">
        <Reveal when={beat >= 2} className="claim-case" y={20}>
          <h2 className="title">When sources disagree</h2>
          <p className="body">Explain the disagreement. Preserve attribution. Mark unresolved claims.</p>
        </Reveal>
        <Reveal when={beat >= 3} className="claim-case" y={20}>
          <h2 className="title">When AI cannot support an answer</h2>
          <motion.p className="answer" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={arrive(0.4)}>
            “We don’t have enough reviewed information to answer that yet.”
          </motion.p>
        </Reveal>
      </div>
    </div>
  );
}

const capsuleColumns = [
  { title: "Inside the QR capsule", rows: ["Site identifier", "Content version", "Compressed essential text"] },
  { title: "On the visitor’s device", rows: ["Installed scanner and decoder", "Available language resources", "Optional downloaded site packs"] },
  { title: "When connectivity returns", rows: ["Check for updates", "Retrieve full content", "Enable online questions and booking services"] },
];

export function OfflineBackup({ beat }: { beat: number }) {
  return (
    <div className="backup capsule-design">
      <h1 className="headline">
        <Reveal as="span" when y={0} style={{ display: "block" }}>
          Proposed offline design
        </Reveal>
      </h1>

      <div className="capsule-columns">
        {capsuleColumns.map((column, index) => (
          <Reveal key={column.title} when={beat >= index + 1} className="capsule-column" y={24}>
            {index === 0 ? (
              <Qr size={21} seed={5} animate style={{ width: 96, color: "var(--amber)" }} />
            ) : (
              <motion.svg viewBox="0 0 96 96" width="96" height="96" aria-hidden="true" className="capsule-icon">
                {index === 1 ? (
                  <motion.rect x="26" y="8" width="44" height="80" rx="9" fill="none" stroke="var(--amber)" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.2, ease: easeOut }} />
                ) : (
                  <motion.path d="M12 60 A 40 40 0 0 1 84 60 M28 70 A 24 24 0 0 1 68 70 M44 80 A 8 8 0 0 1 52 80" fill="none" stroke="var(--amber)" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.2, ease: easeOut }} />
                )}
              </motion.svg>
            )}
            <h2 className="title">{column.title}</h2>
            <ul>
              {column.rows.map((row, rowIndex) => (
                <motion.li key={row} className="body" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={arrive(0.3 + rowIndex * 0.12, 0.6)}>
                  {row}
                </motion.li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <Reveal as="p" when={beat >= 3} className="lead muted capsule-note" delay={0.6}>
        Pilot tests will measure capacity, scan reliability, and language coverage.
      </Reveal>
    </div>
  );
}
