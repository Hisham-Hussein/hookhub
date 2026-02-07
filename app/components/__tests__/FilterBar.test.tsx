import { describe, it, expect } from 'vitest'

describe('FilterBar', () => {
  it('is a client component (has "use client" directive)', async () => {
    const fs = await import('fs')
    const path = await import('path')
    const filePath = path.resolve(__dirname, '../FilterBar.tsx')
    const source = fs.readFileSync(filePath, 'utf-8')
    expect(source).toMatch(/['"]use client['"]/)
  })

  it('exports a FilterBar component', async () => {
    const mod = await import('../FilterBar')
    expect(mod.FilterBar).toBeDefined()
    expect(typeof mod.FilterBar).toBe('function')
  })
})
