import { readFile } from 'fs/promises'
import { join } from 'path'
import type { HookDataSource } from '@/lib/application/ports'
import type { Hook } from '@/lib/domain/types'

const DATA_PATH = join(process.cwd(), 'data', 'enriched-hooks.json')
const SEED_PATH = join(process.cwd(), 'data', 'seed-hooks.json')

export class EnrichedDataReader implements HookDataSource {
  async getAll(): Promise<Hook[]> {
    const hooks = await this.readJsonFile(DATA_PATH)

    if (hooks.length > 0) {
      return hooks
    }

    // Enriched file is empty or missing — fall back to seed data for development
    return this.readJsonFile(SEED_PATH)
  }

  private async readJsonFile(path: string): Promise<Hook[]> {
    try {
      const content = await readFile(path, 'utf-8')
      return JSON.parse(content) as Hook[]
    } catch {
      return []
    }
  }
}
