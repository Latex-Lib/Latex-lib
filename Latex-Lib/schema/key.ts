/**
 * The key (ARCHITECTURE.md section 3): one per handler. It keeps the four
 * fields of the original idea (description, document class, packages,
 * nesting) and what the automation needs to pick and verify handlers.
 *
 * A key is data, with no Flouest import, so it can be read, validated, hashed
 * and written into `compat.generated.json` anywhere. The handler beside it
 * (`handler.ts`) is the Flouest `Realization`.
 */
import type { ContextChange, ContextNeed } from '../contexts.ts';
import type { Evidence, Support } from './evidence.ts';
import type { Exclusive, Feature } from './features.ts';
import type { ClassId, Json, NodeId, PackageId, WayId } from './ids.ts';
import type { ParamPredicate, ParamSchema, Preset } from './params.ts';

/** A package line, structured so the preamble merger can union options and order loads (section 6). */
export type PackageLoad = {
  readonly pkg: PackageId;
  readonly options?: readonly string[];
  /** A package's own libraries (`tcolorbox`'s `theorems`, `skins`, `breakable`). */
  readonly libraries?: readonly string[];
  /** Only when the handler's parameters match. */
  readonly when?: ParamPredicate;
};

/**
 * A name the handler creates or needs: `env:theorem`, `counter:lemma`,
 * `cmd:\qedsymbol`. `{param}` stands for a parameter's value
 * (`counter:{numberWithin}`), and `{kind}` for each kind of the node the
 * handler prints (each statement kind, `env:{kind}`). A name whose
 * placeholder comes out empty or `none` asks for nothing.
 */
export type Resource = `${'env' | 'counter' | 'cmd' | 'length' | 'color' | 'style'}:${string}`;

/** A name the handler defines, always or only when its parameters match. */
export type Definition = Resource | { readonly name: Resource; readonly when: ParamPredicate };

/** What another handler or the class must supply: a resource, a claim someone owns, a package loaded. */
export type Requirement = Resource | `claim:${Exclusive}` | `pkg:${PackageId}`;

export type ClassRule = {
  readonly class: ClassId;
  readonly reason: string;
  readonly evidence: readonly Evidence[];
  /** The rule does not hold when the handler's parameters match (a param renames the clashing environment). */
  readonly unless?: ParamPredicate;
};

/**
 * `only` for the presets whose params match `when`: a form of a class-native
 * way that only some classes give (abs.class-native's `\abstract{}` command:
 * aa, mdpi, sn-jnl). A class built on a listed one takes it too, as for
 * `only`, so the list names the class that gives the form, never a base it
 * shares with classes that lack it (sn-jnl, not article).
 */
export type OnlyWhenRule = {
  readonly when: ParamPredicate;
  readonly classes: readonly ClassId[];
  readonly reason: string;
  readonly evidence: readonly Evidence[];
};

export type PackageRule = {
  /** Another way in the document, a package anywhere in it, or General's own ways of a node: exactly one of them. */
  readonly way?: WayId;
  readonly pkg?: PackageId;
  /** General's ways of that node (Flouest's emitter, not a key), whatever packages they load: General's tables, which end an aligned paragraph in a spanning cell with \par. */
  readonly general?: NodeId;
  /** The rule does not hold when that package is loaded with this option (`ntheorem[amsthm]`). */
  readonly unless?: { readonly option: string };
  /** The rule holds only for the presets whose parameters match (list.class-native's cas form against enumitem; its jacow form is over enumitem). */
  readonly when?: ParamPredicate;
  readonly reason: string;
  readonly evidence: readonly Evidence[];
};

export type OrderRule = { readonly after?: PackageId; readonly before?: PackageId; readonly reason: string };

/** A parent way (and parameter combination) a rule speaks of. */
export type ParentWayRule = {
  readonly way: WayId | '*';
  /** A predicate over the parent's params: its column types, its breakable flag. */
  readonly when?: ParamPredicate;
  /** Packages that must also be loaded for the rule to apply. */
  readonly withPackages?: readonly { readonly pkg: PackageId; readonly options?: readonly string[] }[];
  readonly reason: string;
  readonly evidence: readonly Evidence[];
};

