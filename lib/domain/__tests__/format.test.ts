import { describe, it, expect } from 'vitest'
import { formatStarsCount } from '../format'

describe('formatStarsCount', () => {
  it('returns "0" for 0', () => {
    expect(formatStarsCount(0)).toBe('0')
  })

  it('returns exact number for values under 1000', () => {
    expect(formatStarsCount(42)).toBe('42')
    expect(formatStarsCount(999)).toBe('999')
  })

  it('returns "1k" for exactly 1000', () => {
    expect(formatStarsCount(1000)).toBe('1k')
  })

  it('abbreviates with one decimal for non-round thousands', () => {
    expect(formatStarsCount(1200)).toBe('1.2k')
    expect(formatStarsCount(1500)).toBe('1.5k')
  })

  it('drops trailing .0 for round thousands', () => {
    expect(formatStarsCount(2000)).toBe('2k')
    expect(formatStarsCount(10000)).toBe('10k')
  })

  it('handles large values', () => {
    expect(formatStarsCount(100000)).toBe('100k')
    expect(formatStarsCount(999999)).toBe('1000k')
  })

  it('returns "0" for negative input', () => {
    expect(formatStarsCount(-5)).toBe('0')
  })
})
