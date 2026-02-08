import { describe, it, expect } from 'vitest'
import { EVENTS, getEventBadgeStyle } from '../events'
import { LIFECYCLE_EVENTS } from '../types'
import { CATEGORIES } from '../categories'

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

describe('EVENTS badge metadata', () => {
  it('all 5 events have non-empty badgeColor', () => {
    for (const evt of EVENTS) {
      expect(evt.badgeColor, `${evt.value} missing badgeColor`).toBeTruthy()
    }
  })

  it('all 5 events have non-empty textColor', () => {
    for (const evt of EVENTS) {
      expect(evt.textColor, `${evt.value} missing textColor`).toBeTruthy()
    }
  })

  it('no two events share the same badgeColor', () => {
    const colors = EVENTS.map((e) => e.badgeColor)
    expect(new Set(colors).size).toBe(EVENTS.length)
  })

  it('event badge colors differ from all category badge colors', () => {
    const categoryColors = CATEGORIES.map((c) => c.badgeColor)
    for (const evt of EVENTS) {
      expect(categoryColors).not.toContain(evt.badgeColor)
    }
  })
})

describe('getEventBadgeStyle', () => {
  it('returns badgeColor and textColor for each event', () => {
    for (const evt of LIFECYCLE_EVENTS) {
      const style = getEventBadgeStyle(evt)
      expect(style.badgeColor).toBeTruthy()
      expect(style.textColor).toBeTruthy()
    }
  })

  it('returns Tailwind bg- classes with dark mode variants', () => {
    for (const evt of LIFECYCLE_EVENTS) {
      const style = getEventBadgeStyle(evt)
      expect(style.badgeColor).toMatch(/^bg-/)
      expect(style.badgeColor).toContain('dark:')
      expect(style.textColor).toMatch(/^text-/)
      expect(style.textColor).toContain('dark:')
    }
  })

  it('returns the correct style for PreToolUse', () => {
    const style = getEventBadgeStyle('PreToolUse')
    expect(style.badgeColor).toContain('bg-indigo')
    expect(style.textColor).toContain('text-indigo')
  })

  it('returns different styles for different events', () => {
    const pre = getEventBadgeStyle('PreToolUse')
    const post = getEventBadgeStyle('PostToolUse')
    expect(pre.badgeColor).not.toBe(post.badgeColor)
  })

  it('returns fallback style for unknown event value', () => {
    const style = getEventBadgeStyle('Unknown' as any)
    expect(style.badgeColor).toBeTruthy()
    expect(style.textColor).toBeTruthy()
  })
})
