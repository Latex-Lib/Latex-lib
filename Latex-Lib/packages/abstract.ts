import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "abstract",
  description: "abstract: the abstract environment restyled.",
  options: {"original": "the class's own abstract look", "addtotoc": "the abstract entered in the contents", "number": "the abstract heading numbered", "style": "the abstract styled as a section heading", "runin": "the heading run into the text"},
  exclusive: [],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [ctan("abstract"), { kind: 'manual', of: "abstract", section: "options and \\abstractnamefont, \\abstracttextfont, \\absleftindent, \\absrightindent", url: 'https://ctan.org/pkg/abstract' }],
});
