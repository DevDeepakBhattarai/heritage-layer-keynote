import { describe, expect, it } from "vitest";
import { clampLocation, globalBeatIndex, slides, totalBeats } from "./presentation";

describe("presentation model", () => {
  it("contains nine core slides and two backups, and ends on the vision slide", () => {
    expect(slides.filter((slide) => !slide.backup)).toHaveLength(9);
    expect(slides.filter((slide) => slide.backup)).toHaveLength(2);
    expect(slides.at(-1)!.title).toBe("The vision");
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
