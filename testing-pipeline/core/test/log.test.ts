import assert from 'node:assert/strict';
import { test } from 'node:test';

import { LOG_WIDTH, readLog, shapeOf, showsLine } from '../src/log.ts';

const wrapped = `Package tcolorbox Warning: ${'x'.repeat(LOG_WIDTH - 'Package tcolorbox Warning: '.length)}`;

const LOG = [
  'This is XeTeX, Version 3.141592653-2.6-0.999996',
  wrapped,
  'and the rest of the warning.',
  'LaTeX Warning: Reference `thm:x\' on page 1 undefined on input line 12.',
  '! Undefined control sequence.',
  'l.3 \\foo',
  '         {bar}',
  'Overfull \\hbox (3.2pt too wide) in paragraph at lines 5--6',
  'Underfull \\hbox (badness 10000) in paragraph at lines 7--8',
  'Missing character: There is no ☃ in font lmroman10-regular!',
  'Output written on main.xdv (2 pages, 3456 bytes).',
].join('\n');

const LATEX = '\\documentclass{article}\n\\begin{document}\n\\foo{bar}\n\\end{document}\n';

test('readLog reads pages, errors with their source line, warnings, boxes and missing characters', () => {
  const reading = readLog(LOG, LATEX);
  assert.equal(reading.pages, 2);
  assert.deepEqual(reading.errors, [{ message: 'Undefined control sequence.', line: 3, shown: ['\\foo', '{bar}'], source: '\\foo{bar}' }]);
  assert.equal(reading.fatal, false);
  assert.equal(reading.noBbl, false);
  assert.deepEqual(reading.warnings, [
    `${wrapped}and the rest of the warning.`,
    "LaTeX Warning: Reference `thm:x' on page 1 undefined on input line 12.",
  ]);
  assert.equal(reading.overfull, 1);
  assert.equal(reading.underfull, 1);
  assert.deepEqual(reading.missing, ['There is no ☃ in font lmroman10-regular!']);
});

test('readLog without the LaTeX still gives each error its line', () => {
  assert.deepEqual(readLog(LOG).errors, [{ message: 'Undefined control sequence.', line: 3, shown: ['\\foo', '{bar}'] }]);
});

test("showsLine tells the document's line from a package's line of the same number (floatrow.sty's l.255 under memoir)", () => {
  const log = ['(/texmf/tex/latex/floatrow/floatrow.sty', '! LaTeX Error: Command \\newfloat already defined.', '', 'l.255    {\\flrow@restylefloat{yes}\\newfloat@}}', ''].join('\n');
  const [error] = readLog(log, LATEX).errors;
  assert.equal(error?.line, 255);
  assert.equal(showsLine(error?.shown, undefined), false);
  assert.equal(showsLine(error?.shown, '\\usepackage{floatrow}'), false);
  // What TeX had read, else the rest of the line; a long line cut to `...`, a tab shown as ^^I.
  assert.equal(showsLine(['\\foo', '{bar}'], '\\foo{bar}'), true);
  assert.equal(showsLine(['...so long that TeX cut it', ''], 'a line so long that TeX cut it'), true);
  assert.equal(showsLine(['', '\\begin{figure}'], '\\begin{figure}'), true);
  assert.equal(showsLine(['a^^Ib', ''], 'a\tb'), true);
  assert.equal(showsLine(undefined, undefined), true);
});

test("readLog names the file TeX was reading at an error, from the log's open files, when it is not the document", () => {
  // A package's name cut at the log's width, as TeX writes it.
  const cut = `${'x'.repeat(LOG_WIDTH - '(/texmf/tex/latex/ab'.length)}(/texmf/tex/latex/ab`;
  const log = [
    '(main.tex',
    '(/texmf/tex/latex/mnras/mnras.cls',
    'Document Class: mnras 2023/07/20 v3.2 (see the manual)',
    ')',
    cut,
    'stract/abstract.sty',
    '! Extra \\else.',
    'l.62 \\else',
    '          ',
    "I'm ignoring this; it doesn't match any \\if (e.g., this).",
    '',
    ')',
    '! Extra \\fi.',
    '<argument> ...op@@ }\\expandafter \\@firstofone \\fi )',
    '',
    'l.19 \\usepackage',
    '                {enumerate}',
    '',
    '(/texmf/tex/latex/tcolorbox/tcolorbox.sty (/texmf/tex/latex/pgf/frontendlayer/tikz.sty',
    'Runaway argument?',
    '{escapeinside={(*@}{@ETC.',
    'Overfull \\hbox (3.0pt too wide) in paragraph at lines 5--6',
    '[]\\TU/lmr/m/n/10 a box showing an unmatched ) and (two',
    '',
    '! Undefined control sequence.',
    'l.7 \\pgf@x',
    '',
    '))',
    '! Undefined control sequence.',
    'l.40 \\foo',
    '',
  ].join('\n');
  const [inPackage, back, nested, after] = readLog(log).errors;
  assert.equal(inPackage?.file, 'abstract.sty');
  assert.equal(inPackage?.through, 'abstract.sty');
  assert.equal(back?.file, undefined);
  assert.equal(back?.line, 19);
  // Neither an error's context, a box's display nor a runaway argument's tokens opens or closes a file.
  assert.equal(nested?.file, 'tikz.sty');
  assert.equal(nested?.through, 'tcolorbox.sty');
  assert.equal(after?.file, undefined);
  // No file open (a log without the document's own): TeX's line as before.
  assert.equal(readLog('! Extra \\else.\nl.62 \\else\n').errors[0]?.file, undefined);
});

