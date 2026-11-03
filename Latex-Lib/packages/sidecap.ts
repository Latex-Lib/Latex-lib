import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "sidecap",
  description: "sidecap: captions beside floats.",
  options: {"outercaption": "captions at the outer edge (default)", "innercaption": "captions at the inner edge", "leftcaption": "captions always at the left", "rightcaption": "captions always at the right", "wide": "floats may run into the margin", "margincaption": "captions in the margin"},
  exclusive: [["outercaption", "innercaption", "leftcaption", "rightcaption"]],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [ctan("sidecap"), { kind: 'manual', of: "sidecap", section: "SCfigure and SCtable; package options", url: 'https://ctan.org/pkg/sidecap' }],
});
