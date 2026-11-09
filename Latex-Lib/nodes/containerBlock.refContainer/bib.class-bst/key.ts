import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

/** The classes whose own BibTeX style (or whose own \bibliographystyle call) this way prints. */
const CLASSES = [
  'class.aa',
  'class.aastex',
  'class.emulateapj',
  'class.agu',
  'class.achemso',
  'class.apa7',
  'class.ascelike',
  'class.asmeconf',
  'class.asmejour',
  'class.bmvc',
  'class.cas-dc',
  'class.cas-sc',
  'class.copernicus',
  'class.ecai',
  'class.elsarticle',
  'class.elsarticle-3p',
  'class.sn-jnl',
  'class.tufte-handout',
  'class.tufte-book',
  'class.jmlr-pmlr',
  'class.jss',
  'class.oup-authoring-template',
  'class.revtex4-2',
  'class.revtex4-2-aip',
  'class.corl',
  'class.colm',
  'class.cvpr',
  'class.iclr',
  'class.icml',
  'class.neurips',
  'class.aaai',
  'class.acl',
  'class.plos',
  'class.tmlr',
  'class.imsart',
  'class.mnras',
  'class.frontiers',
  'class.acmart',
  'class.acmart-acmsmall',
  'class.acmart-acmtog',
  'class.acmart-sigplan',
  'class.aamas',
  'class.vldb',
] as const;

