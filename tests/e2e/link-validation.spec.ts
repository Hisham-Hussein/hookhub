import { test, expect } from '@playwright/test'
import { execSync } from 'child_process'
import { writeFileSync, mkdirSync, rmSync } from 'fs'
import { join } from 'path'

test.describe('Link Validation Build Output (US-012)', () => {
  const testManifestDir = join(process.cwd(), 'data', 'test-fixtures')
  const testManifestPath = join(testManifestDir, 'bad-link-manifest.json')

  test.beforeAll(() => {
    mkdirSync(testManifestDir, { recursive: true })

    const testManifest = [
      {
        name: 'real-hook',
        githubRepoUrl: 'https://github.com/octocat/Hello-World',
        purposeCategory: 'Safety',
        lifecycleEvent: 'PreToolUse',
      },
      {
        name: 'nonexistent-hook',
        githubRepoUrl: 'https://github.com/nonexistent-owner-xyz/nonexistent-repo-xyz',
        purposeCategory: 'Testing',
        lifecycleEvent: 'PostToolUse',
      },
    ]

    writeFileSync(testManifestPath, JSON.stringify(testManifest, null, 2))
  })

  test.afterAll(() => {
    rmSync(testManifestDir, { recursive: true, force: true })
  })

  test('build completes successfully even with broken links', () => {
    const scriptContent = `
      import { enrichManifest } from '@/lib/application/enrich-manifest'
      import { readManifest, readRawManifest } from '@/lib/adapters/manifest-reader'
      import { fetchRepoMetadata } from '@/lib/adapters/github-api'

      const MANIFEST_PATH = '${testManifestPath.replace(/\\/g, '/')}'

      async function run() {
        const result = await enrichManifest({
          readManifest: () => readManifest(MANIFEST_PATH),
          fetchMetadata: (url) => fetchRepoMetadata(url),
          readRawManifest: () => readRawManifest(MANIFEST_PATH),
        })
        console.log(JSON.stringify(result))
      }

      run().catch(e => { console.error(e); process.exit(1) })
    `

    const testScriptPath = join(testManifestDir, 'run-enrich.ts')
    writeFileSync(testScriptPath, scriptContent)

    let output: string
    try {
      output = execSync(`npx tsx ${testScriptPath}`, {
        cwd: process.cwd(),
        encoding: 'utf-8',
        timeout: 30000,
      })
    } catch (err: unknown) {
      const execErr = err as { stdout?: string; stderr?: string }
      output = (execErr.stdout ?? '') + (execErr.stderr ?? '')
    }

    const result = JSON.parse(output.trim())

    // Build completed (did not crash)
    expect(result.hooks).toBeDefined()
    expect(result.validationResults).toBeDefined()

    // At least one entry was processed (enriched or failed)
    expect(result.hooks.length + result.failures.length).toBe(2)

    // Validation results exist for attempted fetches
    expect(result.validationResults.length).toBeGreaterThanOrEqual(1)

    // The nonexistent repo should appear as unreachable in validation results
    // (unless both failed due to rate limiting, in which case both are unreachable)
    const unreachable = result.validationResults.filter(
      (r: { reachable: boolean }) => !r.reachable,
    )
    expect(unreachable.length).toBeGreaterThanOrEqual(1)
  })
})
