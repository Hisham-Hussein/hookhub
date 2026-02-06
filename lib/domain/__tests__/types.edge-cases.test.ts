import { describe, it, expect } from 'vitest'
import { isValidPurposeCategory, isValidLifecycleEvent, PURPOSE_CATEGORIES, LIFECYCLE_EVENTS } from '../types'

describe('type guard edge cases', () => {
  // Additional input types not yet tested
  it.each([true, false])('isValidPurposeCategory rejects boolean %j', (value) => {
    expect(isValidPurposeCategory(value)).toBe(false)
  })

  it.each([{}, [], () => {}])('isValidPurposeCategory rejects non-primitive %j', (value) => {
    expect(isValidPurposeCategory(value)).toBe(false)
  })

  it.each([true, false])('isValidLifecycleEvent rejects boolean %j', (value) => {
    expect(isValidLifecycleEvent(value)).toBe(false)
  })

  it.each([{}, [], () => {}])('isValidLifecycleEvent rejects non-primitive %j', (value) => {
    expect(isValidLifecycleEvent(value)).toBe(false)
  })

  // Whitespace and lookalike strings
  it('rejects category with leading whitespace', () => {
    expect(isValidPurposeCategory(' Safety')).toBe(false)
  })

  it('rejects category with trailing whitespace', () => {
    expect(isValidPurposeCategory('Safety ')).toBe(false)
  })

  it('rejects event with leading whitespace', () => {
    expect(isValidLifecycleEvent(' PreToolUse')).toBe(false)
  })

  // Verify arrays are truly readonly at runtime (no mutation allowed)
  it('PURPOSE_CATEGORIES array values match type union exactly', () => {
    const expected = ['Safety', 'Automation', 'Notification', 'Formatting', 'Testing', 'Security', 'Logging', 'Custom']
    expect([...PURPOSE_CATEGORIES]).toEqual(expected)
  })

  it('LIFECYCLE_EVENTS array values match type union exactly', () => {
    const expected = ['PreToolUse', 'PostToolUse', 'UserPromptSubmit', 'Notification', 'Stop']
    expect([...LIFECYCLE_EVENTS]).toEqual(expected)
  })

  // No duplicates
  it('PURPOSE_CATEGORIES has no duplicates', () => {
    const unique = new Set(PURPOSE_CATEGORIES)
    expect(unique.size).toBe(PURPOSE_CATEGORIES.length)
  })

  it('LIFECYCLE_EVENTS has no duplicates', () => {
    const unique = new Set(LIFECYCLE_EVENTS)
    expect(unique.size).toBe(LIFECYCLE_EVENTS.length)
  })

  // NaN, Infinity
  it('rejects NaN', () => {
    expect(isValidPurposeCategory(NaN)).toBe(false)
    expect(isValidLifecycleEvent(NaN)).toBe(false)
  })

  it('rejects Infinity', () => {
    expect(isValidPurposeCategory(Infinity)).toBe(false)
    expect(isValidLifecycleEvent(Infinity)).toBe(false)
  })
})
