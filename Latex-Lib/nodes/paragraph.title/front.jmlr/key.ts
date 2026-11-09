import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const JMLR = 'Latex Related Research/Latex-lib-main/Source/0662-jmlr';

export default defineKey({
  ...minimal({
    id: 'front.jmlr',
    node: 'paragraph/title',
    description:
      "The JMLR family's title block, where each author is a name and an e-mail, the address follows \\addr after a line break and \\AND starts the next block of authors. jmlr (its pmlr option): \\title[short]{…\\titletag{\\thanks{…}}}, \\author[short]{\\Name{…} \\Email{…} \\and \\Name{…} \\Email{…}\\\\ \\addr … \\AND …}, the paper's \\firstpageno, \\jmlrissue, \\jmlrpages, \\jmlrsubmitted and \\jmlrpublished, \\maketitle, and the keywords in the class's keywords environment after the abstract. TMLR (tmlr.sty): \\title{…}, \\author{\\name … \\email …\\\\ \\addr … \\AND …}, \\def\\month, \\def\\year and \\def\\openreview, \\maketitle. jmlr-pmlr and tmlr only.",
    writes:
      '\\firstpageno{…} \\jmlrissue{…} \\jmlrpages{…} \\jmlrsubmitted{…} \\jmlrpublished{…} \\title[…]{…\\titletag{\\thanks{…}}} \\author[…]{\\Name{…} \\Email{…} \\and \\Name{…} \\Email{…} \\\\ \\addr … \\AND …} \\maketitle \\AddToHook{env/abstract/after}{\\begin{keywords}…\\end{keywords}}',
    ctan: ['jmlr'],
    features: ['class-styled', 'centered'],
    params: {
      form: { type: 'enum', values: ['jmlr', 'tmlr'], default: 'jmlr', description: "jmlr.cls's \\Name{…} \\Email{…} with short title and author forms, or tmlr.sty's \\name … \\email … with none and its camera-ready month, year and OpenReview link" },
      keywords: { type: 'enum', values: ['afterAbstract', 'none'], default: 'afterAbstract', description: "the keywords in the class's keywords environment right after the abstract (jmlr), or none (tmlr has no keywords environment)" },
    },
    // The e-mails go after each name, each affiliation's department, name and address on its \addr line; the short title and
    // author for the running heads, a note on the title, the journal heading's values and TMLR's camera-ready values are the
    // paper's own.
    fields: [
      'author.email',
      'affiliation.name',
      'affiliation.department',
      'affiliation.address',
      'templateSpecific.shortTitle',
      'templateSpecific.runningAuthor',
      'templateSpecific.titleNote',
      'templateSpecific.keywords',
      'templateSpecific.firstPage',
      'templateSpecific.pages',
      'templateSpecific.submitted',
      'templateSpecific.published',
      'templateSpecific.issue',
      'templateSpecific.month',
      'templateSpecific.year',
      'templateSpecific.openreview',
    ],
    presets: PRESETS,
    // It runs the class's own \maketitle (jmlr.dtx l.3512-3551; tmlr.sty l.71).
    claims: ['maketitle'],
    // \addr and \AND: jmlr defines \addr empty outside the author block and both inside it (jmlr.dtx l.3631-3644), tmlr.sty
    // globally (l.98-102). classes/jmlr-pmlr.ts lists neither (reported).
    requires: ['cmd:\\maketitle', 'cmd:\\addr', 'cmd:\\AND'],
    requiresWhen: [
      // classes/jmlr-pmlr.ts lists \Name, \Email and \firstpageno; \titletag, \jmlrissue, \jmlrpages, \jmlrsubmitted and
      // \jmlrpublished are the class's too (jmlr.dtx l.3415, 4026, 4052, 4065, 4078) but not listed yet (reported).
      { when: { form: 'jmlr' }, requires: ['cmd:\\Name', 'cmd:\\Email', 'cmd:\\titletag', 'cmd:\\firstpageno', 'cmd:\\jmlrissue', 'cmd:\\jmlrpages', 'cmd:\\jmlrsubmitted', 'cmd:\\jmlrpublished'] },
      { when: { form: 'tmlr' }, requires: ['cmd:\\name', 'cmd:\\email'] },
      { when: { keywords: 'afterAbstract' }, requires: ['env:keywords', 'env:abstract'] },
    ],
    only: ['class.jmlr-pmlr', 'class.tmlr'],
    onlyWhen: [
      {
        when: { form: 'jmlr' },
        classes: ['class.jmlr-pmlr'],
        reason: "\\Name, \\Email, \\titletag and the short forms of \\title and \\author are jmlr.cls's; tmlr.sty has the kernel's \\title and the \\name and \\email switches",
        evidence: [{ kind: 'source', file: `${JMLR}/jmlr.dtx`, line: '3415, 3423-3428, 3457-3470, 3705, 3794' }],
      },
      {
        when: { form: 'tmlr' },
        classes: ['class.tmlr'],
        reason: "\\name and \\email are class errors inside jmlr's author block (jmlr.dtx l.3632-3633); they are tmlr.sty's",
        evidence: [{ kind: 'source', file: `${JMLR}/jmlr.dtx`, line: '3632-3633' }, { kind: 'source', file: 'Latex-Lib/classes/tmlr.ts', line: '12-16, 36' }],
      },
    ],
    // Typeset on ZeroTeX-NG (2026-11-07) under \documentclass[pmlr]{jmlr} (MiKTeX's jmlr): the jmlr-pmlr preset on the sample with
    // the keywords after the abstract, with every optional field (\firstpageno, \jmlrissue, \jmlrpages, \jmlrsubmitted,
    // \jmlrpublished, \titletag{\thanks}), six authors in three blocks (two joined by \and, three one to a line, one with no
    // address), one author, authors with no affiliation, and the abstract before the title: all ok (the every-field PDF checked by eye).
    // tmlr.sty is neither in testing-pipeline/settings/classes/files here nor on CTAN, so the tmlr preset is untested; the key's
    // verdict is the jmlr one.
    targetEngine: 'yes',
  }),
  evidence: [
    { kind: 'solution', file: 'Solution/0662-jmlr.md', lines: '23, 40, 43' },
    { kind: 'source', file: `${JMLR}/pmlr-sample.tex`, line: '34-93' },
    { kind: 'source', file: `${JMLR}/jmlr.dtx`, line: '3381-3448 (keywords, \\titletag, \\title[short]), 3457-3470 (\\author[short]), 3618-3794 (author block, \\addr, \\AND, \\Name, \\Email), 3893-3896 (\\firstpageno), 4015-4078 (\\jmlrissue, \\jmlrpages, \\jmlrsubmitted, \\jmlrpublished)' },
    { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.tmlr/main.tex', line: '79-98' },
    { kind: 'source', file: 'Latex-Lib/classes/tmlr.ts', line: '12-16, 36' },
  ],
});
