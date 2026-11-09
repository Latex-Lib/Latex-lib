import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const CLS = 'asmejour.cls (CTAN asmejour v1.28, 2026/11/05; title code as v1.27 in MiKTeX snapshot 9766)';

export default defineKey({
  ...minimal({
    id: 'front.asmejour',
    node: 'paragraph/title',
    description:
      "asmejour's own title block for ASME journal papers: \\title{…}, one \\SetAuthorBlock{name}{address} per author (\\author is an error in this class), the corresponding author's name ending in \\CorrespondingAuthor and each address in \"email: …\", \\keywords{…} (printed under the abstract), \\PaperNumber{…} (in the footer) and \\date{…} (an unmarked footnote); \\maketitle, which sets the author blocks beside the title and the stored abstract, runs right after the abstract by default.",
    writes: '\\title{…} \\SetAuthorBlock{…\\CorrespondingAuthor}{… \\\\ … \\\\ email: …} \\keywords{…} \\PaperNumber{…} \\date{…} \\AddToHookNext{env/abstract/after}{\\maketitle}',
    ctan: ['asmejour'],
    features: ['class-styled', 'sans-serif'],
    params: {
      maketitle: {
        type: 'enum',
        values: ['after-abstract', 'in-place'],
        default: 'after-abstract',
        description: "\\maketitle right after the next abstract (asmejour typesets the abstract stored before it, and errors on one after it), or where the title stands",
      },
    },
    // asmejour prints no ORCID and no joint first authors (asmejour.cls l.1704-1705).
    fields: ['author.email', 'affiliation.department', 'affiliation.name', 'affiliation.address', 'templateSpecific.correspondingAuthor', 'templateSpecific.keywords', 'templateSpecific.paperNumber'],
    presets: PRESETS,
    // It runs the class's own \maketitle, which prints the abstract the class keeps for it.
    claims: ['maketitle'],
    requires: [
      'cmd:\\maketitle',
      'cmd:\\SetAuthorBlock',
      'cmd:\\CorrespondingAuthor',
      'cmd:\\keywords',
      'cmd:\\PaperNumber',
    ],
    only: ['class.asmejour'],
    // Untested on the engine's class: the MiKTeX snapshot's asmejour v1.27 stops at load, before any title line ("Socket
    // 'caption/label' undeclared!", and \FontWarning undefined at l.362), and the setting's patched asmejour-latexlib.cls is not
    // in testing-pipeline/settings/classes/files. A probe with CTAN's v1.28 (2026/11/05), its caption/label socket plug removed
    // as the setting's patch guards it, typeset both presets on ZeroTeX-NG (2026-11-07): author blocks, title, abstract with
    // keywords, the corresponding author's footnote, \date{} and \PaperNumber in the footer.
    targetEngine: 'untested',
  }),
  evidence: [
    { kind: 'manual', of: 'asmejour', section: 'CTAN package page', url: 'https://ctan.org/pkg/asmejour' },
    { kind: 'manual', of: 'asmejour', section: 'asmejour-template.tex l.138-179, 494 (\\SetAuthorBlock with \\CorrespondingAuthor and an email line, \\title, \\keywords, the abstract, \\date, \\maketitle; \\PaperNumber)' },
    { kind: 'source', file: CLS, line: '918-919 (\\PaperNumber), 1566-1600 (\\SetAuthorBlock), 1641-1667 (\\keywords, the stored abstract), 1709-1715 (\\CorrespondingAuthor, no argument)' },
    { kind: 'source', file: CLS, line: '1732-1812 (\\maketitle; \\author an error; the abstract before \\maketitle; \\date; \\thanks disabled)' },
    { kind: 'source', file: 'Latex-Lib/classes/asmejour.ts', line: '26-39 (\\author is an error; the abstract stored in a coffin only \\maketitle sets)' },
    { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.asmejour/main.tex', line: '16, 75-102' },
  ],
});
