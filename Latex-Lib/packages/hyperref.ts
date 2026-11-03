import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "hyperref",
  description: "hyperref: links and PDF metadata.",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: [],
  zerotex: 'yes',
  evidence: [ctan("hyperref")],
});
