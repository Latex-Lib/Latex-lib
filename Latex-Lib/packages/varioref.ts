import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "varioref",
  description: "varioref (tools): references with their page.",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: [],
  targetEngine: 'untested',
  evidence: [ctan("varioref")],
});
