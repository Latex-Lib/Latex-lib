/**
 * front.tufte's presets, each from the templates that use it.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

/** Tufte-LaTeX's own handout template: \title[A Short Title]{…}, \author[The Authors]{First Author and Second Author}, \date{\today}, \maketitle. */
const HANDOUT = { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.tufte-handout/main.tex', line: '58-62, 66' } as const;
/** xtufte's sample handout: \author[The Tufte-LaTeX Developers]{…\thanks{hvoss@tug.org}}. */
const SAMPLE_HANDOUT = { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0793-xtufte/doc/sample-handout.tex', line: '27-29' } as const;
/** The title page: \maketitlepage sets the author, the title and \thanklesspublisher in fullwidth, sans-serif, all capitals. */
const TITLEPAGE = { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0793-xtufte/latex/xtufte-common.def', line: '1444-1458' } as const;

export const PRESETS = {
  handout: {
    description:
      "Tufte-LaTeX's title block: the title, the authors and the date in large italics at the head of the first page (\\maketitle), with the short title and authors for the running heads (\\title[…]{…}, \\author[…]{…}).",
    writes: '\\title[…]{…} \\author[…]{… and …} \\date{…} \\maketitle',
    features: ['class-styled'],
    params: {},
    evidence: [HANDOUT, solution('0825-tufte-essay', '31')],
  },
  'author-emails': {
    description: "Tufte's title block with each author's e-mail in a \\thanks, which the class sets as a margin note beside the names.",
    writes: '\\title[…]{…} \\author[…]{…\\thanks{\\texttt{…}} and …\\thanks{\\texttt{…}}} \\date{…} \\maketitle',
    features: ['class-styled', 'margin-note'],
    params: { authorNotes: 'thanks' },
    evidence: [SAMPLE_HANDOUT],
  },
  'title-page': {
    description:
      "Tufte-LaTeX's full title page (\\maketitlepage): the authors, the title and the publisher in sans-serif capitals across the full width, on a page of its own; tufte-book's \\maketitle prints it too, by its default titlepage option.",
    writes: '\\title[…]{…} \\author[…]{…} \\publisher{…} \\date{…} \\maketitlepage',
    features: ['title-page', 'sans-serif', 'uppercase', 'full-width'],
    params: { titleCommand: 'maketitlepage' },
    evidence: [solution('0087-xtufte', '33'), TITLEPAGE],
  },
} as const satisfies { readonly [name: string]: Preset };