export default defineKey(
  minimal({
    id: 'bib.class-bst',
    node: 'containerBlock/refContainer',
    description:
      "BibTeX with the class's own style: \\bibliography{\\jobname} with the .bst the class ships (aa, aasjournalv7, elsarticle-num, cas-model2-names, ACM-Reference-Format, icml2026, mnras, copernicus...) or no \\bibliographystyle at all where the class sets it (revtex4-2, achemso, sn-jnl, jmlr, acl, plos). natbib is loaded only where the class does not load it; optional \\citestyle, \\biboptions, \\printcredits, a \\small group, \\backmatter and \\nobibliography.",
    // The \LatexLib… once-guards (../node.ts) are the library's own, left out.
    writes: '[\\usepackage[…]{natbib}] [\\citestyle{…}] [\\biboptions{…}] [\\backmatter] [\\printcredits] [\\nocite{*}] [{\\small] [\\bibliographystyle{…}] \\bibliography{\\jobname} | \\nobibliography{\\jobname} [}]',
    ctan: ['bibtex', 'natbib'],
    features: ['numeric-citations', 'author-year', 'class-styled', 'external-tool'],
    params: {
      bst: { type: 'string', default: '', description: "the class's .bst (aa, elsarticle-num, ACM-Reference-Format...); '' writes no \\bibliographystyle, for a class that names its style itself" },
      natbib: {
        type: 'enum',
        values: ['none', 'plain', 'authoryear', 'numbers', 'authoryear-longnamesfirst'],
        default: 'none',
        compat: true,
        description: "load natbib, for a class that does not (aaai: plain; cas: authoryear,longnamesfirst; imsart: numbers or authoryear); 'none' where the class loads it",
      },
      citeStyle: { type: 'enum', values: ['', 'acmnumeric', 'acmauthoryear'], default: '', description: "acmart's \\citestyle{…} in the preamble; ''" },
      bibOptions: {
        type: 'enum',
        values: ['', 'authoryear', 'sort&compress', 'round', 'square', 'longnamesfirst'],
        default: '',
        description: "elsarticle's \\biboptions{…}, natbib options the class reads back from \\jobname.spl on the next run; ''",
      },
      size: { type: 'enum', values: ['', 'small', 'footnotesize'], default: '', description: "the list's type size, the style and list inside a group ({\\small …}, CVPR); ''" },
      printCredits: { type: 'boolean', default: false, description: "the CAS classes' CRediT authorship statement (\\printcredits) before the list" },
      backmatter: { type: 'boolean', default: false, description: '\\backmatter before the list (book-based classes)' },
      noBibliography: { type: 'boolean', default: false, description: "\\nobibliography{\\jobname} in place of \\bibliography: no list printed, the entries read for bibentry's margin citations (Tufte)" },
      cite: { type: 'boolean', default: false, compat: true, description: 'load the cite package (PLOS template)' },
      hyperref: { type: 'boolean', default: false, compat: true, description: 'load hyperref, for a class style whose .bst writes \\href (plos2025.bst)' },
      heading: { type: 'string', default: '', description: "the list's heading (\\refname, \\bibname); ''" },
      nociteAll: {
        type: 'boolean',
        default: true,
        compat: true,
        description: "\\nocite{*}, every entry listed; false lists only the cited ones (achemso, whose mciteplus stops at an entry only \\nocite{*} brings in)",
      },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'natbib', when: { natbib: ['plain', 'authoryear', 'numbers', 'authoryear-longnamesfirst'] } },
      { pkg: 'natbib', options: ['authoryear'], when: { natbib: ['authoryear', 'authoryear-longnamesfirst'] } },
      { pkg: 'natbib', options: ['longnamesfirst'], when: { natbib: 'authoryear-longnamesfirst' } },
      { pkg: 'natbib', options: ['numbers'], when: { natbib: 'numbers' } },
      { pkg: 'cite', when: { cite: true } },
      { pkg: 'hyperref', when: { hyperref: true } },
    ],
    claims: ['bibliography-engine'],
    requires: ['env:thebibliography'],
    requiresWhen: [
      // \citestyle is natbib's (acmart loads it, natbib.sty's \citestyle reads \bibstyle@<name>).
      { when: { citeStyle: ['acmnumeric', 'acmauthoryear'] }, requires: ['pkg:natbib'] },
      // \backmatter is a book-class command (book.cls, sn-jnl, oup-authoring-template, Frontiers define it).
      { when: { backmatter: true }, requires: ['cmd:\\backmatter'] },
      // mnras.bst labels its entries \protect\citeauthoryear{…}{…}{…}, which natbib defines (natbib.sty 8.31b l.1003-1004); mnras.cls
      // loads natbib only with its usenatbib option (l.1333-1340) and otherwise stops at "Undefined control sequence" (b45 probe
      // mnras), while a natbib of the way's own stops at "Command \bibhang already defined" (mnras.cls l.1641-1644).
      { when: { bst: 'mnras' }, requires: ['cmd:\\citeauthoryear'] },
    ],
    only: CLASSES,
    onlyWhen: [
      {
        when: { citeStyle: ['acmnumeric', 'acmauthoryear'] },
        classes: ['class.acmart'],
        reason: "acmnumeric and acmauthoryear are acmart's own natbib citation styles (\\bibstyle@acmnumeric, \\bibstyle@acmauthoryear); natbib alone has neither",
        evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0665-acmart/acmart.dtx', line: '1677-1685, 3279-3299' }],
      },
      {
        when: { bibOptions: ['authoryear', 'sort&compress', 'round', 'square', 'longnamesfirst'] },
        classes: ['class.elsarticle'],
        reason: "\\biboptions is elsarticle's: it writes the options to \\jobname.spl, read back before the class loads natbib on the next run",
        evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0107-elsarticle/elsarticle.dtx', line: '1338-1347' }],
      },
      {
        when: { printCredits: true },
        classes: ['class.cas-dc', 'class.cas-sc'],
        reason: "\\printcredits is cas-common.sty's: it prints the CRediT statement from the authors' \\credit marks",
        evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0920-sylvainhalle-papershell/Source/sty/cas/cas-common.sty', line: '443-468' }],
      },
      {
        when: { noBibliography: true },
        classes: ['class.tufte-handout', 'class.tufte-book'],
        reason: "\\nobibliography is bibentry's, which the Tufte classes load themselves (with natbib) for their margin citations",
        evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0793-xtufte/latex/xtufte-common.def', line: '791-803' }],
      },
    ],
    deny: [
      {
        class: 'class.achemso',
        unless: { nociteAll: false },
        reason:
          "achemso cites through mciteplus, which stops at the first \\bibitem of an entry that only \\nocite{*} brought in: 'Package mciteplus Error: Entry Status for cite key `lamport86' under tracking ID `main' is undefined' (b45 probe achemso-cite; every entry cited passes, achemso-both); the achemso preset leaves \\nocite{*} out",
        evidence: [
          { kind: 'compile', reproducer: 'b45 achemso probes: \\documentclass[journal=jacsat,manuscript=article]{achemso}, two entries, one cited, \\nocite{*} \\bibliography{\\jobname}: mciteplus Error on the uncited entry; with both cited, ok' },
          { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0528-achemso/achemso.dtx', line: '2512-2532' },
        ],
      },
    ],
    // The list's children are written to \jobname.bib as BibTeX source (refContainer/node.ts bibFile), so a child that is not an
    // entry never prints, as for bib.bibtex-bst [OV3].
    gives: { footnotes: false },
    // b45 probes (ZeroTeX-NG, BibTeX run, .bbl read, no citation undefined): aa (aa.bst copied from A&A's macros), aastex701,
    // cas-dc, cas-sc, elsarticle (num, num-names, harv), tufte-handout (list and margin-only), tufte-book, mnras [usenatbib],
    // revtex4-2 (aps, aip), acmart (sigconf, sigconf author-year, manuscript), icml (icml2025 kit, bst icml2025), achemso,
    // apa7 [man,natbib], jmlr, oup-authoring-template, ascelike, emulateapj (apj.bst copied), jss and FrontiersinHarvard (class
    // and .bst copied from their kits). Not typeset: asmeconf and asmejour stop at their own font check (\ClassErrorNoLine, a
    // font missing in the engine), copernicus.cls as released is pdfTeX-only (\pdfoutput), and sn-jnl, imsart, lipics, agu,
    // aaai, acl, plos, bmvc, ecai, corl, colm, iclr, neurips, tmlr, cvpr, aamas, vldb have no class files here.
    targetEngine: 'yes',
  }),
);
