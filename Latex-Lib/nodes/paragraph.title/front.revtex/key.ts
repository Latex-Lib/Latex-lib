import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS, QUANTUM, REVTEX } from './presets.ts';

export default defineKey(
  minimal({
    id: 'front.revtex',
    node: 'paragraph/title',
    description:
      "REVTeX 4.2 (APS, AIP) and quantumarticle author-then-affiliation title block, in the body: \\preprint{…}, \\title[short]{…} with a title \\thanks{…}, then per author \\author{…} and \\email{…} (\\email[Corresponding author: ]{…} for the corresponding author; \\orcid{…} under quantumarticle; \\altaffiliation[Also at ]{…} for a second institute if asked), each run of authors sharing institutes followed by one \\affiliation{…} per institute (\\noaffiliation for none), \\collaboration{…}, \\date{…}, \\keywords{…} and \\pacs{…}, and \\maketitle, or none where the abstract way writes it after revtex's abstract.",
    writes:
      '\\preprint{…} \\title[…]{…} \\thanks{…} \\author{…} \\email[…]{…} \\orcid{…} \\altaffiliation[…]{…} \\affiliation{…} \\collaboration{…} \\noaffiliation \\date{…} \\keywords{…} \\pacs{…} \\maketitle',
    ctan: ['revtex', 'quantumarticle'],
    features: ['class-styled', 'centered'],
    params: {
      form: {
        type: 'enum',
        values: ['revtex', 'quantum'],
        default: 'revtex',
        compat: true,
        description: "the class's dialect: revtex4-2's (\\preprint, title \\thanks, \\pacs, \\noaffiliation) or quantumarticle's (\\orcid per author; no \\preprint, \\pacs or \\noaffiliation, and \\thanks only after an \\author)",
      },
      maketitle: {
        type: 'enum',
        values: ['here', 'after-abstract'],
        default: 'here',
        description: "\\maketitle after the block, or none: the abstract way writes it after revtex's abstract, which must come before it (revtex4-2.cls l.2548-2574, 2685)",
      },
      date: { type: 'enum', values: ['given', 'today'], default: 'given', description: "the node's date only (none: revtex's default is empty, quantumarticle's \\date{}), or \\date{\\today} when the node gives none, as apstemplate.tex l.69" },
      emails: { type: 'enum', values: ['all', 'corresponding'], default: 'all', description: "every author's \\email, or only the corresponding author's" },
      correspondingText: { type: 'string', default: '', description: "the corresponding author's \\email prefix, \\email[<text>]{…} (revtex's own is 'Electronic address: '), or '' for a plain \\email" },
      keywordSeparator: { type: 'string', default: ', ', description: "what joins the keywords in \\keywords{…} (AIP's '; ')" },
      secondaryAffiliation: {
        type: 'enum',
        values: ['affiliation', 'altaffiliation'],
        default: 'affiliation',
        description: "an author's second and later institutes as more \\affiliation lines, or as \\altaffiliation[Also at ]{…} footnotes (aipsamp.tex l.48)",
      },
      altaffiliationText: { type: 'string', default: 'Also at ', description: "the \\altaffiliation prefix, \\altaffiliation[<text>]{…}" },
    },
    fields: [
      'author.email',
      'author.orcid',
      'affiliation.name',
      'affiliation.department',
      'affiliation.address',
      'templateSpecific.shortTitle',
      'templateSpecific.titleNote',
      'templateSpecific.preprint',
      'templateSpecific.collaboration',
      'templateSpecific.keywords',
      'templateSpecific.pacs',
      'templateSpecific.correspondingAuthor',
    ],
    presets: PRESETS,
    // It owns the title, as front.aastex does: with maketitle 'here' it runs the class's \maketitle (which prints revtex's held
    // abstract and the keywords); with 'after-abstract' the paired abstract way writes the \maketitle line and claims nothing.
    claims: ['maketitle'],
    requires: ['cmd:\\maketitle', 'cmd:\\affiliation', 'cmd:\\email', 'cmd:\\keywords'],
    requiresWhen: [{ when: { form: 'quantum' }, requires: ['cmd:\\orcid'] }],
    only: ['class.revtex4-2', 'class.revtex4-2-aip', 'class.quantumarticle'],
    onlyWhen: [
      {
        when: { form: 'revtex' },
        classes: ['class.revtex4-2'],
        reason: "\\preprint, \\pacs, \\noaffiliation and a \\thanks after \\title are revtex4-2's (l.2227-2240, 2416, 2530-2537); quantumarticle defines none of the first three and stops at a \\thanks before the first \\author (l.1226-1228)",
        evidence: [
          { kind: 'source', file: `${REVTEX}/tex/latex/revtex/revtex4-2.cls`, line: '2227-2240, 2416, 2530-2537' },
          { kind: 'source', file: QUANTUM, line: '1182-1183, 1220-1231' },
        ],
      },
      {
        when: { form: 'quantum' },
        classes: ['class.quantumarticle'],
        reason: "\\orcid is quantumarticle's (l.1229-1231, printed as a link on the name, l.1110); revtex4-2 defines no ORCID command: \"Undefined control sequence\"",
        evidence: [{ kind: 'source', file: QUANTUM, line: '1110, 1229-1231' }],
      },
    ],
    deny: [
      {
        class: 'class.quantumarticle',
        unless: { date: 'given' },
        reason: "quantumarticle redefines \\today as a ClassError after the preamble unless the class option allowtoday or noarxiv is given (l.216-219, 296-307), so \\date{\\today} stops at \\maketitle",
        evidence: [{ kind: 'source', file: QUANTUM, line: '216-219, 296-307' }],
      },
    ],
    // Typeset ok (ZeroTeX-NG, 2026-11-07) on the title sample and a fuller one (\preprint, a title note, a third author with no
    // institute, so \noaffiliation, a collaboration, \pacs; and one with dateMode default, so \date{\today}): aps and aip under
    // revtex4-2 [aps|aip,reprint] with the profile's setup line, each followed by an abstract and \maketitle as the abstract way
    // writes them; revtex-title-only with no abstract; quantum under quantumarticle [a4paper,twocolumn,11pt,nopdfoutputerror] with
    // hyperref, an abstract after the block. No class warning about the block (no "No title", no "Assuming \noaffiliation").
    targetEngine: 'yes',
  }),
);
