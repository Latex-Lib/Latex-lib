import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey({
  ...minimal({
    id: 'front.iopart',
    node: 'paragraph/title',
    description:
      "IOP Publishing's legacy iopart class's own front matter: \\title[short title]{title}, \\author{A$^1$, B$^2$ and C} with the affiliations' numbers, one \\address{$^n$ …} per affiliation, \\ead{e-mail} (\\eads{\\mailto{…}, …} for several), then after the abstract the Keywords line, \\submitto{journal} and \\maketitle (only a page end in iopart), with \\ioptwocol for two-column pages. iopart only.",
    writes: '\\title[…]{…} \\author{…$^{1}$, … and …} \\address{$^{1}$ …} \\ead{…}; \\AddToHook{env/abstract/after}{\\noindent{\\it Keywords\\/}: … \\submitto{…}\\maketitle}',
    ctan: [],
    features: ['class-styled'],
    params: {
      submitTo: { type: 'tex', default: '', description: "the journal for \\submitto, one of iopart's abbreviations (\\JPA, \\CQG, \\PMB …): a template constant; '' prints no \\submitto" },
      frontEnd: {
        type: 'enum',
        values: ['after-abstract', 'after-title'],
        default: 'after-abstract',
        description: "where the keywords line, \\submitto and \\maketitle go: after the abstract (IOP's order, through the abstract's end hook), or straight after the e-mail line for a paper with no abstract",
      },
      twoColumn: { type: 'boolean', default: false, description: '\\ioptwocol after \\maketitle: the rest in two columns' },
    },
    // A per-author ORCID has no iopart command, so it is not printed; the date neither (iopart prints none).
    fields: ['affiliation.name', 'affiliation.department', 'affiliation.address', 'author.email', 'templateSpecific.shortTitle', 'templateSpecific.keywords'],
    presets: PRESETS,
    // \maketitle is iopart's own (a page end) and is printed here, after the front matter.
    claims: ['maketitle'],
    // \eads and \mailto print only when several authors give an e-mail; a requirement cannot depend on the paper, so they are always asked.
    requires: ['cmd:\\maketitle', 'cmd:\\address', 'cmd:\\ead', 'cmd:\\eads', 'cmd:\\mailto', 'cmd:\\submitto'],
    requiresWhen: [{ when: { twoColumn: true }, requires: ['cmd:\\ioptwocol'] }],
    only: ['class.iopart'],
    // iopart.cls is in no settings folder here and not on CTAN, so no preset was typeset.
    targetEngine: 'untested',
  }),
  evidence: [
    { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.iopart/main.tex', line: '101-118' },
    { kind: 'source', file: 'Latex-Lib/classes/iopart.ts', line: '10-19 (iopart.cls l.98 \\maketitle, 106-116 \\title, 225-237 \\author, 947 on journal abbreviations, 1096 \\ioptwocol)' },
    { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/_answers/class.iopart.json', line: "nodes['paragraph/title'].note" },
  ],
});
