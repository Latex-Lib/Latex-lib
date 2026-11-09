import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/** caption: captions restyled, \captionof and \DeclareCaptionStyle (code.class-env's AAAI listing). */
export default definePackage({
  id: "caption",
  description: "caption: captions restyled, \\captionof and \\DeclareCaptionStyle.",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: ["cmd:\\captionof", "cmd:\\DeclareCaptionStyle", "cmd:\\captionsetup"],
  targetEngine: 'yes',
  evidence: [ctan("caption")],
});
