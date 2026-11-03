import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "nicematrix",
  description: "nicematrix: tables and matrices with blocks and rules (PGF).",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [ctan("nicematrix"), { kind: 'manual', of: "nicematrix", section: "4 NiceTabular; 5.3 hvlines; 6.2 \\CodeBefore; 8.3 X columns; \\Block", url: 'https://ctan.org/pkg/nicematrix' }],
});
