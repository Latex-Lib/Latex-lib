/**
 * Every id is made from content, never from position (ARCHITECTURE.md section
 * 6). Adding a way adds branches, documents and cells, and changes none that
 * already exist, so their saved results still answer.
 */
import type { BranchId, CellId, DocumentId, Job, Json, PathStep, Variant } from './model.ts';
import { canonical, hashJson, sha256 } from './hash.ts';

/** Ids are a one-letter kind and 20 hex digits (80 bits): short enough to read, far from colliding. */
const ID_DIGITS = 20;
const short = (kind: string, hex: string): string => `${kind}${hex.slice(0, ID_DIGITS)}`;

/** A variant in one spelling: what splits a node's places in the split tree. */
export const variantKey = (variant: Variant): string => canonical(variant);

/** A branch: each step of its path, root first, and whether it carries the marked runs when that is said rather than read from the id. */
export const branchId = (path: readonly PathStep[], marked?: boolean): BranchId =>
  short('b', hashJson(marked === undefined ? path : { path, marked }));

/** A document: its branches in the order filed, and the version of the rules they were filed under. */
export const documentId = (branches: readonly BranchId[], rules: string): DocumentId =>
  short('d', hashJson({ branches, rules }));

/** A document not made of branches (a smoke test, a probe, a solo check): its id is its content. */
export const looseDocumentId = (content: Json): DocumentId => short('d', hashJson({ loose: content }));

export const cellId = (document: DocumentId, classSetting: string, setup: string): CellId =>
  short('c', hashJson({ document, classSetting, setup }));

/** Where a compile's result is saved: the engine, and everything it reads. The order the files were listed in does not count. */
export const resultKey = (job: Job, engine: string): string => {
  const files = [...job.files].sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  return sha256(engine, job.latex, ...files.flatMap((file) => [file.path, file.bytes]));
};
