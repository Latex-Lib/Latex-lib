import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey({
  ...minimal({
    id: 'front.cas',
    node: 'paragraph/title',
    description:
      "Elsevier CAS's own title block (cas-sc, cas-dc): \\shorttitle and \\shortauthors for the page heads, \\title[mode=title] with a title note, a subtitle as a second \\title, \\author[affiliation numbers]{name}[orcid=…] with \\cormark, \\ead and \\credit, keyed \\affiliation[n]{organization=…, addressline=…}, \\cortext, \\nonumnote, the highlights and the ARTICLE INFO keywords box with \\sep and \\MSC, \\JEL, \\PACS, then \\maketitle; the email footnote labelled in words (the class's nologo key) or with Elsevier's icon. CAS classes only.",
    writes:
      '\\shorttitle{…} \\shortauthors{…} \\title[mode=title]{…}\\tnotemark[1] \\title[mode=sub]{…} \\csgdef{casprelimstitle}{…} \\tnotetext[1]{…} \\author[…]{…}[orcid=…] \\cormark[1] \\ead{…} \\credit{…} \\affiliation[…]{organization={…}, addressline={…}} \\cortext[1]{…} \\nonumnote{…} \\begin{highlights} \\item … \\end{highlights} \\begin{keywords} … \\sep … \\MSC{…} \\JEL{…} \\PACS{…} \\end{keywords} \\maketitle; \\ExplSyntaxOn\\keys_set:nn{stm/mktitle}{nologo}\\ExplSyntaxOff',
    ctan: ['els-cas-templates'],
    features: ['class-styled'],
    params: {
      emailLabel: { type: 'enum', values: ['text', 'icon'], default: 'text', description: "the email footnote's label: \"Email address:\" in words (the class's nologo key, set in the preamble), or Elsevier's envelope icon, thumbnails/cas-email.jpeg, which the template's bundle must carry" },
      subtitleMode: { type: 'enum', values: ['sub', 'alt', 'trans'], default: 'sub', description: "the \\title mode of templateSpecific.subtitle: sub (\\large, dark grey), alt (\\large, black) or trans (\\normalsize, grey)" },
    },
    // A per-author URL or footnote (\ead[url], \fnmark/\fntext) is not a title field, so it is not printed; the CRediT roles are
    // the template field creditRoles (name to roles), the corresponding authors correspondingAuthor (names or emails).
    fields: [
      'author.email',
      'author.orcid',
      'affiliation.name',
      'affiliation.department',
      'affiliation.address',
      'templateSpecific.shortTitle',
      'templateSpecific.runningAuthor',
      'templateSpecific.subtitle',
      'templateSpecific.titleNote',
      'templateSpecific.correspondingAuthor',
      'templateSpecific.creditRoles',
      'templateSpecific.nonumNote',
      'templateSpecific.highlights',
      'templateSpecific.keywords',
      'templateSpecific.msc',
      'templateSpecific.jel',
      'templateSpecific.pacs',
    ],
    presets: PRESETS,
    // It runs the class's own \maketitle, which prints the abstract, keywords and highlights cas keeps for it (heldByMaketitle).
    claims: ['maketitle'],
    requires: ['cmd:\\maketitle', 'cmd:\\shorttitle', 'cmd:\\shortauthors', 'cmd:\\cormark', 'cmd:\\ead', 'cmd:\\affiliation', 'env:keywords', 'env:highlights'],
    only: ['class.cas-dc', 'class.cas-sc'],
    // Every preset typesets under cas-dc and cas-sc on ZeroTeX-NG (2026-11-07), after an abstract: the sample, and a title with a
    // subtitle (alt, trans), title note, \nonumnote, CRediT roles, highlights and \MSC, \JEL, \PACS; email-icons with a
    // thumbnails/cas-email.jpeg beside main.tex, as a bundle must carry it.
    targetEngine: 'yes',
  }),
  evidence: [
    { kind: 'manual', of: 'els-cas-templates', section: 'CTAN package page', url: 'https://ctan.org/pkg/els-cas-templates' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0920-sylvainhalle-papershell/Source/sty/cas/cas-common.sty', line: '146-170, 213-587, 895-996, 1118-1290, 1547-1623, 2390-2394' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0920-sylvainhalle-papershell/Source/tpl/cas/preamble.tpl', line: '57-102' },
    { kind: 'requirement', file: 'Template/template-requirement/Elsevier_CAS_DC.md', line: '64-101' },
    {
      kind: 'compile',
      reproducer:
        "\\documentclass{cas-dc} (and cas-sc) \\ExplSyntaxOn\\keys_set:nn{stm/mktitle}{nologo}\\ExplSyntaxOff \\begin{document} \\begin{abstract}…\\end{abstract} \\shorttitle{Engines} \\shortauthors{…} \\title[mode=title]{On Engines} \\author[1]{Ada Lovelace}[orcid=0000-0002-1825-0097] \\cormark[1] \\ead{ada@example.org} \\author[1,2]{Alan Turing} \\ead{alan@example.org} \\affiliation[1]{organization={…}, addressline={…}} \\affiliation[2]{…} \\cortext[1]{Corresponding author} \\begin{keywords} engines \\sep computing \\end{keywords} \\maketitle: typesets (ZeroTeX-NG, 2026-11-07); without the nologo line it stops at \"Unable to load picture or PDF file 'thumbnails/cas-email.jpeg'\"",
    },
  ],
});
