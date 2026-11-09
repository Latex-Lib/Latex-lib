import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS, REQUIREMENT, TEMPLATE } from './presets.ts';

export default defineKey({
  ...minimal({
    id: 'front.sn-jnl',
    node: 'paragraph/title',
    description:
      "Springer Nature's journal title block (sn-jnl): \\title[short]{full}, \\author*[affiliation numbers]{\\fnm{given} \\sur{surname}}\\email{…} for the corresponding author and \\author[…] for the others (\\nomail without an e-mail), \\affil*[n]{\\orgdiv{…}, \\orgname{…}, \\orgaddress{…}}, \\keywords{…} and \\pacs[scheme]{codes} (MSC, JEL), then \\maketitle, which prints them with the stored \\abstract{}. No ORCID: the class's logo file is not shipped. sn-jnl only.",
    writes: '\\title[…]{…} \\author*[…]{\\fnm{…} \\sur{…}}\\email{…} \\author[…]{\\fnm{…} \\sur{…}}\\nomail \\affil*[…]{\\orgdiv{…}, \\orgname{…}, \\orgaddress{…}} \\affil[…]{…} \\keywords{…} \\pacs[…]{…} \\maketitle; \\usepackage{xcolor}',
    ctan: [],
    features: ['class-styled'],
    // The subject classifications are templateSpecific.subjectClasses, scheme to codes; the corresponding authors
    // correspondingAuthor (names or emails). author.orcid is not printed (\orcid includes Orcidlogo.eps, not shipped).
    fields: [
      'author.email',
      'affiliation.department',
      'affiliation.name',
      'affiliation.address',
      'templateSpecific.shortTitle',
      'templateSpecific.correspondingAuthor',
      'templateSpecific.keywords',
      'templateSpecific.subjectClasses',
    ],
    presets: PRESETS,
    // \email calls \textcolor (cls l.540, 545); the class loads neither xcolor nor color.
    loads: [{ pkg: 'xcolor' }],
    // It runs the class's own \maketitle, which prints the abstract and keywords sn-jnl keeps for it.
    claims: ['maketitle'],
    requires: ['cmd:\\maketitle', 'cmd:\\affil', 'cmd:\\fnm', 'cmd:\\sur', 'cmd:\\keywords'],
    only: ['class.sn-jnl'],
    // Not typeset: the engine's package mirror has no sn-jnl.cls ("File `sn-jnl.cls' not found", ZeroTeX-NG, 2026-11-07), and
    // the testing pipeline holds no copy (settings/classes/sn-jnl.json lists no files). \nomail is written as the manual
    // names it, unmeasured.
    targetEngine: 'untested',
  }),
  evidence: [
    { kind: 'requirement', file: REQUIREMENT, line: '45 (\\title[short]{full}, cls l.463-466), 46 (\\abstract and \\keywords stored for \\maketitle, cls l.632-645, 816-826), 47 (\\author*, \\affil numbers, \\nomail), 48 (\\fnm, \\sur, \\orgdiv, \\orgname, \\orgaddress, cls l.520-526, 600-607), 49 (\\email in \\textcolor, xcolor), 65 (\\keywords, \\pacs[name]{…}, cls l.644-677), 132 (\\orcid needs Orcidlogo.eps)' },
    { kind: 'source', file: TEMPLATE, line: '19 (xcolor), 63-86 (\\title[…], \\author*[1,2]{\\fnm{…} \\sur{…}}\\email{…}, \\affil*[1]{\\orgdiv{…}, \\orgname{…}, \\orgaddress{…}}, \\abstract, \\keywords, \\maketitle)' },
  ],
});
