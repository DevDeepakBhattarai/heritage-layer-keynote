export const PRODUCT_NAME = "Nepal Yatra";

export type SlideDefinition = {
  title: string;
  beats: number;
  script: string;
  backup?: boolean;
};

export const slides = [
  {
    title: "The hook",
    beats: 4,
    script:
      "Imagine standing in front of a centuries-old temple. You can see the craftsmanship, watch the rituals, and take a photograph. But you still have questions. Who built it? What do the carvings mean? Why does this place matter to the people who live here?\n\nWe're building the product to answer those questions where they arise. One scan will connect visitors to the story of a place, with reviewed information in their language and help planning what comes next.",
  },
  {
    title: "The problem",
    beats: 6,
    script:
      "A visitor's questions are often specific to what is in front of them. A sign may name the temple without explaining its significance. An online search may return conflicting accounts. Useful information may exist only in a language the visitor cannot read.\n\nLocal guides provide valuable depth, but visitors cannot always find one for every stop. We want to make a useful introduction available whenever someone becomes curious.",
  },
  {
    title: "The product",
    beats: 5,
    script:
      "The experience begins with a QR code at a participating site. The visitor opens a short introduction, with the option to listen, read more, or ask a question.\n\nWe'll use the device's language as a starting preference and let visitors change it. Once they understand the place, they can explore nearby sites or ask for a plan that fits their time, interests, and walking preferences.\n\nThe first interaction answers a question. The next helps them continue their visit.",
  },
  {
    title: "The visitor experience",
    beats: 5,
    script:
      "We'll start with a short introduction that visitors can finish while standing at the site. Someone interested in architecture can explore the building's form. Someone curious about worship can read about local traditions and visitor etiquette.\n\nThe source material stays accessible, and follow-up questions draw on reviewed content. Visitors choose how deep to go.\n\nSource for the heritage example: Nepal Tourism Board's Kathmandu Valley guide.",
  },
  {
    title: "Information correctness",
    beats: 4,
    script:
      "Our publishing process will start with sources and human review. AI will translate and explain approved material, with answers linked back to supporting content.\n\nWe'll also preserve the distinction between different kinds of knowledge. A documented construction date is a historical claim. A story passed down by temple custodians is an oral tradition. Both can belong in the experience, with clear labels.\n\nConfirming that a community tells a story does not establish that every event in the story happened. Our responsibility is to represent the account accurately and explain what supports it.",
  },
  {
    title: "Information collection",
    beats: 5,
    script:
      "We'll begin with authoritative material that we have permission to reuse. Site visits will add knowledge that published sources may miss.\n\nWhen teams visit a location to arrange QR placement, they can also document interviews, collect references, and work with local custodians. Contributors will receive attribution where appropriate, and we'll seek permission before publishing their material.\n\nCommunity submissions will enter a review queue. Reviewers will compare the evidence with existing content, resolve questions, and record the decision before updating the published article.",
  },
  {
    title: "Offline and multilingual access",
    beats: 4,
    script:
      "Our offline plan has two parts. First, we want to encode a compact set of essential facts directly in the QR code for our installed scanner to read. Second, visitors can download larger content packs before exploring.\n\nA standard QR link still needs connectivity to open a website. The offline experience requires our scanner to be installed, and language support depends on what is available on the device.\n\nWe'll test the capsule's capacity and scanning reliability during the pilot. The full online experience will add richer media, questions, and current booking information.",
  },
  {
    title: "The AI travel planner",
    beats: 5,
    script:
      "After answering questions about a place, we can help visitors decide what to do next.\n\nThe planner will use the visitor's chosen starting point, interests, and constraints to suggest a route through documented places and participating businesses. Visitors can replace a stop or change the pace.\n\nHistorical content and live travel information need different treatment. Opening hours, prices, and availability can change, so the planner will identify missing information and confirm transaction details through connected providers.",
  },
  {
    title: "Business model",
    beats: 4,
    script:
      "The business model connects discovery with transactions. A visitor learns about a place, finds an experience they want to try, and books through a partner. We earn a commission on eligible completed bookings.\n\nIn this illustrative example, a two-thousand-rupee booking at a ten-percent commission produces two hundred rupees in gross revenue. That is before operating costs, refunds, and other applicable expenses.\n\nThe pilot will test whether booking revenue can support content review and product operations. Commercial relationships will be visible to visitors, and historical content will remain independent of booking incentives.",
  },
  {
    title: "Competition and vision",
    beats: 4,
    script:
      "Saarang provides a concrete example of QR heritage storytelling in Nepal. That establishes an existing approach we can learn from. Our pilot must show why visitors and site partners would choose our offering.\n\nWe plan to connect editorial review, offline access, and personal travel planning in one experience. The advantage will depend on the quality of our local relationships, the knowledge we collect, and how reliably we maintain it.\n\nWe'll begin with a focused heritage pilot in Nepal. Our longer-term vision is a trusted information layer that helps people understand physical places wherever they travel.",
  },
  {
    title: "Closing",
    beats: 1,
    script:
      "Thank you for your time. We're happy to take questions, and the backup slides cover verification, the offline design, and go-to-market in more detail.",
  },
  {
    title: "Verification architecture",
    beats: 4,
    backup: true,
    script:
      "We'll review individual claims as well as complete articles. Each claim will retain its source and classification, which helps reviewers identify what needs checking when an article changes.\n\nReviewers will assess sources according to the claim. A historical date may require documentary evidence. A local tradition requires accurate attribution to the community or person sharing it.\n\nIf credible sources disagree, we'll describe that disagreement or hold the claim for further review. Corrections will create a new version, preserving a record of what changed and why.\n\nWe'll also check translations for changes in meaning, particularly names, dates, cultural terms, and expressions of uncertainty.",
  },
  {
    title: "QR and offline architecture",
    beats: 4,
    backup: true,
    script:
      "The QR capsule will hold a limited amount of essential content. Larger stories, images, and audio will come through online access or downloaded packs.\n\nOur scanner must already be installed for the offline capsule to work. A visitor's available offline languages will depend on the capsule and downloaded resources. We won't promise unrestricted offline translation or AI questions.\n\nEach capsule will identify its content version. The app can check for newer material when connectivity returns, while the information printed in the physical code stays unchanged until we replace it.\n\nBefore committing to this design, we'll test how much useful content fits and whether visitors can scan the printed codes reliably in real conditions.",
  },
  {
    title: "Go-to-market",
    beats: 3,
    backup: true,
    script:
      "We propose starting with ten to twenty sites in one compact heritage area. This will make field research, visitor testing, and content maintenance easier to manage.\n\nWe'll seek permission from site custodians and work with local reviewers before publishing. The first priority is to learn whether visitors find the stories useful and can access them reliably.\n\nThen we'll test bookings with nearby businesses. We'll measure both revenue and the cost of maintaining accurate content.\n\nThose results will guide expansion and give municipalities or tourism partners concrete evidence to assess.",
  },
] satisfies readonly SlideDefinition[];

export const coreSlideCount = slides.filter((slide) => !slide.backup).length;
export const totalBeats = slides.reduce((sum, slide) => sum + slide.beats, 0);

export function globalBeatIndex(slideIndex: number, beat: number) {
  return slides.slice(0, slideIndex).reduce((sum, slide) => sum + slide.beats, 0) + beat;
}

export function clampLocation(slide: number, beat: number) {
  const slideIndex = Math.min(Math.max(slide, 0), slides.length - 1);
  const beatIndex = Math.min(Math.max(beat, 0), slides[slideIndex].beats - 1);
  return { slide: slideIndex, beat: beatIndex };
}
