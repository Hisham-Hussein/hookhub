import { useRef, useState, useEffect, useCallback } from 'react'
import type { FilterOption } from '../types'
import { FilterChip } from './FilterChip'

interface FilterChipRowProps {
  /** Accessible label for the radiogroup (e.g., "Filter by purpose category") */
  ariaLabel: string
  /** Row label displayed before the chips (e.g., "Category") */
  rowLabel: string
  /** The filter options to render as chips */
  options: FilterOption[]
  /** Currently selected value in this row */
  selectedValue: string
  /** Called when a chip is selected — receives the option's value */
  onSelect: (value: string) => void
  /** Color variant — category uses sky, event uses indigo */
  variant: 'category' | 'event'
}

/**
 * FilterChipRow — A horizontal row of radio chips with roving tabindex.
 *
 * Implements the WAI-ARIA Radio Group pattern:
 * - Container: role="radiogroup" with descriptive aria-label
 * - Each chip: role="radio" with aria-checked
 * - Tab enters group → focuses selected chip (or first if none)
 * - Arrow Left/Right: move focus AND select (standard radio behavior)
 * - Home/End: jump to first/last chip
 * - Space/Enter: confirm current selection
 * - Tab exits group
 *
 * On mobile, chips scroll horizontally when they overflow. On tablet+,
 * chips wrap naturally to multiple lines.
 */
export function FilterChipRow({
  ariaLabel,
  rowLabel,
  options,
  selectedValue,
  onSelect,
  variant,
}: FilterChipRowProps) {
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Track which chip index has tabIndex=0 (the roving focus target)
  const [focusedIndex, setFocusedIndex] = useState(() => {
    const idx = options.findIndex((o) => o.value === selectedValue)
    return idx >= 0 ? idx : 0
  })

  // Sync focused index when selected value changes externally
  useEffect(() => {
    const idx = options.findIndex((o) => o.value === selectedValue)
    if (idx >= 0) setFocusedIndex(idx)
  }, [selectedValue, options])

  const moveFocus = useCallback(
    (newIndex: number) => {
      setFocusedIndex(newIndex)
      chipRefs.current[newIndex]?.focus()
      // Arrow keys both move focus AND select (standard radio group behavior)
      onSelect(options[newIndex].value)
    },
    [onSelect, options],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const len = options.length

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault()
          moveFocus((focusedIndex + 1) % len)
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          moveFocus((focusedIndex - 1 + len) % len)
          break
        case 'Home':
          e.preventDefault()
          moveFocus(0)
          break
        case 'End':
          e.preventDefault()
          moveFocus(len - 1)
          break
        case ' ':
        case 'Enter':
          e.preventDefault()
          onSelect(options[focusedIndex].value)
          break
      }
    },
    [focusedIndex, moveFocus, onSelect, options],
  )

  return (
    <div className="flex items-start gap-2.5">
      <span className="text-sm text-zinc-600 dark:text-zinc-500 font-light shrink-0 pt-2.5 select-none">
        {rowLabel}:
      </span>
      <div
        role="radiogroup"
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        className="flex gap-2 overflow-x-auto sm:overflow-visible sm:flex-wrap pb-1 sm:pb-0"
      >
        {options.map((option, i) => (
          <FilterChip
            key={option.value}
            ref={(el) => {
              chipRefs.current[i] = el
            }}
            label={option.label}
            isSelected={option.value === selectedValue}
            onSelect={() => {
              setFocusedIndex(i)
              onSelect(option.value)
            }}
            variant={variant}
            tabIndex={i === focusedIndex ? 0 : -1}
          />
        ))}
      </div>
    </div>
  )
}
