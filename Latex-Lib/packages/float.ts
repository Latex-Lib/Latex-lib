import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "float",
  description: "float: the [H] placement (the float exactly here), \\newfloat for new float types, \\floatstyle{plain|plaintop|boxed|ruled} and \\restylefloat.",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: [],
  zerotex: 'yes',
  evidence: [ctan("float"), { kind: 'manual', of: "float", section: "Floating environments; [H]", url: 'https://ctan.org/pkg/float' }],
});
