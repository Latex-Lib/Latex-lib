/**
 * box.class-native's presets, each from the templates and class sources that use it.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  'beamer-by-tone': {
    description: "beamer's blocks drawn by the theme, picked by the note's tone: \\begin{block}{title} for info, alertblock for a warning, exampleblock for a tip.",
    writes: '\\begin{block|alertblock|exampleblock}{…} … \\end{block|alertblock|exampleblock}',
    features: ['class-styled', 'title-bar', 'colored'],
    params: {},
    evidence: [
      solution('0418-beamertheme-csh', '23, 33'),
      solution('0918-beamertheme-mirage', '50'),
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0418-beamertheme-csh/example-csh.tex', line: '34-44 (block, alertblock, exampleblock)' },
    ],
  },
  'beamer-block': {
    description: "beamer's plain block for every note, \\begin{block}{title} … \\end{block}, in the theme's block colours whatever the tone.",
    writes: '\\begin{block}{…} … \\end{block}',
    features: ['class-styled', 'title-bar'],
    params: { env: 'block' },
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0803-sjtu-beamer/main.tex', line: '80 (\\begin{block}{主要结论})' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0106-kmbeamer-blackboard/main.tex', line: '57' },
    ],
  },
  'beamer-alert': {
    description: "beamer's alerted block for every note, \\begin{alertblock}{title} … \\end{alertblock}, in the theme's alerted colours.",
    writes: '\\begin{alertblock}{…} … \\end{alertblock}',
    features: ['class-styled', 'title-bar', 'colored'],
    params: { env: 'alertblock' },
    evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0132-sjtug-sjtubeamer/contents/introduction.tex', line: '73-91 (alertblock)' }],
  },
  oup: {
    description: "Oxford University Press (oup-authoring-template) text box: \\begin{boxtext}[title], numbered 'Box n' in bold before the title, between two 6pc half rules, indented 8pt on both sides; headings inside become box headings.",
    writes: '\\begin{boxtext}[…] … \\par\\leftskip0pt\\rightskip0pt \\end{boxtext}',
    features: ['class-styled', 'numbered', 'ruled', 'breakable'],
    params: { env: 'boxtext' },
    evidence: [
      solution('0914-oup-authoring-template', '74'),
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0914-oup-authoring-template/oup-authoring-template.tex', line: '631-644 (\\begin{boxtext}[Box title])' },
    ],
  },
  'memoir-framed': {
    description: "memoir's own framed environment: a rule all round that splits across pages, the title in bold on its first line.",
    writes: '\\begin{framed} {\\bfseries …\\par} … \\end{framed}',
    features: ['framed', 'breakable'],
    params: { env: 'framed' },
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0512-formation-latex-ul/source/bibliographie.tex', line: '231, 248, 261 (\\begin{framed} in the memoir-class book formation-latex-ul.tex)' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0185-memhfixc/memoir.dtx', line: '30894-30896' },
    ],
  },
  'memoir-shaded': {
    description: "memoir's shaded environment: a light grey back (shadecolor black!10) with no rule, splitting across pages, the title in bold on its first line.",
    writes: '\\begin{shaded} {\\bfseries …\\par} … \\end{shaded}; \\colorlet{shadecolor}{…}',
    features: ['background', 'breakable'],
    params: { env: 'shaded' },
    evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0185-memhfixc/memoir.dtx', line: '30898-30901 (\\colorbox{shadecolor})' }],
  },
  'memoir-leftbar': {
    description: "memoir's leftbar environment: a 3pt rule down the left of the text, splitting across pages, the title in bold on its first line.",
    writes: '\\begin{leftbar} {\\bfseries …\\par} … \\end{leftbar}',
    features: ['left-rule', 'breakable'],
    params: { env: 'leftbar' },
    evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0185-memhfixc/memoir.dtx', line: '30903-30906 (\\vrule width 3pt \\hspace{10pt})' }],
  },
} as const satisfies { readonly [name: string]: Preset };
