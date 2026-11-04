/**
 * The oracle (ARCHITECTURE.md 4.6): what "works" means for a branch in a cell.
 * A branch passes only when all four checks hold.
 *
 * 1. No TeX error in its lines.
 * 2. No damaging warning in its lines (`warnings.ts`).
 * 3. Every sentinel it placed shipped exactly once, inside the text block
 *    (below its bottom by up to the class's `\maxdepth` more, where a page's
 *    last box may reach) unless placed as `outside`, and then, on a settled
 *    build, not past the paper's left or right edge unless TikZ drew it
 *    (`sentinels.ts`).
 * 4. Each feature it declares passes its probe (`features.ts`).
 *
 * An error is tied to the branch whose lines hold the line TeX names, when TeX
 * shows that line's text (`showsLine`: a package's line number is not the
 * document's), else to the line its message names (`on input line N`, `after
 * line N`). One TeX raised in a file the document read in (the log's open
 * files, `TexError.file`: abstract.sty's own l.62) is the branches' whose
 * preamble lines load the package it came through, else the document's. A
 * preamble line is each branch's that put it there
 * (`Emitted.preamble`). Preamble entries stand on consecutive lines and LaTeX
 * looks past a line for an optional argument (`\usepackage{x}[date]`,
 * `\newtheorem{x}{X}[within]`), so there an error naming a package is the
 * line's that loads it, and one naming a command or environment is only an
 * entry's that mentions it. One shown with only a line's first command read is
 * that command's own (`\abstract`, run with no argument), unless the line
 * before is a load whose end-of-load code raised it, TeX took the command into
 * something begun before it, or it follows an error at the same place. An
 * "Emergency stop" with no line goes with the error before it. An error
 * inside fancyhdr's running head or foot is the document's: `\output` raised
 * it, and TeX's line is only where the page broke.
 * "Float(s) lost" names where a page was flushed, not the float: it goes to
 * the branches whose content did not ship. A page that overflowed past the
 * vertical tolerance goes to the branches whose sentinels shipped on the pages
 * it may have been made for (`BoxReport.pages`), those whose sentinel ran off
 * below the block first. When no sentinel shipped there, it goes to the branch
 * whose lines hold the last document line the log named since the page before
 * started to ship (`BoxReport.named`), skipping a branch whose sentinels
 * shipped elsewhere: a box too tall for the page, alone on it, holding no
 * sentinel (an image, a list in an unbreakable box). A report whose window
 * names no such line is the document's. An overfull hbox on a body line no
 * branch holds goes to the branch that ends just before it with a margin note
 * whose text closes its line: TeX read that line for the note's trailing
 * optional argument, so the note's paragraph began there (`noteBefore`).
 *
 * scrlayer-notecolumn does two things a log shows as the kernel's: it sets the
 * rerun flag itself when its `.slnc` file changed ("Label(s) may have
 * changed", worded only in its trace build), and it typesets its notes while
 * `\output` is active, so a note too wide for its column is an overfull hbox
 * that names no line. In a document that loads it, both are its loaders'
 * (`loadersOf`: the branches whose preamble lines load it), though a genuine
 * label change there is charged to them too. Any other overfull hbox reported
 * while `\output` is active is an output routine (longtable, `\twocolumn`,
 * multicol) packing a box again: the branches whose lines already reported an
 * overfull hbox of the same width, each of them when two match. When none did
 * and its display is a running head (book's headings page style sets chapter
 * and section titles upper-cased in a head line the text width wide), it is the
 * branch's whose unstarred \chapter (an even page's head) or \section (an odd
 * page's) set that mark (`markOwner`).
 *
 * What the log cannot tie to a branch (a package's code at `\begin{document}`,
 * a missing glyph, labels that changed with no scrlayer-notecolumn loaded, an
 * hbox during output that matches no branch's box and shows no branch's running
 * head, a page that overflowed with
 * no sentinel on it and no line of a branch that shipped none named since the
 * page before it) belongs to the document:
 * every branch carries it with a `:document` suffix, until the explainer
 * (step 6) typesets branches alone to separate them. So does a run that
 * failed as a whole: no
 * log (`no-log`: the engine gave up, TeX hung or looped), a fatal stop
 * (`fatal`), no page (`no-pages`), or a `.bbl` asked for and never made
 * (`no-bbl`: BibTeX failed and ended the build). After a fatal stop or with no
 * page, a sentinel that never shipped says nothing of its branch, so neither
 * it nor a feature is judged. The end of the file reached while TeX skipped a
 * conditional (`skipsFrom`) is the error's at the line skipping began: only the
 * branches before that line and before the last shipped sentinel are known to
 * have run, and every other branch carries the error as its own `:document`.
 *
 * Cross-references are judged only on a settled build. The engine builds to a
 * fixpoint as Download does (XeTeX 1 to 4 times, BibTeX or Biber between), but
 * a TeX error or a failing BibTeX run ends the build, nearly always after the
 * first run: no `.bbl` and no label from an earlier run, so its undefined
 * references and changed labels (`CROSS_PASS`) say nothing about any branch.
 * Nor does a sentinel placed `nextRun` that never shipped there: a note
 * column's text is typeset from the `.slnc` file an earlier run wrote. Nor
 * does an overfull hbox there whose display shows a citation printed as its
 * key (`unresolvedCite`), when what the citations add explains it: the box
 * would be within the tolerance with them resolved (`CITE_GROWTH_PT`). A box
 * wider than that is judged, since it overflows with its citations resolved.
 *
 * The order sentinels ship in is recorded but not judged. Floats and
 * footnotes move by design, so content after a float can rightly print before
 * it.
 */
