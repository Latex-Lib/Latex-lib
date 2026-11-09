/**
 * doc.koma-options (doc): KOMA-Script's own set-up, the template's constants, in the preamble after the class line: one
 * \KOMAoptions{…} with only the options that differ from the class default (scrkernel-basics.dtx l.4095), then
 * \setkomafont or \addtokomafont for each element the template restyles (scrkernel-fonts.dtx l.1733). The document
 * options for scrartcl, scrreprt and scrbook (form document), the letter options for scrlttr2 (form letter). It leaves
 * out what other ways set: headings= and numbers= (head.koma-fonts), toc= (toc.koma), titlepage= (front.koma-title).
 * Prints nothing at the defaults; no body line.
 * CTAN: https://ctan.org/pkg/koma-script
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import key from './key.ts';

const SHARED = ['DIV', 'BCOR', 'parskip'] as const;
const DOCUMENT = ['open', 'captions', 'bibliography', 'listof', 'abstract', 'headsepline', 'footsepline', 'headinclude', 'footinclude'] as const;
const LETTER = ['fromalign', 'fromrule', 'fromphone', 'fromemail', 'fromurl', 'fromlogo', 'foldmarks', 'enlargefirstpage'] as const;
/** The font parameters and the KOMA element each sets. */
const FONTS_SHARED = [['captionFont', 'caption'], ['captionLabelFont', 'captionlabel'], ['pageheadFont', 'pagehead'], ['pagenumberFont', 'pagenumber'], ['labelinglabelFont', 'labelinglabel']] as const;
const FONTS_LETTER = [['fromnameFont', 'fromname'], ['subjectFont', 'subject']] as const;

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const letter = param(p, 'form', 'document') === 'letter';
  const set = (name: string): boolean => {
    const v = param(p, name);
    return v !== '' && v !== 'class';
  };
  return {
    preamble: () => {
      const names = [...SHARED, ...(letter ? LETTER : DOCUMENT)];
      const options = [...names.filter(set).map((n) => `${n}=${param(p, n)}`), ...(param(p, 'options') === '' ? [] : [param(p, 'options')])];
      const command = param(p, 'fontMode', 'set') === 'add' ? 'addtokomafont' : 'setkomafont';
      const fonts = [...FONTS_SHARED, ...(letter ? FONTS_LETTER : [])].filter(([n]) => set(n)).map(([n, element]) => `\\${command}{${element}}{${param(p, n)}}`);
      const lines = [...(options.length === 0 ? [] : [`\\KOMAoptions{${options.join(', ')}}`]), ...fonts];
      return lines.length === 0 ? {} : { declarations: lines };
    },
    emit: () => '',
  };
};

export default realize;
