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

/** Batch 4 round 1 (GitHub run r20261109215129525), as its evidence names it. */
const B4R1 = (what: string) => ({ kind: 'compile', cell: `batch 4 round 1: ${what}` }) as const;

/**
 * The classes (or their settings) that call \bibliographystyle themselves, so main.aux already opens with a \bibstyle: a style of
 * the list's own is a second one, which BibTeX rejects ('Illegal, another \bibstyle command'), and the build ends with no .bbl,
 * as under bib.bibtex-bst (CA11). agu's setting makes a later \bibliographystyle{apacite} do nothing (its preamble), so apacite
 * is the one style the list may name under agu.
 */
const OWN_STYLE = [
  { class: 'class.acl', where: "acl.sty calls \\bibliographystyle{acl_natbib} while it loads (l.195)" },
  { class: 'class.agu', where: "agujournal2025.cls calls \\bibliographystyle{apacite} while it loads (l.146)" },
  { class: 'class.ascelike', where: "ascelike.cls calls \\bibliographystyle{ascelike} in its \\AtEndOfClass block" },
  { class: 'class.bmvc', where: "bmvc2k.cls calls \\bibliographystyle{plainnat} while it loads (l.775)" },
  { class: 'class.corl', where: "corl_2026.sty calls \\bibliographystyle{corlabbrvnat} while it loads (l.79)" },
  { class: 'class.ecai', where: "ecai.cls calls \\bibliographystyle{abbrvnat} at its end (l.1327)" },
  { class: 'class.jmlr-pmlr', where: "jmlr.cls calls \\bibliographystyle{plainnat} while it loads (l.178)" },
  { class: 'class.jss', where: "jss.cls calls \\bibliographystyle{jss} while it loads (l.65)" },
  { class: 'class.plos', where: "the plos setting's preamble calls \\bibliographystyle{plos2025} (plos.json)" },
  { class: 'class.sn-jnl', where: "sn-jnl's sn-mathphys-num option calls \\bibliographystyle{sn-mathphys-num} while the class loads (l.1661-1664)" },
] as const;

/**
 * The classes whose natbib is author-year (aa's bibauthoryear, aastex701's \@citestyle{aas}, which emulateapj inherits through its
 * base, and the conference styles' natbib with no option or \setcitestyle{authoryear}): a numbered style's \bibitem has no
 * Author(Year) label and natbib stops at 'Bibliography not compatible with author-year citations', as under bib.bibtex-bst (CA2).
 */
const AUTHOR_YEAR = ['class.aa', 'class.aastex', 'class.colm', 'class.frontiers', 'class.iclr', 'class.icml', 'class.neurips', 'class.tmlr'] as const;

/**
 * The styles whose labels author-year natbib reads (measured in batch 4 round 1 under the AUTHOR_YEAR classes: aasjournalv7,
 * ACM-Reference-Format, elsarticle-num-names, mnras, plainnat pass; the others are author-year styles by their kits), and '' (the
 * class's own). The numbered ones (asmeconf, asmejour, elsarticle-num, oup-plain, spr-ims-number, ieeenat_fullname) are not here.
 */
const AUTHOR_YEAR_STYLES = ['', 'aa', 'aasjournalv7', 'apj', 'apacite', 'cas-model2-names', 'copernicus', 'elsarticle-num-names', 'elsarticle-harv', 'plainnat', 'icml2026', 'iclr2027_conference', 'colm2026_conference', 'tmlr', 'mnras', 'Frontiers-Harvard', 'spr-ims-nameyear', 'ACM-Reference-Format'];

/**
 * The styles that ship only with their class's kit: neither the engine's distribution nor any other class setting has them, so
 * \bibliography under another class ends with no .bbl (batch 4 round 1: each of these presets fails no-bbl in every pair but its
 * own class's and apa7's, whose natbib option leaves the style to apacite).
 */
