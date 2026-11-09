import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { BARE_CONF, CONF_2024, IEEECONF_CLS, IEEETRAN_CLS, PRESETS, ROOT } from './presets.ts';

export default defineKey({
  ...minimal({
    id: 'front.ieeetran-blocks',
    node: 'paragraph/title',
    description:
      "IEEE conference title block in IEEEtran's author blocks: \\title{…} with the funding \\thanks, \\author{\\IEEEauthorblockN{name}\\IEEEauthorblockA{department \\\\ organization \\\\ address \\\\ Email: …} \\and …}, or one name block with \\IEEEauthorrefmark symbols and an affiliation block per mark, the \\IEEEspecialpapernotice, \\maketitle, and the keywords in IEEEkeywords right after the abstract (env/abstract/after hook). ieeeconf (IEEE RAS: ICRA, IROS) gives the same blocks unprefixed (\\authorblockN, \\authorblockA, \\authorrefmark, keywords), and its \\title{\\LARGE \\bf …} with superscript numbers and one \\thanks per affiliation, then \\thispagestyle{empty}\\pagestyle{empty}. IEEEtran (conference, compsoc) and ieeeconf only.",
    writes:
      '\\IEEEoverridecommandlockouts \\title{…\\thanks{…}} \\author{\\IEEEauthorblockN{…}\\IEEEauthorblockA{…\\\\…\\\\Email: …} \\and \\IEEEauthorblockN{…}\\IEEEauthorblockA{…}} \\IEEEspecialpapernotice{…} \\AddToHook{env/abstract/after}{\\begin{IEEEkeywords}…\\end{IEEEkeywords}} \\maketitle',
    ctan: ['ieeetran'],
    features: ['class-styled', 'centered'],
    params: {
      commands: {
        type: 'enum',
        values: ['ieeetran', 'ieeeconf'],
        default: 'ieeetran',
        description: "the class's names: IEEEtran's (\\IEEEauthorblockN, \\IEEEauthorblockA, \\IEEEauthorrefmark, \\IEEEspecialpapernotice, IEEEkeywords) or ieeeconf V1.6b's unprefixed ones (\\authorblockN, \\authorblockA, \\authorrefmark, \\specialpapernotice, keywords)",
      },
      form: {
        type: 'enum',
        values: ['blocks', 'refmark', 'thanks'],
        default: 'blocks',
        description: "the authors: one name and affiliation block per author joined by \\and, one name block with refmark symbols and one affiliation block per affiliation, or the names with superscript numbers and one \\thanks per affiliation (ieeeconf's root.tex)",
      },
      emailLabel: { type: 'string', default: 'Email: ', description: "the words before an e-mail in a block (bare_conf's \"Email: \", the 2024 template's none)" },
      affiliationStyle: { type: 'enum', values: ['plain', 'italic'], default: 'plain', description: "a block's department and organization lines upright, or in \\textit (the 2024 IEEE conference template)" },
      orcid: { type: 'enum', values: ['none', 'line', 'fallback'], default: 'none', description: "the author's ORCID in a block: not printed, as an \"ORCID: …\" line, or only for an author with no e-mail (the 2024 template's \"email address or ORCID\")" },
      titleFont: { type: 'tex', default: '', description: "font commands before the title text inside \\title (ieeeconf's root.tex: \\LARGE \\bf)" },
      pageStyle: { type: 'enum', values: ['class', 'empty'], default: 'class', description: "the page style: the class's, or \\thispagestyle{empty}\\pagestyle{empty} right after \\maketitle (ieeeconf's root.tex)" },
      keywords: { type: 'enum', values: ['after-abstract', 'after-title'], default: 'after-abstract', description: "where the keywords print: right after the abstract (the kernel's env/abstract/after hook), as IEEE asks, or right after \\maketitle, for a paper with no abstract" },
      peerReview: { type: 'boolean', default: false, description: "bare_conf's \\IEEEpeerreviewmaketitle after the abstract and keywords: the second title page in peerreview mode, nothing in others" },
      overrideLockouts: { type: 'boolean', default: true, description: '\\IEEEoverridecommandlockouts before the title when a \\thanks is printed: conference mode swallows \\thanks without it' },
    },
    // templateSpecific.funding is the title's \thanks (0859 l.16-20; root.tex's \thanks{*…}); templateSpecific.specialPaperNotice
    // the "(Invited Paper)" line. The thanks form prints no ORCID.
    fields: [
      'author.email',
      'author.orcid',
      'affiliation.name',
      'affiliation.department',
      'affiliation.address',
      'templateSpecific.keywords',
      'templateSpecific.funding',
      'templateSpecific.specialPaperNotice',
    ],
    presets: PRESETS,
    // It runs the class's own \maketitle, which lays the blocks out in columns and prints the notice.
    claims: ['maketitle'],
    requires: ['cmd:\\maketitle', 'cmd:\\IEEEoverridecommandlockouts'],
    requiresWhen: [
      { when: { commands: 'ieeetran' }, requires: ['env:IEEEkeywords', 'cmd:\\IEEEspecialpapernotice'] },
      { when: { commands: 'ieeetran', form: ['blocks', 'refmark'] }, requires: ['cmd:\\IEEEauthorblockN', 'cmd:\\IEEEauthorblockA'] },
      { when: { commands: 'ieeetran', form: 'refmark' }, requires: ['cmd:\\IEEEauthorrefmark'] },
      { when: { commands: 'ieeeconf' }, requires: ['env:keywords', 'cmd:\\specialpapernotice'] },
      { when: { commands: 'ieeeconf', form: ['blocks', 'refmark'] }, requires: ['cmd:\\authorblockN', 'cmd:\\authorblockA'] },
      { when: { commands: 'ieeeconf', form: 'refmark' }, requires: ['cmd:\\authorrefmark'] },
      { when: { peerReview: true }, requires: ['cmd:\\IEEEpeerreviewmaketitle'] },
    ],
    only: ['class.ieeetran', 'class.ieeetran-compsoc', 'class.ieeeconf-ras'],
    onlyWhen: [
      {
        when: { commands: 'ieeeconf' },
        classes: ['class.ieeeconf-ras'],
        reason: "only ieeeconf (IEEEtran V1.6b) has the unprefixed \\authorblockN, \\authorblockA, \\authorrefmark and keywords; IEEEtran V1.8b keeps them only as commented-out legacy aliases",
        evidence: [
          { kind: 'source', file: IEEECONF_CLS, line: '3399, 3484, 3501, 3809, 4404' },
          { kind: 'source', file: IEEETRAN_CLS, line: '6312-6318 (%\\def\\authorrefmark, %\\def\\keywords: commented out)' },
        ],
      },
      {
        when: { commands: 'ieeetran' },
        classes: ['class.ieeetran', 'class.ieeetran-compsoc'],
        reason: 'the IEEE-prefixed blocks and IEEEkeywords are IEEEtran V1.7 and later; ieeeconf (V1.6b) has none of them (it builds on class.ieeetran, so the requirements refuse it there)',
        evidence: [{ kind: 'source', file: IEEETRAN_CLS, line: '4541, 4636, 4653, 5286, 6105' }],
      },
    ],
    // Typeset on ZeroTeX-NG (2026-11-07), each on the title sample with a funding note, a special paper notice and an abstract
    // after \maketitle: ieeetran, ieeetran-refmark, peer-review and conference-2024 under IEEEtran [conference],
    // [conference,compsoc] and [journal] (peer-review also [peerreview]: two pages, the second title after the abstract);
    // ieeeconf, ieeeconf-blocks and ieeeconf-refmark under ieeeconf.cls V1.6b (Source/0223's copy, the same revision as the
    // profile's pinned file, other bytes) [letterpaper,10pt,conference] with \IEEEoverridecommandlockouts\overrideIEEEmargins.
    // No "locked out" warning; a trace showed the keywords environment (IEEEkeywords, keywords) begin right after \end{abstract}.
    targetEngine: 'yes',
  }),
  evidence: [
    { kind: 'manual', of: 'ieeetran', section: 'CTAN package page', url: 'https://ctan.org/pkg/ieeetran' },
    { kind: 'source', file: BARE_CONF, line: '323-374, 393-399' },
    { kind: 'source', file: CONF_2024, line: '1-2, 16-69' },
    { kind: 'source', file: ROOT, line: '33-55' },
    { kind: 'source', file: IEEETRAN_CLS, line: '4541-4545, 4636-4681, 5286-5292, 6105-6112, 6278-6289' },
    { kind: 'source', file: IEEECONF_CLS, line: '3399, 3484-3577, 3809-3818, 4404, 4538, 4572' },
    {
      kind: 'compile',
      reproducer:
        '\\documentclass[conference]{IEEEtran} \\begin{document} \\IEEEoverridecommandlockouts \\title{On Engines\\thanks{…}} \\author{\\IEEEauthorblockN{Ada Lovelace}\\IEEEauthorblockA{…\\\\Email: …} \\and …} \\IEEEspecialpapernotice{(Invited Paper)} \\AddToHook{env/abstract/after}{\\begin{IEEEkeywords}engines, computing\\end{IEEEkeywords}} \\maketitle \\begin{abstract}…\\end{abstract}: ok, 1 page, IEEEkeywords begins right after the abstract; the same with ieeeconf.cls and \\authorblockN/keywords (ZeroTeX-NG, 2026-11-07)',
    },
  ],
});
