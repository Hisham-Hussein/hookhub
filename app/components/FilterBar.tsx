'use client'

import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import type { Hook, PurposeCategory, LifecycleEvent } from '@/lib/domain/types'
import { CATEGORIES } from '@/lib/domain/categories'
import { EVENTS } from '@/lib/domain/events'
import { filterHooks } from '@/lib/domain/filter'
import type { FilterState } from '@/lib/domain/filter'

interface FilterBarProps {
  hooks: Hook[]
  onFilterChange: (filteredHooks: Hook[], key: string) => void
}

const selectedCategoryStyles =
  'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30 font-medium shadow-[0_0_12px_rgba(14,165,233,0.08)]'

const selectedEventStyles =
  'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30 font-medium shadow-[0_0_12px_rgba(99,102,241,0.08)]'

const inactiveStyles =
  'text-zinc-600 border-zinc-300 hover:border-zinc-400 hover:text-zinc-800 dark:text-zinc-400 dark:border-zinc-700/80 dark:hover:border-zinc-500 dark:hover:text-zinc-300 font-light'

const chipBaseStyles =
  'min-h-11 inline-flex items-center px-3.5 py-2 rounded-full text-sm border cursor-pointer select-none whitespace-nowrap motion-safe:transition-all motion-safe:duration-150 motion-safe:ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black'

