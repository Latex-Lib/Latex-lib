import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const ACM = 'Latex Related Research/Latex-lib-main/Source/0665-acmart';

export default defineKey(
  minimal({
    id: 'doc.acm-rights',
    node: 'doc',
    description:
      "The acmart family's rights and venue block, the template's constants from ACM's rights form, in the preamble: \\setcopyright{…} (and \\setcctype[…]{…} for a Creative Commons licence), \\copyrightyear, \\acmYear, then for a journal \\acmJournal{…} (JACM, TOG …) or for proceedings \\acmConference[acronym]{name}{date}{venue}, \\acmBooktitle and \\acmISBN, and \\settopmatter{…}. AAMAS's aamas.cls form: \\setcopyright{ifaamas}, a five-argument \\acmConference with the editors and the page heads cleared. The paper's own DOI, volume, number and article number stay with the title (front.acmart).",
    writes: '\\setcopyright{…} \\setcctype[…]{…} \\copyrightyear{…} \\acmYear{…} \\acmJournal{…} | \\acmConference[…]{…}{…}{…} \\acmBooktitle{…} \\acmISBN{…} \\settopmatter{…}',
    ctan: ['acmart'],
    features: ['class-styled'],
    // Values are the template's own LaTeX, printed as given; an empty one prints nothing and leaves the class's default
    // (acmlicensed, the 'Proceedings of …' booktitle the class builds, its sample ISBN).
    params: {
      form: { type: 'enum', values: ['acmart', 'aamas'], default: 'acmart', compat: true, description: "acmart's four-argument \\acmConference, or aamas.cls's five-argument one with the editors" },
      venue: { type: 'enum', values: ['none', 'journal', 'proceedings'], default: 'none', description: 'a journal (\\acmJournal) or a conference (\\acmConference, \\acmBooktitle, \\acmISBN); none prints neither' },
      copyright: {
        type: 'string',
        default: '',
        description:
          "\\setcopyright's mode: acmlicensed (the class's default), acmcopyright, rightsretained, usgov, usgovmixed, cagov, cagovmixed, licensedusgovmixed, licensedcagov, licensedcagovmixed, othergov, licensedothergov, iw3c2w3, iw3c2w3g, cc, none; ifaamas under aamas",
      },
      ccType: { type: 'string', default: '', description: 'with copyright cc: the licence, \\setcctype{by|by-sa|by-nd|by-nc|by-nc-sa|by-nc-nd|zero}' },
      ccVersion: { type: 'string', default: '', description: "the licence's version, \\setcctype's optional argument (4.0 by default)" },
      copyrightYear: { type: 'string', default: '', description: '\\copyrightyear' },
      acmYear: { type: 'string', default: '', description: '\\acmYear, the year in the bibstrip' },
      journal: { type: 'string', default: '', description: "a journal's code, \\acmJournal (JACM, TOG, POMACS, JDS …)" },
      conferenceShort: { type: 'tex', default: '', description: "\\acmConference's optional acronym (Conference acronym 'XX)" },
      conferenceName: { type: 'tex', default: '', description: "\\acmConference's conference title; proceedings print nothing without it" },
      conferenceDate: { type: 'tex', default: '', description: "\\acmConference's dates" },
      conferenceVenue: { type: 'tex', default: '', description: "\\acmConference's place" },
      conferenceEditors: { type: 'tex', default: '', description: "aamas: \\acmConference's fifth argument, the proceedings' editors" },
      booktitle: { type: 'tex', default: '', description: "\\acmBooktitle, when the proceedings' title is not 'Proceedings of <conference>'" },
      isbn: { type: 'string', default: '', description: '\\acmISBN (aamas always writes it, empty by default)' },
      topmatter: { type: 'string', default: '', description: '\\settopmatter keys: printccs, printacmref, printfolios, authorsperrow' },
      clearHeads: { type: 'boolean', default: false, description: "the page heads cleared at \\begin{document} (\\pagestyle{fancy}\\fancyhead{}), as AAMAS's sample does until pagination" },
    },
    presets: PRESETS,
    requires: ['cmd:\\setcopyright', 'cmd:\\acmConference'],
    requiresWhen: [{ when: { venue: 'journal' }, requires: ['cmd:\\acmJournal'] }],
    only: ['class.acmart', 'class.acmart-acmsmall', 'class.acmart-acmtog', 'class.acmart-sigplan', 'class.aamas'],
    onlyWhen: [
      {
        when: { form: 'aamas' },
        classes: ['class.aamas'],
        reason:
          "aamas.cls's \\acmConference takes five arguments, the fifth the editors; acmart's takes four (acmart.dtx l.5095), so the fifth group would be typeset in the preamble: \"Missing \\begin{document}\". ifaamas is aamas.cls's own rights mode, which acmart's \\setcopyright keys do not know",
        evidence: [
          { kind: 'source', file: `${ACM}/acmart.dtx`, line: '5095-5114 (\\newcommand\\acmConference[4][])' },
          { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.aamas/main.tex', line: '54-58' },
        ],
      },
    ],
    // Typeset on ZeroTeX-NG (2026-11-07) under acmart (MiKTeX, v2.20) in acmsmall and manuscript (journal), acmtog (tog), sigconf
    // and sigplan (proceedings, and with clearHeads): ok. The aamas preset is not shown: aamas.cls is not among the pinned files.
    targetEngine: 'yes',
  }),
);
