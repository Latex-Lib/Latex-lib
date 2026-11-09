import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey({
  ...minimal({
    id: 'front.elsarticle-frontmatter',
    node: 'paragraph/title',
    description:
      "Elsevier elsarticle's own front matter: \\begin{frontmatter} with \\title and a \\tnoteref/\\tnotetext title note, keyed \\author[affiliation labels]{name\\corref{cor1}} each followed by \\ead{email}, \\cortext for the corresponding author, keyed \\affiliation[label]{organization=…, addressline=…}, the graphicalabstract and highlights environments, and the keyword environment with \\sep and \\PACS, \\MSC[year], \\JEL codes; \\end{frontmatter} runs \\maketitle. elsarticle only; no ORCID.",
    writes:
      '\\begin{frontmatter} \\title{…\\tnoteref{t1}} \\tnotetext[t1]{…} \\author[…]{…\\corref{cor1}} \\ead{…} \\cortext[cor1]{…} \\affiliation[…]{organization={…}, addressline={…}} \\begin{graphicalabstract}…\\end{graphicalabstract} \\begin{highlights}\\item …\\end{highlights} \\begin{keyword} … \\sep … \\PACS … \\MSC[…] … \\JEL … \\end{keyword} \\end{frontmatter}',
    ctan: ['elsarticle'],
    features: ['class-styled'],
    // elsarticle has no ORCID command, so author.orcid is not printed; a per-author footnote (\fnref/\fntext) or URL (\ead[url])
    // is not a title field. The corresponding authors are correspondingAuthor (names or emails); the graphical abstract an image's
    // path or a sentence; the MSC year (\MSC[2020], 2000 by default) mscYear.
    fields: [
      'author.email',
      'affiliation.name',
      'affiliation.department',
      'affiliation.address',
      'templateSpecific.correspondingAuthor',
      'templateSpecific.titleNote',
      'templateSpecific.keywords',
      'templateSpecific.highlights',
      'templateSpecific.graphicalAbstract',
      'templateSpecific.pacs',
      'templateSpecific.msc',
      'templateSpecific.mscYear',
      'templateSpecific.jel',
    ],
    presets: PRESETS,
    // \end{frontmatter} runs the class's own \maketitle (elsarticle.dtx l.1430), which prints the keyword box it keeps.
    claims: ['maketitle'],
    requires: ['cmd:\\maketitle', 'env:frontmatter', 'env:keyword', 'cmd:\\affiliation', 'cmd:\\ead', 'cmd:\\corref'],
    only: ['class.elsarticle', 'class.elsarticle-3p'],
    targetEngine: 'yes',
  }),
  evidence: [
    { kind: 'manual', of: 'elsarticle', section: 'CTAN package page', url: 'https://ctan.org/pkg/elsarticle' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0107-elsarticle/elsarticle-template-num.tex', line: '56-139' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0107-elsarticle/elsarticle.dtx', line: '190-356, 707-826, 885-886, 1430' },
    { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.elsarticle-3p/main.tex', line: '81-124' },
    {
      kind: 'compile',
      reproducer:
        "\\documentclass[preprint]{elsarticle} and \\documentclass[3p]{elsarticle}, \\begin{abstract}…\\end{abstract}, then the title sample's front matter with a title note, the corresponding author, two keyed affiliations, a graphical abstract, two highlights and keywords with \\PACS, \\MSC[2020] and \\JEL: ok, 3 pages (graphical abstract, highlights, title page with every field); the bare sample under preprint: ok, 1 page (ZeroTeX-NG, 2026-11-07)",
    },
  ],
});
