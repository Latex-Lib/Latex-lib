import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'head.book-matter',
    node: 'paragraph/heading',
    description:
      "A book's main matter: the class's own heading commands, with \\mainmatter written once, by a TeX guard, before the first numbered part or chapter, so the front matter's unnumbered chapters (\\chapter*{Preface}) keep roman page numbers and the body starts on arabic page 1 (amsbook, book).",
    writes: '\\ifdefined\\LatexLibMainmatter\\else\\mainmatter\\global\\let\\LatexLibMainmatter\\empty\\fi \\chapter[…]{…} \\label{…}',
    ctan: ['latex-base', 'amscls'],
    features: ['class-styled', 'numbered'],
    params: {
      mainmatter: { type: 'boolean', default: true, description: "\\mainmatter before the first numbered part or chapter; false prints the headings as head.class-native" },
    },
    presets: PRESETS,
    requires: [
      'cmd:\\mainmatter',
      'counter:chapter',
      'counter:{kind}',
    ],
    only: ['class.amsbook', 'class.book'],
    // Below cols.vwcol a heading comes out at the full text width (172.7pt over in a 0.5 column): 0 of 561 library headings there pass but
    // head.sectsty@smallcaps's \subparagraph (55 of 59), run-in titles that never print (their footnote sibling's sentinel is missing).
    // Copy batch-3b, 5 pairs; e.g. d165d94f2adcdc3093699 result 82adbd1a35 l.150, an unmarked \section* 172.7pt over.
    needs: { paragraph: true },
    // Typeset ok on ZeroTeX-NG (2026-11-07) under book and amsbook, a \chapter*{Preface}, then two numbered chapters with sections:
    // the page number restarts at 1 at the first chapter and the guard keeps the second from running \mainmatter again.
    targetEngine: 'yes',
  }),
);
