import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "fncychap",
  description: "fncychap: ready-made chapter-opening styles.",
  options: {"Sonny": "fncychap option Sonny", "Lenny": "fncychap option Lenny", "Glenn": "fncychap option Glenn", "Conny": "fncychap option Conny", "Rejne": "fncychap option Rejne", "Bjarne": "fncychap option Bjarne", "Bjornstrup": "fncychap option Bjornstrup", "PetersLenny": "Lenny with its rules tuned per chapter number (manual, 1.1)"},
  // One style to a document: LaTeX refuses fncychap loaded again with another option ("Option clash for package fncychap").
  exclusive: [["Sonny", "Lenny", "Glenn", "Conny", "Rejne", "Bjarne", "Bjornstrup", "PetersLenny"]],
  loadOrder: [],
  defines: [],
  targetEngine: 'untested',
  evidence: [ctan("fncychap")],
});
