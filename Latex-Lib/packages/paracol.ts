import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "paracol",
  description: "paracol: parallel columns.",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: [],
  targetEngine: 'untested',
  evidence: [ctan("paracol")],
});
