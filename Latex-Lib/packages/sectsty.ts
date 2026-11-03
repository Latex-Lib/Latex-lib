import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "sectsty",
  description: "sectsty: heading fonts by level (\\allsectionsfont, \\sectionfont).",
  options: {},
  exclusive: [],
  conflicts: [
    // Under re-test: the cell's document also held head.titlesec@cv-ruled, whose unbraced [\titlerule[.4pt]] gave this same error (since fixed in its handler).
    // Compile head.sectsty with a non-cv head.titlesec preset solo under article.A, then remove the conflict or re-evidence it.
    { pkg: 'titlesec', reason: 'both redefine the sectioning commands: after sectsty, titlesec\'s \\titleformat stops at "Missing \\begin{document}"', evidence: [{ kind: 'compile', cell: 'cf25f1886be4a995711ec' }] },
  ],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [ctan("sectsty")],
});
