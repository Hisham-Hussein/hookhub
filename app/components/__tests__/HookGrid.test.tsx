import { describe, it, expect } from 'vitest'
import type { Hook } from '@/lib/domain/types'

/**
 * Helper: recursively search a React element tree for nodes matching a predicate.
 */
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

const mockHooks: Hook[] = [
  {
    name: 'safe-rm',
    githubRepoUrl: 'https://github.com/devtools-org/safe-rm-hook',
    purposeCategory: 'Safety',
    lifecycleEvent: 'PreToolUse',
    description: 'Prevents accidental deletion.',
    starsCount: 1247,
    lastUpdated: '2026-01-28',
  },
  {
    name: 'auto-prettier',
    githubRepoUrl: 'https://github.com/fmt-hooks/auto-prettier',
    purposeCategory: 'Formatting',
    lifecycleEvent: 'PostToolUse',
    description: 'Runs Prettier on modified files.',
    starsCount: 892,
    lastUpdated: '2026-01-15',
  },
  {
    name: 'slack-notify',
    githubRepoUrl: 'https://github.com/notify-hooks/slack-notify',
    purposeCategory: 'Notification',
    lifecycleEvent: 'Stop',
    description: 'Sends a Slack message.',
    starsCount: 456,
    lastUpdated: '2026-01-20',
  },
]

describe('HookGrid', () => {
  it('is a server component (no "use client" directive)', async () => {
    const fs = await import('fs')
    const path = await import('path')
    const filePath = path.resolve(__dirname, '../HookGrid.tsx')
    const source = fs.readFileSync(filePath, 'utf-8')
    expect(source).not.toMatch(/['"]use client['"]/)
  })

  it('renders a section element with aria-label "Hook catalog"', async () => {
    const { HookGrid } = await import('../HookGrid')
    const tree = HookGrid({ hooks: mockHooks })

    expect(tree.type).toBe('section')
    expect(tree.props['aria-label']).toBe('Hook catalog')
  })

  it('renders a ul element for semantic list structure', async () => {
    const { HookGrid } = await import('../HookGrid')
    const tree = HookGrid({ hooks: mockHooks })

    const uls = findAll(tree, (el) => el.type === 'ul')
    expect(uls).toHaveLength(1)
  })

  it('ul has aria-label with hook count', async () => {
    const { HookGrid } = await import('../HookGrid')
    const tree = HookGrid({ hooks: mockHooks })

    const uls = findAll(tree, (el) => el.type === 'ul')
    expect(uls[0].props['aria-label']).toBe('3 hooks')
  })

  it('renders one li per hook', async () => {
    const { HookGrid } = await import('../HookGrid')
    const tree = HookGrid({ hooks: mockHooks })

    const lis = findAll(tree, (el) => el.type === 'li')
    expect(lis).toHaveLength(3)
  })

  it('renders HookCard inside each li', async () => {
    const { HookGrid } = await import('../HookGrid')
    const { HookCard } = await import('../HookCard')
    const tree = HookGrid({ hooks: mockHooks })

    const lis = findAll(tree, (el) => el.type === 'li')
    for (let i = 0; i < lis.length; i++) {
      const cards = findAll(lis[i], (el) => el.type === HookCard)
      expect(cards).toHaveLength(1)
      expect(cards[0].props.hook).toEqual(mockHooks[i])
    }
  })

  it('ul has responsive grid classes: grid-cols-1, sm:grid-cols-2, lg:grid-cols-3, xl:grid-cols-4', async () => {
    const { HookGrid } = await import('../HookGrid')
    const tree = HookGrid({ hooks: mockHooks })

    const uls = findAll(tree, (el) => el.type === 'ul')
    const classes = uls[0].props.className as string

    expect(classes).toContain('grid')
    expect(classes).toContain('grid-cols-1')
    expect(classes).toContain('sm:grid-cols-2')
    expect(classes).toContain('lg:grid-cols-3')
    expect(classes).toContain('xl:grid-cols-4')
  })

  it('ul has gap utility for consistent spacing', async () => {
    const { HookGrid } = await import('../HookGrid')
    const tree = HookGrid({ hooks: mockHooks })

    const uls = findAll(tree, (el) => el.type === 'ul')
    const classes = uls[0].props.className as string
    expect(classes).toMatch(/gap-\d/)
  })

  it('uses hook.githubRepoUrl as key for each li', async () => {
    const { HookGrid } = await import('../HookGrid')
    const tree = HookGrid({ hooks: mockHooks })

    const uls = findAll(tree, (el) => el.type === 'ul')
    const children = uls[0].props.children as React.ReactElement[]

    for (let i = 0; i < children.length; i++) {
      expect(children[i].key).toBe(mockHooks[i].githubRepoUrl)
    }
  })
})
