/**
 * ack.class-command's title maps: which of a class's back-matter commands the node's title picks. Each command prints its
 * own fixed heading, so the title only chooses the command; a title none of them matches goes to the way's `command` (iopjournal),
 * or to mdpi's \backnotes{title}{…}, which prints the title as its run-in heading ("Title:", mdpi.cls l.1455-1456).
 */

/** A command and, for a two-argument one, the heading it is given first (escaped). */
export type Pick = { readonly command: string; readonly heading?: string };

const has = (title: string, pattern: RegExp): boolean => pattern.test(title);

/** iopjournal.cls l.145-163: \ack, \funding, \data, \roles, \suppdata, each \section*{its heading} and the text. */
export const iopjournal = (title: string, fallback: string): Pick =>
  has(title, /fund/iu)
    ? { command: 'funding' }
    : has(title, /data\s+availab/iu)
      ? { command: 'data' }
      : has(title, /author(s'?)?\s+contribution|roles/iu)
        ? { command: 'roles' }
        : has(title, /supplementary/iu)
          ? { command: 'suppdata' }
          : { command: fallback };

/** mdpi.cls l.1401-1460: the back-matter commands, each a bold 9pt run-in label and the text. */
export const mdpi = (title: string, escapedTitle: string, fallback: string): Pick => {
  if (title === '' || has(title, /^acknowledg/iu)) return { command: fallback };
  const table: readonly (readonly [RegExp, string])[] = [
    [/author(s'?)?\s+contribution/iu, 'authorcontributions'],
    [/^funding/iu, 'funding'],
    [/institutional\s+review/iu, 'institutionalreview'],
    [/informed\s+consent/iu, 'informedconsent'],
    [/data\s+availab/iu, 'dataavailability'],
    [/conflicts?\s+of\s+interest/iu, 'conflictsofinterest'],
    [/supplementary/iu, 'supplementary'],
  ];
  const found = table.find(([pattern]) => has(title, pattern));
  if (found !== undefined) return { command: found[1] };
  // \abbreviations{heading}{list} prints its first argument as a 12pt bold heading (l.1444-1445).
  if (has(title, /^abbreviations/iu)) return { command: 'abbreviations', heading: escapedTitle };
  return { command: 'backnotes', heading: escapedTitle };
};
