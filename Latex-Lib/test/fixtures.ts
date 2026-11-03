/**
 * A small library for the tests: two theorem ways, a footnote way and a table
 * cell way, two classes, three packages, over a nesting list cut down from
 * Flouest's.
 */
import type { Nesting } from '../nesting.ts';
import type { ClassProfile, PackageFacts } from '../schema/class.ts';
import type { HandlerKey } from '../schema/key.ts';

export const NESTING: Nesting = {
  nodes: {
    'containerBlock/mathElement': { family: 'container', parents: ['containerBlock/footnote', 'table_cell'] },
    'containerBlock/footnote': { family: 'container', parents: [] },
    table: { family: 'container', parents: [] },
    table_row: { family: 'container', parents: ['table'] },
    table_cell: { family: 'container', parents: ['table_row'] },
    'paragraph/paragraph': { family: 'paragraph', parents: ['containerBlock/mathElement'] },
  },
};

export const package_ = (id: string, options: Record<string, string> = {}, more: Partial<PackageFacts> = {}): PackageFacts => ({
  id,
  description: `${id} for the tests`,
  options,
  exclusive: [],
  loadOrder: [],
  defines: [],
  zerotex: 'yes',
  evidence: [],
  ...more,
});

export const PACKAGES: readonly PackageFacts[] = [
  package_('amsthm'),
  package_('tcolorbox', {}, { libraries: ['theorems', 'skins', 'breakable'] }),
  package_('ntheorem', { amsthm: 'amsthm-compatible syntax', standard: 'standard theorems' }),
];

export const class_ = (id: string, more: Partial<ClassProfile> = {}): ClassProfile => ({
  id,
  name: id.slice('class.'.length),
  zerotex: 'yes',
  preloads: [],
  defines: [],
  options: {},
  forbids: { technical: [], policy: [] },
  layout: null,
  vocabulary: {},
  evidence: [],
  ...more,
});

export const CLASSES: readonly ClassProfile[] = [class_('class.article'), class_('class.llncs', { defines: ['env:theorem'] })];

const solution = { kind: 'solution', file: 'Solution/0001-test.md', lines: '3-4' } as const;

export const key = (id: string, node: string, more: Partial<HandlerKey> = {}): HandlerKey => ({
  id,
  node,
  description: `${id} for the tests`,
  features: [],
  params: {},
  presets: { default: { description: 'the default', features: [], params: {}, evidence: [] } },
  zerotex: 'yes',
  loads: [],
  defines: [],
  claims: [],
  requires: [],
  classes: { deny: [] },
  packages: { conflicts: [] },
  context: { gives: {}, needs: {} },
  parents: {},
  evidence: [solution],
  status: 'draft',
  ...more,
});

export const AMSTHM = key('thm.amsthm', 'containerBlock/mathElement', {
  features: ['numbered', 'bold-head', 'italic-body'],
  params: {
    elementName: { type: 'string', description: 'the environment' },
    style: { type: 'enum', values: ['plain', 'definition', 'remark'], default: 'plain', description: 'amsthm style' },
  },
  presets: { plain: { description: 'bold head, italic body', features: ['bold-head', 'italic-body'], params: { style: 'plain' }, evidence: [solution] } },
  loads: [{ pkg: 'amsthm' }],
  defines: ['env:{elementName}'],
  claims: ['theorem-engine'],
});

export const BOXED = key('thm.tcolorbox', 'containerBlock/mathElement', {
  features: ['framed', 'breakable'],
  params: { breakable: { type: 'boolean', default: true, compat: true, description: 'the box breaks across pages' } },
  presets: { blue: { description: 'a blue breakable box', features: ['framed', 'breakable'], params: { breakable: true }, evidence: [] } },
  loads: [{ pkg: 'tcolorbox', libraries: ['theorems', 'breakable'] }],
  context: { gives: { floats: false, boxDepth: 1 }, givesWhen: [{ when: { breakable: false }, gives: { breakable: false } }], needs: { argument: false } },
  fallback: { way: 'thm.amsthm' },
});

export const FOOTNOTE = key('fn.kernel', 'containerBlock/footnote', { context: { gives: { argument: true, footnotes: false, floats: false }, needs: {} } });
export const CELL = key('cell.kernel', 'table_cell', {
  params: { column: { type: 'enum', values: ['l', 'p'], description: 'the column type' } },
  context: { gives: { breakable: false, floats: false }, givesWhen: [{ when: { column: 'l' }, gives: { paragraph: false } }], needs: {} },
});
