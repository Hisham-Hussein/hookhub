import { describe, it, expect } from 'vitest'
import type { HookDataSource } from '@/lib/application/ports'
import type { Hook } from '@/lib/domain/types'
import { PURPOSE_CATEGORIES, LIFECYCLE_EVENTS } from '@/lib/domain/types'

/**
 * Contract test suite for HookDataSource implementations.
 *
 * Any class/object implementing HookDataSource must pass these tests.
 * This documents the behavioral contract beyond what TypeScript types express.
 */
describe('HookDataSource contract', () => {
  // Factory function creates a valid mock implementation
  const createMockDataSource = (hooks: Hook[]): HookDataSource => ({
    getAll: async () => hooks,
  })

  const sampleHook: Hook = {
    name: 'test-hook',
    githubRepoUrl: 'https://github.com/owner/repo',
    purposeCategory: 'Safety',
    lifecycleEvent: 'PreToolUse',
    description: 'A test hook',
    starsCount: 42,
    lastUpdated: '2026-01-01',
  }

  it('getAll returns a Promise', () => {
    const ds = createMockDataSource([sampleHook])
    const result = ds.getAll()
    expect(result).toBeInstanceOf(Promise)
  })

  it('getAll resolves to an array', async () => {
    const ds = createMockDataSource([sampleHook])
    const result = await ds.getAll()
    expect(Array.isArray(result)).toBe(true)
  })

  it('getAll can return empty array', async () => {
    const ds = createMockDataSource([])
    const result = await ds.getAll()
    expect(result).toEqual([])
  })

  it('returned hooks have all required fields', async () => {
    const ds = createMockDataSource([sampleHook])
    const hooks = await ds.getAll()

    for (const hook of hooks) {
      expect(hook).toHaveProperty('name')
      expect(hook).toHaveProperty('githubRepoUrl')
      expect(hook).toHaveProperty('purposeCategory')
      expect(hook).toHaveProperty('lifecycleEvent')
      expect(hook).toHaveProperty('description')
      expect(hook).toHaveProperty('starsCount')
      expect(hook).toHaveProperty('lastUpdated')
    }
  })

  it('returned hooks have correct field types', async () => {
    const ds = createMockDataSource([sampleHook])
    const hooks = await ds.getAll()

    for (const hook of hooks) {
      expect(typeof hook.name).toBe('string')
      expect(typeof hook.githubRepoUrl).toBe('string')
      expect(typeof hook.purposeCategory).toBe('string')
      expect(typeof hook.lifecycleEvent).toBe('string')
      expect(typeof hook.description).toBe('string')
      expect(typeof hook.starsCount).toBe('number')
      expect(typeof hook.lastUpdated).toBe('string')
    }
  })

  it('returned hooks have valid enum values', async () => {
    const ds = createMockDataSource([sampleHook])
    const hooks = await ds.getAll()

    for (const hook of hooks) {
      expect(PURPOSE_CATEGORIES).toContain(hook.purposeCategory)
      expect(LIFECYCLE_EVENTS).toContain(hook.lifecycleEvent)
    }
  })

  it('getAll is idempotent (multiple calls return same data)', async () => {
    const ds = createMockDataSource([sampleHook])
    const first = await ds.getAll()
    const second = await ds.getAll()
    expect(first).toEqual(second)
  })
})
