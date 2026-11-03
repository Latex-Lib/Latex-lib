import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'meta.hyperref',
    node: 'hyperlink/hyperlink',
    description:
      "hyperref: \\href{url}{text}, the text linked to the URL; the links' look by \\hypersetup, hyperref's boxes, colorlinks with linkcolor, citecolor and urlcolor, or hidelinks. 557 templates.",
    ctan: ['hyperref'],
    features: ['linked', 'boxed-links', 'colored-links'],
    params: {
      look: { type: 'enum', values: ['boxed', 'colored', 'hidden'], default: 'boxed', description: "links framed by boxes (hyperref's own), coloured (colorlinks), or invisible (hidelinks)" },
      linkColor: { type: 'color', default: '', description: "colored: internal links (linkcolor); ''" },
      citeColor: { type: 'color', default: '', description: "colored: citations (citecolor); ''" },
      urlColor: { type: 'color', default: '', description: "colored: web links (urlcolor); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'hyperref' },
      { pkg: 'xcolor', when: { look: 'colored' } },
    ],
    zerotex: 'yes',
  }),
);
