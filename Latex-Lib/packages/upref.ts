import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "upref",
  description: "upref: \\ref and \\eqref numbers upright in slanted or italic text (AMS).",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: [],
  targetEngine: 'yes',
  evidence: [ctan("amsmath")],
});
