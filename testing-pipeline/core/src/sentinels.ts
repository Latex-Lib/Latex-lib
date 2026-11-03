/**
 * Shipout sentinels (ARCHITECTURE.md section 5, judge).
 *
 * A sentinel is a non-immediate `\write` to the log, with `\pdfsavepos` just
 * before it. TeX carries out a non-immediate write only when the box holding
 * it is shipped to a page. So the log gets one line per sentinel, giving its
 * id, its page and its position, for content that really printed, and none
 * for content that was lost: a footnote in a `tabular`, a box built and never
 * used. Content typeset twice (a saved box used twice) writes twice.
 *
 * What the host says of a sentinel when it places one is recorded with it
 * (`recordingProbes`, `SentinelSpec`): `outside` for a margin note's, whose
 * position against the text block is not checked, only that it is on the
 * paper sideways (`offPaperSideways`); `drawn` for one in a TikZ node
 * (todonotes' note), whose position as TeX records it is not where XeTeX's
 * driver prints it; `nextRun` for one typeset from an auxiliary file an
 * earlier run wrote (a note column's `.slnc`), whose absence the oracle judges
 * only on a settled build; and the `role` a feature probe reads.
 *
 * `\write-1` goes to the log only. The page is `\c@page` as the page ships.
 * The position is in sp from the page's lower-left corner, recorded by
 * `\pdfsavepos`, which XeTeX provides. The text block is written once, at the
 * end of `\begin{document}` (after every package has set the page), one
 * dimension per line so that no line reaches the log's width.
 *
 * XeTeX measures that corner against `\pdfpageheight`. LaTeX tells XeTeX's
 * driver the paper size by a special and leaves `\pdfpageheight` at 0, and at
 * 0 XeTeX takes the page to be the shipped box plus 2in. On ZeroTeX's
 * `article` that is 777.54pt, not the paper's 794.97pt, which puts every y
 * 17.4pt too low. So at the end of `\begin{document}`, a `\pdfpageheight` (and
 * `\pdfpagewidth`) nobody set is set to the paper's, as `geometry` does under
 * XeTeX. The paper size the PDF gets stays the same.
 */
import type { SentinelSpec } from './model.ts';
import type { BuildProbes } from './ports.ts';
import { LOG_WIDTH } from './log.ts';

const SENTINEL = 'COMPAT-SENTINEL';
const GEOMETRY = 'COMPAT-GEOMETRY';

/** The dimensions written at `\begin{document}`, by name, each as LaTeX computes it. */
const DIMENSIONS: readonly (readonly [string, string])[] = [
  ['paperWidth', '\\paperwidth'],
  ['paperHeight', '\\paperheight'],
  ['oddLeft', '\\dimexpr1in+\\hoffset+\\oddsidemargin\\relax'],
  ['evenLeft', '\\dimexpr1in+\\hoffset+\\evensidemargin\\relax'],
  ['textWidth', '\\textwidth'],
  ['textTop', '\\dimexpr\\paperheight-1in-\\voffset-\\topmargin-\\headheight-\\headsep\\relax'],
  ['textHeight', '\\textheight'],
];

/** What the host puts in every preamble, right after the class (`EmitUnder.preamble`). */
export const SENTINEL_PREAMBLE: readonly string[] = [
  '\\makeatletter',
  `\\protected\\def\\compatSentinel#1{\\ifdefined\\pdfsavepos\\pdfsavepos\\fi\\write-1{${SENTINEL}{#1}{\\the\\c@page}{\\ifdefined\\pdflastxpos\\the\\pdflastxpos\\fi}{\\ifdefined\\pdflastypos\\the\\pdflastypos\\fi}}}`,
  `\\AddToHook{begindocument/end}{${[
    '\\ifdefined\\pdfpageheight\\ifdim\\pdfpageheight=0pt \\global\\pdfpageheight=\\paperheight\\fi\\fi',
    '\\ifdefined\\pdfpagewidth\\ifdim\\pdfpagewidth=0pt \\global\\pdfpagewidth=\\paperwidth\\fi\\fi',
    ...DIMENSIONS.map(([name, value]) => `\\immediate\\write-1{${GEOMETRY}{${name}}{\\the${value}}}`),
  ].join('')}}`,
  '\\makeatother',
];

const ID = /^[A-Za-z0-9][A-Za-z0-9.:_-]*$/;

/** A sentinel's LaTeX. Ids are letters, digits and `. : _ -`, so they pass through TeX unchanged. */
export const sentinelCall = (id: string): string => {
  if (!ID.test(id)) throw new Error(`sentinel id ${JSON.stringify(id)}: letters, digits and ". : _ -" only`);
  return `\\compatSentinel{${id}}`;
};

