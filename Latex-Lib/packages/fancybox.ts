import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "fancybox",
  description: "fancybox: framed boxes beyond \\fbox, \\shadowbox, \\doublebox, \\ovalbox, \\Ovalbox (\\shadowsize, \\cornersize), and verbatim and display tools.",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [ctan("fancybox"), { kind: 'manual', of: "fancybox", section: "2 Boxes", url: 'https://ctan.org/pkg/fancybox' }],
});
