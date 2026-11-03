/**
 * The oracle on logs written by hand in TeX's shapes: each of the four checks,
 * what is tied to a branch and what to the document, a run that failed as a
 * whole, and an engine that gave nothing.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { judge, type Expected } from '../src/oracle.ts';
import type { Emitted, RawResult } from '../src/model.ts';

const PT = 65536;
const GEOMETRY = [
  ['paperWidth', 612],
  ['paperHeight', 792],
  ['oddLeft', 90],
  ['evenLeft', 90],
  ['textWidth', 432],
  ['textTop', 700],
  ['textHeight', 600],
]
  .map(([name, pt]) => `COMPAT-GEOMETRY{${name}}{${pt}pt}`)
  .join('\n');

const hit = (id: string, page = 1, x = 100, y = 600) => `COMPAT-SENTINEL{${id}}{${page}}{${x * PT}}{${y * PT}}`;

/** Two branches: A on lines 10 to 19, B on lines 20 to 29; line 12 holds `\begin{figure}` and line 3 `\foo`, as the logs below show them. */
const emitted: Emitted = {
  latex: Array.from({ length: 40 }, (_, i) => (i === 11 ? '\\begin{figure}' : i === 2 ? '\\foo' : `line ${i + 1}`)).join('\n'),
  spans: [
    { branch: 'A', from: 10, to: 19 },
    { branch: 'B', from: 20, to: 29 },
  ],
  files: [],
};

/** The fixture with some lines replaced, by line number. */
const withLines = (lines: Readonly<Record<number, string>>, more: Partial<Emitted> = {}): Emitted => {
  const latex = emitted.latex.split('\n').map((l, i) => lines[i + 1] ?? l);
  return { ...emitted, latex: latex.join('\n'), ...more };
};

const expected = (a: Partial<Expected> = {}, b: Partial<Expected> = {}): Expected[] => [
  { branch: 'A', sentinels: [{ id: 'A.0' }], features: [], ...a },
  { branch: 'B', sentinels: [{ id: 'B.0' }], features: [], ...b },
];

const result = (...lines: string[]): RawResult => ({ log: [GEOMETRY, ...lines, 'Output written on main.xdv (1 page, 9 bytes).'].join('\n'), pages: null, ms: 1 });

const checksOf = (judgement: ReturnType<typeof judge>) =>
  Object.fromEntries(judgement.verdicts.map((v) => [v.branch, v.failures.map((f) => f.check)]));

/** What follows a LaTeX error's message in the log, down to the line TeX stopped on and the rest of it. */
const latexHelp = (line: string, rest: string) => ['', 'See the LaTeX manual or LaTeX Companion for explanation.', 'Type  H <return>  for immediate help.', ' ...', '', line, rest];

test('a clean log passes every branch', () => {
  const judgement = judge({ cell: 'c1', emitted, result: result(hit('A.0'), hit('B.0')), expected: expected() });
  assert.deepEqual(checksOf(judgement), { A: [], B: [] });
  assert.ok(judgement.verdicts.every((v) => v.pass && v.cell === 'c1'));
});

test('an error inside a branch fails that branch only; one outside every branch fails the document', () => {
  const inA = judge({ cell: 'c', emitted, result: result('! LaTeX Error: Not in outer par mode.', '', 'l.12 \\begin{figure}', hit('A.0'), hit('B.0')), expected: expected() });
  assert.deepEqual(checksOf(inA), { A: ['error'], B: [] });
  assert.match(inA.verdicts[0]?.failures[0]?.evidence ?? '', /Not in outer par mode\. \(l\.12\)/);

  const inPreamble = judge({ cell: 'c', emitted, result: result('! Undefined control sequence.', 'l.3 \\foo', hit('A.0'), hit('B.0')), expected: expected() });
  assert.deepEqual(checksOf(inPreamble), { A: ['error:document'], B: ['error:document'] });
  assert.equal(inPreamble.document.length, 1);
});

test("an error whose l.<n> shows another file's line is the document's; one whose message names a line is that line's", () => {
  // floatrow.sty's line 12, not the document's: TeX shows the package's text.
  const package_ = judge({
    cell: 'c',
    emitted,
    result: result('! LaTeX Error: Command \\newfloat already defined.', '', 'l.12    {\\flrow@restylefloat{yes}\\newfloat@}}', '', hit('A.0'), hit('B.0')),
    expected: expected(),
  });
  assert.deepEqual(checksOf(package_), { A: ['error:document'], B: ['error:document'] });

  // Named in the message: TeX stops at \end{document} (line 35, no branch's), but the environment began on line 22.
  const named = judge({
    cell: 'c',
    emitted,
    result: result('! LaTeX Error: \\begin{vwcol} on input line 22 ended by \\end{document}.', '', 'l.35 line 35', hit('A.0'), hit('B.0')),
    expected: expected(),
  });
  assert.deepEqual(checksOf(named), { A: [], B: ['error'] });
});

