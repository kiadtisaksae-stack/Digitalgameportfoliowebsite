import { Hero } from './components/Hero';
import { GamesSection } from './components/GamesSection';
import { GameDesignSection } from './components/GameDesignSection';
import { AnimationSection } from './components/AnimationSection';
import { ModelsSection } from './components/ModelsSection';
import { SkillsSection } from './components/SkillsSection';
import { Footer } from './components/Footer';
import { MiniGame } from './components/MiniGame';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Hero />
      <div className="space-y-0">
        <GamesSection />
        <GameDesignSection />
        <AnimationSection />
        <ModelsSection />
        <SkillsSection />
      </div>
      <Footer />
      <MiniGame />
    </div>
  );
}
