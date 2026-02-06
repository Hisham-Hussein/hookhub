export type PurposeCategory =
  | 'Safety'
  | 'Automation'
  | 'Notification'
  | 'Formatting'
  | 'Testing'
  | 'Security'
  | 'Logging'
  | 'Custom'

export const PURPOSE_CATEGORIES: readonly PurposeCategory[] = [
  'Safety', 'Automation', 'Notification', 'Formatting',
  'Testing', 'Security', 'Logging', 'Custom',
] as const

export type LifecycleEvent =
  | 'PreToolUse'
  | 'PostToolUse'
  | 'UserPromptSubmit'
  | 'Notification'
  | 'Stop'

export const LIFECYCLE_EVENTS: readonly LifecycleEvent[] = [
  'PreToolUse', 'PostToolUse', 'UserPromptSubmit', 'Notification', 'Stop',
] as const

export function isValidPurposeCategory(value: unknown): value is PurposeCategory {
  return typeof value === 'string' && PURPOSE_CATEGORIES.includes(value as PurposeCategory)
}

export function isValidLifecycleEvent(value: unknown): value is LifecycleEvent {
  return typeof value === 'string' && LIFECYCLE_EVENTS.includes(value as LifecycleEvent)
}

export interface ManifestEntry {
  name: string
  githubRepoUrl: string
  purposeCategory: PurposeCategory
  lifecycleEvent: LifecycleEvent
}

export interface Hook {
  name: string
  githubRepoUrl: string
  purposeCategory: PurposeCategory
  lifecycleEvent: LifecycleEvent
  description: string
  starsCount: number
  lastUpdated: string
}
