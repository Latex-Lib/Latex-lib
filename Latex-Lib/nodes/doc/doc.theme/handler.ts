/**
 * doc.theme (doc). The look a slide, poster or CV class takes from its own theme commands, in the preamble: beamer's
 * \usetheme[…]{…}, \usecolortheme, \usefonttheme, \useinnertheme, \useoutertheme, \setbeamertemplate and \setbeamercolor,
 * \AtBeginSection, \logo and \titlegraphic (beamerbasethemes.sty l.23-24; ctexbeamer through its base); tikzposter's \usetheme,
 * \definecolorstyle, \usecolorstyle and its title, block, background and note styles; moderncv's \moderncvcolor and
 * \moderncvstyle (moderncv.cls l.426-447: each a \RequirePackage, so preamble only). One line per parameter set; the
 * parameters left at their defaults print nothing. The body gets nothing: every line is a preamble declaration.
 * CTAN: https://ctan.org/pkg/beamer, https://ctan.org/pkg/tikzposter, https://ctan.org/pkg/moderncv
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import key from './key.ts';

/** `\cmd[options]{value}`, the brackets only when options are given; nothing when value is empty. */
const use = (command: string, value: string, options = ''): string[] => (value.trim() === '' ? [] : [`\\${command}${options.trim() === '' ? '' : `[${options.trim()}]`}{${value.trim()}}`]);

/** Raw lines a template gives as they are (its own \setbeamercolor lines), each non-empty line kept. */
const raw = (text: string): string[] => text.split('\n').map((l) => l.trim()).filter((l) => l !== '');

// What \AtBeginSection prints at each \section: an outline frame with the current section highlighted (Source/0132-sjtug-sjtubeamer/
// main.tex l.136-145, and beamer's user guide 10.2), or beamer's own section page (\sectionpage, the commented alternative there).
// The frame is made where \section stands, so it is right only while the document's \section lines stand outside frames, as they
// do in Flouest's beamer documents (class.beamer: "sections print nothing on a slide").
const SECTION_OUTLINE: { readonly [form: string]: string } = {
  toc: '\\AtBeginSection[]{\\begin{frame}\\tableofcontents[currentsection]\\end{frame}}',
  sectionpage: '\\AtBeginSection[]{\\begin{frame}\\sectionpage\\end{frame}}',
};

const beamer = (p: { readonly [name: string]: unknown }): string[] => [
  ...use('usetheme', param(p, 'theme'), param(p, 'themeOptions')),
  ...use('usecolortheme', param(p, 'colorTheme')),
  ...use('usefonttheme', param(p, 'fontTheme'), param(p, 'fontThemeOptions')),
  ...use('useinnertheme', param(p, 'innerTheme')),
  ...use('useoutertheme', param(p, 'outerTheme'), param(p, 'outerThemeOptions')),
  // Source/0429-ndpvt-web-latex-document-skill/assets/templates/presentation.tex l.21-25.
  ...(p['navigationSymbols'] === false ? ['\\setbeamertemplate{navigation symbols}{}'] : []),
  ...(param(p, 'footline') === '' ? [] : [`\\setbeamertemplate{footline}[${param(p, 'footline')}]`]),
  ...raw(param(p, 'beamerSettings')),
  ...(SECTION_OUTLINE[param(p, 'sectionOutline', 'none')] === undefined ? [] : [SECTION_OUTLINE[param(p, 'sectionOutline', 'none')]!]),
  ...use('logo', param(p, 'logo')),
  ...use('titlegraphic', param(p, 'titleGraphic')),
];

// tikzposter (tikzposter.cls; Source/0436-jacobs-landscape-poster/main.tex l.14-15, Source/0707-tu-delft-poster/main.tex l.25-39,
// Source/0429-ndpvt-web-latex-document-skill/assets/templates/poster.tex l.86-101): the theme, then a colour style, defined first
// when the template gives its own (\definecolorstyle{name}{palette}{roles}), then the element styles.
const tikzposter = (p: { readonly [name: string]: unknown }): string[] => {
  const style = param(p, 'colorStyle').trim();
  const roles = param(p, 'colorStyleRoles').trim();
  const own = style !== '' && roles !== '';
  return [
    ...use('usetheme', param(p, 'theme')),
    ...(own ? [`\\definecolorstyle{${style}}{${param(p, 'colorStyleColors').trim()}}{${roles}}`] : []),
    ...use('usecolorstyle', style, own || param(p, 'colorPalette').trim() === '' ? '' : `colorPalette=${param(p, 'colorPalette').trim()}`),
    ...use('usetitlestyle', param(p, 'titleStyle')),
    ...use('useblockstyle', param(p, 'blockStyle')),
    ...use('usebackgroundstyle', param(p, 'backgroundStyle')),
    ...use('usenotestyle', param(p, 'noteStyle')),
    ...use('useinnerblockstyle', param(p, 'innerblockStyle')),
    ...(p['affectionProofOff'] === true ? ['\\tikzposterlatexaffectionproofoff'] : []),
    ...use('titlegraphic', param(p, 'titleGraphic')),
  ];
};

// moderncv (Source/0196-moderncv/template.tex l.11-21; moderncv.cls l.139, 426-447): the colour, then the style, as the class's
// own template orders them; both are packages loaded by name, so they must stand in the preamble. Until a style is loaded the class
// defines \section, \cvitem and \makecvtitle as empty commands (moderncv.cls l.551-588), so a moderncv template always sets one.
// The testing pipeline's moderncv setting prints \moderncvstyle{classic}\moderncvcolor{blue} itself; a different style here would
// load a second style package over it, so a template made with this way replaces that stand-in.
const moderncv = (p: { readonly [name: string]: unknown }): string[] => [
  ...use('moderncvcolor', param(p, 'cvColor')),
  ...use('moderncvstyle', param(p, 'cvStyle'), param(p, 'cvStyleOptions')),
  ...(p['pageNumbers'] === false ? ['\\nopagenumbers{}'] : []),
  ...(param(p, 'hintsColumnWidth').trim() === '' ? [] : [`\\setlength{\\hintscolumnwidth}{${param(p, 'hintsColumnWidth').trim()}}`]),
];

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const family = param(p, 'family', 'beamer');
  const lines = family === 'tikzposter' ? tikzposter(p) : family === 'moderncv' ? moderncv(p) : beamer(p);
  return {
    preamble: () => (lines.length === 0 ? {} : { declarations: lines }),
    emit: () => '',
  };
};

export default realize;
