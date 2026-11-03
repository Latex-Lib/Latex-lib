/**
 * Every way of every node (ARCHITECTURE.md 9.1): each preset's LaTeX on a
 * sample of its node fixed by snapshot, and every package a handler prints
 * declared in its key's loads, so the resolver sees what the handler loads.
 *
 * The snapshot is written when missing; `UPDATE_SNAPSHOTS=1 npm test` writes
 * it again after a deliberate change.
 */
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { before, test } from 'node:test';
import { pathToFileURL } from 'node:url';

import { loadLibrary } from '../library.ts';
import { CELL, ESCAPE_CLOSE, ESCAPE_OPEN, ROW } from '../nodes/protocol.ts';
import type { HandlerKey } from '../schema/key.ts';
import type { Realization, Subject } from '../schema/realization.ts';

type Sample = { readonly node: Subject; readonly content: string; readonly context?: string };
const cell = (type: string, text: string, attrs: Record<string, unknown> = {}): Subject => ({ type, attrs, content: [{ type: 'paragraph', content: [{ type: 'text', text }] }] });

/** One sample of each node, with the content its children emit and its caption. */
const SAMPLES: { readonly [node: string]: Sample } = {
  'paragraph/heading': { node: { type: 'paragraph', attrs: { data: { sectionLevel: 'subsection', label: 'sec:intro', shortTitle: 'Intro' } } }, content: 'Introduction' },
  'paragraph/title': { node: { type: 'paragraph', attrs: { data: { author: ['Ada Lovelace', 'Alan Turing'], dateText: '1843' } } }, content: 'On Engines' },
  'containerBlock/abstract': { node: { type: 'containerBlock', attrs: { data: {} } }, content: 'We study engines.' },
  'containerBlock/listing': { node: { type: 'containerBlock', attrs: { data: { latexStyle: 'enumerate' } } }, content: '\\1 First\n\\2 Nested\n\\1[{Term}] Second\n' },
  'paragraph/lstParagraph': { node: { type: 'paragraph', attrs: { indent: 1, data: { description: 'Term' } } }, content: 'An item' },
  'containerBlock/note': { node: { type: 'containerBlock', attrs: { data: { title: 'Tip', tone: 'tip' } } }, content: 'Keep it short.' },
  'containerBlock/columns': { node: { type: 'containerBlock', attrs: { data: { count: 2, gap: 2 } } }, content: 'Left text.\n\nRight text.' },
  'containerBlock/blockMath': { node: { type: 'containerBlock', attrs: { data: { latexStyle: 'equation', label: 'eq:sum' } } }, content: 'a &= b + c\n\nd &= e' },
  'paragraph/mathPara': { node: { type: 'paragraph', attrs: { data: { latexStyle: 'split', label: 'eq:one' } } }, content: 'x = y' },
  'inlineMath/inlineMath': { node: { type: 'inlineMath', attrs: { label: '' } }, content: 'x^2' },
  'code/code': { node: { type: 'code', attrs: { data: { language: 'python', label: 'lst:hello' } } }, content: `print("hi")  # ${ESCAPE_OPEN}\\textbf{x}${ESCAPE_CLOSE}\n`, context: 'Hello' },
  'codeEscape/codeEscape': { node: { type: 'codeEscape' }, content: '\\textbf{x}' },
  table: {
    node: {
      type: 'table',
      attrs: { data: { label: 'tab:one' } },
      content: [
        { type: 'table_row', content: [cell('table_header', 'A'), cell('table_header', 'B')] },
        { type: 'table_row', content: [cell('table_cell', 'both', { colspan: 2 })] },
      ],
    },
    content: `{\\bfseries A}${CELL}{\\bfseries B}${CELL}${ROW}both${CELL}${ROW}`,
    context: 'Results',
  },
  table_row: { node: { type: 'table_row' }, content: `a${CELL}b${CELL}` },
  table_cell: { node: { type: 'table_cell', attrs: { rowspan: 2, background: '#FFEEAA' } }, content: 'tall' },
  table_header: { node: { type: 'table_header', attrs: {} }, content: 'Head' },
  'atomicBlock/image': { node: { type: 'atomicBlock', attrs: { data: { imagePath: 'figures/plot.png', width: 0.6, label: 'fig:plot' } } }, content: '', context: 'A plot' },
  'atomicBlock/tableContents': { node: { type: 'atomicBlock', attrs: { data: {} } }, content: '' },
  'atomicBlock/pageBreak': { node: { type: 'atomicBlock', attrs: {} }, content: '' },
  'containerBlock/appendix': { node: { type: 'containerBlock', attrs: { data: { title: 'Proofs', label: 'app:proofs' } } }, content: 'The proof.' },
  'containerBlock/acknowledgement': { node: { type: 'containerBlock', attrs: { data: {} } }, content: 'We thank the reviewers.' },
  'containerBlock/refContainer': {
    node: { type: 'containerBlock', attrs: { data: { referenceStyling: 'authoryear' } } },
    content: '@book{knuth84,\n  author = {Donald Knuth},\n  title = {The TeXbook},\n  year = {1984}\n}',
  },
  'paragraph/refPara': { node: { type: 'paragraph' }, content: '@misc{a, title = {A}}' },
  'cite/cite': { node: { type: 'cite', content: [{ type: 'text', text: 'knuth84' }] }, content: '' },
  'ref/ref': { node: { type: 'ref', attrs: { refName: 'Figure' }, content: [{ type: 'text', text: 'fig:plot' }] }, content: '' },
  'hyperlink/hyperlink': { node: { type: 'hyperlink', attrs: { href: 'https://ctan.org/pkg/hyperref#top' } }, content: 'hyperref' },
  'footnoteAnchor/footnoteAnchor': { node: { type: 'footnoteAnchor' }, content: '' },
  'customLatex/customLatex': { node: { type: 'customLatex', attrs: { preamble: '\\newcommand{\\R}{\\mathbb{R}}' } }, content: '$\\R$' },
  'containerBlock/customLatex': { node: { type: 'containerBlock', attrs: { data: { preamble: '\\usepackage{tikz}' } } }, content: '\\tikz\\draw (0,0) -- (1,1);' },
  'paragraph/customLatexPara': { node: { type: 'paragraph' }, content: '\\vspace{1em}' },
  'paragraph/paragraph': { node: { type: 'paragraph', attrs: { indent: 1 } }, content: 'Some text.' },
  'containerBlock/mathElement': { node: { type: 'containerBlock', attrs: { data: { elementName: 'lemma', label: 'lem:a' } } }, content: 'A statement.', context: 'Note' },
};

