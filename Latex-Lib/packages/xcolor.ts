import { definePackage } from '../schema/class.ts';

export default definePackage({
  id: "xcolor",
  description: "xcolor: named and mixed colours.",
  options: {"dvipsnames": "the 68 dvips names", "svgnames": "SVG names", "x11names": "X11 names", "table": "colortbl for table colours", "hyperref": "hyperref colours"},
  exclusive: [],
  loadOrder: [],
  defines: [],
  zerotex: 'yes',
  evidence: [],
});
