/**
 * Class profiles and package facts (ARCHITECTURE.md sections 1 and 5).
 *
 * In a class profile, `zerotex`, `preloads`, `defines`, `layout` and
 * `forbids.technical` are measured by the class probe (the testing pipeline's
 * `compat probe`); `forbids.policy` and `vocabulary` are read from documents,
 * `forbids.names` from the class's source.
 */
import type { Evidence, Support } from './evidence.ts';
import type { ClassId, PackageId } from './ids.ts';
import type { OrderRule, PackageLoad, Resource } from './key.ts';

/** A package a class will not have: the class errors, clashes or breaks with it, or the publisher forbids it. */
export type ClassPackageRule = { readonly pkg: PackageId; readonly reason: string; readonly evidence: readonly Evidence[] };

/** A name the class defines but refuses to have used, as its own code shows (llncs's `\subparagraph`), unless a package that replaces it is loaded. */
export type ClassNameRule = { readonly name: Resource; readonly reason: string; readonly evidence: readonly Evidence[]; readonly unlessLoaded?: readonly PackageId[] };

/** What a class option does to the profile (`acmart`'s `acmthm=false` removes its theorem environments; elsarticle's `5p` sets two columns). */
export type OptionEffect = {
  readonly removes?: readonly Resource[];
  readonly adds?: readonly Resource[];
  /** The column count the option sets where the class's layout was measured without it (elsarticle's 5p: two columns, though the class declares no twocolumn option). */
  readonly columns?: 1 | 2;
  /** Packages among `preloads` the class does not load under the option (tufte-handout's nobib: natbib and bibentry). A template that gives the option may load what refuses them; one that does not still may not. */
  readonly unloads?: readonly PackageId[];
  readonly description: string;
};

export type ClassProfile = {
  readonly id: ClassId;
  /** The class as `\documentclass` names it, when it differs from the id's name. */
  readonly name: string;
  /** The class it loads and builds on (ctexbeamer on beamer, ltxdoc on article): a key's rule for that class holds here too. */
  readonly base?: ClassId;
  /** Whether it runs in ZeroTeX-NG, the only engine. */
  readonly zerotex: Support;
  readonly preloads: readonly PackageLoad[];
  readonly defines: readonly Resource[];
  readonly options: { readonly [option: string]: OptionEffect };
  readonly forbids: {
    readonly technical: readonly ClassPackageRule[];
    readonly policy: readonly ClassPackageRule[];
    /** Names it defines but refuses, or lacks though a way or General's own way would print them (frontiers' and agu's
     * \tableofcontents: `defines` holds a class only to environments, \maketitle and sectioning counters), read from its source (llncs's `\subparagraph` prints a warning that recurses): a heading at a level listed here, a way whose key requires the name, or General's way that prints it (iopjournal's \maketitle, siamart's \tableofcontents), is compiled under no cell of the class unless one of the branch's own ways loads a package in `unlessLoaded` (sectsty). */
    readonly names?: readonly ClassNameRule[];
  };
  readonly layout: { readonly columns: 1 | 2; readonly textwidth: string; readonly fontsize: string } | null;
  /** A class not on the mirror, as Flouest's `DocumentClass.files`. */
  readonly files?: readonly { readonly path: string; readonly sha256: string }[];
  /** Front-matter commands, for class-native handlers. */
  readonly vocabulary: { readonly [command: string]: string };
  readonly evidence: readonly Evidence[];
};

/** A package's options, which exclude each other, load order and whether it runs in ZeroTeX-NG. */
export type PackageFacts = {
  readonly id: PackageId;
  readonly description: string;
  /** Its options, each with what it does; an option a handler loads must be listed. */
  readonly options: { readonly [option: string]: string };
  /** Options that cannot be given together. */
  readonly exclusive: readonly (readonly string[])[];
  /** Packages it refuses to be loaded with (floatrow stops when float is loaded). */
  readonly conflicts?: readonly ClassPackageRule[];
  /** Its own libraries (`tcolorbox`), when it has any. */
  readonly libraries?: readonly string[];
  readonly loadOrder: readonly OrderRule[];
  /** Names it defines on loading. */
  readonly defines: readonly Resource[];
  readonly zerotex: Support;
  readonly evidence: readonly Evidence[];
};

export const defineClass = <const C extends ClassProfile>(profile: C): C => profile;
export const definePackage = <const P extends PackageFacts>(facts: P): P => facts;
