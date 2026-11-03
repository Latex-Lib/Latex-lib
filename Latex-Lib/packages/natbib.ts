import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "natbib",
  description: "natbib: author-year and numbered citations with BibTeX.",
  options: {"numbers": "numbered citations", "authoryear": "author-year citations (the default)", "super": "superscript numbers", "round": "round brackets (the default)", "square": "square brackets", "curly": "curly braces", "angle": "angle brackets", "sort": "several citations sorted as in the list", "sort&compress": "sorted, and number runs compressed to ranges", "compress": "number runs compressed", "comma": "citations separated by commas", "semicolon": "citations separated by semicolons (the default)", "longnamesfirst": "the first citation of a work with all its authors", "nonamebreak": "authors' names never broken across lines", "merge": "merged citations", "elide": "repeated authors elided"},
  exclusive: [["numbers", "authoryear", "super"], ["round", "square", "curly", "angle"], ["sort", "sort&compress"], ["comma", "semicolon"]],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [ctan("natbib"), { kind: 'manual', of: "natbib", section: "package options; \\citep, \\citet, \\citealp; \\bibsep, \\bibfont", url: 'https://ctan.org/pkg/natbib' }],
});
