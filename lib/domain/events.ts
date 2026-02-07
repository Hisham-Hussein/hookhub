import type { LifecycleEvent } from './types'

export interface EventMeta {
  value: LifecycleEvent
  label: string
}

export const EVENTS: readonly EventMeta[] = [
  { value: 'PreToolUse', label: 'PreToolUse' },
  { value: 'PostToolUse', label: 'PostToolUse' },
  { value: 'UserPromptSubmit', label: 'UserPromptSubmit' },
  { value: 'Notification', label: 'Notification' },
  { value: 'Stop', label: 'Stop' },
] as const
