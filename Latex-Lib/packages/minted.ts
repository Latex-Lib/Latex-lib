import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "minted",
  description: "minted: source code highlighted by Pygments (shell escape).",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: [],
  zerotex: 'no',
  evidence: [ctan("minted"), { kind: 'manual', of: "minted", section: "Options (\\setminted); Styles (\\usemintedstyle); shell escape and Pygments required", url: 'https://ctan.org/pkg/minted' }],
});
