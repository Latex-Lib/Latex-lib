/**
 * doc.page-headers's presets, one per class family's interface, each from the templates that use it.
 */
import type { Preset } from '../../../schema/params.ts';

const SRC = (file: string, line: string) => ({ kind: 'source', file: `Latex Related Research/Latex-lib-main/Source/${file}`, line }) as const;
const EXAMPLE = (file: string, line: string) => ({ kind: 'source', file: `Latex Related Research/Latex-Template-Examples/${file}`, line }) as const;

export const PRESETS = {
  koma: {
    description:
      "KOMA's running heads through scrlayer-scrpage: automatic marks, the template's label on the inner side of the head, the current section on the outer side, the page number centred in the foot, a rule under the head (\\usepackage[automark,headsepline]{scrlayer-scrpage} \\clearpairofpagestyles \\ihead{…} \\ohead{\\headmark} \\cfoot{\\pagemark} \\pagestyle{scrheadings}).",
    writes: "\\usepackage[automark,headsepline]{scrlayer-scrpage} \\clearpairofpagestyles \\ihead{…} \\ohead{\\headmark} \\cfoot{\\pagemark} \\pagestyle{scrheadings}",
    features: ['class-styled', 'ruled'],
    params: { form: 'koma', automark: true, headLeft: "Master's thesis", headRight: '\\headmark', footCenter: '\\pagemark', headRule: '0.4pt' },
    evidence: [
      SRC('0370-aremju-latex-template/main.tex', '84-92 (\\usepackage[automark]{scrlayer-scrpage}, \\clearpairofpagestyles, \\ihead, \\ohead{\\headmark}, \\cfoot{\\pagemark}, \\pagestyle{scrheadings}), 95 (headsepline=true)'),
      SRC('0306-martinx3-educationorganization-hbrs-late/aussehen/hbrs-inf.sty', '86-91 (headsepline, \\ihead*, \\ofoot*{\\pagemark}, \\addtokomafont{pagehead})'),
      SRC('0020-koma-script/scrlayer-scrpage.dtx', '2255-2343 (\\ihead … \\cfoot), 2471 (\\clearpairofpagestyles)'),
    ],
  },
  fancyhdr: {
    description:
      "fancyhdr's running heads on an article: the head cleared, the template's labels small at the left and right of the head, the page number centred in the foot, a 14pt head height (\\usepackage{fancyhdr} \\pagestyle{fancy} \\fancyhf{} \\fancyhead[L]{…} \\fancyhead[R]{…} \\fancyfoot[C]{\\thepage}).",
    writes: '\\usepackage{fancyhdr} \\pagestyle{fancy} \\fancyhf{} \\fancyhead[L]{…} \\fancyhead[R]{…} \\fancyfoot[C]{\\thepage} \\setlength{\\headheight}{…}',
    features: ['ruled'],
    params: { form: 'fancyhdr', headLeft: '\\small Laboratory notebook', headRight: '\\small Daily entry', footCenter: '\\thepage', headHeight: '14pt' },
    evidence: [SRC('0050-laboratory-notebook-daily-entry/main.tex', '7-10 (\\pagestyle{fancy}\\fancyhf{}, \\fancyhead[L], \\fancyhead[R], \\fancyfoot[C]{\\thepage}, \\headheight 14pt)'), SRC('0017-hit-report/main.tex', '9-11 (\\fancyhf{} \\lhead{…} \\rhead{\\thepage})')],
  },
  'fancyhdr-short-title': {
    description:
      "fancyhdr's running head carrying the paper's short title and running author: the short title centred in small capitals, the authors left and the page right, no head rule (\\fancyhead[C]{\\LatexLibShortTitle}); the two macros are \\providecommand-ed empty, for a title way to define.",
    writes: '\\providecommand{\\LatexLibShortTitle}{} \\providecommand{\\LatexLibRunningAuthor}{} \\usepackage{fancyhdr} \\pagestyle{fancy} \\fancyhf{} \\fancyhead[L]{…} \\fancyhead[C]{…\\LatexLibShortTitle} \\fancyhead[R]{\\thepage} \\renewcommand{\\headrulewidth}{0pt}',
    features: ['smallcaps-head'],
    params: { form: 'fancyhdr', headLeft: '\\small\\LatexLibRunningAuthor', headCenter: '\\scshape\\small\\LatexLibShortTitle', headRight: '\\thepage', headRule: '0pt', headHeight: '14pt' },
    evidence: [SRC('0222-sara-venkatraman-latex-templates/Research Paper/Main.tex', '169-172 (\\chead{\\MakeUppercase{\\scriptsize Short paper title}} \\lhead{} \\rhead{})')],
  },
  memoir: {
    description: "memoir's own ruled page style: the chapter and section marks in the head over a rule, the page number in the foot (\\pagestyle{ruled}).",
    writes: '\\pagestyle{ruled}',
    features: ['class-styled', 'ruled'],
    params: { form: 'memoir', memoirStyle: 'ruled' },
    evidence: [EXAMPLE('class.memoir/main.tex', '45 (\\pagestyle{ruled})'), SRC('0185-memhfixc/memoir.dtx', '7317 (ruled), 7391 (Ruled), 7413 (companion)')],
  },
  'memoir-custom': {
    description:
      "A page style of the template's own, built with memoir's commands: the label left and the marks right in the head over a rule, the page number centred in the foot, heads in mixed case (\\makepagestyle{running} \\makeevenhead … \\makeoddfoot … \\makeheadrule … \\nouppercaseheads \\pagestyle{running}).",
    writes: '\\makepagestyle{…} \\makeevenhead{…}{…}{…}{…} \\makeoddhead{…}{…}{…}{…} \\makeevenfoot{…}{…}{…}{…} \\makeoddfoot{…}{…}{…}{…} \\makeheadrule{…}{\\textwidth}{…} \\nouppercaseheads \\pagestyle{…}',
    features: ['ruled'],
    params: { form: 'memoir', memoirStyle: 'custom', styleName: 'running', headLeft: 'Thesis', headRight: '\\rightmark', footCenter: '\\thepage', headRule: '0.4pt', uppercaseHeads: false },
    evidence: [SRC('0185-memhfixc/memoir.dtx', '6203 (\\makeheadrule), 6538 (\\makepagestyle), 6890 (\\nouppercaseheads)'), SRC('0740-gandalfsaxe-laursens-xelatex-thesis-temp/preamble/general.tex', '211 (\\pagestyle{myruled} after \\makepagestyle)')],
  },
  jlreq: {
    description:
      "jlreq's page style of the template's own: the journal's name and volume centred in the head, the page number (nombre) centred in the foot, both small (\\NewPageStyle{transactions}{running_head_position=top-center, running_head_font=\\small, odd_running_head={…}, nombre_position=bottom-center, nombre_font=\\small} \\pagestyle{transactions}).",
    writes: '\\NewPageStyle{…}{running_head_position=…, running_head_font=…, odd_running_head={…}, nombre_position=…, nombre_font=…} \\pagestyle{…}',
    features: ['class-styled', 'centered'],
    params: { form: 'jlreq', styleName: 'transactions', runningHead: '例示学会論文誌\\quad Vol.~X, No.~X', runningHeadPosition: 'top-center', headFont: '\\small', nombrePosition: 'bottom-center', nombreFont: '\\small' },
    evidence: [EXAMPLE('class.jlreq/main.tex', '47-54'), SRC('0529-jlreq/jlreq.cls', '5208-5223 (\\NewPageStyle, \\RenewPageStyle, \\ModifyPageStyle)')],
  },
  exam: {
    description:
      "exam's head-and-foot page style: the course, the exam's name with page n of N, and the term in the running head over a rule, the page count centred in the foot (\\pagestyle{headandfoot} \\runningheader{…}{…}{…} \\runningheadrule \\footer{}{Page \\thepage\\ of \\numpages}{}); the first page's header is the title way's (front.exam-cover).",
    writes: '\\pagestyle{headandfoot} \\runningheader{…}{…}{…} \\runningheadrule \\footer{…}{…}{…}',
    features: ['class-styled', 'ruled'],
    params: { form: 'exam', headLeft: 'Course', headCenter: 'Final Examination, page \\thepage\\ of \\numpages', headRight: 'Summer Term', headRule: '0.4pt', footCenter: 'Page \\thepage\\ of \\numpages' },
    evidence: [EXAMPLE('class.exam/main.tex', '48-53 (\\pagestyle{headandfoot}, \\runningheader, \\runningheadrule, \\firstpagefooter, \\runningfooter)'), SRC('0355-sexam/bacex.sty', '70-79')],
  },
  empty: {
    description: "No running head or page number on any page (\\pagestyle{empty}): USENIX's camera-ready papers carry no page numbers.",
    writes: '\\pagestyle{empty}',
    features: [],
    params: { form: 'empty' },
    evidence: [{ kind: 'requirement', file: 'Template/template-requirement/USENIX.md', line: "32 ('Camera-ready papers should have no page numbers', usenix2019_v3.sty:64-66), 123" }],
  },
} as const satisfies { readonly [name: string]: Preset };
