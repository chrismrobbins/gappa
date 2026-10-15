const HERO_MAX_CHARS = 14

/** Short words get the hero size; whole phrases would wrap into a wall, so they stay at the normal size. */
export function nativeSize(text: string): string {
  return text.length <= HERO_MAX_CHARS ? 'native-hero' : ''
}
