import { writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { readManifest } from '@/lib/adapters/manifest-reader'
import { fetchRepoMetadata } from '@/lib/adapters/github-api'
import { enrichManifest } from '@/lib/application/enrich-manifest'

const MANIFEST_PATH = join(process.cwd(), 'data', 'hooks.json')
const OUTPUT_PATH = join(process.cwd(), 'data', 'enriched-hooks.json')

export async function runEnrichment(): Promise<{
  summary: string
  success: boolean
}> {
  const token = process.env.GITHUB_TOKEN

  const result = await enrichManifest({
    readManifest: () => readManifest(MANIFEST_PATH),
    fetchMetadata: (url) => fetchRepoMetadata(url, token),
  })

  await mkdir(dirname(OUTPUT_PATH), { recursive: true })

  // Don't overwrite existing data when enrichment yields nothing
  // (e.g., all manifest repos are unreachable/fictional)
  if (result.hooks.length === 0) {
    const { readFile } = await import('fs/promises')
    try {
      const existing = JSON.parse(await readFile(OUTPUT_PATH, 'utf-8'))
      if (Array.isArray(existing) && existing.length > 0) {
        console.warn(
          `Enrichment produced 0 hooks but ${OUTPUT_PATH} has ${existing.length} — preserving existing data.`
        )
        return { summary: result.summary, success: true }
      }
    } catch {
      // No existing file or invalid JSON — proceed with write
    }
  }

  await writeFile(OUTPUT_PATH, JSON.stringify(result.hooks, null, 2), 'utf-8')

  console.log(result.summary)

  if (result.failures.length > 0) {
    console.warn('Failures:')
    for (const f of result.failures) {
      console.warn(`  - ${f.entry.name}: ${f.error}`)
    }
  }

  return { summary: result.summary, success: true }
}

// Run when executed directly (not imported for testing)
const isDirectExecution =
  process.argv[1] &&
  import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))
if (isDirectExecution) {
  runEnrichment()
    .then(({ summary }) => {
      console.log(`\nBuild enrichment complete: ${summary}`)
    })
    .catch((err) => {
      console.error('Enrichment failed:', err)
      process.exit(1)
    })
}
