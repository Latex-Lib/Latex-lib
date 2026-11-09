/**
 * front.inst-institute's presets, one per class form, each from the class's own source and its sample paper.
 */
import type { Preset } from '../../../schema/params.ts';

const LLNCS = 'Latex Related Research/Latex-lib-main/Source/0712-llncs';
const EASYCHAIR = 'Latex Related Research/Latex-lib-main/Source/0497-easychair';
const AA = 'testing-pipeline/settings/classes/files/aa.cls';

export const PRESETS = {
  llncs: {
    description:
      "Springer LNCS: authors joined by \\and with \\inst numbers and \\orcidID, one \\institute with each author's e-mail under their institute, \\titlerunning/\\authorrunning when given, \\maketitle, and the keywords at the end of the abstract, joined by \\and.",
    features: ['class-styled', 'centered'],
    params: {},
    evidence: [
      { kind: 'source', file: `${LLNCS}/llncs.cls`, line: '854-915 (\\authorrunning, \\titlerunning, \\institute, \\inst, \\orcidID, \\email, \\keywords, \\subtitle), 917-1038 (\\maketitle)' },
      { kind: 'source', file: `${LLNCS}/llncsdoc.tex`, line: '99-223 (\\titlerunning, \\orcidID, \\institute with \\email, \\keywords inside the abstract)' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0054-dennishnf-latex-formats-archive/Paper-CIARP-2017/paper.tex', line: '26-51' },
    ],
  },
  eccv: {
    description:
      "ECCV on llncs (runningheads, eccv.sty): as LNCS, with \\titlerunning and \\authorrunning always written (the title and 'A et al.' when no short forms are given).",
    writes:
      '\\title{…\\thanks{…}} \\subtitle{…} \\titlerunning{…} \\author{…\\inst{…}\\orcidID{…} \\and …} \\authorrunning{…} \\institute{… \\email{…} \\and …} \\maketitle; \\AddToHook{env/abstract/end}{\\keywords{… \\and …}}',
    features: ['class-styled', 'centered'],
    params: { runningHeads: 'always' },
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.eccv/main.tex', line: '51-69 (\\titlerunning, \\author with \\inst and \\orcidID, \\authorrunning, \\institute, \\keywords in the abstract)' },
      { kind: 'source', file: `${LLNCS}/llncs.cls`, line: '854-915' },
    ],
  },
  easychair: {
    description:
      'EasyChair: authors joined by \\and with \\inst numbers, one \\institute with the e-mails under each institute, and \\titlerunning and \\authorrunning always written (EasyChair rejects a paper without them); no ORCID, subtitle or keywords line.',
    writes: '\\title{…\\thanks{…}} \\titlerunning{…} \\author{…\\inst{…} \\and …} \\authorrunning{…} \\institute{… \\email{…} \\and …} \\maketitle',
    features: ['class-styled', 'centered'],
    params: { orcid: 'none', runningHeads: 'always', keywords: 'none', subtitle: false },
    evidence: [
      { kind: 'source', file: `${EASYCHAIR}/easychair.tex`, line: '39-92 (\\author with \\inst, \\institute with \\email, \\authorrunning and \\titlerunning mandatory)' },
      { kind: 'source', file: `${EASYCHAIR}/easychair.cls`, line: '122-221 (llncs-style \\institute, \\inst, \\email; \\titlerunning, \\authorrunning)' },
    ],
  },
  aa: {
    description:
      "Astronomy & Astrophysics: authors joined by \\and with \\inst numbers, \\corrauth{e-mail} for the corresponding author and \\email{…} for the others, no ORCID, one \\institute, \\date{Received …; accepted …}, \\headnote and \\dedication, and \\keywords{a -- b} stored for aa's \\maketitle.",
    writes:
      '\\title{…\\thanks{…}} \\subtitle{…} \\titlerunning{…} \\author{…\\inst{…}\\corrauth{…} \\and …\\inst{…}\\email{…}} \\authorrunning{…} \\institute{… \\and …} \\date{Received …; accepted …} \\headnote{…} \\dedication{…} \\keywords{… -- …} \\maketitle',
    features: ['class-styled', 'centered'],
    params: { emails: 'author', orcid: 'none', corresponding: 'corrauth', keywords: 'stored', date: 'received', frontNotes: true },
    evidence: [
      { kind: 'source', file: AA, line: '742-812 (\\title, \\subtitle, \\author, \\institute, \\inst, \\email, \\corrauth), 861-897 (\\keywords, \\titlerunning, \\authorrunning), 976-985 (\\msnr, \\headnote, \\dedication)' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0411-aanda/aa_example.zip!aa_example.tex', line: '42-98 (\\author with \\corrauth and \\email, \\institute, \\date{Received …}, \\keywords{… -- …} before \\maketitle)' },
    ],
  },
  'aa-offprints': {
    description: "A&A with the corresponding author as an \\offprints{…} line (the older form) instead of \\corrauth, every author's e-mail after their \\inst.",
    writes:
      '\\title{…\\thanks{…}} \\subtitle{…} \\titlerunning{…} \\author{…\\inst{…}\\email{…} \\and …} \\authorrunning{…} \\institute{… \\and …} \\date{Received …; accepted …} \\offprints{…} \\headnote{…} \\dedication{…} \\keywords{… -- …} \\maketitle',
    features: ['class-styled', 'centered'],
    params: { emails: 'author', orcid: 'none', corresponding: 'offprints', keywords: 'stored', date: 'received', frontNotes: true },
    evidence: [{ kind: 'source', file: AA, line: '898-913 (\\offprints: a footnote line named by \\aa@offprintsname)' }],
  },
} as const satisfies { readonly [name: string]: Preset };
