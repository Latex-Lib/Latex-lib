/**
 * meta.hyperref's presets, each from the templates that use it (`node seed.ts meta --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  boxed: {
    description: "hyperref's own look: \\href{url}{text}, links framed by thin coloured boxes on screen, not printed.",
    features: ['linked', 'boxed-links'],
    params: {},
    evidence: [solution('0001-digital-minimal', '68')],
  },
  colored: {
    description: 'Links in colour instead of boxes, every kind blue (colorlinks, linkcolor, citecolor, urlcolor=blue).',
    writes: '\\href{…}{…}; \\hypersetup{colorlinks=true, linkcolor=…, citecolor=…, urlcolor=…}',
    features: ['linked', 'colored-links'],
    params: { look: 'colored', linkColor: 'blue', citeColor: 'blue', urlColor: 'blue' },
    evidence: [solution('0017-hit-report', '33'), solution('0016-rho-class-research-article', '51')],
  },
  'black-internal': {
    description: 'Internal links black, web and citation links in an accent colour (colorlinks, linkcolor=black, urlcolor and citecolor coloured).',
    writes: '\\href{…}{…}; \\hypersetup{colorlinks=true, linkcolor=…, citecolor=…, urlcolor=…}',
    features: ['linked', 'colored-links'],
    params: { look: 'colored', linkColor: 'black', citeColor: 'blue!60!black', urlColor: 'blue!60!black' },
    evidence: [solution('0006-gsemthesis', '44'), solution('0003-ucsmonograph', '53')],
  },
  hidden: {
    description: 'Links that work but show nothing, no boxes and no colour (hidelinks).',
    writes: '\\href{…}{…}; \\hypersetup{hidelinks}',
    features: ['linked'],
    params: { look: 'hidden' },
    evidence: [solution('0014-daniel-wambua-cv', '46')],
  },
  // b-unit-55: the CVPR author kit's own line, every option at hyperref's load and the colour defined by the template.
  cvpr: {
    description:
      "The CVPR author kit's links: hyperref loaded with pagebackref, breaklinks and colorlinks, every kind of link one colour defined beside it (\\definecolor{cvprblue}{rgb}{0.21,0.49,0.74}, allcolors=cvprblue).",
    writes: '\\href{…}{…}; \\definecolor{…}{rgb}{…} \\usepackage[pagebackref,breaklinks,colorlinks,allcolors=…]{hyperref}',
    features: ['linked', 'colored-links'],
    params: { look: 'colored', keysIn: 'options', backref: 'pagebackref', breaklinks: true, allColor: 'cvprblue', defineRgb: '0.21,0.49,0.74' },
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.cvpr/main.tex', line: '72-75 (\\definecolor{cvprblue}{rgb}{0.21,0.49,0.74}, \\usepackage[pagebackref,breaklinks,colorlinks,allcolors=cvprblue]{hyperref})' },
      { kind: 'compile', cell: 'batch 4 round 1, aamas.A dcd7b2c2949a8e6203db2 cell c5cfa286aba1e5e3b3109 result aa2d67ce8335a8ea0eb32e2a2665f309227c545076f34bb5bc76c87281e1ad6e: "! LaTeX Error: Option clash for package hyperref." (aamas loaded it with [bookmarksnumbered,unicode]); every class that loads hyperref itself is unfit for its load-time options (key loads)' },
    ],
  },
  // b-unit-55: a class that loads hyperref itself (mdpi, at \begin{document}): the way loads nothing and keeps the class's look.
  'class-loaded': {
    description:
      "Links by the hyperref the class loads itself, in the class's own look (MDPI's colorlinks in bluecite): \\href{url}{text} with no \\usepackage{hyperref} and no \\hypersetup.",
    features: ['linked', 'class-styled'],
    params: { load: false, look: 'class' },
    evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/Definitions/mdpi.cls', line: '442-522 (\\hyperrefpackage: \\RequirePackage[…colorlinks=true, linkcolor=bluecite…]{hyperref}, run in \\AddToHook{begindocument/before})' }],
  },
} as const satisfies { readonly [name: string]: Preset };
