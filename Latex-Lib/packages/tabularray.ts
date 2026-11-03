import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "tabularray",
  description: "tabularray: key-value tables (tblr).",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [ctan("tabularray"), { kind: 'manual', of: "tabularray", section: "inner specifications (colspec, hlines, vlines, hline{…}, row{…}); \\SetCell", url: 'https://ctan.org/pkg/tabularray' }],
});
