import type { LifecycleEvent } from './types'
import type { BadgeStyle } from './categories'

export interface EventMeta {
  value: LifecycleEvent
  label: string
  badgeColor: string
  textColor: string
}

export const EVENTS: readonly EventMeta[] = [
  { value: 'PreToolUse',       label: 'PreToolUse',       badgeColor: 'bg-indigo-50 dark:bg-indigo-500/15 border-indigo-200 dark:border-indigo-500/20',     textColor: 'text-indigo-700 dark:text-indigo-400' },
  { value: 'PostToolUse',      label: 'PostToolUse',      badgeColor: 'bg-cyan-50 dark:bg-cyan-500/15 border-cyan-200 dark:border-cyan-500/20',             textColor: 'text-cyan-700 dark:text-cyan-400' },
  { value: 'UserPromptSubmit', label: 'UserPromptSubmit', badgeColor: 'bg-fuchsia-50 dark:bg-fuchsia-500/15 border-fuchsia-200 dark:border-fuchsia-500/20', textColor: 'text-fuchsia-700 dark:text-fuchsia-400' },
  { value: 'Notification',     label: 'Notification',     badgeColor: 'bg-rose-50 dark:bg-rose-500/15 border-rose-200 dark:border-rose-500/20',             textColor: 'text-rose-700 dark:text-rose-400' },
  { value: 'Stop',             label: 'Stop',             badgeColor: 'bg-slate-50 dark:bg-slate-500/15 border-slate-200 dark:border-slate-500/20',         textColor: 'text-slate-700 dark:text-slate-400' },
] as const

export const getEventBadgeStyle = (event: LifecycleEvent): BadgeStyle => {
  const meta = EVENTS.find((e) => e.value === event)
  if (!meta) {
    return { badgeColor: 'bg-zinc-50 dark:bg-zinc-500/15 border-zinc-200 dark:border-zinc-500/20', textColor: 'text-zinc-700 dark:text-zinc-400' }
  }
  return { badgeColor: meta.badgeColor, textColor: meta.textColor }
}
