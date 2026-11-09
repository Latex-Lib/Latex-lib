/**
 * bib.natbib's presets, each from the templates that use it (`node seed.ts bib --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  numbers: {
    description: 'natbib with numbered citations, \\usepackage[numbers]{natbib}, plainnat.',
    features: ['numeric-citations', 'external-tool'],
    params: {},
    evidence: [solution('0017-hit-report', '49')],
  },
  'square-compressed': {
    description: 'Numbers in square brackets, sorted and compressed to ranges, separated by commas ([square, numbers, comma, sort&compress]).',
    features: ['numeric-citations', 'sorted-compressed', 'external-tool'],
    params: { brackets: 'square', sort: 'sort&compress', separator: 'comma' },
    evidence: [solution('0083-ntu-thesis', '79'), solution('0031-nhatkhangcs-overleaf-comments', '85')],
  },
  'author-year': {
    description: 'Author and year citations in round brackets, natbib\'s own default (authoryear, round), plainnat.',
    features: ['author-year', 'external-tool'],
    params: { citeStyle: 'authoryear' },
    evidence: [solution('0094-nostarch', '46'), solution('0141-msu-thesis', '40'), solution('0031-nhatkhangcs-overleaf-comments', '89')],
  },
  'author-year-square': {
    description: 'Author and year in square brackets with abbreviated first names (square, authoryear; abbrvnat).',
    features: ['author-year', 'external-tool'],
    params: { citeStyle: 'authoryear', brackets: 'square', bst: 'abbrvnat' },
    evidence: [solution('0042-jankapunkt-master-thesis', '77')],
  },
  superscript: {
    description: 'Superscript numbers in the text (super), square brackets in the list.',
    features: ['numeric-citations', 'superscript', 'external-tool'],
    params: { citeStyle: 'super', brackets: 'square' },
    evidence: [solution('0005-cococo2000-ict-beamer', '41')],
  },
  // The AISTATS sample's natbib lines (commented out there, as the style asks of an author who uses natbib), the list kept at the
  // style's own \subsubsection* level: Source/0794-aistats/sample_paper.tex l.27-33; supplement.tex l.18-24 the same.
  aistats: {
    description: 'AISTATS: author-year citations in round brackets with apalike ([round]{natbib}, \\bibliographystyle{apalike}), the list headed References at the third level (\\renewcommand{\\bibsection}{\\subsubsection*{\\bibname}}).',
    writes: '\\renewcommand{\\bibsection}{\\subsubsection*{\\bibname}} \\nocite{*} \\bibliographystyle{apalike} \\bibliography{\\jobname}',
    features: ['author-year', 'external-tool'],
    params: { citeStyle: 'authoryear', brackets: 'round', bst: 'apalike', heading: 'References', bibsection: '\\subsubsection*{\\bibname}' },
    evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0794-aistats/sample_paper.tex', line: '27-33' }, { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0794-aistats/aistats2026.sty', line: '482-483 (thebibliography heads its list \\subsubsection*{\\refname})' }, { kind: 'compile', reproducer: 'unit 46 (2026-11-07), ZeroTeX-NG through class-examples/typeset-dir.ts: scratchpad build/work/bib-ext/natbib-aistats/main.tex under article with aistats2026.sty [preprint] (copied from Source/0794-aistats; the pinned aistats2027.sty is not in this checkout), ok, the .bbl read, References at \\subsubsection*' }],
  },
  // An IEEE paper that cites with natbib: numbers in square brackets, comma separated and sorted, not compressed (the IEEE Reference
  // Guide writes ranges out), with IEEEtran's natbib-compatible IEEEtranN: Source/0823-latextemplates-ieee-enhanced/paper.tex l.228-235,
  // 1166-1167 (its DOI-extended copy IEEEtranN-doi, not on CTAN; IEEEtranN is, in the IEEEtran bundle).
  'ieee-natbib': {
    description: 'IEEE numbers with natbib: [square, comma, numbers, sort]{natbib} and \\bibliographystyle{IEEEtranN}.',
    writes: '\\nocite{*} \\bibliographystyle{IEEEtranN} \\bibliography{\\jobname}',
    features: ['numeric-citations', 'external-tool'],
    params: { brackets: 'square', sort: 'sort', separator: 'comma', bst: 'IEEEtranN' },
    evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0823-latextemplates-ieee-enhanced/paper.tex', line: '228-235, 1166-1167' }, { kind: 'compile', reproducer: 'unit 46 (2026-11-07), ZeroTeX-NG through class-examples/typeset-dir.ts: scratchpad build/work/bib-ext/natbib-ieee/main.tex under article, ok, the .bbl read' }],
  },
} as const satisfies { readonly [name: string]: Preset };
