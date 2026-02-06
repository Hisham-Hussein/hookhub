import type { Hook } from '@/lib/domain/types'

export interface HookDataSource {
  getAll(): Promise<Hook[]>
}
