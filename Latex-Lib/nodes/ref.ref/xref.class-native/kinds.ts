/**
 * xref.class-native's vocabularies: the command each class gives a target's kind, by the node's name (`refName`,
 * "Figure"), read lower-case with a trailing full stop dropped ("Fig." is "fig"). A kind a class has no command for
 * falls back to the kernel's name~\ref (xref.kernel's named form).
 */

/** elegantpaper's \figref and \tabref: {\bfseries Figure~\ref{#1}} and {\bfseries Table~\ref{#1}} (elegantpaper.cls l.255-256). */
export const ELEGANTPAPER: { readonly [kind: string]: string } = {
  figure: '\\figref',
  fig: '\\figref',
  table: '\\tabref',
  tab: '\\tabref',
};

/**
 * jmlr's \…ref commands over its \objectref, each printing its own name and the number (\equationref in parentheses):
 * jmlr.dtx l.1860-2004 (the names l.1862-1891, the commands l.1926-2004); PMLR's sample calls them (pmlr-sample.tex l.145-181).
 */
export const JMLR: { readonly [kind: string]: string } = {
  section: '\\sectionref',
  sec: '\\sectionref',
  equation: '\\equationref',
  eq: '\\equationref',
  eqn: '\\equationref',
  table: '\\tableref',
  tab: '\\tableref',
  figure: '\\figureref',
  fig: '\\figureref',
  algorithm: '\\algorithmref',
  alg: '\\algorithmref',
  theorem: '\\theoremref',
  lemma: '\\lemmaref',
  remark: '\\remarkref',
  corollary: '\\corollaryref',
  definition: '\\definitionref',
  conjecture: '\\conjectureref',
  axiom: '\\axiomref',
  example: '\\exampleref',
  appendix: '\\appendixref',
  part: '\\partref',
};

/** Every command a vocabulary can print, for the key's requirements. */
export const commandsOf = (vocabulary: { readonly [kind: string]: string }): readonly string[] => [...new Set(Object.values(vocabulary))];

/** The node's name as a vocabulary's key: lower-case, trimmed, with a trailing full stop dropped. */
export const kindOf = (refName: string): string => refName.trim().replace(/\.$/u, '').toLowerCase();
