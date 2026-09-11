import { motion } from "framer-motion";
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

export function VisionScene() {
  return (
    <div className="vision">
      <Rooftop />
      <div className="vision-copy">
        <Reveal as="p" when className="headline vision-layer" y={0} duration={0.8} delay={0.4}>
          A trusted information layer for physical places.
        </Reveal>
      </div>
    </div>
  );
}

export function VisionCloseScene() {
  return (
    <div className="vision">
      <Rooftop />
      <div className="vision-copy">
        <p className="lead muted vision-layer small">A trusted information layer for physical places.</p>
        <div className="vision-close">
          <h1 className="display">
            <Words text="Don’t just visit a place." delay={0.2} />
            <br />
            <Words text="Understand it." delay={0.75} />
          </h1>
          <motion.p className="lead muted vision-brand" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={arrive(1.6, 0.9)}>
            {PRODUCT_NAME}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
