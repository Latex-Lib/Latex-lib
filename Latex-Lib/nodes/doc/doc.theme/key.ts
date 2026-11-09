import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'doc.theme',
    node: 'doc',
    description:
      "The theme a slide, poster or CV class is dressed in, from the class's own preamble commands: beamer's and ctexbeamer's \\usetheme[…]{…}, \\usecolortheme, \\usefonttheme, \\useinnertheme and \\useoutertheme, with \\setbeamertemplate and \\setbeamercolor lines, an outline frame at each section (\\AtBeginSection), \\logo and \\titlegraphic; tikzposter's \\usetheme, \\usecolorstyle[colorPalette=…] or its own \\definecolorstyle, and its title, block and background styles; moderncv's \\moderncvcolor and \\moderncvstyle[…]{…} with \\nopagenumbers. One line per parameter set.",
    writes:
      '\\usetheme[…]{…} \\usecolortheme{…} \\usefonttheme[…]{…} \\useinnertheme{…} \\useoutertheme[…]{…} \\setbeamertemplate{…}{…} \\setbeamercolor{…}{…} \\AtBeginSection[]{…} \\logo{…} \\titlegraphic{…} | \\usetheme{…} \\definecolorstyle{…}{…}{…} \\usecolorstyle[colorPalette=…]{…} \\usetitlestyle{…} \\useblockstyle{…} \\usebackgroundstyle{…} \\usenotestyle{…} \\useinnerblockstyle{…} \\tikzposterlatexaffectionproofoff \\titlegraphic{…} | \\moderncvcolor{…} \\moderncvstyle[…]{…} \\nopagenumbers{} \\setlength{\\hintscolumnwidth}{…}',
    ctan: ['beamer', 'tikzposter', 'moderncv'],
    features: ['class-styled'],
    params: {
      family: { type: 'enum', values: ['beamer', 'tikzposter', 'moderncv'], default: 'beamer', compat: true, description: "whose theme commands: beamer's (beamer, ctexbeamer), tikzposter's or moderncv's" },
      // beamer and tikzposter.
      theme: { type: 'string', default: '', description: "\\usetheme{…}: a beamer theme (Madrid, metropolis, sjtubeamer) or a tikzposter theme (Default, Wave, Rays); '' prints none" },
      themeOptions: { type: 'string', default: '', description: "beamer's \\usetheme[…] options (maxplus); '' prints no brackets" },
      titleGraphic: { type: 'tex', default: '', description: "\\titlegraphic{…} (beamer, tikzposter): a graphic on the title page, an \\includegraphics of a template asset; '' prints none" },
      // beamer.
      colorTheme: { type: 'string', default: '', description: "beamer's \\usecolortheme{…} (default, beaver, whale); '' prints none" },
      fontTheme: { type: 'string', default: '', description: "beamer's \\usefonttheme{…} (serif, structurebold, professionalfonts); '' prints none" },
      fontThemeOptions: { type: 'string', default: '', description: "beamer's \\usefonttheme[…] options (onlymath)" },
      innerTheme: { type: 'string', default: '', description: "beamer's \\useinnertheme{…} (circles, rectangles, rounded); '' prints none" },
      outerTheme: { type: 'string', default: '', description: "beamer's \\useoutertheme{…} (infolines, miniframes, sidebar); '' prints none" },
      outerThemeOptions: { type: 'string', default: '', description: "beamer's \\useoutertheme[…] options" },
      navigationSymbols: { type: 'boolean', default: true, description: "beamer's navigation symbols; false prints \\setbeamertemplate{navigation symbols}{}" },
      footline: { type: 'string', default: '', description: "\\setbeamertemplate{footline}[…] (frame number, page number); '' prints none" },
      beamerSettings: { type: 'tex', default: '', description: "the template's own \\setbeamertemplate{…}{…} and \\setbeamercolor{…}{…} lines, printed as they are, one per line" },
      sectionOutline: { type: 'enum', values: ['none', 'toc', 'sectionpage'], default: 'none', description: "a frame at each \\section through \\AtBeginSection[]: the outline with the current section highlighted (toc) or beamer's \\sectionpage" },
      logo: { type: 'tex', default: '', description: "beamer's \\logo{…}, on every frame, an \\includegraphics of a template asset; '' prints none" },
      // tikzposter.
      colorStyle: { type: 'string', default: '', description: "tikzposter's \\usecolorstyle{…} (Default, Britain, Australia), or the name of the template's own style; '' prints none" },
      colorPalette: { type: 'string', default: '', description: "tikzposter's \\usecolorstyle[colorPalette=…] (BlueGrayOrange); not given with the template's own style" },
      colorStyleColors: { type: 'tex', default: '', description: "the palette of the template's own colour style, \\definecolorstyle's second argument (\\colorlet{colorOne}{…} …)" },
      colorStyleRoles: { type: 'tex', default: '', description: "the roles of the template's own colour style, \\definecolorstyle's third argument (\\colorlet{titlebgcolor}{…} …); when given, \\definecolorstyle{<colorStyle>}{…}{…} is printed before \\usecolorstyle" },
      titleStyle: { type: 'string', default: '', description: "tikzposter's \\usetitlestyle{…}; '' prints none" },
      blockStyle: { type: 'string', default: '', description: "tikzposter's \\useblockstyle{…}; '' prints none" },
      backgroundStyle: { type: 'string', default: '', description: "tikzposter's \\usebackgroundstyle{…}; '' prints none" },
      noteStyle: { type: 'string', default: '', description: "tikzposter's \\usenotestyle{…}; '' prints none" },
      innerblockStyle: { type: 'string', default: '', description: "tikzposter's \\useinnerblockstyle{…}; '' prints none" },
      affectionProofOff: { type: 'boolean', default: false, description: "tikzposter's \\tikzposterlatexaffectionproofoff, which removes the class's credit line at the poster's foot" },
      // moderncv.
      cvStyle: { type: 'string', default: '', description: "moderncv's \\moderncvstyle{…}: casual, classic, banking, oldstyle, fancy or contemporary; '' prints none" },
      cvStyleOptions: { type: 'string', default: '', description: "moderncv's \\moderncvstyle[…] options (left, right, noqr, nodetails)" },
      cvColor: { type: 'string', default: '', description: "moderncv's \\moderncvcolor{…}: black, blue, burgundy, cerulean, green, grey, orange, purple or red; '' prints none" },
      pageNumbers: { type: 'boolean', default: true, description: "moderncv's page numbers; false prints \\nopagenumbers{}" },
      hintsColumnWidth: { type: 'dimen', default: '', description: "moderncv's \\setlength{\\hintscolumnwidth}{…}, the width of the dates column; '' prints none" },
    },
    presets: PRESETS,
    // beamerposter (Source/0417-gemini-poster-theme/main.tex l.6) is not printed here: it has no package facts in packages/, and
    // beamer's profile forbids changing the paper size, which beamerposter does through geometry.
    loads: [],
    requiresWhen: [
      { when: { family: 'beamer' }, requires: ['cmd:\\usetheme'] },
      { when: { family: 'tikzposter' }, requires: ['cmd:\\usetheme'] },
      { when: { family: 'moderncv' }, requires: ['cmd:\\moderncvstyle', 'cmd:\\moderncvcolor'] },
    ],
    only: ['class.beamer', 'class.ctexbeamer', 'class.tikzposter', 'class.moderncv'],
    onlyWhen: [
      {
        when: { family: 'beamer' },
        classes: ['class.beamer', 'class.ctexbeamer'],
        reason: "beamer's theme commands (\\usetheme[2][], \\usecolortheme, \\setbeamertemplate) are beamer's (beamerbasethemes.sty l.23-24); ctexbeamer loads beamer",
        evidence: [{ kind: 'source', file: 'beamerbasethemes.sty (beamer, MiKTeX snapshot 9766)', line: '23-24' }],
      },
      {
        when: { family: 'tikzposter' },
        classes: ['class.tikzposter'],
        reason: "\\usecolorstyle, \\definecolorstyle and the element styles are tikzposter's own; its \\usetheme takes one argument and no options",
        evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0429-ndpvt-web-latex-document-skill/assets/templates/poster.tex', line: '86-101' }],
      },
      {
        when: { family: 'moderncv' },
        classes: ['class.moderncv'],
        reason: '\\moderncvstyle and \\moderncvcolor load moderncv\'s own style and colour packages (moderncv.cls l.426-447)',
        evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0196-moderncv/moderncv.cls', line: '426-447' }],
      },
    ],
    // Typeset ok (ZeroTeX-NG, 2026-11-07), each preset under its class: beamer-madrid, beamer-outer-font and section-outline under
    // beamer, section-outline under ctexbeamer [fontset=fandol] (with \usetheme[secheader]{Boadilla} for the options' brackets),
    // \AtBeginSection's \sectionpage, \logo and \titlegraphic under beamer, tikzposter-theme and tikzposter-own-colors (with
    // \usetitlestyle, \useblockstyle, \usebackgroundstyle and \tikzposterlatexaffectionproofoff) under tikzposter, moderncv-classic,
    // moderncv-contemporary and casual with \nopagenumbers{} and \hintscolumnwidth under moderncv.
    targetEngine: 'yes',
  }),
);
