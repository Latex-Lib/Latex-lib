import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const LINENO = ['left', 'right', 'switch', 'switch*'] as const;
const SPACING = ['singlespacing', 'onehalfspacing', 'doublespacing'] as const;

export default defineKey(
  minimal({
    id: 'doc.generic-packages',
    node: 'doc',
    description:
      "Generic preamble packages a template switches on under any class: geometry with the template's page keys (\\usepackage[letterpaper,text={6.5in,8in},centering]{geometry}), " +
      'lineno with \\linenumbers (\\usepackage[switch]{lineno}, as IJCAI and Frontiers submissions ask), setspace at one-and-a-half or double spacing (\\usepackage[onehalfspacing]{setspace}, Frontiers, PLOS), ' +
      "and the template's own entries in the PDF's document information (hyperref's pdfinfo, IJCAI's TemplateVersion). Each prints only when its parameter is set.",
    // Each part prints only when its parameter is set; the order is the handler's.
    writes: '\\usepackage[…]{geometry} \\usepackage[switch]{lineno} \\linenumbers \\usepackage[onehalfspacing]{setspace} \\AtBeginDocument{\\ifdefined\\hypersetup\\hypersetup{pdfinfo={…}}\\fi}',
    ctan: ['geometry', 'lineno', 'setspace', 'hyperref'],
    features: [],
    params: {
      geometry: { type: 'boolean', default: false, description: 'load geometry with the keys in geometryOptions' },
      geometryOptions: { type: 'tex', default: '', description: "geometry's keys, as the template gives them (letterpaper,text={6.5in,8in},centering); empty loads it with none" },
      lineno: { type: 'enum', values: ['none', 'plain', ...LINENO], default: 'none', description: "load lineno: none, with no option (plain), or with its margin option (left, right, switch, switch*)" },
      linenumbers: { type: 'boolean', default: true, description: "with lineno loaded, turn numbering on with \\linenumbers in the preamble (a camera-ready copy keeps the package and drops this)" },
      setspace: { type: 'enum', values: ['none', 'plain', ...SPACING], default: 'none', description: 'load setspace: none, with no option (plain), or at single, one-and-a-half or double spacing' },
      pdfinfo: { type: 'tex', default: '', description: "hyperref's pdfinfo entries (TemplateVersion={IJCAI.2026.0}), set at \\begin{document} when hyperref is loaded; empty prints nothing" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'geometry', when: { geometry: true } },
      { pkg: 'lineno', when: { lineno: 'plain' } },
      ...LINENO.map((o) => ({ pkg: 'lineno', options: [o], when: { lineno: o } })),
      { pkg: 'setspace', when: { setspace: 'plain' } },
      ...SPACING.map((o) => ({ pkg: 'setspace', options: [o], when: { setspace: o } })),
    ],
    // No claim of 'page-geometry': a claim holds for every preset, and most leave the page alone; the minimal preset is the one that sets it.
    // Typeset ok (ZeroTeX-NG, 2026-11-07): minimal under class.minimal (text block 469.75pt on letter paper); ijcai, frontiers and
    // double-spacing under article with hyperref (TemplateVersion reached the PDF's Info dictionary; \baselinestretch 1.25 and
    // 1.667), and ijcai without hyperref (the pdfinfo line prints nothing).
    targetEngine: 'yes',
  }),
);
