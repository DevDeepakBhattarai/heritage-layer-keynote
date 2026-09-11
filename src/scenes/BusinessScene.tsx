import { motion } from "framer-motion";
import details from "../assets/heritage-details.webp";
import { Reveal, arrive, useCountUp } from "../components/motion";

const streams = [
  {
    label: "Commissions",
    intro: "On eligible bookings for",
    items: ["Hotels · Booking.com, Tripadvisor", "Taxis · Pathao, inDrive", "Restaurants and cafés", "Tours and attraction tickets"],
  },
  {
    label: "Subscription",
    intro: "For visitors who want more",
    items: ["Unlimited questions about a place", "Detailed multi-day trip planning", "Saved routes across a whole visit"],
  },
];

export function BusinessScene({ beat }: { beat: number }) {
  const transaction = beat >= 3;
  const revenue = useCountUp(200, transaction, 0.7, 0.9);
  return (
    <div className="business">
      <motion.img className="photo business-backdrop" src={details} alt="" initial={{ scale: 1.06 }} animate={{ scale: transaction ? 1.12 : 1.06, x: transaction ? -60 : 0 }} transition={arrive(0, 1.6)} />
      <div className="business-shade" />
      <motion.div className="business-dim" initial={false} animate={{ opacity: transaction ? 1 : 0 }} transition={arrive(0, 1)} />

      <motion.div className="business-copy" initial={false} animate={{ opacity: transaction ? 0.3 : 1, x: transaction ? -20 : 0 }} transition={arrive(0, 0.8)}>
        <h1 className="headline">
          <Reveal as="span" when y={0} style={{ display: "block" }}>
            Two revenue streams after visitors discover value
          </Reveal>
        </h1>

        <Reveal when={beat >= 1} className="business-free" y={20}>
          <p className="title">Keep essential heritage stories free to access.</p>
        </Reveal>

        <Reveal when={beat >= 2} className="business-streams" y={20}>
          {streams.map((stream, column) => (
            <div key={stream.label} className="business-stream">
              <motion.h2 className="title" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={arrive(0.15 + column * 0.45, 0.6)}>
                {stream.label}
              </motion.h2>
              <motion.p className="caption" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={arrive(0.25 + column * 0.45, 0.6)}>
                {stream.intro}
              </motion.p>
              <ul>
                {stream.items.map((item, index) => (
                  <motion.li key={item} className="body" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={arrive(0.35 + column * 0.45 + index * 0.12, 0.6)}>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
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
