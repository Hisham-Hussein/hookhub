interface HeroBannerProps {
  headline?: string
  subtitle?: string
}

export function HeroBanner({
  headline = 'Discover Claude Code Hooks',
  subtitle = 'A curated directory of open-source hooks to extend your Claude Code workflow. Browse by category, filter by lifecycle event, and click through to GitHub.',
}: HeroBannerProps) {
  return (
    <section aria-labelledby="hero-heading" className="py-12 lg:py-8 text-center">
      <h1
        id="hero-heading"
        className="font-headline font-light text-3xl sm:text-4xl lg:text-5xl text-zinc-900 dark:text-zinc-100 tracking-tight"
      >
        {headline}
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-zinc-700 dark:text-zinc-400 font-light">
        {subtitle}
      </p>
      <div className="mt-6 text-zinc-400 dark:text-zinc-600" aria-hidden="true">
        ↓
      </div>
    </section>
  )
}
