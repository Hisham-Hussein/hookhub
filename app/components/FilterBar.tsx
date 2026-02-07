'use client'

import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import type { Hook, PurposeCategory } from '@/lib/domain/types'
import { CATEGORIES } from '@/lib/domain/categories'
import { filterHooks } from '@/lib/domain/filter'
import type { FilterState } from '@/lib/domain/filter'

interface FilterBarProps {
  hooks: Hook[]
  onFilterChange: (filteredHooks: Hook[]) => void
}

const selectedCategoryStyles =
  'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30 font-medium shadow-[0_0_12px_rgba(14,165,233,0.08)]'

const inactiveStyles =
  'text-zinc-600 border-zinc-300 hover:border-zinc-400 hover:text-zinc-800 dark:text-zinc-400 dark:border-zinc-700/80 dark:hover:border-zinc-500 dark:hover:text-zinc-300 font-light'

const FilterBar = ({ hooks, onFilterChange }: FilterBarProps) => {
  const [filterState, setFilterState] = useState<FilterState>({
    category: null,
    event: null,
  })

  const chipRefs = useRef<(HTMLButtonElement | null)[]>([])
  const options = useMemo(() => [
    { value: null as PurposeCategory | null, label: 'All' },
    ...CATEGORIES.map((c) => ({ value: c.value as PurposeCategory | null, label: c.label })),
  ], [])
  const [focusedIndex, setFocusedIndex] = useState(0)

  // Compute filtered hooks once, derive count and notify parent
  const filteredHooks = useMemo(() => filterHooks(hooks, filterState), [hooks, filterState])

  useEffect(() => {
    onFilterChange(filteredHooks)
  }, [filteredHooks, onFilterChange])

  const handleCategorySelect = useCallback((value: PurposeCategory | null, index: number) => {
    setFilterState((prev) => ({ ...prev, category: value }))
    setFocusedIndex(index)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const len = options.length

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown': {
          e.preventDefault()
          const next = (focusedIndex + 1) % len
          setFocusedIndex(next)
          chipRefs.current[next]?.focus()
          handleCategorySelect(options[next].value, next)
          break
        }
        case 'ArrowLeft':
        case 'ArrowUp': {
          e.preventDefault()
          const prev = (focusedIndex - 1 + len) % len
          setFocusedIndex(prev)
          chipRefs.current[prev]?.focus()
          handleCategorySelect(options[prev].value, prev)
          break
        }
        case 'Home': {
          e.preventDefault()
          setFocusedIndex(0)
          chipRefs.current[0]?.focus()
          handleCategorySelect(options[0].value, 0)
          break
        }
        case 'End': {
          e.preventDefault()
          const last = len - 1
          setFocusedIndex(last)
          chipRefs.current[last]?.focus()
          handleCategorySelect(options[last].value, last)
          break
        }
        case ' ':
        case 'Enter': {
          e.preventDefault()
          handleCategorySelect(options[focusedIndex].value, focusedIndex)
          break
        }
      }
    },
    [focusedIndex, options, handleCategorySelect],
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
          onKeyDown={handleKeyDown}
          className="flex gap-2 overflow-x-auto sm:overflow-visible sm:flex-wrap pb-1 sm:pb-0"
        >
          {options.map((option, i) => {
            const isSelected = option.value === filterState.category
            return (
              <button
                key={option.label}
                ref={(el) => { chipRefs.current[i] = el }}
                type="button"
                role="radio"
                aria-checked={isSelected}
                tabIndex={i === focusedIndex ? 0 : -1}
                onClick={() => handleCategorySelect(option.value, i)}
                className={`
                  min-h-11 inline-flex items-center px-3.5 py-2 rounded-full text-sm border
                  cursor-pointer select-none whitespace-nowrap
                  motion-safe:transition-all motion-safe:duration-150 motion-safe:ease-out
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black
                  ${isSelected ? selectedCategoryStyles : inactiveStyles}
                `}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Result count -- live region for screen readers */}
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
