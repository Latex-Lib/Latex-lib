/**
 * front.titlepage-env's presets, each from the templates that use it (`node seed.ts front --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const SOURCE = 'Latex Related Research/Latex-lib-main/Source';
const TEMPLATES = 'Latex Related Research/Latex-Template-Examples';

export const PRESETS = {
  centered: {
    description: 'A title page laid out by hand in the titlepage environment: the title huge and bold, the authors and date under it, centred.',
    features: ['title-page', 'centered'],
    params: {},
    evidence: [solution('0076-utlis-llls-depp-thesis-template', '34'), solution('0062-sp5lma-ee-dyplom', '55')],
  },
  ruled: {
    description: 'The title between two rules the width of the line (\\rule{\\linewidth}{0.4pt} above and below).',
    writes: '\\begin{titlepage} \\centering \\rule{\\linewidth}{0.4pt}\\par {…\\par} \\rule{\\linewidth}{0.4pt}\\par \\vspace{2em} {…\\par} \\vspace{1em} {…\\par} \\end{titlepage}',
    features: ['title-page', 'centered', 'ruled'],
    params: { rules: true },
    evidence: [solution('0006-gsemthesis', '50'), solution('0086-shakthi-kannan-tamil-english-xelatex-boo', '53')],
  },
  spread: {
    description: 'The title a third of the way down and the authors and date pushed to the foot of the page (\\vspace*{0.3\\textheight}, \\vfill).',
    writes: '\\begin{titlepage} \\centering \\vspace*{…} {…\\par} \\vfill {…\\par} \\vspace{1em} {…\\par} \\end{titlepage}',
    features: ['title-page', 'centered'],
    params: { topSpace: '0.3\\textheight', spread: true },
    evidence: [solution('0037-hilbert', '62'), solution('0086-shakthi-kannan-tamil-english-xelatex-boo', '53')],
  },
  'left-sans': {
    description: 'A flush-left title page in bold sans-serif.',
    writes: '\\begin{titlepage} \\raggedright {\\Huge\\sffamily\\bfseries …\\par} \\vspace{2em} {…\\par} \\vspace{1em} {…\\par} \\end{titlepage}',
    features: ['title-page', 'sans-serif', 'bold-head'],
    params: { align: 'left', titleFont: '\\Huge\\sffamily\\bfseries' },
    evidence: [solution('0053-zhanghai-zju-csse-undergraduate-design-l', '75')],
  },
  fields: {
    description: "A report's title page with the template's rows: the institution and the kind of document over the title, the supervisor under the authors (\"Supervisor: …\"), the date at the foot.",
    writes: '\\begin{titlepage} \\centering {\\Large …\\par} {\\Large …\\par} \\vspace{2em} {\\Huge\\bfseries …\\par} \\vspace{2em} {\\Large … \\\\ …\\par} \\vspace{1em} {\\large Supervisor: …\\par} \\vspace{1em} {\\large …\\par} \\end{titlepage}',
    features: ['title-page', 'centered'],
    params: { above: 'institution; documentType', below: 'Supervisor=supervisor' },
    evidence: [
      { kind: 'source', file: `${TEMPLATES}/class.ctexrep/main.tex`, line: '126-140 (the university and "Course Project Report" over the title, "Supervisor: …" under the student, \\today)' },
      { kind: 'source', file: `${SOURCE}/0226-princeton-senior-thesis-title-page-start/main.tex`, line: '1 (report: "Senior Thesis" and the department over the title, the degree statement, the name, \\today)' },
      { kind: 'source', file: `${SOURCE}/0952-isel-thesis-cover-starter/main.tex`, line: '1 (report: the institution and the programme over the title, "Supervisor / Orientador:" under it, the place and \\today)' },
    ],
  },
  'thesis-cover': {
    description: 'A Chinese thesis cover: the degree line over the title, then at the foot of the page labelled rows with the value underlined in a fixed width (作者姓名：\\underline{\\makebox[8cm][c]{…}}): the author, student number, department, research area, supervisor and date.',
    writes: '\\begin{titlepage} \\centering {\\Huge …\\par} \\vspace{2cm} {\\Huge\\bfseries …\\par} \\vfill \\vspace{1em} {\\LARGE …：\\underline{\\makebox[8cm][c]{…}}\\\\ …：\\underline{\\makebox[8cm][c]{…}}\\par} \\end{titlepage}',
    features: ['title-page', 'centered'],
    params: {
      above: 'degreeLine',
      aboveFont: '\\Huge',
      aboveSpace: '2cm',
      spread: true,
      people: false,
      rows: '作者姓名=authors; 学~~~~~~~号=studentId; 所在系部=affiliation.department; 研究方向=researchArea; 导师姓名=supervisor; 提交时间=date',
      rowSep: '：',
      ruleWidth: '8cm',
    },
    evidence: [
      { kind: 'source', file: `${SOURCE}/0578-monetjoe-latex-paper-templates/finalversion.tex`, line: '3 (ctexbook), 39 (\\fixeduline: \\uline{\\makebox[8cm]{…}}), 59-79 (the degree line, the title, \\vfill, six labelled underlined rows)' },
      { kind: 'source', file: `${SOURCE}/0987-twtstudio-tjuthesislatextemplate/Thesis/setup/format.tex`, line: '268-306 (the cover rows: label & \\underline{\\makebox[5cm][c]{…}})' },
    ],
  },
  titlingpage: {
    description: "A hand-laid title page in memoir's titlingpage environment: the title a little way down, the subtitle under it, the authors pushed to the foot with the affiliations under them in small type.",
    writes: '\\begin{titlingpage} \\centering \\vspace*{1.1in} {\\Huge\\bfseries …\\par} \\vspace{0.5em} {\\Large …\\par} \\vfill {\\Large …\\par} \\vspace{0.5em} {\\small …\\par} \\vspace{1em} {\\large …\\par} \\end{titlingpage}',
    features: ['title-page', 'centered'],
    params: { env: 'titlingpage', topSpace: '1.1in', spread: true, subtitle: true, affiliations: true },
    evidence: [
      { kind: 'source', file: `${SOURCE}/0901-makyo-building-a-book/main.tex`, line: '21-29 (memoir: \\begin{titlingpage}\\centering\\vspace*{1.1in}{\\Huge\\bfseries …\\par}{\\Large …\\par}\\vfill{\\Large Author Name\\par}{\\small …\\par}\\end{titlingpage})' },
      { kind: 'source', file: `${SOURCE}/0185-memhfixc/memoir.dtx`, line: '8459-8467 (\\newenvironment{titlingpage}, \\aliaspagestyle{titlingpage}{empty})' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