let keys: readonly HandlerKey[] = [];
const handlers = new Map<string, (params?: Record<string, unknown>) => Realization>();
before(async () => {
  const root = join(import.meta.dirname, '..');
  keys = (await loadLibrary(root)).library.keys;
  for (const folder of readdirSync(join(root, 'nodes'))) {
    if (!existsSync(join(root, 'nodes', folder, 'index.ts'))) continue;
    const { HANDLERS } = (await import(pathToFileURL(join(root, 'nodes', folder, 'index.ts')).href)) as { HANDLERS: Record<string, (params?: Record<string, unknown>) => Realization> };
    for (const [way, h] of Object.entries(HANDLERS)) handlers.set(`${folder.replace(/\./gu, '/')} ${way}`, h);
  }
});

const printed = (key: HandlerKey, params: Record<string, unknown>) => {
  const handler = handlers.get(`${key.node} ${key.id}`);
  assert.ok(handler, `${key.node} ${key.id} has no handler in its node's index`);
  const sample = SAMPLES[key.node];
  assert.ok(sample, `no sample of ${key.node}`);
  const r = handler(params);
  const pre = r.preamble({}, 'doc', sample.node, sample.content);
  return { ...pre, body: r.emit(sample.node, sample.content, sample.context, 'doc') };
};

test('every node of Flouest has at least one way, and every way a handler', () => {
  const nodes = new Set(keys.map((k) => k.node));
  assert.equal(nodes.size, Object.keys(SAMPLES).length, `nodes with ways: ${[...nodes].sort().join(', ')}`);
  for (const key of keys) assert.ok(handlers.has(`${key.node} ${key.id}`), `${key.node} ${key.id}`);
});

test("every package a handler prints is in its key's loads", () => {
  for (const key of keys) {
    for (const [name, preset] of Object.entries(key.presets)) {
      const out = printed(key, preset.params);
      for (const line of out.packages ?? []) {
        const pkg = /\\usepackage(?:\[[^\]]*\])?\{([^}]+)\}/u.exec(line)?.[1];
        assert.ok(pkg !== undefined && key.loads.some((l) => l.pkg === pkg), `${key.node} ${key.id} (${name}) prints ${line}, not in its loads`);
      }
    }
  }
});

test('every preset of every way prints what its snapshot holds', () => {
  const snapshots: Record<string, unknown> = {};
  for (const key of [...keys].sort((a, b) => `${a.node} ${a.id}`.localeCompare(`${b.node} ${b.id}`))) {
    for (const [name, preset] of Object.entries(key.presets)) snapshots[`${key.node} ${key.id} ${name}`] = printed(key, preset.params);
  }
  const dir = join(import.meta.dirname, 'snapshots');
  const file = join(dir, 'ways.json');
  const text = `${JSON.stringify(snapshots, null, 2)}\n`;
  if (!existsSync(file) || process.env['UPDATE_SNAPSHOTS'] === '1') {
    mkdirSync(dir, { recursive: true });
    writeFileSync(file, text);
  }
  assert.equal(text, readFileSync(file, 'utf8'), 'a handler prints something new: check it, then UPDATE_SNAPSHOTS=1 npm test');
});
