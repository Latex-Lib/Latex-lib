import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "tocloft",
  description: "tocloft: the contents lists restyled.",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: [],
  targetEngine: 'yes',
  evidence: [ctan("tocloft")],
});
