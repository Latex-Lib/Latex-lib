import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'front.apa7',
    node: 'paragraph/title',
    description:
      "apa7's own title page (APA 7th edition): \\title, the running head \\shorttitle (and the jou-mode left head \\leftheader), the authors as one comma list with their affiliation numbers, \\authorsnames[1,{1,2}]{A, B}, the affiliations as \\authorsaffiliations{{…},{…}}, the author note \\authornote{…} with each author's \\addORCIDlink, the note's text and the correspondence line with its email, and \\keywords, before the class's \\maketitle. No date line.",
    writes:
      '\\title{…} \\shorttitle{…} \\leftheader{…} \\authorsnames[1,{1,2}]{…, …} \\authorsaffiliations{{…},{…}} \\authornote{\\addORCIDlink{…}{…} \\par … \\par Correspondence concerning this article should be addressed to …, …. Email: …} \\keywords{…} \\maketitle',
    ctan: ['apa7'],
    features: ['class-styled', 'title-page'],
    fields: [
      'author.orcid',
      'author.email',
      'affiliation.department',
      'affiliation.name',
      'affiliation.address',
      'templateSpecific.shortTitle',
      'templateSpecific.runningAuthor',
      'templateSpecific.authorNote',
      'templateSpecific.correspondingAuthor',
      'templateSpecific.keywords',
    ],
    params: {
      orcid: { type: 'boolean', default: true, description: "each author's ORCID in the author note, as \\addORCIDlink{name}{orcid} (the class draws the ORCID logo and the link)" },
      correspondence: {
        type: 'boolean',
        default: true,
        description: "the author note's correspondence line, \"Correspondence concerning this article should be addressed to <name>, <affiliation>. Email: <email>\", for the author templateSpecific.correspondingAuthor names (by email or name)",
      },
    },
    presets: PRESETS,
    // The class's \maketitle prints the stored title page, author note and (man mode) the abstract and keywords.
    claims: ['maketitle'],
    requires: ['cmd:\\maketitle', 'cmd:\\shorttitle', 'cmd:\\leftheader', 'cmd:\\authorsnames', 'cmd:\\authorsaffiliations', 'cmd:\\authornote', 'cmd:\\keywords'],
    requiresWhen: [{ when: { orcid: true }, requires: ['cmd:\\addORCIDlink'] }],
    only: ['class.apa7'],
    targetEngine: 'yes',
  }),
);
