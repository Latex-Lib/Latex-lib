import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/** algorithm (the algorithms bundle): the algorithm float, over float and ifthen (code.algorithmic, code.class-env). */
export default definePackage({
  id: "algorithm",
  description: "algorithm: the algorithm float and \\listofalgorithms (algorithms bundle).",
  options: { "plain": "the plain float style", "ruled": "the ruled float style", "boxed": "the boxed float style", "section": "numbered within sections", "chapter": "numbered within chapters" },
  exclusive: [["plain", "ruled", "boxed"]],
  loadOrder: [],
  defines: ["env:algorithm", "cmd:\\listofalgorithms"],
  targetEngine: 'yes',
  evidence: [ctan("algorithms")],
});
