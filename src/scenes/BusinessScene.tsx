import { AnimatePresence, motion } from "framer-motion";
import details from "../assets/heritage-details.webp";
import { Reveal, arrive, useCountUp } from "../components/motion";

const subscription = {
  label: "Subscription",
  intro: "For visitors who want more than the free story.",
  items: ["Unlimited questions about a place", "Detailed multi-day trip planning", "Saved routes across a whole visit"],
  note: "Pricing will be tested in the pilot.",
};

const commission = {
  label: "Commissions",
  intro: "On eligible bookings made through partners.",
  items: ["Hotels · Booking.com, Tripadvisor", "Taxis · Pathao, inDrive", "Restaurants and cafés", "Tours and attraction tickets"],
  note: "Partner terms will vary.",
};

export function BusinessScene({ beat }: { beat: number }) {
  const transaction = beat >= 3;
  const stream = beat >= 2 ? commission : beat >= 1 ? subscription : null;
  const revenue = useCountUp(200, transaction, 0.7, 0.9);
  return (
    <div className="business">
      <motion.img className="photo business-backdrop" src={details} alt="" initial={{ scale: 1.06 }} animate={{ scale: transaction ? 1.12 : 1.06, x: transaction ? -60 : 0 }} transition={arrive(0, 1.6)} />
      <div className="business-shade" />
      <motion.div className="business-dim" initial={false} animate={{ opacity: transaction ? 1 : 0 }} transition={arrive(0, 1)} />

      <motion.div className="business-copy" initial={false} animate={{ opacity: transaction ? 0.3 : 1, x: transaction ? -20 : 0 }} transition={arrive(0, 0.8)}>
        <h1 className="headline">
          <Reveal as="span" when y={0} style={{ display: "block" }}>
            Two revenue streams
          </Reveal>
        </h1>
        <Reveal as="p" when className="lead muted business-free" delay={0.3}>
          Essential heritage stories stay free.
        </Reveal>

        {/* One stream on screen at a time: subscription first, then the commission the transaction builds on. */}
        <AnimatePresence mode="wait">
          {stream && (
            <motion.div key={stream.label} className="business-stream" initial={{ opacity: 0, y: 20, filter: "blur(12px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12, filter: "blur(8px)", transition: arrive(0, 0.3) }} transition={arrive(0, 0.7)}>
              <h2 className="title">{stream.label}</h2>
              <p className="lead muted">{stream.intro}</p>
              <ul>
                {stream.items.map((item, index) => (
                  <motion.li key={item} className="lead" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={arrive(0.3 + index * 0.12, 0.6)}>
                    {item}
                  </motion.li>
                ))}
              </ul>
              <motion.p className="caption" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={arrive(0.9, 0.6)}>
                {stream.note}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <Reveal when={transaction} className="transaction" y={40} duration={1}>
        <p className="caption">Illustrative transaction</p>
        <dl>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={arrive(0.2)}>
            <dt className="tnum">NPR 2,000</dt>
            <dd>booking</dd>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={arrive(0.5)}>
            <dt className="tnum">× 10%</dt>
            <dd>commission</dd>
          </motion.div>
          <motion.i className="transaction-rule" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={arrive(0.75, 0.8)} />
          <motion.div className="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={arrive(0.85)}>
            <dt className="tnum">
              NPR <span>{revenue}</span>
            </dt>
            <dd>gross revenue</dd>
          </motion.div>
        </dl>
        <motion.p className="caption" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={arrive(2.2)}>
          Example assumptions, before costs. Partner terms will vary.
        </motion.p>
      </Reveal>
    </div>
  );
}
