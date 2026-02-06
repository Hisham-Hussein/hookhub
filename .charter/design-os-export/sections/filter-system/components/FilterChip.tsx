import { forwardRef } from 'react'

type ChipVariant = 'category' | 'event'

interface FilterChipProps {
  /** Display label for the chip */
  label: string
  /** Whether this chip is currently selected (checked) */
  isSelected: boolean
  /** Called when the chip is activated via click or keyboard */
  onSelect: () => void
  /** Color variant — category uses sky, event uses indigo */
  variant: ChipVariant
  /** Managed by parent FilterChipRow for roving tabindex */
  tabIndex: number
}

const selectedStyles: Record<ChipVariant, string> = {
  category:
    'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30 font-medium shadow-[0_0_12px_rgba(14,165,233,0.08)]',
  event:
    'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30 font-medium shadow-[0_0_12px_rgba(99,102,241,0.08)]',
}

const inactiveStyles =
  'text-zinc-600 border-zinc-300 hover:border-zinc-400 hover:text-zinc-800 dark:text-zinc-400 dark:border-zinc-700/80 dark:hover:border-zinc-500 dark:hover:text-zinc-300 font-light'

/**
 * FilterChip — A single toggle chip with radio semantics.
 *
 * Uses `role="radio"` with `aria-checked` inside a parent `role="radiogroup"`.
 * Roving tabindex managed by FilterChipRow — only the focused chip has tabIndex=0.
 *
 * Visual treatment:
 * - Selected: filled background with subtle glow + medium font weight
 * - Inactive: outlined border, light font weight
 * - Category dimension: sky accent
 * - Event dimension: indigo accent
 *
 * Transitions: 150ms ease-out for all visual properties.
 * prefers-reduced-motion: transitions removed, state changes remain instant.
 */
export const FilterChip = forwardRef<HTMLButtonElement, FilterChipProps>(
  function FilterChip({ label, isSelected, onSelect, variant, tabIndex }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={isSelected}
        tabIndex={tabIndex}
        onClick={onSelect}
        className={`
          min-h-11 inline-flex items-center px-3.5 py-2 rounded-full text-sm border
          cursor-pointer select-none whitespace-nowrap
          motion-safe:transition-all motion-safe:duration-150 motion-safe:ease-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black
          ${isSelected ? selectedStyles[variant] : inactiveStyles}
        `}
      >
        {label}
      </button>
    )
  },
)
