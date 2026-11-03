import { definePackage } from '../schema/class.ts';

export default definePackage({
  id: 'titlesec',
  description: "titlesec: redefines the sectioning commands' format (\\titleformat) and spacing (\\titlespacing); a quick interface by options. Not compatible with memoir or KOMA, which provide their own tools (manual, section 1).",
  options: {
    rm: 'quick setup: roman family', sf: 'quick setup: sans-serif family', tt: 'quick setup: typewriter family',
    md: 'quick setup: medium series', bf: 'quick setup: bold series (the default)',
    up: 'quick setup: upright shape', it: 'quick setup: italic shape', sl: 'quick setup: slanted shape', sc: 'quick setup: small capitals',
    big: 'quick setup: the standard classes\' sizes (default)', medium: 'quick setup: smaller sizes', small: 'quick setup: smaller still', tiny: 'quick setup: sections at the text size',
    raggedleft: 'quick setup: flush right', center: 'quick setup: centred', raggedright: 'quick setup: flush left',
    compact: 'less space above and below titles', uppercase: 'titles upper-cased',
    explicit: 'the title given explicitly as #1 in before-code', pagestyles: 'loads titleps for page styles',
    indentafter: 'the paragraph after every title indented', noindentafter: 'never indented',
    rigidchapters: 'chapter titles take a fixed space', rubberchapters: 'chapter after-sep as usual (default)',
    bottomtitles: 'titles may sit at the page bottom (default)', nobottomtitles: 'titles near the bottom move to the next page', 'nobottomtitles*': 'the same, computed more accurately',
    aftersep: 'between consecutive titles the after-sep (default)', largestsep: 'between consecutive titles the larger space',
    pageatnewline: '\\\\ in titles may break the page', nostruts: 'no struts in titles', calcwidth: 'measures titles into \\titlewidth',
    newparttoc: 'standard part contents entries', oldparttoc: 'the classes\' part entries', clearempty: 'empty pages from \\cleardoublepage in the empty style',
    toctitles: 'the optional argument sets running heads only', newlinetospace: '\\\\ becomes a space in heads and contents', 'notocpart*': '\\part* writes no contents entry',
  },
  exclusive: [
    ['big', 'medium', 'small', 'tiny'],
    ['raggedleft', 'center', 'raggedright'],
    ['indentafter', 'noindentafter'],
    ['rigidchapters', 'rubberchapters'],
    ['bottomtitles', 'nobottomtitles', 'nobottomtitles*'],
    ['aftersep', 'largestsep'],
    ['newparttoc', 'oldparttoc'],
  ],
  loadOrder: [],
  defines: [],
  zerotex: 'yes',
  evidence: [
    { kind: 'compile', cell: 'testing-pipeline/out/profiles/acmart-manuscript.A.json' },
    { kind: 'manual', of: 'titlesec', section: '2. Quick Reference; 3. Advanced Interface', url: 'https://ctan.org/pkg/titlesec' },
  ],
});
