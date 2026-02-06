# One-Shot Implementation Prompt

I need you to implement a complete web application based on detailed design specifications and UI components I'm providing.

## Instructions

Please carefully read and analyze the following files:

1. **@product-plan/product-overview.md** — Product summary with sections and data model overview
2. **@product-plan/instructions/one-shot-instructions.md** — Complete implementation instructions for all milestones

After reading these, also review:
- **@product-plan/design-system/** — Color and typography tokens
- **@product-plan/data-model/** — Entity types and relationships
- **@product-plan/shell/** — Application shell components
- **@product-plan/sections/** — All section components, types, sample data, and test instructions

## Before You Begin

Please ask me clarifying questions about:

1. **Data Source & Build Process**
   - HookHub uses a curator-managed manifest enriched at build time via GitHub API
   - How should the manifest be structured? (JSON file, headless CMS, database?)
   - What build pipeline should enrich the manifest? (Node script, CI/CD step?)

2. **Deployment & Hosting**
   - Should this be a static site (SSG) or server-rendered (SSR)?
   - What hosting platform? (Vercel, Netlify, Cloudflare Pages, self-hosted?)
   - Do you need a CDN or custom domain setup?

3. **Tech Stack Preferences**
   - What React meta-framework? (Next.js, Remix, Vite + React Router, Astro?)
   - CSS approach? (Tailwind is designed in — confirm or override)
   - Package manager? (npm, pnpm, yarn?)

4. **GitHub API Integration**
   - Rate limiting strategy for build-time enrichment
   - Caching strategy for star counts and descriptions
   - Error handling for unavailable repositories

5. **Any Other Clarifications**
   - SEO requirements (meta tags, Open Graph, sitemap?)
   - Analytics integration (Plausible, Fathom, GA4?)
   - Future plans for submission workflow or community contributions?

Lastly, be sure to ask me if I have any other notes to add for this implementation.

Once I answer your questions, create a comprehensive implementation plan before coding.
