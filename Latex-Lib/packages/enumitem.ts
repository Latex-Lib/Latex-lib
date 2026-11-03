import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "enumitem",
  description: "enumitem: key-value control of the kernel lists.",
  options: {},
  exclusive: [],
  conflicts: [
    { pkg: 'enumerate', reason: 'both redefine the kernel lists: with enumerate loaded, enumitem\'s list end stops at an undefined \\enit@after, and the floats after it are lost', evidence: [{ kind: 'compile', cell: 'c6815b2d3c0e237f3e57e' }] },
    { pkg: 'paralist', reason: 'both redefine the kernel lists: with paralist loaded, enumitem\'s list end stops at an undefined \\enit@after, and the floats after it are lost', evidence: [{ kind: 'compile', cell: 'c6815b2d3c0e237f3e57e' }] },
  ],
  loadOrder: [],
  defines: [],
  zerotex: 'yes',
  evidence: [ctan("enumitem")],
});
