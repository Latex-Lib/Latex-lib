import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'front.beamer-title',
    node: 'paragraph/title',
    description:
      "beamer's (and ctexbeamer's) title data for a slide deck: \\title[short]{…}, \\subtitle{…}, \\author[short]{A\\inst{1} \\and B\\inst{1,2}} with the e-mails under the institutes or under the names, \\institute[short]{\\inst{1} … \\and \\inst{2} …}, \\date[short]{…}, \\subject{…} and \\keywords{…} (PDF metadata), a \\thanks note, all declared in the preamble; then \\titlepage in the title frame, or \\maketitle, which makes the frame itself.",
    // Preamble; body.
    writes: '\\title[…]{…} \\subtitle{…} \\author[…]{…\\inst{…} \\and …} \\institute[…]{\\inst{…} … \\\\ \\texttt{…} \\and \\inst{…} …} \\date[…]{…} \\subject{…} \\keywords{…} \\titlepage',
    ctan: ['beamer'],
    features: ['class-styled', 'title-page', 'centered'],
    params: {
      titlePage: {
        type: 'enum',
        values: ['titlepage', 'maketitle'],
        default: 'titlepage',
        description: "\\titlepage where the title stands, inside its frame, or \\maketitle, which makes \\frame{\\titlepage} outside a frame (beamerbasetitle.sty l.21)",
      },
      emails: {
        type: 'enum',
        values: ['institute', 'author', 'none'],
        default: 'institute',
        description: "the authors' e-mails (\\texttt) under their first institute in \\institute, under each name in \\author (a one-column tabular), or nowhere",
      },
      orcid: {
        type: 'enum',
        values: ['none', 'href'],
        default: 'none',
        description: "each author's ORCID under the name, linked with hyperref's \\href (beamer loads hyperref), or none",
      },
    },
    fields: [
      'author.email',
      'author.orcid',
      'affiliation.name',
      'affiliation.department',
      'affiliation.address',
      'templateSpecific.subtitle',
      'templateSpecific.shortTitle',
      'templateSpecific.runningAuthor',
      'templateSpecific.shortInstitute',
      'templateSpecific.shortDate',
      'templateSpecific.subject',
      'templateSpecific.keywords',
      'templateSpecific.thanks',
    ],
    presets: PRESETS,
    only: ['class.beamer', 'class.ctexbeamer'],
    // \titlepage is beamer's \maketitle (l.21); it prints the title page the theme draws, and the \thanks notes (l.29).
    claims: ['maketitle'],
    requires: ['cmd:\\institute'],
    requiresWhen: [
      { when: { titlePage: 'titlepage' }, requires: ['cmd:\\titlepage'] },
      { when: { titlePage: 'maketitle' }, requires: ['cmd:\\maketitle'] },
      // \texorpdfstring (author e-mails) and \href (ORCID) are hyperref's, which beamer always loads (beamer.cls l.388).
      { when: { emails: 'author' }, requires: ['pkg:hyperref'] },
      { when: { orcid: 'href' }, requires: ['pkg:hyperref'] },
    ],
    // ZeroTeX-NG, 2026-11-07: every preset under beamer (default and Madrid themes) and titlepage and maketitle under ctexbeamer
    // typeset, the declarations in the preamble and \titlepage in a [fragile] frame as the preview sets it.
    targetEngine: 'yes',
  }),
);