test("a preamble line is the branches' that put it there, and LaTeX's look past a load is that load's", () => {
  const preamble = withLines(
    { 3: '\\usepackage[table]{xcolor}', 4: '\\usepackage{graphicx}', 5: '\\newtheorem{corollary}{Corollary}', 6: '\\providecommand{\\supercite}{}' },
    {
      preamble: [
        { branch: 'A', from: 3, to: 3 },
        { branch: 'B', from: 4, to: 4 },
        { branch: 'A', from: 5, to: 5 },
        { branch: 'B', from: 6, to: 6 },
      ],
    },
  );
  const judged = (...lines: string[]) => checksOf(judge({ cell: 'c', emitted: preamble, result: result(...lines, hit('A.0'), hit('B.0')), expected: expected() }));
  // A broken entry of B's own.
  assert.deepEqual(judged('! Undefined control sequence.', 'l.4 \\usepackage{graphicx}', ''), { A: [], B: ['error'] });
  // The package it names is A's load, though TeX shows B's line after it.
  assert.deepEqual(judged('! LaTeX Error: Option clash for package xcolor.', '', 'l.4 \\usepackage', '                {graphicx}'), { A: ['error'], B: [] });
  // Raised as A's load finished (an end-of-load \fi too many, as titling's under beamer): TeX shows the next line read up to its first command.
  const loaded = ['(/texmf/tex/latex/xcolor/xcolor.sty', ')'];
  assert.deepEqual(judged(...loaded, '! Extra \\fi.', '<argument> ...op@@ }\\expandafter \\@firstofone \\fi ', '', 'l.4 \\usepackage', '                {graphicx}'), {
    A: ['error'],
    B: [],
  });
  // So is a command undefined in that code: TeX shows the macro it stopped in.
  assert.deepEqual(judged(...loaded, '! Undefined control sequence.', '\\XC@hook ->\\XC@undefined ', '                         \\relax', 'l.4 \\usepackage', '                {graphicx}'), {
    A: ['error'],
    B: [],
  });
  // A command named: only an entry that mentions it, else the document.
  assert.deepEqual(judged('! LaTeX Error: Command \\c@corollary already defined.', '', 'l.5 \\newtheorem{corollary}{Corollary}', ''), { A: ['error'], B: [] });
  assert.deepEqual(judged('! LaTeX Error: Command \\c@corollary already defined.', '', 'l.6 \\providecommand{\\supercite}{}', ''), {
    A: ['error:document'],
    B: ['error:document'],
  });
});

test("TeX's look past a line for an optional argument is that line's; a command undefined where it stands is its own line's", () => {
  const preamble = withLines(
    {
      3: '\\usepackage{graphicx}',
      4: '\\floatsetup[figure]{capposition=top}',
      5: '\\newtheorem{theorem}{Theorem}',
      6: '\\declaretheorem[style=plain]{lemma}',
    },
    {
      preamble: [
        { branch: 'A', from: 3, to: 3 },
        { branch: 'B', from: 4, to: 4 },
        { branch: 'A', from: 5, to: 5 },
        { branch: 'B', from: 6, to: 6 },
      ],
    },
  );
  const judged = (...lines: string[]) => checksOf(judge({ cell: 'c', emitted: preamble, result: result(...lines, hit('A.0'), hit('B.0')), expected: expected() }));
  // Undefined where it stands (floatrow not loaded): B's own line, though A's load read it first, looking for its [date]
  // (TeX shows it read again after that look).
  assert.deepEqual(judged('! Undefined control sequence.', 'l.4 \\floatsetup', '                 [figure]{capposition=top}'), { A: [], B: ['error'] });
  assert.deepEqual(judged(')', '! Undefined control sequence.', '<recently read> \\floatsetup ', '', 'l.4 \\floatsetup', '                 [figure]{capposition=top}'), {
    A: [],
    B: ['error'],
  });
  // Raised by A's \newtheorem{theorem} as LaTeX looked for its optional argument: B's \declaretheorem was only read. The
  // definition it ignored then typesets, at the same place (beamer, which defines \theorem): A's too.
  const defined = [
    '! LaTeX Error: Command \\theorem already defined.',
    '               Or name \\end... illegal, see p.192 of the manual.',
    ...latexHelp('l.6 \\declaretheorem', '                   [style=plain]{lemma}'),
    'Your command was ignored.',
  ];
  assert.deepEqual(judged(...defined), { A: ['error'], B: [] });
  assert.deepEqual(judged(...defined, '', '! LaTeX Error: Missing \\begin{document}.', ...latexHelp('l.6 \\declaretheorem', '                   [style=plain]{lemma}')), {
    A: ['error', 'error'],
    B: [],
  });
});

