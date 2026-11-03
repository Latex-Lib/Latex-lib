import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "awesomebox",
  description: "awesomebox: admonition blocks with FontAwesome 5 icons, \\notebox … \\importantbox, noteblock … importantblock, \\awesomebox and awesomeblock; requires fontawesome5, array, ifthen, xcolor, xparse.",
  options: {},
  exclusive: [],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [ctan("awesomebox"), { kind: 'manual', of: "awesomebox", section: "3 Usage; 5 How to create your own box", url: 'https://ctan.org/pkg/awesomebox' }],
});
