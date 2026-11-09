import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "paralist",
  description: "paralist: compact and in-paragraph lists.",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: [],
  targetEngine: 'untested',
  evidence: [ctan("paralist")],
});
