import { describe, it, expect } from 'vitest'
import { HookCard } from '../HookCard'
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

/** Helper: extract all text content from a React element tree */
const textContent = (node: unknown): string => {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (!node || typeof node !== 'object') return ''
  if (Array.isArray(node)) return node.map(textContent).join('')

  const el = node as React.ReactElement
  if (!el.props) return ''
  return textContent(el.props.children)
}

const mockHook: Hook = {
  name: 'safe-rm',
  githubRepoUrl: 'https://github.com/devtools-org/safe-rm-hook',
  purposeCategory: 'Safety',
  lifecycleEvent: 'PreToolUse',
  description: 'Prevents accidental deletion of critical system files and project directories.',
  starsCount: 1247,
  lastUpdated: '2026-01-28',
}

const mockZeroStarHook: Hook = {
  name: 'snapshot-test-generator',
  githubRepoUrl: 'https://github.com/tdd-hooks/snapshot-test-generator',
  purposeCategory: 'Testing',
  lifecycleEvent: 'PostToolUse',
  description: 'Generates snapshot tests for React components.',
  starsCount: 0,
  lastUpdated: '2026-01-31',
}

describe('HookCard', () => {
  it('is a server component (no "use client" directive)', async () => {
    const fs = await import('fs')
    const path = await import('path')
    const filePath = path.resolve(__dirname, '../HookCard.tsx')
    const source = fs.readFileSync(filePath, 'utf-8')
    expect(source).not.toMatch(/['"]use client['"]/)
  })

  it('renders hook name inside an h3 heading element', () => {
    const tree = HookCard({ hook: mockHook })
    const headings = findAll(tree, (el) => el.type === 'h3')
    expect(headings).toHaveLength(1)
    expect(textContent(headings[0])).toBe('safe-rm')
  })

  it('name is the first text content in DOM order', () => {
    const tree = HookCard({ hook: mockHook })
    const allText = textContent(tree)
    expect(allText.indexOf('safe-rm')).toBe(0)
  })

  it('wraps the card in an article element', () => {
    const tree = HookCard({ hook: mockHook })
    expect(tree.type).toBe('article')
  })

  it('h3 heading uses font-headline class', () => {
    const tree = HookCard({ hook: mockHook })
    const headings = findAll(tree, (el) => el.type === 'h3')
    expect(headings[0].props.className).toContain('font-headline')
  })

  it('h3 heading uses font-light class (300 weight)', () => {
    const tree = HookCard({ hook: mockHook })
    const headings = findAll(tree, (el) => el.type === 'h3')
    expect(headings[0].props.className).toContain('font-light')
  })

  it('hook name is rendered inside an anchor tag within the h3', () => {
    const tree = HookCard({ hook: mockHook })
    const headings = findAll(tree, (el) => el.type === 'h3')
    const anchors = findAll(headings[0], (el) => el.type === 'a')
    expect(anchors).toHaveLength(1)
    expect(textContent(anchors[0])).toBe('safe-rm')
  })

  it('anchor has href matching hook.githubRepoUrl', () => {
    const tree = HookCard({ hook: mockHook })
    const anchors = findAll(tree, (el) => el.type === 'a')
    expect(anchors[0].props.href).toBe('https://github.com/devtools-org/safe-rm-hook')
  })

  it('anchor has target="_blank"', () => {
    const tree = HookCard({ hook: mockHook })
    const anchors = findAll(tree, (el) => el.type === 'a')
    expect(anchors[0].props.target).toBe('_blank')
  })

  it('anchor has rel="noopener noreferrer"', () => {
    const tree = HookCard({ hook: mockHook })
    const anchors = findAll(tree, (el) => el.type === 'a')
    expect(anchors[0].props.rel).toBe('noopener noreferrer')
  })

  it('anchor uses stretched link pattern (after:absolute after:inset-0)', () => {
    const tree = HookCard({ hook: mockHook })
    const anchors = findAll(tree, (el) => el.type === 'a')
    const classes = anchors[0].props.className as string
    expect(classes).toContain('after:absolute')
    expect(classes).toContain('after:inset-0')
  })

  it('article has focus-within ring styling', () => {
    const tree = HookCard({ hook: mockHook })
    const classes = tree.props.className as string
    expect(classes).toContain('focus-within:ring-2')
  })

  it('renders purpose category badge with per-category styling', () => {
    const tree = HookCard({ hook: mockHook })
    const spans = findAll(tree, (el) => el.type === 'span')
    const categoryBadge = spans.find((s) => textContent(s) === 'Safety')
    expect(categoryBadge).toBeDefined()
    const classes = categoryBadge!.props.className as string
    expect(classes).toMatch(/bg-red/)
  })

  it('renders lifecycle event badge with per-event styling from getEventBadgeStyle', () => {
    const tree = HookCard({ hook: mockHook })
    const spans = findAll(tree, (el) => el.type === 'span')
    const eventBadge = spans.find((s) => textContent(s) === 'PreToolUse')
    expect(eventBadge).toBeDefined()
    const classes = eventBadge!.props.className as string
    // Per-event color from domain (PreToolUse = indigo)
    expect(classes).toMatch(/bg-indigo/)
    expect(classes).toContain('italic')
  })

  it('event badge uses different colors for different events', () => {
    const postToolHook: Hook = { ...mockHook, lifecycleEvent: 'PostToolUse' }
    const preTree = HookCard({ hook: mockHook })
    const postTree = HookCard({ hook: postToolHook })

    const getEventBadgeClasses = (tree: React.ReactElement, label: string) => {
      const spans = findAll(tree, (el) => el.type === 'span')
      return spans.find((s) => textContent(s) === label)?.props.className as string
    }

    const preClasses = getEventBadgeClasses(preTree, 'PreToolUse')
    const postClasses = getEventBadgeClasses(postTree, 'PostToolUse')
    expect(preClasses).not.toBe(postClasses)
  })

  it('renders description with line-clamp-2', () => {
    const tree = HookCard({ hook: mockHook })
    const paragraphs = findAll(tree, (el) => el.type === 'p')
    expect(paragraphs).toHaveLength(1)
    expect(textContent(paragraphs[0])).toBe(mockHook.description)
    expect(paragraphs[0].props.className).toContain('line-clamp-2')
  })

  it('renders star count with star icon', () => {
    const tree = HookCard({ hook: mockHook })
    const svgs = findAll(tree, (el) => el.type === 'svg')
    // At least one SVG should be the star icon
    expect(svgs.length).toBeGreaterThanOrEqual(1)
    // Star count text "1.2k" should appear somewhere
    const allText = textContent(tree)
    expect(allText).toContain('1.2k')
  })

  it('star count has aria-label with full number', () => {
    const tree = HookCard({ hook: mockHook })
    const spans = findAll(tree, (el) => el.type === 'span')
    const starSpan = spans.find((s) => s.props['aria-label']?.includes('GitHub stars'))
    expect(starSpan).toBeDefined()
    expect(starSpan!.props['aria-label']).toBe('1,247 GitHub stars')
  })

  it('renders "GitHub" text with external link arrow icon', () => {
    const tree = HookCard({ hook: mockHook })
    const allText = textContent(tree)
    expect(allText).toContain('GitHub')
  })

  it('zero stars hook displays "0"', () => {
    const tree = HookCard({ hook: mockZeroStarHook })
    const allText = textContent(tree)
    expect(allText).toContain('0')
  })

  it('zero stars hook has correct aria-label', () => {
    const tree = HookCard({ hook: mockZeroStarHook })
    const spans = findAll(tree, (el) => el.type === 'span')
    const starSpan = spans.find((s) => s.props['aria-label']?.includes('GitHub stars'))
    expect(starSpan).toBeDefined()
    expect(starSpan!.props['aria-label']).toBe('0 GitHub stars')
  })

  it('imports formatStarsCount from domain layer (not inline)', async () => {
    const fs = await import('fs')
    const path = await import('path')
    const filePath = path.resolve(__dirname, '../HookCard.tsx')
    const source = fs.readFileSync(filePath, 'utf-8')
    expect(source).toContain("from '@/lib/domain/format'")
    // Should NOT contain inline formatStars function
    expect(source).not.toMatch(/const formatStars\s*=/)
  })

  it('imports StarIcon component (not inline SVG for star)', async () => {
    const fs = await import('fs')
    const path = await import('path')
    const filePath = path.resolve(__dirname, '../HookCard.tsx')
    const source = fs.readFileSync(filePath, 'utf-8')
    expect(source).toContain("from '@/app/components/StarIcon'")
  })

  it('category and event badges have relative z-10 (clickable above stretched link)', () => {
    const tree = HookCard({ hook: mockHook })
    const spans = findAll(tree, (el) => el.type === 'span')
    const categoryBadge = spans.find((s) => textContent(s) === 'Safety')
    const eventBadge = spans.find((s) => textContent(s) === 'PreToolUse')
    expect(categoryBadge!.props.className).toContain('z-10')
    expect(eventBadge!.props.className).toContain('z-10')
  })
})
