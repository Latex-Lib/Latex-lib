import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'bib.thebibliography',
    node: 'containerBlock/refContainer',
    description:
      "A hand-written thebibliography: \\begin{thebibliography}{99} with one \\bibitem{key} per entry (\\bibitem[{Author(Year)}]{key} where natbib is loaded, so its author-year mode accepts the list), read from the entries' BibTeX source; its size, item spacing and heading; no BibTeX run. 95 templates.",
    ctan: ['latex-base'],
    features: ['numeric-citations', 'hand-written', 'small-type', 'compact'],
    params: {
      widest: { type: 'string', default: '99', description: 'the widest label, which sets the label column' },
      font: { type: 'tex', default: '', description: "the list's size (\\small); ''" },
      itemsep: { type: 'dimen', default: '', description: "space between entries (\\itemsep); ''" },
      heading: { type: 'string', default: '', description: "the list's heading (\\refname, \\bibname); ''" },
    },
    presets: PRESETS,
    claims: ['bibliography-engine'],
    requires: [
      'env:thebibliography',
    ],
    // The classes that load natbib in author-year mode (CA2).
    deny: [
      // b3p verify-V1 (batch 3, G2): agu's apacite has a thebibliography with no list counter.
      {
        class: 'class.agu',
        reason: "agujournal2025 loads apacite after its own thebibliography (l.1970), and apacite's thebibliography opens a \\list with no \\usecounter (apacite.sty l.1199-1235), so a \\bibitem{key} with no label stops at 'Undefined control sequence' (\\@listctr) and 'You can't use \\relax after \\the' (b3p probe G2-agu-thebib main.log l.1726, 1737); apacite reads its own \\bibitem[\\citeauthoryear...] labels, which bib.apacite writes",
        evidence: [{ kind: 'source', file: 'apacite.sty (MiKTeX package apacite, 2013/07/21 v6.03)', line: '1199-1235' }, { kind: 'source', file: 'testing-pipeline/settings/classes/files/agujournal2025.cls', line: '1939-1957, 1970-1972' }],
      },
      {
        class: 'class.aa',
        reason: "aa loads natbib in author-year mode (its default bibauthoryear: \\RequirePackage[nonamebreak]{natbib}, \\bibpunct{(}{)}{;}{a}{}{,}); its \\bibitem{key} has no Author(Year) label, so natbib writes \\NAT@force@numbers to the .aux and the next run stops at \\begin{document}: \"Package natbib Error: Bibliography not compatible with author-year citations\". apalike's labels are author-year",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/aa.cls', line: '140-146, 154, 232' },
          { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0207-tandf-interact/natbib.sty', line: "292-299, 862, 966-981, 1002-1009 (8.31b, the engine's version: elsarticle-preprint.A result d0be2dd3397d logs natbib 2010/09/13 8.31b)" },
        ],
      },
      {
        class: 'class.aastex',
        reason: "aastex701 loads natbib and switches it to author-year (\\@citestyle{aas}, after its numeric \\setup@hook); its \\bibitem{key} has no Author(Year) label, so natbib writes \\NAT@force@numbers to the .aux and the next run stops at \\begin{document}: \"Package natbib Error: Bibliography not compatible with author-year citations\". apalike's labels are author-year",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/aastex701.cls', line: '5928, 6421, 6893-6894, 6914-6915' },
          { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0207-tandf-interact/natbib.sty', line: '292-299, 862, 966-981, 1002-1009' },
        ],
      },
    ],
    // The list's children are written to \jobname.bib as BibTeX source (refContainer/node.ts bibFile), so a child that is not an
    // entry never prints: General's footnote container below it never ships its text (GitHub run 41584963423: 0 of 88 not-denied
    // branches pass, 0 of 750 over the seven reference-list ways and General's; e.g. acmart-manuscript.A dc3bae0fe3b23445785d1
    // result b284ab99f3, branch bf03b59ccd34d54147534, '.0 never shipped'). Flouest's own fix is O4. [OV3]
    gives: { footnotes: false },
    zerotex: 'untested',
  }),
);
