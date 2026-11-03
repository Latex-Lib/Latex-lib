import assert from 'node:assert/strict';
import { test } from 'node:test';

import { LOG_WIDTH } from '../src/log.ts';
import { inTextBlock, readSentinels, recordingProbes, SENTINEL_PREAMBLE, sentinelCall } from '../src/sentinels.ts';

const PT = 65536;
const GEOMETRY_LOG = [
  'COMPAT-GEOMETRY{paperWidth}{614.295pt}',
  'COMPAT-GEOMETRY{paperHeight}{794.96999pt}',
  'COMPAT-GEOMETRY{oddLeft}{134.26999pt}',
  'COMPAT-GEOMETRY{evenLeft}{134.26999pt}',
  'COMPAT-GEOMETRY{textWidth}{345.0pt}',
  'COMPAT-GEOMETRY{textTop}{686.97pt}',
  'COMPAT-GEOMETRY{textHeight}{550.0pt}',
].join('\n');

test('the preamble defines the sentinel and writes the text block once the document begins', () => {
  const preamble = SENTINEL_PREAMBLE.join('\n');
  assert.match(preamble, /\\protected\\def\\compatSentinel#1\{/);
  assert.match(preamble, /\\pdfsavepos\\fi\\write-1\{COMPAT-SENTINEL\{#1\}\{\\the\\c@page\}/);
  assert.match(preamble, /\\AddToHook\{begindocument\/end\}/);
  assert.match(preamble, /\\ifdim\\pdfpageheight=0pt \\global\\pdfpageheight=\\paperheight\\fi/, 'positions measured against the paper');
  assert.equal((preamble.match(/COMPAT-GEOMETRY/g) ?? []).length, 7);
});

test('a sentinel id passes through TeX unchanged, or is refused', () => {
  assert.equal(sentinelCall('b0123.4'), '\\compatSentinel{b0123.4}');
  for (const id of ['', 'a b', 'a}b', 'a\\b', '#1', '.lead']) assert.throws(() => sentinelCall(id), /sentinel id/);
});

test('recording probes give the LaTeX and remember what the host placed', () => {
  const { probes, placed } = recordingProbes(false);
  assert.equal(probes.marked, false);
  assert.equal(probes.sentinel('n.1', { role: 'footnote:mark' }), '\\compatSentinel{n.1}');
  probes.sentinel('n.2', { outside: true });
  assert.deepEqual(placed, [{ id: 'n.1', role: 'footnote:mark' }, { id: 'n.2', outside: true }]);
});

test('the log gives each sentinel its pages and positions, and the text block in sp', () => {
  const long = `COMPAT-SENTINEL{${'b'.repeat(40)}}{3}{12345678}{`;
  const log = [
    'This is XeTeX',
    GEOMETRY_LOG,
    'COMPAT-SENTINEL{a.0}{1}{9437184}{39321600}',
    'COMPAT-SENTINEL{a.0}{2}{9437184}{39321600}',
    'COMPAT-SENTINEL{c.0}{1}{}{}',
    long + '9'.repeat(LOG_WIDTH - long.length),
    '87654}',
  ].join('\n');
  const { hits, geometry } = readSentinels(log);
  assert.deepEqual(hits.get('a.0'), [
    { page: 1, x: 9437184, y: 39321600 },
    { page: 2, x: 9437184, y: 39321600 },
  ]);
  assert.deepEqual(hits.get('c.0'), [{ page: 1, x: null, y: null }]);
  assert.equal(hits.get('b'.repeat(40))?.[0]?.page, 3, 'a line cut at the log width is joined');
  assert.equal(geometry?.textWidth, 345 * PT);
  assert.equal(geometry?.oddLeft, Math.round(134.26999 * PT));
  assert.equal(readSentinels('COMPAT-GEOMETRY{paperWidth}{1pt}').geometry, undefined, 'a partial text block is none');
});

test('a hit is in the text block within the tolerances, on either side of a two-sided layout', () => {
  const g = { paperWidth: 600 * PT, paperHeight: 800 * PT, oddLeft: 100 * PT, evenLeft: 80 * PT, textWidth: 400 * PT, textTop: 700 * PT, textHeight: 600 * PT };
  const at = (x: number, y: number) => ({ page: 1, x: x * PT, y: y * PT });
  const h = 10 * PT;
  const v = 4 * PT;
  assert.equal(inTextBlock(at(300, 400), g, h, v), true);
  assert.equal(inTextBlock(at(85, 400), g, h, v), true, 'inside the even page block');
  assert.equal(inTextBlock(at(509, 400), g, h, v), true, 'within tolerance of the right edge');
  assert.equal(inTextBlock(at(530, 400), g, h, v), false, 'into the right margin');
  assert.equal(inTextBlock(at(300, 90), g, h, v), false, 'below the block');
  assert.equal(inTextBlock({ page: 1, x: null, y: null }, g, h, v), true, 'no position, nothing to judge');
});
