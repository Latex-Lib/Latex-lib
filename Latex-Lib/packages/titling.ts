import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "titling",
  description: "titling: \\maketitle restyled (\\pretitle, \\posttitle).",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [ctan("titling"), { kind: 'manual', of: "titling", section: "2.1.1 Restyling the titling", url: 'https://ctan.org/pkg/titling' }],
});
