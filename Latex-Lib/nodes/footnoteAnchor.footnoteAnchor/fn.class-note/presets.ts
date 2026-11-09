/**
 * fn.class-note's presets, each from the class source or the templates that use it.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const SRC = 'Latex Related Research/Latex-lib-main/Source';

export const PRESETS = {
  achemso: {
    description:
      "ACS (achemso) notes: every footnote becomes a \\bibnote (\\let\\footnote\\bibnote), numbered with the references and printed in the reference list ('Notes and References'), as ACS journals want; needs the document's bibliography and its BibTeX run.",
    writes: '\\footnote{…}; \\let\\footnote\\bibnote',
    features: ['endnotes', 'numbered', 'class-styled'],
    params: { route: 'bibnote' },
    evidence: [
      solution('0528-achemso', '52'),
      { kind: 'source', file: `${SRC}/0528-achemso/achemso.dtx`, line: '494-522 (\\bibnote, notes2bib emulation), 543-590 (the @Misc entry written), 756 (created at class load)' },
      { kind: 'source', file: `${SRC}/0528-achemso/achemso-demo.tex`, line: '190-198' },
    ],
  },
  jlreq: {
    description:
      "jlreq's endnotes (JLReq 4.2.4): every footnote becomes the class's \\endnote (\\let\\footnote\\endnote), collected and printed by the class before the next heading and at the end of the document.",
    writes: '\\footnote{…}; \\let\\footnote\\endnote',
    features: ['endnotes', 'numbered', 'class-styled'],
    params: { route: 'endnote' },
    evidence: [
      { kind: 'source', file: `${SRC}/0529-jlreq/jlreq.cls`, line: '3703-3721 (endnote counter, \\endnotemark, \\endnotetext), 3823-3871 (\\endnote, endnote_position, \\AtEndDocument{\\theendnotes}), 6611 (endnote_position=headings)' },
      solution('0529-jlreq', '24'),
    ],
  },
  mdpi: {
    description:
      "MDPI endnotes: every footnote becomes an \\endnote of the class's preloaded enotez (\\let\\footnote\\endnote), listed at the end in mdpi's own 9pt list (\\printendnotes[custom]); the journal Laws keeps footnotes instead.",
    writes: '\\footnote{…}; \\let\\footnote\\endnote \\AtEndDocument{\\printendnotes[custom]}',
    features: ['endnotes', 'numbered', 'small-type', 'class-styled'],
    params: { route: 'enotez' },
    evidence: [
      { kind: 'source', file: `${SRC}/0894-mdpi/template.tex`, line: '165 (%\\endnote{…}: only Laws uses \\footnote), 475 (%\\printendnotes[custom])' },
      { kind: 'source', file: 'testing-pipeline/settings/classes/files/Definitions/mdpi.cls', line: '75 (enotez), 569-575 (\\setenotez, the custom list instance)' },
      solution('0894-mdpi', '72'),
    ],
  },
  'koma-flush-mark': {
    description:
      "KOMA-Script footnotes with the mark set flush left in a 1.5em box, not superscript, the text hanging after it (\\deffootnote{1.5em}{1em}{\\makebox[1.5em][l]{\\thefootnotemark}}), as ksp-thesis sets them.",
    writes: '\\footnote{…}; \\deffootnote{…}{…}{…}',
    features: ['hanging', 'numbered'],
    params: { route: 'deffootnote', markWidth: '', indent: '1.5em', parIndent: '1em', markFormat: '\\makebox[1.5em][l]{\\thefootnotemark}' },
    evidence: [{ kind: 'source', file: `${SRC}/0240-ksp-thesis/ksp-thesis.cls`, line: '340' }, solution('0240-ksp-thesis', '23')],
  },
  'koma-flush': {
    description:
      'KOMA-Script footnotes flush with the margin, the mark not superscript and followed by a half-em space (\\deffootnote{0em}{0em}{\\thefootnotemark\\hspace*{.5em}}), as classicthesis sets them under a KOMA class.',
    writes: '\\footnote{…}; \\deffootnote{…}{…}{…}',
    features: ['numbered'],
    params: { route: 'deffootnote', markWidth: '', indent: '0em', parIndent: '0em', markFormat: '\\thefootnotemark\\hspace*{.5em}' },
    evidence: [{ kind: 'source', file: `${SRC}/0258-arsclassica-article/classicthesis.sty`, line: '633-636' }],
  },
  'koma-hang': {
    description:
      'KOMA-Script footnotes with a superscript mark right-aligned in a 2em box and the text hanging at 0.5em (\\deffootnote[2em]{0.5em}{1em}{\\textsuperscript{\\thefootnotemark}}), as praecordi-book sets them over scrbook.',
    features: ['hanging', 'numbered', 'superscript'],
    params: { route: 'deffootnote', markWidth: '2em', indent: '0.5em', parIndent: '1em', markFormat: '\\textsuperscript{\\thefootnotemark}' },
    evidence: [{ kind: 'source', file: `${SRC}/0189-praecordi-praecordi-book/praecordi-book.cls`, line: '348' }],
  },
} as const satisfies { readonly [name: string]: Preset };
