/**
 * A host small enough to read: six nodes, one whole-chain rule, and LaTeX made
 * of one environment per node, named after its way. Core's tests run against
 * it with no Flouest and no TeX.
 *
 * Its variants are the plain product a host with no editor would give: each
 * way × the values of its presets' compat params × the node's true/false
 * settings, and as members every value of the other settings × the presets
 * that match.
 */
import { canonical } from '../src/hash.ts';
import type {
  BranchSpec,
  DocumentRules,
  Emitted,
  HostVariant,
  Json,
  NestingNode,
  NestingTree,
  NodeId,
  Way,
} from '../src/model.ts';
import type { BuildProbes, EmitUnder, Host } from '../src/ports.ts';

/** Which node may hold which, before the whole-chain rule. `''` is the document. */
const CHILDREN: Readonly<Record<string, readonly NodeId[]>> = {
  '': ['section', 'theorem', 'list'],
  section: ['theorem', 'list', 'para'],
  theorem: ['list', 'para', 'footnote'],
  list: ['theorem', 'para'],
  footnote: ['para', 'theorem'],
  para: [],
};

/**
 * Judged against every node above, not only the parent: no footnote anywhere
 * inside a list. This is the shape of Flouest refusing a note in a mathElement
 * in a table cell, though each layer alone is legal.
 */
const legal = (ancestors: readonly NodeId[], node: NodeId): boolean =>
  !(node === 'footnote' && ancestors.includes('list'));

/** A node's setting: its values, and whether it splits variants (a true/false one) or rotates through members. */
type Setting = { readonly name: string; readonly values: readonly Json[]; readonly split: boolean };

const SETTINGS: Readonly<Record<string, readonly Setting[]>> = {
  theorem: [
    { name: 'numbered', values: [true, false], split: true },
    { name: 'title', values: ['', 'Main result'], split: false },
  ],
  list: [{ name: 'style', values: ['bullet', 'number'], split: false }],
};

const product = <T>(lists: readonly (readonly T[])[]): T[][] =>
  lists.reduce<T[][]>((prefixes, list) => prefixes.flatMap((prefix) => list.map((item) => [...prefix, item])), [[]]);

const pick = (params: { readonly [name: string]: Json }, names: readonly string[]): { [name: string]: Json } =>
  Object.fromEntries(names.filter((name) => name in params).map((name) => [name, params[name] ?? null]));

export type FakePart = { readonly branch: BranchSpec; readonly sentinels: readonly string[]; readonly marked: boolean };
export type FakeDoc = { readonly parts: readonly FakePart[] };

export class FakeHost implements Host<FakeDoc> {
  readonly id = 'fake';
  readonly rules: DocumentRules;

  constructor(rules: DocumentRules = { version: 'fake-1', alone: [], last: [] }) {
    this.rules = rules;
  }

  fingerprint(): string {
    return 'fake-host-1';
  }

  nesting(depth: number): NestingTree {
    const below = (ancestors: readonly NodeId[], level: number): NestingNode[] =>
      (CHILDREN[ancestors.at(-1) ?? ''] ?? [])
        .filter((node) => legal(ancestors, node))
        .map((node) => ({ node, children: level < depth ? below([...ancestors, node], level + 1) : [] }));
    return { depth, roots: below([], 0) };
  }

  variants(node: NodeId, ways: readonly Way[]): HostVariant[] {
    const settings = SETTINGS[node] ?? [];
    const flagSets = product(settings.filter((s) => s.split).map((s) => s.values.map((value) => [s.name, value] as const)));
    const rotating = product(settings.filter((s) => !s.split).map((s) => s.values.map((value) => [s.name, value] as const)));
    return ways.flatMap((way) => {
      const compatSets = [...new Map(way.presets.map((p) => pick(p.params, way.compat)).map((c) => [canonical(c), c])).values()];
      return compatSets.flatMap((compat) => {
        const presets = way.presets.filter((p) => canonical(pick(p.params, way.compat)) === canonical(compat));
        return flagSets.map((flags) => {
          const members = rotating.flatMap((values) =>
            presets.map((preset) => ({ values: { ...Object.fromEntries(values), ...Object.fromEntries(flags), preset: preset.id } })),
          );
          return { variant: { way: way.id, compat, flags: Object.fromEntries(flags) }, members, cover: members.length };
        });
      });
    });
  }

  build(branch: BranchSpec, probes: BuildProbes): FakeDoc {
    const sentinels = branch.path.map((_, i) => probes.sentinel(`${branch.id}.${i}`));
    return { parts: [{ branch, sentinels, marked: probes.marked }] };
  }

  documentRules(): DocumentRules {
    return this.rules;
  }

  /** A branch with a footnote needs its document to number notes: the shape of a citation needing a bibliography. */
  requires(branch: BranchSpec): readonly string[] {
    return branch.path.some((step) => step.node === 'footnote') ? ['notes'] : [];
  }

  pack(parts: readonly FakeDoc[]): FakeDoc {
    return { parts: parts.flatMap((part) => part.parts) };
  }

  emit(doc: FakeDoc, { classSetting, setup, preamble }: EmitUnder): Emitted {
    const options = [...classSetting.options.filter((o) => !setup.removeOptions.includes(o)), ...setup.addOptions];
    const lines = [
      `\\documentclass${options.length > 0 ? `[${options.join(',')}]` : ''}{${classSetting.class}}`,
      ...classSetting.preamble,
      ...setup.preamble,
      ...preamble,
      '\\begin{document}',
    ];
    const spans: { branch: string; from: number; to: number }[] = [];
    for (const part of doc.parts) {
      const from = lines.length + 1;
      part.branch.path.forEach((step, i) => lines.push(`\\begin{${step.variant.way}}`, part.sentinels[i] ?? ''));
      lines.push(part.marked ? 'Text with \\textbf{marked} runs.' : 'Text with escapes: \\% \\& \\#.');
      [...part.branch.path].reverse().forEach((step) => lines.push(`\\end{${step.variant.way}}`));
      spans.push({ branch: part.branch.id, from, to: lines.length });
    }
    lines.push('\\end{document}');
    return { latex: `${lines.join('\n')}\n`, spans, files: [] };
  }
}
