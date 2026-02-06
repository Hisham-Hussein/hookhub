import { HeroBanner } from "@/app/components/HeroBanner";

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-zinc-300 font-body font-light">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HeroBanner />
        {/* Placeholder for hook grid — will be added in US-003 */}
        <div id="main-content" />
      </div>
    </div>
  );
};

export default Home;
