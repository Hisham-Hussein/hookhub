import type { Hook } from '@/lib/domain/types'
import { HookCard } from '@/app/components/HookCard'

interface HookGridProps {
  hooks: Hook[]
}

const HookGrid = ({ hooks }: HookGridProps) => {
  return (
    <section aria-label="Hook catalog">
      <ul
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-16"
        aria-label={`${hooks.length} hooks`}
      >
        {hooks.map((hook) => (
          <li key={hook.githubRepoUrl} className="list-none">
            <HookCard hook={hook} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export { HookGrid }
