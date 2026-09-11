import { GoToMarketBackup, OfflineBackup, VerificationBackup } from "./BackupScenes";
import { BusinessScene } from "./BusinessScene";
import { ClosingScene } from "./ClosingScene";
import { EvidenceScene } from "./EvidenceScene";
import { ExperienceScene } from "./ExperienceScene";
import { HookScene } from "./HookScene";
import { OfflineScene } from "./OfflineScene";
import { PlannerScene } from "./PlannerScene";
import { ProblemScene } from "./ProblemScene";
import { ProductScene } from "./ProductScene";
import { SourcesScene } from "./SourcesScene";
import { VisionScene } from "./VisionScene";
import "./scenes.css";

const scenes = [
  HookScene,
  ProblemScene,
  ProductScene,
  ExperienceScene,
  EvidenceScene,
  SourcesScene,
  OfflineScene,
  PlannerScene,
  BusinessScene,
  VisionScene,
  ClosingScene,
  VerificationBackup,
  OfflineBackup,
  GoToMarketBackup,
];

export function SlideRenderer({ slide, beat }: { slide: number; beat: number }) {
  const Scene = scenes[slide];
  return Scene ? <Scene beat={beat} /> : null;
}
