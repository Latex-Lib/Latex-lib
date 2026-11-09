/**
 * front.copernicus's readers for what node.ts does not shape: an author's given name and surname (\Author takes them
 * apart), and which authors a template field names (the corresponding, deceased and equal-contribution authors). Every
 * text is LaTeX text already, as node.ts's readers give it.
 */
import type { TitleAuthor } from '../node.ts';

/**
 * The given name and surname of an author: the surname is the name's last word, the given name the rest (the title's
 * records hold one name, so "Ludwig van Beethoven" gives "Ludwig van" and "Beethoven"). A one-word name is a surname.
 */
export const nameParts = (name: string): { readonly given: string; readonly surname: string } => {
  const words = name.split(/\s+/u).filter(Boolean);
  return { given: words.slice(0, -1).join(' '), surname: words[words.length - 1] ?? '' };
};

/**
 * The 1-based numbers of the authors an entry list names: each entry an author's name, email or number in the author
 * list (the class numbers authors so, template.tex l.96-101). An entry may carry a note after a colon ("Name: date").
 */
export const namedAuthors = (entries: readonly string[], authors: readonly TitleAuthor[]): { readonly number: number; readonly note: string }[] =>
  entries.flatMap((entry) => {
    const at = entry.indexOf(':');
    const who = (at > 0 ? entry.slice(0, at) : entry).trim();
    const note = at > 0 ? entry.slice(at + 1).trim() : '';
    const index = /^\d+$/u.test(who) ? Number(who) - 1 : authors.findIndex((a) => a.name === who || (a.email !== '' && a.email === who));
    return index >= 0 && index < authors.length ? [{ number: index + 1, note }] : [];
  });
