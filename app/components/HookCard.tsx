import type { Hook } from '@/lib/domain/types'
import { getCategoryBadgeStyle } from '@/lib/domain/categories'
import { getEventBadgeStyle } from '@/lib/domain/events'

interface HookCardProps {
  hook: Hook
}

/**
 * Format star count for display.
 * Below 1,000: exact number (e.g., "178")
 * At 1,000+: abbreviated with one decimal (e.g., "1.2k")
 */
const formatStars = (count: number): string => {
  if (count < 1000) return count.toString()
  const k = count / 1000
  return k % 1 === 0 ? `${k}k` : `${k.toFixed(1)}k`
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

      {/* Description — 2-line clamp */}
      <p className="text-sm text-zinc-700 dark:text-zinc-400 font-light line-clamp-2 leading-relaxed">
        {hook.description}
      </p>

      {/* Footer: stars + external link indicator */}
      <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-500 pt-1">
        <span
          className="flex items-center gap-1"
          aria-label={starsAriaLabel(hook.starsCount)}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {formatStars(hook.starsCount)}
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
