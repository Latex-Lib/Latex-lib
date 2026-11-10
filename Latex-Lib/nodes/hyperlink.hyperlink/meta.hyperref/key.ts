import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'meta.hyperref',
    node: 'hyperlink/hyperlink',
    description:
      "hyperref: \\href{url}{text}, the text linked to the URL; the links' look by \\hypersetup, hyperref's boxes, colorlinks with linkcolor, citecolor and urlcolor (or allcolors), or hidelinks; or every key at hyperref's load, with pagebackref or backref and breaklinks, as the CVPR author kit's \\usepackage[pagebackref,breaklinks,colorlinks,allcolors=cvprblue]{hyperref} after its \\definecolor; or no load at all under a class that loads hyperref itself (MDPI), keeping the class's look. 557 templates.",
    writes: '\\href{…}{…}',
    ctan: ['hyperref'],
    features: ['linked', 'boxed-links', 'colored-links'],
    params: {
      look: { type: 'enum', values: ['boxed', 'colored', 'hidden', 'class'], default: 'boxed', description: "links framed by boxes (hyperref's own), coloured (colorlinks), invisible (hidelinks), or the class's own look (no key: a class that loads and sets up hyperref itself, as MDPI)" },
      linkColor: { type: 'color', default: '', description: "colored: internal links (linkcolor); ''" },
      citeColor: { type: 'color', default: '', description: "colored: citations (citecolor); ''" },
      urlColor: { type: 'color', default: '', description: "colored: web links (urlcolor); ''" },
      // b-unit-55 (CVPR author kit, MDPI): where the keys go, and what only hyperref's load takes.
      load: { type: 'boolean', default: true, compat: true, description: "print \\usepackage{hyperref}; false under a class that loads hyperref itself (MDPI loads it at \\begin{document}, so a \\usepackage line or a preamble \\hypersetup would come before it): the look's keys then go in \\AtBeginDocument{\\hypersetup{…}}" },
      keysIn: { type: 'enum', values: ['hypersetup', 'options'], default: 'hypersetup', description: "the look's keys in \\hypersetup{…} after the load, or all in \\usepackage[…]{hyperref} (the CVPR kit's form, bare colorlinks); with load false always \\hypersetup" },
      allColor: { type: 'color', default: '', description: "colored: every kind of link (allcolors), before linkcolor, citecolor and urlcolor, which override it; ''" },
      defineRgb: { type: 'string', default: '', description: "colored, with allColor: the colour's rgb triple, printed \\definecolor{allColor}{rgb}{…} (CVPR's cvprblue, 0.21,0.49,0.74); '' when allColor is a colour xcolor knows" },
      backref: { type: 'enum', values: ['none', 'backref', 'pagebackref'], default: 'none', compat: true, description: "each bibliography entry followed by the sections (backref) or pages (pagebackref) citing it; a load-time option, always in \\usepackage[…]{hyperref}, dropped with load false (hyperref ignores it after its load)" },
      breaklinks: { type: 'boolean', default: false, compat: true, description: 'links that may break across lines (breaklinks), a load-time option, always in \\usepackage[…]{hyperref}; dropped with load false' },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'hyperref', when: { load: true } },
      // The options its \usepackage[…]{hyperref} line gives, so a class that loads hyperref itself (acmart, aamas, vldb, aastex,
      // acl, apa7, asmeconf, asmejour, beamer, bmvc, cas-dc, cas-sc, copernicus, corl, elegantpaper, iopjournal, jmlr, jss, lipics,
      // mnras, oup-authoring-template, siamart, sn-jnl, tufte-handout, usenix) is unfit for them: the class's options never
      // include them, and LaTeX stops at "Option clash for package hyperref". Batch 4 round 1: the cvpr preset failed every
      // branch of every document it was filed in under those 31 pairs (25,633 branches, 2,849 cells; aamas.A
      // dcd7b2c2949a8e6203db2 cell c5cfa286aba1e5e3b3109 result aa2d67ce83: "already been loaded with options:
      // [bookmarksnumbered,unicode] ... attempt to load it with options [pagebackref,breaklinks,colorlinks,allcolors=cvprblue]"),
      // and passed under the classes that do not load hyperref (article.A 213 of 231 branches, the rest other causes).
      // The valued keys (allcolors=…, linkcolor=…) cannot be named here; colorlinks goes with every colored look in options.
      { pkg: 'hyperref', options: ['pagebackref'], when: { load: true, backref: 'pagebackref' } },
      { pkg: 'hyperref', options: ['backref'], when: { load: true, backref: 'backref' } },
      { pkg: 'hyperref', options: ['breaklinks'], when: { load: true, breaklinks: true } },
      { pkg: 'hyperref', options: ['colorlinks'], when: { load: true, keysIn: 'options', look: 'colored' } },
      { pkg: 'hyperref', options: ['hidelinks'], when: { load: true, keysIn: 'options', look: 'hidden' } },
      { pkg: 'xcolor', when: { look: 'colored' } },
      // hyperref's backref and pagebackref options load backref.sty (\RequirePackage{backref}: batch 4 round 1, aistats.A result
      // 8d37656db4e1, "(/texmf/tex/latex/hyperref/backref.sty" after "Backreferencing ON"). Listed, though no line prints it, so the
      // package facts see it: biblatex refuses backref (packages/backref.ts).
      { pkg: 'backref', when: { load: true, backref: ['backref', 'pagebackref'] } },
    ],
    // With load false the class must load hyperref (its preloads): MDPI's \hyperrefpackage (mdpi.cls l.442-522).
    requiresWhen: [{ when: { load: false }, requires: ['pkg:hyperref'] }],
    deny: [
      {
        // The class probe loaded hyperref alone, in its boxed look, and passed: only colorlinks fails (presets colored and black-internal).
        class: 'class.tikzposter',
        reason:
          "with colorlinks (look colored), hyperref's \\begin{document} code loads color (the branch that reports 'Link coloring ON'), and tikzposter has already opened its poster environment, a tikzpicture, in its own earlier \\AtBeginDocument, so the load happens inside a group and stops at \"LaTeX Error: Loading a class or package in a group\", as mathtools does under the class; the boxed and hidden looks set no colorlinks and pass",
        evidence: [
          { kind: 'compile', cell: 'class-examples: Latex Related Research/Latex-Template-Examples/_results/class.tikzposter.log (2026-11-06), meta.hyperref look=colored: "! LaTeX Error: Loading a class or package in a group." at l.70 \\begin{document}, after geometry\'s begin-document report and before hyperref\'s "Link coloring ON"' },
          { kind: 'source', file: 'Latex-Lib/nodes/hyperlink.hyperlink/meta.hyperref/handler.ts', line: '18 (colorlinks=true)' },
        ],
        unless: { look: ['boxed', 'hidden', 'class'] },
      },
    ],
    targetEngine: 'yes',
  }),
);
