import { AnimatePresence, motion } from "framer-motion";
import krishna from "../assets/krishna-mandir.webp";
import scan from "../assets/scan-closeup.webp";
import { Reveal, arrive, easeOut } from "../components/motion";
import { Phone } from "../components/Primitives";

const steps = [
  { word: "Scan", text: "Open the story of the place in front of you." },
  { word: "Understand", text: "Read or listen in your preferred supported language." },
  { word: "Explore", text: "Ask questions and discover nearby places." },
  { word: "Plan", text: "Build a journey around your interests and available time." },
];

function ScanScreen() {
  return (
    <div className="screen screen-scan" style={{ backgroundImage: `url(${scan})` }}>
      <div className="viewfinder">
        <i className="corner tl" />
        <i className="corner tr" />
        <i className="corner bl" />
        <i className="corner br" />
        <motion.i className="scanline" initial={{ top: "6%" }} animate={{ top: ["6%", "94%", "6%"] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }} />
      </div>
      <motion.p className="screen-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={arrive(0.6)}>
        Point at the marker
      </motion.p>
      <motion.div className="scan-found" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={arrive(1.6, 0.6)}>
        <strong>Krishna Mandir</strong>
        <span>Open story</span>
      </motion.div>
    </div>
  );
}

const languages = ["English", "नेपाली", "日本語", "Deutsch"];

function TextLines({ widths, delay }: { widths: number[]; delay: number }) {
  return (
    <div className="screen-text">
      {widths.map((width, index) => (
        <motion.i key={index} style={{ width: `${width}%` }} initial={{ opacity: 0, scaleX: 0.6 }} animate={{ opacity: 1, scaleX: 1 }} transition={arrive(delay + index * 0.06, 0.6)} />
      ))}
    </div>
  );
}

function UnderstandScreen() {
  return (
    <div className="screen screen-understand">
      <div className="screen-hero" style={{ backgroundImage: `url(${krishna})` }}>
        <strong>Krishna Mandir</strong>
        <span>Patan Durbar Square</span>
      </div>
      <div className="lang-row">
        {languages.map((language, index) => (
          <motion.span key={language} className={index === 0 ? "active" : ""} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={arrive(0.35 + index * 0.08, 0.5)}>
            {language}
          </motion.span>
        ))}
      </div>
      <motion.h3 className="screen-heading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={arrive(0.5)}>
        The story in 30 seconds
      </motion.h3>
      <TextLines widths={[100, 96, 88, 72, 94, 60]} delay={0.55} />
      <motion.h3 className="screen-heading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={arrive(0.95)}>
        History and architecture
      </motion.h3>
      <TextLines widths={[98, 84, 92, 50]} delay={1} />
      <motion.div className="screen-listen" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={arrive(1.3)}>
        <span className="play" aria-hidden="true">
          <svg viewBox="0 0 20 20" width="14" height="14">
            <path d="M5 3l12 7-12 7z" fill="currentColor" />
          </svg>
        </span>
        Listen to the story
        <em className="tnum">2:40</em>
      </motion.div>
    </div>
  );
}

const places = [
  { name: "Patan Museum", x: 62, y: 30, distance: "3 min walk" },
  { name: "Golden Temple", x: 26, y: 50, distance: "7 min walk" },
  { name: "Mahabouddha", x: 70, y: 70, distance: "12 min walk" },
];

