// Stable file key for a recorded line. Shared by the recording script and the player.

/** Canonical form of a line before hashing (keeps punctuation: it changes intonation). */
export function canonicalLine(text: string): string {
  return text.normalize('NFC').trim().replace(/\s+/g, ' ')
}

/** 32-bit FNV-1a hash of the canonical line, as 8 hex chars. */
export function audioKey(text: string): string {
  let hash = 0x811c9dc5
  for (const byte of new TextEncoder().encode(canonicalLine(text))) {
    hash ^= byte
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}
