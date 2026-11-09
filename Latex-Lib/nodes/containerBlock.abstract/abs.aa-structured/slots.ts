/**
 * abs.aa-structured's reading of an abstract: its paragraphs sorted into aa's five slots, Context, Aims, Methods, Results and
 * Conclusions (aa.cls l.479-483), by the label each opens with, the label left out (the class prints the headings itself).
 */

/** aa's slots, in the order \abstract takes them (aa.cls l.814-823). */
export const SLOTS = ['Context', 'Aims', 'Methods', 'Results', 'Conclusions'] as const;

/**
 * A paragraph's opening label: `Context.`, `Aims:`, `\textbf{Methods.}`, `\textbf{Results}:` (any case, the singular too), a
 * full stop or a colon always (so "Results show that …" is text, not a label), and a wrapper closed where it opens.
 */
const LABEL = /^(\\(?:textbf|textit|emph|textsc|textsf)\{)?\s*(context|aims?|methods?|results?|conclusions?)\s*([.:])?\s*(\})?\s*([.:])?/iu;

const slotOf = (word: string): number => SLOTS.findIndex((s) => s.toLowerCase().startsWith(word.toLowerCase().replace(/s$/u, '')));

/** The paragraph's slot and its text after the label, or nothing when it opens with no label. */
export const labelOf = (paragraph: string): { readonly slot: number; readonly rest: string } | undefined => {
  const text = paragraph.trimStart();
  const m = LABEL.exec(text);
  if (m === null) return undefined;
  const wrapped = m[1] !== undefined;
  if (wrapped !== (m[4] !== undefined)) return undefined;
  if (m[3] === undefined && m[5] === undefined) return undefined;
  const slot = slotOf(m[2] ?? '');
  return slot < 0 ? undefined : { slot, rest: text.slice(m[0].length).trimStart() };
};

/**
 * The five slots' LaTeX, or nothing when the abstract is not structured: no label at all, or one of Aims, Methods and Results
 * (the three aa prints always, aa.cls l.1152-1160; the kit calls the five braces mandatory, Context and Conclusions may be
 * empty, aa_example.tex l.75-91) left empty. A paragraph with no label joins the slot of the label before it; those before
 * the first label are the context. A slot of several paragraphs keeps its blank lines.
 */
export const slotsOf = (content: string): readonly string[] | undefined => {
  const paragraphs = content
    .trim()
    .split(/\n[ \t]*\n/u)
    .map((p) => p.trim())
    .filter((p) => p !== '');
  const slots: string[][] = SLOTS.map(() => []);
  let current = 0;
  let labelled = false;
  for (const paragraph of paragraphs) {
    const label = labelOf(paragraph);
    if (label !== undefined) {
      labelled = true;
      current = label.slot;
      if (label.rest !== '') slots[current]?.push(label.rest);
    } else slots[current]?.push(paragraph);
  }
  const joined = slots.map((s) => s.join('\n\n'));
  return !labelled || [1, 2, 3].some((i) => joined[i] === '') ? undefined : joined;
};