test("a line's first command shown alone raised the error itself when the line before did not look past its end", () => {
  // The class's \abstract{…} blocks in the preamble (\abstract begins the abstract environment and takes no argument).
  const preamble = withLines(
    {
      3: '\\abstract{\\begin{definition}',
      4: '\\end{definition}}',
      5: '\\abstract{\\begin{definition}',
      6: '\\end{definition}}',
      7: '\\newtheorem{corollary}{Corollary}',
      8: '\\abstract{\\begin{corollary}{}{}',
      9: '\\end{corollary}}',
    },
    {
      preamble: [
        { branch: 'A', from: 3, to: 4 },
        { branch: 'B', from: 5, to: 6 },
        { branch: 'A', from: 7, to: 7 },
        { branch: 'B', from: 8, to: 9 },
      ],
    },
  );
  const judged = (...lines: string[]) => checksOf(judge({ cell: 'c', emitted: preamble, result: result(...lines, hit('A.0'), hit('B.0')), expected: expected() }));
  const trouble = "You're in trouble here.  Try typing  <return>  to proceed.";
  // B's \abstract ran at once: its list nests in the ones A's block left open.
  assert.deepEqual(judged('! LaTeX Error: Too deeply nested.', ...latexHelp('l.5 \\abstract', '             {\\begin{definition}'), trouble), { A: [], B: ['error'] });
  // A's \newtheorem looked past its line for [within] and defined the theorem; then B's \abstract set its text.
  assert.deepEqual(judged('\\c@corollary=\\count520', '', '! LaTeX Error: Missing \\begin{document}.', ...latexHelp('l.8 \\abstract', '             {\\begin{corollary}{}{}'), trouble), {
    A: [],
    B: ['error'],
  });
  // A's block, broken, left something waiting at its end that took B's \abstract into a \csname, then as an environment's name.
  assert.deepEqual(
    judged(
      '! Missing \\endcsname inserted.',
      '<to be read again> ',
      '                   \\protect ',
      'l.5 \\abstract',
      '             {\\begin{definition}',
      'The control sequence marked <to be read again> should',
      '! LaTeX Error: Environment \\normalfont \\relax \\fontsize {9}{10pt}\\selectfont \\bfseries \\textit {Abstract}---\\relax undefined.',
      ...latexHelp('l.5 \\abstract', '             {\\begin{definition}'),
    ),
    { A: ['error', 'error'], B: [] },
  );
  // Taken in as an environment's name, B's command is named, though alone (IEEEtran's gobbler after A's block, l.104 of an
  // ieeetran-journal.A log): still A's.
  const declared = withLines(
    { 3: '\\abstract{\\begin{table}', 4: '\\end{table}}', 5: '\\declaretheorem[style=libthm, name=Corollary]{corollary}' },
    { preamble: [{ branch: 'A', from: 3, to: 4 }, { branch: 'B', from: 5, to: 5 }] },
  );
  const taken = ['! LaTeX Error: Environment \\declaretheorem undefined.', ...latexHelp('l.5 \\declaretheorem', '                     [style=libthm, name=Corollary]{corollary}')];
  assert.deepEqual(checksOf(judge({ cell: 'c', emitted: declared, result: result(...taken, hit('A.0'), hit('B.0')), expected: expected() })), { A: ['error'], B: [] });
});

test('an Emergency stop with no line goes with the error before it, and the stop is fatal', () => {
  const judgement = judge({
    cell: 'c',
    emitted,
    result: result(hit('A.0'), '! LaTeX Error: Not in outer par mode.', '', 'l.12 \\begin{figure}', '! Emergency stop.', '<*> ./main.tex', ''),
    expected: expected(),
  });
  assert.deepEqual(checksOf(judgement), { A: ['error', 'error', 'fatal:document'], B: ['fatal:document'] });
});

test('Float(s) lost goes to the branches whose content did not ship, wherever TeX stopped', () => {
  const lost = judge({ cell: 'c', emitted, result: result('! LaTeX Error: Float(s) lost.', '', 'l.15 line 15', hit('A.0')), expected: expected() });
  assert.deepEqual(checksOf(lost), { A: [], B: ['sentinel:missing', 'error'] });
  // A float no sentinel watches (an image places none).
  const unwatched = judge({ cell: 'c', emitted: withLines({ 22: '\\begin{table}' }), result: result('! LaTeX Error: Float(s) lost.', '', 'l.35 line 35', hit('A.0')), expected: expected({}, { sentinels: [] }) });
  assert.deepEqual(checksOf(unwatched), { A: [], B: ['error'] });
  // No loser: the document's.
  const none = judge({ cell: 'c', emitted, result: result('! LaTeX Error: Float(s) lost.', '', 'l.35 line 35', hit('A.0'), hit('B.0')), expected: expected() });
  assert.deepEqual(checksOf(none), { A: ['error:document'], B: ['error:document'] });
});

test("an error in fancyhdr's running head belongs to the document, not to the branch where the page broke", () => {
  const judgement = judge({
    cell: 'c',
    emitted,
    result: result(hit('A.0'), '! Undefined control sequence.', '\\f@nch@olh ->\\ACM@linecountL \\shorttitle ', '                                         \\strut ', 'l.15 line 15', '', hit('B.0')),
    expected: expected(),
  });
  assert.deepEqual(checksOf(judgement), { A: ['error:document'], B: ['error:document'] });
});

