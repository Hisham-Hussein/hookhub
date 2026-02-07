import { describe, it, expect } from 'vitest'
import { EVENTS } from '../events'
import { LIFECYCLE_EVENTS } from '../types'

describe('EVENTS', () => {
  it('contains exactly 5 entries', () => {
    expect(EVENTS).toHaveLength(5)
  })

  it('each entry.value is a valid LifecycleEvent', () => {
    const validValues: readonly string[] = LIFECYCLE_EVENTS
    for (const entry of EVENTS) {
      expect(validValues).toContain(entry.value)
    }
  })

  it('each entry.label is a non-empty string', () => {
    for (const entry of EVENTS) {
      expect(typeof entry.label).toBe('string')
      expect(entry.label.length).toBeGreaterThan(0)
    }
  })

  it('contains no duplicate values', () => {
    const values = EVENTS.map((e) => e.value)
    expect(new Set(values).size).toBe(values.length)
  })

  it('covers all LifecycleEvent values', () => {
    const values = EVENTS.map((e) => e.value)
    for (const evt of LIFECYCLE_EVENTS) {
      expect(values).toContain(evt)
    }
  })
})
