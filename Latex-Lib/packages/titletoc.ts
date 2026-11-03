import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "titletoc",
  description: "titletoc (titlesec bundle): contents entries formatted.",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [ctan("titletoc"), { kind: 'manual', of: "titletoc", section: "titlesec manual, 6 Contents: the titletoc package", url: 'https://ctan.org/pkg/titletoc' }],
});
