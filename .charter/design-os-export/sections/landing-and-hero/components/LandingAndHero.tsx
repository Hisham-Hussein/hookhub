import type { LandingAndHeroProps, PurposeCategory, LifecycleEvent } from '../types'
import { HeroBanner } from './HeroBanner'
import { FilterBar } from './FilterBar'
import { HookCard } from './HookCard'

/**
 * LandingAndHero — Full page component for HookHub's landing experience.
 *
 * Composes the hero banner, filter bar, and hook card grid.
 * Designed to render inside the AppShell which provides the dark background,
 * max-w-7xl container, and base typography.
 *
 * This is the shell section (wraps the entire page content).
 * All data comes via props — never imports data directly.
 */
export function LandingAndHero({
  heroContent,
  hooks,
  categories,
  events,
  totalCount,
  onHookClick,
  onFilterByCategory,
  onFilterByEvent,
}: LandingAndHeroProps & {
  activeCategory?: PurposeCategory | null
  activeEvent?: LifecycleEvent | null
}) {
  return (
    <>
      {/* Hero section — compact, static, directs attention downward */}
      <HeroBanner heroContent={heroContent} />

      {/* Filter bar — dual-dimension toggle chips */}
      <FilterBar
        categories={categories}
        events={events}
        totalCount={totalCount}
        onFilterByCategory={onFilterByCategory}
        onFilterByEvent={onFilterByEvent}
      />

      {/* Hook card grid — responsive columns */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4 pb-16"
        role="list"
        aria-label="Hook catalog"
      >
        {hooks.map((hook) => (
          <div key={hook.githubRepoUrl} role="listitem">
            <HookCard hook={hook} onHookClick={onHookClick} />
          </div>
        ))}
      </div>
    </>
  )
}
