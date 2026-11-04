import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'bib.biblatex-bibtex',
    node: 'containerBlock/refContainer',
    description:
      'biblatex with the BibTeX backend: \\usepackage[style=…, backend=bibtex, sorting=…, maxbibnames=…, giveninits, backref]{biblatex}, the entries in \\jobname.bib (filecontents*), \\addbibresource, \\printbibliography[title=…]. 18 templates.',
    ctan: ['biblatex'],
    features: ['numeric-citations', 'author-year', 'sorted-compressed', 'external-tool'],
    params: {
      style: { type: 'enum', values: ['node', 'numeric', 'numeric-comp', 'authoryear', 'authortitle', 'alphabetic', 'ieee'], default: 'node', description: "the citation and list style; node takes the node's data.referenceStyling when backend=bibtex has it, else numeric (apa needs Biber: bib.biblatex-biber)" },
      sorting: { type: 'enum', values: ['style', 'nty', 'nyt', 'ynt', 'ydnt', 'none'], default: 'style', description: "the list's order (sorting=); style keeps the style's" },
      maxnames: { type: 'number', default: 0, description: "names listed before et al. (maxbibnames=); 0 keeps the style's" },
      giveninits: { type: 'boolean', default: false, description: 'given names as initials (giveninits=true)' },
      backref: { type: 'boolean', default: false, description: 'pages that cite each entry, after it (backref=true)' },
      heading: { type: 'string', default: '', description: "the list's heading (\\printbibliography[title=…]); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'biblatex', options: ['backend=bibtex'] },
    ],
    claims: ['bibliography-engine'],
    // b2p (batch 2, G4): with backend=bibtex, biblatex writes \bibstyle{biblatex} to main.aux and BibTeX makes the .bbl.
    deny: [
      {
        class: 'class.ascelike',
        reason: "ascelike.cls calls \\bibliographystyle{ascelike} in its \\AtEndOfClass block, unconditionally, so main.aux opens with \\bibstyle{ascelike}; biblatex's backend=bibtex writes \\bibstyle{biblatex} after it, which BibTeX rejects ('Illegal, another \\bibstyle command'), and the .bbl BibTeX makes with ascelike.bst is not biblatex's (biber, ascelike's default and General's, writes no \\bibstyle and is not affected)",
        evidence: [
          { kind: 'source', file: 'ascelike.cls (ascelike 2025/03/17 v3.0, CTAN macros/latex/contrib/ascelike)', line: '\\AtEndOfClass{... \\bibliographystyle{ascelike} ...}' },
          { kind: 'compile', cell: 'b10 reference-list investigation: a repeated \\bibstyle in main.aux makes BibTeX fail and the build end (index4 no-bbl problems)' },
        ],
      },
    ],
    conflicts: [
      { pkg: 'natbib', reason: 'biblatex refuses natbib ("Incompatible package natbib"), which acmart, elsarticle and revtex4-2 load', evidence: [{ kind: 'compile', candidate: 'r2fcdef7f012217adaebc' }] },
    ],
    // The list's children are written to \jobname.bib as BibTeX source (refContainer/node.ts bibFile), so a child that is not an
    // entry never prints: General's footnote container below it never ships its text (GitHub run 41584963423: 0 of 66 not-denied
    // branches pass, 0 of 750 over the seven reference-list ways and General's; e.g. amsart.A d4dad8eac29ded704ea88 result
    // 4b4626dc99, branch b7001b17db10b98e493fc, '.0 never shipped'). Flouest's own fix is O4. [OV3]
    gives: { footnotes: false },
    zerotex: 'yes',
  }),
);
