/**
 * Evidence as presets cite it: a Solution file of the research at its line
 * (`node seed.ts <component> --rows`), or a CTAN manual at its section.
 */
export const solution = (file: string, lines: string) => ({ kind: 'solution', file: `Solution/${file}.md`, lines }) as const;

export const manual = (of: string, section: string) => ({ kind: 'manual', of, section, url: `https://ctan.org/pkg/${of}` }) as const;
