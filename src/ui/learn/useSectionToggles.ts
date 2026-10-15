import { useState } from 'react'
import { isSectionOpen, loadOverrides, saveOverrides, type SectionOverrides } from './sectionOpen'
import type { Section } from './sections'

/** Open/closed state of Learn sections, remembered on this device. */
export function useSectionToggles(currentId: string | null) {
  const [overrides, setOverrides] = useState<SectionOverrides>(loadOverrides)
  const isOpen = (s: Section) => isSectionOpen(s, currentId, overrides)
  const toggle = (s: Section) => {
    const next = { ...overrides, [s.id]: !isOpen(s) }
    saveOverrides(next)
    setOverrides(next)
  }
  return { isOpen, toggle }
}
