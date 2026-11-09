/**
 * list.agu-glossary's presets, one per back-matter list, from AGU's class and template (the 2019 files the research holds).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

/** A file at its lines. */
const source = (file: string, line: string) => ({ kind: 'source', file, line }) as const;
const AGU = 'Latex Related Research/Latex-lib-main/Source/0040-agu/April 16 2019';

export const PRESETS = {
  glossary: {
    description: 'A glossary under its own Glossary heading: each term in bold as a description label, then its definition (\\begin{glossary} \\term{…} …).',
    features: ['class-styled'],
    params: { form: 'glossary' },
    evidence: [source(`${AGU}/agujournal2019.cls`, '1055-1060 (glossary, \\term)'), source(`${AGU}/agujournaltemplate.tex`, '319-356 (offered in comments)'), solution('0040-agu', '25, 64')],
  },
  acronyms: {
    description: 'The acronyms under their own Acronyms heading: each acronym in bold as a description label, then what it stands for (\\begin{acronyms} \\acro{…} …).',
    writes: '\\begin{acronyms} \\acro{…} … \\end{acronyms}',
    features: ['class-styled'],
    params: { form: 'acronyms' },
    evidence: [source(`${AGU}/agujournal2019.cls`, '1062-1067 (acronyms, \\acro)'), source(`${AGU}/agujournaltemplate.tex`, '319-356 (offered in comments)')],
  },
  notation: {
    description: 'The notation under its own Notation heading: each symbol in bold maths as a description label, then its meaning (\\begin{notation} \\notation{…} …).',
    writes: '\\begin{notation} \\notation{…} … \\end{notation}',
    features: ['class-styled'],
    params: { form: 'notation' },
    evidence: [source(`${AGU}/agujournal2019.cls`, '1069-1074 (notation, \\notation as \\item[\\boldmath #1])'), source(`${AGU}/agujournaltemplate.tex`, '319-356 (offered in comments)')],
  },
} as const satisfies { readonly [name: string]: Preset };
