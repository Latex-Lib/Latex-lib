/**
 * The ledger (ARCHITECTURE.md section 7): one line per cell per run,
 * append-only, so it is the history of every result. `latestByCell` is the
 * view that reports and comparisons read.
 *
 * A line holds what the log says (`log.ts`) and, when the cell was
 * judged, each branch's verdict (`oracle.ts`).
 */
import { shapeOf, statusOf } from './log.ts';
import { ORACLE_VERSION, type Judgement } from './oracle.ts';
import type { BranchId, CellId, CellStatus, DocumentId, Failure, Json, Verdict } from './model.ts';
import type { Store } from './ports.ts';
import type { CellOutcome } from './run.ts';

export type LedgerLine = {
  readonly run: string;
  readonly at: string;
  readonly cell: CellId;
  readonly document: DocumentId;
  readonly classSetting: string;
  readonly setup: string;
  readonly engine: string;
  readonly result: string;
  readonly cached: boolean;
  readonly status: CellStatus;
  readonly pages: number | null;
  readonly errors: readonly { readonly message: string; readonly line?: number }[];
  /** Each distinct warning's shape (`shapeOf`), in the order first seen. */
  readonly warnings: readonly string[];
  readonly overfull: number;
  readonly underfull: number;
  readonly missing: readonly string[];
  readonly ms: number;
  readonly threw?: string;
  /**
   * Each branch's verdict, when the cell was judged, under this oracle
   * version. Its failures are its own: every verdict also carries each of
   * `problems` with a `:document` suffix, written once there and not once per
   * branch (a missing glyph a thousand times over, in each of 64 branches,
   * made a line of 9 MB). A `:document` failure only some branches carry
   * (those a skipped end of file never reached, `oracle.ts`) stays in theirs.
   */
  readonly oracle?: number;
  readonly verdicts?: readonly LedgerVerdict[];
  /** What the log could not tie to one branch. */
  readonly problems?: readonly Failure[];
};

/**
 * A branch's verdict as the ledger keeps it. `denied` is the host's reason when its nesting contexts deny the branch (the host's
 * `contextDenied`, as `<giver> > <way>`), or when the library bans its last step under the cell's class setting (`ban:<why>
 * <parent> > <way>`, 2026-11-10): such a branch is compiled only to test the denial, so reports count it apart (b23; a run
 * before b23 wrote none, and a reader recomputes it from that run's tree).
 */
export type LedgerVerdict = Pick<Verdict, 'branch' | 'pass' | 'failures'> & { readonly denied?: string };

/**
 * The denial of a branch under a class setting, else nothing (`LedgerVerdict.denied`): the host's nesting contexts deny it, or
 * the library bans its last step under that class setting (the host's matrix bans, 2026-11-10).
 */
export type DeniedOf = (branch: BranchId, classSetting: string) => string | undefined;

export type Run = { readonly id: string; readonly at: string };

export type RunSummary = {
  readonly run: string;
  readonly cells: number;
  /** Distinct compiles this run: cells that shared LaTeX shared one. */
  readonly compiled: number;
  readonly cached: number;
  readonly status: { readonly [status in CellStatus]: number };
  /** Branch verdicts across the judged cells. */
  readonly branches: { readonly pass: number; readonly fail: number };
};

/** A run, named by the moment it started. */
export const newRun = (now: Date = new Date()): Run => {
  const at = now.toISOString();
  return { id: `r${at.replace(/[-:.TZ]/g, '')}`, at };
};

export const ledgerLine = (outcome: CellOutcome, run: Run, engine: string, judgement?: Judgement, deniedOf?: DeniedOf): LedgerLine => {
  const { cell, result } = outcome;
  const { status, reading } = statusOf(result);
  const pages = reading.pages;
  return {
    run: run.id,
    at: run.at,
    cell: cell.id,
    document: cell.document,
    classSetting: cell.classSetting,
    setup: cell.setup,
    engine,
    result: outcome.key,
    cached: outcome.cached,
    status,
    pages,
    errors: reading.errors.map(({ message, line }) => (line === undefined ? { message } : { message, line })),
    warnings: [...new Set(reading.warnings.map(shapeOf))],
    overfull: reading.overfull,
    underfull: reading.underfull,
    missing: reading.missing,
    ms: result.ms,
    ...(result.threw === undefined ? {} : { threw: result.threw }),
    ...(judgement === undefined || judgement.noVerdict !== undefined
      ? {}
      : {
          oracle: ORACLE_VERSION,
          // Each verdict ends with the document's failures (`judge`), written once under `problems`. A `:document`
          // failure before them is one only some branches carry (`oracle.ts`, a skipped end of file): it stays.
          // A denied branch's verdict names its denial (`LedgerVerdict.denied`).
          verdicts: judgement.verdicts.map(({ branch, pass, failures }) => {
            const denied = deniedOf?.(branch, cell.classSetting);
            return { branch, pass, failures: failures.slice(0, Math.max(0, failures.length - judgement.document.length)), ...(denied === undefined ? {} : { denied }) };
          }),
          problems: judgement.document,
        }),
  };
};

/** Appends one line per outcome to the ledger, with its judgement when there is one (each denied branch's verdict naming its denial, `deniedOf`), and says what the run did. */
export const recordRun = (
  store: Store,
  outcomes: readonly CellOutcome[],
  run: Run,
  engine: string,
  judgements: ReadonlyMap<CellId, Judgement> = new Map(),
  deniedOf?: DeniedOf,
): RunSummary => {
  const status = { ok: 0, errors: 0, 'no-output': 0, threw: 0 };
  const branches = { pass: 0, fail: 0 };
  for (const outcome of outcomes) {
    const line = ledgerLine(outcome, run, engine, judgements.get(outcome.cell.id), deniedOf);
    store.append('ledger', line);
    status[line.status] += 1;
    for (const verdict of line.verdicts ?? []) branches[verdict.pass ? 'pass' : 'fail'] += 1;
  }
  return {
    run: run.id,
    cells: outcomes.length,
    compiled: new Set(outcomes.filter((o) => !o.cached).map((o) => o.key)).size,
    cached: outcomes.filter((o) => o.cached).length,
    status,
    branches,
  };
};

const isLedgerLine = (line: Json): line is LedgerLine & Json =>
  typeof line === 'object' && line !== null && !Array.isArray(line) && typeof (line as { cell?: unknown }).cell === 'string';

/** Each cell's most recent line. */
export const latestByCell = (store: Store): Map<CellId, LedgerLine> => {
  const latest = new Map<CellId, LedgerLine>();
  for (const line of store.read('ledger')) if (isLedgerLine(line)) latest.set(line.cell, line);
  return latest;
};