/** Allowed only with changed params or emit. */
export type AdaptRule = {
  readonly way: WayId | '*';
  readonly when?: ParamPredicate;
  readonly set: { readonly [name: string]: Json };
  readonly addLoads?: readonly PackageLoad[];
  readonly reason: string;
  readonly evidence: readonly Evidence[];
};

/** One parent's rules for the handler (section 4.3). Precedence: deny > adapt > allow > derived. */
export type ParentEntry = {
  /** `direct`: only when this parent is directly above. `ancestor`: anywhere above. */
  readonly scope: 'direct' | 'ancestor';
  readonly allow?: readonly ParentWayRule[];
  readonly deny?: readonly ParentWayRule[];
  readonly adapt?: readonly AdaptRule[];
  /** What to emit instead when denied and not adaptable. */
  readonly fallback?: { readonly way: WayId; readonly preset?: string; readonly reason: string };
};

/** Per parent node, or `*` for every parent. A parent missing here falls back to the derived verdict. */
export type ParentRules = { readonly [parent: NodeId]: ParentEntry };

export type HandlerKey = {
  /** Way id; also the folder name. */
  readonly id: WayId;
  readonly node: NodeId;

  // What it achieves.
  /** Free text, for people and for an AI choosing between handlers. */
  readonly description: string;
  /** The LaTeX it writes, in one line: its commands and environments as a skeleton, content as … (`\\begin{split} … \\end{split} \\label{…}`). What a template's own LaTeX is held to (Ai's `latex` key field). */
  readonly writes?: string;
  readonly features: readonly Feature[];
  /** Typed from the Flouest `Packages/` printer the handler calls. */
  readonly params: ParamSchema;
  /**
   * The title's fields it prints besides the title and the authors' names: `author.email`, `author.orcid`,
   * `affiliation.name`, `affiliation.department`, `affiliation.address`, `templateSpecific.<field>` (keywords, a
   * short title, the corresponding author). A Flouest template made with it declares them, so a paper can fill them in.
   */
  readonly fields?: readonly string[];
  /** Many styling descriptions to this one handler. */
  readonly presets: { readonly [name: string]: Preset };

  // The engine.
  /**
   * Whether it runs in the target engine, the only engine the library is for: XeTeX in
   * the browser, with no shell escape, no Ghostscript, no minted or pythontex.
   * Other engines are not a question the library asks.
   */
  readonly targetEngine: Support;

  // What it puts in the document.
  readonly loads: readonly PackageLoad[];
  readonly defines: readonly Definition[];
  readonly claims: readonly Exclusive[];
  readonly requires: readonly Requirement[];
  /** What it requires besides, only when its parameters match (the class's abstract environment, or its \abstract command). */
  readonly requiresWhen?: readonly { readonly when: ParamPredicate; readonly requires: readonly Requirement[] }[];

  // Document class.
  readonly classes: {
    /** Default: allowed under any class whose profile passes the resource checks. */
    readonly deny: readonly ClassRule[];
    /** Only for class-native handlers: the classes it can be used with. */
    readonly only?: readonly ClassId[];
    /** As `only`, for the presets whose params match a rule's `when`. */
    readonly onlyWhen?: readonly OnlyWhenRule[];
    /** It works only on a one-column page: not under a two-column class, nor with the `twocolumn` option. */
    readonly oneColumn?: { readonly reason: string; readonly evidence: readonly Evidence[] };
  };

  // Packages across the document.
  readonly packages: {
    readonly conflicts: readonly PackageRule[];
    readonly loadOrder?: readonly OrderRule[];
  };

  // Nesting (section 4).
  readonly context: {
    /** What its body allows its children. */
    readonly gives: ContextChange;
    readonly givesWhen?: readonly { readonly when: ParamPredicate; readonly gives: ContextChange }[];
    /** What it needs where it sits. */
    readonly needs: ContextNeed;
    /** What it needs besides, only when its parameters match (an image in a figure float: `float: true`). */
    readonly needsWhen?: readonly { readonly when: ParamPredicate; readonly needs: ContextNeed }[];
  };
  readonly parents: ParentRules;
  /** What to emit when a parent denies this handler. */
  readonly fallback?: { readonly way: WayId; readonly preset?: string };

  // Provenance.
  readonly evidence: readonly Evidence[];
  readonly status: 'draft' | 'verified';
};

/** Types a key file's export; returns it unchanged. */
export const defineKey = <const K extends HandlerKey>(key: K): K => key;
