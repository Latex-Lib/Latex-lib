import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "svg",
  description: "svg: SVG files through Inkscape (shell escape).",
  options: {"inkscapelatex=false": "the drawing's own text, not set by LaTeX"},
  exclusive: [],
  loadOrder: [],
  defines: [],
  zerotex: 'no',
  evidence: [ctan("svg"), { kind: 'manual', of: "svg", section: "options and \\includesvg", url: 'https://ctan.org/pkg/svg' }],
});
