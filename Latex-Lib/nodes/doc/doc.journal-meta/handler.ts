/**
 * doc.journal-meta (doc). A journal's or conference's constants, set once per template with the class's own commands, in the
 * preamble. Each value is the template's own LaTeX and prints as given; a value left empty prints nothing, so the class keeps
 * its own default or placeholder (asmeconf's 'Missing conference name!', amsproc's absent series logo).
 *
 * Every command here only stores its value (a \def, a \gdef or an expl3 token list), so the preamble serves as well as the
 * place after \begin{document} some samples use (OUP's \journaltitle block, Copernicus's \firstpage): oup-authoring-template.cls
 * l.1170-1172, 1275-1279, 1328, 1394-1396; copernicus.cls l.2591; asmeconf.cls l.1700-1705.
 * The per-paper values (paper numbers, received and accepted dates, a paper's DOI, OUP's and ACM's per-paper volume) are the
 * title's templateSpecific fields, printed by the title ways (front.oup, front.asmeconf, front.mdpi …), never here.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import key from './key.ts';

/** `\cmd{value}` when the value is set. */
const set = (command: string, value: string): string[] => (value === '' ? [] : [`${command}{${value}}`]);

/** A whole number for easychair's \ifnum arguments, or the fallback. */
const count = (value: string, fallback: string): string => (/^\d+$/u.test(value.trim()) ? value.trim() : fallback);

export const lines = (p: { readonly [name: string]: unknown }): string[] => {
  const v = (name: string): string => param(p, name);
  const editorCount = typeof p['editorCount'] === 'number' ? p['editorCount'] : 1;
  switch (param(p, 'form', 'none')) {
    case 'aastex':
      // aastex701.cls l.12346-12350, 12376-12382, 12395-12396.
      return [...set('\\submitjournal', v('journal')), ...set('\\watermark', v('watermark')), ...set('\\setwatermarkfontsize', v('watermarkFontSize')), ...(p['turnOffEdit'] === true ? ['\\turnoffedit'] : [])];
    case 'emulateapj':
      return set('\\slugcomment', v('slugcomment'));
    case 'agu':
      // The sample writes \draftfalse right after the class line, which takes the draft option (agujournaltemplate.tex l.36).
      return [...(p['draft'] === false ? ['\\draftfalse'] : []), ...set('\\journalname', v('journal'))];
    case 'asmeconf':
      return [...set('\\ConfName', v('conference')), ...set('\\ConfAcronym', v('conferenceShort')), ...set('\\ConfDate', v('conferenceDate')), ...set('\\ConfCity', v('conferenceVenue'))];
    case 'asmejour':
      return set('\\JourName', v('journal'));
    case 'oup':
      // \societylogo: the opening page prints it and the class never defines it (cls l.966-984; the sample's tex l.44);
      // \providecommand, since front.oup's body line \providecommand\societylogo{} gives an empty one where nothing did.
      return [
        ...(v('societyLogo') === '' ? [] : [`\\providecommand\\societylogo{${v('societyLogo')}}`]),
        ...set('\\journaltitle', v('journal')),
        ...set('\\DOI', v('doi')),
        ...set('\\copyrightyear', v('copyrightYear')),
        ...set('\\pubyear', v('year')),
        ...set('\\vol', v('volume')),
        ...set('\\issue', v('issue')),
        ...set('\\access', v('access')),
        ...set('\\appnotes', v('articleType')),
      ];
    case 'amsproc':
      // \publname defined before \begin{document} turns on the series logo (amsclass.dtx l.1742-1750).
      return [
        ...(v('journal') === '' ? [] : [`\\def\\publname{${v('journal')}}`]),
        ...(v('volumeInfo') === '' ? [] : [`\\def\\volinfo{${v('volumeInfo')}}`]),
        ...(v('copyrightYear') === '' && v('copyrightHolder') === '' ? [] : [`\\copyrightinfo{${v('copyrightYear')}}{${v('copyrightHolder')}}`]),
      ];
    case 'elsarticle':
      return set('\\journal', v('journal'));
    case 'jmlr':
      return [...set('\\jmlrvolume', v('volume')), ...set('\\jmlryear', v('year')), ...set('\\jmlrworkshop', v('conference')), ...set(editorCount > 1 ? '\\editors' : '\\editor', v('editors'))];
    case 'vldb':
      // pvldb.sty's own macros, which the setting loads after the class (class.vldb/main.tex l.13-33).
      return [
        ...set('\\renewcommand\\vldbvolume', v('volume')),
        ...set('\\renewcommand\\vldbissue', v('issue')),
        ...set('\\renewcommand\\vldbyear', v('year')),
        ...set('\\renewcommand\\vldbauthors', v('vldbAuthors')),
        ...set('\\renewcommand\\vldbtitle', v('vldbTitle')),
        ...set('\\renewcommand\\vldbpagestyle', v('vldbPageStyle')),
      ];
    case 'mdpi':
      // As the sample's "MDPI internal commands" block (template.tex l.38-53): the page counter starts at \@firstpage.
      return [
        ...(v('firstPage') === '' ? [] : [`\\firstpage{${v('firstPage')}}`, '\\makeatletter\\setcounter{page}{\\@firstpage}\\makeatother']),
        ...set('\\pubvolume', v('volume')),
        ...set('\\issuenum', v('issue')),
        ...set('\\articlenumber', v('articleNumber')),
        ...set('\\pubyear', v('year')),
        ...set('\\copyrightyear', v('copyrightYear')),
        // The sample ends its body with \PublishersNote{} (l.540); a template carries preamble lines only, so at the end of the document.
        ...(p['publishersNote'] === true ? ['\\AtEndDocument{\\PublishersNote}'] : []),
      ];
    case 'easychair':
      // Six arguments, the volume and issue compared with \ifnum and the first page set as the page counter (easychair.cls
      // l.508-525): only with an event, as the class prints nothing of the volume without one.
      return v('conference') === ''
        ? []
        : [`\\volumeinfo{${v('editors')}}{${Math.max(1, Math.trunc(editorCount))}}{${v('conference')}}{${count(v('volume'), '0')}}{${count(v('issue'), '0')}}{${count(v('firstPage'), '1')}}`];
    case 'neurips':
      return set('\\workshoptitle', v('conference'));
    case 'copernicus':
      return set('\\firstpage', v('firstPage'));
    default:
      return [];
  }
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const declarations = lines(p);
  return {
    preamble: () => (declarations.length === 0 ? {} : { declarations }),
    // A document-level way prints nothing in the body.
    emit: () => '',
  };
};

export default realize;
