import { describe, it, expect } from 'vitest'
import type { Hook } from '@/lib/domain/types'

const findAll = (
  element: React.ReactElement,
  predicate: (el: React.ReactElement) => boolean
): React.ReactElement[] => {
  const results: React.ReactElement[] = []

  const walk = (node: unknown): void => {
    if (!node || typeof node !== 'object') return
    if (Array.isArray(node)) {
      node.forEach(walk)
      return
    }

    const el = node as React.ReactElement
    if (!el.props) return

    if (predicate(el)) results.push(el)

    if (el.props.children) walk(el.props.children)
  }

  walk(element)
  return results
}

const makeHooks = (count: number): Hook[] =>
  Array.from({ length: count }, (_, i) => ({
    name: `hook-${i + 1}`,
    githubRepoUrl: `https://github.com/org/hook-${i + 1}`,
    purposeCategory: 'Safety' as const,
    lifecycleEvent: 'PreToolUse' as const,
    description: `Description for hook ${i + 1}.`,
    starsCount: i * 100,
    lastUpdated: '2026-01-01',
  }))

describe('HookGrid edge cases', () => {
  it('renders 0 hooks (empty grid)', async () => {
    const { HookGrid } = await import('../HookGrid')
    const tree = HookGrid({ hooks: [] })

    const uls = findAll(tree, (el) => el.type === 'ul')
    expect(uls[0].props['aria-label']).toBe('0 hooks')

    const lis = findAll(tree, (el) => el.type === 'li')
    expect(lis).toHaveLength(0)
  })

  it('renders 1 hook (single item)', async () => {
    const { HookGrid } = await import('../HookGrid')
    const tree = HookGrid({ hooks: makeHooks(1) })

    const lis = findAll(tree, (el) => el.type === 'li')
    expect(lis).toHaveLength(1)
  })

  it('renders 15 hooks (small catalog)', async () => {
    const { HookGrid } = await import('../HookGrid')
    const tree = HookGrid({ hooks: makeHooks(15) })

    const lis = findAll(tree, (el) => el.type === 'li')
    expect(lis).toHaveLength(15)
  })

  it('renders 25+ hooks (larger catalog)', async () => {
    const { HookGrid } = await import('../HookGrid')
    const tree = HookGrid({ hooks: makeHooks(30) })

    const lis = findAll(tree, (el) => el.type === 'li')
    expect(lis).toHaveLength(30)
  })

  it('each li has list-none class to remove default bullets', async () => {
    const { HookGrid } = await import('../HookGrid')
    const tree = HookGrid({ hooks: makeHooks(3) })

    const lis = findAll(tree, (el) => el.type === 'li')
    for (const li of lis) {
      expect(li.props.className).toContain('list-none')
    }
  })
})
