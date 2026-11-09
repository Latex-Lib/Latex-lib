/**
 * front.author-blocks' presets, each from the templates and kits that write it. Paths are under
 * `template-lib-based-automation/Latex Related Research/` (Latex-Template-Examples/, Latex-lib-main/Source/).
 */
import type { Preset } from '../../../schema/params.ts';

const src = (file: string, line: string) => ({ kind: 'source', file, line }) as const;
const EX = 'Latex Related Research/Latex-Template-Examples';
const SRC = 'Latex Related Research/Latex-lib-main/Source';

export const PRESETS = {
  thanks: {
    description:
      "Each author's affiliations and e-mail in a \\thanks footnote after the name, authors joined by \\and, and the keywords as a bold run-in line at the abstract's end (article, extarticle, book).",
    writes: '\\title{…} \\author{…\\thanks{…. \\texttt{…}} \\and …\\thanks{…}} \\date{…} \\AddToHookNext{env/abstract/end}{\\par\\noindent\\textbf{Keywords:} …} \\maketitle',
    features: ['centered'],
    params: { affiliationForm: 'thanks', emailAt: 'thanks', emailForm: 'texttt', keywordsAt: 'inside-abstract' },
    evidence: [src(`${EX}/class.article/main.tex`, '110-112 (\\thanks with affiliation and e-mail), 124-125 (Keywords line ending the abstract)'), src(`${EX}/class.extarticle/main.tex`, '98-101, 107-113'), src(`${SRC}/0168-temat-article/main.tex`, '12')],
  },
  'thanks-jlreq': {
    description: "The \\thanks form with jlreq's Japanese keyword label (キーワード：) at the abstract's end.",
    writes: '\\title{…} \\author{…\\thanks{…} \\and …\\thanks{…}} \\date{…} \\AddToHookNext{env/abstract/end}{\\par\\noindent\\textbf{キーワード：} …} \\maketitle',
    features: ['centered'],
    params: { affiliationForm: 'thanks', emailAt: 'thanks', emailForm: 'texttt', keywordsAt: 'inside-abstract', keywordsLabel: 'キーワード：', keywordsJoin: '，' },
    evidence: [src(`${EX}/class.jlreq/main.tex`, '104-108 (\\author{…\\thanks{…} \\and …\\thanks{…}}), 119-120 (キーワード： inside the abstract)'), src(`${SRC}/0529-jlreq/jlreq.cls`, '5527-5556 (\\maketitle with \\fnsymbol \\thanks marks)')],
  },
  lines: {
    description: "Each author's department, institution and address on \\\\ lines under the name in \\small, then the e-mail in \\texttt; authors joined by \\and (article, report, ctexrep).",
    writes: '\\title{…} \\author{… \\\\ \\small … \\\\ \\small … \\\\ \\small \\texttt{…} \\and …} \\date{…} \\maketitle',
    features: ['centered'],
    params: { affiliationForm: 'lines', detailsFont: '\\small', emailAt: 'line', emailForm: 'texttt' },
    evidence: [src(`${SRC}/0252-aalok-devanagari-journal/main.tex`, '12 (\\author{…\\\\\\small …\\\\\\small\\texttt{…}})'), src(`${SRC}/0042-jankapunkt-master-thesis/simple/main.tex`, '218-226 (report: name, department, university, town, e-mail on \\\\ lines)')],
  },
  'subtitle-line': {
    description: 'Names only, joined by \\and, with the subtitle under the title in \\Large inside \\title (extbook, ctexart).',
    writes: '\\title{… \\\\ {\\Large …}} \\author{… \\and …} \\date{…} \\maketitle',
    features: ['centered', 'title-page'],
    params: { affiliationForm: 'none', emailAt: 'none', subtitle: 'line', subtitleFont: '\\Large' },
    evidence: [src(`${EX}/class.extbook/main.tex`, '135-138 (\\title{…\\\\[1ex] \\Large …}, \\author{… \\and …})'), src(`${SRC}/0167-chinese-and-english-article/main.tex`, '7-10 (\\title{…\\\\ \\zihao{-3}…})')],
  },
  'memoir-degree': {
    description: "memoir's thesis title: the author's e-mail in \\thanks, the degree line and the department lines in \\normalsize under the name, the keywords at the abstract's end.",
    writes: '\\title{…} \\author{…\\thanks{…} \\\\ \\normalsize … \\\\ \\normalsize … \\and …} \\date{…} \\AddToHookNext{env/abstract/end}{\\par\\noindent\\textbf{Keywords:} …} \\maketitle',
    features: ['centered'],
    params: { affiliationForm: 'lines', affiliationLines: 'joined', detailsFont: '\\normalsize', emailAt: 'thanks', emailForm: 'texttt', degreeLine: true, keywordsAt: 'inside-abstract' },
    evidence: [src(`${EX}/class.memoir/main.tex`, '83-87 (\\author{Name\\\\[1ex] \\normalsize A thesis submitted …\\\\ \\normalsize Department …}), 100-101 (Keywords line)')],
  },
  ltxdoc: {
    description: "ltxdoc's package manual title: a \\thanks note on the title, each author with the e-mail in \\texttt on a line under the name, and \\MaintainedBy's boxed maintainer note.",
    writes: '\\title{…\\thanks{…}} \\author{… \\\\ \\texttt{…} \\and …} \\date{…} \\MaintainedBy{…} \\maketitle',
    features: ['centered'],
    params: { affiliationForm: 'none', emailAt: 'line', emailForm: 'texttt', titleNote: true, maintainedBy: true },
    evidence: [src(`${SRC}/0567-clicks/clicks.dtx`, '57-61 (title \\thanks; \\author{Name \\\\ \\texttt{email}})'), src(`${SRC}/0577-latex-base-dev/ltxdoc.dtx`, '598-611 (\\MaintainedBy), 614-638 (\\@maketitle)'), src(`${SRC}/0896-ncccropmark/source/manyfoot.dtx`, '41-46')],
  },
  proc: {
    description: "proc's two-column title: affiliations and e-mail in \\thanks, then \\copyrightspace, the blank copyright box at the foot of the first column.",
    writes: '\\title{…} \\author{…\\thanks{…} \\and …} \\date{…} \\maketitle \\copyrightspace',
    features: ['centered'],
    params: { affiliationForm: 'thanks', emailAt: 'thanks', emailForm: 'texttt', copyrightSpace: true },
    evidence: [src(`${SRC}/0577-latex-base-dev/proc.dtx`, '128-132 (\\copyrightspace after the title notes), 359-382 (\\maketitle: \\fnsymbol thanks marks), 407-415 (\\def\\copyrightspace)')],
  },
  jacow: {
    description:
      "JACoW's author lines: authors grouped by their first affiliation, each name with its e-mail in \\thanks, the institution after the names on the same line, groups on lines of their own, a second affiliation as a numbered 'also at' line, the funding note in \\thanks on the title.",
    writes: '\\title{…\\thanks{…}} \\author{…\\thanks{…}, …\\textsuperscript{1}\\thanks{…}, … \\\\ …\\thanks{…}, … \\\\ \\textsuperscript{1}also at …} \\date{…} \\maketitle',
    features: ['class-styled'],
    params: { affiliationForm: 'inline', grouping: 'firstAffiliation', nameJoin: 'comma', separator: 'newline', emailAt: 'thanks', emailForm: 'plain', titleNote: true },
    evidence: [{ kind: 'source', file: 'Latex-Lib/classes/jacow.ts', line: '25 (article base: the kernel \\author and \\thanks), 38, 47 (\\copyrightspace)' }],
  },
  cvpr: {
    description:
      "CVPR's author block: authors with the same affiliations in one block, names joined by \\qquad, the institution and address on \\\\ lines, the e-mails in {\\tt\\small …} sharing a domain as \\{a,b\\}@domain, blocks joined by \\and, and the paper ID the review copy prints.",
    writes: '\\title{…} \\author{… \\qquad … \\\\ … \\\\ … \\\\ {\\tt\\small …} \\and …} \\date{…} \\def\\paperID{…} \\maketitle',
    features: ['class-styled'],
    params: { affiliationForm: 'lines', grouping: 'shared', nameJoin: 'qquad', emailAt: 'line', emailForm: 'tt-small', emailCompress: true, paperID: true, date: 'none' },
    evidence: [src(`${SRC}/0097-wk910930-paper-template/CVPR/cvpr_2017/egpaper_final.tex`, '30-46'), src(`${SRC}/0031-nhatkhangcs-overleaf-comments/examples/cvpr/cvpr.sty`, '279-308 (\\@author in a centred tabular; Paper ID \\paperID in review mode)'), src(`${SRC}/0973-apoorvkh-cvpr-latex-template/_constants.tex`, '1, 7-13')],
  },
  iclr: {
    description:
      "ICLR's and COLM's author blocks: co-affiliated authors in one block ('A, B \\& C'), department, university and address on \\\\ lines, e-mails as \\texttt{\\{a,b\\}@domain}; blocks joined by \\And, with \\AND starting a new line after every two.",
    writes: '\\title{…} \\author{…, … \\& … \\\\ … \\\\ … \\\\ … \\\\ \\texttt{\\{…,…\\}@…} \\\\ \\And … \\\\ \\AND …} \\maketitle',
    features: ['class-styled'],
    params: { affiliationForm: 'lines', grouping: 'shared', nameJoin: 'comma-amp', emailAt: 'line', emailForm: 'texttt', emailCompress: true, separator: 'And-AND', perLine: 2, date: 'none' },
    evidence: [src(`${SRC}/0596-iclr/iclr2026_conference.tex`, '18-44'), src(`${SRC}/0031-nhatkhangcs-overleaf-comments/examples/iclr/iclr2027_conference.sty`, '83-102 (\\And and \\AND inside \\@maketitle)'), src(`${EX}/class.colm/main.tex`, '76-98')],
  },
  'and-blocks': {
    description: "NeurIPS's and ACL's author blocks: one block per author, name, department, institution, address and \\texttt e-mail on \\\\ lines, blocks joined by \\And.",
    writes: '\\title{…} \\author{… \\\\ … \\\\ … \\\\ … \\\\ \\texttt{…} \\\\ \\And … \\\\ \\texttt{…}} \\maketitle',
    features: ['class-styled'],
    params: { affiliationForm: 'lines', grouping: 'per-author', emailAt: 'line', emailForm: 'texttt', separator: 'And-AND', perLine: 0, date: 'none' },
    evidence: [src(`${SRC}/0506-neurips/neurips_2026.tex`, '64-111'), src(`${SRC}/0506-neurips/neurips_2026.sty`, '344-351 (\\And, \\AND)'), src(`${SRC}/0031-nhatkhangcs-overleaf-comments/examples/arr/acl.sty`, '129-159 (\\outauthor tabular; \\And, \\AND)')],
  },
  usenix: {
    description: "USENIX's title: no date, the title in \\Large\\bf, each author as {\\rm name} with the affiliation on one \\\\ line, joined by \\and, no e-mail.",
    writes: '\\title{\\Large \\bf …} \\author{{\\rm …} \\\\ … \\and {\\rm …} \\\\ …} \\date{} \\maketitle',
    features: ['class-styled'],
    params: { titleFont: '\\Large \\bf', nameFont: '\\rm', affiliationForm: 'lines', affiliationLines: 'joined', emailAt: 'none', date: 'none' },
    evidence: [src(`${EX}/class.usenix/main.tex`, '102-117'), { kind: 'requirement', file: 'Template/template-requirement/USENIX.md', line: 'Front matter and review/final settings (usenix2019_v3.2.tex l.87-105)' }],
  },
} as const satisfies { readonly [name: string]: Preset };
