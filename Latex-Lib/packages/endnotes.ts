import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "endnotes",
  description: "endnotes: notes collected at the end.",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [ctan("endnotes"), { kind: 'manual', of: "endnotes", section: "usage: \\endnote, \\theendnotes, \\enotesize, \\notesname", url: 'https://ctan.org/pkg/endnotes' }],
});
