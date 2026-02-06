import { describe, it, expect } from 'vitest'
import {
  isValidPurposeCategory,
  isValidLifecycleEvent,
  PURPOSE_CATEGORIES,
  LIFECYCLE_EVENTS,
} from '../types'
import type { Hook, ManifestEntry, PurposeCategory, LifecycleEvent } from '../types'

describe('PurposeCategory', () => {
  it('has exactly 8 valid values', () => {
    expect(PURPOSE_CATEGORIES).toHaveLength(8)
  })

  it.each([
    'Safety', 'Automation', 'Notification', 'Formatting',
    'Testing', 'Security', 'Logging', 'Custom',
  ])('isValidPurposeCategory accepts "%s"', (value) => {
    expect(isValidPurposeCategory(value)).toBe(true)
  })

  it.each(['Unknown', '', 'safety', 'SAFETY', 123, null, undefined])(
    'isValidPurposeCategory rejects %j',
    (value) => {
      expect(isValidPurposeCategory(value)).toBe(false)
    },
  )
})

describe('LifecycleEvent', () => {
  it('has exactly 5 valid values', () => {
    expect(LIFECYCLE_EVENTS).toHaveLength(5)
  })

  it.each([
    'PreToolUse', 'PostToolUse', 'UserPromptSubmit', 'Notification', 'Stop',
  ])('isValidLifecycleEvent accepts "%s"', (value) => {
    expect(isValidLifecycleEvent(value)).toBe(true)
  })

  it.each(['Unknown', '', 'pretooluse', 123, null, undefined])(
    'isValidLifecycleEvent rejects %j',
    (value) => {
      expect(isValidLifecycleEvent(value)).toBe(false)
    },
  )
})

describe('ManifestEntry type', () => {
  it('ManifestEntry fields are a subset of Hook fields', () => {
    const hook: Hook = {
      name: 'test',
      githubRepoUrl: 'https://github.com/owner/repo',
      purposeCategory: 'Safety',
      lifecycleEvent: 'PreToolUse',
      description: 'A test hook',
      starsCount: 42,
      lastUpdated: '2026-01-01',
    }
    const entry: ManifestEntry = {
      name: hook.name,
      githubRepoUrl: hook.githubRepoUrl,
      purposeCategory: hook.purposeCategory,
      lifecycleEvent: hook.lifecycleEvent,
    }
    expect(entry.name).toBe(hook.name)
    expect(entry.githubRepoUrl).toBe(hook.githubRepoUrl)
  })
})