import type { BranchId, CellId, Emitted, Failure, RawResult, SentinelSpec, Verdict } from './model.ts';
import { FEATURE_PROBES } from './features.ts';
import { readLog, showsLine, type TexError } from './log.ts';
import { inTextBlock, offPaperSideways, ptOf, readSentinels } from './sentinels.ts';
import { CROSS_PASS, damagingWarnings, type Damage } from './warnings.ts';

/**
 * Raised whenever what the oracle decides changes: every saved result is judged again, and nothing compiles. 5 (batch
 * 4): scrlayer-notecolumn's labels-changed and output-time boxes go to its loaders, other output-time boxes to the
 * branch that reported the same box (`sameBox`), `nextRun` sentinels and boxes its unresolved citations explain are
 * not judged on an unsettled build, and biblatex's wording of an undefined citation counts; with SO-1 (batch 5, before
 * any run used 5), a page that overflowed with no sentinel on it goes to the branch whose line the log named last
 * before it (`BoxReport.named`), not to the document. With CL1 (batch 6, still before any run used 5), an hbox overfull
 * during output that no branch's box matches and whose display is a running head goes to the branch whose \chapter or
 * \section set its mark (`markOwner`). 6 (b21, after GitHub run 41584963423 judged with 5): an error inside fancyhdr's
 * running head or foot goes to the document (`OUTPUT_HEAD`, AC5), not to the branch whose line the page broke on. With
 * b22, still before any run used 6: an error raised in a file the document read in goes to the branches loading the
 * package (`TexError.file`, `throughLoaders`; JR1 P2), an overfull hbox on the body line after a branch whose margin note
 * closes its last line goes to that branch (`noteBefore`; OV P1), and an `outside` sentinel past the paper's side fails
 * on a settled build unless TikZ drew it (`sentinel:off-paper`; MN6/P-d3). Re-judged in memory on run 41584963423's
 * stored results with the run's own LaTeX (b22 ORACLE): staging's oracle reproduces all 472,643 verdicts of the 11,057
 * cells these rules can touch; b22's turns 8,826 of them into passes (8,576 not denied: 6,070 from package files, 2,468
 * from margin-note lines, 38 both) and 4,455 into fails (4,454 not denied), each a margin note past the paper's side
 * but one denied branch that loads sidenotes under aa, now charged its own load error. 7 (b23, after GitHub run r2-461ed0e
 * judged with 6): a sentinel in the text may sit below the text block's bottom by the class's `\maxdepth`, which the
 * sentinel preamble logs as `COMPAT-GEOMETRY{maxDepth}` (`sentinels.ts`, TC1-DEPTH: TeX lets a page's last box reach that
 * far); and a footnote's text that starts on a later page than its mark passes when every page in between holds another
 * note split across it (`features.ts`, PG-2): TeX held it over (tex.web §1008).
 */
export const ORACLE_VERSION = 7;

/** What one branch of the document is expected to show: the sentinels its host placed, and the features its ways declare. */
export type Expected = {
  readonly branch: BranchId;
  readonly sentinels: readonly SentinelSpec[];
  readonly features: readonly string[];
};

export type JudgeOptions = {
  /** How far past the text block, sideways, a sentinel may sit (and an overfull hbox may reach) before it fails. */
  readonly horizontalTolerancePt?: number;
  /** How far above or below the text block a sentinel may sit (and how far too high a page may be made) before it fails. */
  readonly verticalTolerancePt?: number;
};

export type Judgement = {
  readonly cell: CellId;
  readonly verdicts: readonly Verdict[];
  /** What the log could not tie to one branch. */
  readonly document: readonly Failure[];
  /** The engine gave no result, so there is nothing to judge. */
  readonly noVerdict?: string;
};

const DEFAULTS = { horizontalTolerancePt: 10, verticalTolerancePt: 4 };

