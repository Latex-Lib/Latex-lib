import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'front.mnras',
    node: 'paragraph/title',
    description:
      "The Monthly Notices of the Royal Astronomical Society (mnras class) front matter: \\title[short]{…} and \\author[short authors]{…} for the running heads, each author with superscript affiliation numbers ($^{1,2}$) and the e-mail as a \\thanks footnote, the affiliations on lines under the names, \\date (the publisher's 'Accepted XXX. Received YYY' line by default), \\pubyear, \\label{firstpage}, \\pagerange{\\pageref{firstpage}--\\pageref{lastpage}} and \\maketitle; then the keywords environment (Key words: a -- b) after the abstract, which prints the \\thanks footnotes, and \\bsp with \\label{lastpage} at the end.",
    writes:
      '\\title[…]{…} \\author[…]{…,$^{1}$\\thanks{E-mail: …} … and …$^{1,2}$ \\\\ $^{1}$… \\\\ $^{2}$…} \\date{…} \\pubyear{…} \\label{firstpage} \\pagerange{\\pageref{firstpage}--\\pageref{lastpage}} \\maketitle; \\AddToHookNext{env/abstract/after}{\\begin{keywords} … -- … \\end{keywords}} \\AtEndDocument{\\bsp\\label{lastpage}}',
    ctan: ['mnras'],
    features: ['class-styled'],
    params: {
      emails: {
        type: 'enum',
        values: ['corresponding', 'all', 'none'],
        default: 'corresponding',
        description:
          "which authors' e-mails print as \\thanks{E-mail: …} footnotes: the one templateSpecific.correspondingAuthor names (by e-mail or name; every author with an e-mail when it names none), every author's, or none",
      },
      date: {
        type: 'tex',
        default: 'Accepted XXX. Received YYY; in original form ZZZ',
        description: "the \\date line when the paper gives no date: the template's placeholder, which the publisher fills in (MNRAS.md l.46)",
      },
      pubYear: { type: 'tex', default: '\\the\\year', description: 'the \\pubyear in the running foot when templateSpecific.pubYear is empty: the current year' },
    },
    fields: [
      'author.email',
      'affiliation.department',
      'affiliation.name',
      'affiliation.address',
      'templateSpecific.shortTitle',
      'templateSpecific.runningAuthor',
      'templateSpecific.correspondingAuthor',
      'templateSpecific.keywords',
      'templateSpecific.pubYear',
    ],
    presets: PRESETS,
    // It runs the class's own \maketitle (mnras.cls l.1055-1071).
    claims: ['maketitle'],
    // The keywords environment follows the abstract (the env/abstract/after hook); mnras defines all three (classes/mnras.ts).
    requires: ['cmd:\\maketitle', 'env:keywords', 'env:abstract'],
    only: ['class.mnras'],
    // Typeset ok under mnras (ZeroTeX-NG, 2026-11-07): each preset on the title sample with an abstract and a \section, two
    // columns and onecolumn, with and without keywords (\nokeywords), no named corresponding author, three authors one with no
    // affiliation, \date{} for dateMode none; the e-mail footnote, Key words after the abstract and \pagerange 1--1 print.
    targetEngine: 'yes',
  }),
);
