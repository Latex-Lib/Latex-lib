/**
 * bib.thebibliography's presets, each from the templates that use it (`node seed.ts bib --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  numbered: {
    description: 'A hand-written list, \\begin{thebibliography}{99} with one \\bibitem{key} per entry; no BibTeX run.',
    features: ['numeric-citations', 'hand-written'],
    params: {},
    evidence: [solution('0070-ntgclass', '47'), solution('0107-elsarticle', '60')],
  },
  'small-tight': {
    description: 'The hand-written list in a smaller size with no space between entries (\\small, \\itemsep 0pt).',
    writes: '\\begin{thebibliography}{99} \\small \\setlength{\\itemsep}{…} \\bibitem{…} … \\end{thebibliography}',
    features: ['numeric-citations', 'hand-written', 'small-type', 'compact'],
    params: { font: '\\small', itemsep: '0pt' },
    evidence: [solution('0003-ucsmonograph', '78')],
  },
  renamed: {
    description: 'The hand-written list under a heading of its own (\\refname, \\bibname).',
    writes: '\\begin{thebibliography}{99} \\bibitem{…} … \\end{thebibliography}; \\AtBeginDocument{\\providecommand{\\refname}{}\\renewcommand{\\refname}{…}}',
    features: ['numeric-citations', 'hand-written'],
    params: { heading: 'Documentation' },
    evidence: [solution('0469-latex-brochure', '67')],
  },
  // AISTATS's sample list: no labels, entries hanging from the margin, \begin{thebibliography}{} (Source/0794-aistats/sample_paper.tex
  // l.292-294; Solution/0794-aistats.md l.73, 96 reads it as this list with the lengths set).
  'unlabelled-hanging': {
    description: 'AISTATS: a hand-written list with no labels, each entry hanging from the margin (\\begin{thebibliography}{}, \\setlength{\\itemindent}{-\\leftmargin}, \\@biblabel emptied).',
    writes: '\\begin{thebibliography}{} \\setlength{\\itemindent}{-\\leftmargin} \\renewcommand{\\@biblabel}[1]{} \\bibitem{…} … \\end{thebibliography}',
    features: ['hand-written', 'hanging'],
    params: { widest: '', labels: 'none', hang: true },
    evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0794-aistats/sample_paper.tex', line: '292-308' }, solution('0794-aistats', '73, 96'), { kind: 'compile', reproducer: 'unit 46 (2026-11-07), ZeroTeX-NG through class-examples/typeset-dir.ts: scratchpad build/work/bib-ext/thebib-aistats/main.tex under article with aistats2026.sty [preprint] (copied from Source/0794-aistats), ok, the entry unlabelled at the margin' }],
  },
  // Taylor & Francis Interact's APA sample: natbib with longnamesfirst and sort, its punctuation and a 10pt list, and a hand-written
  // list whose \bibitem[Adams et~al.(2008)]{adams08} labels natbib reads (Source/0207-tandf-interact/interactapasample.tex l.12-14,
  // 438-566).
  'natbib-apa': {
    description: 'Taylor & Francis Interact (APA): natbib loaded with longnamesfirst and sort, \\bibpunct[, ]{(}{)}{;}{a}{,}{,}, a 10pt list, and a hand-written list of author-year \\bibitem[Author(Year)]{key} entries.',
    writes: '\\usepackage[longnamesfirst,sort]{natbib} \\bibpunct[, ]{(}{)}{;}{a}{,}{,} \\renewcommand\\bibfont{…}; \\begin{thebibliography}{} \\bibitem[…(…)]{…} … \\end{thebibliography}',
    features: ['author-year', 'hand-written', 'small-type'],
    params: { widest: '', labels: 'natbib', longnamesfirst: true, natbibSort: true, bibpunct: '[, ]{(}{)}{;}{a}{,}{,}', bibFont: '\\fontsize{10}{12}\\selectfont' },
    evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0207-tandf-interact/interactapasample.tex', line: '12-14, 438-566' }, { kind: 'compile', reproducer: 'unit 46 (2026-11-07), ZeroTeX-NG through class-examples/typeset-dir.ts: scratchpad build/work/bib-ext/thebib-interact/main.tex under interact.cls (copied from Source/0207-tandf-interact), ok, (Knuth, 1984) and Knuth (1984) from the \\bibitem[{Knuth(1984)}] label' }],
  },
} as const satisfies { readonly [name: string]: Preset };
