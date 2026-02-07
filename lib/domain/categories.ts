import type { PurposeCategory } from './types'

export interface CategoryMeta {
  value: PurposeCategory
  label: string
}

export const CATEGORIES: readonly CategoryMeta[] = [
  { value: 'Safety', label: 'Safety' },
  { value: 'Automation', label: 'Automation' },
  { value: 'Notification', label: 'Notification' },
  { value: 'Formatting', label: 'Formatting' },
  { value: 'Testing', label: 'Testing' },
  { value: 'Security', label: 'Security' },
  { value: 'Logging', label: 'Logging' },
  { value: 'Custom', label: 'Custom' },
] as const
