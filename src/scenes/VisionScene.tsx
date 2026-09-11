import { AnimatePresence, motion } from "framer-motion";
import rooftop from "../assets/patan-rooftop.webp";
import { Reveal, Words, arrive } from "../components/motion";
import { PRODUCT_NAME } from "../presentation";

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
