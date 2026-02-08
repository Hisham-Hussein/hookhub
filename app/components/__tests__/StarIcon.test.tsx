import { describe, it, expect } from 'vitest'
import { StarIcon } from '../StarIcon'

/** Helper: recursively search a React element tree */
const findAll = (
  element: React.ReactElement,
  predicate: (el: React.ReactElement) => boolean
): React.ReactElement[] => {
  const results: React.ReactElement[] = []
  const walk = (node: unknown): void => {
    if (!node || typeof node !== 'object') return
    if (Array.isArray(node)) { node.forEach(walk); return }
    const el = node as React.ReactElement
    if (!el.props) return
    if (predicate(el)) results.push(el)
    if (el.props.children) walk(el.props.children)
  }
  walk(element)
  return results
}

describe('StarIcon', () => {
  it('renders an SVG element', () => {
    const tree = StarIcon({})
    expect(tree.type).toBe('svg')
  })

  it('SVG contains a path element (star shape)', () => {
    const tree = StarIcon({})
    const paths = findAll(tree, (el) => el.type === 'path')
    expect(paths.length).toBeGreaterThanOrEqual(1)
  })

  it('applies default sizing class', () => {
    const tree = StarIcon({})
    const classes = tree.props.className as string
    expect(classes).toContain('w-3.5')
    expect(classes).toContain('h-3.5')
  })

  it('accepts and applies custom className', () => {
    const tree = StarIcon({ className: 'w-5 h-5 text-yellow-400' })
    const classes = tree.props.className as string
    expect(classes).toContain('w-5')
    expect(classes).toContain('text-yellow-400')
  })

  it('is hidden from screen readers', () => {
    const tree = StarIcon({})
    expect(tree.props['aria-hidden']).toBe('true')
  })
})
