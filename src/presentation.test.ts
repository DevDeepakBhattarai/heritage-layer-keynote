import { describe, expect, it } from "vitest";
import { clampLocation, globalBeatIndex, slides, totalBeats } from "./presentation";

describe("presentation model", () => {
  it("contains eleven core slides and three backups, and ends on the closing slide", () => {
    expect(slides.filter((slide) => !slide.backup)).toHaveLength(11);
    expect(slides.filter((slide) => slide.backup)).toHaveLength(3);
    expect(slides.at(-1)!.title).toBe("Closing");
  });

  it("clamps deep links to a valid beat", () => {
    expect(clampLocation(99, 99)).toEqual({
      slide: slides.length - 1,
      beat: slides.at(-1)!.beats - 1,
    });
    expect(clampLocation(-2, -4)).toEqual({ slide: 0, beat: 0 });
  });

  it("counts every beat exactly once", () => {
    const lastSlide = slides.length - 1;
    const lastBeat = slides[lastSlide].beats - 1;
    expect(globalBeatIndex(lastSlide, lastBeat)).toBe(totalBeats - 1);
  });
});
