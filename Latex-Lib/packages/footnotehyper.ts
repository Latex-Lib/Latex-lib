import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "footnotehyper",
  description: "footnotehyper: footnotes in tables and boxes, hyperref-safe.",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: [],
  zerotex: 'yes',
  evidence: [ctan("footnotehyper")],
});