/**
 * How much wider the test samples' citations make a line when they print as their keys, on a build that stopped after
 * its first run (biblatex sets each key in bold in an \mbox, `[[]]` in the box's display): the header note's and the
 * caption's `$a_n\le a_{n+1}\le M$\cite\supercite\cite` is 75.6pt set with numbers and 283pt with keys, unbreakable. An
 * overfull hbox there at most this much plus the tolerance over would fit with its citations resolved, so it is the
 * missing .bbl's, as the references are. Measured on the copy's batch-3b article.A logs (oracle 4): 781 fit branches
 * failed on nothing but such boxes on unsettled builds, e.g. ddac9eb0ab723e907531d result 2cfb92f28f l.183, a caption,
 * 82.27pt; 256 of them carried one wider than this, which the same chunk also overflows by on settled builds
 * (dcf918d94336db5017f17 result d2cba02525, 259.6pt), and stay judged.
 */
const CITE_GROWTH_PT = 283 - 75.6;
const SP_PER_PT = 65536;

/** A line named in an error's message: where an environment began (`\begin{x} on input line 12 ended by \end{document}`), or a conditional (`Incomplete \iffalse; all text was ignored after line 12`). */
const NAMED_LINE = /(?:on input line|after line) (\d+)/;

/** LaTeX's word that floats never reached a page: whatever they held did not ship. */
const FLOATS_LOST = /^LaTeX Error: Float\(s\) lost\./;

/**
 * fancyhdr's head and foot parts, expanded only while `\output` builds a page: TeX names the line the page broke at, not the
 * error's owner (acmart's `\fancyhead[LO]{…\shorttitle}` in a document with no `\title`, batch 3b: 964 acmart-manuscript.A
 * branch failures at whatever line each odd page broke on). acmart's class setting has since removed that error; re-judged from
 * GitHub run 41584963423's store, the rule moves no verdict in acmart-manuscript.A, acmart-manuscript.B or acmart-sigconf.A
 * (27,406 branches, staging's oracle 5 reproducing the run's ledger), and no error message in the run's 48 pairs matches it.
 */
const OUTPUT_HEAD = /\\f@nch@[oe][lcr][hf]\b/;

/** Where a margin note's text argument opens: `\marginnote{`, or `\marginnote[left]{`. */
const NOTE_START = /\\marginnote(?:\[[^\]]*\])?\{/g;

/**
 * Whether `line` ends with a margin note TeX looks past for a trailing optional argument: marginnote.sty's
 * `\marginnote[left]{right}[offset]` reads its last argument with `\@ifnextchar[`, and paracol's emulation the same, so
 * when the note's text closes the line TeX reads the next line's first token before it sets the note, and the note's
 * paragraph is reported "at lines L--…" with L that next line (article.B d0e00c1c7382c4790e3d5, run 41584963423:
 * `\marginnote{…}` last at l.236, its words overfull "at lines 237--237", the host's `\nocite{*}`, the document's).
 */
const endsWithNote = (line: string): boolean =>
  [...line.matchAll(NOTE_START)].some((m) => {
    const from = (m.index ?? 0) + m[0].length;
    const close = from + argumentAt(line, from).length;
    return close < line.length && line.slice(close + 1).trim() === '';
  });

/** A float a branch's lines open: its loss is the branch's, though no sentinel (an image places none) shows it. */
const FLOAT = /\\begin\{(?:figure|table|sidewaysfigure|sidewaystable|SCfigure|SCtable|marginfigure|margintable)\*?\}/;

/** A preamble line that loads packages (`\usepackage[…]{a,b}`), with the packages it loads. */
const LOADS = /^\\(?:usepackage|RequirePackage)(?:\[[^\]]*\])?\{([^{}]*)\}\s*$/;

