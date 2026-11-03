import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "sidenotes",
  description: "sidenotes: numbered margin notes, Tufte style.",
  options: {"oneside": "notes always in the right margin"},
  exclusive: [],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [ctan("sidenotes"), { kind: 'manual', of: "sidenotes", section: "1 Usage; 4 Implementation (oneside)", url: 'https://ctan.org/pkg/sidenotes' }],
});
