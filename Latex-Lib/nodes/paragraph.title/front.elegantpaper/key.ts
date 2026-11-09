import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'front.elegantpaper',
    node: 'paragraph/title',
    description:
      "ElegantLaTeX's elegantpaper title block: \\title, one \\author whose entries are joined by \\and, each the author's name with their affiliation lines and \\email{…} after \\\\, the \\institute line under the authors (a token register; 'Corresponding author: \\email{…}' when no institute is given), \\version{…} for the italic Version line, \\date{…} for the Date line, then the class's \\maketitle; the keywords as the class's \\keywords{a, b} at the end of the abstract (a kernel env/abstract/end hook) or under the title.",
    // Body; preamble. The keywords line is the default preset's; 'keywords-after-title' gives its own skeleton.
    writes: '\\title{…} \\author{… \\\\ … \\\\ \\email{…} \\and …} \\institute{…} \\version{…} \\date{…} \\maketitle; \\AddToHook{env/abstract/end}{\\keywords{…, …}}',
    ctan: ['elegantpaper'],
    features: ['class-styled', 'centered'],
    params: {
      emails: { type: 'enum', values: ['author', 'none'], default: 'author', description: "each author's e-mail as the class's \\email{…} (a mailto link) on the last line of their entry, or none" },
      corresponding: {
        type: 'enum',
        values: ['institute', 'none'],
        default: 'institute',
        description:
          "with no templateSpecific.institute, the corresponding author (templateSpecific.correspondingAuthor, an author's e-mail or name) as the \\institute line, 'Corresponding author: \\email{…}' as the class's example paper writes it, or nothing",
      },
      correspondingLabel: { type: 'tex', default: 'Corresponding author:', description: 'the words before the corresponding author\'s e-mail in the \\institute line' },
      keywords: {
        type: 'enum',
        values: ['abstract-end', 'after-title', 'none'],
        default: 'abstract-end',
        description:
          "templateSpecific.keywords as the class's \\keywords{a, b}: at the end of the abstract environment (a kernel env/abstract/end hook in the preamble, where the class's samples write it), right after \\maketitle (a paper with no abstract), or none",
      },
      versionLabel: { type: 'tex', default: '', description: "the Version line's label (\\renewcommand\\versiontext{…}); empty keeps the class's '\\itshape Version: '" },
      dateLabel: { type: 'tex', default: '', description: "the Date line's label (\\renewcommand\\updatetext{…}); empty keeps the class's '\\itshape Date: '" },
    },
    fields: [
      'author.email',
      'affiliation.name',
      'affiliation.department',
      'affiliation.address',
      'templateSpecific.institute',
      'templateSpecific.correspondingAuthor',
      'templateSpecific.version',
      'templateSpecific.keywords',
    ],
    presets: PRESETS,
    // It runs the class's own \maketitle (cls l.279-340), which prints the \institute and \version registers under the authors.
    claims: ['maketitle'],
    // \email (cls l.101), the \version and \institute token registers (l.276-277) and the labels \versiontext, \updatetext (l.249-250).
    requires: ['cmd:\\maketitle', 'cmd:\\institute', 'cmd:\\version', 'cmd:\\email', 'cmd:\\versiontext', 'cmd:\\updatetext'],
    // \keywords is the class's under lang=en (l.254) and lang=cn (l.228).
    requiresWhen: [{ when: { keywords: ['abstract-end', 'after-title'] }, requires: ['cmd:\\keywords'] }],
    only: ['class.elegantpaper'],
    // Typeset ok on ZeroTeX-NG (2026-11-07) under \documentclass[lang=en,bibend=bibtex]{elegantpaper}, each preset on the title
    // sample (with a version and a renamed \versiontext): the authors' columns with their affiliation and e-mail lines, the
    // Corresponding author line, the Version and Date lines, and Keywords at the abstract's end (or under the title).
    targetEngine: 'yes',
  }),
);
