import type { HookDataSource } from '@/lib/application/ports'
import type { Hook, PurposeCategory, LifecycleEvent } from '@/lib/domain/types'
import { PURPOSE_CATEGORIES, LIFECYCLE_EVENTS } from '@/lib/domain/types'

export interface LoadCatalogOutput {
  hooks: Hook[]
  categories: PurposeCategory[]
  events: LifecycleEvent[]
  totalCount: number
}

export const loadCatalog = async (
  dataSource: HookDataSource
): Promise<LoadCatalogOutput> => {
  const hooks = await dataSource.getAll()

  return {
    hooks,
    categories: [...PURPOSE_CATEGORIES],
    events: [...LIFECYCLE_EVENTS],
    totalCount: hooks.length,
  }
}
