import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "graphicx",
  description: "graphicx: \\includegraphics.",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: [],
  targetEngine: 'yes',
  evidence: [ctan("graphicx")],
});
