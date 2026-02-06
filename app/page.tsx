import { HeroBanner } from "@/app/components/HeroBanner";
import { HookCard } from "@/app/components/HookCard";
import type { Hook } from "@/lib/domain/types";

const sampleHook: Hook = {
  name: 'safe-rm',
  githubRepoUrl: 'https://github.com/devtools-org/safe-rm-hook',
  purposeCategory: 'Safety',
  lifecycleEvent: 'PreToolUse',
  description: 'Prevents accidental deletion of critical system files and project directories.',
  starsCount: 1247,
  lastUpdated: '2026-01-28',
};

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-zinc-300 font-body font-light">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HeroBanner />
        <main id="main-content">
          <div className="max-w-sm mx-auto px-4 py-8">
            <HookCard hook={sampleHook} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
