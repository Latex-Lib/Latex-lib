import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'head.copernicus',
    node: 'paragraph/heading',
    description:
      "copernicus.cls's named sections, as Copernicus Publications' journals (ACP, ESSD, GMD...) write them: a numbered section titled Introduction is \\introduction and one titled Conclusions \\conclusions (the title as the optional argument when it is another form, \\conclusions[Conclusion]), each the class's \\section underneath; every other heading the class's own sectioning command with its \\label.",
    writes: '\\introduction \\label{…} … \\conclusions \\label{…} … \\section[…]{…} \\label{…}',
    ctan: ['copernicus'],
    features: ['class-styled', 'numbered', 'bold-head', 'hang-head'],
    presets: PRESETS,
    // \introduction and \conclusions are copernicus.cls l.2802-2805 (Source/0195-copernicus); the class profile does not list them yet.
    requires: [
      'counter:{kind}',
      'cmd:\\introduction',
      'cmd:\\conclusions',
    ],
    only: ['class.copernicus'],
    // As head.class-native: below cols.vwcol a heading comes out at the full text width.
    needs: { paragraph: true },
    // Not typeset: copernicus.cls (the XeTeX-patched copy the profile cites) is not in testing-pipeline/settings/classes/files/,
    // and the unpatched class (the research's copy, as the distribution's) stops at \ifnum\pdfoutput under XeTeX (the profile's header).
    targetEngine: 'untested',
  }),
);
