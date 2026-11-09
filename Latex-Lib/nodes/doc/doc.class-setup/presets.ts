/**
 * doc.class-setup's presets, one per class's set-up commands, each from the templates or the class source that use it.
 */
import type { Preset } from '../../../schema/params.ts';

const SRC = (file: string, line: string) => ({ kind: 'source', file: `Latex Related Research/Latex-lib-main/Source/${file}`, line }) as const;
const EXAMPLE = (file: string, line: string) => ({ kind: 'source', file: `Latex Related Research/Latex-Template-Examples/${file}`, line }) as const;

export const PRESETS = {
  memoir: {
    description:
      "memoir's own page layout and spacing: margins of 3.5cm at the spine and 2.5cm at the edge, 2.5cm above and 3cm below, the layout checked, one-and-a-half line spacing (\\setlrmarginsandblock{…}{…}{*} \\setulmarginsandblock{…}{…}{*} \\checkandfixthelayout \\OnehalfSpacing).",
    writes: '\\setlrmarginsandblock{…}{…}{*} \\setulmarginsandblock{…}{…}{*} \\checkandfixthelayout \\OnehalfSpacing',
    features: ['class-styled'],
    params: { form: 'memoir', spine: '3.5cm', edge: '2.5cm', upper: '2.5cm', lower: '3cm', spacing: 'onehalf' },
    evidence: [EXAMPLE('class.memoir/main.tex', '41-44'), SRC('0185-memhfixc/memoir.dtx', '4634 (\\settrimmedsize), 4705 (\\setlrmarginsandblock), 5513 (\\checkandfixthelayout), 7735 (\\OnehalfSpacing)')],
  },
  'memoir-trimmed': {
    description: "A trade book's trimmed page under memoir: a 9in by 6in page, the margins set, the layout checked, single spacing (\\settrimmedsize{9in}{6in}{*} … \\checkandfixthelayout \\SingleSpacing).",
    writes: '\\settrimmedsize{…}{…}{*} \\setlrmarginsandblock{…}{…}{*} \\setulmarginsandblock{…}{…}{*} \\checkandfixthelayout \\SingleSpacing',
    features: ['class-styled'],
    params: { form: 'memoir', trimHeight: '9in', trimWidth: '6in', spine: '2cm', edge: '1.5cm', upper: '2cm', lower: '2cm', spacing: 'single' },
    evidence: [SRC('0901-makyo-building-a-book/main.tex', '11-14'), SRC('0185-memhfixc/memoir.dtx', '4634')],
  },
  jlreq: {
    description: "jlreq's own settings: the abstract set with \\maketitle and captions small (\\jlreqsetup{abstract_with_maketitle=true, caption_font=\\small}).",
    writes: '\\jlreqsetup{…=…, …}',
    features: ['class-styled'],
    params: { form: 'jlreq', jlreqSettings: 'abstract_with_maketitle=true, caption_font=\\small' },
    evidence: [SRC('0529-jlreq/jlreq.cls', '437-445 (\\jlreqsetup, \\@onlypreamble), 5314-5317 (caption keys), 5604-5609 (abstract_with_maketitle)')],
  },
  ctex: {
    description: "ctex's names and date: today's date in the old Chinese form and the contents titled 目 录 with a quad between the characters (\\ctexset{today=old, contentsname={目\\quad 录}}).",
    writes: '\\ctexset{today=…, contentsname={…}, …}',
    features: ['class-styled'],
    params: { form: 'ctex', ctexToday: 'old', contentsName: '目\\quad 录', ctexKeys: 'listfigurename={图目录}, listtablename={表目录}' },
    evidence: [SRC('0624-houluy-buptemplate/buptthesis.cls', '236-238 (\\ctexset{today = old}), 300-304 (contentsname, listfigurename, listtablename)')],
  },
  achemso: {
    description: "achemso's switches: section numbers on, and the keywords and abbreviations printed after the abstract (\\SectionNumbersOn \\setkeys{acs}{keywords=true, abbreviations=true}).",
    writes: '\\SectionNumbersOn \\setkeys{acs}{…=…, …}',
    features: ['class-styled', 'numbered'],
    params: { form: 'achemso', sectionNumbers: 'on', acsKeys: 'keywords=true, abbreviations=true' },
    evidence: [SRC('0528-achemso/achemso.dtx', '313-338 (the acs keys), 1955-1968 (\\SectionNumbersOff, \\SectionNumbersOn)')],
  },
  'sn-jnl': {
    description: 'Springer Nature journal headings unnumbered throughout (\\unnumbered).',
    writes: '\\unnumbered',
    features: ['class-styled', 'unnumbered'],
    params: { form: 'sn-jnl', numbered: false },
    evidence: [{ kind: 'requirement', file: 'Template/template-requirement/Springer_Nature_SN_Jnl.md', line: '54 (\\unnumbered in the preamble turns all numbering off, cls:878)' }],
  },
  spie: {
    description: "SPIE's proceedings page as the template sets it: single line spacing, no page numbers, the first page numbered 301 (\\renewcommand{\\baselinestretch}{1.0} \\pagestyle{empty} \\setcounter{page}{301}).",
    writes: '\\renewcommand{\\baselinestretch}{…} \\pagestyle{…} \\setcounter{page}{…}',
    features: ['class-styled'],
    params: { form: 'spie', baselineStretch: '1.0', pageStyle: 'empty', firstPage: '301' },
    evidence: [EXAMPLE('class.spie/main.tex', '39, 103-105'), { kind: 'requirement', file: 'Template/template-requirement/SPIE_Proceedings.md', line: '28, 95' }],
  },
  tufte: {
    description: "Tufte-LaTeX's margin fonts: side notes, margin notes and captions in small sans-serif (\\setsidenotefont{…} \\setmarginnotefont{…} \\setcaptionfont{…}).",
    writes: '\\setsidenotefont{…} \\setmarginnotefont{…} \\setcaptionfont{…} \\setcitationfont{…}',
    features: ['class-styled', 'sans-serif', 'small-type'],
    params: { form: 'tufte', sidenoteFont: '\\footnotesize\\sffamily', marginnoteFont: '\\footnotesize\\sffamily', captionFont: '\\footnotesize\\sffamily' },
    evidence: [SRC('0793-xtufte/latex/xtufte-common.def', '489-500 (\\setsidenotefont, \\setcaptionfont, \\setmarginnotefont, \\setcitationfont)')],
  },
  jacow: {
    description: "JACoW's title block spacing: 3pt above the title block, 1em in it and 1em after it (\\setlength\\titleblockstartskip{3pt} \\setlength\\titleblockmiddleskip{1em} \\setlength\\titleblockendskip{1em}).",
    writes: '\\setlength{\\titleblockstartskip}{…} \\setlength{\\titleblockmiddleskip}{…} \\setlength{\\titleblockendskip}{…}',
    features: ['class-styled'],
    params: { form: 'jacow', titleblockStartSkip: '3pt', titleblockMiddleSkip: '1em', titleblockEndSkip: '1em' },
    evidence: [{ kind: 'source', file: 'template-lib-based-automation/Latex-Lib/classes/jacow.ts', line: '38, 50 (jacow.cls l.388-398, the title block lengths)' }],
  },
  letter: {
    description: "The standard letter's layout: the closing and signature flush left, mailing labels after the letters, later pages headed with the recipient, date and page (\\setlength{\\longindentation}{0pt} \\makelabels \\pagestyle{headings}).",
    writes: '\\setlength{\\longindentation}{…} \\makelabels \\pagestyle{headings}',
    features: ['class-styled'],
    params: { form: 'letter', longIndentation: '0pt', makelabels: true, pageStyle: 'headings' },
    evidence: [
      SRC('0366-simpletexcv/cover_letter.tex', "64 (\\longindentation=0pt, 'needed to get closing flush left')"),
      { kind: 'source', file: 'TinyTeX texmf-dist/tex/latex/base/letter.cls', line: '115-133 (headings), 163-171 (\\makelabels, \\@onlypreamble), 216-220 (\\longindentation)' },
      { kind: 'requirement', file: 'Template/template-requirement/Letter.md', line: '51-52, 76-77' },
    ],
  },
  elsarticle: {
    description: "elsarticle's title-block switches: a page break after the abstract, the keyword heading 'Key words', and a centred preprint footer in small italics (\\newpageafter{abstract} \\keywordtitle{…} \\myfooter[C]{…} \\myfooterfont{…}).",
    writes: '\\newpageafter{…} \\keywordtitle{…} \\keywordtitlesep{…} \\myfooter[…]{…} \\myfooterfont{…}',
    features: ['class-styled', 'page-break-before'],
    params: { form: 'elsarticle', newpageafter: 'abstract', keywordTitle: 'Key words', footer: 'Preprint submitted to the journal', footerAlign: 'C', footerFont: '\\footnotesize\\itshape' },
    evidence: [SRC('0107-elsarticle/elsarticle.dtx', '808-812 (\\keywordtitle, \\keywordtitlesep), 855-861 (\\newpageafter), 1093-1101 (\\myfooter, \\myfooterfont)'), SRC('0107-elsarticle/doc/elsdoc.tex', '455-476')],
  },
  'exam-answers': {
    description: "exam's answer key: the solutions printed, framed, under the template's own title (\\printanswers \\framedsolutions \\renewcommand{\\solutiontitle}{\\noindent\\textbf{Model answer:}\\enspace}).",
    writes: '\\printanswers \\framedsolutions \\renewcommand{\\solutiontitle}{\\noindent\\textbf{…}\\enspace}',
    features: ['class-styled', 'framed'],
    params: { form: 'exam', printAnswers: true, solutionStyle: 'framed', solutionTitle: 'Model answer:' },
    evidence: [EXAMPLE('class.exam/main.tex', '37 (\\printanswers, commented out), 59 (\\solutiontitle)'), SRC('0429-ndpvt-web-latex-document-skill/assets/templates/exam.tex', '5-12')],
  },
  'exam-points': {
    description: "exam's points: called marks, bracketed after each question, and each question headed bold with its marks at the right (\\pointpoints{mark}{marks} \\bracketedpoints \\qformat{…}).",
    writes: '\\pointpoints{…}{…} \\bracketedpoints \\qformat{…}',
    features: ['class-styled', 'custom-labels'],
    params: { form: 'exam', pointName: 'mark', pointsName: 'marks', pointPlacement: 'bracketed', questionFormat: '\\textbf{Question \\thequestion}\\hfill\\textbf{[\\totalpoints\\ marks]}' },
    evidence: [EXAMPLE('class.exam/main.tex', '56-58'), SRC('0355-sexam/bacex.sty', '55-68')],
  },
  ltxdoc: {
    description: "ltxdoc's index and change history: cross-references on, the index by code line, changes recorded, and the change history and index printed at the end (\\EnableCrossrefs \\CodelineIndex \\RecordChanges \\AtEndDocument{\\PrintChanges\\PrintIndex}).",
    writes: '\\EnableCrossrefs \\CodelineIndex \\RecordChanges \\AtEndDocument{\\PrintChanges \\PrintIndex}',
    features: ['class-styled'],
    params: { form: 'ltxdoc', crossrefs: 'enable', indexBy: 'codeline', recordChanges: true, printChanges: true, printIndex: true },
    evidence: [SRC('0577-latex-base-dev/doc.dtx', '3084 (\\EnableCrossrefs), 4249 (\\PrintIndex), 4423 (\\RecordChanges), 4547 (\\PrintChanges), 5250 (\\CodelineIndex)')],
  },
} as const satisfies { readonly [name: string]: Preset };
