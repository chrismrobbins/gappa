import { describe, expect, it } from 'vitest'
import { addDays, dateKey, daysBetween } from '../src/lib/dates'

describe('dates', () => {
  it('formats a local date key', () => {
    expect(dateKey(new Date(2026, 0, 5, 23, 30).getTime())).toBe('2026-01-05')
  })
  it('adds days across month, year and leap boundaries', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01')
    expect(addDays('2025-12-31', 1)).toBe('2026-01-01')
    expect(addDays('2024-02-28', 1)).toBe('2024-02-29')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
  })
  it('counts whole days between keys', () => {
    expect(daysBetween('2026-03-01', '2026-03-05')).toBe(4)
    expect(daysBetween('2026-03-05', '2026-03-01')).toBe(-4)
    expect(daysBetween('2026-03-07', '2026-03-07')).toBe(0)
  })
})
