import { describe, it, expect } from 'vitest'
import { HookCard } from '../HookCard'
import { StarIcon } from '@/app/components/StarIcon'
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

const baseHook: Hook = {
  name: 'safe-rm',
  githubRepoUrl: 'https://github.com/devtools-org/safe-rm-hook',
  purposeCategory: 'Safety',
  lifecycleEvent: 'PreToolUse',
  description: 'Prevents accidental deletion of critical system files.',
  starsCount: 1247,
  lastUpdated: '2026-01-28',
}

describe('HookCard Edge Cases', () => {
  // ─── 1. Star Count Formatting ─────────────────────────────────────

  describe('Star Count Formatting', () => {
    const starCases: Array<[number, string]> = [
      [0, '0'],
      [89, '89'],
      [178, '178'],
      [415, '415'],
      [892, '892'],
      [999, '999'],
      [1000, '1k'],
      [1247, '1.2k'],
      [1502, '1.5k'],
      [2103, '2.1k'],
      [3451, '3.5k'],
      [10000, '10k'],
      [12345, '12.3k'],
    ]

    starCases.forEach(([input, expected]) => {
      it(`formats ${input} stars as "${expected}"`, () => {
        const hook = { ...baseHook, starsCount: input }
        const tree = HookCard({ hook })
        const allText = textContent(tree)
        expect(allText).toContain(expected)
      })
    })

    const ariaLabelCases: Array<[number, string]> = [
      [0, '0 GitHub stars'],
      [1247, '1,247 GitHub stars'],
      [3451, '3,451 GitHub stars'],
    ]

    ariaLabelCases.forEach(([input, expected]) => {
      it(`aria-label for ${input} stars is "${expected}"`, () => {
        const hook = { ...baseHook, starsCount: input }
        const tree = HookCard({ hook })
        const spans = findAll(tree, (el) => el.type === 'span')
        const starSpan = spans.find((s) => s.props['aria-label']?.includes('GitHub stars'))
        expect(starSpan!.props['aria-label']).toBe(expected)
      })
    })
  })

  // ─── 2. Long Name Handling ────────────────────────────────────────

  describe('Long Name Handling', () => {
    it('very long name does not break card structure (article still renders)', () => {
      const hook = {
        ...baseHook,
        name: 'input-sanitizer-and-prompt-validation-middleware',
      }
      const tree = HookCard({ hook })
      expect(tree.type).toBe('article')
      const headings = findAll(tree, (el) => el.type === 'h3')
      expect(headings).toHaveLength(1)
    })

    it('truncate class is present on the anchor for long name overflow', () => {
      const hook = {
        ...baseHook,
        name: 'input-sanitizer-and-prompt-validation-middleware',
      }
      const tree = HookCard({ hook })
      const anchors = findAll(tree, (el) => el.type === 'a')
      expect(anchors[0].props.className).toContain('truncate')
    })
  })

  // ─── 3. All Category Variants ─────────────────────────────────────

  describe('All Category Variants', () => {
    const categories = [
      'Safety', 'Automation', 'Notification', 'Formatting',
      'Testing', 'Security', 'Logging', 'Custom',
    ] as const

    categories.forEach((category) => {
      it(`renders "${category}" category badge`, () => {
        const hook = { ...baseHook, purposeCategory: category }
        const tree = HookCard({ hook })
        const spans = findAll(tree, (el) => el.type === 'span')
        const badge = spans.find((s) => textContent(s) === category)
        expect(badge).toBeDefined()
      })
    })
  })

  // ─── 4. All Event Variants ────────────────────────────────────────

  describe('All Event Variants', () => {
    const events = [
      'PreToolUse', 'PostToolUse', 'UserPromptSubmit', 'Notification', 'Stop',
    ] as const

    events.forEach((event) => {
      it(`renders "${event}" lifecycle event badge`, () => {
        const hook = { ...baseHook, lifecycleEvent: event }
        const tree = HookCard({ hook })
        const spans = findAll(tree, (el) => el.type === 'span')
        const badge = spans.find((s) => textContent(s) === event)
        expect(badge).toBeDefined()
      })
    })
  })

  // ─── 5. Description Edge Cases ────────────────────────────────────

  describe('Description Edge Cases', () => {
    it('empty description renders empty paragraph', () => {
      const hook = { ...baseHook, description: '' }
      const tree = HookCard({ hook })
      const paragraphs = findAll(tree, (el) => el.type === 'p')
      expect(paragraphs).toHaveLength(1)
      expect(textContent(paragraphs[0])).toBe('')
    })

    it('very long description still has line-clamp-2 class', () => {
      const hook = { ...baseHook, description: 'A'.repeat(1000) }
      const tree = HookCard({ hook })
      const paragraphs = findAll(tree, (el) => el.type === 'p')
      expect(paragraphs[0].props.className).toContain('line-clamp-2')
    })
  })

  // ─── 6. Component Structure ───────────────────────────────────────

  describe('Component Structure', () => {
    it('card has exactly one h3 heading', () => {
      const tree = HookCard({ hook: baseHook })
      const headings = findAll(tree, (el) => el.type === 'h3')
      expect(headings).toHaveLength(1)
    })

    it('card has exactly one anchor element', () => {
      const tree = HookCard({ hook: baseHook })
      const anchors = findAll(tree, (el) => el.type === 'a')
      expect(anchors).toHaveLength(1)
    })

    it('card has exactly one paragraph element', () => {
      const tree = HookCard({ hook: baseHook })
      const paragraphs = findAll(tree, (el) => el.type === 'p')
      expect(paragraphs).toHaveLength(1)
    })

    it('card has exactly two badge spans with z-10', () => {
      const tree = HookCard({ hook: baseHook })
      const spans = findAll(tree, (el) => {
        const cls = el.props?.className
        return el.type === 'span' && typeof cls === 'string' && cls.includes('z-10') && cls.includes('rounded')
      })
      expect(spans).toHaveLength(2)
    })

    it('star icon uses StarIcon component (aria-hidden verified in StarIcon tests)', () => {
      const tree = HookCard({ hook: baseHook })
      const starIcons = findAll(tree, (el) => el.type === StarIcon)
      expect(starIcons).toHaveLength(1)
    })

    it('external link arrow SVG has aria-hidden="true"', () => {
      const tree = HookCard({ hook: baseHook })
      const svgs = findAll(tree, (el) => el.type === 'svg')
      const arrowSvg = svgs.find((s) => s.props.fill === 'none')
      expect(arrowSvg).toBeDefined()
      expect(arrowSvg!.props['aria-hidden']).toBe('true')
    })

    it('each hook card links to its own unique repo URL', () => {
      const hook1 = { ...baseHook, name: 'hook-a', githubRepoUrl: 'https://github.com/a/a' }
      const hook2 = { ...baseHook, name: 'hook-b', githubRepoUrl: 'https://github.com/b/b' }
      const tree1 = HookCard({ hook: hook1 })
      const tree2 = HookCard({ hook: hook2 })
      const anchors1 = findAll(tree1, (el) => el.type === 'a')
      const anchors2 = findAll(tree2, (el) => el.type === 'a')
      expect(anchors1[0].props.href).toBe('https://github.com/a/a')
      expect(anchors2[0].props.href).toBe('https://github.com/b/b')
    })
  })
})
