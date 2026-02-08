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

describe('FilterBar — "All" event chip (US-016)', () => {
  const onFilterChange = vi.fn()

  it('renders "All" as the first chip in the event radiogroup', () => {
    render(<FilterBar hooks={hooks} onFilterChange={onFilterChange} />)
    const eventGroup = screen.getByRole('radiogroup', { name: 'Filter by lifecycle event' })
    const chips = within(eventGroup).getAllByRole('radio')
    expect(chips[0]).toHaveTextContent('All')
  })

  it('"All" is selected by default (aria-checked="true")', () => {
    render(<FilterBar hooks={hooks} onFilterChange={onFilterChange} />)
    const eventGroup = screen.getByRole('radiogroup', { name: 'Filter by lifecycle event' })
    const allChip = within(eventGroup).getAllByRole('radio')[0]
    expect(allChip).toHaveAttribute('aria-checked', 'true')
  })

  it('clicking an event then clicking "All" calls onFilterChange with all hooks', async () => {
    const user = userEvent.setup()
    render(<FilterBar hooks={hooks} onFilterChange={onFilterChange} />)
    const eventGroup = screen.getByRole('radiogroup', { name: 'Filter by lifecycle event' })

    // Select PostToolUse
    const postChip = within(eventGroup).getByRole('radio', { name: 'PostToolUse' })
    await user.click(postChip)

    // Click All to reset
    const allChip = within(eventGroup).getAllByRole('radio')[0]
    await user.click(allChip)

    // Last call should contain all 5 hooks
    const lastCall = onFilterChange.mock.calls[onFilterChange.mock.calls.length - 1]
    expect(lastCall[0]).toHaveLength(5)
    expect(allChip).toHaveAttribute('aria-checked', 'true')
  })

  it('resetting event does not affect the active category filter', async () => {
    const user = userEvent.setup()
    render(<FilterBar hooks={hooks} onFilterChange={onFilterChange} />)
    const categoryGroup = screen.getByRole('radiogroup', { name: 'Filter by purpose category' })
    const eventGroup = screen.getByRole('radiogroup', { name: 'Filter by lifecycle event' })

    // Select Safety category
    const safetyChip = within(categoryGroup).getByRole('radio', { name: 'Safety' })
    await user.click(safetyChip)

    // Select PostToolUse event
    const postChip = within(eventGroup).getByRole('radio', { name: 'PostToolUse' })
    await user.click(postChip)

    // Reset event to All
    const allEventChip = within(eventGroup).getAllByRole('radio')[0]
    await user.click(allEventChip)

    // Category filter should still be Safety — last call should have Safety hooks only
    const lastCall = onFilterChange.mock.calls[onFilterChange.mock.calls.length - 1]
    const filteredHooks = lastCall[0] as Hook[]
    expect(filteredHooks.every((h: Hook) => h.purposeCategory === 'Safety')).toBe(true)

    // Category chip should still be checked
    expect(safetyChip).toHaveAttribute('aria-checked', 'true')
  })
})
