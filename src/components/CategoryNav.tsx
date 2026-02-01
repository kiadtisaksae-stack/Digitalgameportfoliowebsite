import { motion } from 'motion/react';
import { Gamepad2, PenTool, Bone, Box, Cpu } from 'lucide-react';

const categories = [
  { id: 'game-projects', label: 'Game', icon: Gamepad2, color: 'blue' },
  { id: 'game-design', label: 'Design', icon: PenTool, color: 'purple' },
  { id: 'animation-rigging', label: 'Rigging', icon: Bone, color: 'indigo' },
  { id: '3d-modeling', label: '3D', icon: Box, color: 'violet' },
  { id: 'skills', label: 'Skills', icon: Cpu, color: 'cyan' }
];

export function CategoryNav() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; 
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
    <div className="sticky top-0 z-50 py-3 md:py-6 bg-black/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        {/* ปรับเป็น flex-nowrap และ overflow-x-auto 
            เพื่อให้รูดซ้ายขวาได้ในมือถือ และไม่ตัดขึ้นบรรทัดใหม่ 
        */}
        <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-2 md:gap-4 overflow-x-auto no-scrollbar pb-2 md:pb-0">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => scrollToSection(category.id)}
              className={`
                group flex items-center gap-2 
                px-3 py-2 md:px-6 md:py-3 
                rounded-full flex-shrink-0
                bg-gray-900 border border-gray-700 
                hover:border-purple-500/50 hover:bg-purple-500/10 
                transition-all duration-300
              `}
            >
              {/* ขนาด Icon เล็กลงในมือถือ */}
              <category.icon className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
              
              {/* ตัวหนังสือเล็กลงในมือถือ */}
              <span className="text-xs md:text-sm text-gray-300 group-hover:text-purple-400 font-medium transition-colors whitespace-nowrap">
                {category.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
