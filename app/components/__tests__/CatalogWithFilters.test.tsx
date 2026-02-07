import { describe, it, expect } from 'vitest'

describe('CatalogWithFilters', () => {
  it('is a client component (has "use client" directive)', async () => {
    const fs = await import('fs')
    const path = await import('path')
    const filePath = path.resolve(__dirname, '../CatalogWithFilters.tsx')
    const source = fs.readFileSync(filePath, 'utf-8')
    expect(source).toMatch(/['"]use client['"]/)
  })

  it('exports a CatalogWithFilters component', async () => {
    const mod = await import('../CatalogWithFilters')
    expect(mod.CatalogWithFilters).toBeDefined()
    expect(typeof mod.CatalogWithFilters).toBe('function')
  })
})
