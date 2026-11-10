/**
 * bib.class-bst (cite/cite): the citation against bib.class-bst's list, \<command>{keys} with the class's own command (\cite,
 * natbib's \citep or \citet, revtex's \onlinecite, ascelike's \citeN...), joined to the text by a tie when asked.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param, textOf } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const command = param(p, 'command', 'cite');
  return {
    // natbib's \citenum (8.31b l.708-711) cannot be made a PDF string, \protect or not: in a heading, hyperref's bookmark
    // (\pdfstringdef) expands it into its \let and \ifnum and stops at "Missing number, treated as zero" (\NAT@ctype) or "Argument
    // of \NAT@star@cite@noextension has an extra }" (batch 4 round 2: acl, corl, jmlr-pmlr, sn-jnl; acl.A document
    // d69dfae236f365949eeb0, result 7f6e392f296c; reproduced under acl.A, corl.A and jmlr-pmlr.A, gone with this line, ZeroTeX-NG,
    // compat cases, 2026-11-10). The bookmark leaves it out, as Flouest leaves its ulem marks out (\pdfstringdefDisableCommands,
    // which only hyperref defines).
    preamble: () => (command === 'citenum' ? { declarations: ['\\AtBeginDocument{\\ifdefined\\pdfstringdefDisableCommands\\pdfstringdefDisableCommands{\\def\\citenum#1{}}\\fi}'] } : {}),
    // \leavevmode before the tie, as bib.bibtex-bst's citation writes it: amsart-like classes make ~ \unskip\nobreak\ , which stops
    // in vertical mode where the citation opens a heading.
    // \protect: the class's own commands are fragile where the class \def's them (ascelike's \cite, \citeN, \citeNP, \citeA: "\citeN
    // ->\def \@citeseppen {-1000}\def \@cite ##1##2{##1\if@tempswa , ##2)…" undefined in a heading, batch 4 round 2, ascelike.A
    // document df824d28c9d205c4e46a5, result b267d17e4f8a, l.35), as bib.thebibliography's and bib.apacite's citations; in text
    // \protect is \relax, and natbib's and revtex's robust commands are unchanged by it.
    emit: (node) => (textOf(node) === '' ? '' : `${p['tie'] === true ? '\\leavevmode~' : ''}\\protect\\${command}{${textOf(node)}}`),
  };
};

export default realize;
