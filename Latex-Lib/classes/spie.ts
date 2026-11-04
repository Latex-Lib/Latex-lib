import { defineClass } from '../schema/class.ts';

/**
 * spie (SPIE proceedings, spie.cls 2007/04/14 v3.25), read from the class source (MiKTeX snapshot 9766, package spie) for
 * batch 2 (b2p), not yet measured by a class probe. It builds on article (\LoadClassWithOptions{article}, l.74), so it keeps
 * article's counters and front matter, and adds:
 * - preloads: ifthen and cite with [superscript] (l.91-92). A way loading cite with any other option stops at "Option clash";
 *   natbib after cite only warns and turns on its own sort (natbib.sty 2010/09/13 l.275-277), so natbib stays allowed.
 * - theorem, lemma and definition (\newtheorem, l.332-334: one counter, theorem, within section) and a proof made with \def
 *   (l.328-329): a way that declares any of them again stops at "already defined", and amsthm's \newenvironment{proof} stops
 *   at "Command \proof already defined", as under llncs.
 * - abstract as \section*{ABSTRACT} (l.291-292), acknowledgments and acknowledgements (l.300-304), \keywords (l.295),
 *   \authorinfo (l.176), REFERENCES as an unnumbered \section* (\thebibliography, l.308-319).
 * Layout: one column, \textwidth 6.75in = 487.8225pt (l.103), 10pt (article's default; the setting passes no size).
 * Level-1 titles go through \uppercase in its \@sect (l.253): a \label key or other literal inside a \section title is
 * upper-cased too (a warning, no error). Its \maketitle sets footnote marks to \fnsymbol (l.185, 201, 205), which stops at
 * "Counter too large" at a tenth footnote; the spie setting's preamble line puts arabic marks back after \maketitle.
 */
export default defineClass({
  id: 'class.spie',
  name: "spie",
  base: 'class.article',
  zerotex: "untested",
  preloads: [{"pkg": "ifthen"}, {"pkg": "cite", "options": ["superscript"]}],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "counter:theorem", "env:abstract", "env:acknowledgments", "env:acknowledgements", "env:theorem", "env:lemma", "env:definition", "env:proof", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\keywords", "cmd:\\authorinfo"],
  options: {},
  forbids: {
    technical: [
      { pkg: "scrextend", reason: "spie.cls defines \\titlefont (def, l.153) and sectfont (def, l.237), and scrextend's KOMA kernel defines them again with \\newcommand (scrextend.sty: sectfont l.143, \\titlefont l.1528 in the probe log): 'Command \\titlefont already defined' (b2p probe: G2-spie-cite, G2-spie-natbib, G2-achemso-natbib)", evidence: [{ kind: 'source', file: "spie.cls (spie 2007/04/14 v3.25, MiKTeX snapshot 9766)", line: "153, 237" }] },
      { pkg: "amsthm", reason: "spie.cls defines \\proof and \\endproof with \\def (l.328-329), so amsthm's \\newenvironment{proof} stops at 'Command \\proof already defined', as llncs's load test showed for the same code", evidence: [{ kind: 'source', file: 'spie.cls (spie 2007/04/14 v3.25, MiKTeX snapshot 9766)', line: '328-329' }, { kind: 'compile', cell: 'testing-pipeline/out/profiles/llncs.A.json (amsthm: Command \\proof already defined)' }] },
      { pkg: "biblatex", reason: "spie.cls loads cite (l.92), and biblatex stops at \"Incompatible package 'cite'\" (biblatex.sty l.168-179)", evidence: [{ kind: 'source', file: 'spie.cls (spie 2007/04/14 v3.25, MiKTeX snapshot 9766)', line: '92' }, { kind: 'source', file: 'biblatex.sty (MiKTeX snapshot 9766)', line: '168-179' }] },
    ],
    policy: [],
  },
  layout: { columns: 1, textwidth: "487.8225pt", fontsize: "10pt" },
  vocabulary: {"\\authorinfo": "author information, printed as an unmarked footnote on the first page", "\\keywords": "keywords"},
  evidence: [
    { kind: 'source', file: 'spie.cls (spie 2007/04/14 v3.25, MiKTeX snapshot 9766)', line: '74 (\\LoadClassWithOptions{article}), 91-92 (ifthen, cite[superscript]), 102-105 (text block, \\pagestyle{empty})' },
    { kind: 'source', file: 'spie.cls (spie 2007/04/14 v3.25, MiKTeX snapshot 9766)', line: '291-334 (abstract, \\keywords, acknowledgments, \\thebibliography, proof, theorem, lemma, definition)' },
  ],
});