test("an error raised in a package's own file is the branches' that load the package, not the branch holding the document's line of that number", () => {
  // abstract.sty's "Extra \else" at its own l.62 under mnras (run 41584963423, F117): here line 12 is A's and holds `\else` too.
  const loading = withLines({ 3: '\\usepackage{abstract}', 12: '\\ifx\\a\\b\\else' }, { preamble: [{ branch: 'B', from: 3, to: 3 }] });
  const judged = (...lines: string[]) => checksOf(judge({ cell: 'c', emitted: loading, result: result('(main.tex', ...lines, hit('A.0'), hit('B.0')), expected: expected() }));
  assert.deepEqual(judged('(/texmf/tex/latex/abstract/abstract.sty', '! Extra \\else.', 'l.12 \\else', '', ')'), { A: [], B: ['error'] });
  // In a file no branch loads (the class's own), the document's.
  assert.deepEqual(judged('(/texmf/tex/latex/base/size10.clo', '! Extra \\else.', 'l.12 \\else', '', ')'), { A: ['error:document'], B: ['error:document'] });
  // Back in the document once the package's file closed: the document's line.
  assert.deepEqual(judged('(/texmf/tex/latex/abstract/abstract.sty', ')', '! Extra \\else.', 'l.12 \\else', ''), { A: ['error'], B: [] });
  // Raised in a file another package loaded (tikz.sty under tcolorbox.sty): the branches' that load the package the
  // document opened (`TexError.through`: B's tcolorbox), not those that load the inner file (A's tikz, a no-op by then).
  const nested = withLines(
    { 3: '\\usepackage{tcolorbox}', 4: '\\usepackage{tikz}', 12: '\\ifx\\a\\b\\else' },
    {
      preamble: [
        { branch: 'B', from: 3, to: 3 },
        { branch: 'A', from: 4, to: 4 },
      ],
    },
  );
  const inner = judge({
    cell: 'c',
    emitted: nested,
    result: result('(main.tex', '(/texmf/tex/latex/tcolorbox/tcolorbox.sty (/texmf/tex/latex/pgf/frontendlayer/tikz.sty', '! Extra \\else.', 'l.12 \\else', '', '))', hit('A.0'), hit('B.0')),
    expected: expected(),
  });
  assert.deepEqual(checksOf(inner), { A: [], B: ['error'] });
});

test('damaging warnings fail the branch whose line they name; harmless ones fail nothing', () => {
  const judgement = judge({
    cell: 'c',
    emitted,
    result: result(
      "LaTeX Warning: Reference `nowhere' on page 1 undefined on input line 22.",
      "LaTeX Font Warning: Font shape `TU/lmr/m/sc' undefined",
      '(Font)              using `TU/lmr/m/n\' instead on input line 12.',
      'Overfull \\hbox (150.2pt too wide) in paragraph at lines 14--14',
      'Overfull \\hbox (2.1pt too wide) in paragraph at lines 24--24',
      hit('A.0'),
      hit('B.0'),
    ),
    expected: expected(),
  });
  assert.deepEqual(checksOf(judgement), { A: ['warning:overfull-hbox'], B: ['warning:undefined-reference'] });
});

test('in a build a TeX error stopped, the first pass, undefined references and changed labels fail nothing', () => {
  const stopped = judge({
    cell: 'c',
    emitted,
    result: result(
      '! LaTeX Error: Not in outer par mode.',
      '',
      'l.12 \\begin{figure}',
      "LaTeX Warning: Reference `mdf@pagelabel-1' on page 1 undefined on input line 22.",
      "LaTeX Warning: Citation `knuth' on page 1 undefined on input line 23.",
      hit('A.0'),
      hit('B.0'),
      'LaTeX Warning: Label(s) may have changed. Rerun to get cross-references right.',
    ),
    expected: expected(),
  });
  assert.deepEqual(checksOf(stopped), { A: ['error'], B: [] });
  const settled = judge({
    cell: 'c',
    emitted,
    result: result(hit('A.0'), hit('B.0'), 'LaTeX Warning: Label(s) may have changed. Rerun to get cross-references right.'),
    expected: expected(),
  });
  assert.deepEqual(checksOf(settled), { A: ['warning:labels-changed:document'], B: ['warning:labels-changed:document'] });
});

test("biblatex's undefined citation, its key in straight quotes, fails the branch whose line it names on a settled build", () => {
  const warning = "LaTeX Warning: Citation 'knuth' on page 1 undefined on input line 22.";
  const settled = judge({ cell: 'c', emitted, result: result(hit('A.0'), warning, hit('B.0')), expected: expected() });
  assert.deepEqual(checksOf(settled), { A: [], B: ['warning:undefined-reference'] });
  // Like the kernel's wording, not judged on a build a TeX error stopped.
  const stopped = judge({ cell: 'c', emitted, result: result('! LaTeX Error: Not in outer par mode.', '', 'l.12 \\begin{figure}', warning, hit('A.0'), hit('B.0')), expected: expected() });
  assert.deepEqual(checksOf(stopped), { A: ['error'], B: [] });
});

test("in a document loading scrlayer-notecolumn, changed labels and an hbox overfull while \\output is active are its loaders'", () => {
  const notecolumn = withLines({ 3: '\\usepackage[markers]{xcolor,scrlayer-notecolumn}' }, { preamble: [{ branch: 'B', from: 3, to: 3 }] });
  const labels = judge({
    cell: 'c',
    emitted: notecolumn,
    result: result(hit('A.0'), hit('B.0'), 'LaTeX Warning: Label(s) may have changed. Rerun to get cross-references right.'),
    expected: expected(),
  });
  assert.deepEqual(checksOf(labels), { A: [], B: ['warning:labels-changed'] });
  assert.equal(labels.document.length, 0);
  // Its note too wide for its column, typeset while \output is active: no line, B's as the loader.
  const box = judge({
    cell: 'c',
    emitted: notecolumn,
    result: result(hit('A.0'), 'Overfull \\hbox (15.52pt too wide) has occurred while \\output is active', '[][]', '', '[1', hit('B.0'), ']'),
    expected: expected(),
  });
  assert.deepEqual(checksOf(box), { A: [], B: ['warning:overfull-hbox'] });
  // On a build a TeX error stopped, changed labels still fail nothing.
  const stopped = judge({
    cell: 'c',
    emitted: notecolumn,
    result: result('! LaTeX Error: Not in outer par mode.', '', 'l.12 \\begin{figure}', hit('A.0'), hit('B.0'), 'LaTeX Warning: Label(s) may have changed. Rerun to get cross-references right.'),
    expected: expected(),
  });
  assert.deepEqual(checksOf(stopped), { A: ['error'], B: [] });
});

