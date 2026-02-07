// app/page.tsx
import { HeroBanner } from '@/app/components/HeroBanner'
import { CatalogWithFilters } from '@/app/components/CatalogWithFilters'
import { loadCatalog } from '@/lib/application/load-catalog'
import { EnrichedDataReader } from '@/lib/adapters/enriched-data-reader'

const Home = async () => {
  const { hooks } = await loadCatalog(new EnrichedDataReader())

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-body font-light">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HeroBanner />
        <main id="main-content">
          <CatalogWithFilters hooks={hooks} />
        </main>
      </div>
    </div>
  )
}

export default Home
