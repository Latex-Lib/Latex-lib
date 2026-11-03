import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "url",
  description: "url: typeset URLs with breaks.",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [ctan("url"), { kind: 'manual', of: "url", section: "\\url, \\urlstyle (tt, rm, sf, same)", url: 'https://ctan.org/pkg/url' }],
});