/** Probes that record each sentinel the host places, so the oracle knows what to expect of the branch. */
export const recordingProbes = (marked: boolean): { readonly probes: BuildProbes; readonly placed: readonly SentinelSpec[] } => {
  const placed: SentinelSpec[] = [];
  const probes: BuildProbes = {
    marked,
    sentinel: (id, options = {}) => {
      const call = sentinelCall(id);
      placed.push({ id, ...options });
      return call;
    },
  };
  return { probes, placed };
};

/** Where a sentinel shipped: its page, and its position in sp from the page's lower-left corner (null when the engine has no `\pdfsavepos`). */
export type SentinelHit = { readonly page: number; readonly x: number | null; readonly y: number | null };

/** The text block in sp. `textTop` is measured from the page's bottom edge, as positions are. */
export type Geometry = {
  readonly paperWidth: number;
  readonly paperHeight: number;
  readonly oddLeft: number;
  readonly evenLeft: number;
  readonly textWidth: number;
  readonly textTop: number;
  readonly textHeight: number;
};

const SP_PER_PT = 65536;
const sp = (dimension: string): number => Math.round(Number.parseFloat(dimension) * SP_PER_PT);

/** Each line of the log, with any line cut at the log's width joined to the one it carries on in. */
const logLines = function* (log: string): Generator<string> {
  const raw = log.split('\n');
  for (let i = 0; i < raw.length; i++) {
    let line = raw[i] ?? '';
    while ((raw[i] ?? '').length === LOG_WIDTH && i + 1 < raw.length) line += raw[++i] ?? '';
    yield line;
  }
};

/** Every sentinel the log records, by id (in the order they shipped), and the text block, when the preamble wrote it. */
export const readSentinels = (log: string): { readonly hits: ReadonlyMap<string, readonly SentinelHit[]>; readonly geometry?: Geometry } => {
  const hits = new Map<string, SentinelHit[]>();
  const dimensions = new Map<string, number>();
  for (const line of logLines(log)) {
    const hit = new RegExp(`^${SENTINEL}\\{([^}]*)\\}\\{(\\d+)\\}\\{(-?\\d*)\\}\\{(-?\\d*)\\}`).exec(line);
    if (hit) {
      const [, id = '', page, x, y] = hit;
      const list = hits.get(id) ?? [];
      list.push({ page: Number(page), x: x ? Number(x) : null, y: y ? Number(y) : null });
      hits.set(id, list);
      continue;
    }
    const dimension = new RegExp(`^${GEOMETRY}\\{(\\w+)\\}\\{(-?[\\d.]+)pt\\}`).exec(line);
    if (dimension) dimensions.set(dimension[1] ?? '', sp(dimension[2] ?? '0'));
  }
  const all = DIMENSIONS.every(([name]) => dimensions.has(name));
  const geometry = all ? (Object.fromEntries(DIMENSIONS.map(([name]) => [name, dimensions.get(name) ?? 0])) as Geometry) : undefined;
  return geometry === undefined ? { hits } : { hits, geometry };
};

/** Whether a hit lies in the text block, within `h` sp sideways and `v` sp up or down; on either side's margins in a two-sided layout. */
export const inTextBlock = (hit: SentinelHit, g: Geometry, h: number, v: number): boolean => {
  if (hit.x === null || hit.y === null) return true;
  const x = hit.x;
  const across = [g.oddLeft, g.evenLeft].some((left) => x >= left - h && x <= left + g.textWidth + h);
  const down = hit.y <= g.textTop + v && hit.y >= g.textTop - g.textHeight - v;
  return across && down;
};

/**
 * Whether a hit lies past the paper's left or right edge by more than `h` sp: for a sentinel placed `outside` (a margin
 * note's), whose position against the text block is not judged, its text was cut by the paper's edge (MN6, P-d3). Only
 * sideways: a note set below the paper's foot is one that other notes on its page pushed down, as filing many note
 * branches into one document does, which the branch alone would not do (run 41584963423: 7,897 such hits, 1,840 of them
 * in passing branches, against 10,206 past a side). The oracle asks it only on a settled build and never for a `drawn`
 * sentinel (`oracle.ts`).
 */
export const offPaperSideways = (hit: SentinelHit, g: Geometry, h: number): boolean => hit.x !== null && (hit.x < -h || hit.x > g.paperWidth + h);

export const ptOf = (value: number): string => `${(value / SP_PER_PT).toFixed(1)}pt`;
