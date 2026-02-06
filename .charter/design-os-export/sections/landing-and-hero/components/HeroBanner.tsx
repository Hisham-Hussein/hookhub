import type { HeroContent } from '../types'

interface HeroBannerProps {
  /** The hero content (headline and subtitle) */
  heroContent: HeroContent
}

/**
 * HeroBanner — Compact hero section for the HookHub landing page.
 *
 * Static informational section with no interactive elements.
 * Renders a centered headline + subtitle with a visual cue directing
 * attention to the catalog grid below.
 *
 * Fonts: headline uses Poppins Light (via font-headline), subtitle uses Roboto Light (via font-body).
 */
export function HeroBanner({ heroContent }: HeroBannerProps) {
  return (
    <>
      {/* Skip link — first focusable element, bypasses hero to reach main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-sky-500 focus:text-zinc-950 focus:text-sm focus:font-medium focus:outline-none focus:ring-2 focus:ring-sky-300"
      >
        Skip to main content
      </a>

      <section
        aria-labelledby="hero-heading"
        className="relative flex flex-col items-center justify-center text-center py-14 sm:py-12 md:py-10 lg:py-8"
      >
        {/* Subtle ambient glow behind hero text */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_center,_rgba(56,189,248,0.06)_0%,_rgba(99,102,241,0.03)_40%,_transparent_70%)] blur-2xl" />
        </div>

        {/* Headline */}
        <h1
          id="hero-heading"
          className="relative font-headline font-light text-3xl sm:text-4xl lg:text-5xl text-zinc-100 tracking-tight"
        >
          {heroContent.headline}
        </h1>

        {/* Subtitle */}
        <p className="relative mt-4 max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 font-light leading-relaxed">
          {heroContent.subtitle}
        </p>

        {/* Visual cue — animated downward chevron */}
        <div className="relative mt-6" aria-hidden="true">
          <svg
            className="w-5 h-5 text-zinc-600 animate-[gentle-bounce_2s_ease-in-out_infinite]"
            fill="none"
            viewBox="0 0 20 20"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 7l5 5 5-5" />
          </svg>
        </div>

        {/* Inline keyframes for the bounce animation */}
        <style>{`
          @keyframes gentle-bounce {
            0%, 100% { transform: translateY(0); opacity: 0.6; }
            50% { transform: translateY(6px); opacity: 1; }
          }
        `}</style>
      </section>
    </>
  )
}
