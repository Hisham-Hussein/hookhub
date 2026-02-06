import type { HookCatalogProps } from '../types'
import { HookCard } from './HookCard'

/**
 * HookCatalog — Responsive card grid displaying all hooks.
 *
 * Renders hooks in a responsive grid:
 *   - Desktop: 3-4 columns (lg:3, xl:4)
 *   - Tablet: 2 columns (sm:2)
 *   - Mobile: 1 column
 *
 * When the hooks array is empty, displays the emptyState content
 * centered in place of the grid.
 *
 * This component only owns the grid layout. Filtering is handled
 * upstream — this renders whatever hooks it receives.
 */
export function HookCatalog({
  hooks,
  emptyState,
  onHookClick,
}: HookCatalogProps) {
  if (hooks.length === 0) {
    return (
      <section
        className="flex flex-col items-center justify-center text-center py-20 px-4"
        aria-label="Hook catalog"
      >
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
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 005.586 13H4"
            />
          </svg>
        </div>

        {/* Empty state text */}
        <h3 className="font-headline font-light text-xl text-zinc-700 dark:text-zinc-300 mb-2">
          {emptyState.title}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-500 font-light max-w-sm leading-relaxed">
          {emptyState.message}
        </p>
      </section>
    )
  }

  return (
    <section aria-label="Hook catalog">
      <ul
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-16"
        aria-label={`${hooks.length} hooks`}
      >
        {hooks.map((hook) => (
          <li key={hook.githubRepoUrl} className="list-none">
            <HookCard hook={hook} onHookClick={onHookClick} />
          </li>
        ))}
      </ul>
    </section>
  )
}
