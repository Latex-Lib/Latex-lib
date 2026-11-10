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
    {
      pkg: 'backref',
      reason: "biblatex stops when backref is loaded (\"Package biblatex Error: Incompatible package 'backref'\", biblatex.sty's \\blx@packageincompatibility), which hyperref's backref and pagebackref options load (meta.hyperref's cvpr preset); biblatex's own backref=true option is the replacement",
      evidence: [{ kind: 'compile', cell: "batch 4 round 1, aistats.A: document ddc4928be36002c366389 (meta.hyperref:cvpr beside General's biblatex bibliography), cell c3d828c63831d86121447, result 8d37656db4e16db08b40bca00ba4b1104ed06959d7b69a3a1fcf69f7f5eab5d5; the same document stops so in 35 pairs, 924 branches" }],
    },
  ],
  loadOrder: [],
  defines: [],
  targetEngine: 'untested',
  evidence: [ctan("biblatex")],
});
