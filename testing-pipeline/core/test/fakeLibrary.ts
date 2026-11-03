/**
 * A library of six ways over the fake host's nodes: two for the theorem, one
 * for everything else, and `FRAMED`, the way a test adds to show that nothing
 * old changes.
 */
import { hashJson } from '../src/hash.ts';
import type { CompatTable, NodeId, Way, WayId } from '../src/model.ts';
import type { Library } from '../src/ports.ts';

const kernel = (id: WayId, node: NodeId): Way => ({
  id,
  node,
  presets: [{ id: 'default', params: {} }],
  compat: [],
  loads: [],
  defines: [],
});

export const DEFAULT_WAYS: readonly Way[] = [
  kernel('sec.kernel', 'section'),
  {
    id: 'thm.plain',
    node: 'theorem',
    presets: [
      { id: 'italic', params: { font: 'italic' } },
      { id: 'upright', params: { font: 'upright' } },
    ],
    compat: [],
    loads: ['amsthm'],
    defines: ['env:theorem'],
  },
  {
    id: 'thm.boxed',
    node: 'theorem',
    presets: [
      { id: 'blue', params: { breakable: true, colour: 'blue' } },
      { id: 'red', params: { breakable: false, colour: 'red' } },
    ],
    compat: ['breakable'],
    loads: ['amsthm', 'tcolorbox'],
    defines: ['env:theorem'],
  },
  kernel('list.kernel', 'list'),
  kernel('fn.kernel', 'footnote'),
  kernel('para.kernel', 'para'),
];

export const FRAMED: Way = {
  id: 'thm.framed',
  node: 'theorem',
  presets: [{ id: 'grey', params: { breakable: true, rule: '1pt' } }],
  compat: ['breakable'],
  loads: ['amsthm', 'mdframed'],
  defines: ['env:theorem'],
};

export class FakeLibrary implements Library {
  readonly #ways: readonly Way[];
  /** Every table written, in order. */
  readonly written: CompatTable[] = [];

  constructor(ways: readonly Way[] = DEFAULT_WAYS) {
    this.#ways = ways;
  }

  /** This library with one more way. */
  with(way: Way): FakeLibrary {
    return new FakeLibrary([...this.#ways, way]);
  }

  nodes(): readonly NodeId[] {
    return [...new Set(this.#ways.map((way) => way.node))];
  }

  ways(node: NodeId): readonly Way[] {
    return this.#ways.filter((way) => way.node === node);
  }

  fingerprint(id: WayId): string {
    const way = this.#ways.find((w) => w.id === id);
    if (way === undefined) throw new Error(`FakeLibrary: no way ${id}`);
    return hashJson(way);
  }

  writeCompat(table: CompatTable): void {
    this.written.push(table);
  }
}
