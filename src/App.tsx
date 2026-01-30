import { Hero } from './components/Hero';
import { ModelsSection } from './components/ModelsSection';
import { GamesSection } from './components/GamesSection';
import { SkillsSection } from './components/SkillsSection';
import { Footer } from './components/Footer';
import { MiniGame } from './components/MiniGame';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Hero />
      <ModelsSection />
      <GamesSection />
      <SkillsSection />
      <Footer />
      <MiniGame />
    </div>
  );
}