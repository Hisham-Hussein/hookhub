import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import type { ManifestEntry } from '@/lib/domain/types'

const manifestPath = join(__dirname, '..', 'hooks.json')
const entries: ManifestEntry[] = JSON.parse(readFileSync(manifestPath, 'utf-8'))

describe('data/hooks.json data integrity', () => {
  it('has no duplicate hook names', () => {
    const names = entries.map((e) => e.name)
    const unique = new Set(names)
    expect(unique.size).toBe(names.length)
  })

  it('has no duplicate GitHub URLs', () => {
    const urls = entries.map((e) => e.githubRepoUrl)
    const unique = new Set(urls)
    expect(unique.size).toBe(urls.length)
  })

  it('all hook names are non-empty strings', () => {
    for (const entry of entries) {
      expect(entry.name.length).toBeGreaterThan(0)
      expect(typeof entry.name).toBe('string')
    }
  })

  it('all hook names follow kebab-case convention', () => {
    for (const entry of entries) {
      expect(entry.name).toMatch(/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/)
    }
  })

  it('all GitHub URLs follow https://github.com/{owner}/{repo} pattern', () => {
    for (const entry of entries) {
      const url = new URL(entry.githubRepoUrl)
      expect(url.protocol).toBe('https:')
      expect(url.hostname).toBe('github.com')
      const parts = url.pathname.split('/').filter(Boolean)
      expect(parts.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('each entry has exactly 4 fields (no extra properties)', () => {
    for (const entry of entries) {
      expect(Object.keys(entry).sort()).toEqual(
        ['githubRepoUrl', 'lifecycleEvent', 'name', 'purposeCategory'],
      )
    }
  })
})
