import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "threeparttable",
  description: "threeparttable: tables with caption and notes at their own width.",
  options: {"flushleft": "table notes flush left, no hanging indent", "para": "table notes run into one paragraph", "online": "note marks on the line, not superscript", "normal": "superscript marks, hanging notes (the default)"},
  exclusive: [["online", "normal"]],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [ctan("threeparttable"), { kind: 'manual', of: "threeparttable", section: "package options; threeparttable and tablenotes", url: 'https://ctan.org/pkg/threeparttable' }],
});
