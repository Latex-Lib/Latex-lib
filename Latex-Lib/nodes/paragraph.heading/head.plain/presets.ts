/**
 * head.plain's presets, each from the class example that writes it.
 */
import type { Preset } from '../../../schema/params.ts';

const src = (file: string, line: string) => ({ kind: 'source', file: `Latex Related Research/Latex-Template-Examples/${file}`, line }) as const;

export const PRESETS = {
  letter: {
    description: "A letter's bold run-in head, \\noindent\\textbf{Main result.} and the paragraph running on after it, unnumbered, with no skip but the letter's paragraph skip.",
    features: ['run-in-head', 'bold-head', 'unnumbered'],
    params: {},
    evidence: [
      src('class.letter/main.tex', '127 (\\noindent\\textbf{Main result.} The central identity …), 149 (\\noindent\\textbf{Contributions.} In short, …)'),
      { kind: 'requirement', file: 'Template/template-requirement/Letter.md', line: '81' },
    ],
  },
  numbered: {
    description: "The minimal class's numbered hand-set head: \\bigskip, then \\noindent{\\large\\bfseries 1\\quad Introduction}\\par, then \\medskip; the number from the way's own section counter, so \\label and \\ref work.",
    writes: '\\par\\bigskip \\noindent\\refstepcounter{section}{\\large\\bfseries \\thesection\\quad …}\\par \\label{…} \\medskip',
    features: ['block-head', 'bold-head', 'numbered'],
    params: { form: 'display', numbers: true, before: '\\bigskip' },
    evidence: [
      src('class.minimal/main.tex', '145-147, 164-166, 219-221 (\\bigskip \\noindent{\\large\\bfseries 1\\quad Introduction}\\par \\medskip), 48 (\\providecommand{\\large})'),
    ],
  },
  unnumbered: {
    description: "The minimal class's unnumbered hand-set head, \\bigskip\\noindent{\\large\\bfseries References}\\par\\medskip, as its reference list's heading is written.",
    writes: '\\par\\bigskip \\noindent{\\large\\bfseries …}\\par \\medskip',
    features: ['block-head', 'bold-head', 'unnumbered'],
    params: { form: 'display', before: '\\bigskip' },
    evidence: [src('class.minimal/main.tex', '103 (\\defbibheading{bibliography}[\\refname]{\\par\\bigskip\\noindent{\\large\\bfseries #1}\\par\\medskip})')],
  },
} as const satisfies { readonly [name: string]: Preset };
