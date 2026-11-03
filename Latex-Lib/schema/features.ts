/**
 * Closed vocabularies (ARCHITECTURE.md section 3): what a handler achieves,
 * what only one handler in a document may own, so a picker can match a
 * target's look to handlers and the resolver can find two owners of one thing.
 * A word not listed here is refused by the validator; adding one is a change
 * to this file.
 */

/** What a handler's output looks like or does. */
export const FEATURES = [
  // Statements and boxes.
  'framed',
  'background',
  'title-bar',
  'breakable',
  'rounded-corners',
  'shadow',
  'left-rule',
  'colored',
  // Heads.
  'bold-head',
  'italic-head',
  'smallcaps-head',
  'run-in-head',
  'break-after-head',
  'note-in-head',
  'custom-head',
  // Bodies.
  'italic-body',
  'upright-body',
  // Numbering.
  'numbered',
  'unnumbered',
  'shared-counter',
  'numbered-within',
  // Marks.
  'qed-mark',
  // Where the look comes from.
  'class-styled',
  // Headings and title blocks.
  'hang-head',
  'display-head',
  'block-head',
  'chapter-opening',
  'sans-serif',
  'uppercase',
  'centered',
  'flush-right',
  'ruled',
  'compact-spacing',
  'page-break-before',
  'title-page',
  'subject-line',
  // Abstracts and contents.
  'small-type',
  'indented',
  'in-contents',
  'dot-leaders',
  'local-contents',
  'flat-contents',
  'lists-of-floats',
  // Lists.
  'compact',
  'custom-labels',
  'inline-list',
  'aligned-labels',
  'resumed-numbering',
  // Notes, boxes and columns.
  'margin-note',
  'icon',
  'connector-line',
  'note-column',
  'balanced-columns',
  'parallel-columns',
  'unequal-widths',
  'column-rule',
  'page-columns',
  // Maths.
  'aligned',
  'multiline',
  // Code.
  'syntax-highlighting',
  'line-numbers',
  'escape-latex',
  // Tables and figures.
  'horizontal-rules',
  'vertical-rules',
  'booktabs-rules',
  'dashed-rules',
  'zebra-rows',
  'full-width',
  'page-breaking',
  'table-notes',
  'cell-spans',
  'floating',
  'here',
  'captioned',
  'tab-stops',
  'wrapped',
  'rotated',
  'side-caption',
  'scaled',
  'vector-graphics',
  // Breaks, appendices, footnotes.
  'float-flush',
  'deferred',
  'odd-page',
  'lettered',
  'appendix-prefix',
  'endnotes',
  'per-page',
  'symbols',
  'paragraph-notes',
  'hanging',
  'box-safe',
  // Citations, references, links.
  'author-year',
  'numeric-citations',
  'sorted-compressed',
  'superscript',
  'external-tool',
  'hand-written',
  'named-refs',
  'capitalised',
  'linked',
  'page-refs',
  'colored-links',
  'boxed-links',
  'url-breaks',
] as const;

export type Feature = (typeof FEATURES)[number];

/** Things only one handler in a document may own. */
export const EXCLUSIVES = [
  'theorem-engine',
  'section-format',
  'caption-format',
  'list-format',
  'footnote-format',
  'float-engine',
  'bibliography-engine',
  'output-routine',
  'page-geometry',
] as const;

export type Exclusive = (typeof EXCLUSIVES)[number];
