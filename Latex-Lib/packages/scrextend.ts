import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "scrextend",
  description: "KOMA-Script scrextend: KOMA features (labeling, addmargin) for other classes.",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [ctan("scrextend")],
});
