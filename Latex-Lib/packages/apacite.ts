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
  ],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [ctan("apacite"), { kind: 'manual', of: "apacite", section: "options natbibapa, nocitation; citation commands \\cite, \\citeA, \\citeNP", url: 'https://ctan.org/pkg/apacite' }],
});
