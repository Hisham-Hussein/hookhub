// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterBar } from '../FilterBar'
import type { Hook } from '@/lib/domain/types'

const makeHook = (overrides: Partial<Hook> = {}): Hook => ({
  name: 'test-hook',
  githubRepoUrl: 'https://github.com/test/hook',
  purposeCategory: 'Safety',
  lifecycleEvent: 'PreToolUse',
  description: 'A test hook.',
  starsCount: 100,
  lastUpdated: '2026-01-01',
  ...overrides,
})

const hooks: Hook[] = [
  makeHook({ name: 'safe-rm', purposeCategory: 'Safety', lifecycleEvent: 'PreToolUse' }),
  makeHook({ name: 'auto-format', purposeCategory: 'Formatting', lifecycleEvent: 'PostToolUse' }),
  makeHook({ name: 'secret-scan', purposeCategory: 'Security', lifecycleEvent: 'PreToolUse' }),
  makeHook({ name: 'test-runner', purposeCategory: 'Testing', lifecycleEvent: 'PostToolUse' }),
  makeHook({ name: 'prompt-guard', purposeCategory: 'Safety', lifecycleEvent: 'UserPromptSubmit' }),
]

describe('FilterBar — "All" category chip (US-014)', () => {
  const onFilterChange = vi.fn()

  it('renders "All" as the first chip in the category radiogroup', () => {
    render(<FilterBar hooks={hooks} onFilterChange={onFilterChange} />)
    const categoryGroup = screen.getByRole('radiogroup', { name: 'Filter by purpose category' })
    const chips = within(categoryGroup).getAllByRole('radio')
    expect(chips[0]).toHaveTextContent('All')
  })

  it('"All" is selected by default (aria-checked="true")', () => {
    render(<FilterBar hooks={hooks} onFilterChange={onFilterChange} />)
    const categoryGroup = screen.getByRole('radiogroup', { name: 'Filter by purpose category' })
    const allChip = within(categoryGroup).getAllByRole('radio')[0]
    expect(allChip).toHaveAttribute('aria-checked', 'true')
  })

  it('clicking a category then clicking "All" calls onFilterChange with all hooks', async () => {
    const user = userEvent.setup()
    render(<FilterBar hooks={hooks} onFilterChange={onFilterChange} />)
    const categoryGroup = screen.getByRole('radiogroup', { name: 'Filter by purpose category' })

    // Select Safety
    const safetyChip = within(categoryGroup).getByRole('radio', { name: 'Safety' })
    await user.click(safetyChip)

    // Click All to reset
    const allChip = within(categoryGroup).getAllByRole('radio')[0]
    await user.click(allChip)

    // Last call should contain all 5 hooks
    const lastCall = onFilterChange.mock.calls[onFilterChange.mock.calls.length - 1]
    expect(lastCall[0]).toHaveLength(5)
    expect(allChip).toHaveAttribute('aria-checked', 'true')
  })

  it('"All" chip uses selected styling when active (visually distinct)', () => {
    render(<FilterBar hooks={hooks} onFilterChange={onFilterChange} />)
    const categoryGroup = screen.getByRole('radiogroup', { name: 'Filter by purpose category' })
    const allChip = within(categoryGroup).getAllByRole('radio')[0]
    const safetyChip = within(categoryGroup).getByRole('radio', { name: 'Safety' })

    // All is selected — should have selected styles, not inactive
    expect(allChip.className).toContain('bg-sky-100')
    expect(safetyChip.className).not.toContain('bg-sky-100')
  })

  it('resetting category does not affect the active event filter', async () => {
    const user = userEvent.setup()
    render(<FilterBar hooks={hooks} onFilterChange={onFilterChange} />)
    const categoryGroup = screen.getByRole('radiogroup', { name: 'Filter by purpose category' })
    const eventGroup = screen.getByRole('radiogroup', { name: 'Filter by lifecycle event' })

    // Select PreToolUse event
    const preToolChip = within(eventGroup).getByRole('radio', { name: 'PreToolUse' })
    await user.click(preToolChip)

    // Select Safety category
    const safetyChip = within(categoryGroup).getByRole('radio', { name: 'Safety' })
    await user.click(safetyChip)

    // Reset category to All
    const allCatChip = within(categoryGroup).getAllByRole('radio')[0]
    await user.click(allCatChip)

    // Event filter should still be PreToolUse — last call should have PreToolUse hooks only
    const lastCall = onFilterChange.mock.calls[onFilterChange.mock.calls.length - 1]
    const filteredHooks = lastCall[0] as Hook[]
    expect(filteredHooks.every((h: Hook) => h.lifecycleEvent === 'PreToolUse')).toBe(true)

    // Event chip should still be checked
    expect(preToolChip).toHaveAttribute('aria-checked', 'true')
  })
})
