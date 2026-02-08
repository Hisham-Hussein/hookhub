import type { Hook } from '@/lib/domain/types'
import { getCategoryBadgeStyle } from '@/lib/domain/categories'
import { getEventBadgeStyle } from '@/lib/domain/events'
import { formatStarsCount } from '@/lib/domain/format'
import { StarIcon } from '@/app/components/StarIcon'

interface HookCardProps {
  hook: Hook
}

/**
 * Full (non-abbreviated) star count for screen reader aria-label.
 * E.g., 1247 -> "1,247 GitHub stars"
 */
const starsAriaLabel = (count: number): string => {
  return `${count.toLocaleString()} GitHub stars`
}

const HookCard = ({ hook }: HookCardProps) => {
  const categoryStyle = getCategoryBadgeStyle(hook.purposeCategory)
  const eventStyle = getEventBadgeStyle(hook.lifecycleEvent)

  return (
    <article className="group relative rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 p-5 space-y-3 transition-all duration-200 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-lg hover:shadow-sky-500/[0.03] focus-within:ring-2 focus-within:ring-sky-400/50 focus-within:ring-offset-2 focus-within:ring-offset-white dark:focus-within:ring-offset-black">
      {/* Hook name — stretched link covers full card */}
      <h3 className="font-headline font-light text-lg text-zinc-900 dark:text-zinc-100 leading-snug">
        <a
          href={hook.githubRepoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="after:absolute after:inset-0 after:rounded-xl focus:outline-none hover:text-sky-700 dark:hover:text-sky-300 group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors truncate block"
        >
          {hook.name}
        </a>
      </h3>

      {/* Badges: category (per-category color) + lifecycle event (per-event color) */}
      <div className="flex gap-2 flex-wrap">
        <span className={`relative z-10 inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-light border ${categoryStyle.badgeColor} ${categoryStyle.textColor} tracking-wide`}>
          {hook.purposeCategory}
        </span>
        <span className={`relative z-10 inline-flex items-center px-2.5 py-0.5 rounded text-xs font-light border ${eventStyle.badgeColor} ${eventStyle.textColor} tracking-wide italic`}>
          {hook.lifecycleEvent}
        </span>
      </div>

      {/* Description — 2-line clamp; omit if empty to avoid blank gap */}
      {hook.description && (
        <p className="text-sm text-zinc-700 dark:text-zinc-400 font-light line-clamp-2 leading-relaxed">
          {hook.description}
        </p>
      )}

      {/* Footer: stars + external link indicator */}
      <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-500 pt-1">
        <span
          className="flex items-center gap-1"
          aria-label={starsAriaLabel(hook.starsCount)}
        >
          <StarIcon />
          {formatStarsCount(hook.starsCount)}
        </span>
        <span className="relative z-10 flex items-center gap-1 text-sky-600/70 dark:text-sky-400/70 group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors">
          GitHub
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 12 12"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 9.5l7-7M9.5 2.5H4.5M9.5 2.5v5" />
          </svg>
        </span>
      </div>
    </article>
  )
}

export { HookCard }
