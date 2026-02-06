# Data Model

## Entities

### Hook

The central entity — an open-source Claude Code hook listed in the directory.

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Display name of the hook |
| `githubRepoUrl` | `string` | Full GitHub repository URL (serves as natural key) |
| `purposeCategory` | `PurposeCategory` | What the hook does — one of 8 classifications |
| `lifecycleEvent` | `LifecycleEvent` | When the hook fires in the Claude Code lifecycle |
| `description` | `string` | Repository description from GitHub API |
| `starsCount` | `number` | GitHub star count |
| `lastUpdated` | `string` | Last updated date (ISO date string) |

### PurposeCategory

An enumeration of what a hook does:

`Safety` | `Automation` | `Notification` | `Formatting` | `Testing` | `Security` | `Logging` | `Custom`

### LifecycleEvent

An enumeration of when a hook fires:

`PreToolUse` | `PostToolUse` | `UserPromptSubmit` | `Notification` | `Stop`

## Relationships

- Hook has one PurposeCategory
- Hook has one LifecycleEvent
- PurposeCategory classifies many Hooks
- LifecycleEvent classifies many Hooks
