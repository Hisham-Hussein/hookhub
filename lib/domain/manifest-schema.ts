import { isValidPurposeCategory, isValidLifecycleEvent } from './types'

export interface SchemaValidationResult {
  valid: boolean
  errors: string[]
}

export function validateManifestSchema(data: unknown): SchemaValidationResult {
  const errors: string[] = []

  if (!Array.isArray(data)) {
    return { valid: false, errors: ['Manifest must be an array'] }
  }

  if (data.length === 0) {
    return { valid: false, errors: ['Manifest must not be empty'] }
  }

  const seenUrls = new Set<string>()

  for (let i = 0; i < data.length; i++) {
    const entry = data[i]
    const prefix = `Entry [${i}]`

    if (typeof entry !== 'object' || entry === null) {
      errors.push(`${prefix}: must be an object`)
      continue
    }

    const obj = entry as Record<string, unknown>

    if (!obj.name || typeof obj.name !== 'string') {
      errors.push(`${prefix}: name is required and must be a string`)
    }

    if (!obj.githubRepoUrl || typeof obj.githubRepoUrl !== 'string') {
      errors.push(`${prefix}: githubRepoUrl is required and must be a string`)
    } else {
      if (seenUrls.has(obj.githubRepoUrl)) {
        errors.push(`${prefix}: duplicate githubRepoUrl "${obj.githubRepoUrl}"`)
      }
      seenUrls.add(obj.githubRepoUrl)
    }

    if (!isValidPurposeCategory(obj.purposeCategory)) {
      errors.push(
        `${prefix}: purposeCategory "${String(obj.purposeCategory)}" is not valid`,
      )
    }

    if (!isValidLifecycleEvent(obj.lifecycleEvent)) {
      errors.push(
        `${prefix}: lifecycleEvent "${String(obj.lifecycleEvent)}" is not valid`,
      )
    }
  }

  return { valid: errors.length === 0, errors }
}
