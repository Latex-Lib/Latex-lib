import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * KOMA-Script's letter class: letter environments with \opening and \closing, fields set with \setkomavar; as the kernel letter, no sectioning, abstract, floats, title or bibliography.
 * Read from the research's Solution files and CTAN; measured by the class probe (scrlttr2.A: loads, preloads, names it already defines, refused packages, layout).
 * What it lacks is the kernel letter's; its source was not read line by line.
 */
export default defineClass({
  id: 'class.scrlttr2',
  name: "scrlttr2",
  zerotex: "yes",
  preloads: [],
  defines: [],
  options: {},
  forbids: {
    technical: [],
    policy: [],
  },
  layout: { columns: 1, textwidth: "448.13095pt", fontsize: "12pt" },
  vocabulary: {"\\setkomavar": "a letter field (fromname, subject, signature\u2026)", "\\opening": "the salutation", "\\closing": "the closing line"},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/scrlttr2.A.json' }, { kind: 'solution', file: 'Solution/0402-german-service-invoice.md', lines: 'class' }, { kind: 'solution', file: 'Solution/0688-alexeyabel-latex-briefvorlage-din-5008.md', lines: 'class' }, ctan('koma-script')],
});
