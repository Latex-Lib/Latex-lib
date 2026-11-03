import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "booktabs",
  description: "booktabs: rules for formal tables.",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: [],
  zerotex: 'yes',
  evidence: [ctan("booktabs"), { kind: 'manual', of: "booktabs", section: "Rule widths; Use of the commands (\\toprule, \\midrule, \\bottomrule, \\addlinespace)", url: 'https://ctan.org/pkg/booktabs' }],
});
