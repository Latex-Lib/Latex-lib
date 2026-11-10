/**
 * bib.thebibliography (cite/cite): The kernel's \cite{key} against the hand-written list.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param, textOf } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: () => ({}),
    // \protect, as bib.apacite writes it: a class's own \cite is fragile where it replaces the kernel's robust one (ascelike re-makes
    // \cite, \citeN, \citeNP and \citeA with \def at \begin{document}: "\cite ->\def \@citeseppen {-1000}\def \@cite ##1##2…").
    // Unprotected in a heading (\protected@write to the .aux and .toc, \@mkboth) it stopped at "Illegal parameter number in
    // definition of \reserved@a" or "Undefined control sequence" (batch 4 round 2, ascelike.A: document df9dc44ea1bc045563fed,
    // result 79c375b369cf, l.63; document d51e0c699294aabe8c372, result db3be6507e75, l.48 \subsubsection*). In text \protect is
    // \relax; protected, ascelike's four commands pass in a numbered and a starred heading with hyperref (ZeroTeX-NG through compat
    // cases, 2026-11-10).
    emit: (node) => (textOf(node) === '' ? '' : `\\protect\\${param(p, 'command', 'cite')}{${textOf(node)}}`),
  };
};

export default realize;
