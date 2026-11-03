import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "appendix",
  description: "appendix: appendix titles and environments.",
  options: {"toc": "an \"Appendices\" header in the contents (\\addappheadtotoc)", "page": "an \"Appendices\" title where the appendices begin (\\appendixpage)", "title": "\"Appendix\" before each appendix title", "titletoc": "\"Appendix\" before each appendix in the contents", "header": "\"Appendix\" in page headers"},
  exclusive: [],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [ctan("appendix"), { kind: 'manual', of: "appendix", section: "2 The appendix package", url: 'https://ctan.org/pkg/appendix' }],
});
