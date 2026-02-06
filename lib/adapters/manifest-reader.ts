import { readFile } from 'fs/promises'
import type { ManifestEntry } from '@/lib/domain/types'

export async function readManifest(path: string): Promise<ManifestEntry[]> {
  let content: string
  try {
    content = await readFile(path, 'utf-8')
  } catch (err) {
    throw new Error(
      `Manifest file not found at ${path}: ${err instanceof Error ? err.message : String(err)}`,
    )
  }

  try {
    return JSON.parse(content) as ManifestEntry[]
  } catch (err) {
    throw new Error(
      `Failed to parse manifest JSON at ${path}: ${err instanceof Error ? err.message : String(err)}`,
    )
  }
}
