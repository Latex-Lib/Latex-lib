import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "hyperref",
  description: "hyperref: links and PDF metadata.",
  // The options a way gives at hyperref's load (meta.hyperref's keysIn: options, backref, breaklinks), listed so its loads can
  // name them and the resolver and the matrix's filing see LaTeX's option clash with a class that loads hyperref itself.
  // allcolors=, linkcolor=, citecolor= and urlcolor= take a value and are not listed: a load can only name a literal option.
  options: {"pagebackref": "each bibliography entry followed by the pages citing it (backref); a load-time option", "backref": "each bibliography entry followed by the sections citing it; a load-time option", "breaklinks": "links that may break across lines; a load-time option", "colorlinks": "links in colour instead of boxes", "hidelinks": "links that show neither boxes nor colour"},
  exclusive: [],
  loadOrder: [],
  defines: [],
  targetEngine: 'yes',
  evidence: [ctan("hyperref")],
});
