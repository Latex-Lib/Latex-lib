import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "amsmath",
  description: "amsmath: display environments and maths commands.",
  options: {"fleqn": "displays flush left at \\mathindent", "leqno": "equation numbers at the left", "reqno": "equation numbers at the right (the default)", "tbtags": "split's number on its top or bottom row", "centertags": "split's number centred (the default)", "sumlimits": "limits above and below sums (the default)", "nosumlimits": "limits beside sums", "intlimits": "limits above and below integrals", "nointlimits": "limits beside integrals (the default)", "namelimits": "limits above and below \\lim-like operators (the default)", "nonamelimits": "limits beside them"},
  exclusive: [["leqno", "reqno"], ["tbtags", "centertags"], ["sumlimits", "nosumlimits"], ["intlimits", "nointlimits"], ["namelimits", "nonamelimits"]],
  loadOrder: [],
  defines: [],
  zerotex: 'yes',
  evidence: [ctan("amsmath"), { kind: 'manual', of: "amsmath", section: "amsldoc: options of the amsmath package", url: 'https://ctan.org/pkg/amsmath' }],
});
