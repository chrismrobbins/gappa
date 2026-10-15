export interface RichPart { text: string; bold: boolean }

/** Splits `**bold**` markup into parts; the result is rendered as text, never as HTML. */
export function parseRich(source: string): RichPart[] {
  return source
    .split('**')
    .map((text, i) => ({ text, bold: i % 2 === 1 }))
    .filter((part) => part.text !== '')
}
