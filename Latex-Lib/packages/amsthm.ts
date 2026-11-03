import { definePackage } from '../schema/class.ts';

export default definePackage({
  id: "amsthm",
  description: "amsthm: \\newtheorem with styles (\\theoremstyle, \\newtheoremstyle), the proof environment and \\qedsymbol.",
  options: {},
  exclusive: [],
  loadOrder: [{ before: 'thmtools', reason: 'thmtools builds on amsthm' }],
  defines: ["env:proof", "cmd:\\qedsymbol"],
  zerotex: 'yes',
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/llncs.A.json' }],
});
