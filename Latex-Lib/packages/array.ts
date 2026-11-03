import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "array",
  description: "array: extended tabular and array preambles (>{}, <{}, m and b columns, \\newcolumntype).",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: [],
  zerotex: 'yes',
  evidence: [ctan("array")],
});
