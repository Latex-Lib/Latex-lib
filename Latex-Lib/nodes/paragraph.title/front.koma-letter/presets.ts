/**
 * front.koma-letter's presets: the template's own salutation and closing, each from the scrlttr2 letters that use it.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  english: {
    description: "A KOMA-Script letter (scrlttr2) with the sender, references, subject and date as komavars, \\opening{Dear Sir or Madam,} at the title and \\closing{Yours sincerely,} with \\encl and \\cc at the end.",
    features: ['class-styled', 'subject-line'],
    params: { opening: 'Dear Sir or Madam,', closing: 'Yours sincerely,' },
    evidence: [solution('0719-pandoc-din-5008-letter', '38-46')],
  },
  german: {
    description: 'A German KOMA-Script letter after DIN 5008 (scrlttr2): \\opening{Sehr geehrte Damen und Herren,} and \\closing{Mit freundlichen Grüßen}, the sender and subject as komavars.',
    features: ['class-styled', 'subject-line'],
    params: { opening: 'Sehr geehrte Damen und Herren,', closing: 'Mit freundlichen Grüßen' },
    evidence: [solution('0688-alexeyabel-latex-briefvorlage-din-5008', '34-41'), solution('0402-german-service-invoice', '39-47')],
  },
} as const satisfies { readonly [name: string]: Preset };
