// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";
import { slides } from "./presentation";

describe("presentation interactions", () => {
  beforeAll(() => {
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  });
  afterAll(() => {
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = false;
  });
  let host: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    host.remove();
    window.history.replaceState(null, "", "/");
  });

  it("advances one beat per click and crosses into the next slide", async () => {
    window.history.replaceState(null, "", "/?slide=2&beat=5&review=1");
    await act(async () => root.render(<App />));
    const deck = host.querySelector<HTMLElement>(".deck")!;

    await act(async () => {
      deck.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      deck.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      deck.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const params = new URLSearchParams(window.location.search);
    // Slide 2 has six beats: 5 → 6 → slide 3 beat 1 → slide 3 beat 2.
    expect(slides[1].beats).toBe(6);
    expect(params.get("slide")).toBe("3");
    expect(params.get("beat")).toBe("2");
    expect(host.querySelector(".progress")?.getAttribute("aria-label")).toContain("Slide 3 of 11, beat 2");
  });

  it("steps back across a slide boundary to the previous slide's last beat", async () => {
    window.history.replaceState(null, "", "/?slide=3&beat=1&review=1");
    await act(async () => root.render(<App />));
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    });
    const params = new URLSearchParams(window.location.search);
    expect(params.get("slide")).toBe("2");
    expect(params.get("beat")).toBe(String(slides[1].beats));
  });

  it("keeps dialogs mutually exclusive, makes the deck inert, and restores focus", async () => {
    window.history.replaceState(null, "", "/?slide=1&beat=1&review=1");
    await act(async () => root.render(<App />));

    const helpButton = host.querySelector<HTMLButtonElement>(".help-trigger")!;
    helpButton.focus();
    await act(async () => helpButton.click());

    const deck = host.querySelector<HTMLElement>(".deck")!;
    expect(deck.inert).toBe(true);
    expect(document.querySelectorAll('[aria-modal="true"]')).toHaveLength(1);
    expect(document.activeElement?.closest('[aria-modal="true"]')).not.toBeNull();

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "o", bubbles: true }));
    });
    expect(document.querySelectorAll('[aria-modal="true"]')).toHaveLength(1);
    expect(document.querySelector('[aria-label="Slide overview"]')).not.toBeNull();

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(document.querySelectorAll('[aria-modal="true"]')).toHaveLength(0);
    expect(deck.inert).toBe(false);
    expect(document.activeElement).toBe(helpButton);
  });
});
