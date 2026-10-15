import type { Section } from './sections'

export type SectionOverrides = Record<string, boolean>

const STORAGE_KEY = 'gappa.sections.v1'

/** By default only the section holding the next lesson is open. */
export function defaultOpen(section: Section, currentId: string | null): boolean {
  return section.nodes.some((n) => n.id === currentId)
}

/** The learner's own choice wins over the default. */
export function isSectionOpen(section: Section, currentId: string | null, overrides: SectionOverrides): boolean {
  return overrides[section.id] ?? defaultOpen(section, currentId)
}

/** Per-device convenience only: any storage failure just falls back to the defaults. */
export function loadOverrides(): SectionOverrides {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SectionOverrides) : {}
  } catch {
    return {}
  }
}

export function saveOverrides(overrides: SectionOverrides): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
  } catch {
    // Private mode or blocked storage: the toggle still works for this visit.
  }
}
