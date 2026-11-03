export type * from './model.ts';
export type * from './ports.ts';
export { canonical, hashJson, sha256 } from './hash.ts';
export { branchId, cellId, documentId, looseDocumentId, resultKey, variantKey } from './ids.ts';
export { runStage, stageKey, stageStatus, type Stage, type StageInputs, type StageRun, type StageStatus } from './stage.ts';
export { FsStore } from './fsStore.ts';
export { MemoryStore } from './memoryStore.ts';
export { appliesTo, loadClassSettings, loadConfig, loadSetups, readClassFiles, type WorkspaceConfig } from './config.ts';
export { readLog, shapeOf, statusOf, type BoxReport, type LogReading, type TexError } from './log.ts';
export {
  loadProbeLatex,
  loadTestLatex,
  probeClass,
  probeStage,
  PROBE_VERSION,
  readProbe,
  spellingOf,
  type ProbeAsk,
  type ProbeInput,
} from './classProbe.ts';
export {
  inTextBlock,
  readSentinels,
  recordingProbes,
  SENTINEL_PREAMBLE,
  sentinelCall,
  type Geometry,
  type SentinelHit,
} from './sentinels.ts';
export { damagingWarnings, type Damage } from './warnings.ts';
export { FEATURE_PROBES, type FeatureContext, type FeatureProbe } from './features.ts';
export { judge, ORACLE_VERSION, type Expected, type JudgeOptions, type Judgement } from './oracle.ts';
export { attribute, checkOf, type Attribution, type Origin, type SoloFailures } from './origin.ts';
export { fits, markedOf, planBranches, remembered, soloBranches, soloKey, type Plan, type VariantsOf, type VariantUse } from './plan.ts';
export { documentAt, documentOf, fileBranches, MANIFEST, packBranches, readDocument, type Claims, type FileOptions, type Filing, type ManifestLine, type Requires } from './file.ts';
export { resultAt, runCells, type CellJob, type CellOutcome } from './run.ts';
export { documentCells, type JudgedJob } from './cells.ts';
export {
  latestByCell,
  ledgerLine,
  newRun,
  recordRun,
  type LedgerLine,
  type Run,
  type RunSummary,
} from './ledger.ts';
export {
  candidateId,
  candidatesOf,
  countOf,
  decide,
  evidenceShape,
  EXPLAIN_VERSION,
  explainer,
  groupFailures,
  hostTrials,
  minimize,
  pairName,
  queueCandidates,
  REVIEW,
  reviewAt,
  reviewQueue,
  soloExplanations,
  symptomOf,
  type Candidate,
  type Case,
  type Decision,
  type ExplainContext,
  type Explanation,
  type FromWays,
  type Group,
  type Pair,
  type PairRun,
  type Rule,
  type SoloVerdict,
  type Symptom,
  type Trial,
  type TrialResult,
  type VariantsAt,
} from './explain.ts';
export { compatTables, waysIn, type CompatEntry } from './compat.ts';
