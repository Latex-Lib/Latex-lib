/**
 * copernicus.cls's statement commands, by the titles that name them. Each is made by the class's \generateCommand
 * (copernicus.cls l.2823-2866): one argument, printed as a small run-in block whose italic label is the class's own
 * \<command>name (l.1410-1433, English; German and French sets at l.1440-1501). The heading the reader sees is the class's,
 * whatever the node's title said: "Funding" prints as "Financial support", as the class wants it.
 */

/** A title as compared: lower case, one space, no closing period or colon, & as "and", curly apostrophes straight. */
export const normalTitle = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[‘’]/gu, "'")
    .replace(/&/gu, ' and ')
    .replace(/\s+/gu, ' ')
    .trim()
    .replace(/[.:]+$/u, '')
    .trim();

/** Titles that print the acknowledgements environment (l.2876-2883: the singular environment is a class error). */
export const ACKNOWLEDGEMENTS: ReadonlySet<string> = new Set(['acknowledgements', 'acknowledgement', 'acknowledgments', 'acknowledgment']);

/** Command name to the titles it answers (the class's own name first, l.1410-1433). */
export const STATEMENTS: { readonly [command: string]: readonly string[] } = {
  authorcontribution: ['author contributions', 'author contribution', "authors' contributions", 'authors contributions', 'contributions'],
  competinginterests: ['competing interests', 'competing interest', 'conflict of interest', 'conflicts of interest', 'declaration of competing interest', 'declaration of interests', 'disclosure of interests'],
  disclaimer: ['disclaimer'],
  codeavailability: ['code availability'],
  dataavailability: ['data availability', 'data availability statement'],
  codedataavailability: ['code and data availability', 'data and code availability'],
  ercavailability: ['interactive computing environment'],
  sampleavailability: ['sample availability'],
  videosupplement: ['video supplement'],
  teamlist: ['team list'],
  sistatement: ['special issue statement'],
  financialsupport: ['financial support', 'funding'],
  reviewstatement: ['review statement'],
  copyrightstatement: ['copyright statement'],
};

/** The statement command a title names, or nothing. */
export const statementOf = (title: string): string | undefined => {
  const t = normalTitle(title);
  return Object.entries(STATEMENTS).find(([, titles]) => titles.includes(t))?.[0];
};

/**
 * A title as \specialsection's first argument. The class puts it inside \csname (l.2868-2873: specialsection-#1name), where
 * an escaped special (\&, \textasciitilde{}) is not expandable and stops at "Missing \endcsname inserted"; so & becomes
 * "and" and the other specials are dropped.
 */
export const csnameSafe = (title: string): string =>
  title
    .replace(/&/gu, 'and')
    .replace(/[\\%$#_{}~^​]/gu, '')
    .replace(/ /gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim();
