/**
 * The warnings that count as failure (ARCHITECTURE.md 4.6, the oracle's second
 * check). Every other warning is recorded in the ledger but fails nothing: a
 * substituted font shape, a slightly loose line.
 *
 * Each finding carries the source line the log names, when it names one, so
 * the oracle can tie it to a branch. A page that overflowed names no line; it
 * carries the pages it may have been made for (`BoxReport.pages`) and the
 * document lines the log named just before it (`BoxReport.named`), for when
 * no sentinel shipped on those pages, and fails only past the vertical
 * tolerance (content that little below the block is what the sentinel check
 * allows too). An overfull hbox reported while
 * `\output` was active names no line either: it carries its width and that
 * flag, so the oracle can find whose box it was (`oracle.ts`). Every overfull
 * hbox carries its width over, and whether its display shows a citation
 * printed as its key (`BoxReport.unresolvedCite`): on a build that never
 * settled, the oracle does not judge one that the citations' own growth
 * explains. An undefined reference or citation counts in the kernel's wording
 * and in biblatex's, which quotes the key with straight quotes.
 */
import type { LogReading } from './log.ts';

/**
 * `pages`: for a page that overflowed (it names no line), the pages it may have been made for. `named`: for such a page,
 * the document lines the log named since the page before it started to ship (`BoxReport.named`). `amount`: for an
 * overfull hbox, its width over. `output`: for an overfull hbox with no line, whether `\output` was active (it then names
 * no line). `unresolvedCite`: an overfull hbox whose display shows a citation printed as its key. `display`, `lastNamed`:
 * for such an hbox, its display and the last document line the log named before it (`BoxReport`), so the oracle can tell a
 * running head's heading.
 */
export type Damage = {
  readonly name: string;
  readonly text: string;
  readonly line?: number;
  readonly pages?: readonly number[];
  readonly named?: readonly number[];
  readonly amount?: number;
  readonly output?: boolean;
  readonly unresolvedCite?: boolean;
  readonly display?: string;
  readonly lastNamed?: number;
};

export type DamageOptions = {
  /** An overfull hbox fails when it is more than this many pt too wide. */
  readonly hboxTolerancePt: number;
  /** A page overflows (an overfull vbox while `\output` is active) when it is more than this many pt too high. */
  readonly vboxTolerancePt: number;
};

/** Warnings that fail on their own wording. */
const WORDED: readonly { readonly name: string; readonly test: RegExp }[] = [
  // biblatex quotes the key with straight quotes ("Citation 'key' on page 3 undefined"), the kernel with ` and '.
  { name: 'undefined-reference', test: /^LaTeX Warning: (Reference|Citation) [`'][^']*' on page \d+ undefined/ },
  { name: 'labels-changed', test: /^LaTeX Warning: Label\(s\) may have changed/ },
  { name: 'float-too-large', test: /^LaTeX Warning: Float too large for page/ },
];

/**
 * The warnings only a settled build can judge. The engine builds to a fixpoint
 * as Download does, but a run with a TeX error, or a failing BibTeX run, ends
 * the build: that log is the last run's (nearly always the first), made with
 * no `.bbl` and no label from an earlier run, so every reference is undefined
 * and labels always "may have changed" (oracle.ts skips these there).
 */
export const CROSS_PASS: ReadonlySet<string> = new Set(['undefined-reference', 'labels-changed']);

const inputLine = (text: string): number | undefined => {
  const m = /on input line (\d+)/.exec(text);
  return m ? Number(m[1]) : undefined;
};

export const damagingWarnings = (reading: LogReading, { hboxTolerancePt, vboxTolerancePt }: DamageOptions): Damage[] => {
  const found: Damage[] = [];
  for (const text of reading.warnings) {
    const rule = WORDED.find((r) => r.test.test(text));
    if (rule === undefined) continue;
    const line = inputLine(text);
    found.push(line === undefined ? { name: rule.name, text } : { name: rule.name, text, line });
  }
  for (const box of reading.boxes) {
    if (box.kind !== 'overfull') continue;
    const where = box.lines ? ` at lines ${box.lines[0]}--${box.lines[1]}` : '';
    if (box.box === 'v' && box.output) {
      if (box.amount <= vboxTolerancePt) continue;
      const pages = box.pages ?? [];
      const made = pages.length === 0 ? 'a page was' : pages.length === 1 ? `page ${pages[0]} was` : `one of pages ${pages.join(', ')} was`;
      const text = `Overfull \\vbox (${box.amount}pt too high) while ${made} made: content ran off the page`;
      const named = box.named?.length ? { named: box.named } : {};
      found.push(pages.length === 0 ? { name: 'page-overflow', text, ...named } : { name: 'page-overflow', text, pages, ...named });
    } else if (box.box === 'h' && box.amount > hboxTolerancePt) {
      const text = `Overfull \\hbox (${box.amount}pt too wide)${where}`;
      const cite = box.unresolvedCite === true ? { unresolvedCite: true } : {};
      found.push(
        box.lines
          ? { name: 'overfull-hbox', text, line: box.lines[0], amount: box.amount, ...cite }
          : { name: 'overfull-hbox', text, amount: box.amount, output: box.output, ...cite, ...(box.display === undefined ? {} : { display: box.display }), ...(box.lastNamed === undefined ? {} : { lastNamed: box.lastNamed }) },
      );
    }
  }
  for (const missing of reading.missing) found.push({ name: 'missing-character', text: `Missing character: ${missing}` });
  return found;
};
