import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const CLS = 'Template/templates/ieee-access/files/ieeeaccess.cls';

export default defineKey({
  ...minimal({
    id: 'front.ieeeaccess',
    node: 'paragraph/title',
    description:
      "IEEE Access's title block (ieeeaccess.cls): \\history{…} and \\doi{…} above the title, \\title, one \\author of \\uppercase{Name}\\authorrefmark{1} with \\IEEEmembership{Member, IEEE} after each name, a numbered \\address[1]{Department, Institution, City (e-mail: …)} per affiliation, \\tfootnote (funding), \\markboth running heads (\"Surname \\headeretal: short title\"), \\corresp{Corresponding author: …} and the keywords environment (INDEX TERMS); \\maketitle is held until the abstract environment has filled the class's abstract box, or the first \\section.",
    writes:
      '\\history{…} \\doi{…} \\title{…} \\author{\\uppercase{…}\\authorrefmark{1}, \\IEEEmembership{…}, and \\uppercase{…}\\authorrefmark{1,2}} \\address[1]{… (e-mail: …)} \\tfootnote{…} \\markboth{… \\headeretal: …}{… \\headeretal: …} \\corresp{Corresponding author: … (e-mail: …).} \\begin{keywords} … \\end{keywords} \\gdef\\LatexLibAccessTitle{…\\maketitle}; \\AddToHook{env/abstract/after}{\\LatexLibAccessTitle} \\AddToHook{cmd/section/before}{\\LatexLibAccessTitle}',
    ctan: ['ieeetran'],
    features: ['class-styled', 'uppercase'],
    params: {
      titlepgskip: { type: 'dimen', default: '', description: "the space the class adds under the title block (\\titlepgskip=…, 0pt by the class), as a template tunes the first page; empty writes nothing" },
    },
    // The title fields it prints besides the title and the names. An author's IEEE grade has no field in Flouest's author
    // records: it is the templateSpecific list front.ieeetran-journal reads (its records.ts), naming each author.
    fields: [
      'author.email',
      'affiliation.name',
      'affiliation.department',
      'affiliation.address',
      'templateSpecific.memberships',
      'templateSpecific.history',
      'templateSpecific.doi',
      'templateSpecific.titleFootnote',
      'templateSpecific.runningAuthor',
      'templateSpecific.shortTitle',
      'templateSpecific.correspondingAuthor',
      'templateSpecific.keywords',
    ],
    presets: PRESETS,
    // The deferred \maketitle, which an abstract way for the class (abs.ieeeaccess) may call after filling the box.
    defines: ['cmd:\\LatexLibAccessTitle'],
    // It runs the class's own \maketitle, which prints the abstract and keywords boxes (the profile's abstract environment).
    claims: ['maketitle'],
    requires: ['cmd:\\maketitle', 'cmd:\\history', 'cmd:\\doi', 'cmd:\\address', 'cmd:\\authorrefmark', 'cmd:\\corresp', 'cmd:\\tfootnote', 'cmd:\\IEEEmembership', 'env:keywords'],
    only: ['class.ieeeaccess'],
    // Typeset with Template/templates/ieee-access/files (ieeeaccess.cls, IEEEtran.cls and the class's fonts) on ZeroTeX-NG,
    // 2026-11-07, with graphicx and \EOD as the setting gives them. The setting's own renamed copy (ieeeaccess-latexlib.cls) is not
    // in this checkout; its title commands are the same lines (classes/ieeeaccess.ts, l.610-619).
    targetEngine: 'yes',
  }),
  evidence: [
    { kind: 'source', file: CLS, line: '508 (\\markboth), 601-613 (\\history, \\doi, \\title, \\authorrefmark, \\corresp, \\tfootnote, \\author, \\address[mark]{text}), 616-649 (abstract and keywords kept in boxes 99 and 88), 661-662 (\\titlepgskip), 733-768 (\\@maketitle: history, DOI, title, author, addresses, corresp, tfootnote, box 99, box 88), 781-787 (\\maketitle), 794 (\\IEEEmembership), 1096 (\\headeretal)' },
    { kind: 'source', file: 'Template/templates/ieee-access/starter.tex', line: '1-23' },
    { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.ieeeaccess/main.tex', line: '97-117' },
    { kind: 'requirement', file: 'Template/template-requirement/IEEE_Access.md', line: '43' },
    { kind: 'source', file: 'Latex-Lib/classes/ieeeaccess.ts', line: 'header (\\@maketitle prints \\@doi, which only \\doi sets), vocabulary' },
  ],
});