test("readLog reads the error right after an empty runaway argument as an error, not its context's brackets as files; a stack that lost the document names no file", () => {
  // An empty argument shows no tokens, so the `! ` line follows `Runaway argument?` at once (aastex.A, run 41584963423,
  // result 7ce35b6261: skipped, the error's `l.129 ...ulewidth)/3-2...` closed main.tex itself).
  const log = [
    '(main.tex',
    '(/texmf/tex/latex/foo/foo.sty',
    'Runaway argument?',
    '! Paragraph ended before \\foo@x was complete.',
    '<to be read again> ',
    '                   \\par ',
    'l.40 \\foo@x{see (fig.png',
    '                         ',
    "I suspect you've forgotten a `}', causing me to apply this",
    'control sequence to too much text. How can we recover?',
    'My plan is to forget the whole thing and hope for the best.',
    '',
    ')',
    '! Undefined control sequence.',
    'l.90 \\bar',
    '',
  ].join('\n');
  const [runaway, after] = readLog(log).errors;
  assert.equal(runaway?.file, 'foo.sty');
  assert.equal(runaway?.line, 40);
  assert.equal(after?.file, undefined);
  assert.equal(after?.line, 90);
  // A `)` read in text closed the document's file, then two files opened: the stack no longer says what TeX reads.
  const lost = ['(main.tex', 'see fig.~1)', '(/texmf/tex/latex/a/a.sty (/texmf/tex/latex/b/b.sty', '! Undefined control sequence.', 'l.7 \\x', '', '))'].join('\n');
  assert.equal(readLog(lost).errors[0]?.file, undefined);
});

test('readLog tells a fatal stop and a run with no pages', () => {
  const reading = readLog('! Emergency stop.\n!  ==> Fatal error occurred, no output PDF file produced!\nNo pages of output.\n');
  assert.equal(reading.fatal, true);
  assert.equal(reading.pages, 0);
  assert.deepEqual(reading.errors.map((e) => e.message), ['Emergency stop.']);
  assert.equal(readLog('').pages, null);
});

test('readLog takes the stops ZeroTeX logs as fatal: an emergency stop, capacity exceeded, the hundredth error', () => {
  for (const log of [
    '! Emergency stop.\n<output> {\\dispatch@output }\nl.135 x\nNo pages of output.\n',
    '! TeX capacity exceeded, sorry [main memory size=5000000].\nl.300 \\end{figure}}\n',
    '! Undefined control sequence.\nl.9 x\n(That makes 100 errors; please try again.) \nNo pages of output.\n',
  ]) {
    assert.equal(readLog(log).fatal, true, log);
  }
});

test('readLog gives an Incomplete \\if at the end of the file the line its skipping began on, and the Emergency stop after it the same', () => {
  const reading = readLog(
    [
      '! Incomplete \\iffalse; all text was ignored after line 457.',
      '<inserted text> ',
      '                \\fi ',
      '<*> ./main.tex',
      '              ',
      'The file ended while I was skipping conditional text.',
      '',
      '! Emergency stop.',
      '<*> ./main.tex',
      '              ',
      '*** (job aborted, no legal \\end found)',
    ].join('\n'),
  );
  assert.deepEqual(reading.errors, [
    { message: 'Incomplete \\iffalse; all text was ignored after line 457.', line: 457, skipsFrom: 457 },
    { message: 'Emergency stop.', line: 457 },
  ]);
  // That stop is the end of the file, and the log names how far the run got: not a fatal stop.
  assert.equal(reading.fatal, false);
  // A file it input ended (TeX names the line it was on): that line stays.
  const inner = readLog(['! Incomplete \\iffalse; all text was ignored after line 533.', '<inserted text> ', '                \\fi ', 'l.657 \\end{document}'].join('\n'));
  assert.deepEqual(inner.errors, [{ message: 'Incomplete \\iffalse; all text was ignored after line 533.', line: 657, shown: ['\\end{document}', ''] }]);
});

