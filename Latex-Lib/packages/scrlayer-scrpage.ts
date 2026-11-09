import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "scrlayer-scrpage",
  description: "scrlayer-scrpage: KOMA-Script page headers and footers (\\ihead, \\ohead, \\cfoot, the scrheadings style).",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: ["cmd:\\ihead", "cmd:\\ohead", "cmd:\\chead", "cmd:\\cfoot", "style:scrheadings"],
  targetEngine: 'yes',
  evidence: [ctan("koma-script")],
});
