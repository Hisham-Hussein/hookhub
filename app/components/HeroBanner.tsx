interface HeroBannerProps {
  headline?: string
  subtitle?: string
}

const HeroBanner = ({
  headline = "Discover Claude Code Hooks",
  subtitle = "A curated directory of open-source hooks for Claude Code — browse, filter, and find the right hook for your workflow.",
}: HeroBannerProps = {}) => {
  return (
    <>
      {/* Skip link — first focusable element, bypasses hero to reach main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-sky-500 focus:text-zinc-950 focus:text-sm focus:font-medium focus:outline-none focus:ring-2 focus:ring-sky-300"
        tabIndex={0}
        aria-label="Skip to main content"
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
          {headline}
        </h1>

        {/* Subtitle */}
        <p className="relative mt-4 max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 font-light leading-relaxed">
          {subtitle}
        </p>

        {/* Visual cue — animated downward chevron */}
        <div className="relative mt-6" aria-hidden="true">
          <svg
            className="w-5 h-5 text-zinc-600 animate-gentle-bounce"
            fill="none"
            viewBox="0 0 20 20"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 7l5 5 5-5"
            />
          </svg>
        </div>
      </section>
    </>
  );
};

export { HeroBanner };
