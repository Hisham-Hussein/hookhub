import type { Hook, PurposeCategory, LifecycleEvent } from './types'

export interface FilterState {
  category: PurposeCategory | null
  event: LifecycleEvent | null
}

export const filterHooks = (hooks: Hook[], state: FilterState): Hook[] => {
  return hooks.filter((hook) => {
    if (state.category !== null && hook.purposeCategory !== state.category) return false
    if (state.event !== null && hook.lifecycleEvent !== state.event) return false
    return true
  })
}
