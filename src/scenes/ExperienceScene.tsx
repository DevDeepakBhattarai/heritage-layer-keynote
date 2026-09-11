import { motion } from "framer-motion";
import krishna from "../assets/krishna-mandir.webp";
import { Reveal, arrive, useTypewriter } from "../components/motion";
import { Phone } from "../components/Primitives";

const annotations = ["The story in 30 seconds", "Explore by interest", "Listen to the story", "Ask about this place"];
const exploreRows = ["History and architecture", "Local traditions and legends", "Visitor etiquette", "Photos and sources"];
const waveform = [14, 26, 40, 22, 34, 48, 18, 30, 44, 20, 36, 26, 16, 38, 24, 42, 20, 30];

export function ExperienceScene({ beat }: { beat: number }) {
  const question = useTypewriter("What does Shikhara mean?", beat >= 4, 26, 0.5);
  return (
    <div className="experience">
      <div className="experience-copy">
        <h1 className="headline">
          The story first.
          <br />
          <span className="muted">More detail when you want it.</span>
        </h1>
        <ul className="annotations">
          {annotations.map((label, index) => (
            <Reveal as="li" key={label} when={beat >= index + 1} className={`annotation ${beat === index + 1 ? "current" : ""}`} y={16}>
              <i />
              <span className="lead">{label}</span>
            </Reveal>
          ))}
        </ul>
      </div>

      <motion.div className="experience-phone" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={arrive(0.15, 1)}>
        <Phone>
          <div className="screen screen-story">
            <div className="story-hero" style={{ backgroundImage: `url(${krishna})` }}>
              <strong>Krishna Mandir</strong>
              <span>Patan Durbar Square, Nepal</span>
            </div>

            <Reveal when={beat >= 1} className="story-block" y={14}>
              <h3>The story in 30 seconds</h3>
              <p>
                Krishna Mandir is a stone temple in Patan Durbar Square. Its Shikhara-style architecture offers a starting point for understanding the square’s religious buildings and craftsmanship.
              </p>
            </Reveal>

            <Reveal when={beat >= 2} className="story-block" y={14}>
              <h3>Explore this place</h3>
              <ul className="story-rows">
                {exploreRows.map((row, index) => (
                  <motion.li key={row} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={arrive(0.2 + index * 0.1, 0.5)}>
                    <span>{row}</span>
                    <svg viewBox="0 0 12 20" width="8" height="14" aria-hidden="true">
                      <path d="M2 2l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </motion.li>
                ))}
              </ul>
            </Reveal>

            <Reveal when={beat >= 3} className="story-listen" y={14}>
              <span className="play" aria-hidden="true">
                <svg viewBox="0 0 20 20" width="14" height="14">
                  <path d="M5 3l12 7-12 7z" fill="currentColor" />
                </svg>
              </span>
              <span className="listen-label">Listen to the story</span>
              <span className="wave" aria-hidden="true">
                {waveform.map((height, index) => (
                  <motion.i key={index} style={{ height }} initial={{ scaleY: 0.2 }} animate={{ scaleY: [0.3, 1, 0.45] }} transition={{ duration: 1.2, delay: index * 0.07, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }} />
                ))}
              </span>
            </Reveal>

            <Reveal when={beat >= 4} className="story-ask" y={14}>
              <span className="ask-label">Ask about this place</span>
              <span className="ask-input">
                {question.visible}
                <motion.i className="caret" animate={{ opacity: question.done ? [1, 0, 1] : 1 }} transition={{ duration: 1, repeat: Infinity }} />
              </span>
            </Reveal>
          </div>
        </Phone>
      </motion.div>

      <p className="footnote">
        Illustrative product screen. Heritage example source: <a href="https://trade.ntb.gov.np/tourist-destination/around-kathmandu/" target="_blank" rel="noreferrer">Nepal Tourism Board, Kathmandu Valley guide</a>.
      </p>
    </div>
  );
}
