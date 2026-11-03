import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "listings",
  description: "listings: highlighted source code in TeX.",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: [],
  zerotex: 'yes',
  evidence: [ctan("listings"), { kind: 'manual', of: "listings", section: "Package options and \\lstset keys (basicstyle, keywordstyle, numbers, frame, backgroundcolor, breaklines, columns, escapeinside)", url: 'https://ctan.org/pkg/listings' }],
});