const FilterBar = ({ hooks, onFilterChange }: FilterBarProps) => {
  const [filterState, setFilterState] = useState<FilterState>({
    category: null,
    event: null,
  })

  // --- Category row state ---
  const categoryChipRefs = useRef<(HTMLButtonElement | null)[]>([])
  const categoryOptions = useMemo(() => [
    { value: null as PurposeCategory | null, label: 'All' },
    ...CATEGORIES.map((c) => ({ value: c.value as PurposeCategory | null, label: c.label })),
  ], [])
  const [categoryFocusedIndex, setCategoryFocusedIndex] = useState(0)

  // --- Event row state ---
  const eventChipRefs = useRef<(HTMLButtonElement | null)[]>([])
  const eventOptions = useMemo(() => [
    { value: null as LifecycleEvent | null, label: 'All' },
    ...EVENTS.map((e) => ({ value: e.value as LifecycleEvent | null, label: e.label })),
  ], [])
  const [eventFocusedIndex, setEventFocusedIndex] = useState(0)

  // Compute filtered hooks once
  const filteredHooks = useMemo(() => filterHooks(hooks, filterState), [hooks, filterState])
  const filterKey = `${filterState.category ?? 'all'}:${filterState.event ?? 'all'}`

  useEffect(() => {
    onFilterChange(filteredHooks, filterKey)
  }, [filteredHooks, filterKey, onFilterChange])

  // --- Category handlers ---
  const handleCategorySelect = useCallback((value: PurposeCategory | null, index: number) => {
    setFilterState((prev) => ({ ...prev, category: value }))
    setCategoryFocusedIndex(index)
  }, [])

  const handleCategoryKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const len = categoryOptions.length
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown': {
          e.preventDefault()
          const next = (categoryFocusedIndex + 1) % len
          setCategoryFocusedIndex(next)
          categoryChipRefs.current[next]?.focus()
          handleCategorySelect(categoryOptions[next].value, next)
          break
        }
        case 'ArrowLeft':
        case 'ArrowUp': {
          e.preventDefault()
          const prev = (categoryFocusedIndex - 1 + len) % len
          setCategoryFocusedIndex(prev)
          categoryChipRefs.current[prev]?.focus()
          handleCategorySelect(categoryOptions[prev].value, prev)
          break
        }
        case 'Home': {
          e.preventDefault()
          setCategoryFocusedIndex(0)
          categoryChipRefs.current[0]?.focus()
          handleCategorySelect(categoryOptions[0].value, 0)
          break
        }
        case 'End': {
          e.preventDefault()
          const last = len - 1
          setCategoryFocusedIndex(last)
          categoryChipRefs.current[last]?.focus()
          handleCategorySelect(categoryOptions[last].value, last)
          break
        }
        case ' ':
        case 'Enter': {
          e.preventDefault()
          handleCategorySelect(categoryOptions[categoryFocusedIndex].value, categoryFocusedIndex)
          break
        }
      }
    },
    [categoryFocusedIndex, categoryOptions, handleCategorySelect],
  )

  // --- Event handlers ---
  const handleEventSelect = useCallback((value: LifecycleEvent | null, index: number) => {
    setFilterState((prev) => ({ ...prev, event: value }))
    setEventFocusedIndex(index)
  }, [])

  const handleEventKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const len = eventOptions.length
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown': {
          e.preventDefault()
          const next = (eventFocusedIndex + 1) % len
          setEventFocusedIndex(next)
          eventChipRefs.current[next]?.focus()
          handleEventSelect(eventOptions[next].value, next)
          break
        }
        case 'ArrowLeft':
        case 'ArrowUp': {
          e.preventDefault()
          const prev = (eventFocusedIndex - 1 + len) % len
          setEventFocusedIndex(prev)
          eventChipRefs.current[prev]?.focus()
          handleEventSelect(eventOptions[prev].value, prev)
          break
        }
        case 'Home': {
          e.preventDefault()
          setEventFocusedIndex(0)
          eventChipRefs.current[0]?.focus()
          handleEventSelect(eventOptions[0].value, 0)
          break
        }
        case 'End': {
          e.preventDefault()
          const last = len - 1
          setEventFocusedIndex(last)
          eventChipRefs.current[last]?.focus()
          handleEventSelect(eventOptions[last].value, last)
          break
        }
        case ' ':
        case 'Enter': {
          e.preventDefault()
          handleEventSelect(eventOptions[eventFocusedIndex].value, eventFocusedIndex)
          break
        }
      }
    },
    [eventFocusedIndex, eventOptions, handleEventSelect],
  )

  return (
    <div className="py-5 space-y-3" role="search" aria-label="Filter hooks">
      {/* Category chip row */}
      <div className="flex items-start gap-2.5">
        <span className="text-sm text-zinc-600 dark:text-zinc-500 font-light shrink-0 pt-2.5 select-none">
          Category:
        </span>
        <div
          role="radiogroup"
          aria-label="Filter by purpose category"
          onKeyDown={handleCategoryKeyDown}
          className="flex gap-2 overflow-x-auto sm:overflow-visible sm:flex-wrap pb-1 sm:pb-0"
        >
          {categoryOptions.map((option, i) => {
            const isSelected = option.value === filterState.category
            return (
              <button
                key={option.label}
                ref={(el) => { categoryChipRefs.current[i] = el }}
                type="button"
                role="radio"
                aria-checked={isSelected}
                tabIndex={i === categoryFocusedIndex ? 0 : -1}
                onClick={() => handleCategorySelect(option.value, i)}
                className={`${chipBaseStyles} ${isSelected ? selectedCategoryStyles : inactiveStyles}`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Event chip row */}
      <div className="flex items-start gap-2.5">
        <span className="text-sm text-zinc-600 dark:text-zinc-500 font-light shrink-0 pt-2.5 select-none">
          Event:
        </span>
        <div
          role="radiogroup"
          aria-label="Filter by lifecycle event"
          onKeyDown={handleEventKeyDown}
          className="flex gap-2 overflow-x-auto sm:overflow-visible sm:flex-wrap pb-1 sm:pb-0"
        >
          {eventOptions.map((option, i) => {
            const isSelected = option.value === filterState.event
            return (
              <button
                key={option.label}
                ref={(el) => { eventChipRefs.current[i] = el }}
                type="button"
                role="radio"
                aria-checked={isSelected}
                tabIndex={i === eventFocusedIndex ? 0 : -1}
                onClick={() => handleEventSelect(option.value, i)}
                className={`${chipBaseStyles} ${isSelected ? selectedEventStyles : inactiveStyles}`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Result count — live region for screen readers */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="text-sm text-zinc-600 dark:text-zinc-500 font-light pl-0.5 pt-1"
      >
        Showing {filteredHooks.length} {filteredHooks.length === 1 ? 'hook' : 'hooks'}
      </div>
    </div>
  )
}

export { FilterBar }
