# Heritage keynote — implementation report

## Deliverable

`dist/index.html` — one standalone file (2.8 MB). JavaScript, CSS, the Inter font, and all six images are inlined. It opens directly from `file://` in Chrome, Edge, or Safari. No PPTX.

Rebuild with `pnpm build`. Full check (`typecheck → tests → build → smoke`) with `pnpm check`.

## Presenting

| Input | Action |
| --- | --- |
| Click · Space · Enter · → · PageDown | Advance one beat |
| ← · Backspace · PageUp | Back one beat |
| Home / End | First slide / last core beat |
| B | Jump to backup slides |
| N | Presenter notes (the presenter script for the current slide) |
| O | Slide overview |
| F | Fullscreen |
| ? or H | Help · Esc closes |

Deep links: `?slide=8&beat=3` (1-based). `&review=1` disables the slide entrance for screenshots.

## Structure

- `src/presentation.ts` — slide list, beat counts, presenter script, `PRODUCT_NAME` placeholder (one constant to change).
- `src/App.tsx` — beat navigation, keyboard/click handling, overlays. The stage is a fixed 1920×1080 composition scaled with CSS `zoom` to fit any viewport, so a layout verified once at design size holds on every projector.
- `src/scenes/*.tsx` — one component per slide (10 core + 3 backup), each receiving `beat`.
- `src/scenes/scenes.css` — per-scene compositions in stage pixels.
- `src/components/motion.tsx` — `Reveal`, `Words`, typewriter and count-up hooks.
- `src/components/Primitives.tsx` — QR grid, signal bars, phone frame.
- `src/components/VideoSlot.tsx` — plays `public/media/<kind>.mp4` when present at build time, otherwise renders the authored fallback.

## Motion design

One authored moment per slide, Framer Motion throughout:

1. Hook — word-by-word headline over a slow push-in; photo dims and the wordmark takes the frame.
2. Problem — four animated fragments (sign lines fading, search results scattering, script cycling कथा→物語→قصة→Story, signal bars draining) that blur away for the resolution line.
3. Product — each of Scan / Understand / Explore / Plan enters large and morphs (Framer layout animation on a persistent node) down into the running strip; the phone screen changes state alongside.
4. Visitor experience — the phone screen builds up beat by beat; annotations light on the left; the question types itself.
5. Correctness — the review pipeline draws itself; classification labels stamp in; everything blurs behind the missing-evidence line.
6. Collection — three clip-path wipes reveal thirds of the artisan image; a review bar rises.
7. Offline — signal drops to "No connection"; online and planned-offline columns arrive; QR capsule cells populate.
8. Planner — the request types in and yields constraint chips; a route path draws across the dusk photograph with stops popping in sequence.
9. Business — the transaction counts up to NPR 200 while the copy recedes.
10. Vision — the competitor context fades into the rooftop photograph; the closing line arrives word by word.

Slide changes crossfade with a slight scale and blur. `MotionConfig reducedMotion="user"` plus a CSS media rule give a coherent reduced-motion mode.

## Verification

- `pnpm test` — navigation across slide boundaries, back-stepping, modal exclusivity/focus restore (6 tests).
- `pnpm smoke` — standalone artifact checks (inlined font, images, no external refs).
- `pnpm review` — headless Chrome shoots every beat (57 frames) to `visual-review/` and asserts that no visible text leaves the stage. Passed at 1920×1080; sampled slides passed at 1440×900 and 1280×720. `--slides 3,8 --width 1280` narrows a run.
- Mid-transition frames were captured for the word morph, panel wipe, slide crossfade, and count-up to confirm the animations run rather than snap.

## Open items

- Codex image quota was exhausted this session; `SOURCES.md` lists the two slides that would benefit from fresh Codex plates.
- Video slots are empty; drop MP4s into `public/media/` and rebuild.
