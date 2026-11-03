import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "cleveref",
  description: "cleveref: references named by their kind.",
  options: {"capitalise": "every cross-reference name capitalised", "capitalize": "the same, American spelling", "nameinlink": "the name part of the hyperlink", "noabbrev": "names never abbreviated", "poorman": "a script to replace \\cref by plain text", "sort": "references sorted", "compress": "references compressed"},
  exclusive: [],
  loadOrder: [{ after: 'hyperref', reason: 'cleveref must come after hyperref' }],
  defines: [],
  zerotex: 'untested',
  evidence: [ctan("cleveref"), { kind: 'manual', of: "cleveref", section: "7 Options that modify the cross-reference format (7.1 capitalise, 7.2 nameinlink, 7.3 noabbrev)", url: 'https://ctan.org/pkg/cleveref' }],
});