test("any other hbox overfull while \\output is active is the branch's whose lines reported a box as wide; with none, the document's", () => {
  // An output routine (longtable, \twocolumn, multicol) packing A's box again.
  const again = judge({
    cell: 'c',
    emitted,
    result: result(
      'Overfull \\hbox (403.74306pt too wide) in paragraph at lines 14--14',
      '[]',
      '',
      'Overfull \\hbox (403.74306pt too wide) has occurred while \\output is active',
      '[]',
      '',
      '[1',
      hit('A.0'),
      hit('B.0'),
      ']',
    ),
    expected: expected(),
  });
  assert.deepEqual(checksOf(again), { A: ['warning:overfull-hbox', 'warning:overfull-hbox'], B: [] });
  const unmatched = judge({
    cell: 'c',
    emitted,
    result: result('Overfull \\hbox (20.5pt too wide) has occurred while \\output is active', '[]', '', '[1', hit('A.0'), hit('B.0'), ']'),
    expected: expected(),
  });
  assert.deepEqual(checksOf(unmatched), { A: ['warning:overfull-hbox:document'], B: ['warning:overfull-hbox:document'] });
});

test("an hbox overfull while \\output is active that no branch's box matches is the heading's whose running head it shows", () => {
  // book's headings page style: A's \chapter (line 12) on even pages, B's \section (line 22) on odd ones.
  const heads = withLines({ 12: '\\chapter{\\parencite{key} bold italic verbatim smallcaps}', 22: '\\section{escapes and more words}' });
  const head = (display: string) =>
    judge({
      cell: 'c',
      emitted: heads,
      result: result(hit('A.0'), 'LaTeX Font Info:    Font shape `TU/lmr/m/sl\' tried on input line 25.', 'Overfull \\hbox (708.4pt too wide) has occurred while \\output is active', display, '', '[1', hit('B.0'), ']'),
      expected: expected(),
    });
  assert.deepEqual(checksOf(head('\\TU/lmr/m/n/10 4 \\TU/lmr/m/sl/10 CHAPTER 1.  [[]] BOLD ITALIC VERBATIM SMALLCAPS []')), { A: ['warning:overfull-hbox'], B: [] });
  assert.deepEqual(checksOf(head('\\TU/lmr/m/n/10 .1.  ESCAPES AND MORE WORDS 9 []')), { A: [], B: ['warning:overfull-hbox'] });
  // A two-column page packed again shows no heading's words: the document's, as before.
  assert.deepEqual(checksOf(head('[] []|[] []')), { A: ['warning:overfull-hbox:document'], B: ['warning:overfull-hbox:document'] });
});

test("on a build that never settled, an overfull hbox its citations printed as keys explain is not judged; a wider one is", () => {
  // biblatex with no .bbl sets each citation as its key in bold, in an \mbox: `[[]]` in the display (ddac9eb0ab723e907531d).
  const cites = (pt: number, line: number) => [`Overfull \\hbox (${pt}pt too wide) in paragraph at lines ${line}--${line}`, '\\OML/lmm/m/it/10 M$\\TU/LatinModernRoman(0)/m/n/10 [[]][] [[]]', ' []', ''];
  const error = ['! LaTeX Error: Not in outer par mode.', '', 'l.12 \\begin{figure}'];
  const stopped = judge({ cell: 'c', emitted, result: result(...error, ...cites(82.27167, 15), ...cites(259.6, 22), hit('A.0'), hit('B.0')), expected: expected() });
  assert.deepEqual(checksOf(stopped), { A: ['error'], B: ['warning:overfull-hbox'] });
  // Settled, the citations are resolved: a box still over is the line's own.
  const settled = judge({ cell: 'c', emitted, result: result(...cites(82.27167, 15), hit('A.0'), hit('B.0')), expected: expected() });
  assert.deepEqual(checksOf(settled), { A: ['warning:overfull-hbox'], B: [] });
  // A box with resolved citations (their numbers shown) on the stopped build is judged.
  const numbered = ['Overfull \\hbox (30.1pt too wide) in paragraph at lines 22--22', '\\OML/lmm/m/it/10 M$\\TU/LatinModernRoman(0)/m/n/10 [[]1[]] [[]2[]]', ''];
  const plain = judge({ cell: 'c', emitted, result: result(...error, ...numbered, hit('A.0'), hit('B.0')), expected: expected() });
  assert.deepEqual(checksOf(plain), { A: ['error'], B: ['warning:overfull-hbox'] });
});

