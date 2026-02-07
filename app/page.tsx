// app/page.tsx
import { HeroBanner } from '@/app/components/HeroBanner'
import { CatalogWithFilters } from '@/app/components/CatalogWithFilters'
import type { Hook } from '@/lib/domain/types'

// Temporary sample data for visual verification (US-004).
// Will be replaced with loadCatalog() data loading in US-003.
const sampleHooks: Hook[] = [
  {
    name: 'safe-rm',
    githubRepoUrl: 'https://github.com/devtools-org/safe-rm-hook',
    purposeCategory: 'Safety',
    lifecycleEvent: 'PreToolUse',
    description: 'Prevents accidental deletion of critical system files and project directories by intercepting rm, rmdir, and unlink commands against a configurable blocklist of protected paths.',
    starsCount: 1247,
    lastUpdated: '2026-01-28',
  },
  {
    name: 'auto-prettier',
    githubRepoUrl: 'https://github.com/fmt-hooks/auto-prettier',
    purposeCategory: 'Formatting',
    lifecycleEvent: 'PostToolUse',
    description: 'Runs Prettier on any file modified by Claude Code, ensuring consistent code formatting without manual intervention. Supports .prettierrc configuration.',
    starsCount: 892,
    lastUpdated: '2026-01-15',
  },
  {
    name: 'slack-notify',
    githubRepoUrl: 'https://github.com/notify-hooks/slack-notify',
    purposeCategory: 'Notification',
    lifecycleEvent: 'Stop',
    description: 'Sends a summary message to a configurable Slack channel when a Claude Code session ends, including files changed and commands run.',
    starsCount: 634,
    lastUpdated: '2026-01-20',
  },
  {
    name: 'test-on-save',
    githubRepoUrl: 'https://github.com/tdd-hooks/test-on-save',
    purposeCategory: 'Testing',
    lifecycleEvent: 'PostToolUse',
    description: 'Automatically runs the relevant test suite after Claude Code modifies a source file, providing immediate feedback on regressions.',
    starsCount: 421,
    lastUpdated: '2026-01-25',
  },
  {
    name: 'secret-scanner',
    githubRepoUrl: 'https://github.com/sec-hooks/secret-scanner',
    purposeCategory: 'Security',
    lifecycleEvent: 'PreToolUse',
    description: 'Scans content for API keys, tokens, and credentials before Claude Code writes to files, preventing accidental secret leaks.',
    starsCount: 1893,
    lastUpdated: '2026-01-30',
  },
  {
    name: 'git-auto-stage',
    githubRepoUrl: 'https://github.com/auto-hooks/git-auto-stage',
    purposeCategory: 'Automation',
    lifecycleEvent: 'PostToolUse',
    description: 'Automatically stages modified files in git after each tool execution, keeping the working tree organized.',
    starsCount: 312,
    lastUpdated: '2026-01-18',
  },
  {
    name: 'change-ledger',
    githubRepoUrl: 'https://github.com/log-hooks/change-ledger',
    purposeCategory: 'Logging',
    lifecycleEvent: 'PostToolUse',
    description: 'Maintains a structured JSON log of all file modifications made during a session for audit and review.',
    starsCount: 178,
    lastUpdated: '2026-01-22',
  },
  {
    name: 'prompt-guard',
    githubRepoUrl: 'https://github.com/safety-hooks/prompt-guard',
    purposeCategory: 'Safety',
    lifecycleEvent: 'UserPromptSubmit',
    description: 'Reviews user prompts for potentially dangerous instructions before they reach the model.',
    starsCount: 2105,
    lastUpdated: '2026-01-29',
  },
  {
    name: 'session-recap',
    githubRepoUrl: 'https://github.com/custom-hooks/session-recap',
    purposeCategory: 'Custom',
    lifecycleEvent: 'Notification',
    description: 'Generates a markdown summary of everything accomplished during a Claude Code session.',
    starsCount: 89,
    lastUpdated: '2026-01-14',
  },
  {
    name: 'eslint-autofix',
    githubRepoUrl: 'https://github.com/fmt-hooks/eslint-autofix',
    purposeCategory: 'Formatting',
    lifecycleEvent: 'PostToolUse',
    description: 'Runs ESLint with --fix on files modified by Claude Code, automatically resolving linting issues.',
    starsCount: 567,
    lastUpdated: '2026-01-26',
  },
  {
    name: 'branch-guard',
    githubRepoUrl: 'https://github.com/safety-hooks/branch-guard',
    purposeCategory: 'Safety',
    lifecycleEvent: 'PreToolUse',
    description: 'Prevents Claude Code from making changes on protected branches like main or production.',
    starsCount: 3451,
    lastUpdated: '2026-02-01',
  },
  {
    name: 'ci-trigger',
    githubRepoUrl: 'https://github.com/auto-hooks/ci-trigger',
    purposeCategory: 'Automation',
    lifecycleEvent: 'Stop',
    description: 'Triggers a CI pipeline run when a Claude Code session completes with uncommitted changes.',
    starsCount: 245,
    lastUpdated: '2026-01-19',
  },
  {
    name: 'snapshot-test-generator',
    githubRepoUrl: 'https://github.com/tdd-hooks/snapshot-test-generator',
    purposeCategory: 'Testing',
    lifecycleEvent: 'PostToolUse',
    description: 'Generates snapshot tests for React components.',
    starsCount: 0,
    lastUpdated: '2026-01-31',
  },
]

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-zinc-300 font-body font-light">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HeroBanner />
        <main id="main-content">
          <CatalogWithFilters hooks={sampleHooks} />
        </main>
      </div>
    </div>
  )
}

export default Home
