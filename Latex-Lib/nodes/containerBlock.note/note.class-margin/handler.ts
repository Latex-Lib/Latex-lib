/**
 * note.class-margin: the class's own margin-note command, with no package, its title in bold on the note's first line.
 * - tufte-handout and tufte-book: \marginnote[offset]{…}, unnumbered, or \sidenote[][offset]{…}, numbered with the footnotes,
 *   both on \marginpar in the class's margin font and justification (xtufte-common.def l.1000-1016; tufte-common.def the same);
 * - scrartcl, scrbook and scrreprt: KOMA-Script's \marginline{…}, a \marginpar set ragged towards the text in either margin
 *   (scrkernel-miscellaneous.dtx l.641-643; scrguide, common-marginpar-de.tex l.59-76);
 * - jlreq: \sidenote{…}, numbered with the footnote counter, or \sidenote{keyword}{…} after \jlreqsetup{sidenote_type=symbol},
 *   the title as the keyword (jlreq.cls l.3879-3946); the class defines \sidenote only under its option sidenote_length above
 *   0pt, which a template sets on its class line.
 * Every form is a \marginpar, so the note column is fitted to the page as every margin-note way's is (`FIT_NOTE_COLUMN`).
 * CTAN: https://ctan.org/pkg/tufte-latex, https://ctan.org/pkg/koma-script, https://ctan.org/pkg/jlreq
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { FIT_NOTE_COLUMN, keepingFootnotes, titled, titleOf } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const form = param(p, 'form', 'marginnote');
  const offset = param(p, 'offset');
  const symbol = form === 'jlreq' && param(p, 'jlreqType', 'number') === 'symbol';
  return {
    preamble: () => ({
      declarations: [
        // Every form is a \marginpar, which runs the output routine without shipping a page, so a page of notes stopped at
        // "Output loop---100 consecutive dead cycles" as note.marginpar's did before it raised the limit, and the notes still held
        // were "Float(s) lost" (batch 4 round 2, tufte-handout.A: 4 cells, 53 branches, e.g. dae1be65fa33f6a5ba9b5 result
        // 2778362b1e, 25 tufte-marginnote notes holding images, at \end{document}; reproduced: 25 \marginnote calls of a 3cm rule
        // stop at 100 and ship with the limit raised, ZeroTeX-NG, compat cases, 2026-11-10). Only raised, never lowered.
        '\\ifnum\\maxdeadcycles<1000 \\maxdeadcycles=1000 \\fi',
        // jlreq's keyword form (sidenote_type=symbol, jlreq.cls l.3893, l.3943-3946).
        ...(symbol ? ['\\jlreqsetup{sidenote_type=symbol}'] : []),
        // The class's column fitted to the margin where it is under 2cm or runs off the paper (b22 MC1, `FIT_NOTE_COLUMN`).
        FIT_NOTE_COLUMN,
      ],
    }),
    // A footnote in the note reaches the page's foot: footnotehyper's \savenotes around it where it is loaded (b22 OV2-alt);
    // under tufte, which forbids footnotehyper, \savenotes is undefined and the guard prints nothing.
    emit: (node, content) => {
      const text = p['title'] === false ? content.trim() || '\\mbox{}' : titled(node, content);
      const latex =
        form === 'sidenote'
          ? `\\sidenote${offset === '' ? '' : `[][${offset}]`}{${text}}`
          : form === 'marginline'
            ? `\\marginline{${text}}`
            : form === 'jlreq'
              ? symbol
                ? `\\sidenote{${titleOf(node)}}{${content.trim() || '\\mbox{}'}}`
                : `\\sidenote{${text}}`
              : `\\marginnote${offset === '' ? '' : `[${offset}]`}{${text}}`;
      return keepingFootnotes(content, `\n${latex}\n`);
    },
  };
};

export default realize;