test("a box reported on the line after a branch that ends with a margin note is the note's: TeX read that line for the note's trailing optional argument", () => {
  // article.B d0e00c1c7382c4790e3d5 (run 41584963423): `\marginnote{…}` last at l.236, its words overfull "at lines 237--237", the host's \nocite{*}.
  const judged = (lines: Readonly<Record<number, string>>, box: string) =>
    checksOf(judge({ cell: 'c', emitted: withLines(lines), result: result(box, hit('A.0'), hit('B.0')), expected: expected() }));
  const box = 'Overfull \\hbox (12.5pt too wide) in paragraph at lines 30--30';
  assert.deepEqual(judged({ 29: 'text\\marginnote{{\\raggedleft \\textbf{bold} words\\par}}', 30: '\\nocite{*}' }, box), { A: [], B: ['warning:overfull-hbox'] });
  // A note that does not end its line, a note with its offset given, or a box two lines on: the document's.
  assert.deepEqual(judged({ 29: '\\marginnote{words} and more', 30: '\\nocite{*}' }, box), { A: ['warning:overfull-hbox:document'], B: ['warning:overfull-hbox:document'] });
  assert.deepEqual(judged({ 29: '\\marginnote{words}[2pt]', 30: '\\nocite{*}' }, box), { A: ['warning:overfull-hbox:document'], B: ['warning:overfull-hbox:document'] });
  assert.deepEqual(judged({ 29: '\\marginnote{words}', 31: '\\nocite{*}' }, box.replace(/30--30/, '31--31')), { A: ['warning:overfull-hbox:document'], B: ['warning:overfull-hbox:document'] });
});

test('a note column sentinel (nextRun) that never shipped is judged only on a settled build', () => {
  const notecolumn = expected({}, { sentinels: [{ id: 'B.0', nextRun: true }] });
  // A TeX error ended the build after its first run: the note column's text, from the .slnc an earlier run writes, never shipped.
  const stopped = judge({ cell: 'c', emitted, result: result('! LaTeX Error: Not in outer par mode.', '', 'l.12 \\begin{figure}', hit('A.0')), expected: notecolumn });
  assert.deepEqual(checksOf(stopped), { A: ['error'], B: [] });
  const settled = judge({ cell: 'c', emitted, result: result(hit('A.0')), expected: notecolumn });
  assert.deepEqual(checksOf(settled), { A: [], B: ['sentinel:missing'] });
  // A sentinel not placed nextRun is judged on the stopped build as before.
  const plain = judge({ cell: 'c', emitted, result: result('! LaTeX Error: Not in outer par mode.', '', 'l.12 \\begin{figure}', hit('A.0')), expected: expected() });
  assert.deepEqual(checksOf(plain), { A: ['error'], B: ['sentinel:missing'] });
});

test('a build BibTeX stopped (a .bbl asked for, none made, no TeX error) fails the document, not the citing branch', () => {
  const judgement = judge({
    cell: 'c',
    emitted,
    result: result(hit('A.0'), "LaTeX Warning: Citation `knuth' on page 1 undefined on input line 22.", hit('B.0'), 'No file main.bbl.'),
    expected: expected(),
  });
  assert.deepEqual(checksOf(judgement), { A: ['no-bbl:document'], B: ['no-bbl:document'] });
});

test('a page that overflowed with no page shipped after it, or a missing glyph, belongs to the document', () => {
  const judgement = judge({
    cell: 'c',
    emitted,
    result: result(
      'Overfull \\vbox (312.0pt too high) has occurred while \\output is active',
      'Missing character: There is no ☃ (U+2603) in font lmroman10-regular!',
      hit('A.0'),
      hit('B.0'),
    ),
    expected: expected(),
  });
  assert.deepEqual(checksOf(judgement).A, ['warning:page-overflow:document', 'warning:missing-character:document']);
});

test('a page that overflowed is charged to the branches whose sentinels shipped on it', () => {
  const judgement = judge({
    cell: 'c',
    emitted,
    result: result('[1', hit('A.0'), ']', 'Overfull \\vbox (312.0pt too high) has occurred while \\output is active []', '', '[2', hit('B.0', 2), ']'),
    expected: expected(),
  });
  assert.deepEqual(checksOf(judgement), { A: [], B: ['warning:page-overflow'] });
  assert.match(judgement.verdicts[1]?.failures[0]?.evidence ?? '', /while page 2 was made/);
});

test('a page that overflowed is charged only to the branch whose sentinel ran off it, when one did', () => {
  const judgement = judge({
    cell: 'c',
    emitted,
    result: result('Overfull \\vbox (312.0pt too high) has occurred while \\output is active []', '', '[1', hit('A.0'), hit('B.0', 1, 100, 50), ']'),
    expected: expected(),
  });
  assert.deepEqual(checksOf(judgement), { A: [], B: ['warning:page-overflow', 'sentinel:outside'] });
});

test('a page overflowing within the vertical tolerance fails nothing', () => {
  const judgement = judge({
    cell: 'c',
    emitted,
    result: result('Overfull \\vbox (3.5pt too high) has occurred while \\output is active []', '[1', hit('A.0'), hit('B.0'), ']'),
    expected: expected(),
  });
  assert.deepEqual(checksOf(judgement), { A: [], B: [] });
});

test('pages shipped back to back after the report share it; a page no sentinel shipped on belongs to the document', () => {
  // paracol makes a column's pages before it ships the ones before them: the report may be the second page's.
  const batch = judge({
    cell: 'c',
    emitted,
    result: result('[1', hit('A.0'), ']', 'Overfull \\vbox (40.0pt too high) has occurred while \\output is active []', '', '[2] [3', hit('B.0', 3), ']'),
    expected: expected(),
  });
  assert.deepEqual(checksOf(batch), { A: [], B: ['warning:page-overflow'] });
  assert.match(batch.verdicts[1]?.failures[0]?.evidence ?? '', /while one of pages 2, 3 was made/);

  const empty = judge({
    cell: 'c',
    emitted,
    result: result('[1', hit('A.0'), ']', 'Overfull \\vbox (40.0pt too high) has occurred while \\output is active []', '[2]'),
    expected: expected({}, { sentinels: [] }),
  });
  assert.deepEqual(checksOf(empty), { A: ['warning:page-overflow:document'], B: ['warning:page-overflow:document'] });
});

