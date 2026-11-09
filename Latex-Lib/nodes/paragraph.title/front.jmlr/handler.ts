/**
 * front.jmlr (paragraph/title). The JMLR family's author block, where each author is a \Name and an \Email (jmlr.cls) or a
 * \name and an \email (tmlr.sty, jmlr2e's descendant), the address follows \addr after a line break, and \AND starts the next
 * block of authors. Under jmlr (its pmlr option): \title[short]{…\titletag{\thanks{…}}}, \author[short]{…}, the paper's own
 * \firstpageno, \jmlrissue, \jmlrpages, \jmlrsubmitted and \jmlrpublished, and the class's keywords environment after the
 * abstract (pmlr-sample.tex l.34-93; jmlr.dtx l.3381-3448, 3457-3470, 3618-3794, 3893-3896, 4015-4078). Under TMLR: \title{…}
 * and \author{\name … \email … \\ \addr … \AND …} with no short forms, and the camera-ready \def\month, \def\year and
 * \def\openreview (class.tmlr main.tex l.79-98).
 * CTAN: https://ctan.org/pkg/jmlr (tmlr.sty is not on CTAN: TMLR's author kit).
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, templateList } from '../node.ts';
import type { TitleAffiliation, TitleAuthor } from '../node.ts';
import key from './key.ts';

type Block = { readonly people: TitleAuthor[]; readonly own: TitleAffiliation[]; readonly group: string };

/**
 * The author blocks: consecutive authors with the same affiliations share one block and one \addr (pmlr-sample.tex l.51-53:
 * "Two authors with the same address"; l.56-71 three or more), each other author gets a block of their own, after \AND
 * (l.73-79: "Authors with different addresses"; tmlr main.tex l.81-87).
 */
const blocks = (node: Subject): Block[] => {
  const affiliations = affiliationsOf(node);
  const out: Block[] = [];
  for (const a of authorsOf(node)) {
    const own = affiliationsOfAuthor(a, affiliations);
    const group = own.map((f) => f.id).join('|');
    const last = out[out.length - 1];
    if (last !== undefined && group !== '' && last.group === group) last.people.push(a);
    else out.push({ people: [a], own, group });
  }
  return out;
};

const author = (node: Subject, jmlr: boolean): string => {
  const text = blocks(node).map((b) => {
    // jmlr: \Name{…} \Email{…} (\name and \email are class errors inside its author block, jmlr.dtx l.3632-3633); tmlr: the
    // jmlr2e switches \name … \email … (tmlr.sty l.98-102).
    const people = b.people.map((a) => (jmlr ? `\\Name{${a.name}}${a.email === '' ? '' : ` \\Email{${a.email}}`}` : `\\name ${a.name}${a.email === '' ? '' : ` \\email ${a.email}`}`));
    // Two authors of one address joined by \and, which jmlr prints " and " (l.3627; pmlr-sample.tex l.51-52); three or more one
    // to a line (l.56-70). tmlr's block takes them one to a line.
    const names = jmlr && people.length === 2 ? people.join(' \\and\n') : people.join(' \\\\\n');
    // The address: jmlr's on one line, "Department, Institution, Address" (class.jmlr-pmlr main.tex l.61-62); tmlr's a line each
    // (tmlr main.tex l.81-83). One line per affiliation.
    const address = b.own.map((f) => (jmlr ? f.text : [f.department, f.name, f.address].filter(Boolean).join('\\\\ '))).join(' \\\\ ');
    return address === '' ? names : `${names} \\\\\n\\addr ${address}`;
  });
  return text.join('\n\\AND\n');
};

const front = (node: Subject, content: string, jmlr: boolean): string => {
  const title = content.trim();
  const field = (name: string): string => templateField(node, name);
  const set = (command: string, name: string): string[] => (field(name) !== '' ? [`${command}{${field(name)}}`] : []);
  const who = author(node, jmlr);
  if (!jmlr) {
    // tmlr.sty's \title is the kernel's, with no short form; the month, year and OpenReview link are printed by its accepted
    // mode (tmlr main.tex l.92-94, "Insert correct … for camera-ready version"). \openreview holds the link as text: the kit
    // wraps it in \url, which the way does not load.
    return [
      `\\title{${title}}`,
      ...(who === '' ? [] : [`\\author{${who}}`]),
      ...(field('month') !== '' ? [`\\def\\month{${field('month')}}`] : []),
      ...(field('year') !== '' ? [`\\def\\year{${field('year')}}`] : []),
      ...(field('openreview') !== '' ? [`\\def\\openreview{${field('openreview')}}`] : []),
      '\\maketitle',
    ].join('\n');
  }
  const shortTitle = field('shortTitle');
  const runningAuthor = field('runningAuthor');
  const note = field('titleNote');
  // The first page's number: \firstpageno sets the page counter (jmlr.dtx l.3896), so only a number is written.
  const firstPage = /^\d+$/u.test(field('firstPage')) ? [`\\firstpageno{${field('firstPage')}}`] : [];
  return [
    ...firstPage,
    // The journal heading's per-paper values (jmlr.dtx l.3941-3985, 4021-4078): left out when the paper has none, so the class
    // keeps its own (the page range from its labels, l.4047).
    ...set('\\jmlrissue', 'issue'),
    ...set('\\jmlrpages', 'pages'),
    ...set('\\jmlrsubmitted', 'submitted'),
    ...set('\\jmlrpublished', 'published'),
    // \title[short]{…}: the short title for the running head (l.3423-3428); a note on the title through \titletag, which prints
    // its argument only in the title block (l.3415, 3806), as pmlr-sample.tex l.34-35.
    `\\title${shortTitle === '' ? '' : `[${shortTitle}]`}{${title}${note === '' ? '' : `\\titletag{\\thanks{${note}}}`}}`,
    // \author[short]{…}: the short author list for the even head and the copyright foot (l.3457-3470); else the class builds it
    // from the surnames \Name parses (l.3705-3748).
    ...(who === '' ? [] : [`\\author${runningAuthor === '' ? '' : `[${runningAuthor}]`}{${who}}`]),
    '\\maketitle',
  ].join('\n');
};

/**
 * The keywords after the abstract, in the class's keywords environment (jmlr.dtx l.3381-3384; pmlr-sample.tex l.88-93), from
 * the kernel's hook after \end{abstract} (the spec's \AfterEndEnvironment is etoolbox's front for the same hook), so they land
 * there wherever the abstract stands.
 */
const keywordsHook = (node: Subject): string[] => {
  const keywords = templateList(node, 'keywords');
  return keywords.length === 0 ? [] : [`\\AddToHook{env/abstract/after}{\\begin{keywords}${keywords.join(', ')}\\end{keywords}}`];
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const jmlr = param(p, 'form', 'jmlr') === 'jmlr';
  const keywords = param(p, 'keywords', 'afterAbstract') === 'afterAbstract';
  return {
    preamble: (_params, _parentType, node) => (node !== undefined && keywords ? { declarations: keywordsHook(node) } : {}),
    // The title lines in the body, just before \maketitle, where the title stands (pmlr-sample.tex l.34-86 sets them in the
    // preamble; jmlr's \title and \author only store their text, and its \maketitle prints them, l.3512-3551).
    emit: (node, content) => `${front(node, content, jmlr)}\n\n`,
  };
};

export default realize;
