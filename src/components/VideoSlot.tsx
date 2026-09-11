import type { CSSProperties, ReactNode } from "react";

type VideoKind = "opening" | "offline" | "journey";

const availability: Record<VideoKind, boolean> = {
  opening: __MEDIA_OPENING__,
  offline: __MEDIA_OFFLINE__,
  journey: __MEDIA_JOURNEY__,
};

/**
 * Plays `public/media/<kind>.mp4` when the file existed at build time; otherwise
 * renders the authored motion fallback passed as children.
 */
export function VideoSlot({ kind, style, className, children }: { kind: VideoKind; style?: CSSProperties; className?: string; children: ReactNode }) {
  if (!availability[kind]) return <>{children}</>;
  return (
    <div className={`video-slot ${className ?? ""}`} style={style} data-no-advance>
      <video src={`./media/${kind}.mp4`} autoPlay muted loop playsInline />
    </div>
  );
}
