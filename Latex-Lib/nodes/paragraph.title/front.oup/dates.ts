/**
 * front.oup's date reader. OUP's \received, \revised and \accepted take three arguments, day, month number and year
 * (oup-authoring-template.cls l.1201-1203), and print the month by name through \myswitch (l.1177-1191): a month that is
 * not a number stops at "Missing number". Flouest's templateSpecific dates are free text, so each is read as an ISO date
 * (2024-03-12), "12 March 2024", "March 12, 2024" or a [day, month, year] list (which templateField joins with ", ").
 */
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

const month = (m: string): number | undefined => {
  if (/^\d{1,2}$/u.test(m)) {
    const n = Number(m);
    return n >= 1 && n <= 12 ? n : undefined;
  }
  const i = MONTHS.findIndex((name) => m.length >= 3 && name.startsWith(m.toLowerCase().replace(/\.$/u, '')));
  return i < 0 ? undefined : i + 1;
};

/** The date as day, month number and year, or undefined when it cannot be read (the way then leaves the date out). */
export const oupDate = (text: string): readonly [string, number, string] | undefined => {
  const t = text.trim();
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/u.exec(t);
  if (iso) {
    const m = month(iso[2] ?? '');
    return m === undefined ? undefined : [String(Number(iso[3])), m, iso[1] ?? ''];
  }
  const dmy = /^(\d{1,2})(?:,\s*|\s+)([A-Za-z]+\.?|\d{1,2})(?:,\s*|\s+)(\d{4})$/u.exec(t);
  if (dmy) {
    const m = month(dmy[2] ?? '');
    return m === undefined ? undefined : [dmy[1] ?? '', m, dmy[3] ?? ''];
  }
  const mdy = /^([A-Za-z]+\.?)\s+(\d{1,2}),?\s+(\d{4})$/u.exec(t);
  if (mdy) {
    const m = month(mdy[1] ?? '');
    return m === undefined ? undefined : [mdy[2] ?? '', m, mdy[3] ?? ''];
  }
  return undefined;
};
