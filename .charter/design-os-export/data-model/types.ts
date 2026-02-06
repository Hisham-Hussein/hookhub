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

export interface HeroContent {
  /** Main headline displayed in the hero banner */
  headline: string
  /** Subtitle displayed below the headline */
  subtitle: string
}

export interface EmptyState {
  /** Heading text for the empty catalog state */
  title: string
  /** Explanatory message shown below the heading */
  message: string
  /** Icon identifier for the empty state illustration */
  icon: string
}
