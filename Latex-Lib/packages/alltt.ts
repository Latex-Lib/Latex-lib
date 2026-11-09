import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "alltt",
  description: "alltt: verbatim that still reads \\, { and }.",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: [],
  targetEngine: 'untested',
  evidence: [ctan("alltt")],
});
