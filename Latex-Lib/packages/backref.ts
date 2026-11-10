import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/** Loaded by hyperref's backref and pagebackref options, never by a \usepackage line of a way (meta.hyperref's loads). */
export default definePackage({
  id: "backref",
  description: "backref: back references from each bibliography entry to the pages or sections citing it (hyperref's backref and pagebackref options load it).",
  options: {},
  exclusive: [],
  conflicts: [
    {
      pkg: 'biblatex',
      reason: "biblatex refuses backref at its load (\"Package biblatex Error: Incompatible package 'backref'\"); biblatex's own backref=true option is the replacement",
      evidence: [{ kind: 'compile', cell: "batch 4 round 1, aistats.A: document ddc4928be36002c366389, cell c3d828c63831d86121447, result 8d37656db4e16db08b40bca00ba4b1104ed06959d7b69a3a1fcf69f7f5eab5d5 (hyperref [pagebackref] loads backref.sty, then biblatex stops at l.213 \\blx@packageincompatibility)" }],
    },
  ],
  loadOrder: [],
  defines: [],
  targetEngine: 'yes',
  evidence: [ctan("backref")],
});
