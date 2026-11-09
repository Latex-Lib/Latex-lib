/**
 * front.ieeeaccess's presets: IEEE Access's title block as its starter writes it, and the same with the space under the
 * title block changed through the class's \titlepgskip.
 */
import type { Preset } from '../../../schema/params.ts';

const CLS = 'Template/templates/ieee-access/files/ieeeaccess.cls';

export const PRESETS = {
  access: {
    description:
      "IEEE Access's title block: the history line and DOI above the blue title, the upper-case names with their affiliation marks and (grades), the numbered addresses with e-mails, the corresponding author and funding lines, then the boxed ABSTRACT and INDEX TERMS, set across both columns once the abstract is written.",
    features: ['class-styled', 'uppercase'],
    params: {},
    evidence: [
      { kind: 'source', file: 'Template/templates/ieee-access/starter.tex', line: '1-23 (\\doi{}, \\title, \\author{\\uppercase{…}\\authorrefmark{1}, …}, \\address[1]{… (e-mail: …)}, \\corresp, abstract and keywords, then \\maketitle)' },
      { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.ieeeaccess/main.tex', line: '97-117 (\\history, \\doi, \\IEEEmembership, \\tfootnote, \\markboth, \\corresp)' },
      { kind: 'compile', reproducer: "\\documentclass{ieeeaccess} (Template/templates/ieee-access/files) with graphicx: the preset's preamble and body on the title sample, \\begin{abstract}…\\end{abstract} \\section{Intro} … \\EOD: ok, the title block on page 1 with the abstract and index terms (ZeroTeX-NG, 2026-11-07)" },
    ],
  },
  titlepgskip: {
    description: "IEEE Access's title block with the space the class leaves under it changed by \\titlepgskip (here pulled up by 21pt), as a paper tunes the first page.",
    writes:
      '\\history{…} \\doi{…} \\title{…} \\author{\\uppercase{…}\\authorrefmark{1}, \\IEEEmembership{…}, and \\uppercase{…}\\authorrefmark{1,2}} \\address[1]{… (e-mail: …)} \\tfootnote{…} \\markboth{… \\headeretal: …}{… \\headeretal: …} \\corresp{Corresponding author: … (e-mail: …).} \\begin{keywords} … \\end{keywords} \\titlepgskip=… \\maketitle',
    features: ['class-styled', 'uppercase'],
    params: { titlepgskip: '-21pt' },
    evidence: [
      { kind: 'source', file: CLS, line: '661-662 (\\newskip\\titlepgskip, 0pt), 691 (\\vspace*{\\titlepgskip} after the title box in \\fixSkip)' },
      { kind: 'compile', reproducer: "as the access preset, with \\titlepgskip=-21pt before the deferred \\maketitle: ok (ZeroTeX-NG, 2026-11-07)" },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
