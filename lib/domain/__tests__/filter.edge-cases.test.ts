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

describe('filterHooks — edge cases', () => {
  it('returns empty array when input is empty', () => {
    const state: FilterState = { category: null, event: null }
    expect(filterHooks([], state)).toEqual([])
  })

  it('returns empty array when filtering empty input by category', () => {
    const state: FilterState = { category: 'Safety', event: null }
    expect(filterHooks([], state)).toEqual([])
  })

  it('works with a single-element array that matches', () => {
    const hooks = [makeHook({ purposeCategory: 'Testing' })]
    const state: FilterState = { category: 'Testing', event: null }
    expect(filterHooks(hooks, state)).toHaveLength(1)
  })

  it('works with a single-element array that does not match', () => {
    const hooks = [makeHook({ purposeCategory: 'Testing' })]
    const state: FilterState = { category: 'Safety', event: null }
    expect(filterHooks(hooks, state)).toHaveLength(0)
  })

  it('returns all hooks when all share the same filtered category', () => {
    const hooks = [
      makeHook({ name: 'a', purposeCategory: 'Logging' }),
      makeHook({ name: 'b', purposeCategory: 'Logging' }),
      makeHook({ name: 'c', purposeCategory: 'Logging' }),
    ]
    const state: FilterState = { category: 'Logging', event: null }
    expect(filterHooks(hooks, state)).toHaveLength(3)
  })

  it('filters by category alone when no hooks match that category', () => {
    const hooks = [
      makeHook({ purposeCategory: 'Safety' }),
      makeHook({ purposeCategory: 'Testing' }),
    ]
    const state: FilterState = { category: 'Custom', event: null }
    expect(filterHooks(hooks, state)).toHaveLength(0)
  })

  it('preserves original order of filtered results', () => {
    const hooks = [
      makeHook({ name: 'first', purposeCategory: 'Safety' }),
      makeHook({ name: 'skip', purposeCategory: 'Testing' }),
      makeHook({ name: 'last', purposeCategory: 'Safety' }),
    ]
    const state: FilterState = { category: 'Safety', event: null }
    const result = filterHooks(hooks, state)
    expect(result.map((h) => h.name)).toEqual(['first', 'last'])
  })

  it('returns a new array reference (not the same object)', () => {
    const hooks = [makeHook()]
    const state: FilterState = { category: null, event: null }
    const result = filterHooks(hooks, state)
    expect(result).not.toBe(hooks)
    expect(result).toEqual(hooks)
  })
})
