/**
 * front.acmart's presets, one per kind of acmart template: ACM's proceedings (sigconf, sigplan) and journals (acmsmall, acmtog),
 * AAMAS (aamas.cls, acmart v2.19 renamed) and PVLDB (acmart sigconf,nonacm with pvldb.sty).
 */
import type { Preset } from '../../../schema/params.ts';

const SAMPLES = 'Latex Related Research/Latex-lib-main/Source/0665-acmart/samples/samples.dtx';
const EXAMPLES = 'Latex Related Research/Latex-Template-Examples';

export const PRESETS = {
  sigconf: {
    description:
      "ACM's proceedings title block (sigconf, sigplan): the paper's rights and identifiers, \\title[short]{…}, one \\author per author with \\authornote, \\correspondingauthor, \\email and \\orcid, authors in a row with the same affiliation sharing one \\affiliation{\\institution{…} \\department{…} \\city{…} \\country{…}}, the CCS concepts (\\ccsdesc) and \\keywords, then \\maketitle and \\shortauthors; no received dates.",
    features: ['class-styled'],
    params: {},
    evidence: [
      { kind: 'source', file: SAMPLES, line: '170-253 (title, shared affiliation, authornote, correspondingauthor), 330-365 (rights, CCS, keywords)' },
      { kind: 'source', file: `${EXAMPLES}/class.acmart-sigplan/main.tex`, line: '19-21, 57-108' },
    ],
  },
  journal: {
    description:
      "ACM's journal title block (acmsmall, acmtog, manuscript): as the proceedings one, with every author repeating their affiliations, the volume, issue, article and month for the running feet, and the received, revised and accepted dates (\\received) printed at the end.",
    writes:
      '\\setcopyright{…} \\copyrightyear{…} \\acmDOI{…} \\acmVolume{…} \\acmNumber{…} \\acmArticle{…} \\acmMonth{…} \\title[…]{…} \\subtitle{…} \\author{…} \\authornote{…} \\correspondingauthor \\email{…} \\orcid{…} \\affiliation{\\institution{…} \\department{…} \\city{…} \\state{…} \\country{…}} \\thanks{…} \\ccsdesc[…]{…} \\keywords{…} \\received{…} \\received[…]{…} \\maketitle \\renewcommand{\\shortauthors}{…}',
    features: ['class-styled'],
    params: { authorGrouping: 'each', received: true },
    evidence: [
      { kind: 'source', file: `${EXAMPLES}/class.acmart-acmtog/main.tex`, line: '55-63 (rights, \\acmVolume, \\acmNumber, \\acmArticle, \\acmMonth), 114-173 (each author repeats the affiliation; \\received)' },
      { kind: 'source', file: SAMPLES, line: '392-394 (\\received, \\received[revised], \\received[accepted])' },
    ],
  },
  aamas: {
    description:
      "AAMAS's title block (aamas.cls, acmart v2.19): one \\author per author, each with an \\affiliation whose \\institution holds the department and the institution, \\email, the submission number (\\acmSubmissionID) and keywords separated by semicolons, then \\maketitle.",
    writes: '\\acmSubmissionID{…} \\title{…} \\author{…} \\email{…} \\affiliation{\\institution{…, …} \\city{…} \\country{…}} \\keywords{…; …} \\maketitle',
    features: ['class-styled'],
    params: { authorGrouping: 'each', keywordSeparator: '; ', department: 'in-institution' },
    evidence: [{ kind: 'source', file: `${EXAMPLES}/class.aamas/main.tex`, line: '65 (\\acmSubmissionID), 70-85 (\\author, \\affiliation{\\institution{Department …, University …} \\city \\country}, \\email), 94-104 (\\keywords{…; …; …} before \\maketitle)' }],
  },
  pvldb: {
    description:
      "PVLDB's title block (acmart sigconf,nonacm with pvldb.sty): the paper's DOI, pages and artifact URL for \\vldbtopmatter (\\renewcommand\\vldbdoi, \\vldbpages, \\vldbavailabilityurl), no ACM rights lines, one \\author per author with their \\affiliation and \\email, \\keywords, then \\maketitle.",
    writes: '\\renewcommand\\vldbdoi{…} \\renewcommand\\vldbpages{…} \\renewcommand\\vldbavailabilityurl{…} \\title[…]{…} \\author{…} \\email{…} \\orcid{…} \\affiliation{\\institution{…} \\city{…} \\country{…}} \\keywords{…} \\maketitle \\renewcommand{\\shortauthors}{…}',
    features: ['class-styled'],
    params: { authorGrouping: 'each', pvldb: true, rights: false, ccs: false },
    evidence: [{ kind: 'source', file: `${EXAMPLES}/class.vldb/main.tex`, line: '13 (sigconf,nonacm), 17-31 (\\renewcommand\\vldbdoi, \\vldbpages, \\vldbavailabilityurl), 73-111 (\\author, \\affiliation, \\email, abstract, \\maketitle), 116 (\\vldbtopmatter)' }],
  },
} as const satisfies { readonly [name: string]: Preset };
