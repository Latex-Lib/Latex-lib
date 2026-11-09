/**
 * bib.bibtex-bst's presets, each from the templates that use it (`node seed.ts bib --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const src = (file: string, line: string) => ({ kind: 'source', file: `Latex Related Research/Latex-lib-main/Source/${file}`, line }) as const;

export const PRESETS = {
  plain: {
    description: 'BibTeX\'s plain style: numbered [1], sorted by author, the entries in \\jobname.bib.',
    features: ['numeric-citations', 'external-tool'],
    params: {},
    evidence: [solution('0023-korigamik-assignment', '36'), solution('0082-uiucthesis', '43')],
  },
  unsrt: {
    description: 'Numbered in the order the works are first cited (unsrt).',
    features: ['numeric-citations', 'external-tool'],
    params: { bst: 'unsrt' },
    evidence: [solution('0108-lix', '63'), solution('0524-doem97-ntu-eee-msc-dissertation-template', '77')],
  },
  alpha: {
    description: 'Labels from the authors and year, [Knu84] (alpha).',
    features: ['external-tool'],
    params: { bst: 'alpha' },
    evidence: [solution('0052-muthesis', '58'), solution('0185-memhfixc', '71')],
  },
  ieeetr: {
    description: 'IEEE transactions style, numbered in citation order (ieeetr).',
    features: ['numeric-citations', 'external-tool'],
    params: { bst: 'ieeetr' },
    evidence: [solution('0005-cococo2000-ict-beamer', '60'), solution('0370-aremju-latex-template', '66')],
  },
  apalike: {
    description: 'Author and year labels in the APA manner (apalike), the list under its own heading.',
    features: ['author-year', 'external-tool'],
    params: { bst: 'apalike' },
    evidence: [solution('0002-ulth-se-universit-laval-thesis', '48'), solution('0012-basic-academic-journal-article', '68')],
  },
  amsplain: {
    description: "The AMS's numbered style amsplain (amscls), as the AMS classes' templates name it.",
    writes: '\\nocite{*} \\bibliographystyle{amsplain} \\bibliography{\\jobname}',
    features: ['numeric-citations', 'external-tool'],
    params: { bst: 'amsplain' },
    evidence: [src('0260-amsproc/doc/amsbook-template.tex', '123-126 (amsplain or harvard are also acceptable)'), src('0165-ams-book/main.tex', '105-108')],
  },
  amsalpha: {
    description: "The AMS's alphabetic style amsalpha, labels from the authors and year ([Knu84]).",
    writes: '\\nocite{*} \\bibliographystyle{amsalpha} \\bibliography{\\jobname}',
    features: ['external-tool'],
    params: { bst: 'amsalpha' },
    evidence: [src('0260-amsproc/doc/amsbook-template.tex', '123-126')],
  },
  'amsbook-backmatter': {
    description: "amsbook's ending: \\backmatter, then amsalpha's list as an unnumbered chapter.",
    writes: '\\backmatter \\nocite{*} \\bibliographystyle{amsalpha} \\bibliography{\\jobname}',
    features: ['external-tool'],
    params: { bst: 'amsalpha', backmatter: true },
    evidence: [src('0260-amsproc/doc/amsbook-template.tex', '123-126 (\\backmatter, \\bibliographystyle{amsalpha})'), { kind: 'requirement', file: 'Template/template-requirement/AMS_Amsbook.md', line: '111-113' }],
  },
  ieeetran: {
    description: "IEEE's IEEEtran.bst, numbered in citation order, with its control entry (\\bstctlcite: et al. after six names) cited at \\begin{document}.",
    writes: '\\bstctlcite{IEEEexample:BSTcontrol} \\nocite{*} \\bibliographystyle{IEEEtran} \\bibliography{\\jobname}',
    features: ['numeric-citations', 'external-tool'],
    params: { bst: 'IEEEtran', bstControl: true },
    evidence: [src('0743-ieeetran-journal/IEEEtran/bare_jrnl.tex', '657'), src('0743-ieeetran-journal/Transactions-Bibliography/IEEEtran.bst', '103-115 (\\bstctlcite, before the first \\cite)'), src('0743-ieeetran-journal/Transactions-Bibliography/IEEEexample.bib', '1176-1188')],
  },
  'ieeetran-sorted': {
    description: "IEEE's IEEEtranS.bst: IEEEtran's form, sorted by author.",
    writes: '\\nocite{*} \\bibliographystyle{IEEEtranS} \\bibliography{\\jobname}',
    features: ['numeric-citations', 'external-tool'],
    params: { bst: 'IEEEtranS' },
    evidence: [src('0743-ieeetran-journal/Transactions-Bibliography/IEEEtranS.bst', '1-10')],
  },
  plainurl: {
    description: "LIPIcs' required plainurl (plain with URLs and DOIs), numbered.",
    writes: '\\nocite{*} \\bibliographystyle{plainurl} \\bibliography{\\jobname}',
    features: ['numeric-citations', 'linked', 'external-tool'],
    params: { bst: 'plainurl' },
    evidence: [{ kind: 'requirement', file: 'Template/template-requirement/LIPIcs.md', line: '36, 79' }],
  },
  splncs04: {
    description: "Springer LNCS's splncs04 (llncs, ECCV), numbered.",
    writes: '\\nocite{*} \\bibliographystyle{splncs04} \\bibliography{\\jobname}',
    features: ['numeric-citations', 'external-tool'],
    params: { bst: 'splncs04' },
    evidence: [src('0712-llncs/llncsdoc.tex', '395-402 (please use splncs04.bst)')],
  },
  'book-backmatter': {
    description: 'A book\'s ending: \\backmatter, then the plain list as an unnumbered chapter (book, scrbook).',
    writes: '\\backmatter \\nocite{*} \\bibliographystyle{plain} \\bibliography{\\jobname}',
    features: ['numeric-citations', 'external-tool'],
    params: { backmatter: true },
    evidence: [src('0675-basic-latex2e-book-template/main.tex', '104-106 (\\backmatter, then \\bibliographystyle)')],
  },
} as const satisfies { readonly [name: string]: Preset };
