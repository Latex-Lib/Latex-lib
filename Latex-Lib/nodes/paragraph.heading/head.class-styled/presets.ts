/**
 * head.class-styled's presets, each from the templates that use it (the research's Solution files and their sources).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  ctex: {
    description:
      'ctex\'s chapter keys, as a ctexbook thesis sets them: the chapter title centred in 3-hao heiti, "第 N 章" with an arabic number, the space before and after set (\\ctexset{chapter={format=\\centering\\zihao{3}\\heiti, name={第,章}, number=\\arabic{chapter}, beforeskip=-10pt, afterskip=20pt}}).',
    writes: '\\chapter[…]{…} \\label{…}; \\ctexset{chapter={format=…,name={…,…},number=…,beforeskip=…,afterskip=…}}',
    features: ['class-styled', 'centered', 'chapter-opening', 'numbered'],
    params: { interface: 'ctex', level: 'chapter', format: '\\centering\\zihao{3}\\heiti', name: '第,章', number: '\\arabic{chapter}', beforeSkip: '-10pt', afterSkip: '20pt' },
    evidence: [
      solution('0677-cqjtuthesis', '47'),
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0677-cqjtuthesis/tex/cqjtuthesis.cls', line: '171-179' },
    ],
  },
  'ctex-section': {
    description:
      "ctex's section keys, as a ctexbook thesis sets them: section heads in 4-hao bold heiti, ragged right, 2em before and 1em after (\\ctexset{section={format=\\heiti\\zihao{4}\\bfseries\\raggedright, beforeskip=2em, afterskip=1em}}).",
    writes: '\\section[…]{…} \\label{…}; \\ctexset{section={format=…,beforeskip=…,afterskip=…}}',
    features: ['class-styled', 'bold-head', 'numbered'],
    params: { interface: 'ctex', level: 'section', format: '\\heiti\\zihao{4}\\bfseries\\raggedright', beforeSkip: '2em', afterSkip: '1em' },
    evidence: [
      solution('0624-houluy-buptemplate', '23'),
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0624-houluy-buptemplate/buptthesis.cls', line: '274-298' },
    ],
  },
  jlreq: {
    description:
      "jlreq's own heading keys: section heads in huge bold sans-serif, flush left with no space after the number (\\ModifyHeading{section}{font={\\Huge\\bfseries\\sffamily},indent=0pt,after_label_space=0pt}).",
    writes: '\\section[…]{…} \\label{…}; \\ModifyHeading{section}{font={…},indent=…,after_label_space=…}',
    features: ['class-styled', 'sans-serif', 'bold-head'],
    params: { interface: 'jlreq', level: 'section', format: '\\Huge\\bfseries\\sffamily', indent: '0pt', afterLabelSpace: '0pt' },
    evidence: [
      solution('0529-jlreq', '24'),
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0529-jlreq/README-template.tex', line: '11-12' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0529-jlreq/jlreq.cls', line: '3286-3311 (\\ModifyHeading)' },
    ],
  },
  koma: {
    description:
      "KOMA-Script's chapter redeclared (\\RedeclareSectionCommand[beforeskip=-1pt,afterskip=4em plus 1pt minus 1pt]{chapter}), an unnumbered chapter or section set with \\addchap or \\addsec so it still enters the contents and the running head (a Preface), and fourth-level heads as KOMA's \\minisec. scrbook and scrreprt.",
    writes: '\\chapter[…]{…} \\label{…} | \\addchap{…} | \\addsec{…} | \\minisec{…}; \\RedeclareSectionCommand[beforeskip=…,afterskip=…]{chapter}',
    features: ['class-styled', 'chapter-opening', 'in-contents'],
    params: { interface: 'koma', level: 'chapter', beforeSkip: '-1pt', afterSkip: '4em plus 1pt minus 1pt', unnumberedInContents: true, minisecLevel: 'paragraph' },
    evidence: [
      solution('0205-amcos-conference-booklet', '47'),
      solution('0540-koma-script-book', '36'),
      solution('0907-timkpaine-oreilly-latex-template', '23'),
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0205-amcos-conference-booklet/preamble_booklet.tex', line: '77-82' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0540-koma-script-book/main.tex', line: '18 (\\addchap{Preface})' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0907-timkpaine-oreilly-latex-template/packtpub.tex', line: '368, 381 (\\minisec)' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0020-koma-script/scrkernel-sections.dtx', line: '3085 (\\RedeclareSectionCommand), 5697 (\\addchap), 6151 (\\addsec), 6191 (\\minisec)' },
    ],
  },
  'koma-section': {
    description:
      "KOMA-Script's section redeclared tight and in the text size, on a line of its own (\\RedeclareSectionCommand[beforeskip=4pt,afterskip=0pt,runin=false,font=\\normalsize]{section}). scrartcl, scrreprt, scrbook.",
    writes: '\\section[…]{…} \\label{…}; \\RedeclareSectionCommand[beforeskip=…,afterskip=…,runin=…,font=…]{section}',
    features: ['class-styled', 'compact-spacing', 'numbered'],
    params: { interface: 'koma', level: 'section', format: '\\normalsize', beforeSkip: '4pt', afterSkip: '0pt', runIn: 'false' },
    evidence: [
      solution('0306-martinx3-educationorganization-hbrs-late', '43'),
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0306-martinx3-educationorganization-hbrs-late/aussehen/hbrs-inf.sty', line: '63-79' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
