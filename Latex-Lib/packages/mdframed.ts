import { definePackage } from '../schema/class.ts';

export default definePackage({
  id: "mdframed",
  description: "mdframed: framed environments that split across pages; \\newmdtheoremenv frames a theorem environment.",
  options: {"framemethod=default": "frames drawn with TeX rules", "framemethod=tikz": "frames drawn with TikZ (round corners, shadows)", "framemethod=pstricks": "frames drawn with PSTricks"},
  exclusive: [['framemethod=default', 'framemethod=tikz', 'framemethod=pstricks']],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [{ kind: 'manual', of: "mdframed", section: "3 Options; 6.5 Shadows", url: 'https://ctan.org/pkg/mdframed' }],
});
