import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "fancyvrb",
  description: "fancyvrb: extended verbatim (Verbatim, frames).",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [ctan("fancyvrb"), { kind: 'manual', of: "fancyvrb", section: "Verbatim's keys (frame, numbers, fontsize, xleftmargin, commandchars)", url: 'https://ctan.org/pkg/fancyvrb' }],
});
