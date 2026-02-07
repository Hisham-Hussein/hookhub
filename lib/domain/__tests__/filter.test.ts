import { describe, it, expect } from 'vitest'
import { filterHooks } from '../filter'
import type { FilterState } from '../filter'
import type { Hook } from '../types'

const makeHook = (overrides: Partial<Hook> = {}): Hook => ({
  name: 'test-hook',
  githubRepoUrl: 'https://github.com/test/hook',
  purposeCategory: 'Safety',
  lifecycleEvent: 'PreToolUse',
  description: 'A test hook.',
  starsCount: 100,
  lastUpdated: '2026-01-01',
  ...overrides,
})

const hooks: Hook[] = [
  makeHook({ name: 'safe-rm', purposeCategory: 'Safety', lifecycleEvent: 'PreToolUse' }),
  makeHook({ name: 'auto-prettier', purposeCategory: 'Formatting', lifecycleEvent: 'PostToolUse' }),
  makeHook({ name: 'secret-scanner', purposeCategory: 'Security', lifecycleEvent: 'PreToolUse' }),
  makeHook({ name: 'test-on-save', purposeCategory: 'Testing', lifecycleEvent: 'PostToolUse' }),
  makeHook({ name: 'prompt-guard', purposeCategory: 'Safety', lifecycleEvent: 'UserPromptSubmit' }),
]

describe('filterHooks', () => {
  it('returns all hooks when both filters are null', () => {
    const state: FilterState = { category: null, event: null }
    const result = filterHooks(hooks, state)
    expect(result).toHaveLength(5)
  })

  it('filters by category only when event is null', () => {
    const state: FilterState = { category: 'Safety', event: null }
    const result = filterHooks(hooks, state)
    expect(result).toHaveLength(2)
    expect(result.every((h) => h.purposeCategory === 'Safety')).toBe(true)
  })

  it('filters by event only when category is null', () => {
    const state: FilterState = { category: null, event: 'PreToolUse' }
    const result = filterHooks(hooks, state)
    expect(result).toHaveLength(2)
    expect(result.every((h) => h.lifecycleEvent === 'PreToolUse')).toBe(true)
  })

  it('filters by both category AND event (intersection)', () => {
    const state: FilterState = { category: 'Safety', event: 'PreToolUse' }
    const result = filterHooks(hooks, state)
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('safe-rm')
  })

  it('returns empty array when no matches', () => {
    const state: FilterState = { category: 'Safety', event: 'PostToolUse' }
    const result = filterHooks(hooks, state)
    expect(result).toHaveLength(0)
  })

  it('does not mutate the input array', () => {
    const original = [...hooks]
    const state: FilterState = { category: 'Safety', event: null }
    filterHooks(hooks, state)
    expect(hooks).toEqual(original)
  })
})
