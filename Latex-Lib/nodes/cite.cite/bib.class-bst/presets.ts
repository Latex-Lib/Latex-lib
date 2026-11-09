/**
 * bib.class-bst's (cite/cite) presets: the citation commands the classes paired with bib.class-bst's list give.
 */
import type { Preset } from '../../../schema/params.ts';

const src = (file: string, line: string) => ({ kind: 'source', file: `Latex Related Research/Latex-lib-main/Source/${file}`, line }) as const;

export const PRESETS = {
  cite: {
    description: "\\cite{key}, as the class's citation style prints it: numbers from its natbib (revtex, elsarticle-num, achemso's superscripts) or author and year (aa, copernicus).",
    features: ['numeric-citations', 'author-year', 'class-styled'],
    params: {},
    evidence: [src('0107-elsarticle/elsarticle-template-num.tex', '250-254 (\\cite{<label>} ==> [1])'), src('0528-achemso/achemso-demo.tex', '168-172')],
  },
  parenthetical: {
    description: "natbib's \\citep{key} against the class's natbib: (Knuth, 1984) or [1] (cas, elsarticle-num-names, jmlr, icml, tmlr).",
    writes: '\\citep{…}',
    features: ['author-year', 'class-styled'],
    params: { command: 'citep' },
    evidence: [src('0107-elsarticle/elsarticle-template-num-names.tex', '249-252'), src('0662-jmlr/pmlr-sample.tex', '750-757')],
  },
  textual: {
    description: "natbib's \\citet{key}, the author part of the sentence: Knuth (1984) or Knuth [1] (cas, elsarticle, acmart).",
    writes: '\\citet{…}',
    features: ['author-year', 'class-styled'],
    params: { command: 'citet' },
    evidence: [src('0107-elsarticle/elsarticle-template-num-names.tex', '249-252 (\\citet{<label>} ==> Lamport [21])')],
  },
  'revtex-online': {
    description: "revtex's \\onlinecite{key}: the reference number on the line, read as a noun (Ref.~\\onlinecite{key}), where \\cite would be a superscript.",
    writes: '\\onlinecite{…}',
    features: ['numeric-citations', 'class-styled'],
    params: { command: 'onlinecite' },
    evidence: [src('0908-aip-conference-proceedings/tex/latex/revtex/revtex4-2.cls', '7069, 7092 (\\onlinecite)')],
  },
  'ascelike-textual': {
    description: "ascelike's \\citeN{key}: the author with the year in parentheses, for use in the sentence (ASCE).",
    writes: '\\citeN{…}',
    features: ['author-year', 'class-styled'],
    params: { command: 'citeN' },
    evidence: [{ kind: 'source', file: 'Latex-Lib/classes/ascelike.ts', line: '18 (\\cite, \\citeN, \\citeNP, \\citeA, \\citeyear re-made at \\begin{document})' }],
  },
  'achemso-number': {
    description: "achemso's \\citenum{key}: the bare reference number on the line (Ref.~\\citenum{key}), where \\cite would be a superscript.",
    writes: '\\citenum{…}',
    features: ['numeric-citations', 'class-styled'],
    params: { command: 'citenum' },
    evidence: [src('0528-achemso/achemso-demo.tex', '172 (Ref.~\\citenum{Mena2000})')],
  },
} as const satisfies { readonly [name: string]: Preset };
