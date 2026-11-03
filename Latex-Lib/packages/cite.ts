import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "cite",
  description: "cite: sorted, compressed numbered citations.",
  options: {"nosort": "citations kept in their written order", "sort": "citations sorted (the default)", "nocompress": "number runs not compressed", "compress": "runs compressed to ranges (the default)", "super": "superscript numbers", "space": "a space after each comma", "nospace": "no spaces in the list", "nobreak": "no line break inside the list", "noadjust": "no space adjusted before the citation"},
  exclusive: [["nosort", "sort"], ["nocompress", "compress"], ["space", "nospace"]],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [ctan("cite"), { kind: 'manual', of: "cite", section: "package options (sort, compress, super, space, nobreak)", url: 'https://ctan.org/pkg/cite' }],
});
