import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "apacite",
  description: "apacite: APA citations and references.",
  options: {"natbibapa": "natbib's citation commands with apacite's styles", "nocitation": "citation commands not defined", "nobibliography": "the reference list's format not changed", "apaciteclassic": "the classic apacite commands"},
  exclusive: [],
  conflicts: [
    {
      pkg: 'hyperref',
      // host.claims takes General ways' loads, the hyperref General prints references and links with, and a citation's reference
      // list's packages as parties, so this reaches bib.apacite citations too: they are filed with documents that load no
      // hyperref. Neither load order helps: under batch 4, dfad84dff4c247fb83103 as the run emitted it, with hyperref moved
      // before apacite, still overflows the input stack at \begin{document} (staging result f174fe9f3f91), and natbibapa with
      // hyperref after stops at an undefined \citeA (83d0ead94f8e). parskip is in all 4 failing documents, but apacite with
      // parskip and no hyperref gets past \begin{document} 4 of 4, and the refiled probe document (dec75a349c537e6dae810, result
      // 4cc9792367) builds with no error, 24 of its 28 apacite branches passing. The conflict also takes bib.apacite off the
      // classes that preload hyperref (aastex, mdpi), where hyperref comes first, which the probe shows fails as well.
      reason:
        "with hyperref loaded, before or after it, \\begin{document} recurses in \\__tl_if_novalue_aux:w until 'TeX capacity exceeded, sorry [input stack size=10000]': 4 of 4 apacite documents with hyperref stop there, 0 of 14 without it (copy batch-3b article.A, 129 branches); the oracle-3 index shows the same 4 or 5 documents in every core pair; hyperref moved first stops the same way (batch-4 probe)",
      evidence: [
        { kind: 'compile', cell: "copy batch-3b article.A run: dfad84dff4c247fb83103 (result bf8fab2e33, l.62 \\begin{document}), de77453833ac3a7ba937a (232ef500ff)" },
        { kind: 'compile', cell: "batch-4 staging probe: dfad84dff4c247fb83103 with hyperref before apacite (result f174fe9f3f91, l.62 \\begin{document}); with [natbibapa]{apacite} (83d0ead94f8e, Undefined control sequence \\citeA)" },
      ],
    },
    {
      pkg: 'natbib',
      // b22 (owner item O-APA): a package fact instead of the class denies bib.apacite held for aa and elsarticle (batch 6, CL5), so it
      // holds under every class whose profile lists natbib among its preloads, which load before any way's apacite: aa, elsarticle and
      // revtex4-2 (whose own deny stays, for its \st@rtbibchapter), and aastex, acmart, mdpi, sn-jnl and tufte-handout, which load hyperref
      // too (not under tufte-handout's nobib, as its setting runs it: nobib unloads natbib, and hyperref alone keeps apacite out
      // there); and under any batch-2 class that will list natbib. [natbibapa]{apacite} loads natbib itself, after its own code, and names
      // no natbib load, so a branch is never refused against itself.
      reason:
        "apacite.sty v6.03 read after natbib.sty stops while it loads ('Undefined control sequence' \\st@rtbibchapter at line 1216 of apacite.sty, then 'Too many }'s'; or 'Too many }'s' at l.1882/1896): 18 of 18 apacite documents stop once natbib.sty is read in each elsarticle pair of the batch-3b run and 15 of 16 in acmart-manuscript.A, 0 of 18 in article.A and 0 of 17 in amsart.A, which load no natbib",
      evidence: [
        { kind: 'compile', cell: "elsarticle-preprint.A and elsarticle-5p.A runs: d1bfe3ac99a4575ba5d35 (result d0be2dd3397d, l.1216) and dfad84dff4c247fb83103 (result 002a8a4162e1, l.1882/1896); acmart-manuscript.A 15 of 16 at l.1216" },
        { kind: 'source', file: 'testing-pipeline/settings/classes/files/aa.cls', line: '140-146, 232 (natbib, bibauthoryear)' },
      ],
    },
  ],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [ctan("apacite"), { kind: 'manual', of: "apacite", section: "options natbibapa, nocitation; citation commands \\cite, \\citeA, \\citeNP", url: 'https://ctan.org/pkg/apacite' }],
});
