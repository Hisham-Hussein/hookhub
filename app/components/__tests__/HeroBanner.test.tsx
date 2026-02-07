import { describe, it, expect } from 'vitest'
import { HeroBanner } from '../HeroBanner'

/**
 * Helper: recursively search a React element tree for nodes matching a predicate.
 * React elements have { type, props: { children, ...rest } }.
 * `children` can be a string, element, or array.
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

describe('HeroBanner', () => {
  it('is a server component (no "use client" directive)', async () => {
    const fs = await import('fs')
    const path = await import('path')
    const filePath = path.resolve(__dirname, '../HeroBanner.tsx')
    const source = fs.readFileSync(filePath, 'utf-8')
    expect(source).not.toMatch(/['"]use client['"]/)
  })

  it('renders an h1 heading with site purpose text', () => {
    const tree = HeroBanner()
    const headings = findAll(tree, (el) => el.type === 'h1')
    expect(headings).toHaveLength(1)

    const headingText = textContent(headings[0])
    expect(headingText.toLowerCase()).toContain('claude code hooks')
  })

  it('renders a supporting description paragraph', () => {
    const tree = HeroBanner()
    const paragraphs = findAll(tree, (el) => el.type === 'p')
    expect(paragraphs.length).toBeGreaterThanOrEqual(1)

    const allText = paragraphs.map(textContent).join(' ').toLowerCase()
    expect(allText).toContain('directory')
  })

  it('renders a section with aria-labelledby pointing to heading', () => {
    const tree = HeroBanner()
    const sections = findAll(tree, (el) => el.type === 'section')
    expect(sections.length).toBeGreaterThanOrEqual(1)

    const section = sections[0]
    expect(section.props['aria-labelledby']).toBe('hero-heading')

    const headings = findAll(tree, (el) => el.type === 'h1')
    expect(headings[0].props.id).toBe('hero-heading')
  })

  it('renders a visual scroll cue element (downward chevron)', () => {
    const tree = HeroBanner()
    const svgs = findAll(tree, (el) => el.type === 'svg')
    expect(svgs.length).toBeGreaterThanOrEqual(1)

    // The scroll cue container should be aria-hidden
    const ariaHiddenDivs = findAll(
      tree,
      (el) =>
        (el.type === 'div' || el.type === 'span') &&
        el.props['aria-hidden'] === 'true' &&
        findAll(el, (child) => child.type === 'svg').length > 0
    )
    expect(ariaHiddenDivs.length).toBeGreaterThanOrEqual(1)
  })

  it('renders a skip link targeting #main-content', () => {
    const tree = HeroBanner()
    const links = findAll(
      tree,
      (el) => el.type === 'a' && el.props.href === '#main-content'
    )
    expect(links).toHaveLength(1)
    expect(textContent(links[0]).toLowerCase()).toContain('skip')
  })

  it('uses responsive Tailwind classes for different viewports', () => {
    const tree = HeroBanner()
    const sections = findAll(tree, (el) => el.type === 'section')
    const sectionClasses: string = sections[0]?.props?.className ?? ''

    // Should have at least one sm: or lg: responsive prefix
    expect(sectionClasses).toMatch(/\b(sm|md|lg):/i)
  })

  it('uses font-headline class on the heading', () => {
    const tree = HeroBanner()
    const headings = findAll(tree, (el) => el.type === 'h1')
    const headingClasses: string = headings[0]?.props?.className ?? ''
    expect(headingClasses).toContain('font-headline')
  })
})
