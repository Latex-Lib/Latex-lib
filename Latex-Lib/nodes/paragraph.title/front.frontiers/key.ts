import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const SRC = 'Latex Related Research/Latex-lib-main/Source/0757-frontiers';

export default defineKey({
  ...minimal({
    id: 'front.frontiers',
    node: 'paragraph/title',
    description:
      "Frontiers' title block (FrontiersinHarvard.cls) as its template writes it: the data macros \\keyFont, \\firstAuthorLast, \\Authors (names with affiliation numbers, the corresponding author starred), \\Address, \\corrAuthor and \\corrEmail defined in the preamble, the keywords added at the end of the abstract, then \\title[running title]{…} \\author[\\firstAuthorLast]{\\Authors} \\address{} \\correspondance{} \\extraAuth{…} \\maketitle where the title stands. No date. frontiers only.",
    writes:
      '\\def\\keyFont{…} \\def\\firstAuthorLast{…} \\def\\Authors{…\\,$^{1,*}$, … and …\\,$^{1,2}$} \\def\\Address{$^{1}$… \\\\ $^{2}$…} \\def\\corrAuthor{…} \\def\\corrEmail{…} \\AddToHook{env/abstract/end}{\\par\\tiny\\keyFont{\\section{Keywords:} …}} \\title[…]{…} \\author[\\firstAuthorLast]{\\Authors} \\address{} \\correspondance{} \\extraAuth{…} \\maketitle',
    // FrontiersinHarvard.cls is Frontiers' own template, not on CTAN: its evidence is the class source and the template below.
    ctan: [],
    features: ['class-styled', 'sans-serif', 'ruled'],
    // The e-mails are the corresponding authors', each affiliation's department, name and address its \Address line; the running
    // title, running author, corresponding author and keywords are the paper's own.
    fields: [
      'author.email',
      'affiliation.name',
      'affiliation.department',
      'affiliation.address',
      'templateSpecific.shortTitle',
      'templateSpecific.runningAuthor',
      'templateSpecific.correspondingAuthor',
      'templateSpecific.keywords',
    ],
    presets: PRESETS,
    // The data macros, which the class's \maketitle and running heads read by name (FrontiersinHarvard.cls l.240-245, 498-502).
    defines: ['cmd:\\keyFont', 'cmd:\\firstAuthorLast', 'cmd:\\Authors', 'cmd:\\Address', 'cmd:\\corrAuthor', 'cmd:\\corrEmail'],
    // It runs the class's own \maketitle (l.427-473).
    claims: ['maketitle'],
    // \helveticabold is the class's font switch, used in \keyFont (l.28 of the template).
    requires: ['cmd:\\maketitle', 'cmd:\\address', 'cmd:\\correspondance', 'cmd:\\extraAuth', 'cmd:\\helveticabold', 'env:abstract'],
    only: ['class.frontiers'],
    // Typeset on ZeroTeX-NG (2026-11-07) under \documentclass[utf8]{FrontiersinHarvard} with the pinned class and logo1.eps beside
    // main.tex (their SHA-256 the profile's): the sample, every field with two corresponding authors (\extraAuth), six authors
    // over two affiliations, one author and affiliation, authors with no affiliation, and no author at all: all ok. The engine
    // then writes main.xdv but no PDF, for any document that runs the class's \maketitle: its \@maketitle includes ./logo1.eps
    // (l.486), which xdvipdfmx cannot convert without Ghostscript (the same document with \maketitle removed, or with the class
    // pointed at logo1.pdf in a scratch copy, gives its PDF). That is the class's and the setting's matter, not this way's.
    targetEngine: 'yes',
  }),
  evidence: [
    { kind: 'solution', file: 'Solution/0757-frontiers.md', lines: '23, 46, 47, 49' },
    { kind: 'source', file: `${SRC}/frontiers.tex`, line: '28-71' },
    { kind: 'source', file: `${SRC}/FrontiersinHarvard.cls`, line: '232-248 (\\ps@headings, \\firstAuthorLast), 395-411 (\\title, \\author, \\address, \\correspondance, \\extraAuth), 427-509 (\\maketitle, \\@maketitle), 514-519 (abstract, \\section as a run-in label)' },
    { kind: 'source', file: 'Latex-Lib/classes/frontiers.ts', line: '32-33 (\\maketitle prints \\Authors, \\Address, \\corrAuthor, \\corrEmail, \\firstAuthorLast)' },
  ],
});
