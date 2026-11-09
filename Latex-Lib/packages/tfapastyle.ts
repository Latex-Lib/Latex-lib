import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * tfapastyle: Taylor & Francis's modified apacite (6.03) shipped with the interact kit, not on CTAN (bib.tfapastyle). Like
 * apacite, natbibapa gives natbib's \citep and \citet with the APA styles.
 */
export default definePackage({
  id: "tfapastyle",
  description: "tfapastyle: Taylor & Francis's APA citations and references (a modified apacite), shipped with the interact class.",
  options: { "natbibapa": "natbib's \\citep/\\citet with the APA styles" },
  exclusive: [],
  loadOrder: [],
  defines: [],
  targetEngine: 'untested',
  evidence: [ctan("apacite")],
});
