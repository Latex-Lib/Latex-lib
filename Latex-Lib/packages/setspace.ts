import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "setspace",
  description: "setspace: line spacing for the document or a part of it (\\setstretch, \\singlespacing, \\onehalfspacing, \\doublespacing and their environments); footnotes and floats stay single-spaced. A class that defines \\singlespace or \\doublespace itself refuses it (AASTeX, measured).",
  options: {"singlespacing": "single spacing (the default)", "onehalfspacing": "one-and-a-half spacing", "doublespacing": "double spacing", "nodisplayskipstretch": "display skips are not stretched with the lines"},
  exclusive: [["singlespacing", "onehalfspacing", "doublespacing"]],
  loadOrder: [],
  defines: ["env:singlespace", "env:onehalfspace", "env:doublespace", "env:spacing", "cmd:\\setstretch", "cmd:\\singlespacing", "cmd:\\onehalfspacing", "cmd:\\doublespacing"],
  targetEngine: 'yes',
  evidence: [ctan("setspace"), { kind: 'manual', of: "setspace", section: "the package's documentation (setspace.sty header)", url: 'https://ctan.org/pkg/setspace' }, { kind: 'compile', cell: 'testing-pipeline/out/profiles/article.A.json' }, { kind: 'compile', cell: 'testing-pipeline/out/profiles/aastex.A.json' }],
});
