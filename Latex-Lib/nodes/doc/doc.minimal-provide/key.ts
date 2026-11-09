import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'doc.minimal-provide',
    node: 'doc',
    description:
      "What the kernel's minimal class leaves out, supplied in the preamble: the type sizes (\\tiny to \\Huge, as \\providecommand at 10pt), \\today, a titlepage environment, " +
      "the list margins, labels and spacing of the first two levels, and the footnote spacing and layout (article's \\@makefntext where none is defined). minimal defines only \\normalsize and a 6.5in by 8in text block, so text set in \\small, " +
      'a list, a footnote or a title page stops or prints unspaced under it without these.',
    writes:
      '\\providecommand{\\small}{\\fontsize{…}{…}\\selectfont} … \\providecommand{\\today}{…} \\@ifundefined{titlepage}{\\newenvironment{titlepage}{…}{…}}{} \\setlength{\\leftmargini}{2.5em} … \\def\\@listi{…} \\providecommand{\\labelitemi}{…} \\setlength{\\footnotesep}{6.65pt} \\@ifundefined{@makefntext}{\\long\\def\\@makefntext#1{…}}{}',
    ctan: ['latex-base'],
    features: [],
    params: {
      sizes: { type: 'boolean', default: false, description: 'provide \\tiny, \\scriptsize, \\footnotesize, \\small, \\large, \\Large, \\LARGE, \\huge and \\Huge at the 10pt sizes' },
      today: { type: 'boolean', default: false, description: 'provide \\today (the kernel defines it; the template provides it in case)' },
      titlepage: { type: 'boolean', default: false, description: 'define a titlepage environment where none exists: a page of its own with no page style' },
      lists: { type: 'boolean', default: false, description: "the first two list levels' margins, label widths, spacing and labels" },
      footnotes: { type: 'boolean', default: false, description: "the footnote spacing (\\footnotesep 6.65pt, \\skip\\footins 9pt plus 4pt minus 2pt) and, where none is defined, article's footnote text layout (\\@makefntext)" },
    },
    presets: PRESETS,
    only: ['class.minimal'],
    // It provides names only where they are missing (\providecommand, \@ifundefined), so it defines nothing a class already has.
    defines: [
      { name: 'env:titlepage', when: { titlepage: true } },
    ],
    // Typeset ok under minimal with the minimal preset (ZeroTeX-NG, 2026-11-07): every size, a titlepage, two list levels, an
    // enumerate and a footnote.
    targetEngine: 'yes',
  }),
);
