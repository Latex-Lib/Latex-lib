import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "amsgen",
  description: "amsgen: the AMS packages' shared low-level macros (\\@xp, \\sw@slant), loaded by upref.",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: [],
  targetEngine: 'yes',
  evidence: [ctan("amsmath")],
});
