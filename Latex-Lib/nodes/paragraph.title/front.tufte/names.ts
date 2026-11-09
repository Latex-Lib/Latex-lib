/**
 * The authors as one line of prose: "A", "A and B", "A, B and C". Tufte-LaTeX's \maketitle sets \@author bare in a
 * paragraph (tufte-common.def's \maketitle, as the engine's tufte-handout prints its \meaning: "\Large \itshape \@author
 * \par"; xtufte-common.def l.1463-1488), not inside a tabular, so the kernel's \and (\end{tabular}...\begin{tabular})
 * has no tabular to close; the names are joined in words instead, as the class's templates write them
 * (class.tufte-handout/main.tex l.61: "First Author and Second Author").
 */
export const joinNames = (names: readonly string[]): string =>
  names.length <= 1 ? (names[0] ?? '') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1] ?? ''}`;
