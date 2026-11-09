import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const SOURCE = 'Latex Related Research/Latex-lib-main/Source';

export default defineKey(
  minimal({
    id: 'front.center-block',
    node: 'paragraph/title',
    description:
      "A title banner set by hand in a center (or flushleft) environment at the top of the first page, with no \\maketitle and no page of its own: the title in its font, an optional subtitle, the authors (with affiliation superscripts when there are several affiliations), one line per affiliation, the e-mails, extra lines such as the course and student number joined by \\quad, and the date only when the paper gives one. A poster's banner (a0poster's \\veryHuge) or a Chinese homework head (ctex's \\zihao{1}).",
    writes: '\\begin{center} {\\Huge\\bfseries …\\par} \\vspace{…} {\\large …\\par} \\vspace{…} {\\LARGE …\\textsuperscript{n}, …\\par} \\vspace{…} {\\large \\textsuperscript{n}…\\par} {\\normalsize\\ttfamily …, …\\par} {… \\quad …\\par} {…\\par} \\end{center}',
    ctan: ['latex-base'],
    features: ['centered', 'bold-head'],
    params: {
      align: { type: 'enum', values: ['center', 'left'], default: 'center', description: 'the banner centred (center environment) or flush left (flushleft)' },
      titleFont: { type: 'tex', default: '\\Huge\\bfseries', description: "the title's font (\\veryHuge\\bfseries under a0poster, \\zihao{1}\\bfseries under ctex)" },
      subtitleFont: { type: 'tex', default: '\\large', description: "the subtitle's font (templateSpecific.subtitle)" },
      authorFont: { type: 'tex', default: '\\LARGE', description: "the authors' font; '' for the body size" },
      affilFont: { type: 'tex', default: '\\large', description: "the affiliation lines' font; '' for the body size" },
      emailFont: { type: 'tex', default: '\\normalsize\\ttfamily', description: "the e-mail line's font" },
      titleGap: { type: 'dimen', default: '1em', description: 'the space under the title and under the subtitle' },
      authorGap: { type: 'dimen', default: '0.5em', description: 'the space under the authors' },
      emails: {
        type: 'enum',
        values: ['corresponding', 'all', 'none'],
        default: 'corresponding',
        description: "the e-mail line: the corresponding author's when templateSpecific.correspondingAuthor names one (else every author's), every author's, or none",
      },
    },
    fields: ['author.email', 'affiliation.department', 'affiliation.name', 'affiliation.address', 'templateSpecific.subtitle', 'templateSpecific.titleLines', 'templateSpecific.correspondingAuthor'],
    presets: PRESETS,
    // The poster and ctex sizes are the class's own commands: \veryHuge is new in a0poster (a0poster.cls l.168), \zihao is ctex's.
    requiresWhen: [
      { when: { titleFont: '\\veryHuge\\bfseries' }, requires: ['cmd:\\veryHuge'] },
      { when: { titleFont: '\\zihao{1}\\bfseries' }, requires: ['cmd:\\zihao'] },
    ],
    onlyWhen: [
      {
        when: { titleFont: '\\veryHuge\\bfseries' },
        classes: ['class.a0poster'],
        reason: 'a0poster defines \\veryHuge (\\newcommand, a0poster.cls l.168) for its poster sizes; under any other class it is an undefined control sequence',
        evidence: [{ kind: 'source', file: `${SOURCE}/0526-a0poster/a0poster.cls`, line: '158-170' }],
      },
      {
        when: { titleFont: '\\zihao{1}\\bfseries' },
        classes: ['class.ctexart', 'class.ctexrep', 'class.ctexbook', 'class.ctexbeamer'],
        reason: "\\zihao is ctex's command for the Chinese type sizes, defined by the ctex classes; under another class it is an undefined control sequence",
        evidence: [{ kind: 'source', file: `${SOURCE}/0958-ecnu-homework/main.tex`, line: '34-40 (under ctexart)' }],
      },
    ],
    deny: [
      {
        class: 'class.minimal',
        reason: "the kernel minimal class sets a page size and \\normalsize only (minimal.cls 2001/05/25): the banner's \\Huge, \\LARGE and \\large are undefined control sequences",
        evidence: [
          { kind: 'compile', cell: 'class-examples: Latex Related Research/Latex-Template-Examples/_results/class.minimal.sample.log (2026-11-06), "Undefined control sequence" at {\\Huge, {\\Large, {\\large in a hand-set title (front.titlepage-env\'s evidence)' },
          { kind: 'source', file: 'minimal.cls (LaTeX base, 2001/05/25)', line: '34 (\\ProvidesClass{minimal}; no size commands but \\normalsize)' },
        ],
      },
    ],
    // Typeset ok on ZeroTeX-NG (2026-11-07, class-examples typeset-dir): generic under article (with and without a subtitle and extra lines,
    // centred and flush left), a0poster under a0poster, ctex under ctexart[fontset=fandol] with Chinese lines, each 1 page, no error.
    targetEngine: 'yes',
  }),
);