test('a page no sentinel shipped on goes to the branch whose line the log named last before it, if that branch shipped none', () => {
  // An unbreakable box taller than the page (a beamer slide's image in mdframed), alone on page 2, holds no sentinel:
  // B places none, and its lines 21 to 23 were named while page 1 shipped.
  const overflow = 'Overfull \\vbox (40.0pt too high) has occurred while \\output is active []';
  const underfull = (from: number, to: number) => `Underfull \\hbox (badness 10000) in paragraph at lines ${from}--${to}`;
  const named = judge({
    cell: 'c',
    emitted,
    result: result('[1', hit('A.0'), ']', underfull(21, 23), '', overflow, '', '[2]'),
    expected: expected({}, { sentinels: [] }),
  });
  assert.deepEqual(checksOf(named), { A: [], B: ['warning:page-overflow'] });

  // A's lines are named last, but A's sentinel shipped on page 1, which a box of A's would have carried to page 2.
  const skipped = judge({
    cell: 'c',
    emitted,
    result: result('[1', underfull(21, 23), '', underfull(12, 13), '', hit('A.0'), ']', overflow, '', '[2]'),
    expected: expected({}, { sentinels: [] }),
  });
  assert.deepEqual(checksOf(skipped), { A: [], B: ['warning:page-overflow'] });

  // B's lines were named before two pages shipped back to back: past the window, so the page stays the document's.
  const past = judge({
    cell: 'c',
    emitted,
    result: result(underfull(21, 23), '', '[1', hit('A.0'), ']', '[2]', overflow, '', '[3]'),
    expected: expected({}, { sentinels: [] }),
  });
  assert.deepEqual(checksOf(past), { A: ['warning:page-overflow:document'], B: ['warning:page-overflow:document'] });
});

test('a sentinel lost, shipped twice, or outside the text block fails its branch', () => {
  const judgement = judge({
    cell: 'c',
    emitted,
    result: result(hit('A.0'), hit('A.0', 2), hit('B.0', 1, 560, 600), hit('B.1', 1, 560, 600)),
    expected: expected({ sentinels: [{ id: 'A.0' }, { id: 'A.lost' }] }, { sentinels: [{ id: 'B.0' }, { id: 'B.1', outside: true }] }),
  });
  assert.deepEqual(checksOf(judgement), { A: ['sentinel:duplicated', 'sentinel:missing'], B: ['sentinel:outside'] });
  assert.match(judgement.verdicts[1]?.failures[0]?.evidence ?? '', /x 560\.0pt, y 600\.0pt on page 1/);
});

