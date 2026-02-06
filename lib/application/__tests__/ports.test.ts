import { describe, it, expect } from 'vitest'
import type { HookDataSource } from '../ports'
import type { Hook } from '@/lib/domain/types'

describe('HookDataSource port', () => {
  it('is implementable by a mock class', async () => {
    const mockHook: Hook = {
      name: 'test-hook',
      githubRepoUrl: 'https://github.com/owner/repo',
      purposeCategory: 'Safety',
      lifecycleEvent: 'PreToolUse',
      description: 'Test description',
      starsCount: 10,
      lastUpdated: '2026-01-01',
    }

    const mockDataSource: HookDataSource = {
      getAll: async () => [mockHook],
    }

    const result = await mockDataSource.getAll()
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('test-hook')
  })
})
