import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "biblatex",
  description: "biblatex: bibliographies and citations by style.",
  options: {"backend=bibtex": "biblatex option backend=bibtex", "backend=biber": "biblatex option backend=biber"},
  exclusive: [],
  conflicts: [
    {
      pkg: 'natbib',
      reason: "biblatex stops when natbib is loaded (\"Incompatible package 'natbib'\"), which elsarticle, revtex4-2 and acmart load themselves",
      evidence: [{ kind: 'compile', cell: 'cb6e9d2fa9595d88999b9' }],
    },
  ],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [ctan("biblatex")],
});
