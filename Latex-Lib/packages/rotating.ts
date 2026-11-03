import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "rotating",
  description: "rotating: sideways figures and tables.",
  options: {"figuresright": "sideways floats turned so their tops face the right edge", "figuresleft": "turned the other way", "clockwise": "rotations clockwise", "counterclockwise": "rotations counterclockwise"},
  exclusive: [["figuresright", "figuresleft"], ["clockwise", "counterclockwise"]],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [ctan("rotating"), { kind: 'manual', of: "rotating", section: "package options; sidewaysfigure, sidewaystable", url: 'https://ctan.org/pkg/rotating' }],
});
