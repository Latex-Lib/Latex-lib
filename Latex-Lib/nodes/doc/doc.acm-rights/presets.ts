/**
 * doc.acm-rights' presets: ACM's journal and proceedings rights blocks with the sample values ACM ships (samples.dtx), and
 * AAMAS's fixed block (aamas.cls, its five-argument \acmConference and its own rights mode, ifaamas).
 */
import type { Preset } from '../../../schema/params.ts';

const ACM = 'Latex Related Research/Latex-lib-main/Source/0665-acmart';
const EX = 'Latex Related Research/Latex-Template-Examples';

export const PRESETS = {
  journal: {
    description: "An ACM journal's rights block (acmsmall, acmlarge, the manuscript): \\setcopyright, \\copyrightyear, \\acmYear and \\acmJournal{…}, the journal's code, which sets its name, ISSN and the bibstrip.",
    writes: '\\setcopyright{…} \\copyrightyear{…} \\acmYear{…} \\acmJournal{…}',
    features: ['class-styled'],
    params: { venue: 'journal', copyright: 'acmlicensed', copyrightYear: '2018', acmYear: '2018', journal: 'JACM' },
    evidence: [{ kind: 'source', file: `${ACM}/samples/samples.dtx`, line: '65-74 (\\setcopyright{acmlicensed}, \\copyrightyear, \\acmYear), 90-91 (<acmsmall>\\acmJournal{JACM})' }],
  },
  tog: {
    description: "ACM Transactions on Graphics' rights block: \\setcopyright, \\copyrightyear, \\acmYear and \\acmJournal{TOG}.",
    writes: '\\setcopyright{…} \\copyrightyear{…} \\acmYear{…} \\acmJournal{TOG}',
    features: ['class-styled'],
    params: { venue: 'journal', copyright: 'acmlicensed', copyrightYear: '2026', acmYear: '2026', journal: 'TOG' },
    evidence: [
      { kind: 'source', file: `${EX}/class.acmart-acmtog/main.tex`, line: '56-60' },
      { kind: 'source', file: `${ACM}/samples/samples.dtx`, line: '92 (<acmtog&!conf>\\acmJournal{TOG})' },
    ],
  },
  proceedings: {
    description:
      "An ACM proceedings paper's rights and venue block (sigconf, sigplan): \\setcopyright, \\copyrightyear, \\acmYear, \\acmConference[acronym]{name}{date}{venue}, from which the class builds 'Proceedings of …' unless \\acmBooktitle is given, and \\acmISBN.",
    writes: '\\setcopyright{…} \\copyrightyear{…} \\acmYear{…} \\acmConference[…]{…}{…}{…} \\acmBooktitle{…} \\acmISBN{…}',
    features: ['class-styled'],
    params: {
      venue: 'proceedings',
      copyright: 'acmlicensed',
      copyrightYear: '2018',
      acmYear: '2018',
      conferenceShort: "Conference acronym 'XX",
      conferenceName: 'Make sure to enter the correct conference title from your rights confirmation email',
      conferenceDate: 'June 03--05, 2018',
      conferenceVenue: 'Woodstock, NY',
      isbn: '978-1-4503-XXXX-X/2018/06',
    },
    evidence: [
      { kind: 'source', file: `${ACM}/samples/samples.dtx`, line: '71-86 (<proceedings>: \\acmConference, the commented \\acmBooktitle, \\acmISBN)' },
      { kind: 'source', file: `${EX}/class.acmart-sigplan/main.tex`, line: '16-22' },
    ],
  },
  aamas: {
    description:
      "AAMAS's fixed copyright block: \\setcopyright{ifaamas}, the five-argument \\acmConference[acronym]{name}{date}{venue}{editors}, \\copyrightyear, \\acmYear, an empty \\acmDOI and \\acmISBN, and the page heads cleared (\\pagestyle{fancy}\\fancyhead{}) until pagination.",
    writes: '\\setcopyright{ifaamas} \\copyrightyear{…} \\acmYear{…} \\acmConference[…]{…}{…}{…}{…} \\acmDOI{} \\acmISBN{…} \\AtBeginDocument{\\pagestyle{fancy}\\fancyhead{}}',
    features: ['class-styled'],
    params: {
      form: 'aamas',
      venue: 'proceedings',
      copyright: 'ifaamas',
      copyrightYear: '2027',
      acmYear: '2027',
      conferenceShort: "AAMAS '27",
      conferenceName: 'Proc.\\@ of the 26th International Conference on Autonomous Agents and Multiagent Systems (AAMAS 2027)',
      conferenceDate: 'Month Day -- Day, 2027',
      conferenceVenue: 'City, Country',
      conferenceEditors: 'Editor One, Editor Two (eds.)',
      clearHeads: true,
    },
    evidence: [{ kind: 'source', file: `${EX}/class.aamas/main.tex`, line: '54-63 (the copyright block, "do not change!"), 87-92 (\\pagestyle{fancy} \\fancyhead{} after \\begin{document})' }],
  },
} as const satisfies { readonly [name: string]: Preset };
