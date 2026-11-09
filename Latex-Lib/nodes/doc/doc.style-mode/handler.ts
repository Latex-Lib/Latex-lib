/**
 * doc.style-mode (doc). A conference style's mode. The style itself is loaded by the class setting (its \usepackage line after
 * the class line: cvpr, icml2026, neurips_2026, aaai2027, acl, eccv), so a second \usepackage with the mode's option would
 * stop at "Option clash"; the options are passed to it instead with \PassOptionsToPackage before the class line
 * (`beforeDocument`), where they join whatever the setting's load gives. That serves when the setting loads the style with no
 * mode option of its own, as each kit's default line does (cvpr's camera-ready \usepackage{cvpr}, aaai's \usepackage{aaai2027},
 * eccv's \usepackage{eccv}), and where the mode's option is declared after the setting's (acl's review and preprint after its
 * default final, acl.sty l.18-21, processed in declaration order). Where the setting's own option is declared later it wins:
 * icml2026's preprint over accepted (l.129-138), so an ICML setting that loads [preprint] keeps the preprint whatever this way
 * passes; the setting must then load the style bare. A style with a mode declaration (ICLR, BMVC, spconf) takes it in the
 * preamble; ICLR's setting already writes \iclrfinalcopy, which no line can undo, so its review mode prints nothing.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import key from './key.ts';

/** Each venue's style file and the option each mode passes to it ('' passes none). */
const OPTIONS: { readonly [venue: string]: { readonly pkg: string; readonly modes: { readonly [mode: string]: string } } } = {
  cvpr: { pkg: 'cvpr', modes: { review: 'review', rebuttal: 'rebuttal', preprint: 'pagenumbers' } },
  icml: { pkg: 'icml2026', modes: { final: 'accepted', preprint: 'preprint' } },
  neurips: { pkg: 'neurips_2026', modes: { final: 'final', preprint: 'preprint' } },
  aaai: { pkg: 'aaai2027', modes: { review: 'submission', preprint: 'preprint' } },
  acl: { pkg: 'acl', modes: { review: 'review', final: 'final', preprint: 'preprint' } },
  eccv: { pkg: 'eccv', modes: { review: 'review' } },
};

const set = (command: string, value: string): string[] => (value === '' ? [] : [`${command}{${value}}`]);

/** The lines before the class line and in the preamble. */
export const lines = (p: { readonly [name: string]: unknown }): { readonly before: string[]; readonly declarations: string[] } => {
  const v = (name: string): string => param(p, name);
  const venue = param(p, 'venue', 'none');
  const mode = param(p, 'mode', 'class');
  const style = OPTIONS[venue];
  const options = [
    ...(venue === 'neurips' && v('track') !== '' ? [v('track')] : []),
    ...(style?.modes[mode] !== undefined ? [style.modes[mode]] : []),
    // eccv.sty's key-value options (class.eccv/main.tex l.11-13): the year in every mode, the ID on the review copy.
    ...(venue === 'eccv' && v('conferenceYear') !== '' ? [`year=${v('conferenceYear')}`] : []),
    ...(venue === 'eccv' && mode === 'review' && v('paperId') !== '' ? [`ID=${v('paperId')}`] : []),
  ];
  const before = style !== undefined && options.length > 0 ? [`\\PassOptionsToPackage{${options.join(',')}}{${v('package') || style.pkg}}`] : [];
  const reviewing = mode === 'review' || mode === 'rebuttal';
  switch (venue) {
    case 'cvpr':
      // cvpr.sty prints \confName, \confYear and \paperID on the review and rebuttal copies (l.295-297, 433-440) and defines
      // none of them: the kit's main.tex does (l.81-83), so the review copy gets them even when the template gives none.
      return {
        before,
        declarations: [
          ...(v('paperId') !== '' ? [`\\def\\paperID{${v('paperId')}}`] : reviewing ? ['\\providecommand\\paperID{*****}'] : []),
          ...(v('conferenceName') !== '' ? [`\\def\\confName{${v('conferenceName')}}`] : reviewing ? ['\\providecommand\\confName{CVPR}'] : []),
          ...(v('conferenceYear') !== '' ? [`\\def\\confYear{${v('conferenceYear')}}`] : reviewing ? ['\\providecommand\\confYear{\\the\\year}'] : []),
        ],
      };
    case 'iclr':
      return { before, declarations: mode === 'final' || mode === 'preprint' ? ['\\iclrfinalcopy'] : [] };
    case 'aaai':
      return { before, declarations: set('\\copyrightyear', v('copyrightYear')) };
    case 'acl':
      return { before, declarations: v('titlebox') === '' ? [] : [`\\setlength\\titlebox{${v('titlebox')}}`] };
    case 'bmvc':
      return { before, declarations: mode === 'review' ? [`\\bmvcreviewcopy{${v('paperId') || '??'}}`] : [] };
    case 'icassp':
      // \ninept redefines \normalsize, which \begin{document} calls again, so the preamble serves as the kit's body line does.
      return { before, declarations: [...(p['ninept'] === true ? ['\\ninept'] : []), ...set('\\copyrightnotice', v('copyrightNotice')), ...set('\\toappear', v('toAppear'))] };
    default:
      return { before, declarations: [] };
  }
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const { before, declarations } = lines(p);
  return {
    preamble: () => ({ ...(before.length === 0 ? {} : { beforeDocument: before }), ...(declarations.length === 0 ? {} : { declarations }) }),
    // A document-level way prints nothing in the body.
    emit: () => '',
  };
};

export default realize;
