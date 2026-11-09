/**
 * front.ieeetran-blocks' presets: IEEEtran's conference author blocks (bare_conf.tex), its refmark form for many
 * affiliations, the 2024 IEEE conference template's italic blocks (0859), and ieeeconf's (IEEE RAS) \thanks, block and
 * refmark forms (0223's root.tex).
 */
import type { Preset } from '../../../schema/params.ts';

const SOURCE = 'template-lib-based-automation/Latex Related Research/Latex-lib-main/Source';
export const BARE_CONF = `${SOURCE}/0743-ieeetran-journal/IEEEtran/bare_conf.tex`;
export const IEEETRAN_CLS = `${SOURCE}/0743-ieeetran-journal/IEEEtran/IEEEtran.cls (2015/08/26 V1.8b)`;
export const CONF_2024 = `${SOURCE}/0859-ieeetran-compsoc-conference/IEEE-conference-template-062824.tex`;
export const ROOT = `${SOURCE}/0223-ieee-ieeeconf/root.tex`;
export const IEEECONF_CLS = `${SOURCE}/0223-ieee-ieeeconf/ieeeconf.cls (2016/4/23 V1.6b)`;

const RAS = { commands: 'ieeeconf', titleFont: '\\LARGE \\bf', pageStyle: 'empty' } as const;

