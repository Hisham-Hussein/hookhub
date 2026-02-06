// =============================================================================
// Enumerations (Value Objects)
// =============================================================================

export type PurposeCategory =
  | 'Safety'
  | 'Automation'
  | 'Notification'
  | 'Formatting'
  | 'Testing'
  | 'Security'
  | 'Logging'
  | 'Custom'

export type LifecycleEvent =
  | 'PreToolUse'
  | 'PostToolUse'
  | 'UserPromptSubmit'
  | 'Notification'
  | 'Stop'

// =============================================================================
// Data Types
// =============================================================================

export interface HeroContent {
  headline: string
  subtitle: string
}

export interface Hook {
  /** Display name of the hook */
  name: string
  /** Full GitHub repository URL (serves as natural key) */
  githubRepoUrl: string
  /** What the hook does — one of 8 purpose classifications */
  purposeCategory: PurposeCategory
  /** When the hook fires in the Claude Code lifecycle */
  lifecycleEvent: LifecycleEvent
  /** Repository description from GitHub API */
  description: string
  /** GitHub star count (number, formatted for display separately) */
  starsCount: number
  /** Last updated date from GitHub API (ISO date string) */
  lastUpdated: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface LandingAndHeroProps {
  /** The hero banner content (headline and subtitle) */
  heroContent: HeroContent
  /** The full list of hooks to display in the catalog grid below the hero */
  hooks: Hook[]
  /** All available purpose categories (for filter chip rendering) */
  categories: PurposeCategory[]
  /** All available lifecycle events (for filter chip rendering) */
  events: LifecycleEvent[]
  /** Total number of hooks in the catalog */
  totalCount: number
  /** Called when user clicks a hook card to view its GitHub repo */
  onHookClick?: (githubRepoUrl: string) => void
  /** Called when user activates a purpose category filter */
  onFilterByCategory?: (category: PurposeCategory | null) => void
  /** Called when user activates a lifecycle event filter */
  onFilterByEvent?: (event: LifecycleEvent | null) => void
}