function ExploreScreen() {
  return (
    <div className="screen screen-explore">
      <div className="map">
        <svg viewBox="0 0 376 360" aria-hidden="true">
          <g className="map-streets">
            <path d="M-10 110 C 120 90, 200 140, 390 100" />
            <path d="M-10 230 C 90 210, 260 270, 390 220" />
            <path d="M120 -10 C 140 110, 90 280, 130 370" />
            <path d="M260 -10 C 250 130, 300 260, 270 370" />
            <path d="M-10 320 L 390 340" />
          </g>
          <motion.circle cx="188" cy="185" r="7" fill="var(--amber)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={arrive(0.2, 0.6)} style={{ transformOrigin: "188px 185px" }} />
          <motion.circle cx="188" cy="185" r="7" fill="none" stroke="var(--amber)" strokeWidth="2" initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 4, opacity: 0 }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} style={{ transformOrigin: "188px 185px" }} />
        </svg>
        {places.map((place, index) => (
          <motion.span key={place.name} className="map-pin" style={{ left: `${place.x}%`, top: `${place.y}%` }} initial={{ opacity: 0, scale: 0.6, x: "-50%", y: "-50%" }} animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }} transition={arrive(0.6 + index * 0.18, 0.6)}>
            <i />
            {place.name}
          </motion.span>
        ))}
      </div>
      <motion.h3 className="screen-heading" style={{ margin: "18px 22px 6px" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={arrive(1)}>
        Nearby
      </motion.h3>
      <ul className="nearby">
        {places.map((place, index) => (
          <motion.li key={place.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={arrive(1.05 + index * 0.1, 0.5)}>
            <span>{place.name}</span>
            <em className="tnum">{place.distance}</em>
          </motion.li>
        ))}
      </ul>
      <motion.div className="ask-field" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={arrive(1.4)}>
        Ask about this place
      </motion.div>
      <div className="suggestions">
        {["What does Shikhara mean?", "Who built it?", "Visitor etiquette"].map((question, index) => (
          <motion.span key={question} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={arrive(1.55 + index * 0.1, 0.5)}>
            {question}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

const stops = [
  ["13:00", "Krishna Mandir"],
  ["13:50", "Local food"],
  ["14:40", "Artisan workshop"],
  ["15:30", "Nearby landmark"],
  ["16:40", "Ride back"],
];

function PlanScreen() {
  return (
    <div className="screen screen-plan">
      <div className="plan-map">
        <svg viewBox="0 0 376 190" aria-hidden="true">
          <g className="map-streets">
            <path d="M-10 60 C 120 40, 200 90, 390 50" />
            <path d="M-10 150 C 90 130, 260 190, 390 140" />
            <path d="M120 -10 C 140 60, 90 150, 130 200" />
            <path d="M260 -10 C 250 70, 300 140, 270 200" />
          </g>
          <motion.path d="M40 140 C 90 130, 110 70, 160 80 S 250 130, 300 60 S 340 40, 350 50" fill="none" stroke="var(--amber)" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, delay: 0.3, ease: easeOut }} />
        </svg>
      </div>
      <div className="plan-head">
        <strong>This afternoon</strong>
        <span className="tnum">4 hours · 2.8 km</span>
      </div>
      <ol className="plan-list">
        {stops.map(([time, stop], index) => (
          <motion.li key={stop} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={arrive(0.3 + index * 0.14, 0.6)}>
            <i />
            <em className="tnum">{time}</em>
            <span>{stop}</span>
          </motion.li>
        ))}
        <motion.i className="plan-line" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1.1, delay: 0.35, ease: easeOut }} />
      </ol>
      <motion.div className="plan-cta" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={arrive(1.1)}>
        Adjust the plan
      </motion.div>
    </div>
  );
}

const screens = [ScanScreen, UnderstandScreen, ExploreScreen, PlanScreen];

export function ProductScene({ beat }: { beat: number }) {
  const step = beat - 1;
  const Screen = screens[Math.max(0, step)];
  return (
    <div className="product">
      <div className="product-glow" />
      <Reveal when={beat === 0} className="product-intro" y={0} duration={0.6}>
        <h1 className="headline">A heritage guide that starts with one scan</h1>
      </Reveal>

      {step >= 0 && (
        <>
          <div className="product-words" aria-label={steps[step].word}>
            {steps.map((item, index) => {
              const state = index < step ? "past" : index === step ? "current" : "future";
              return (
                <motion.span
                  key={item.word}
                  layout
                  className={`product-word ${state}`}
                  initial={false}
                  animate={{ opacity: state === "future" ? 0 : 1, y: state === "future" ? 48 : 0 }}
                  transition={{ layout: { duration: 0.95, ease: [0.3, 0.8, 0.2, 1] }, opacity: { duration: 0.5, ease: easeOut }, y: { duration: 0.8, ease: easeOut } }}
                  aria-hidden={state !== "current"}
                >
                  {item.word}
                  {state === "past" ? "." : ""}
                </motion.span>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={steps[step].text}
              className="lead muted product-text"
              initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)", transition: { duration: 0.25 } }}
              transition={arrive(0.3)}
            >
              {steps[step].text}
            </motion.p>
          </AnimatePresence>

            <motion.div className="product-phone" initial={{ opacity: 0, y: 60, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={arrive(0.1, 1)}>
              <Phone>
                <AnimatePresence initial={false}>
                  <motion.div
                    key={step}
                    className="screen-layer"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.3 } }}
                    transition={arrive(0.05, 0.6)}
                  >
                    <Screen />
                  </motion.div>
                </AnimatePresence>
              </Phone>
            </motion.div>
        </>
      )}
    </div>
  );
}
