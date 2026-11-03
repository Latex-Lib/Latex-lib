/**
 * What the tests share: class settings, the setups, the plan of the fake host
 * under a library, and the cells of documents, each with its LaTeX and what
 * the oracle should expect of it (core's own `plan.ts`, `file.ts` and
 * `cells.ts`).
 */
import type { BranchSpec, ClassSetting, FiledDocument, Setup } from '../src/model.ts';
import { packBranches } from '../src/file.ts';
import { planBranches } from '../src/plan.ts';
import type { Host, Library } from '../src/ports.ts';
import { documentCells, type JudgedJob } from '../src/cells.ts';

export const ARTICLE: ClassSetting = { id: 'article', class: 'article', options: [], preamble: [], files: [] };
export const AMSART: ClassSetting = { id: 'amsart', class: 'amsart', options: [], preamble: [], files: [] };
export const MANUSCRIPT: ClassSetting = { id: 'acmart-manuscript', class: 'acmart', options: ['manuscript'], preamble: [], files: [] };

export const SETUP_A: Setup = { id: 'A', description: 'default', addOptions: [], removeOptions: [], preamble: [] };
export const SETUP_B: Setup = {
  id: 'B',
  description: 'the other column mode',
  addOptions: ['twocolumn'],
  removeOptions: ['onecolumn'],
  preamble: [],
};

/** A plain sentinel, for tests that build documents without recording what they placed. */
export const sentinel = (id: string): string => `\\compatSentinel{${id}}`;

/** The host's plan under the library, to `depth`. */
export const planOf = (host: Host, library: Library, depth: number) =>
  planBranches(host.nesting(depth), (node) => host.variants(node, library.ways(node)));

/** Branches filed `size` to a document under the host's rules, as `file.ts` packs new branches. */
export const packed = (host: Host, branches: readonly BranchSpec[], size: number): FiledDocument[] =>
  packBranches(branches, host.documentRules(), size, (branch) => host.requires(branch));

/** Every cell of `documents` under each class setting and each setup that applies to it. */
export const cellsOf = <D, P>(host: Host<D, P>, documents: readonly FiledDocument[], classSettings: readonly ClassSetting[], setups: readonly Setup[]): JudgedJob[] =>
  documents.flatMap((document) => documentCells(host, document, classSettings, setups));
