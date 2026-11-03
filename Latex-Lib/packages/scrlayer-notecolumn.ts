import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "scrlayer-notecolumn",
  description: "KOMA-Script scrlayer-notecolumn: note columns beside the text.",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [ctan("scrlayer-notecolumn")],
});