export const PRESETS = {
  ieeetran: {
    description:
      "IEEEtran's conference title block: one \\IEEEauthorblockN{name} and \\IEEEauthorblockA{department \\\\ organization \\\\ address \\\\ Email: …} per author, side by side, joined by \\and; the funding \\thanks on the title; the keywords in IEEEkeywords right after the abstract.",
    features: ['class-styled', 'centered'],
    params: {},
    evidence: [
      { kind: 'source', file: BARE_CONF, line: '323-344 (\\title, \\author with \\IEEEauthorblockN/\\IEEEauthorblockA joined by \\and), 371-374 (\\IEEEspecialpapernotice, \\maketitle)' },
      { kind: 'source', file: IEEETRAN_CLS, line: '4636-4666 (\\IEEEauthorblockN, \\IEEEauthorblockA), 5286-5292 (IEEEkeywords), 6105-6109 (\\IEEEspecialpapernotice)' },
    ],
  },
  'ieeetran-refmark': {
    description:
      "IEEEtran's conference title block for many affiliations: one \\IEEEauthorblockN with each name's \\IEEEauthorrefmark symbol, then one \\IEEEauthorblockA per affiliation opening with its mark and holding its authors' e-mails.",
    writes:
      '\\IEEEoverridecommandlockouts \\title{…\\thanks{…}} \\author{\\IEEEauthorblockN{…\\IEEEauthorrefmark{1}, … and …\\IEEEauthorrefmark{2}} \\IEEEauthorblockA{\\IEEEauthorrefmark{1}…\\\\Email: …} \\IEEEauthorblockA{\\IEEEauthorrefmark{2}…}} \\IEEEspecialpapernotice{…} \\AddToHook{env/abstract/after}{\\begin{IEEEkeywords}…\\end{IEEEkeywords}} \\maketitle',
    features: ['class-styled', 'centered', 'symbols'],
    params: { form: 'refmark' },
    evidence: [
      { kind: 'source', file: BARE_CONF, line: '351-366 (the alternative format: \\IEEEauthorrefmark{1} after each name, one \\IEEEauthorblockA per affiliation)' },
      { kind: 'source', file: IEEETRAN_CLS, line: '4541-4545 (\\IEEEauthorrefmark: a footnote symbol by \\ifcase)' },
    ],
  },
  'peer-review': {
    description: "IEEEtran's conference author blocks, with bare_conf's \\IEEEpeerreviewmaketitle after the abstract and keywords (the second title page in peerreview mode, nothing otherwise).",
    writes:
      '\\IEEEoverridecommandlockouts \\title{…\\thanks{…}} \\author{\\IEEEauthorblockN{…}\\IEEEauthorblockA{…\\\\…} \\and …} \\IEEEspecialpapernotice{…} \\AddToHook{env/abstract/after}{\\begin{IEEEkeywords}…\\end{IEEEkeywords}\\IEEEpeerreviewmaketitle} \\maketitle',
    features: ['class-styled', 'centered'],
    params: { peerReview: true },
    evidence: [
      { kind: 'source', file: BARE_CONF, line: '393-399 (\\IEEEpeerreviewmaketitle after the abstract)' },
      { kind: 'source', file: IEEETRAN_CLS, line: '4920-4931 (\\IEEEpeerreviewmaketitle; \\relax unless peerreview)' },
    ],
  },
  'conference-2024': {
    description:
      "The 2024 IEEE conference template's title block (IEEEtran conference): the funding \\thanks on the title, one \\IEEEauthorblockN and \\IEEEauthorblockA per author with the department and organization in italics, the city and the e-mail (or ORCID) unlabelled; IEEEkeywords after the abstract.",
    writes:
      '\\IEEEoverridecommandlockouts \\title{…\\thanks{…}} \\author{\\IEEEauthorblockN{…}\\IEEEauthorblockA{\\textit{…}\\\\\\textit{…}\\\\…\\\\…} \\and …} \\AddToHook{env/abstract/after}{\\begin{IEEEkeywords}…\\end{IEEEkeywords}} \\maketitle',
    features: ['class-styled', 'centered'],
    params: { emailLabel: '', affiliationStyle: 'italic', orcid: 'fallback' },
    evidence: [{ kind: 'source', file: CONF_2024, line: '1-2 (\\IEEEoverridecommandlockouts for the funding note), 16-20 (\\title{…\\thanks{…}}), 22-57 (blocks: \\textit{dept.} \\\\ \\textit{organization} \\\\ City, Country \\\\ email address or ORCID), 67-69 (IEEEkeywords)' }],
  },
  ieeeconf: {
    description:
      "IEEE RAS conferences' (ieeeconf) title block: \\title{\\LARGE \\bf …}, the names with superscript affiliation numbers and one \\thanks per affiliation (\"$^{1}$A is with …, {\\tt\\small e-mail}\"), the funding \\thanks first; \\maketitle, \\thispagestyle{empty}\\pagestyle{empty}; the keywords environment after the abstract.",
    writes:
      '\\IEEEoverridecommandlockouts \\title{\\LARGE \\bf …*} \\author{…$^{1}$ and …$^{2}$ \\thanks{*…} \\thanks{$^{1}$… is with … {\\tt\\small …}}} \\specialpapernotice{…} \\AddToHook{env/abstract/after}{\\begin{keywords}…\\end{keywords}} \\maketitle \\thispagestyle{empty} \\pagestyle{empty}',
    features: ['class-styled', 'centered', 'superscript'],
    params: { ...RAS, form: 'thanks' },
    evidence: [
      { kind: 'source', file: ROOT, line: '33-46 (\\title{\\LARGE \\bf …*}, \\author{Albert Author$^{1}$ and … \\thanks{*…} \\thanks{$^{1}$… is with … {\\tt\\small …}}}), 53-55 (\\maketitle \\thispagestyle{empty} \\pagestyle{empty})' },
      { kind: 'source', file: IEEECONF_CLS, line: '3809-3818 (keywords environment), 4538 (\\thanks locked out in conference mode), 4572 (\\IEEEoverridecommandlockouts)' },
    ],
  },
  'ieeeconf-blocks': {
    description: "IEEE RAS conferences' (ieeeconf) title block in author blocks: \\title{\\LARGE \\bf …}, one \\authorblockN and \\authorblockA per author joined by \\and; \\maketitle with empty page styles; the keywords environment after the abstract.",
    writes:
      '\\IEEEoverridecommandlockouts \\title{\\LARGE \\bf …} \\author{\\authorblockN{…}\\authorblockA{…\\\\…\\\\Email: …} \\and …} \\specialpapernotice{…} \\AddToHook{env/abstract/after}{\\begin{keywords}…\\end{keywords}} \\maketitle \\thispagestyle{empty} \\pagestyle{empty}',
    features: ['class-styled', 'centered'],
    params: { ...RAS, form: 'blocks' },
    evidence: [{ kind: 'source', file: IEEECONF_CLS, line: '312 (\\authorblockN, \\authorblockA and \\authorrefmark, new in V1.6), 3484-3525 (\\authorblockN, \\authorblockA), 3568-3577 (\\and between blocks)' }],
  },
  'ieeeconf-refmark': {
    description: "IEEE RAS conferences' (ieeeconf) title block for many affiliations: one \\authorblockN with each name's \\authorrefmark symbol, one \\authorblockA per affiliation opening with its mark; empty page styles; keywords after the abstract.",
    writes:
      '\\IEEEoverridecommandlockouts \\title{\\LARGE \\bf …} \\author{\\authorblockN{…\\authorrefmark{1} and …\\authorrefmark{2}} \\authorblockA{\\authorrefmark{1}…\\\\Email: …} \\authorblockA{\\authorrefmark{2}…}} \\AddToHook{env/abstract/after}{\\begin{keywords}…\\end{keywords}} \\maketitle \\thispagestyle{empty} \\pagestyle{empty}',
    features: ['class-styled', 'centered', 'symbols'],
    params: { ...RAS, form: 'refmark' },
    evidence: [{ kind: 'source', file: IEEECONF_CLS, line: '3389-3401 (\\authorrefmark: a footnote symbol by \\ifcase)' }],
  },
} as const satisfies { readonly [name: string]: Preset };
