/**
 * front.beamer-title's presets, each from the decks that use it.
 */
import type { Preset } from '../../../schema/params.ts';

const SOURCE = 'Latex Related Research/Latex-lib-main/Source';
const TITLE_STY = 'beamerbasetitle.sty (beamer 2026/08/20 v3.78, TinyTeX texmf-dist/tex/latex/beamer)';

export const PRESETS = {
  titlepage: {
    description: "beamer's title data in the preamble (\\title[short], \\subtitle, \\author with \\inst, \\institute with the e-mails under each institute, \\date, \\subject, \\keywords) and \\titlepage in the title's frame.",
    features: ['class-styled', 'title-page', 'centered'],
    params: {},
    evidence: [
      { kind: 'source', file: `${SOURCE}/0803-sjtu-beamer/main.tex`, line: '8-23 (ctexbeamer: \\title, \\subtitle, \\author, \\institute, \\date in the preamble; \\begin{frame} \\titlepage \\end{frame})' },
      { kind: 'source', file: `${SOURCE}/0132-sjtug-sjtubeamer/main.tex`, line: '123-131 (\\author, \\institute[SJTUG]{…}, \\date, \\subject, \\keywords, \\title[short]{…}, \\subtitle in the preamble)' },
      { kind: 'source', file: TITLE_STY, line: '29 (\\titlepage), 80-83 (\\subtitle), 118 (\\date[short]), 146-148 (\\author[short], \\inst, \\and), 213-216 (\\subject, \\keywords), 227-239 (\\institute[short], \\inst, \\and)' },
    ],
  },
  maketitle: {
    description: "beamer's title data in the preamble and \\maketitle, which makes the title frame itself (\\frame{\\titlepage}) outside a frame and is \\titlepage inside one.",
    writes: '\\title[…]{…} \\subtitle{…} \\author[…]{…\\inst{…} \\and …} \\institute[…]{\\inst{…} … \\\\ \\texttt{…} \\and \\inst{…} …} \\date[…]{…} \\subject{…} \\keywords{…} \\maketitle',
    features: ['class-styled', 'title-page', 'centered'],
    params: { titlePage: 'maketitle' },
    evidence: [
      { kind: 'source', file: `${SOURCE}/0276-beamer-fuberlin/doc/exampleTheme.tex`, line: '8-14 (\\title, \\subtitle, \\author{…\\inst{1} \\and …\\inst{2}}, \\institute{\\inst{1}BTO \\and \\inst{2}ZEDAT}, \\date, \\maketitle)' },
      { kind: 'source', file: `${SOURCE}/0132-sjtug-sjtubeamer/main.tex`, line: '155 (\\maketitle outside a frame)' },
      { kind: 'source', file: TITLE_STY, line: '21 (\\def\\maketitle{\\ifbeamer@inframe\\titlepage\\else\\frame{\\titlepage}\\fi})' },
    ],
  },
  'author-emails': {
    description: "beamer's title data with each author's e-mail (and ORCID, linked) under the name in \\author, the authors still side by side; the names alone in the short author for the footline.",
    writes:
      '\\title[…]{…} \\author[… \\and …]{\\texorpdfstring{\\begin{tabular}[t]{@{}c@{}}…\\inst{…} \\\\ \\texttt{…} \\\\ \\href{https://orcid.org/…}{\\texttt{…}}\\end{tabular}}{…} \\and …} \\institute{\\inst{…} … \\and …} \\date{…} \\titlepage',
    features: ['class-styled', 'title-page', 'centered'],
    params: { emails: 'author', orcid: 'href' },
    evidence: [
      { kind: 'source', file: TITLE_STY, line: '146-158 (\\author: \\inst a superscript on the title page, gobbled with \\thanks in the short author and the PDF author)' },
      { kind: 'source', file: `${SOURCE}/0751-samcarter-beamertheme-tcolorbox/beamertheme-tcolorbox-doc.tex`, line: '34-39 (\\author{\\texorpdfstring{\\texttt{…}\\\\ \\url{…}}{samcarter}}: lines under the name, the PDF author the name)' },
      { kind: 'source', file: `${SOURCE}/0957-dloubach-research-plan-templates/beamer-slides/presentation.tex`, line: '22-26 (\\author[Surname, Name]{… \\\\ … email@provider.br}: the e-mail under the name, the short author the name)' },
    ],
  },
  'no-emails': {
    description: "beamer's title data with no e-mail anywhere: the names with \\inst, the institutes alone.",
    writes: '\\title[…]{…} \\subtitle{…} \\author[…]{…\\inst{…} \\and …} \\institute[…]{\\inst{…} … \\and \\inst{…} …} \\date[…]{…} \\titlepage',
    features: ['class-styled', 'title-page', 'centered'],
    params: { emails: 'none' },
    evidence: [
      { kind: 'source', file: `${SOURCE}/0276-beamer-fuberlin/doc/exampleTheme.tex`, line: '10-11 (names with \\inst, institutes with no e-mail)' },
      { kind: 'source', file: `${SOURCE}/0803-sjtu-beamer/main.tex`, line: '15-16 (one author, one institute, no e-mail)' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
