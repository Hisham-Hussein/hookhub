import type { Hook } from '../types'

interface HookCardProps {
  hook: Hook
  /** Called when user clicks the card to view its GitHub repo */
  onHookClick?: (githubRepoUrl: string) => void
}

/**
 * Format star count for display.
 * Below 1,000: exact number (e.g., "178")
 * At 1,000+: abbreviated with one decimal (e.g., "1.2k")
 */
function formatStars(count: number): string {
  if (count < 1000) return count.toString()
  const k = count / 1000
  return k % 1 === 0 ? `${k}k` : `${k.toFixed(1)}k`
}

/**
 * HookCard — Displays a single hook's metadata in a card format.
 *
 * Shows: name, purpose category badge, lifecycle event badge,
 * description (2-line clamp), star count, and GitHub link.
 */
export function HookCard({ hook, onHookClick }: HookCardProps) {
  return (
    <article
      className="group rounded-xl border border-zinc-800 bg-zinc-950 p-5 space-y-3 hover:border-zinc-600 transition-colors cursor-pointer"
      onClick={() => onHookClick?.(hook.githubRepoUrl)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onHookClick?.(hook.githubRepoUrl)
        }
      }}
      aria-label={`${hook.name} — ${hook.description}`}
    >
      {/* Hook name */}
      <h3 className="font-headline font-light text-lg text-zinc-100 group-hover:text-sky-300 transition-colors">
        {hook.name}
      </h3>

      {/* Badges: category + lifecycle event */}
      <div className="flex gap-2 flex-wrap">
        <span className="px-2 py-0.5 rounded text-xs bg-sky-500/15 text-sky-400 border border-sky-500/20">
          {hook.purposeCategory}
        </span>
        <span className="px-2 py-0.5 rounded text-xs bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
          {hook.lifecycleEvent}
        </span>
      </div>

      {/* Description — 2-line clamp */}
      <p className="text-sm text-zinc-400 font-light line-clamp-2 leading-relaxed">
        {hook.description}
      </p>

      {/* Footer: star count + GitHub link */}
      <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {formatStars(hook.starsCount)}
        </span>
        <span className="text-sky-400 group-hover:text-sky-300 transition-colors">
          View on GitHub →
        </span>
      </div>
    </article>
  )
}
