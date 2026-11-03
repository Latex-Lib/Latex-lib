import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: 'geometry',
  description: 'geometry: page size and margins by keys (the page.geometry way, at document level).',
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [ctan('geometry')],
});
