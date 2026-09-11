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

export function VisionScene({ beat }: { beat: number }) {
  const vision = beat >= 2;
  return (
    <div className="vision">
      <motion.img className="photo" src={rooftop} alt="" initial={false} animate={{ opacity: vision ? 1 : 0, scale: vision ? 1 : 1.12 }} transition={{ opacity: arrive(0, 1.4), scale: { duration: 22, ease: "linear" } }} />
      <motion.div className="vision-shade" initial={false} animate={{ opacity: vision ? 1 : 0 }} transition={arrive(0, 1.4)} />

      <Reveal when={!vision} className="competition" y={0} duration={0.5}>
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
      </Reveal>

      <Reveal when={vision} className="vision-copy" y={0} duration={0.8} delay={0.5}>
        <motion.p className={beat >= 3 ? "lead muted vision-layer small" : "headline vision-layer"} layout transition={arrive(0, 0.8)}>
          A trusted information layer for physical places.
        </motion.p>
        <Reveal when={beat >= 3} className="vision-close" y={30} duration={1}>
          <h1 className="display">
            <Words text="Don’t just visit a place." delay={0.2} />
            <br />
            <Words text="Understand it." delay={0.75} />
          </h1>
          <motion.p className="lead muted vision-brand" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={arrive(1.6, 0.9)}>
            {PRODUCT_NAME}
          </motion.p>
        </Reveal>
      </Reveal>
    </div>
  );
}
