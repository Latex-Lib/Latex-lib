import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const CLS = 'testing-pipeline/settings/classes/files/aastex701.cls';

export default defineKey(
  minimal({
    id: 'front.aastex',
    node: 'paragraph/title',
    description:
      "AASTeX 7 (aastex701) front matter, with no \\maketitle of its own: \\title, \\shorttitle and \\shortauthors for the running heads, then per author \\author[orcid=…]{…}, one \\affiliation per institute and an \\email (\\email[show] for those printed at the foot of the first page; an empty \\affiliation or \\email where the author has none, which the class requires), \\collaboration{all}{…}, \\correspondingauthor, the \\received, \\revised, \\accepted and \\published dates and \\keywords{a --- b}; the class's first \\section prints the title block.",
    writes:
      '\\title{…} \\shorttitle{…} \\shortauthors{…} \\author[orcid=…]{…} \\affiliation{…} \\email[show]{…} \\author{…} \\affiliation{…} \\email{…} \\collaboration{all}{…} \\correspondingauthor{…} \\received{…} \\revised{…} \\accepted{…} \\published{…} \\keywords{… --- …}',
    ctan: ['aastex'],
    features: ['class-styled', 'centered'],
    params: {
      showEmails: {
        type: 'enum',
        values: ['corresponding', 'listed', 'all', 'none'],
        default: 'corresponding',
        description:
          "which e-mails take \\email[show] and print at the foot of the first page: those templateSpecific.shownEmails names (by e-mail or name) and the corresponding author's, only those listed, every author's, or none (the class prints an e-mail only with show)",
      },
    },
    fields: [
      'author.orcid',
      'author.email',
      'affiliation.department',
      'affiliation.name',
      'affiliation.address',
      'templateSpecific.shortTitle',
      'templateSpecific.runningAuthor',
      'templateSpecific.correspondingAuthor',
      'templateSpecific.shownEmails',
      'templateSpecific.collaboration',
      'templateSpecific.received',
      'templateSpecific.revised',
      'templateSpecific.accepted',
      'templateSpecific.published',
      'templateSpecific.keywords',
    ],
    presets: PRESETS,
    // The class's own \maketitle prints this block, run by its first \section (aastex701.cls l.7583-7594); an explicit \maketitle
    // is refused by the profile (forbids.names), so the way writes none and requires none, but it is the way that owns the title.
    claims: ['maketitle'],
    requires: ['cmd:\\affiliation', 'cmd:\\correspondingauthor', 'cmd:\\keywords'],
    only: ['class.aastex'],
    deny: [
      {
        // emulateapj is built on class.aastex in its profile, so `only` would reach it.
        class: 'class.emulateapj',
        reason:
          "emulateapj is REVTeX 4.0 underneath, not AASTeX 7: its \\email[…]{…} prints the optional text before the address (so [show] prints \"show\"), \\author takes no orcid= key and \\collaboration one argument, so AASTeX 7's \\email[show], \\author[orcid=…] and \\collaboration{all}{…} misprint there",
        evidence: [
          { kind: 'source', file: CLS, line: '13341-13350 (\\email[show]: the optional argument only selects the shown list), 13377 (\\collaboration#1#2)' },
          { kind: 'source', file: 'revtex4.cls (MiKTeX package revtex4, 2020/09/30 v4.0a)', line: '\\email[#1]#2 and \\collaboration#1 (REVTeX 4.0 front matter)' },
        ],
      },
    ],
    // Typeset ok under aastex701 (ZeroTeX-NG, 2026-11-07): the block, an abstract after it and a \section that prints it, on the
    // title sample, a fuller one (collaboration, the four dates, a listed shown e-mail) and one with a third author with no
    // institute or e-mail (the empty \affiliation{} and \email{} pass the class's checks; the empty affiliation prints a bare mark).
    targetEngine: 'yes',
  }),
);