const KIT_STYLES = [
  { bst: 'aa', class: 'class.aa' },
  { bst: 'apj', class: 'class.emulateapj' },
  { bst: 'icml2026', class: 'class.icml' },
  { bst: 'iclr2027_conference', class: 'class.iclr' },
  { bst: 'colm2026_conference', class: 'class.colm' },
  { bst: 'tmlr', class: 'class.tmlr' },
  { bst: 'ieeenat_fullname', class: 'class.cvpr' },
  { bst: 'copernicus', class: 'class.copernicus' },
  { bst: 'Frontiers-Harvard', class: 'class.frontiers' },
  { bst: ['spr-ims-number', 'spr-ims-nameyear'], class: 'class.imsart' },
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
      // Batch 4 round 1: the list with no \bibliographystyle (class-style, achemso, plos) needs a class that names its style.
      {
        when: { bst: '', natbib: 'none' },
        classes: [...OWN_STYLE.map((r) => r.class), 'class.apa7', 'class.emulateapj', 'class.revtex4-2', 'class.achemso'],
        reason:
          "with no \\bibliographystyle the list relies on the class (or its setting) to name the style; under any other class main.aux has no \\bibstyle, BibTeX stops ('I found no \\bibstyle command') and the build ends with no .bbl and every citation undefined. A citation of this way with no list preset of its own is printed with this form (the host prints the way's first preset, class-style)",
        evidence: [
          B4R1("class-style fails no-bbl in 33 pairs (aa.A document d29f75a53799a7cb573ac, result f3f3249058fffbd49442b6f0715e27a4fc5dfb5af4d377e9a92aca137ffd82c4) and passes in the 13 whose class names its style (acl, agu, apa7, ascelike, bmvc, corl, ecai, emulateapj, jmlr-pmlr, jss, plos, revtex4-2-aip, revtex4-2-aps); sn-jnl.A fails only because sn-mathphys-num.bst is not among its setting's files (result 002574aed1e7474b06f09d18845e534ff562bf1f6913344216563864bf84a00e)"),
          B4R1("750 bib.class-bst citation branches end at no-bbl in 34 pairs, their documents printing class-style (aa.A document d7b16b9e6948746066e08, cell c9aebb4c61785f4f97b12, result 333afde60ad6729df489c6ab08a11f8f425c7caf066c493efceb550c24a96d82: 'No file main.bbl.')"),
        ],
      },
      {
        when: { bst: '', natbib: ['plain', 'authoryear', 'numbers', 'authoryear-longnamesfirst'] },
        classes: ['class.aaai', 'class.acl', 'class.apa7', 'class.bmvc', 'class.corl', 'class.ecai', 'class.emulateapj', 'class.jmlr-pmlr', 'class.jss', 'class.revtex4-2'],
        reason:
          "natbib loaded with no \\bibliographystyle is AAAI's form: aaai2027.sty names its style once natbib is loaded (l.343-355); it also runs where the class or its setting names a style natbib reads (the classes listed, as measured); elsewhere main.aux has no \\bibstyle (no .bbl), or the class's own style meets the way's natbib (plos2025.bst's numbers under natbib's default author-year, ascelike's \\citeyear defined twice)",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/aaai2027.sty', line: '343-355' },
          B4R1("the aaai preset passes (7 of 9 branches each, the other 2 sentinel:missing) under aaai.A, acl.A, apa7.A, bmvc.A, corl.A, ecai.A, emulateapj.A, jmlr-pmlr.A, jss.A, revtex4-2-aip.A and revtex4-2-aps.A; it fails no-bbl in 31 pairs (aa.A document da34c79b27976a41c389d, result e7e7aa59988946fef61c975c800f169462bd5aafdf19cfc7375cc5fbb8004ee1), 'Bibliography not compatible with author-year citations' under plos.A (result 59240dd46e11dedac835140635404c010ae1e5663711a2cc417430fd8c4c97fb) and 'Command \\citeyear already defined' under ascelike.A (result 8653e6ecec1fcdec7cdc7dd5453515b746b46234124db638018ecccfbe6091a3)"),
        ],
      },
      // Batch 4 round 1: a style only its class's kit ships.
      ...KIT_STYLES.map((k) => ({
        when: { bst: k.bst },
        classes: [k.class],
        reason: `${[k.bst].flat().join(' and ')}.bst ships only with ${k.class.slice('class.'.length)}'s kit: neither the engine's distribution nor another class setting has it, so under another class BibTeX cannot open the style and the build ends with no .bbl`,
        evidence: [
          B4R1("each of the aa, emulateapj, icml, iclr, colm, tmlr, cvpr, copernicus and frontiers presets fails no-bbl in 41 to 45 pairs (aa preset under acmart-sigconf.A, copernicus preset document da258c564cefd0983b37b, result c2128a9a00b6537839c4aecb84d657c5f5ec44db2f92f70ff3e8ed4553e18087); copernicus and frontiers pass under their own class, whose setting holds the .bst (copernicus.A result c4639dc7be7ac7d56fbcf43480db693c87f403c76b653bc519208bf92be71c11)"),
        ],
      })),
      // Batch 4 round 2: mnras.bst's labels need \citeauthoryear, which natbib defines; the matrix files by `onlyWhen`, not by
      // `requiresWhen`. The classes named load natbib themselves (emulateapj through aastex; acmart's variants, aamas and vldb
      // through acmart; elsarticle-3p and -5p through elsarticle; revtex4-2-aip through revtex4-2).
      {
        when: { bst: 'mnras', natbib: 'none' },
        classes: ['class.aa', 'class.aastex', 'class.acmart', 'class.apa7', 'class.asmeconf', 'class.asmejour', 'class.colm', 'class.copernicus', 'class.cvpr', 'class.elsarticle', 'class.frontiers', 'class.iclr', 'class.icml', 'class.mnras', 'class.neurips', 'class.oup-authoring-template', 'class.revtex4-2', 'class.tmlr'],
        reason:
          "mnras.bst labels each entry \\protect\\citeauthoryear{…}{…}{…}, which natbib defines (natbib.sty 8.31b l.1003-1004); with no natbib of the list's own (natbib 'none') only a class that loads natbib reads it. Under aaai, cas-dc, cas-sc, imsart and tufte-handout (its setting's nobib unloads natbib) the list stops at 'Undefined control sequence' (\\citeauthoryear in \\bibitem's label). onlyWhen cannot see class options, so a default tufte-handout, which loads natbib, is refused too (not measured)",
        evidence: [
          { kind: 'compile', cell: "batch 4 round 2 (testing-pipeline/out/fetched/batch4-round2): the mnras preset's solo branch, document d5e2788f1ff65792ac621, fails under aaai.A (cell c1de2926d4226e07b87a3, result e1a085b88fa6ecc2f154583ef75d9908aa4b1610d2902084169f8c9e603579a8), cas-dc.A, cas-sc.A, imsart.A and tufte-handout.A, and passes in the 31 pairs of the classes named" },
        ],
      },
      {
        when: { bst: 'apacite' },
        classes: ['class.apa7', 'class.agu'],
        reason:
          "apacite.bst writes apacite's own commands into the .bbl (\\APACinsertmetastar, the APACrefauthors environment), which only apacite.sty defines; apa7 (natbib option) and agujournal2025 load apacite, under any other class the list stops at 'Undefined control sequence' (l.11 \\APACinsertmetastar of main.bbl)",
        evidence: [
          B4R1("the apa7 preset stops at 'Undefined control sequence' in 35 pairs (aa.A document d4f261bb5e7af20713ed7, result 2edce373dde6c33b70edd35f810a34ea8ec1b247964bd59bac75600f27c4be7f) and passes under apa7.A and agu.A (result c0bf94e8bb910d8236809016665d0088b09f08810c5b1cf1a0e0da5d94315170)"),
        ],
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
      // Batch 4 round 1: a style of the list's own under a class that names one itself (CA11).
      ...OWN_STYLE.map((r) => ({
        class: r.class,
        unless: { bst: r.class === 'class.agu' ? ['', 'apacite'] : '' },
        reason: `${r.where}, so main.aux opens with that \\bibstyle; the list's own \\bibliographystyle writes a second one, which BibTeX rejects ('Illegal, another \\bibstyle command'), and the build ends with no .bbl and every citation undefined; the presets with no style (class-style) take the class's`,
        evidence: [
          B4R1("every preset with a style fails no-bbl in exactly the pairs acl, agu, ascelike, bmvc, corl, ecai, jmlr-pmlr, jss, plos and sn-jnl, styles the engine has included (aastex preset under acl.A: document df6532c96214ea698855a, result a6f6190551fe3e111205b6468d588bc0690190a681e9d6a67f808f583c4f2eee), and passes in the 26 to 36 other pairs"),
        ],
      })),
      // Batch 4 round 1: a numbered style under author-year natbib (CA2).
      ...AUTHOR_YEAR.map((c) => ({
        class: c,
        unless: { bst: AUTHOR_YEAR_STYLES },
        reason:
          "the class's natbib is author-year (CA2; emulateapj through its aastex base); a numbered style's \\bibitem has no Author(Year) label, so natbib writes \\NAT@force@numbers to the .aux and the next run stops at \\begin{document}: 'Package natbib Error: Bibliography not compatible with author-year citations'",
        evidence: [
          B4R1("the asmeconf, asmejour, elsarticle-num and oup presets stop so in aa.A, aastex.A, aastex.B, colm.A, emulateapj.A, frontiers.A, iclr.A, icml.A, neurips.A and tmlr.A, 40 branches (asmeconf preset under aa.A: document da1e44f11a32f44b54fa2, cell c5f52c8f1d0297cd2f932, result 990e44c6a0f301ed8af0634fab2a99140f5b41bf883102caa44360175655ad80), and pass in the 26 other pairs"),
        ],
      })),
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
