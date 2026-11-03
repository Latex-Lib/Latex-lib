import { defineClass } from '../schema/class.ts';

/**
 * elsarticle, as the class probe measured it (elsarticle-preprint.A: loads, preloads,
 * names it already defines, refused packages, layout), with what its
 * requirement document says it defines and forbids.
 */
export default defineClass({
  id: 'class.elsarticle',
  name: "elsarticle",
  zerotex: "yes",
  preloads: [{"pkg": "graphicx"}, {"pkg": "natbib", "options": ["numbers"]}],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix"],
  options: { "5p": { columns: 2, description: "the final two-column format: \\ExecuteOptions{twocolumn} is a no-op inside elsarticle, which declares no twocolumn option, but the 5p geometry block ends with \\global\\@twocolumntrue: two 252pt columns of a 522pt text (elsarticle.dtx l.147-148, l.1400-1418; probe elsarticle-5p.A)" } },
  forbids: {
    technical: [{ pkg: "cite", reason: "elsarticle loads natbib unless nonatbib (elsarticle.cls v3.5 l.1240-1243, with numbers by default), whose \\NAT@set@cites at \\begin{document} installs a two-optional \\@citex (natbib.sty 8.31b l.375, l.645-674); cite.sty redefines \\cite to call \\@citex with one optional argument (cite.sty v5.5 l.302-307, 'Redefining \\cite on input line 302'), so every citation scans to the next ']' and on to the paragraph's end: 'Paragraph ended before \\@citex was complete' (runaway ']{key}...') or 'Argument of \\@citex has an extra }', inside a titlesec heading 'Nested titles' and 'Paragraph ended before \\ttl@savefn was complete', and at the end of the file 'File ended while scanning use of \\@citex'. As acmart (AC8): over the three elsarticle pairs 638 of the 665 fit, not-denied bib.cite-pkg branches failed (375 on \\@citex itself), and the 9 per pair that passed sat in documents where no citation ran", evidence: [{ kind: 'compile', cell: 'GitHub run 41584963423: elsarticle-5p.A dba78c3fe895d5093d829 (result e21f28a5938b, l.51), elsarticle-preprint.A dba78c3fe895d5093d829 (result 6e0cd72fcb91, l.72), elsarticle-preprint.B d06fd050924ff0446ac58 (result 9baaa78b161f, l.58)' }, { kind: 'compile', cell: 'GitHub run 41584963423: elsarticle-5p.A d4cc2485af067284ab754 (result 38f5ae318d0f: Nested titles, \\ttl@savefn at l.388, File ended while scanning use of \\@citex)' }, { kind: 'source', file: 'elsarticle.cls (2026/01/09 v3.5)', line: '1240-1243' }, { kind: 'source', file: 'natbib.sty (2010/09/13 8.31b)', line: '375, 645-674' }, { kind: 'source', file: 'cite.sty (2015/02/27 v5.5)', line: '302-307' }] }],
    policy: [],
  },
  layout: { columns: 1, textwidth: "345.0pt", fontsize: "10pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/elsarticle-preprint.A.json' }, { kind: 'requirement', file: 'Template/template-requirement/Elsarticle.md', line: '113' }, { kind: 'requirement', file: 'Template/template-requirement/Elsarticle.md', line: '237' }, { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0107-elsarticle/elsarticle.dtx', line: '147-148, 1400-1418' }, { kind: 'compile', cell: 'testing-pipeline/out/profiles/elsarticle-5p.A.json (twocolumn, 522pt text, 252pt columns)' }, { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0107-elsarticle/elsarticle.dtx', line: '143, 177, 1338-1341' }],
});
