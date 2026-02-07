'use client'

import { useState, useCallback } from 'react'
import type { Hook } from '@/lib/domain/types'
import { FilterBar } from './FilterBar'
import { HookGrid } from './HookGrid'

interface CatalogWithFiltersProps {
  hooks: Hook[]
}

const CatalogWithFilters = ({ hooks }: CatalogWithFiltersProps) => {
  const [filteredHooks, setFilteredHooks] = useState<Hook[]>(hooks)

  const handleFilterChange = useCallback((filtered: Hook[]) => {
    setFilteredHooks(filtered)
  }, [])

  return (
    <>
      <FilterBar hooks={hooks} onFilterChange={handleFilterChange} />
      <HookGrid hooks={filteredHooks} />
    </>
  )
}

export { CatalogWithFilters }
