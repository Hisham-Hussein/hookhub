import { describe, it, expect } from 'vitest'
import { CATEGORIES } from '../categories'
import { PURPOSE_CATEGORIES } from '../types'

describe('CATEGORIES', () => {
  it('contains exactly 8 entries', () => {
    expect(CATEGORIES).toHaveLength(8)
  })

  it('each entry.value is a valid PurposeCategory', () => {
    const validValues: readonly string[] = PURPOSE_CATEGORIES
    for (const entry of CATEGORIES) {
      expect(validValues).toContain(entry.value)
    }
  })

  it('each entry.label is a non-empty string', () => {
    for (const entry of CATEGORIES) {
      expect(typeof entry.label).toBe('string')
      expect(entry.label.length).toBeGreaterThan(0)
    }
  })

  it('contains no duplicate values', () => {
    const values = CATEGORIES.map((c) => c.value)
    expect(new Set(values).size).toBe(values.length)
  })

  it('covers all PurposeCategory values', () => {
    const values = CATEGORIES.map((c) => c.value)
    for (const cat of PURPOSE_CATEGORIES) {
      expect(values).toContain(cat)
    }
  })
})
