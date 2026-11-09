/**
 * head.titlesec's presets, each from the templates that use it (`node seed.ts head --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  'sans-colored': {
    description: 'Journal headings: sans-serif bold in an accent colour, one size down (sections in \\large), the section title upper-cased, half an em after the number, tighter space below.',
    writes: '\\section[…]{…} \\label{…}; \\titleformat{\\section}[…]{…}{\\thesection}{…}{\\MakeUppercase} \\titlespacing*{\\section}{…}{…}{…}',
    features: ['hang-head', 'sans-serif', 'bold-head', 'colored', 'uppercase', 'numbered'],
    // One size down (`scale: 'smaller'`): the two templates that upper-case the section title set it in \large, not the kernel's
    // \Large (0012 olplainarticle.cls:67-79, `\color{color1}\large\sffamily\bfseries`, `\MakeUppercase{#1}`; 0016 rho.cls:376-413,
    // sf \large bold, `\MakeUppercase{#1}`), and their subsections at the text size (0012 l.80-85). Upper case at \Large widened
    // every word: in run 41584963423, 457 sans-colored branches failed only on overfull boxes on their heading line (A 375, B 82),
    // all but 16 of them marked, and the headings of other branches its \titleformat restyled failed so 9.7% of the time in
    // setup A, against 5.1% for headings in documents without it (b22 NOTE-4).
    params: { font: '\\normalfont\\sffamily\\bfseries', scale: 'smaller', color: 'blue!50!black', uppercase: true, sep: '0.5em', spacing: 'custom', before: '3ex plus 4pt minus 3pt', after: '5pt' },
    evidence: [solution('0012-basic-academic-journal-article', '51'), solution('0016-rho-class-research-article', '66'), solution('0021-elife', '40'), solution('0042-jankapunkt-master-thesis', '48')],
  },
  'cv-ruled': {
    description: 'CV and résumé sections: small capitals flush left, no number, a rule under the title (\\titlerule), close spacing.',
    writes: '\\section[…]{…} \\label{…}; \\titleformat{\\section}[…]{…}{}{…}{}[{\\titlerule[…]}] \\titlespacing*{\\section}{…}{…}{…}',
    features: ['hang-head', 'smallcaps-head', 'ruled', 'unnumbered'],
    // \raggedright as the templates set it (0028-prometheuscv prometheus_cv.cls:10, 0220-jitinnair1-autocv cv.tex:81, 0177-danielteles
    // en/main.tex:47): titlesec justifies a title otherwise, and the display \part title in \Huge small capitals ran past the line (copy
    // batch-3b, 5 pairs: 63 of 236 full-width cells, against 3 of about 300 for the kernel's or class's \part; e.g. d559c1d3bd9b2daec98bc
    // result b7e3494d5d l.86, 140.4pt). Column cells (the \Huge small-caps \colorbox is wider than a 172.5pt column) and the \Huge
    // inline-maths cells stay.
    params: { font: '\\normalfont\\scshape\\raggedright', label: 'none', sep: '0em', rule: 'below', spacing: 'custom', before: '10pt', after: '6pt' },
    evidence: [solution('0028-prometheuscv', '41'), solution('0220-jitinnair1-autocv', '42'), solution('0177-danielteles-ats-friendly-latex-cv', '40'), solution('0065-deepdave98-latex-resume-and-cv-templates', '42'), solution('0273-cookybooky', '38')],
  },
  'centered-block': {
    description: 'Centred headings set as a block, the number with a dot (1. Title), one size down.',
    features: ['block-head', 'centered', 'bold-head', 'numbered'],
    params: { shape: 'block', align: 'center', scale: 'smaller', label: 'number-dot', sep: '0.3cm' },
    evidence: [solution('0183-fphw-assignment', '40'), solution('0221-c1ydehhx-ntut-thesis-template', '57'), solution('0053-zhanghai-zju-csse-undergraduate-design-l', '47')],
  },
  'display-chapter': {
    description: 'Chapters in display shape, "Chapter N" over the title, every title centred and in small capitals at the class sizes.',
    features: ['display-head', 'centered', 'smallcaps-head', 'numbered'],
    params: { chapterShape: 'display', align: 'center', font: '\\normalfont\\scshape' },
    evidence: [solution('0037-hilbert', '54'), solution('0184-emersonmello-modelos-latex', '89'), solution('0180-simple-thesis-dissertation', '51')],
  },
  'run-in': {
    description: 'Sections as usual; subsections and below run into their paragraph, bold, the number with a dot.',
    features: ['hang-head', 'run-in-head', 'bold-head', 'numbered'],
    params: { runIn: 'subsection', label: 'number-dot', sep: '1mm' },
    evidence: [solution('0030-seu-ml-assign', '53'), solution('0183-fphw-assignment', '41'), solution('0293-avinal-resume', '50')],
  },
  compact: {
    description: 'Cheat sheets and dense notes: one size down and little space above and below each heading.',
    writes: '\\section[…]{…} \\label{…}; \\titleformat{\\section}[…]{…}{\\thesection}{…}{} \\titlespacing*{\\section}{…}{…}{…}',
    features: ['hang-head', 'bold-head', 'compact-spacing', 'numbered'],
    params: { scale: 'smaller', spacing: 'compact' },
    evidence: [solution('0101-datemultical', '47'), solution('0156-evan715823-cheatsheet-generator-skill', '44'), solution('0297-marcelomijas-econometrics-cheatsheet', '41'), solution('0193-shenzhouhong-latex-essay', '40')],
  },
  italic: {
    description: 'Italic headings in the normal weight, the class sizes, a full em after the number.',
    features: ['hang-head', 'italic-head', 'numbered'],
    params: { font: '\\normalfont\\itshape' },
    evidence: [solution('0037-hilbert', '55')],
  },
} as const satisfies { readonly [name: string]: Preset };
