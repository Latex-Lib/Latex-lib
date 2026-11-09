/**
 * A minimal key (ARCHITECTURE.md section 3): what a way prints and loads, its
 * one default preset, the CTAN page it comes from, what it needs of the class
 * (`requires`), and the class rules a document or a measurement gives; parent
 * rules come with the matrix and the explainer. The key stays a draft.
 */
import type { Evidence, Support } from './evidence.ts';
import type { Feature } from './features.ts';
import type { ClassId, NodeId, WayId } from './ids.ts';
import type { ClassRule, Definition, HandlerKey, OrderRule, PackageLoad, PackageRule, Requirement } from './key.ts';
import type { ParamPredicate, ParamSchema, Preset } from './params.ts';
import type { ContextChange, ContextNeed } from '../contexts.ts';
import type { Exclusive } from './features.ts';

/** A package's CTAN page (`latex-base` for the kernel). */
export const ctan = (pkg: string): Evidence => ({ kind: 'manual', of: pkg, section: 'CTAN package page', url: `https://ctan.org/pkg/${pkg}` });

export type MinimalWay = {
  readonly id: WayId;
  readonly node: NodeId;
  readonly writes?: string;
  readonly description: string;
  /** The CTAN packages it is documented in, for its evidence. */
  readonly ctan: readonly string[];
  readonly features?: readonly Feature[];
  readonly params?: ParamSchema;
  /** The title's fields it prints (`HandlerKey.fields`). */
  readonly fields?: readonly string[];
  readonly presets?: { readonly [name: string]: Preset };
  readonly loads?: readonly PackageLoad[];
  readonly defines?: readonly Definition[];
  readonly claims?: readonly Exclusive[];
  readonly requires?: readonly Requirement[];
  readonly requiresWhen?: HandlerKey['requiresWhen'];
  readonly only?: readonly ClassId[];
  /** As `only`, for the presets whose params match a rule's `when` (a form only some classes give). */
  readonly onlyWhen?: HandlerKey['classes']['onlyWhen'];
  /** Classes it must not be used under, each with its reason and evidence. */
  readonly deny?: readonly ClassRule[];
  /** It works only on a one-column page, with the reason and evidence. */
  readonly oneColumn?: HandlerKey['classes']['oneColumn'];
  readonly conflicts?: readonly PackageRule[];
  readonly loadOrder?: readonly OrderRule[];
  readonly gives?: ContextChange;
  /** What it gives below only when its parameters match (a box that does not break: `breakable: false`). */
  readonly givesWhen?: readonly { readonly when: ParamPredicate; readonly gives: ContextChange }[];
  readonly needs?: ContextNeed;
  /** What it needs besides, only when its parameters match (an image in a figure float: `float: true`). */
  readonly needsWhen?: HandlerKey['context']['needsWhen'];
  readonly targetEngine?: Support;
};

export const minimal = (w: MinimalWay): HandlerKey => {
  const evidence = w.ctan.map(ctan);
  return {
    id: w.id,
    node: w.node,
    description: w.description,
    ...(w.writes === undefined ? {} : { writes: w.writes }),
    features: w.features ?? [],
    params: w.params ?? {},
    ...(w.fields === undefined ? {} : { fields: w.fields }),
    presets: w.presets ?? { default: { description: w.description.split('.')[0] ?? w.description, features: w.features ?? [], params: {}, evidence } },
    targetEngine: w.targetEngine ?? 'untested',
    loads: w.loads ?? [],
    defines: w.defines ?? [],
    claims: w.claims ?? [],
    requires: w.requires ?? [],
    ...(w.requiresWhen === undefined ? {} : { requiresWhen: w.requiresWhen }),
    classes: { deny: w.deny ?? [], ...(w.only === undefined ? {} : { only: w.only }), ...(w.onlyWhen === undefined ? {} : { onlyWhen: w.onlyWhen }), ...(w.oneColumn === undefined ? {} : { oneColumn: w.oneColumn }) },
    packages: { conflicts: w.conflicts ?? [], ...(w.loadOrder === undefined ? {} : { loadOrder: w.loadOrder }) },
    context: { gives: w.gives ?? {}, ...(w.givesWhen === undefined ? {} : { givesWhen: w.givesWhen }), needs: w.needs ?? {}, ...(w.needsWhen === undefined ? {} : { needsWhen: w.needsWhen }) },
    parents: {},
    evidence,
    status: 'draft',
  };
};
