/**
 * Where a rule or a fact comes from (ARCHITECTURE.md 4.6, "Where docs, source
 * and the corpus fit"). Every rule carries a reason and evidence; one without
 * evidence keeps its key a draft.
 */

/** Whether something works: measured, or not yet. */
export type Support = 'yes' | 'no' | 'untested';

export type Evidence =
  /** A Solution file of the research, at its lines: a template that uses it. */
  | { readonly kind: 'solution'; readonly file: string; readonly lines: string }
  /** A package or class manual, at its section. */
  | { readonly kind: 'manual'; readonly of: string; readonly section: string; readonly url?: string }
  /** Package or class source, at its line (`\PackageError`, `\@ifpackageloaded`). */
  | { readonly kind: 'source'; readonly file: string; readonly line: string }
  /** A compile: the testing pipeline's cell, or its candidate rule and reproducer. */
  | { readonly kind: 'compile'; readonly cell?: string; readonly candidate?: string; readonly reproducer?: string }
  /** Flouest's own code, which has run in production (General's handlers). */
  | { readonly kind: 'flouest'; readonly file: string; readonly line?: string }
  /** A publisher's requirement document (`Template/template-requirement/<Publisher>.md`). */
  | { readonly kind: 'requirement'; readonly file: string; readonly line: string };

export const EVIDENCE_KINDS = ['solution', 'manual', 'source', 'compile', 'flouest', 'requirement'] as const;
