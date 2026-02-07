import type { ManifestEntry } from '@/lib/domain/types'
import { isValidPurposeCategory, isValidLifecycleEvent } from '@/lib/domain/types'

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export function validateManifestEntry(entry: ManifestEntry): ValidationResult {
  const errors: string[] = []

  if (!entry.name || typeof entry.name !== 'string') {
    errors.push('name is required and must be a string')
  }

  if (!entry.githubRepoUrl || typeof entry.githubRepoUrl !== 'string') {
    errors.push('githubRepoUrl is required and must be a string')
  } else {
    try {
      const url = new URL(entry.githubRepoUrl)
      if (url.hostname !== 'github.com') {
        errors.push('githubRepoUrl must be a GitHub URL (github.com)')
      }
    } catch {
      errors.push('githubRepoUrl must be a valid URL')
    }
  }

  if (!isValidPurposeCategory(entry.purposeCategory)) {
    errors.push(
      `purposeCategory "${entry.purposeCategory}" is not valid. Must be one of: Safety, Automation, Notification, Formatting, Testing, Security, Logging, Custom`,
    )
  }

  if (!isValidLifecycleEvent(entry.lifecycleEvent)) {
    errors.push(
      `lifecycleEvent "${entry.lifecycleEvent}" is not valid. Must be one of: PreToolUse, PostToolUse, UserPromptSubmit, Notification, Stop`,
    )
  }

  return { valid: errors.length === 0, errors }
}

export function validateManifest(entries: ManifestEntry[]): ValidationResult[] {
  return entries.map(validateManifestEntry)
}
