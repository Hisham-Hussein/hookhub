import type { Theme } from '../types'
import type { Hook } from '../../hook-catalog/types'
import type {
  FilterOption,
  FilterEmptyState,
  FilterState,
} from '../../filter-system/types'
import { FilterSystem } from '../../filter-system/components/FilterSystem'

interface ThemePreviewProps {
  /** Current active theme */
  theme: Theme
  /** Hook data to display in the catalog */
  hooks: Hook[]
  /** Category filter options */
  categoryOptions: FilterOption[]
  /** Event filter options */
  eventOptions: FilterOption[]
  /** Empty state content when filters return zero results */
  filterEmptyState: FilterEmptyState
  /** Toggle between light and dark mode */
  onToggleTheme?: () => void
  /** Called when system theme changes */
  onThemeChange?: (theme: Theme) => void
  /** Called when filter state changes */
  onFilterChange?: (state: FilterState, count: number) => void
  /** Called when a hook card is clicked */
  onHookClick?: (url: string) => void
}

/**
 * ThemePreview — Demonstrates light/dark mode switching across all components.
 *
 * Renders a floating theme toggle pill at the top of the section so reviewers
 * can interactively switch between modes. Below it, the full FilterSystem
 * (which composes FilterBar + HookCatalog) renders so every themed component
 * is visible in one view.
 *
 * The toggle is a demonstration control — in production, the theme follows
 * the system preference automatically via useThemeDetection. No manual toggle
 * ships in the MVP.
 */
export function ThemePreview({
  theme,
  hooks,
  categoryOptions,
  eventOptions,
  filterEmptyState,
  onToggleTheme,
  onFilterChange,
  onHookClick,
}: ThemePreviewProps) {
  return (
    <div className="space-y-6">
      {/* Theme toggle pill — demonstration only, not part of production MVP */}
      <div className="flex items-center justify-center pt-2">
        <button
          type="button"
          onClick={onToggleTheme}
          className="
            group inline-flex items-center gap-3 px-5 py-2.5 rounded-full
            text-sm font-light
            border border-zinc-300 dark:border-zinc-700
            bg-zinc-50 dark:bg-zinc-900
            text-zinc-700 dark:text-zinc-300
            hover:border-zinc-400 dark:hover:border-zinc-500
            hover:bg-zinc-100 dark:hover:bg-zinc-800
            motion-safe:transition-all motion-safe:duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60
            focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black
            cursor-pointer
          "
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {/* Sun icon (light mode indicator) */}
          <svg
            className={`w-4 h-4 motion-safe:transition-colors ${
              theme === 'light'
                ? 'text-amber-500'
                : 'text-zinc-500'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            />
          </svg>

          {/* Toggle track */}
          <div className="relative w-10 h-5 rounded-full bg-zinc-300 dark:bg-zinc-600 motion-safe:transition-colors">
            <div
              className={`
                absolute top-0.5 w-4 h-4 rounded-full
                bg-white shadow-sm
                motion-safe:transition-transform motion-safe:duration-200
                ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0.5'}
              `}
            />
          </div>

          {/* Moon icon (dark mode indicator) */}
          <svg
            className={`w-4 h-4 motion-safe:transition-colors ${
              theme === 'dark'
                ? 'text-sky-400'
                : 'text-zinc-400'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
            />
          </svg>
        </button>
      </div>

      {/* Info badge — explains this is a preview control */}
      <p className="text-center text-xs text-zinc-500 dark:text-zinc-500 font-light">
        Preview toggle — production follows system preference automatically
      </p>

      {/* Full filter system + hook catalog renders below */}
      <FilterSystem
        hooks={hooks}
        categoryOptions={categoryOptions}
        eventOptions={eventOptions}
        filterEmptyState={filterEmptyState}
        onFilterChange={onFilterChange}
        onHookClick={onHookClick}
      />
    </div>
  )
}
