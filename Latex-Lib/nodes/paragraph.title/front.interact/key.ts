import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const CLS = 'Latex Related Research/Latex-lib-main/Source/0207-tandf-interact/interact.cls';
const SAMPLE = 'Latex Related Research/Latex-lib-main/Source/0207-tandf-interact/interactapasample.tex';

export default defineKey({
  ...minimal({
    id: 'front.interact',
    node: 'paragraph/title',
    description:
      "Taylor & Francis' Interact title block (interact): \\articletype{…}, \\title{…}, one \\author{\\name{…}\\affil{…}} naming every author with an affiliation letter (\\textsuperscript{a}) and the corresponding author's \\thanks{CONTACT … Email: …}, all affiliations in one \\affil joined by semicolons, \\received{…} for the article history, then \\maketitle, followed by the keywords, abbreviations, amscode, jelcode and pacscode environments. Its anonymous form puts \\maketitle before \\author to hide the names for double-blind review.",
    writes:
      '\\articletype{…} \\title{…} \\author{\\name{…\\textsuperscript{a}\\thanks{CONTACT …. Email: …} and …\\textsuperscript{b}} \\affil{\\textsuperscript{a}…; \\textsuperscript{b}…}} \\received{…} \\maketitle \\begin{keywords} …; … \\end{keywords} \\begin{abbreviations} … \\end{abbreviations} \\begin{amscode} … \\end{amscode} \\begin{jelcode} … \\end{jelcode} \\begin{pacscode} … \\end{pacscode}',
    ctan: [],
    features: ['class-styled'],
    params: {
      anonymous: {
        type: 'boolean',
        default: false,
        description: "double-blind review: \\maketitle between \\title and \\author, so the names and affiliations are not printed (the sample's own instruction)",
      },
      keywordSeparator: { type: 'string', default: '; ', description: "what goes between two keywords in the keywords environment (the sample's 'Sections; lists; figures')" },
    },
    // The email only through the corresponding author's CONTACT note; no ORCID (the class has no ORCID command) and no date line
    // (its \@maketitle prints the article history, not \@date). The history, article type, keywords, abbreviations and codes are
    // values per paper the title records lack: template fields.
    fields: [
      'author.email',
      'affiliation.name',
      'affiliation.department',
      'affiliation.address',
      'templateSpecific.articleType',
      'templateSpecific.correspondingAuthor',
      'templateSpecific.history',
      'templateSpecific.keywords',
      'templateSpecific.abbreviations',
      'templateSpecific.amsCodes',
      'templateSpecific.jelCodes',
      'templateSpecific.pacsCodes',
    ],
    presets: PRESETS,
    // It runs the class's own \maketitle (interact.cls l.280-308).
    claims: ['maketitle'],
    requires: [
      'cmd:\\maketitle',
      'cmd:\\articletype',
      'cmd:\\name',
      'cmd:\\affil',
      'cmd:\\received',
      'env:keywords',
      'env:abbreviations',
      'env:amscode',
      'env:jelcode',
      'env:pacscode',
    ],
    only: ['class.interact'],
    // Typeset with the research's interact.cls (2017/07/31 v1.05) beside main.tex (ZeroTeX-NG, 2026-11-07); the profile's pinned
    // testing-pipeline/settings/classes/files/interact.cls is not in this checkout, so the class's own setting is unmeasured.
    targetEngine: 'untested',
  }),
  evidence: [
    { kind: 'source', file: CLS, line: '262-263 (\\articletype), 265-266 (\\title, \\author with \\and), 267-270 (\\received, ARTICLE HISTORY), 272-273 (\\name, \\affil), 276-278 (\\thanks), 280-308 (\\maketitle)' },
    { kind: 'source', file: CLS, line: '493-526 (abbreviations, keywords, amscode, jelcode, pacscode environments)' },
    { kind: 'source', file: SAMPLE, line: '39-56 (the title block), 103-160 (anonymous form, abbreviations, keywords, codes, \\thanks)' },
  ],
});