test('readLog tells a run that asked for a .bbl no BibTeX run made', () => {
  assert.equal(readLog('(./main.aux)\nNo file main.bbl.\nOutput written on main.xdv (1 page, 9 bytes).\n').noBbl, true);
  assert.equal(readLog('(./main.aux) (./main.bbl)\nOutput written on main.xdv (1 page, 9 bytes).\n').noBbl, false);
});

test('readLog joins a package warning across its (package) lines, and reads each box report', () => {
  const reading = readLog(
    [
      'Package hyperref Warning: Token not allowed in a PDF string (Unicode):',
      '(hyperref)                removing `\\compatSentinel\' on input line 30.',
      'Overfull \\hbox (150.2pt too wide) in paragraph at lines 14--15',
      'Overfull \\hbox (3.0pt too wide) detected at line 20',
      'Underfull \\hbox (badness 10000) in alignment at lines 40--44',
      'Overfull \\vbox (312.0pt too high) has occurred while \\output is active',
    ].join('\n'),
  );
  assert.deepEqual(reading.warnings, [
    "Package hyperref Warning: Token not allowed in a PDF string (Unicode): removing `\\compatSentinel' on input line 30.",
  ]);
  assert.deepEqual(reading.boxes, [
    { kind: 'overfull', box: 'h', amount: 150.2, lines: [14, 15], output: false },
    { kind: 'overfull', box: 'h', amount: 3, lines: [20, 20], output: false },
    { kind: 'underfull', box: 'h', amount: 10000, lines: [40, 44], output: false },
    // The page that overflowed carries the lines named before it, a range by its last line (`BoxReport.named`).
    { kind: 'overfull', box: 'v', amount: 312, output: true, named: [30, 15, 20, 44] },
  ]);
  assert.equal(reading.overfull, 3);
  assert.equal(reading.underfull, 1);
});

test('readLog gives a box reported while \\output is active the pages TeX ships next, back to back', () => {
  const reading = readLog(
    [
      'Overfull \\vbox (12.0pt too high) has occurred while \\output is active []',
      '',
      ' [4',
      'COMPAT-SENTINEL{a.0}{4}{1}{2}',
      '] [5',
      ']',
      'Overfull \\vbox (9.0pt too high) has occurred while \\output is active []',
      '',
      '[6',
      ']',
      '(./main.aux) [7]',
    ].join('\n'),
  );
  assert.deepEqual(reading.boxes, [
    { kind: 'overfull', box: 'v', amount: 12, output: true, pages: [4, 5] },
    { kind: 'overfull', box: 'v', amount: 9, output: true, pages: [6] },
  ]);
});

test('readLog gives a page that overflowed the lines named since the page before it started to ship, never from a display', () => {
  const reading = readLog(
    [
      'Package hyperref Warning: Token not allowed in a PDF string (Unicode): removing `\\x\' on input line 5.',
      '[1',
      ']',
      'Overfull \\hbox (12.0pt too wide) in paragraph at lines 14--16',
      '[]\\TU/LatinModernRoman(0)/m/n/10 on input line 99',
      '',
      '[2',
      ']',
      "LaTeX Warning: Reference `x' on page 2 undefined on input line 20.",
      '! Undefined control sequence.',
      'l.22 \\foo',
      '         {bar}',
      'Overfull \\hbox (8.0pt too wide) has occurred while \\output is active',
      '',
      'Overfull \\vbox (30.0pt too high) has occurred while \\output is active []',
      '',
      '[3',
      ']',
    ].join('\n'),
  );
  // Line 5 was named before page 1 shipped, two pages back; line 99 is in the hbox's display. The hbox reported while
  // \output is active carries no window of lines, only the last line named before it (`lastNamed`, batch 6): only a page
  // that overflowed carries the window.
  assert.deepEqual(reading.boxes, [
    { kind: 'overfull', box: 'h', amount: 12, lines: [14, 16], output: false },
    { kind: 'overfull', box: 'h', amount: 8, output: true, lastNamed: 22, pages: [3] },
    { kind: 'overfull', box: 'v', amount: 30, output: true, pages: [3], named: [16, 20, 22] },
  ]);
});

