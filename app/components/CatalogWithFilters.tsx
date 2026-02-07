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
  const [gridKey, setGridKey] = useState('all')

  const handleFilterChange = useCallback((filtered: Hook[], key: string) => {
    setFilteredHooks(filtered)
    setGridKey(key)
  }, [])

  return (
    <>
      <FilterBar hooks={hooks} onFilterChange={handleFilterChange} />
      <div key={gridKey} className="motion-safe:animate-fade-in">
        <HookGrid hooks={filteredHooks} />
      </div>
    </>
  )
}

export { CatalogWithFilters }
