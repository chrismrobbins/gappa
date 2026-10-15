// Text normalization and comparison shared by grading, audio keys and tests.

const PUNCTUATION = /[.,!?।॥;:"“”'‘’()…\-–—]/g

/** Lowercase, strip punctuation, collapse whitespace. */
export function normalize(text: string): string {
  return text.normalize('NFC').toLowerCase().replace(PUNCTUATION, ' ').replace(/\s+/g, ' ').trim()
}

export function tokens(text: string): string[] {
  const clean = normalize(text)
  return clean ? clean.split(' ') : []
}

/** Display tokens: split on spaces, keep punctuation (for tiles and word-by-word romanization). */
export function displayTokens(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean)
}

export function levenshtein(a: string, b: string): number {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0]
    prev[0] = i
    for (let j = 1; j <= b.length; j++) {
      const above = prev[j]
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1))
      diag = above
    }
  }
  return prev[b.length]
}

/** 0–1 similarity of two strings after normalization, ignoring spaces. */
export function similarity(a: string, b: string): number {
  const x = normalize(a).replace(/ /g, '')
  const y = normalize(b).replace(/ /g, '')
  const longest = Math.max(x.length, y.length)
  return longest === 0 ? 1 : 1 - levenshtein(x, y) / longest
}
