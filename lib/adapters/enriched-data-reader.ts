import { readFile } from 'fs/promises'
import { join } from 'path'
import type { HookDataSource } from '@/lib/application/ports'
import type { Hook } from '@/lib/domain/types'

const DATA_PATH = join(process.cwd(), 'data', 'enriched-hooks.json')

export class EnrichedDataReader implements HookDataSource {
  async getAll(): Promise<Hook[]> {
    let content: string
    try {
      content = await readFile(DATA_PATH, 'utf-8')
    } catch (err) {
      const error = err as NodeJS.ErrnoException
      if (error.code === 'ENOENT') {
        throw new Error(
          `Enriched data file not found at data/enriched-hooks.json. Run "pnpm enrich" first.`
        )
      }
      throw error
    }
    return JSON.parse(content) as Hook[]
  }
}