test("a margin note's sentinel past the paper's left or right edge fails its branch on a settled build; one below the paper's foot, one TikZ draws, or one after an error does not", () => {
  const judged = (...before: string[]) =>
    judge({
      cell: 'c',
      emitted,
      result: result(...before, hit('A.0'), hit('A.n', 1, 640, 600), hit('B.0'), hit('B.n', 1, 600, -30), hit('B.m', 1, -5, 600), hit('B.d', 1, 700, 600)),
      expected: expected(
        { sentinels: [{ id: 'A.0' }, { id: 'A.n', outside: true }] },
        { sentinels: [{ id: 'B.0' }, { id: 'B.n', outside: true }, { id: 'B.m', outside: true }, { id: 'B.d', outside: true, drawn: true }] },
      ),
    });
  const judgement = judged();
  assert.deepEqual(checksOf(judgement), { A: ['sentinel:off-paper'], B: [] });
  assert.match(judgement.verdicts[0]?.failures[0]?.evidence ?? '', /A\.n shipped past the paper's edge, at x 640\.0pt on page 1 \(the paper is 612\.0pt wide\)/);
  // Past the left edge by more than the tolerance (B.m, 5pt past it, is within it).
  const left = judge({
    cell: 'c',
    emitted,
    result: result(hit('A.0'), hit('B.0'), hit('B.l', 1, -15, 600)),
    expected: expected({}, { sentinels: [{ id: 'B.0' }, { id: 'B.l', outside: true }] }),
  });
  assert.deepEqual(checksOf(left), { A: [], B: ['sentinel:off-paper'] });
  // A build a TeX error ended after its first run: marginnote placed the note from no earlier run's position.
  assert.deepEqual(checksOf(judged('! Undefined control sequence.', 'l.12 \\begin{figure}', '')), { A: ['error'], B: [] });
});

test('sentinels placed with no text block in the log fail the document', () => {
  const judgement = judge({ cell: 'c', emitted, result: { log: hit('A.0'), pages: 1, ms: 1 }, expected: expected({}, { sentinels: [] }) });
  assert.deepEqual(checksOf(judgement).A, ['sentinel:preamble:document']);
});

test('feature probes: a box that never broke, a note away from its mark, a feature with no probe', () => {
  const judgement = judge({
    cell: 'c',
    emitted,
    result: result(hit('A.start', 2), hit('A.end', 2), hit('B.mark', 1), hit('B.text', 2)),
    expected: expected(
      { sentinels: [{ id: 'A.start', role: 'breakable:start' }, { id: 'A.end', role: 'breakable:end' }], features: ['breakable', 'teleport'] },
      { sentinels: [{ id: 'B.mark', role: 'footnote:mark' }, { id: 'B.text', role: 'footnote:text' }], features: ['footnote'] },
    ),
  });
  assert.deepEqual(checksOf(judgement), { A: ['feature:breakable', 'feature:teleport'], B: ['feature:footnote'] });
  assert.match(judgement.verdicts[0]?.failures[0]?.evidence ?? '', /both shipped on page 2/);
  assert.match(judgement.verdicts[1]?.failures[0]?.evidence ?? '', /mark on page 1, text on page 2/);

  const broke = judge({
    cell: 'c',
    emitted,
    result: result(hit('A.start', 1), hit('A.end', 2), hit('B.0')),
    expected: expected({ sentinels: [{ id: 'A.start', role: 'breakable:start' }, { id: 'A.end', role: 'breakable:end' }], features: ['breakable'] }),
  });
  assert.deepEqual(checksOf(broke).A, []);
});

test('a fatal stop or no page fails every branch as the document, and no unshipped sentinel or feature is charged to its branch', () => {
  const stopped = judge({
    cell: 'c',
    emitted,
    result: result(hit('A.0'), '! TeX capacity exceeded, sorry [main memory size=5000000].', 'l.25 line 25', ''),
    expected: expected({}, { sentinels: [{ id: 'B.0' }, { id: 'B.1' }], features: ['teleport'] }),
  });
  assert.deepEqual(checksOf(stopped), { A: ['fatal:document'], B: ['error', 'fatal:document'] });
  // No page, with or without an error: nothing printed.
  const none = judge({ cell: 'c', emitted, result: { log: [GEOMETRY, 'No pages of output.'].join('\n'), pages: null, ms: 1 }, expected: expected() });
  assert.deepEqual(checksOf(none), { A: ['no-pages:document'], B: ['no-pages:document'] });
  const erred = judge({
    cell: 'c',
    emitted,
    result: { log: [GEOMETRY, '! LaTeX Error: Not in outer par mode.', '', 'l.12 \\begin{figure}', 'No pages of output.'].join('\n'), pages: null, ms: 1 },
    expected: expected(),
  });
  assert.deepEqual(checksOf(erred), { A: ['error', 'no-pages:document'], B: ['no-pages:document'] });
});

test('the end of the file reached while skipping a conditional is the line it began on; what came after it, or never reached a page, carries it', () => {
  const skip = (line: number, ...shipped: string[]) =>
    judge({
      cell: 'c',
      emitted,
      result: result(
        ...shipped,
        `! Incomplete \\iffalse; all text was ignored after line ${line}.`,
        '<inserted text> ',
        '                \\fi ',
        '<*> ./main.tex',
        '',
        '! Emergency stop.',
        '<*> ./main.tex',
        '',
        '*** (job aborted, no legal \\end found)',
      ),
      expected: expected({}, { sentinels: [] }),
    });
  // Begun in B: A ran, and its sentinel shows it reached a page.
  assert.deepEqual(checksOf(skip(25, hit('A.0'))), { A: [], B: ['error', 'error'] });
  // Begun in B, nothing shipped: the page A was on was dropped, and its sentinel says nothing more.
  assert.deepEqual(checksOf(skip(25)), { A: ['error:document'], B: ['error', 'error'] });
  // Begun in A: B never ran. The charge is B's own, not the document's.
  const inA = skip(15, hit('A.0'));
  assert.deepEqual(checksOf(inA), { A: ['error', 'error'], B: ['error:document'] });
  assert.equal(inA.document.length, 0);
  // Begun outside every branch: the document's, as before.
  assert.deepEqual(checksOf(skip(35, hit('A.0'))), { A: ['error:document', 'error:document'], B: ['error:document', 'error:document'] });
  // Begun on a preamble line no branch put there: the document's, and the branches after it never ran, so their unshipped sentinels are not theirs.
  const unowned = judge({
    cell: 'c',
    emitted,
    result: result('! Incomplete \\iffalse; all text was ignored after line 5.', '<*> ./main.tex', '', '! Emergency stop.', '<*> ./main.tex', ''),
    expected: expected(),
  });
  assert.deepEqual(checksOf(unowned), { A: ['error:document', 'error:document'], B: ['error:document', 'error:document'] });
});

test('a result with no log fails every branch as the document, and nothing else is judged', () => {
  const judgement = judge({ cell: 'c', emitted, result: { log: '', pages: null, ms: 121_600 }, expected: expected() });
  assert.deepEqual(checksOf(judgement), { A: ['no-log:document'], B: ['no-log:document'] });
  assert.deepEqual(judgement.document.map((f) => f.check), ['no-log']);
  assert.match(judgement.document[0]?.evidence ?? '', /122 s/);
  assert.equal(judgement.noVerdict, undefined);
});

test('an engine that gave nothing leaves nothing to judge', () => {
  const judgement = judge({ cell: 'c', emitted, result: { log: '', pages: null, ms: 0, threw: 'Chrome went away' }, expected: expected() });
  assert.deepEqual(judgement.verdicts, []);
  assert.equal(judgement.noVerdict, 'Chrome went away');
});
