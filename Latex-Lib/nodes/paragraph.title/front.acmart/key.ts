import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const DTX = 'Latex Related Research/Latex-lib-main/Source/0665-acmart/acmart.dtx';

export default defineKey({
  ...minimal({
    id: 'front.acmart',
    node: 'paragraph/title',
    description:
      "The acmart family's title block (acmart in every format: sigconf, sigplan, acmsmall, acmtog, manuscript; AAMAS's aamas.cls; PVLDB's acmart with pvldb.sty), written where the title stands and stored until \\maketitle: the paper's rights and identifiers (\\setcopyright, \\copyrightyear, \\acmDOI, \\acmVolume, \\acmNumber, \\acmArticle, \\acmMonth, \\acmSubmissionID), \\title[short]{…}, \\subtitle, one \\author per author with \\authornote or \\authornotemark, \\correspondingauthor, \\email and \\orcid, an \\affiliation{\\institution{…} \\department{…} \\city{…} \\state{…} \\country{…}} per affiliation (shared by authors in a row, or repeated), \\thanks, the CCS concepts (\\ccsdesc[500]{General~Specific}), \\keywords and \\received dates, then \\maketitle and \\renewcommand{\\shortauthors}{…}.",
    writes:
      '\\setcopyright{…} \\copyrightyear{…} \\acmDOI{…} \\acmVolume{…} \\acmNumber{…} \\acmArticle{…} \\acmMonth{…} \\acmSubmissionID{…} \\title[…]{…} \\subtitle{…} \\author{…} \\authornote{…} \\correspondingauthor \\email{…} \\orcid{…} \\author{…} \\authornotemark[1] \\email{…} \\affiliation{\\institution{…} \\department{…} \\city{…} \\state{…} \\country{…}} \\thanks{…} \\ccsdesc[…]{…~…} \\keywords{…, …} \\maketitle \\renewcommand{\\shortauthors}{…}',
    ctan: ['acmart'],
    features: ['class-styled'],
    params: {
      authorGrouping: { type: 'enum', values: ['shared', 'each'], default: 'shared', description: "authors in a row with the same affiliations share one \\affiliation block after the last of them (samples.dtx), or each author repeats theirs (the acmtog, aamas and PVLDB templates)" },
      department: { type: 'enum', values: ['department', 'in-institution'], default: 'department', description: "the department as acmart's \\department{…}, or inside \\institution{Department, Institution} as the AAMAS template writes it" },
      keywordSeparator: { type: 'string', default: ', ', description: "between keywords in \\keywords{…}: ', ' (ACM) or '; ' (AAMAS)" },
      ccs: { type: 'boolean', default: true, description: 'the CCS concepts as \\ccsdesc[significance]{General~Specific}' },
      received: { type: 'boolean', default: false, description: "the received, revised and accepted dates (\\received), which acmart prints at the end of the paper: the journals' line, not the proceedings'" },
      rights: { type: 'boolean', default: true, description: "the paper's ACM rights and identifiers (\\setcopyright, \\copyrightyear, \\acmDOI, \\acmVolume, \\acmNumber, \\acmArticle, \\acmMonth, \\acmSubmissionID) from its fields; off under nonacm" },
      pvldb: { type: 'boolean', default: false, description: "PVLDB's per-paper values for pvldb.sty's \\vldbtopmatter: \\renewcommand\\vldbdoi, \\vldbpages and \\vldbavailabilityurl" },
    },
    // The title fields it prints besides the title and the names. A per-author note has no field in Flouest's records: the notes
    // are one templateSpecific list naming their authors, as the corresponding author is.
    fields: [
      'author.email',
      'author.orcid',
      'affiliation.name',
      'affiliation.department',
      'affiliation.address',
      'templateSpecific.shortTitle',
      'templateSpecific.subtitle',
      'templateSpecific.authorNotes',
      'templateSpecific.correspondingAuthor',
      'templateSpecific.thanks',
      'templateSpecific.ccsConcepts',
      'templateSpecific.keywords',
      'templateSpecific.received',
      'templateSpecific.runningAuthor',
      'templateSpecific.doi',
      'templateSpecific.volume',
      'templateSpecific.issue',
      'templateSpecific.articleNumber',
      'templateSpecific.month',
      'templateSpecific.submissionId',
      'templateSpecific.copyright',
      'templateSpecific.copyrightYear',
      'templateSpecific.vldbDoi',
      'templateSpecific.vldbPages',
      'templateSpecific.availabilityUrl',
    ],
    presets: PRESETS,
    // It runs the class's own \maketitle, which prints the abstract and teaser acmart keeps for it (the profile's heldByMaketitle).
    claims: ['maketitle'],
    requires: [
      'cmd:\\maketitle',
      'cmd:\\affiliation',
      'cmd:\\email',
      'cmd:\\orcid',
      'cmd:\\authornote',
      // acmart v2.18 and later (acmart.dtx l.5464-5471): the mirror's v2.20 and aamas.cls v2.19 have it.
      'cmd:\\correspondingauthor',
      'cmd:\\ccsdesc',
      'cmd:\\keywords',
      'cmd:\\received',
    ],
    // pvldb.sty's macros, only where it is loaded.
    requiresWhen: [{ when: { pvldb: true }, requires: ['cmd:\\vldbdoi', 'cmd:\\vldbpages', 'cmd:\\vldbavailabilityurl'] }],
    only: ['class.acmart', 'class.acmart-acmsmall', 'class.acmart-acmtog', 'class.acmart-sigplan', 'class.vldb', 'class.aamas'],
    onlyWhen: [
      {
        when: { pvldb: true },
        classes: ['class.vldb'],
        reason: "\\vldbdoi, \\vldbpages and \\vldbavailabilityurl are pvldb.sty's (loaded only by the vldb setting): elsewhere \\renewcommand stops at \"Command \\vldbdoi undefined\"",
        evidence: [{ kind: 'source', file: 'Latex-Lib/classes/vldb.ts', line: 'header (pvldb.sty l.46-86 defines \\vldbdoi … \\vldbtopmatter)' }],
      },
    ],
    // Typeset under acmart's manuscript, sigconf, sigplan, acmsmall and acmtog formats on ZeroTeX-NG (2026-11-07); aamas.cls and
    // pvldb.sty are not in this checkout (testing-pipeline/settings/classes/files has neither), so the aamas and pvldb presets
    // and the aamas and vldb classes are unmeasured. 'yes' speaks for the acmart formats.
    targetEngine: 'yes',
  }),
  evidence: [
    { kind: 'source', file: DTX, line: '5229-5290 (\\author, one per author), 5300-5333 (\\affiliation, \\additionalaffiliation), 5451-5500 (\\authornote, \\correspondingauthor, \\authornotemark), 5589-5594 (\\acmSubmissionID), 5747 (\\keywords), 5893-5911 (\\received), 6018-6040 (\\ccsdesc), 7160-7186 (affiliation parts), 7349-7364 (No country present: ClassError)' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0665-acmart/samples/samples.dtx', line: '170-253, 330-399' },
    { kind: 'compile', reproducer: "\\documentclass[manuscript]{acmart} (and [acmsmall]) \\begin{document} \\title{…} \\author{A} \\affiliation{\\institution{X}\\country{}} \\maketitle: 'Class acmart Error: No country present for an affiliation.' (ZeroTeX-NG, 2026-11-07)" },
  ],
});
