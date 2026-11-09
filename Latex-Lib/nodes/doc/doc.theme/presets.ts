/**
 * doc.theme's presets, each from the templates that use it.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  // Source/0429-ndpvt-web-latex-document-skill/assets/templates/presentation.tex l.11-25.
  'beamer-madrid': {
    description: "A beamer theme with its colour theme, no navigation symbols and the frame number in the footline: \\usetheme{Madrid} \\usecolortheme{default}, as most slide templates open.",
    writes: '\\usetheme{…} \\usecolortheme{…} \\setbeamertemplate{navigation symbols}{} \\setbeamertemplate{footline}[…]',
    features: ['class-styled', 'colored'],
    params: { family: 'beamer', theme: 'Madrid', colorTheme: 'default', navigationSymbols: false, footline: 'frame number' },
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0429-ndpvt-web-latex-document-skill/assets/templates/presentation.tex', line: '11-25' },
      { kind: 'source', file: 'beamerbasethemes.sty (beamer, MiKTeX snapshot 9766)', line: '23-24 (\\usetheme[2][], \\usecolortheme)' },
    ],
  },
  // Source/0324-sabirdvd-latex-template-for-upc-thesis/Beamer/main.tex l.12, 73; Source/0088-tinoryj-uestc-thesis-latex-template/slides/masterThesisSlides.tex l.2.
  'beamer-outer-font': {
    description: 'A beamer theme with an outer theme for the head and foot lines and a font theme for the maths: \\usetheme{Madrid} \\useoutertheme{infolines} \\usefonttheme[onlymath]{serif}.',
    writes: '\\usetheme{…} \\usefonttheme[…]{…} \\useoutertheme{…}',
    features: ['class-styled'],
    params: { family: 'beamer', theme: 'Madrid', fontTheme: 'serif', fontThemeOptions: 'onlymath', outerTheme: 'infolines' },
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0324-sabirdvd-latex-template-for-upc-thesis/Beamer/main.tex', line: '12, 73' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0088-tinoryj-uestc-thesis-latex-template/slides/masterThesisSlides.tex', line: '2' },
    ],
  },
  // Source/0132-sjtug-sjtubeamer/main.tex l.136-145 (\AtBeginSection outline frame; its theme, sjtubeamer, is zip-local to the
  // template and not on the mirror, so the preset sets no theme: themes are the template's theme parameter).
  'section-outline': {
    description: "An outline frame at each section of a beamer or ctexbeamer talk, the current section highlighted: \\AtBeginSection[]{\\begin{frame}\\tableofcontents[currentsection]\\end{frame}}.",
    writes: '\\AtBeginSection[]{\\begin{frame}\\tableofcontents[currentsection]\\end{frame}}',
    features: ['class-styled', 'local-contents'],
    params: { family: 'beamer', sectionOutline: 'toc' },
    evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0132-sjtug-sjtubeamer/main.tex', line: '136-145' }],
  },
  // Source/0436-jacobs-landscape-poster/main.tex l.14-15.
  'tikzposter-theme': {
    description: 'A tikzposter theme and colour style with its palette: \\usetheme{Wave} \\usecolorstyle[colorPalette=BlueGrayOrange]{Britain}.',
    writes: '\\usetheme{…} \\usecolorstyle[colorPalette=…]{…}',
    features: ['class-styled', 'colored'],
    params: { family: 'tikzposter', theme: 'Wave', colorStyle: 'Britain', colorPalette: 'BlueGrayOrange' },
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0436-jacobs-landscape-poster/main.tex', line: '14-15' },
      solution('0436-jacobs-landscape-poster', '25'),
    ],
  },
  // Source/0707-tu-delft-poster/main.tex l.20-39: the template's own colour style, its palette and roles.
  'tikzposter-own-colors': {
    description: "tikzposter with the template's own colour style: \\definecolorstyle{name}{palette}{roles} then \\usecolorstyle{name}, as TU Delft's corporate poster sets its blues.",
    writes: '\\definecolorstyle{…}{…}{…} \\usecolorstyle{…}',
    features: ['class-styled', 'colored'],
    params: {
      family: 'tikzposter',
      colorStyle: 'tudelft',
      colorStyleColors:
        '\\definecolor{tudelftblue}{RGB}{0,166,214}\\definecolor{tudelftdarkblue}{RGB}{0,31,77}\\colorlet{colorOne}{tudelftdarkblue}\\colorlet{colorTwo}{tudelftblue}\\colorlet{colorThree}{white}',
      colorStyleRoles:
        '\\colorlet{backgroundcolor}{white}\\colorlet{framecolor}{tudelftdarkblue}\\colorlet{titlefgcolor}{white}\\colorlet{titlebgcolor}{tudelftdarkblue}\\colorlet{blocktitlebgcolor}{tudelftblue}\\colorlet{blocktitlefgcolor}{white}\\colorlet{blockbodybgcolor}{white}\\colorlet{blockbodyfgcolor}{black}',
    },
    evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0707-tu-delft-poster/main.tex', line: '20-39' }],
  },
  // Source/0410-moderncv-cv-and-cover-letter/main.tex l.18-19 and the testing pipeline's moderncv setting.
  'moderncv-classic': {
    description: "moderncv's classic style in blue: \\moderncvcolor{blue} \\moderncvstyle{classic}, the name and details in the header's right column.",
    writes: '\\moderncvcolor{…} \\moderncvstyle{…}',
    features: ['class-styled', 'colored'],
    params: { family: 'moderncv', cvStyle: 'classic', cvColor: 'blue' },
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0410-moderncv-cv-and-cover-letter/main.tex', line: '18-19' },
      { kind: 'source', file: 'testing-pipeline/settings/classes/moderncv.json', line: 'preamble (\\moderncvstyle{classic}, \\moderncvcolor{blue})' },
    ],
  },
  // Source/0196-moderncv/template.tex l.11-13 (the class's own template).
  'moderncv-contemporary': {
    description: "moderncv's contemporary style in cerulean, the class's own template: \\moderncvcolor{cerulean} \\moderncvstyle{contemporary}, a two-tone header band.",
    writes: '\\moderncvcolor{…} \\moderncvstyle{…}',
    features: ['class-styled', 'colored'],
    params: { family: 'moderncv', cvStyle: 'contemporary', cvColor: 'cerulean' },
    evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0196-moderncv/template.tex', line: '11-13' }],
  },
} as const satisfies { readonly [name: string]: Preset };
