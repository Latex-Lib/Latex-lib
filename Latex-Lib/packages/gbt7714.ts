import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/** gbt7714: GB/T 7714 citations and references, numbered or author-year, over natbib (bib.gbt7714, the ctex classes). */
export default definePackage({
  id: "gbt7714",
  description: "gbt7714: the Chinese national standard GB/T 7714 for citations and reference lists, over natbib.",
  options: { "super": "superscript numbered citations (legacy option)", "numbers": "numbered citations (legacy option)", "authoryear": "author-year citations (legacy option)" },
  exclusive: [["super", "numbers", "authoryear"]],
  loadOrder: [],
  defines: ["cmd:\\citestyle", "cmd:\\bibliographystyle"],
  targetEngine: 'untested',
  evidence: [ctan("gbt7714")],
});
