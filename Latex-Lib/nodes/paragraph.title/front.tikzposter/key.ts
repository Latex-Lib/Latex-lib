import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'front.tikzposter',
    node: 'paragraph/title',
    description:
      "tikzposter's title box across the top of the poster: \\title{…}, \\author{…} with the authors comma-joined, each with superscript numbers of their institutes and the presenting author underlined, \\institute{…} with the numbered institutes side by side (\\quad) or one a line and the e-mails in \\texttt, then the class's \\maketitle with optional box settings (width, roundedcorners, linewidth, space to the blocks); no date.",
    writes: '\\title{…} \\author{…\\textsuperscript{…}, \\underline{…}\\textsuperscript{…,…}} \\institute{\\textsuperscript{…}… \\quad \\textsuperscript{…}… \\\\ \\texttt{…} \\quad \\texttt{…}} \\maketitle',
    ctan: ['tikzposter'],
    features: ['class-styled', 'centered'],
    params: {
      institutes: {
        type: 'enum',
        values: ['quad', 'newline'],
        default: 'quad',
        description: 'the institutes in \\institute side by side, parted by \\quad (poster.tex), or one a line, parted by \\\\ (simple-poster.tex)',
      },
      emails: { type: 'boolean', default: true, description: "the authors' e-mails in \\texttt on the institute box's last line, parted by \\quad" },
      width: { type: 'dimen', default: '', description: "\\maketitle's width= option: the title box's width (0.96\\linewidth); empty for the theme's" },
      titletoblockverticalspace: { type: 'dimen', default: '', description: "\\maketitle's titletoblockverticalspace= option: the space between the title box and the first blocks; empty for the theme's" },
      linewidth: { type: 'dimen', default: '', description: "\\maketitle's linewidth= option: the title box's frame line (0 for none); empty for the theme's" },
      roundedcorners: { type: 'string', default: '', description: "\\maketitle's roundedcorners= option: the radius of the box's corners, a number (10); empty for the theme's" },
    },
    fields: ['author.email', 'affiliation.name', 'affiliation.department', 'affiliation.address', 'templateSpecific.presentingAuthor'],
    presets: PRESETS,
    // It runs the class's \maketitle, which draws the title box (tikzposter.cls); the class defines \institute for it.
    claims: ['maketitle'],
    requires: ['cmd:\\maketitle', 'cmd:\\institute'],
    only: ['class.tikzposter'],
    // Typeset ok on ZeroTeX-NG (2026-11-07), both presets under tikzposter[a0paper] (the mirror's tikzposter.cls) on the title sample
    // and on a fuller one (a presenting author, an author with no institute). A probe showed the class's \institute stores
    // \@institute (\gdef\@institute{#1}) and its default title style prints it under \@author.
    targetEngine: 'yes',
  }),
);