/** A package an error names ("Option clash for package parskip", "File `x.sty' not found"): the line loading it is to blame, whatever line TeX shows. */
const NAMED_PACKAGE = /Option clash for package ([^\s.]+)\.|File `([^']+)\.sty' not found/;

/** A command or environment an error names (`Command \c@corollary already defined`, `Environment theorem undefined`). */
const NAMED_NAME = /(?:Command|Environment) '?\\?(?:c@)?([A-Za-z@*]+)'? (?:already defined|undefined)/;

/** A preamble line that ends looking past itself for an optional argument: a load's or the class's `[date]` (`\usepackage{x}[2020/01/01]`). */
const LOOKS_PAST = /^\\(?:usepackage|RequirePackage|documentclass|LoadClass)(?:\[[^\]]*\])?\{[^{}]*\}\s*(?:%.*)?$/;

/** TeX took the command it shows into something begun before it: a `\csname` (`Missing \endcsname inserted`), or an environment's name (`Environment \definecolor undefined`). */
const SWALLOWED = /^Missing \\endcsname inserted|^LaTeX Error: Environment \\/;

/** A font switch in a box's display (`\TU/LatinModernRoman(0)/m/it/10`). */
const FONT_SWITCH = /\\[A-Za-z]+\/\S+/g;

/** A citation command with its arguments: it prints as its key in an `\mbox` (`[[]]`), so its words never show in a head. */
const CITATION_COMMAND = /\\[A-Za-z]*cite[A-Za-z]*\*?(?:\[[^\]]*\]){0,2}\{[^}]*\}/g;

/** The braced argument that opens at `from` in `line`, or the rest of the line when it closes on a later one. */
const argumentAt = (line: string, from: number): string => {
  let depth = 1;
  for (let i = from; i < line.length; i++) {
    const c = line[i];
    if (c === '\\') i++;
    else if (c === '{') depth++;
    else if (c === '}' && --depth === 0) return line.slice(from, i);
  }
  return line.slice(from);
};

/** The branches a line of the document belongs to: the one whose lines hold it, else each branch that put it in the preamble. */
const branchesAt = (emitted: Emitted, line: number): readonly BranchId[] => {
  const own = emitted.spans.find((s) => s.from <= line && line <= s.to)?.branch;
  if (own !== undefined) return [own];
  return [...new Set((emitted.preamble ?? []).filter((s) => s.from <= line && line <= s.to).map((s) => s.branch))];
};

/** The branches that put a load of `pkg` in the preamble: each `Emitted.preamble` entry holding a `LOADS` line naming it. */
const loadersOf = (emitted: Emitted, source: readonly string[], pkg: string): readonly BranchId[] => [
  ...new Set(
    (emitted.preamble ?? [])
      .filter((s) => source.slice(s.from - 1, s.to).some((l) => (LOADS.exec(l)?.[1] ?? '').split(',').some((p) => p.trim() === pkg)))
      .map((s) => s.branch),
  ),
];

/** Whether a LaTeX line mentions `name` as a name: `{name}` (`\newtheorem{name}`) or `\name` not run on into a longer command (`\theoremstyle` is not `\theorem`). */
const mentions = (line: string, name: string): boolean => {
  const escaped = name.replace(/[*@]/g, (c) => `\\${c}`);
  return new RegExp(`\\{${escaped}\\}|\\\\${escaped}(?![A-Za-z@])`).test(line);
};

/**
 * The branches an error TeX stopped at `line` with belongs to. A body line is
 * its branch's. Preamble entries stand on consecutive lines, so there: an error
 * naming a package is the branches' that load it (the last line loading it, at
 * or above). When TeX shows the line read only up to its first command, that
 * command has taken no argument yet. The error is then its own, one that takes
 * none (`\abstract`, the abstract environment's start: "Too deeply nested"),
 * unless the line before read it looking past its end for an optional argument
 * and raised the error after: a load (`\usepackage{x}` looks for a `[date]`,
 * then the package's end-of-load code runs), or a definition
 * (`\newtheorem{x}{X}` for [within]), whose error names what it defines
 * ("Command \lemma already defined"): one naming a command or environment is
 * only an entry's that mentions the name, the line before's first. The line
 * before's too: the command taken into something begun before it
 * (`SWALLOWED`), though the message names it. An error at the same place as
 * the one before it (`previous`: TeX read nothing more, as when the
 * definition LaTeX ignored typesets, "Missing \begin{document}") goes where
 * that one went. "Undefined control sequence" with nothing after it names the
 * command shown (`\floatsetup` with floatrow not loaded): its own line's.
 */
const errorBranchesAt = (
  emitted: Emitted,
  source: readonly string[],
  error: TexError,
  line: number,
  previous?: { readonly error: TexError; readonly branches: readonly BranchId[] },
): readonly BranchId[] => {
  const body = emitted.spans.find((s) => s.from <= line && line <= s.to)?.branch;
  if (body !== undefined) return [body];
  const owners = (at: number, name?: string): readonly BranchId[] => [
    ...new Set(
      (emitted.preamble ?? [])
        .filter((s) => s.from <= at && at <= s.to && (name === undefined || source.slice(s.from - 1, s.to).some((l) => mentions(l, name))))
        .map((s) => s.branch),
    ),
  ];
  const pkg = NAMED_PACKAGE.exec(error.message);
  if (pkg !== null) {
    const name = pkg[1] ?? pkg[2] ?? '';
    for (let at = line; at >= 1; at--) {
      const load = LOADS.exec(source[at - 1] ?? '');
      if (load !== null && (load[1] ?? '').split(',').some((p) => p.trim() === name)) return owners(at);
    }
    return [];
  }
  const name = NAMED_NAME.exec(error.message)?.[1];
  // A comment line gives TeX nothing to read: the line before is the one above it.
  let before = line - 1;
  while (before > 1 && /^\s*%/.test(source[before - 1] ?? '')) before--;
  // "Loading a class or package in a group" is the shown line's own \usepackage, not a lookahead.
  const read = (error.shown?.[0] ?? '').trim();
  const firstOnly = /^\\[A-Za-z@]+$/.test(read) && before >= 1 && !/in a group/.test(error.message) && error.message !== 'Undefined control sequence.';
  if (!firstOnly) return owners(line, name);
  // `Environment \declaretheorem undefined` names the command shown, yet it is the one taken in (`SWALLOWED`).
  if (name !== undefined && !SWALLOWED.test(error.message)) {
    const named = owners(before, name);
    // A name the line before does not mention may still be the shown line's own (a command with no argument).
    return named.length > 0 ? named : owners(line, name);
  }
  // An undefined command inside a macro's code just after a load is the package's end-of-load code.
  const loaded = LOOKS_PAST.test(source[before - 1] ?? '');
  if (/^Undefined control sequence/.test(error.message)) return owners(loaded ? before : line);
  if (loaded || SWALLOWED.test(error.message)) return owners(before);
  const again = previous !== undefined && previous.error.line === line && previous.error.shown?.join('\n') === error.shown?.join('\n');
  return again ? previous.branches : owners(line);
};

export const judge = (input: {
  readonly cell: CellId;
  readonly emitted: Emitted;
  readonly result: RawResult;
  readonly expected: readonly Expected[];
  readonly options?: JudgeOptions;
}): Judgement => {
  const { cell, emitted, result, expected } = input;
  if (result.threw !== undefined) return { cell, verdicts: [], document: [], noVerdict: result.threw };
  // No log at all: Flouest's runner gave up on the build (ZeroTeX's watchdog, about 120 s), as on a TeX loop. No line
  // ties it to a branch and no sentinel says anything: one failure of the whole document, for the explainer to halve.
  if (result.log.trim() === '') {
    const noLog: Failure = { check: 'no-log', evidence: `the engine gave up after ${Math.round(result.ms / 1000)} s with no log: TeX hung, looped, or never ran` };
    const failures = [{ check: `${noLog.check}:document`, evidence: noLog.evidence }];
    return { cell, verdicts: expected.map((e): Verdict => ({ branch: e.branch, cell, pass: false, failures })), document: [noLog] };
  }
  const options = { ...DEFAULTS, ...input.options };
  const reading = readLog(result.log, emitted.latex);
  const { hits, geometry } = readSentinels(result.log);
  const source = emitted.latex.split('\n');

  const own = new Map<BranchId, Failure[]>(expected.map((e) => [e.branch, []]));
  const shared: Failure[] = [];
  /** Charges `failure` to each of `branches` this cell judges, or to the document when none is; returns the branches charged. */
  const fail = (branches: readonly BranchId[], failure: Failure): readonly BranchId[] => {
    const charged = branches.filter((b) => own.has(b));
    if (charged.length === 0) shared.push(failure);
    for (const b of charged) own.get(b)?.push(failure);
    return charged;
  };
  const at = (line: number | undefined): readonly BranchId[] => (line === undefined ? [] : branchesAt(emitted, line));
  /**
   * An error TeX raised in a file the document read in (`TexError.file`, from the log's open files): its `l.<n>` is that
   * file's line, not the document's. It is the branches' whose preamble line loads the package the document read it
   * through (`\usepackage{abstract}` for abstract.sty's "Extra \else" at its own l.62), as an option clash is; with none
   * (a class's or the setting's package, the .aux, the .bbl), the document's. Re-judged on run 41584963423's stored
   * results (b22 ORACLE): 27 such errors had been charged to the branch holding the document's line of that number
   * (abstract.sty under mnras.A 9, sidenotes.sty under aa.A 18), and the rest were the document's; both now go to the
   * loaders, which frees the branches that only carried them.
   */
  const throughLoaders = (through: string | undefined): readonly BranchId[] =>
    through !== undefined && through.endsWith('.sty') ? loadersOf(emitted, source, through.slice(0, -'.sty'.length)) : [];
  /**
   * The branch whose lines end just before `line`, a body line no branch holds, with a margin note that TeX looked past
   * its line for a trailing optional argument (`endsWithNote`): the note's paragraph began on `line`, so a box TeX
   * reports there is the note's. In run 41584963423's stored results, 839 of the 841 overfull hboxes reported on a body
   * line no branch holds (the host's `\nocite{*}`, `\begin{thebibliography}` and guard lines, F3's "reference-list"
   * boxes) follow a branch that ends so; re-judged, 2,468 not-denied branches that carried only them pass (38 more with
   * a package file's error, `throughLoaders`), none fails.
   */
  const noteBefore = (line: number): readonly BranchId[] => {
    if (emitted.spans.some((s) => s.from <= line && line <= s.to)) return [];
    const span = emitted.spans.find((s) => s.to === line - 1);
    if (span === undefined) return [];
    let last = span.to;
    while (last > span.from && (source[last - 1] ?? '').trim() === '') last--;
    return endsWithNote(source[last - 1] ?? '') ? [span.branch] : [];
  };

  // 1. Errors. TeX's `l.<n>` is the document's line only when the text TeX shows is that line's (`errorBranchesAt` then
  // says whose, from the error before it too); else the line the message names; an "Emergency stop" with no line goes
  // with the error before it. "Float(s) lost" names where the page was flushed (`\end{document}`, or a `\clearpage`,
  // `\twocolumn` or `\appendix` in some branch), not the float: it waits for the sentinels (3).
  const lost: Failure[] = [];
  let before: { readonly error: TexError; readonly branches: readonly BranchId[] } | undefined;
  let skip: { readonly from: number; readonly owners: readonly BranchId[]; readonly evidence: string } | undefined;
  for (const error of reading.errors) {
    const failure = { check: 'error', evidence: error.line === undefined ? error.message : `${error.message} (l.${error.line})` };
    if (FLOATS_LOST.test(error.message)) {
      lost.push(failure);
      before = undefined;
      continue;
    }
    if (OUTPUT_HEAD.test(error.message)) {
      before = { error, branches: fail([], failure) };
      continue;
    }
    const named = NAMED_LINE.exec(error.message);
    let branches: readonly BranchId[] =
      error.file !== undefined
        ? throughLoaders(error.through)
        : error.line !== undefined && showsLine(error.shown, source[error.line - 1])
          ? errorBranchesAt(emitted, source, error, error.line, before)
          : [];
    // A line a message names ("on input line N") is the line of the file TeX was reading: only the document's is a branch's.
    if (branches.length === 0 && named !== null && error.file === undefined) branches = at(Number(named[1]));
    if (branches.length === 0 && error.line === undefined && error.message.startsWith('Emergency stop')) branches = before?.branches ?? [];
    before = { error, branches: fail(branches, failure) };
    // With no branch to own it, the skip's error is already the document's; what came after it still never ran.
    if (error.skipsFrom !== undefined) skip = { from: error.skipsFrom, owners: before.branches, evidence: failure.evidence };
  }

  // How far the run got. A fatal stop or no page: no branch is known to have reached a page that shipped. The end of
  // the file reached while skipping: TeX dropped the page it was making there, so only the branches that end before
  // the line and before the end of the last branch a sentinel shipped from ran; each other carries the skip's error.
  const stopped = reading.fatal || reading.pages === 0;
  if (reading.fatal) shared.push({ check: 'fatal', evidence: 'TeX stopped at a fatal error; nothing after it ran' });
  else if (reading.pages === 0) shared.push({ check: 'no-pages', evidence: 'TeX shipped no page ("No pages of output."): nothing in the document printed' });
  let ran: (branch: BranchId) => boolean = () => !stopped;
  if (skip !== undefined) {
    const { from, owners, evidence } = skip;
    const shipped = new Set(expected.filter((e) => e.sentinels.some((s) => hits.has(s.id))).map((e) => e.branch));
    const shippedTo = Math.max(0, ...emitted.spans.filter((s) => shipped.has(s.branch)).map((s) => s.to));
    const reached = new Set(emitted.spans.filter((s) => s.to < from && s.to <= shippedTo).map((s) => s.branch));
    if (owners.length > 0) for (const e of expected) if (!owners.includes(e.branch) && !reached.has(e.branch)) own.get(e.branch)?.push({ check: 'error:document', evidence });
    ran = (branch) => !stopped && reached.has(branch);
  }

  // 2. Damaging warnings. A build that stopped early never reran, so its cross-references are not judged; one BibTeX
  // stopped shows no TeX error, so it is charged for itself. A page that overflowed names no line, only its pages, and
  // the lines the log named just before it (for a page no sentinel shipped on).
  if (reading.errors.length === 0 && !reading.fatal && reading.noBbl) {
    shared.push({ check: 'no-bbl', evidence: 'the run asked for a .bbl that no BibTeX run made ("No file ….bbl."): BibTeX failed and ended the build after it, every citation undefined' });
  }
  const settled = reading.errors.length === 0 && !reading.fatal && !reading.noBbl;
  const bottom = geometry === undefined ? undefined : geometry.textTop - geometry.textHeight - options.verticalTolerancePt * SP_PER_PT;
  /**
   * The branches a page that overflowed is charged to: those with a sentinel shipped on one of its pages below the
   * text block, whose content ran off; when none is, each with a sentinel shipped on one of them. When no sentinel
   * shipped on them at all, the box that overflowed holds none (an image, or a list in an unbreakable box, alone on a
   * page it is taller than): it goes to the branch whose lines hold the last document line the log named since the page
   * before started to ship (`named`, `BoxReport.named`), skipping a branch whose sentinels shipped elsewhere, which a box
   * of its own would have carried onto that page. A report whose window names no such line stays the document's.
   */
  const onPages = (pages: readonly number[], named: readonly number[] = []): readonly BranchId[] => {
    const shippedOn = (e: Expected, ranOff: boolean): boolean =>
      e.sentinels.some((s) =>
        (hits.get(s.id) ?? []).some((hit) => pages.includes(hit.page) && (!ranOff || (!s.outside && bottom !== undefined && hit.y !== null && hit.y < bottom))),
      );
    const ranOff = expected.filter((e) => shippedOn(e, true));
    if (ranOff.length > 0) return ranOff.map((e) => e.branch);
    const on = expected.filter((e) => shippedOn(e, false));
    if (on.length > 0) return on.map((e) => e.branch);
    const shippedAny = new Set(expected.filter((e) => e.sentinels.some((s) => (hits.get(s.id) ?? []).length > 0)).map((e) => e.branch));
    for (const line of [...named].reverse()) {
      const branch = emitted.spans.find((s) => s.from <= line && line <= s.to)?.branch;
      if (branch !== undefined && !shippedAny.has(branch)) return [branch];
    }
    return [];
  };
  // scrlayer-notecolumn does two things a log shows as the kernel's. It sets the rerun flag itself when its .slnc file
  // changed (an MD5 check worded only in its trace build), and it typesets its notes while \output is active, so a note too
  // wide for its column is an hbox with no line. Both go to its loaders (article.A: 94 of 94 labels-changed documents, 76 of
  // 76 such 15.52pt boxes). Any other hbox with no line is an output routine packing a branch's box again: that branch's; one
  // that matches no branch's box and shows a running head, the heading's (`markOwner`).
  // Read only when such a warning comes: the host finds a document's preamble owners by compiling each branch alone.
  let loaders: readonly BranchId[] | undefined;
  const notecolumn = (): readonly BranchId[] =>
    (loaders ??= emitted.latex.includes('scrlayer-notecolumn') ? loadersOf(emitted, source, 'scrlayer-notecolumn') : []);
  const sameBox = (amount: number | undefined): readonly BranchId[] => [
    ...new Set(reading.boxes.filter((b) => b.kind === 'overfull' && b.box === 'h' && b.lines !== undefined && b.amount === amount).flatMap((b) => at(b.lines?.[0]))),
  ];
  /** On a build that never settled, an overfull hbox its unresolved citations' growth explains (`CITE_GROWTH_PT`). */
  const citesOnly = (damage: Damage): boolean =>
    damage.unresolvedCite === true && (damage.amount ?? Infinity) <= CITE_GROWTH_PT + options.horizontalTolerancePt;
  /**
   * An hbox overfull while \output is active that no branch's box matches, whose display is a running head. book's headings page
   * style sets \MakeUppercase'd titles in a head line the text width wide (classes.dtx l.1640-1641, l.1688), so a chapter or
   * section title holding Flouest's paragraph sample overflows on every page that shows it (book.A d8d8de18ba93c2f2ad0c0 result
   * 4bbb2f9155 l.937, 708.4pt). An even page's head starts with its page number and shows the chapter's mark; an odd page's ends
   * with it and shows the section's. It is the branch whose unstarred \chapter or \section (its short title when given) shows
   * enough of its words there, walking back from the last line the log named before the report. A citation prints as its key
   * in a box (`[[]]`), so its words are not looked for. None found: the document's, as before.
   */
  const markOwner = (damage: Damage): readonly BranchId[] => {
    if (damage.display === undefined || damage.lastNamed === undefined) return [];
    const shown = damage.display.replace(FONT_SWITCH, ' ').replace(/\s+/g, ' ').trim();
    const level = /^\d+ /.test(shown) ? 'chapter' : / \d+(?: \[\])*$/.test(shown) ? 'section' : undefined;
    if (level === undefined) return [];
    const words = new Set(shown.match(/[A-Z]{4,}/g) ?? []);
    const heading = new RegExp(`\\\\${level}(?![*A-Za-z])\\s*(?:\\[([^\\]]*)\\])?\\{`);
    for (let n = Math.min(damage.lastNamed, source.length); n >= 1; n--) {
      const line = source[n - 1] ?? '';
      const m = heading.exec(line);
      if (m === null) continue;
      const title = m[1] ?? argumentAt(line, m.index + m[0].length);
      const own = title.replace(CITATION_COMMAND, ' ').replace(/\\[A-Za-z@]+\*?/g, ' ').toUpperCase().match(/[A-Z]{4,}/g) ?? [];
      if (own.length > 0 && own.filter((w) => words.has(w)).length >= Math.min(3, own.length)) return at(n);
    }
    return [];
  };
  for (const damage of damagingWarnings(reading, { hboxTolerancePt: options.horizontalTolerancePt, vboxTolerancePt: options.verticalTolerancePt })) {
    if (!settled && (CROSS_PASS.has(damage.name) || citesOnly(damage))) continue;
    const failure = { check: `warning:${damage.name}`, evidence: damage.text };
    if (damage.name === 'labels-changed' && notecolumn().length > 0) {
      fail(notecolumn(), failure);
      continue;
    }
    if (damage.name === 'overfull-hbox' && damage.line === undefined && damage.output === true) {
      const packed = notecolumn().length > 0 ? notecolumn() : sameBox(damage.amount);
      fail(packed.length > 0 ? packed : markOwner(damage), failure);
      continue;
    }
    const owners = damage.line === undefined && damage.pages !== undefined ? onPages(damage.pages, damage.named) : at(damage.line);
    fail(owners.length === 0 && damage.name === 'overfull-hbox' && damage.line !== undefined ? noteBefore(damage.line) : owners, failure);
  }

  // 3. Sentinels.
  const placedAny = expected.some((e) => e.sentinels.length > 0);
  if (placedAny && geometry === undefined) {
    shared.push({ check: 'sentinel:preamble', evidence: 'no text block in the log: the sentinel preamble is missing or never ran' });
  }
  const h = options.horizontalTolerancePt * SP_PER_PT;
  const v = options.verticalTolerancePt * SP_PER_PT;
  const unshipped = new Set<BranchId>();
  for (const e of expected) {
    for (const spec of e.sentinels) {
      const found = hits.get(spec.id) ?? [];
      const first = found[0];
      if (first === undefined) {
        // Lost content, when TeX went on past the branch; after a stop it says nothing of the branch. A note column's text
        // (`nextRun`) is typeset from the .slnc file an earlier run wrote, so a build a TeX error ended after its first run
        // never ships it: not judged there.
        if (!ran(e.branch) || (spec.nextRun === true && !settled)) continue;
        unshipped.add(e.branch);
        fail([e.branch], { check: 'sentinel:missing', evidence: `${spec.id} never shipped: its content was lost` });
      } else if (found.length > 1) {
        fail([e.branch], { check: 'sentinel:duplicated', evidence: `${spec.id} shipped ${found.length} times (pages ${found.map((f) => f.page).join(', ')})` });
      } else if (!spec.outside && geometry !== undefined && !inTextBlock(first, geometry, h, v)) {
        fail([e.branch], {
          check: 'sentinel:outside',
          evidence: `${spec.id} shipped outside the text block, at x ${ptOf(first.x ?? 0)}, y ${ptOf(first.y ?? 0)} on page ${first.page}`,
        });
      } else if (spec.outside === true && spec.drawn !== true && settled && geometry !== undefined && offPaperSideways(first, geometry, h)) {
        // A margin note's text past the paper's left or right edge: cut off where it printed (MN6). Only on a settled build:
        // marginnote places a note from the position an earlier run wrote to the .aux (its side, and its offset from a list's
        // or a column's indent, marginnote.sty l.213-317 and l.368-386), so after one run it can stand where the document's
        // note would not. Not for a note TikZ draws (`drawn`): XeTeX's driver moves a node's text where it prints
        // (pgfsys-dvipdfmx.def, `\pgfsys@hboxsynced`: pdf:btrans), so its position as TeX records it is not where it printed.
        // Re-judged on run 41584963423's stored results: 4,454 not-denied passes fail on this alone (without the two
        // conditions 6,058: 3,751 of the moves on builds an error ended, 781 todonotes notes).
        fail([e.branch], {
          check: 'sentinel:off-paper',
          evidence: `${spec.id} shipped past the paper's edge, at x ${ptOf(first.x ?? 0)} on page ${first.page} (the paper is ${ptOf(geometry.paperWidth)} wide)`,
        });
      }
    }
  }

  // A float lost shipped nothing it held: it is the branches' whose content did not ship (a sentinel missing), or whose
  // float no sentinel watches. With none, the document carries it.
  if (lost.length > 0) {
    const holdsFloat = (branch: BranchId): boolean =>
      emitted.spans.some((s) => s.branch === branch && source.slice(s.from - 1, s.to).some((l) => FLOAT.test(l)));
    const losers = expected
      .filter((e) => ran(e.branch) && (unshipped.has(e.branch) || (e.sentinels.length === 0 && holdsFloat(e.branch))))
      .map((e) => e.branch);
    for (const failure of lost) fail(losers, failure);
  }

  // 4. Features, read from the sentinels a branch shipped, so not for one TeX did not run past. A probe also sees every
  // branch's sentinels (`cell`): the footnote probe reads the notes split across a page, after which TeX holds the page's
  // later notes over to the next one.
  const sentinelsOfCell = expected.map((e) => e.sentinels);
  for (const e of expected) {
    if (!ran(e.branch)) continue;
    for (const name of e.features) {
      const probe = FEATURE_PROBES[name];
      const evidence = probe === undefined ? 'no probe for this feature' : probe({ placed: e.sentinels, hits, cell: sentinelsOfCell });
      if (evidence !== undefined) fail([e.branch], { check: `feature:${name}`, evidence });
    }
  }

  // Each verdict ends with the document's failures; the ledger writes those once (`ledger.ts`).
  const documentWide = shared.map((f) => ({ check: `${f.check}:document`, evidence: f.evidence }));
  const verdicts = expected.map((e): Verdict => {
    const failures = [...(own.get(e.branch) ?? []), ...documentWide];
    return { branch: e.branch, cell, pass: failures.length === 0, failures };
  });
  return { cell, verdicts, document: shared };
};
