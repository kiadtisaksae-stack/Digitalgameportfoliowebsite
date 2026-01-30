import { motion } from 'motion/react';
import { Gamepad2, PenTool, Bone, Box, Cpu } from 'lucide-react';

const categories = [
  {
    id: 'game-projects',
    label: 'Game Project',
    icon: Gamepad2,
    color: 'blue'
  },
  {
    id: 'game-design',
    label: 'Game Design',
    icon: PenTool,
    color: 'purple'
  },
  {
    id: 'animation-rigging',
    label: 'Animation Rigging',
    icon: Bone,
    color: 'indigo'
  },
  {
    id: '3d-modeling',
    label: '3D Modeling',
    icon: Box,
    color: 'violet'
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: Cpu,
    color: 'cyan'
  }
];

export function CategoryNav() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Height of sticky header if any, or just some padding
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="sticky top-0 z-50 py-6 bg-black/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => scrollToSection(category.id)}
              className={`
                group flex items-center gap-2 px-6 py-3 rounded-full 
                bg-gray-900 border border-gray-700 
                hover:border-${category.color}-500/50 hover:bg-${category.color}-500/10 
                transition-all duration-300
              `}
            >
              <category.icon className={`w-5 h-5 text-gray-400 group-hover:text-${category.color}-400 transition-colors`} />
              <span className={`text-gray-300 group-hover:text-${category.color}-400 font-medium transition-colors`}>
                {category.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
