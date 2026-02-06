import type { PurposeCategory, LifecycleEvent } from '../types'

interface FilterBarProps {
  /** All available purpose categories */
  categories: PurposeCategory[]
  /** All available lifecycle events */
  events: LifecycleEvent[]
  /** Currently active category filter (null = "All") */
  activeCategory?: PurposeCategory | null
  /** Currently active event filter (null = "All") */
  activeEvent?: LifecycleEvent | null
  /** Total number of hooks matching the current filters */
  totalCount: number
  /** Called when user selects a category filter */
  onFilterByCategory?: (category: PurposeCategory | null) => void
  /** Called when user selects an event filter */
  onFilterByEvent?: (event: LifecycleEvent | null) => void
}

/**
 * FilterBar — Dual-dimension toggle chips for filtering hooks.
 *
 * Two rows: purpose categories (sky accent) and lifecycle events (indigo accent).
 * AND-intersection behavior — selecting both a category and event filters to the intersection.
 * "All" chip resets the respective dimension.
 */
export function FilterBar({
  categories,
  events,
  activeCategory = null,
  activeEvent = null,
  totalCount,
  onFilterByCategory,
  onFilterByEvent,
}: FilterBarProps) {
  return (
    <div id="main-content" className="py-4 space-y-3" role="search" aria-label="Filter hooks">
      {/* Category row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-zinc-500 font-light shrink-0">Category:</span>
        <button
          onClick={() => onFilterByCategory?.(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-light border transition-colors ${
            activeCategory === null
              ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
              : 'text-zinc-400 border-zinc-700 hover:border-zinc-500'
          }`}
          aria-pressed={activeCategory === null}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onFilterByCategory?.(category)}
            className={`px-3 py-1.5 rounded-full text-sm font-light border transition-colors ${
              activeCategory === category
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                : 'text-zinc-400 border-zinc-700 hover:border-zinc-500'
            }`}
            aria-pressed={activeCategory === category}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Event row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-zinc-500 font-light shrink-0">Event:</span>
        <button
          onClick={() => onFilterByEvent?.(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-light border transition-colors ${
            activeEvent === null
              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              : 'text-zinc-400 border-zinc-700 hover:border-zinc-500'
          }`}
          aria-pressed={activeEvent === null}
        >
          All
        </button>
        {events.map((event) => (
          <button
            key={event}
            onClick={() => onFilterByEvent?.(event)}
            className={`px-3 py-1.5 rounded-full text-sm font-light border transition-colors ${
              activeEvent === event
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                : 'text-zinc-400 border-zinc-700 hover:border-zinc-500'
            }`}
            aria-pressed={activeEvent === event}
          >
            {event}
          </button>
        ))}
      </div>

      {/* Result count */}
      <p className="text-sm text-zinc-500 font-light">
        Showing {totalCount} {totalCount === 1 ? 'hook' : 'hooks'}
      </p>
    </div>
  )
}
