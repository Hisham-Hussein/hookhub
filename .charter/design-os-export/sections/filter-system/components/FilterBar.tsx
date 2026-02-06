import type { FilterBarProps } from '../types'
import { FilterChipRow } from './FilterChipRow'

/**
 * FilterBar — Dual-dimension filter with result count.
 *
 * Composes two FilterChipRows (category + event) stacked vertically,
 * plus a result count announcer with `role="status"`.
 *
 * Layout:
 * 1. Category chip row (sky accent)
 * 2. Event chip row (indigo accent)
 * 3. Result count — "Showing N hooks"
 *
 * The result count uses aria-live="polite" so screen readers announce
 * the updated count after filter changes without interrupting the user.
 * Production implementations should debounce announcements ~300ms.
 */
export function FilterBar({
  categoryOptions,
  eventOptions,
  filterState,
  resultCount,
  onCategoryChange,
  onEventChange,
}: FilterBarProps & { resultCount: number }) {
  return (
    <div
      id="main-content"
      className="py-5 space-y-3"
      role="search"
      aria-label="Filter hooks"
    >
      {/* Category dimension */}
      <FilterChipRow
        ariaLabel="Filter by purpose category"
        rowLabel="Category"
        options={categoryOptions}
        selectedValue={filterState.category}
        onSelect={(value) => onCategoryChange?.(value as typeof filterState.category)}
        variant="category"
      />

      {/* Event dimension */}
      <FilterChipRow
        ariaLabel="Filter by lifecycle event"
        rowLabel="Event"
        options={eventOptions}
        selectedValue={filterState.event}
        onSelect={(value) => onEventChange?.(value as typeof filterState.event)}
        variant="event"
      />

      {/* Result count — live region for screen readers */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="text-sm text-zinc-600 dark:text-zinc-500 font-light pl-0.5 pt-1"
      >
        Showing {resultCount} {resultCount === 1 ? 'hook' : 'hooks'}
      </div>
    </div>
  )
}
