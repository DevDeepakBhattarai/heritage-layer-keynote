import { GoToMarketBackup, OfflineBackup, VerificationBackup } from "./BackupScenes";
import { BusinessScene } from "./BusinessScene";
import { ExperienceScene } from "./ExperienceScene";
import { HookScene } from "./HookScene";
import { OfflineScene } from "./OfflineScene";
import { PlannerScene } from "./PlannerScene";
import { ProblemScene } from "./ProblemScene";
import { ProductScene } from "./ProductScene";
import { SourcesScene } from "./SourcesScene";
import { CompetitionScene, VisionCloseScene, VisionScene } from "./VisionScene";
import "./scenes.css";

const scenes = [
  HookScene,
  ProblemScene,
  ProductScene,
  ExperienceScene,
  SourcesScene,
  OfflineScene,
  PlannerScene,
  BusinessScene,
  CompetitionScene,
  VerificationBackup,
  OfflineBackup,
  GoToMarketBackup,
  VisionScene,
  VisionCloseScene,
];

export function SlideRenderer({ slide, beat }: { slide: number; beat: number }) {
  const Scene = scenes[slide];
  return Scene ? <Scene beat={beat} /> : null;
}
