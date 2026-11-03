import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "mathtools",
  description: "mathtools: fixes and extensions to amsmath.",
  options: {"fleqn": "passed to amsmath", "leqno": "passed to amsmath", "reqno": "passed to amsmath", "fixamsmath": "amsmath's bugs fixed (the default)", "donotfixamsmathbugs": "amsmath left as it is"},
  exclusive: [["leqno", "reqno"]],
  loadOrder: [],
  defines: [],
  zerotex: 'yes',
  evidence: [ctan("mathtools"), { kind: 'manual', of: "mathtools", section: "mathtools: package loading and options; \\mathtoolsset", url: 'https://ctan.org/pkg/mathtools' }],
});
