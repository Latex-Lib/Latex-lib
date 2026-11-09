import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/** algorithmic (the algorithms bundle): the algorithmic environment, \STATE, \IF, \FOR (code.algorithmic). */
export default definePackage({
  id: "algorithmic",
  description: "algorithmic: pseudocode in the algorithmic environment (\\STATE, \\IF, \\FOR), algorithms bundle.",
  options: { "noend": "no end lines for blocks" },
  exclusive: [],
  loadOrder: [],
  defines: ["env:algorithmic"],
  targetEngine: 'yes',
  evidence: [ctan("algorithms")],
});
