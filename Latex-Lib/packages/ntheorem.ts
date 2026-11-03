import { definePackage } from '../schema/class.ts';

export default definePackage({
  id: "ntheorem",
  description: "ntheorem: a theorem engine of its own, with head and body fonts, separators, layouts (plain, break, change, margin) and end marks.",
  options: {"standard": "predefined theorem environments", "noconfig": "no predefined styles", "amsmath": "end marks that work with amsmath displays", "thmmarks": "automatic end marks", "thref": "extended references", "hyperref": "hyperref support", "amsthm": "amsthm-compatible syntax"},
  exclusive: [],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [],
});
