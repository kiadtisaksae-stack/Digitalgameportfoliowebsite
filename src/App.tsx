import { Hero } from './components/Hero';
import { CategoryNav } from './components/CategoryNav';
import { ModelsSection } from './components/ModelsSection';
import { GamesSection } from './components/GamesSection';
import { GameDesignSection } from './components/GameDesignSection';
import { AnimationRiggingSection } from './components/AnimationRiggingSection';
import { SkillsSection } from './components/SkillsSection';
import { Footer } from './components/Footer';
import { MiniGame } from './components/MiniGame';
import { ContactMenu } from './components/ContactMenu';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <ContactMenu />
      <link
        rel="stylesheet"
        type="text/css"
        charSet="UTF-8"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />
      <Hero />
      <CategoryNav />
      
      <div id="game-projects">
        <GamesSection />
      </div>

      <div id="game-design">
        <GameDesignSection />
      </div>

      <div id="animation-rigging">
        <AnimationRiggingSection />
      </div>
      
      <div id="3d-modeling">
        <ModelsSection />
      </div>

      <div id="skills">
        <SkillsSection />
      </div>
      <Footer />
      <MiniGame />
    </div>
  );
}
