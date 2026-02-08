import { describe, it, expect } from 'vitest'
import { CATEGORIES, getCategoryBadgeStyle } from '@/lib/domain/categories'
import type { PurposeCategory } from '@/lib/domain/types'
import { PURPOSE_CATEGORIES } from '@/lib/domain/types'

describe('CATEGORIES badge metadata', () => {
  it('all 8 categories have non-empty badgeColor', () => {
    for (const cat of CATEGORIES) {
      expect(cat.badgeColor, `${cat.value} missing badgeColor`).toBeTruthy()
    }
  })

  it('all 8 categories have non-empty textColor', () => {
    for (const cat of CATEGORIES) {
      expect(cat.textColor, `${cat.value} missing textColor`).toBeTruthy()
    }
  })

  it('no two categories share the same badgeColor', () => {
    const colors = CATEGORIES.map((c) => c.badgeColor)
    expect(new Set(colors).size).toBe(CATEGORIES.length)
  })

  it('covers all PurposeCategory values', () => {
    const values = CATEGORIES.map((c) => c.value)
    for (const cat of PURPOSE_CATEGORIES) {
      expect(values).toContain(cat)
    }
  })
})

describe('getCategoryBadgeStyle', () => {
  it('returns badgeColor and textColor for each category', () => {
    for (const cat of PURPOSE_CATEGORIES) {
      const style = getCategoryBadgeStyle(cat)
      expect(style.badgeColor).toBeTruthy()
      expect(style.textColor).toBeTruthy()
    }
  })

  it('returns the correct style for Safety', () => {
    const style = getCategoryBadgeStyle('Safety')
    expect(style.badgeColor).toBe('bg-red-50 dark:bg-red-500/15 border-red-200 dark:border-red-500/20')
    expect(style.textColor).toBe('text-red-700 dark:text-red-400')
  })

  it('returns different styles for different categories', () => {
    const safety = getCategoryBadgeStyle('Safety')
    const automation = getCategoryBadgeStyle('Automation')
    expect(safety.badgeColor).not.toBe(automation.badgeColor)
    expect(safety.textColor).not.toBe(automation.textColor)
  })
})

describe('getCategoryBadgeStyle integration', () => {
  it('returns Tailwind classes that include bg- and text- prefixes', () => {
    for (const cat of PURPOSE_CATEGORIES) {
      const style = getCategoryBadgeStyle(cat)
      expect(style.badgeColor).toMatch(/^bg-/)
      expect(style.textColor).toMatch(/^text-/)
    }
  })

  it('returns classes with dark mode variants', () => {
    for (const cat of PURPOSE_CATEGORIES) {
      const style = getCategoryBadgeStyle(cat)
      expect(style.badgeColor).toContain('dark:')
      expect(style.textColor).toContain('dark:')
    }
  })
})
