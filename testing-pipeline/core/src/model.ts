/**
 * The pipeline's vocabulary (ARCHITECTURE.md section 2).
 *
 * Core treats every host identity as an opaque string. It never knows what a
 * node is, only where the host says it may sit and which ways the library
 * offers for it.
 */

/**
 * Any value that survives JSON: the only shape core hashes or stores. An
 * object's key may hold `undefined` (an optional property); it is left out, as
 * `JSON.stringify` leaves it out.
 */
export type Json = null | boolean | number | string | readonly Json[] | { readonly [key: string]: Json | undefined };

/** A host's node identity, e.g. `containerBlock/mathElement`. */
export type NodeId = string;
/** A library way, e.g. `thm.amsthm`. */
export type WayId = string;

export type BranchId = string;
export type DocumentId = string;
export type CellId = string;

// ---- What the host says ----

/** A legal place, and every legal place below it, as the host's own rules decide (`Host.nesting`). */
export type NestingNode = {
  readonly node: NodeId;
  readonly children: readonly NestingNode[];
};

export type NestingTree = {
  /** The deepest level enumerated; 0 is directly in the document. */
  readonly depth: number;
  readonly roots: readonly NestingNode[];
};

/** A member's values: what the host writes on the node (its settings, and its look or preset). */
export type MemberValues = { readonly [name: string]: Json };

/**
 * One member of a variant, as the host holds it. `needs`: the host keeps it
 * only directly under that parent holding those values (a list item's term
 * exists only in a description list), so the plan takes it only there.
 */
export type Member = {
  readonly values: MemberValues;
  readonly needs?: { readonly node: NodeId; readonly values: MemberValues };
};

/**
 * A node's variant and its members, as the host holds them (`Host.variants`).
 * The members are ordered so the first `cover` show every value once; the
 * plan tops up any of those no branch took.
 */
export type HostVariant = {
  readonly variant: Variant;
  readonly members: readonly Member[];
  readonly cover: number;
};

/**
 * What filing must respect, as data so that it hashes. A branch holding one
 * of `alone` is filed in a document of its own (a title). A branch holding one
 * of `last` goes after the others (an appendix). `limits`: a document holds at
 * most that many branches holding the node (26 appendices, lettered A to Z).
 */
export type DocumentRules = {
  readonly version: string;
  readonly alone: readonly NodeId[];
  readonly last: readonly NodeId[];
  readonly limits?: { readonly [node: NodeId]: number };
};

// ---- What the library says ----

/** Fixed settings for a way. */
export type Preset = {
  readonly id: string;
  readonly params: { readonly [name: string]: Json };
};

/**
 * One way of emitting a node. `compat` names the params that can change
 * whether it works (`breakable`, a column spec), and those split variants.
 * Every other param only changes the look, so it rotates.
 */
export type Way = {
  readonly id: WayId;
  readonly node: NodeId;
  readonly presets: readonly Preset[];
  readonly compat: readonly string[];
  /** Packages it loads, for the class probe's load tests. */
  readonly loads: readonly string[];
  /** Names it defines (`env:theorem`), for the class probe's name check. */
  readonly defines: readonly string[];
};

// ---- What core builds ----

/** A node's variant: its way, the values of its compat params, the values of its split settings. */
export type Variant = {
  readonly way: WayId;
  readonly compat: { readonly [name: string]: Json };
  readonly flags: { readonly [name: string]: Json };
};

/** One node of a branch: the node, its variant, and the values of the member it took. */
export type PathStep = {
  readonly node: NodeId;
  readonly variant: Variant;
  readonly member: MemberValues;
};

/**
 * One root-to-leaf path of the split tree. Its id is the hash of its path
 * (`ids.ts`). Whether it carries the marked runs is read from its id
 * (`markedOf`), unless `marked` says so: a solo branch is built as the matrix
 * branch it stands for was, and its id then hashes `marked` too.
 */
export type BranchSpec = {
  readonly id: BranchId;
  readonly path: readonly PathStep[];
  readonly marked?: boolean;
};

/**
 * A class, its structural options, the lines right after it, the host's own
 * lines after the class line it leaves out, and files the engine cannot fetch.
 * Data, read from `classes/`. A class whose other column mode is a class
 * setting of its own (`IEEEtran` journal) lists only the setups that apply to
 * it.
 */
export type ClassSetting = {
  readonly id: string;
  readonly description?: string;
  readonly class: string;
  readonly options: readonly string[];
  readonly preamble: readonly string[];
  readonly files: readonly { readonly path: string; readonly sha256: string }[];
  /** The setups that apply; every setup when left out. */
  readonly setups?: readonly string[];
  /**
   * Lines the host writes right after the class line that this class
   * setting leaves out; the host checks each one is there. None when left
   * out.
   */
  readonly omitPreamble?: readonly string[];
};

/** A fixed document-level choice applied over a class setting: A default, B the other column mode, C strict. */
export type Setup = {
  readonly id: string;
  readonly description: string;
  readonly addOptions: readonly string[];
  readonly removeOptions: readonly string[];
  readonly preamble: readonly string[];
};

/** A package line: `\usepackage[options]{name}`. */
export type PackageLoad = { readonly name: string; readonly options: readonly string[] };

/**
 * How a cell came out, from its log. `ok`: TeX wrote pages and reported no
 * error. `errors`: it reported some. `no-output`: no error, but no pages.
 * `threw`: the engine gave no result at all.
 */
export type CellStatus = 'ok' | 'errors' | 'no-output' | 'threw';

