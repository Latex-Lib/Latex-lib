/**
 * A sample of every node, with the content its children emit (in Flouest's
 * emitter protocol: list items as `\\<level>`, table cells and rows by
 * their separators, code escapes by theirs) and its caption: what a handler
 * prints for the snapshot of every preset (`test/ways.test.ts`), and what the
 * AI layer's studio prints a template's sample document from.
 *
 * And the handlers themselves, by node and way, from each node's index.
 */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { CELL, ESCAPE_CLOSE, ESCAPE_OPEN, ROW } from './nodes/protocol.ts';
import type { Realization, Subject } from './schema/realization.ts';

export type Sample = { readonly node: Subject; readonly content: string; readonly context?: string };
const cell = (type: string, text: string, attrs: Record<string, unknown> = {}): Subject => ({ type, attrs, content: [{ type: 'paragraph', content: [{ type: 'text', text }] }] });

/** One sample of each node, with the content its children emit and its caption. */
export const SAMPLES: { readonly [node: string]: Sample } = {
  'paragraph/heading': { node: { type: 'paragraph', attrs: { data: { sectionLevel: 'subsection', label: 'sec:intro', shortTitle: 'Intro' } } }, content: 'Introduction' },
  'paragraph/title': {
    node: {
      type: 'paragraph',
      attrs: {
        data: {
          author: [
            { name: 'Ada Lovelace', email: 'ada@example.org', orcid: '0000-0002-1825-0097', associatedAffiliations: ['a1'] },
            { name: 'Alan Turing', email: 'alan@example.org', orcid: '', associatedAffiliations: ['a1', 'a2'] },
          ],
          affiliation: [
            { id: 'a1', name: 'Analytical Society', department: 'Department of Engines', address: 'London, UK' },
            { id: 'a2', name: 'Bletchley Park', department: '', address: 'Milton Keynes, UK' },
          ],
          templateSpecific: { template: 'general', shortTitle: 'Engines', keywords: 'engines, computing', correspondingAuthor: 'ada@example.org', runningAuthor: 'Lovelace and Turing' },
          dateText: '1843',
        },
      },
    },
    content: 'On Engines',
  },
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
  // The document level (`DOC_NODE`): no node; a document-level way prints its preamble and, at most, a line at the start of the body.
  doc: { node: { type: 'doc' }, content: '' },
  'containerBlock/mathElement': { node: { type: 'containerBlock', attrs: { data: { elementName: 'lemma', label: 'lem:a' } } }, content: 'A statement.', context: 'Note' },
};

/** A handler: its parameters to the realization that prints its node. */
export type Handler = (params?: Record<string, unknown>) => Realization;

/** Every handler in `root`'s nodes, by `<node> <way>` (`containerBlock/mathElement thm.amsthm`). */
export const loadHandlers = async (root: string): Promise<Map<string, Handler>> => {
  const handlers = new Map<string, Handler>();
  for (const folder of readdirSync(join(root, 'nodes')).sort()) {
    if (!existsSync(join(root, 'nodes', folder, 'index.ts'))) continue;
    const { HANDLERS } = (await import(pathToFileURL(join(root, 'nodes', folder, 'index.ts')).href)) as { HANDLERS: Record<string, Handler> };
    for (const [way, h] of Object.entries(HANDLERS)) handlers.set(`${folder.replace(/\./gu, '/')} ${way}`, h);
  }
  return handlers;
};
