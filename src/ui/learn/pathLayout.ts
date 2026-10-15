const AMPLITUDE_PX = 70
const FLOWER_EVERY = 3
const FLOWER_GAP_PX = 110

/** Horizontal offset of the nth node: a gentle serpentine (sine wave, six nodes per period). */
export function pathShift(index: number): number {
  return Math.round(Math.sin((index * Math.PI) / 3) * AMPLITUDE_PX)
}

/** Offset of a decorative flower beside the nth node (opposite side of the bend), or null for no flower. */
export function flowerOffset(index: number): number | null {
  if (index % FLOWER_EVERY !== 1) return null
  return pathShift(index) > 0 ? -FLOWER_GAP_PX : FLOWER_GAP_PX
}
