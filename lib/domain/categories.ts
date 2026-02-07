import type { PurposeCategory } from './types'

export interface BadgeStyle {
  badgeColor: string
  textColor: string
}

export interface CategoryMeta {
  value: PurposeCategory
  label: string
  badgeColor: string
  textColor: string
}

export const CATEGORIES: readonly CategoryMeta[] = [
  { value: 'Safety',       label: 'Safety',       badgeColor: 'bg-red-50 dark:bg-red-500/15 border-red-200 dark:border-red-500/20',       textColor: 'text-red-700 dark:text-red-400' },
  { value: 'Automation',   label: 'Automation',   badgeColor: 'bg-amber-50 dark:bg-amber-500/15 border-amber-200 dark:border-amber-500/20',   textColor: 'text-amber-700 dark:text-amber-400' },
  { value: 'Notification', label: 'Notification', badgeColor: 'bg-sky-50 dark:bg-sky-500/15 border-sky-200 dark:border-sky-500/20',       textColor: 'text-sky-700 dark:text-sky-400' },
  { value: 'Formatting',   label: 'Formatting',   badgeColor: 'bg-violet-50 dark:bg-violet-500/15 border-violet-200 dark:border-violet-500/20', textColor: 'text-violet-700 dark:text-violet-400' },
  { value: 'Testing',      label: 'Testing',      badgeColor: 'bg-green-50 dark:bg-green-500/15 border-green-200 dark:border-green-500/20',     textColor: 'text-green-700 dark:text-green-400' },
  { value: 'Security',     label: 'Security',     badgeColor: 'bg-orange-50 dark:bg-orange-500/15 border-orange-200 dark:border-orange-500/20', textColor: 'text-orange-700 dark:text-orange-400' },
  { value: 'Logging',      label: 'Logging',      badgeColor: 'bg-teal-50 dark:bg-teal-500/15 border-teal-200 dark:border-teal-500/20',       textColor: 'text-teal-700 dark:text-teal-400' },
  { value: 'Custom',       label: 'Custom',       badgeColor: 'bg-pink-50 dark:bg-pink-500/15 border-pink-200 dark:border-pink-500/20',       textColor: 'text-pink-700 dark:text-pink-400' },
] as const

export const getCategoryBadgeStyle = (category: PurposeCategory): BadgeStyle => {
  const meta = CATEGORIES.find((c) => c.value === category)
  if (!meta) {
    return { badgeColor: 'bg-zinc-50 dark:bg-zinc-500/15 border-zinc-200 dark:border-zinc-500/20', textColor: 'text-zinc-700 dark:text-zinc-400' }
  }
  return { badgeColor: meta.badgeColor, textColor: meta.textColor }
}
