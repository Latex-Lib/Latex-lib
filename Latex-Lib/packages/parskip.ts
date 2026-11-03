import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: 'parskip',
  description: 'parskip: paragraphs separated by vertical space instead of indentation; options skip= and indent=.',
  options: { 'skip=10pt plus1pt': 'the space between paragraphs', 'indent=40pt': 'the first-line indent kept' },
  exclusive: [],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [ctan('parskip')],
});
