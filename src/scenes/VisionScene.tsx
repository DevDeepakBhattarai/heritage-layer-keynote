import { AnimatePresence, motion } from "framer-motion";
import rooftop from "../assets/patan-rooftop.webp";
import scan from "../assets/scan-closeup.webp";
import { Reveal, Words, arrive } from "../components/motion";
import { PRODUCT_NAME } from "../presentation";

const focus = [
  "Traceable claims and documented editorial review",
  "Essential information without a live connection",
  "Questions and explanations grounded in approved content",
  "Personal travel planning connected to bookings",
];

export function CompetitionScene({ beat }: { beat: number }) {
  return (
    <div className="vision competition">
      <img className="photo competition-photo" src={scan} alt="" />
      <div className="competition-shade" />
      <h1 className="headline">
        <Reveal as="span" when y={0} style={{ display: "block" }}>
          QR heritage storytelling already exists
        </Reveal>
      </h1>
      <Reveal as="p" when className="lead muted competition-note" delay={0.3}>
        Saarang provides QR storyboards at heritage sites in Nepal.
      </Reveal>

      <Reveal when={beat >= 1} className="focus" y={20}>
        <h2 className="title">Our proposed focus</h2>
        <ul>
          {focus.map((item, index) => (
            <motion.li key={item} className="lead" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={arrive(0.25 + index * 0.14, 0.6)}>
              <motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={arrive(0.2 + index * 0.14, 0.8)} />
              {item}
            </motion.li>
          ))}
        </ul>
      </Reveal>

      <p className="footnote">
        Source: <a href="https://saarang.com.np/" target="_blank" rel="noreferrer">Saarang’s description of its QR storyboards</a>.
      </p>
    </div>
  );
}

function Rooftop() {
  return (
    <>
      <motion.img className="photo" src={rooftop} alt="" initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 22, ease: "linear" }} />
      <div className="vision-shade" />
    </>
  );
}

export function VisionScene({ beat }: { beat: number }) {
  const close = beat >= 1;
  const thanks = beat >= 2;
  return (
    <div className="vision">
      <Rooftop />
      <div className="vision-copy">
        {/* The vision line opens the slide at headline size, then shrinks up to make room for the close. */}
        <motion.p className={close ? "lead muted vision-layer small" : "headline vision-layer"} layout transition={arrive(0, 0.8)}>
          <Reveal as="span" when y={0} duration={0.8} delay={0.4} style={{ display: "block" }}>
            A trusted information layer for physical places.
          </Reveal>
        </motion.p>
        <AnimatePresence>
          {close && (
            <motion.div className="vision-close" layout initial={{ opacity: 0, y: 30, filter: "blur(12px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12, filter: "blur(8px)", transition: arrive(0, 0.3) }} transition={arrive(0, 1)}>
              <h1 className="display">
                <Words text="Don’t just visit a place." delay={0.2} />
                <br />
                <Words text="Understand it." delay={0.75} />
              </h1>
              <motion.p className="lead muted vision-brand" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={arrive(1.6, 0.9)}>
                {PRODUCT_NAME}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {thanks && (
            <motion.div className="vision-thanks" layout initial={{ opacity: 0, y: 24, filter: "blur(12px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12, filter: "blur(8px)", transition: arrive(0, 0.3) }} transition={arrive(0.1, 0.8)}>
              <motion.i className="vision-rule" aria-hidden="true" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={arrive(0.3, 0.8)} />
              <p className="title">Thank you.</p>
              <p className="lead muted">Questions welcome.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
