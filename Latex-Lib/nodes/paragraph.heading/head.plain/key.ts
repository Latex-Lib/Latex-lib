import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'head.plain',
    node: 'paragraph/heading',
    description:
      "A heading set by hand, for the classes with no sectioning commands (letter, minimal): a bold run-in head that the next paragraph continues, \\noindent\\textbf{Main result.} … (a letter), or a bold head on a line of its own between skips, \\bigskip\\noindent{\\large\\bfseries 1\\quad Introduction}\\par\\medskip, numbered by counters of the way's own so \\label and \\ref still work (the minimal class's technical note).",
    writes: '\\par\\noindent\\textbf{…} … | \\par\\bigskip \\noindent\\refstepcounter{section}{\\large\\bfseries \\thesection\\quad …}\\par \\label{…} \\medskip',
    ctan: ['latex-base'],
    features: ['run-in-head', 'block-head', 'bold-head', 'numbered', 'unnumbered'],
    params: {
      form: {
        type: 'enum',
        values: ['runin', 'display'],
        default: 'runin',
        description: "'runin': \\noindent\\textbf{Title.} and the next paragraph runs on after it; 'display': the head on a line of its own, {size\\bfseries …}\\par, between the `before` and `after` skips. Paragraph and subparagraph levels are always run in",
      },
      numbers: {
        type: 'boolean',
        default: false,
        description: "number sections, subsections and subsubsections (\\refstepcounter on counters the way declares where the class has none: section, subsection within it, subsubsection within that), the number before the title; a heading marked unnumbered, a part and a chapter stay unnumbered",
      },
      size: { type: 'tex', default: '\\large', description: "the display form's size for a section (a part or chapter one step larger); provided where the class lacks it" },
      subSize: { type: 'tex', default: '', description: "the display form's size for a subsection and subsubsection; '' the text size" },
      before: { type: 'tex', default: '', description: "the skip before the head (\\bigskip, \\medskip); '' none, the paragraph skip alone" },
      after: { type: 'tex', default: '\\medskip', description: "the skip after a display head; '' none" },
      numberSep: { type: 'tex', default: '\\quad', description: 'between the number and the title' },
      punctuation: { type: 'string', default: '.', description: "what closes a run-in head inside its bold ('.' as in 'Main result.'), left out when the title already ends in punctuation" },
    },
    presets: PRESETS,
    // The counters it declares when numbering, each guarded (\ifcsname c@…), so a class or way that has them keeps its own.
    defines: [
      { name: 'counter:section', when: { numbers: true } },
      { name: 'counter:subsection', when: { numbers: true } },
      { name: 'counter:subsubsection', when: { numbers: true } },
    ],
    // Nothing of the class: \noindent, \textbf, \bfseries, \bigskip, \medskip, \quad, \refstepcounter and \label are the kernel's,
    // and a size command the class lacks (minimal defines \normalsize alone, minimal.cls l.36) is provided in the preamble as the
    // minimal class's own example does (Latex-Template-Examples/class.minimal/main.tex l.44-50).
    requires: [],
    // Only for the classes without sectioning commands; every other class has the kernel's \section and a heading way of its own.
    // letter.cls defines no \section (Template/template-requirement/Letter.md l.79-85); minimal.cls defines nothing but \normalsize.
    only: ['class.letter', 'class.minimal'],
    needs: { paragraph: true },
    // Typeset ok on ZeroTeX-NG (2026-11-07): the run-in head under letter (inside its letter environment, the next paragraph run on),
    // the numbered display heads (section, subsection, \ref to both) and the unnumbered display head under minimal with \large provided.
    targetEngine: 'yes',
  }),
);