test("readLog reads no page in a box report's display: a running head's `[1]`, cut at the log's width or not", () => {
  // An overflow waits while the running head's own report passes before the page ships (as in beamer.A's logs); the
  // head's display (book.A's) shows its text, cut after the `[1` of a `[1]`.
  const cut = readLog(
    [
      'Overfull \\vbox (289.37814pt too high) has occurred while \\output is active []',
      '',
      '',
      'Overfull \\hbox (590.20554pt too wide) has occurred while \\output is active',
      '\\TU/LatinModernRoman(0)/m/n/10 4 \\TU/LatinModernRoman(0)/m/it/10 CHAPTER 1.  [1',
      '] \\TU/LatinModernRoman(0)/b/it/10 BOLD \\TU/LatinModernRoman(0)/m/it/10 ITALIC  ',
      ' []',
      '',
      '[4] [5',
      '',
    ].join('\n'),
  );
  assert.deepEqual(
    cut.boxes.map((b) => b.pages),
    [
      [4, 5],
      [4, 5],
    ],
  );
  // The `[1]` at the start of a display's line (book.A).
  const start = readLog(
    [
      'Overfull \\hbox (599.54665pt too wide) has occurred while \\output is active',
      '\\TU/LatinModernRoman(0)/m/n/10 24 \\TU/LatinModernRoman(0)/m/it/10 APPENDIX A.  ',
      '[1] \\TU/LatinModernRoman(0)/b/it/10 BOLD \\TU/LatinModernRoman(0)/m/it/10 ITALIC',
      ' []',
      '',
      '[24',
      '',
      ']',
    ].join('\n'),
  );
  assert.deepEqual(start.boxes[0]?.pages, [24]);
});

test("readLog marks a box whose display shows a citation printed as its key, across TeX's cut at the log's width", () => {
  // `[` ends one 79-character line and `[]]` begins the next.
  const first = `\\TU/LatinModernRoman(0)/m/n/10 neighbours.\\OML/lmm/m/it/10 a[]$ ${'x'.repeat(14)}[`;
  assert.equal(first.length, 79);
  const reading = readLog(
    [
      'Overfull \\hbox (82.27167pt too wide) in paragraph at lines 183--183',
      first,
      '[]][] [[]]',
      '',
      'Overfull \\hbox (12.5pt too wide) in paragraph at lines 190--190',
      '\\OML/lmm/m/it/10 M$\\TU/LatinModernRoman(0)/m/n/10 [[]1[]] [[]2[]]',
      '',
      'Overfull \\hbox (1.5pt too wide) in paragraph at lines 195--195',
      '[]\\TU/LatinModernRoman(0)/m/n/10 plain',
      '',
      '[[]]',
      '',
    ].join('\n'),
  );
  assert.deepEqual(
    reading.boxes.map((b) => b.unresolvedCite === true),
    [true, false, false],
  );
});

test('an hbox overfull while \\output is active keeps its display and the last line named before it', () => {
  const reading = readLog(['LaTeX Font Info: x on input line 25.', 'Overfull \\hbox (708.4pt too wide) has occurred while \\output is active', '\\TU/lmr/m/n/10 4 CHAPTER 1.  BOLD IT', 'ALIC []', '', '[1]'].join('\n'), '');
  assert.equal(reading.boxes[0]?.lastNamed, 25);
  assert.equal(reading.boxes[0]?.display, '\\TU/lmr/m/n/10 4 CHAPTER 1.  BOLD ITALIC []');
});

test("readLog joins a message the log cut short of its width, as ZeroTeX's log does", () => {
  const reading = readLog(
    [
      '! LaTeX Error: Command \\proof already def',
      'ined.',
      '               Or name \\end... illegal, see p.192 of the manual.',
      '',
      'See the LaTeX manual or LaTeX Companion for explanation.',
      '! Argument of \\subparagraph has an e',
      'xtra }.',
      '<inserted text> ',
      'l.1635 \\ttl@extract\\subparagraph',
      'Class memoir Warning: The titlesec package is not recommended with memoir. on ',
      'input line 2.',
      '(/texmf/tex/latex/titlesec/ttlkeys.sty',
    ].join('\n'),
  );
  assert.deepEqual(
    reading.errors.map((e) => [e.message, e.line]),
    [
      ['LaTeX Error: Command \\proof already defined. Or name \\end... illegal, see p.192 of the manual.', undefined],
      ['Argument of \\subparagraph has an extra }.', 1635],
    ],
  );
  assert.deepEqual(reading.warnings, ['Class memoir Warning: The titlesec package is not recommended with memoir. on input line 2.']);
});

test('shapeOf takes numbers and quoted names out, so the same message groups', () => {
  assert.equal(
    shapeOf("LaTeX Warning: Reference `thm:x' on page 12 undefined on input line 40."),
    "LaTeX Warning: Reference `…' on page # undefined on input line #.",
  );
});
