import { useState, useMemo, useCallback } from 'react'
import type {
  FilterSystemProps,
  FilterState,
  CategoryFilterValue,
  EventFilterValue,
} from '../types'
import { HookCatalog } from '../../hook-catalog/components/HookCatalog'
import { FilterBar } from './FilterBar'

/**
 * FilterSystem — Orchestrates dual-dimension filtering over the Hook Catalog.
 *
 * This is the top-level section component. It:
 * 1. Manages filter state (category + event selection)
 * 2. Computes the filtered hook list via AND-intersection
 * 3. Renders the FilterBar above the HookCatalog grid
 * 4. Shows a filter-specific empty state when AND produces zero results
 * 5. Exposes onFilterChange for external consumers (analytics, URL sync)
 *
 * The component reuses HookCatalog from the Hook Catalog section for the grid display.
 * Grid transitions: a container-level fade animation plays when filters change.
 */
export function FilterSystem({
  hooks,
  categoryOptions,
  eventOptions,
  filterEmptyState,
  onFilterChange,
  onHookClick,
}: FilterSystemProps & { onHookClick?: (url: string) => void }) {
  const [filterState, setFilterState] = useState<FilterState>({
    category: 'all',
    event: 'all',
  })

  // AND-intersection filtering — both dimensions must match
  const filteredHooks = useMemo(() => {
    return hooks.filter((hook) => {
      if (filterState.category !== 'all' && hook.purposeCategory !== filterState.category)
        return false
      if (filterState.event !== 'all' && hook.lifecycleEvent !== filterState.event)
        return false
      return true
    })
  }, [hooks, filterState])

  const handleCategoryChange = useCallback(
    (value: CategoryFilterValue) => {
      const next: FilterState = { ...filterState, category: value }
      setFilterState(next)
      const count = hooks.filter((h) => {
        if (value !== 'all' && h.purposeCategory !== value) return false
        if (next.event !== 'all' && h.lifecycleEvent !== next.event) return false
        return true
      }).length
      onFilterChange?.(next, count)
    },
    [filterState, hooks, onFilterChange],
  )

  const handleEventChange = useCallback(
    (value: EventFilterValue) => {
      const next: FilterState = { ...filterState, event: value }
      setFilterState(next)
      const count = hooks.filter((h) => {
        if (next.category !== 'all' && h.purposeCategory !== next.category) return false
        if (value !== 'all' && h.lifecycleEvent !== value) return false
        return true
      }).length
      onFilterChange?.(next, count)
    },
    [filterState, hooks, onFilterChange],
  )

  const handleClearAll = useCallback(() => {
    const next: FilterState = { category: 'all', event: 'all' }
    setFilterState(next)
    onFilterChange?.(next, hooks.length)
  }, [hooks, onFilterChange])

  // Key for grid animation — changes trigger a fade-in re-mount
  const gridKey = `${filterState.category}:${filterState.event}`

  // Whether we're in a filtered state (not both "all")
  const isFiltered = filterState.category !== 'all' || filterState.event !== 'all'

  return (
    <>
      {/* Filter bar — always visible and interactive */}
      <FilterBar
        categoryOptions={categoryOptions}
        eventOptions={eventOptions}
        filterState={filterState}
        resultCount={filteredHooks.length}
        onCategoryChange={handleCategoryChange}
        onEventChange={handleEventChange}
      />

      {/* Filtered grid with transition animation */}
      <div
        key={gridKey}
        className="motion-safe:animate-fade-in"
      >
        {filteredHooks.length > 0 ? (
          <HookCatalog
            hooks={filteredHooks}
            emptyState={{ title: '', message: '', icon: '' }}
            onHookClick={onHookClick}
          />
        ) : isFiltered ? (
          /* Filter-specific empty state — zero results from AND-intersection */
          <section className="flex flex-col items-center justify-center text-center py-20 px-4">
            {/* Empty state icon */}
            <div className="mb-5 rounded-2xl border border-zinc-200 bg-zinc-100/50 dark:border-zinc-800 dark:bg-zinc-900/50 p-5">
              <svg
                className="w-8 h-8 text-zinc-400 dark:text-zinc-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>

            <h3 className="font-headline font-light text-xl text-zinc-700 dark:text-zinc-300 mb-2">
              {filterEmptyState.title}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-500 font-light max-w-sm leading-relaxed mb-6">
              {filterEmptyState.message}
            </p>

            {/* Clear all filters CTA */}
            <button
              type="button"
              onClick={handleClearAll}
              className="
                inline-flex items-center gap-2 px-4 py-2.5 rounded-full
                text-sm font-light text-sky-700 border border-sky-300 dark:text-sky-300 dark:border-sky-500/30
                hover:bg-sky-50 hover:border-sky-400 dark:hover:bg-sky-500/10 dark:hover:border-sky-500/50
                motion-safe:transition-all motion-safe:duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black
                cursor-pointer
              "
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {filterEmptyState.ctaLabel}
            </button>
          </section>
        ) : (
          /* Catalog truly empty — no hooks at all */
          <HookCatalog
            hooks={[]}
            emptyState={{ title: 'No hooks yet', message: 'Check back soon.', icon: 'inbox' }}
          />
        )}
      </div>
    </>
  )
}
