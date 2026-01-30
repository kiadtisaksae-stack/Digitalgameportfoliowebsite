import { Hero } from './components/Hero';
import { ModelsSection } from './components/ModelsSection';
import { GamesSection } from './components/GamesSection';
import { GameDesignSection } from './components/GameDesignSection'; // ไฟล์ใหม่
import { AnimationSection } from './components/AnimationSection'; // ไฟล์ใหม่
import { SkillsSection } from './components/SkillsSection';
import { Footer } from './components/Footer';
import { MiniGame } from './components/MiniGame';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Hero />
      <GamesSection />
      <GameDesignSection />
      <AnimationSection />
      <ModelsSection />
      <SkillsSection />
      <Footer />
      <MiniGame />
    </div>
  );
}
