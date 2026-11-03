import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'bib.biblatex-biber',
    node: 'containerBlock/refContainer',
    description:
      'biblatex with Biber: \\usepackage[style=…, backend=biber, sorting=…, maxbibnames=…, giveninits, backref]{biblatex}, the entries in \\jobname.bib (filecontents*), \\addbibresource, \\printbibliography[title=…]; Biber runs outside TeX. 110 templates.',
    ctan: ['biblatex', 'biber'],
    features: ['numeric-citations', 'author-year', 'sorted-compressed', 'external-tool'],
    params: {
      style: { type: 'enum', values: ['node', 'numeric', 'numeric-comp', 'authoryear', 'authortitle', 'alphabetic', 'ieee', 'apa'], default: 'node', description: "the citation and list style; node takes the node's data.referenceStyling (numeric by default)" },
      sorting: { type: 'enum', values: ['style', 'nty', 'nyt', 'ynt', 'ydnt', 'none'], default: 'style', description: "the list's order (sorting=); style keeps the style's" },
      maxnames: { type: 'number', default: 0, description: "names listed before et al. (maxbibnames=); 0 keeps the style's" },
      giveninits: { type: 'boolean', default: false, description: 'given names as initials (giveninits=true)' },
      backref: { type: 'boolean', default: false, description: 'pages that cite each entry, after it (backref=true)' },
      heading: { type: 'string', default: '', description: "the list's heading (\\printbibliography[title=…]); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'biblatex', options: ['backend=biber'] },
    ],
    claims: ['bibliography-engine'],
    conflicts: [
      { pkg: 'natbib', reason: 'biblatex refuses natbib', evidence: [] },
    ],
    // The list's children are written to \jobname.bib as BibTeX source (refContainer/node.ts bibFile), so a child that is not an
    // entry never prints: General's footnote container below it never ships its text (GitHub run 41584963423: 0 of 68 not-denied
    // branches pass, 0 of 750 over the seven reference-list ways and General's; e.g. amsart.A d68b4bdb613b8653572cc result
    // 7e22cdac05, branch bd08800e1e260e9c24ae4, '.0 never shipped'). Flouest's own fix is O4. [OV3]
    gives: { footnotes: false },
    zerotex: 'untested',
  }),
);
