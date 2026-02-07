import { describe, it, expect } from 'vitest'
import React from 'react'
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

describe('HeroBanner Edge Cases', () => {
  // ─── 1. Props Edge Cases ───────────────────────────────────────────

  describe('Props Edge Cases', () => {
    it('renders with custom headline prop', () => {
      const tree = HeroBanner({ headline: 'Custom Headline' })
      const headings = findAll(tree, (el) => el.type === 'h1')
      expect(textContent(headings[0])).toBe('Custom Headline')
    })

    it('renders with custom subtitle prop', () => {
      const tree = HeroBanner({ subtitle: 'Custom subtitle text' })
      const paragraphs = findAll(tree, (el) => el.type === 'p')
      expect(textContent(paragraphs[0])).toBe('Custom subtitle text')
    })

    it('renders with both custom props simultaneously', () => {
      const tree = HeroBanner({ headline: 'My Title', subtitle: 'My Description' })
      const headings = findAll(tree, (el) => el.type === 'h1')
      const paragraphs = findAll(tree, (el) => el.type === 'p')
      expect(textContent(headings[0])).toBe('My Title')
      expect(textContent(paragraphs[0])).toBe('My Description')
    })

    it('renders correctly when called with no arguments', () => {
      const tree = HeroBanner()
      const headings = findAll(tree, (el) => el.type === 'h1')
      const paragraphs = findAll(tree, (el) => el.type === 'p')
      expect(textContent(headings[0])).toBe('Discover Claude Code Hooks')
      expect(textContent(paragraphs[0])).toContain('curated directory')
    })

    it('renders with empty string headline (should render empty h1, not default)', () => {
      const tree = HeroBanner({ headline: '' })
      const headings = findAll(tree, (el) => el.type === 'h1')
      expect(textContent(headings[0])).toBe('')
    })

    it('renders with empty string subtitle (should render empty p, not default)', () => {
      const tree = HeroBanner({ subtitle: '' })
      const paragraphs = findAll(tree, (el) => el.type === 'p')
      expect(textContent(paragraphs[0])).toBe('')
    })

    it('handles very long headline text without breaking structure', () => {
      const longHeadline = 'A'.repeat(1000)
      const tree = HeroBanner({ headline: longHeadline })
      const headings = findAll(tree, (el) => el.type === 'h1')
      const sections = findAll(tree, (el) => el.type === 'section')
      expect(textContent(headings[0])).toBe(longHeadline)
      expect(sections).toHaveLength(1)
    })

    it('handles very long subtitle text without breaking structure', () => {
      const longSubtitle = 'B'.repeat(2000)
      const tree = HeroBanner({ subtitle: longSubtitle })
      const paragraphs = findAll(tree, (el) => el.type === 'p')
      const sections = findAll(tree, (el) => el.type === 'section')
      expect(textContent(paragraphs[0])).toBe(longSubtitle)
      expect(sections).toHaveLength(1)
    })

    it('handles special characters in props (quotes, ampersands, angle brackets, unicode, em dash)', () => {
      const specialHeadline = `"Hooks" & <Components> — \u00A9 \u2603 \u00E9`
      const specialSubtitle = `It's a "test" with <html> & \u2019smart quotes\u2019 \u2014 done`
      const tree = HeroBanner({ headline: specialHeadline, subtitle: specialSubtitle })
      const headings = findAll(tree, (el) => el.type === 'h1')
      const paragraphs = findAll(tree, (el) => el.type === 'p')
      expect(textContent(headings[0])).toBe(specialHeadline)
      expect(textContent(paragraphs[0])).toBe(specialSubtitle)
    })
  })

  // ─── 2. Component Structure Validation ─────────────────────────────

  describe('Component Structure Validation', () => {
    it('returns a React Fragment as the root element', () => {
      const tree = HeroBanner()
      expect(tree.type).toBe(Symbol.for('react.fragment'))
    })

    it('Fragment has exactly 2 top-level children: skip link (a) and section', () => {
      const tree = HeroBanner()
      const children = tree.props.children as React.ReactElement[]
      expect(children).toHaveLength(2)
      expect(children[0].type).toBe('a')
      expect(children[1].type).toBe('section')
    })

    it('section has exactly 4 direct children: glow div, h1, p, and scroll cue div', () => {
      const tree = HeroBanner()
      const sections = findAll(tree, (el) => el.type === 'section')
      const sectionChildren = sections[0].props.children as React.ReactElement[]
      // Filter out non-element children (comments, strings, etc.)
      const elementChildren = sectionChildren.filter(
        (child) => child && typeof child === 'object' && child.type
      )
      expect(elementChildren).toHaveLength(4)
    })

    it('heading is the only h1 in the entire tree', () => {
      const tree = HeroBanner()
      const headings = findAll(tree, (el) => el.type === 'h1')
      expect(headings).toHaveLength(1)
    })

    it('there is exactly one section element', () => {
      const tree = HeroBanner()
      const sections = findAll(tree, (el) => el.type === 'section')
      expect(sections).toHaveLength(1)
    })

    it('there is exactly one paragraph element', () => {
      const tree = HeroBanner()
      const paragraphs = findAll(tree, (el) => el.type === 'p')
      expect(paragraphs).toHaveLength(1)
    })

    it('there is exactly one SVG element', () => {
      const tree = HeroBanner()
      const svgs = findAll(tree, (el) => el.type === 'svg')
      expect(svgs).toHaveLength(1)
    })

    it('there is exactly one anchor element (skip link)', () => {
      const tree = HeroBanner()
      const anchors = findAll(tree, (el) => el.type === 'a')
      expect(anchors).toHaveLength(1)
    })

    it('no button elements exist', () => {
      const tree = HeroBanner()
      const buttons = findAll(tree, (el) => el.type === 'button')
      expect(buttons).toHaveLength(0)
    })

    it('no input elements exist', () => {
      const tree = HeroBanner()
      const inputs = findAll(tree, (el) => el.type === 'input')
      expect(inputs).toHaveLength(0)
    })
  })

  // ─── 3. Accessibility Completeness ─────────────────────────────────

  describe('Accessibility Completeness', () => {
    it('skip link has aria-label attribute', () => {
      const tree = HeroBanner()
      const links = findAll(tree, (el) => el.type === 'a')
      expect(links[0].props['aria-label']).toBeDefined()
    })

    it('skip link aria-label matches visible text (no mismatch)', () => {
      const tree = HeroBanner()
      const links = findAll(tree, (el) => el.type === 'a')
      const ariaLabel = links[0].props['aria-label'] as string
      const visibleText = textContent(links[0])
      expect(ariaLabel.toLowerCase()).toBe(visibleText.toLowerCase())
    })

    it('skip link has tabIndex={0} for keyboard focusability', () => {
      const tree = HeroBanner()
      const links = findAll(tree, (el) => el.type === 'a')
      expect(links[0].props.tabIndex).toBe(0)
    })

    it('skip link className includes sr-only (hidden by default)', () => {
      const tree = HeroBanner()
      const links = findAll(tree, (el) => el.type === 'a')
      expect(links[0].props.className).toContain('sr-only')
    })

    it('skip link className includes focus:not-sr-only (visible on focus)', () => {
      const tree = HeroBanner()
      const links = findAll(tree, (el) => el.type === 'a')
      expect(links[0].props.className).toContain('focus:not-sr-only')
    })

    it('section is a landmark element (section tag)', () => {
      const tree = HeroBanner()
      const sections = findAll(tree, (el) => el.type === 'section')
      expect(sections).toHaveLength(1)
      expect(sections[0].type).toBe('section')
    })

    it('h1 id value matches section aria-labelledby value exactly', () => {
      const tree = HeroBanner()
      const sections = findAll(tree, (el) => el.type === 'section')
      const headings = findAll(tree, (el) => el.type === 'h1')
      const sectionLabelledBy = sections[0].props['aria-labelledby']
      const headingId = headings[0].props.id
      expect(sectionLabelledBy).toBe(headingId)
      expect(sectionLabelledBy).toBe('hero-heading')
    })

    it('ambient glow container has aria-hidden="true"', () => {
      const tree = HeroBanner()
      const sections = findAll(tree, (el) => el.type === 'section')
      const sectionChildren = sections[0].props.children as React.ReactElement[]
      // First child of section is the ambient glow div
      const glowDiv = sectionChildren.find(
        (child) =>
          child &&
          typeof child === 'object' &&
          child.type === 'div' &&
          child.props?.className?.includes('pointer-events-none')
      )
      expect(glowDiv).toBeDefined()
      expect(glowDiv!.props['aria-hidden']).toBe('true')
    })

    it('ambient glow container has pointer-events-none (non-interactive)', () => {
      const tree = HeroBanner()
      const sections = findAll(tree, (el) => el.type === 'section')
      const glowDivs = findAll(
        sections[0],
        (el) =>
          el.type === 'div' &&
          el.props?.className?.includes('pointer-events-none') &&
          el.props?.className?.includes('absolute')
      )
      expect(glowDivs.length).toBeGreaterThanOrEqual(1)
    })

    it('scroll cue container has aria-hidden="true"', () => {
      const tree = HeroBanner()
      const sections = findAll(tree, (el) => el.type === 'section')
      const sectionChildren = sections[0].props.children as React.ReactElement[]
      // Scroll cue is the last div child containing the svg
      const scrollCueDiv = sectionChildren.find(
        (child) =>
          child &&
          typeof child === 'object' &&
          child.type === 'div' &&
          child.props?.className?.includes('mt-6')
      )
      expect(scrollCueDiv).toBeDefined()
      expect(scrollCueDiv!.props['aria-hidden']).toBe('true')
    })

    it('no decorative elements without aria-hidden (all non-semantic divs in section have aria-hidden)', () => {
      const tree = HeroBanner()
      const sections = findAll(tree, (el) => el.type === 'section')
      // Get direct div children of section (decorative containers)
      const sectionChildren = sections[0].props.children as React.ReactElement[]
      const directDivs = sectionChildren.filter(
        (child) => child && typeof child === 'object' && child.type === 'div'
      )
      // All direct div children of section should be aria-hidden
      for (const div of directDivs) {
        expect(div.props['aria-hidden']).toBe('true')
      }
    })

    it('SVG does not have a role or aria-label (decorative, hidden by parent)', () => {
      const tree = HeroBanner()
      const svgs = findAll(tree, (el) => el.type === 'svg')
      expect(svgs[0].props.role).toBeUndefined()
      expect(svgs[0].props['aria-label']).toBeUndefined()
    })
  })

  // ─── 4. Design Token & Styling Compliance ──────────────────────────

  describe('Design Token & Styling Compliance', () => {
    it('h1 has font-light class (300 weight per design tokens)', () => {
      const tree = HeroBanner()
      const headings = findAll(tree, (el) => el.type === 'h1')
      expect(headings[0].props.className).toContain('font-light')
    })

    it('h1 has text-zinc-100 class (headline color)', () => {
      const tree = HeroBanner()
      const headings = findAll(tree, (el) => el.type === 'h1')
      expect(headings[0].props.className).toContain('text-zinc-100')
    })

    it('h1 has tracking-tight class (letter spacing)', () => {
      const tree = HeroBanner()
      const headings = findAll(tree, (el) => el.type === 'h1')
      expect(headings[0].props.className).toContain('tracking-tight')
    })

    it('h1 has responsive text sizes: text-3xl, sm:text-4xl, lg:text-5xl', () => {
      const tree = HeroBanner()
      const headings = findAll(tree, (el) => el.type === 'h1')
      const classes = headings[0].props.className as string
      expect(classes).toContain('text-3xl')
      expect(classes).toContain('sm:text-4xl')
      expect(classes).toContain('lg:text-5xl')
    })

    it('subtitle p has text-zinc-400 class (muted body color)', () => {
      const tree = HeroBanner()
      const paragraphs = findAll(tree, (el) => el.type === 'p')
      expect(paragraphs[0].props.className).toContain('text-zinc-400')
    })

    it('subtitle p has font-light class', () => {
      const tree = HeroBanner()
      const paragraphs = findAll(tree, (el) => el.type === 'p')
      expect(paragraphs[0].props.className).toContain('font-light')
    })

    it('subtitle p has leading-relaxed class (line height)', () => {
      const tree = HeroBanner()
      const paragraphs = findAll(tree, (el) => el.type === 'p')
      expect(paragraphs[0].props.className).toContain('leading-relaxed')
    })

    it('subtitle p has max-w-2xl class (constrains width for readability)', () => {
      const tree = HeroBanner()
      const paragraphs = findAll(tree, (el) => el.type === 'p')
      expect(paragraphs[0].props.className).toContain('max-w-2xl')
    })

    it('section has flex layout classes (flex, flex-col, items-center)', () => {
      const tree = HeroBanner()
      const sections = findAll(tree, (el) => el.type === 'section')
      const classes = sections[0].props.className as string
      expect(classes).toContain('flex')
      expect(classes).toContain('flex-col')
      expect(classes).toContain('items-center')
    })

    it('section has text-center class', () => {
      const tree = HeroBanner()
      const sections = findAll(tree, (el) => el.type === 'section')
      expect(sections[0].props.className).toContain('text-center')
    })

    it('section has responsive padding: py-14, sm:py-12, md:py-10, lg:py-8', () => {
      const tree = HeroBanner()
      const sections = findAll(tree, (el) => el.type === 'section')
      const classes = sections[0].props.className as string
      expect(classes).toContain('py-14')
      expect(classes).toContain('sm:py-12')
      expect(classes).toContain('md:py-10')
      expect(classes).toContain('lg:py-8')
    })

    it('SVG has animate-gentle-bounce class (animation token)', () => {
      const tree = HeroBanner()
      const svgs = findAll(tree, (el) => el.type === 'svg')
      expect(svgs[0].props.className).toContain('animate-gentle-bounce')
    })

    it('SVG has w-5 h-5 sizing', () => {
      const tree = HeroBanner()
      const svgs = findAll(tree, (el) => el.type === 'svg')
      const classes = svgs[0].props.className as string
      expect(classes).toContain('w-5')
      expect(classes).toContain('h-5')
    })

    it('SVG has text-zinc-600 color', () => {
      const tree = HeroBanner()
      const svgs = findAll(tree, (el) => el.type === 'svg')
      expect(svgs[0].props.className).toContain('text-zinc-600')
    })
  })

  // ─── 5. SVG Scroll Cue Correctness ─────────────────────────────────

  describe('SVG Scroll Cue Correctness', () => {
    it('SVG has fill="none" (outline style, not filled)', () => {
      const tree = HeroBanner()
      const svgs = findAll(tree, (el) => el.type === 'svg')
      expect(svgs[0].props.fill).toBe('none')
    })

    it('SVG has viewBox="0 0 20 20"', () => {
      const tree = HeroBanner()
      const svgs = findAll(tree, (el) => el.type === 'svg')
      expect(svgs[0].props.viewBox).toBe('0 0 20 20')
    })

    it('SVG has stroke="currentColor"', () => {
      const tree = HeroBanner()
      const svgs = findAll(tree, (el) => el.type === 'svg')
      expect(svgs[0].props.stroke).toBe('currentColor')
    })

    it('SVG has strokeWidth={1.5}', () => {
      const tree = HeroBanner()
      const svgs = findAll(tree, (el) => el.type === 'svg')
      expect(svgs[0].props.strokeWidth).toBe(1.5)
    })

    it('SVG contains exactly one path element', () => {
      const tree = HeroBanner()
      const svgs = findAll(tree, (el) => el.type === 'svg')
      const paths = findAll(svgs[0], (el) => el.type === 'path')
      expect(paths).toHaveLength(1)
    })

    it('path has strokeLinecap="round"', () => {
      const tree = HeroBanner()
      const paths = findAll(tree, (el) => el.type === 'path')
      expect(paths[0].props.strokeLinecap).toBe('round')
    })

    it('path has strokeLinejoin="round"', () => {
      const tree = HeroBanner()
      const paths = findAll(tree, (el) => el.type === 'path')
      expect(paths[0].props.strokeLinejoin).toBe('round')
    })

    it('path d attribute contains a downward-pointing chevron path', () => {
      const tree = HeroBanner()
      const paths = findAll(tree, (el) => el.type === 'path')
      const d = paths[0].props.d as string
      // The chevron path goes from left-mid to center-bottom to right-mid
      expect(d).toBe('M5 7l5 5 5-5')
    })
  })
})