/** One package's load test under a class: the class and that package alone. */
export type PackageTest = {
  readonly status: CellStatus;
  readonly errors: readonly string[];
  /** Warnings that speak of an incompatibility (`not recommended`, `incompatible`…): it loads, but the class or package objects. */
  readonly cautions: readonly string[];
};

/**
 * What a class brings and refuses, measured by the class probe (ARCHITECTURE.md
 * 9.3; the library's class profile, ../ARCHITECTURE.md section 5). The asked
 * names and packages come from the library: the class is probed for exactly
 * what the ways would bring.
 */
export type ClassProfile = {
  readonly classSetting: string;
  readonly engine: string;
  readonly probe: number;
  /** The class alone, with an empty page. */
  readonly loads: { readonly status: CellStatus; readonly errors: readonly string[] };
  /** Every file the class read in (`\@filelist`), in order. */
  readonly files: readonly string[];
  /** Asked packages the class has already loaded. */
  readonly preloads: readonly string[];
  /** Asked names the class already defines: a way that defines one clashes. */
  readonly clashes: readonly string[];
  /** Asked names to redefine that the class does not define: a way that redefines one breaks. */
  readonly lacks: readonly string[];
  readonly layout: {
    readonly twocolumn: boolean;
    readonly textWidth: string;
    readonly columnWidth: string;
    readonly paperWidth: string;
    readonly paperHeight: string;
    readonly fontSize: string;
  } | null;
  /** Each asked package's load test, by its spelling (`xcolor[table]`). */
  readonly packages: { readonly [spelling: string]: PackageTest };
  /** The spellings whose load test failed: `forbids.technical`. */
  readonly forbids: readonly string[];
  /** The spellings that loaded with an objection. */
  readonly cautions: readonly string[];
};

/** A filed document: its branches in order, and the version of the rules they were filed under. */
export type DocumentSpec = {
  readonly id: DocumentId;
  readonly branches: readonly BranchId[];
  readonly rules: string;
};

/**
 * A filed document with each branch's path, so it can be built again exactly
 * as filed, even once some of its branches have left the plan (`file.ts`).
 */
export type FiledDocument = DocumentSpec & { readonly paths: readonly BranchSpec[] };

/** The unit that is compiled and cached. */
export type Cell = {
  readonly id: CellId;
  readonly document: DocumentId;
  readonly classSetting: string;
  readonly setup: string;
};

// ---- What comes back ----

export type EngineFile = { readonly path: string; readonly bytes: Uint8Array };

/** The host's LaTeX for a document, with each branch's lines, so an error's line names its branch. */
export type Emitted = {
  readonly latex: string;
  readonly spans: readonly { readonly branch: BranchId; readonly from: number; readonly to: number }[];
  /**
   * The preamble lines each branch put there (its ways' loads and
   * definitions), so a preamble error names the branches responsible. A line
   * several branches put there is each one's. A line no branch gave (the class
   * setting's, core's sentinel macro, the host's own) is the document's.
   */
  readonly preamble?: readonly { readonly branch: BranchId; readonly from: number; readonly to: number }[];
  readonly files: readonly EngineFile[];
};

/**
 * One compile. `id` is for tracing only: an engine typesets every job under one
 * fixed job name, so `id` never reaches TeX and is not part of the result's key.
 */
export type Job = { readonly id: string; readonly latex: string; readonly files: readonly EngineFile[] };

/** What an engine hands back. Judging it is core's work (`oracle.ts`), not the engine's. */
export type RawResult = {
  readonly log: string;
  readonly pages: number | null;
  readonly ms: number;
  /**
   * The engine itself failed (it threw), as distinct from TeX reporting errors.
   * A result with no log is not this: the engine stopped TeX (its watchdog, on
   * a loop) or never ran it, the oracle fails it for the whole document
   * (`no-log`), and `run.ts` does not save it.
   */
  readonly threw?: string;
};

/**
 * A sentinel the host placed (`BuildProbes.sentinel`). `outside`: its content
 * belongs outside the text block (a margin note), so its position is not
 * checked. `nextRun`: its content is typeset from an auxiliary file an earlier
 * run wrote (a note column's `.slnc`), so on a build that never settled (a TeX
 * error ended it after its first run) its absence is not judged. `role`: what
 * a feature probe reads it as (`breakable:start`, `footnote:mark`…).
 */
export type SentinelSpec = { readonly id: string; readonly outside?: boolean; readonly nextRun?: boolean; readonly role?: string };

/**
 * One check a branch failed. `check` names it: `error`, `warning:<name>`,
 * `sentinel:missing`, `sentinel:duplicated`, `sentinel:outside`,
 * `feature:<name>`; and for the whole run, `fatal`, `no-pages`, `no-bbl`,
 * `no-log`. A `:document` suffix means the log could not tie it to one branch,
 * so every branch of the document carries it until the explainer separates
 * them; or that it is another branch's error after which TeX skipped to the
 * end of the file, so this branch never ran or never reached a page
 * (`oracle.ts`).
 */
export type Failure = { readonly check: string; readonly evidence: string };

/** A branch's result in a cell. */
export type Verdict = {
  readonly branch: BranchId;
  readonly cell: CellId;
  readonly pass: boolean;
  readonly failures: readonly Failure[];
};

/** A way's verdicts as the library stores them (`compat.generated.json`); `compat.ts` makes its entries. */
export type CompatTable = {
  readonly way: WayId;
  /** The keys of what it was generated from, so that a stale table can be found. */
  readonly from: { readonly [input: string]: string };
  readonly entries: readonly Json[];
};
