import { definePackage } from '../schema/class.ts';

export default definePackage({
  id: "multicol",
  description: "multicol: the multicols environment, balanced columns.",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: [],
  zerotex: 'yes',
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/revtex4-2-aps.A.json' }],
});
