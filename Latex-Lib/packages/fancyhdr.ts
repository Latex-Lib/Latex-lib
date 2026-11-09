import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "fancyhdr",
  description: "fancyhdr: page headers and footers (\\fancyhead, \\fancyfoot, the fancy page style).",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: ["cmd:\\fancyhead", "cmd:\\fancyfoot", "cmd:\\fancyhf", "style:fancy"],
  targetEngine: 'yes',
  evidence: [ctan("fancyhdr")],
});
