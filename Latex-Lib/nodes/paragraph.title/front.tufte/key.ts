import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const XTUFTE = 'Latex Related Research/Latex-lib-main/Source/0793-xtufte/latex/xtufte-common.def';

export default defineKey({
  ...minimal({
    id: 'front.tufte',
    node: 'paragraph/title',
    description:
      "Tufte-LaTeX's title (tufte-handout, tufte-book): \\title[short]{…} and \\author[short]{…}, whose optional arguments are the plain forms the running heads and the PDF metadata print, the authors joined in words (never \\and), each e-mail in a \\thanks margin note when asked, \\publisher{…} and \\date{…}, then \\maketitle (the title, authors and date in large italics; under tufte-book the full title page) or \\maketitlepage (the authors, title and publisher in sans-serif capitals across the full width).",
    writes: '\\title[…]{…} \\author[…]{… and …} \\publisher{…} \\date{…} \\maketitle',
    ctan: ['tufte-latex'],
    features: ['class-styled'],
    params: {
      titleCommand: {
        type: 'enum',
        values: ['maketitle', 'maketitlepage'],
        default: 'maketitle',
        description: "the command at the title's place: \\maketitle (tufte-handout's title block; tufte-book's title page by its default titlepage option) or \\maketitlepage (the full title page under either class)",
      },
      authorNotes: { type: 'enum', values: ['none', 'thanks'], default: 'none', description: "each author's e-mail: not printed, or in a \\thanks after the name, which the class sets as a margin note" },
      publisher: { type: 'string', default: '', description: "the publisher line of the title page (\\publisher), a template constant under the paper's own templateSpecific.publisher; ''" },
      date: { type: 'enum', values: ['given', 'today', 'none'], default: 'given', description: "the date line: the node's date (the class prints today's when there is none), \\today explicitly, or none (\\date{})" },
    },
    // The short title and running author feed the optional arguments; the publisher changes per book, so it is a template field too.
    fields: ['templateSpecific.shortTitle', 'templateSpecific.runningAuthor', 'templateSpecific.publisher', 'author.email'],
    presets: PRESETS,
    // It runs the class's own \maketitle (or its \maketitlepage in its place).
    claims: ['maketitle'],
    // \publisher is the class's (tufte-common.def; the engine's tufte-handout prints its \meaning as "\@protected@testopt
    // \publisher \\publisher {}"), printed whenever the paper or the template gives one, which no parameter predicts.
    requires: ['cmd:\\maketitle', 'cmd:\\publisher'],
    requiresWhen: [{ when: { titleCommand: 'maketitlepage' }, requires: ['cmd:\\maketitlepage'] }],
    only: ['class.tufte-handout', 'class.tufte-book'],
    targetEngine: 'yes',
  }),
  evidence: [
    { kind: 'manual', of: 'tufte-latex', section: 'CTAN package page', url: 'https://ctan.org/pkg/tufte-latex' },
    { kind: 'source', file: XTUFTE, line: '581-648 (\\title[2][], \\author[2][], \\date, \\publisher[2][]: \\plaintitle, \\plainauthor, \\thanklesspublisher), 1444-1458 (\\maketitlepage), 1463-1488 (\\maketitle sets \\@author in a paragraph)' },
    { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.tufte-handout/main.tex', line: '58-62' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0087-xtufte/main.tex', line: '24-32' },
    {
      kind: 'compile',
      reproducer:
        "\\documentclass[nols]{tufte-handout} and [nols]{tufte-book} with \\title[Engines]{On Engines} \\author[Lovelace and Turing]{Ada Lovelace\\thanks{\\texttt{ada@example.org}} and Alan Turing\\thanks{…}} \\publisher{…} \\date{1843} in the preamble, then \\maketitle, and \\maketitlepage, in the body: each typesets (ZeroTeX-NG through class-examples/typeset-dir.ts, 2026-11-07)",
    },
  ],
});
