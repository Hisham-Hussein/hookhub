import type { PurposeCategory, LifecycleEvent, Hook } from '../hook-catalog/types'

// Re-export for convenience — consumers of FilterSystem don't need to import hook-catalog directly
export type { PurposeCategory, LifecycleEvent, Hook }

// =============================================================================
// Data Types
// =============================================================================

export interface FilterOption {
  /** Display label shown on the chip (e.g., "Safety", "All") */
  label: string
  /** Value used for filtering and URL params — matches enum value or "all" */
  value: string
  /** Number of hooks matching this option (used for optional count badges) */
  hookCount: number
}

export interface FilterEmptyState {
  /** Heading text for the zero-results state */
  title: string
  /** Explanatory message below the heading */
  message: string
  /** Label for the "Clear all filters" button */
  ctaLabel: string
}

export type CategoryFilterValue = PurposeCategory | 'all'
export type EventFilterValue = LifecycleEvent | 'all'

export interface FilterState {
  /** Currently selected purpose category, or "all" for no category filter */
  category: CategoryFilterValue
  /** Currently selected lifecycle event, or "all" for no event filter */
  event: EventFilterValue
}

export interface TestScenario {
  /** Human-readable description of this test case */
  description: string
  /** Category dimension value for this scenario */
  category: CategoryFilterValue
  /** Event dimension value for this scenario */
  event: EventFilterValue
  /** Expected number of hooks after AND-intersection */
  expectedCount: number
  /** Expected URL query string for this filter state */
  urlParams: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface FilterChipProps {
  /** Display label for the chip */
  label: string
  /** Whether this chip is currently selected */
  isSelected: boolean
  /** Called when the chip is clicked or activated via keyboard */
  onSelect: () => void
  /** Accessible description of the chip's filter action */
  ariaLabel?: string
}

export interface FilterChipRowProps {
  /** Accessible label for the radiogroup (e.g., "Filter by purpose category") */
  ariaLabel: string
  /** The list of filter options to render as chips */
  options: FilterOption[]
  /** The currently selected value in this row */
  selectedValue: string
  /** Called when a chip is selected — receives the option's value */
  onSelect: (value: string) => void
}

export interface FilterBarProps {
  /** Category filter chip options (includes "All" as first item) */
  categoryOptions: FilterOption[]
  /** Event filter chip options (includes "All" as first item) */
  eventOptions: FilterOption[]
  /** Current filter state (both dimensions) */
  filterState: FilterState
  /** Called when the user selects a category chip */
  onCategoryChange?: (value: CategoryFilterValue) => void
  /** Called when the user selects an event chip */
  onEventChange?: (value: EventFilterValue) => void
  /** Called when the user clicks "Clear all filters" from the empty state */
  onClearAll?: () => void
}

export interface FilterSystemProps {
  /** The full list of hooks to filter (from Hook Catalog) */
  hooks: Hook[]
  /** Category filter chip options */
  categoryOptions: FilterOption[]
  /** Event filter chip options */
  eventOptions: FilterOption[]
  /** Fallback content for zero-result AND-intersection */
  filterEmptyState: FilterEmptyState
  /** Called when the filtered result set changes — parent can use this for analytics */
  onFilterChange?: (state: FilterState, resultCount: number) => void
}
