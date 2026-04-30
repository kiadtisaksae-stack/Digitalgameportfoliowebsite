import { motion } from 'motion/react';
import { Gamepad2, PenTool, Bone, Box, Cpu, FileText } from 'lucide-react';

// แก้ชื่อไฟล์ PDF ตรงนี้ได้เลย
import portfolioPdf from '../assets/my-portfolio.pdf';

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
      const offset = 100;
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

  const openPortfolioPdf = () => {
    window.open(portfolioPdf, '_blank', 'noopener,noreferrer');
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          hoverBorder: 'hover:border-blue-500/50',
          hoverBg: 'hover:bg-blue-500/10',
          icon: 'group-hover:text-blue-400',
          text: 'group-hover:text-blue-400'
        };
      case 'purple':
        return {
          hoverBorder: 'hover:border-purple-500/50',
          hoverBg: 'hover:bg-purple-500/10',
          icon: 'group-hover:text-purple-400',
          text: 'group-hover:text-purple-400'
        };
      case 'indigo':
        return {
          hoverBorder: 'hover:border-indigo-500/50',
          hoverBg: 'hover:bg-indigo-500/10',
          icon: 'group-hover:text-indigo-400',
          text: 'group-hover:text-indigo-400'
        };
      case 'violet':
        return {
          hoverBorder: 'hover:border-violet-500/50',
          hoverBg: 'hover:bg-violet-500/10',
          icon: 'group-hover:text-violet-400',
          text: 'group-hover:text-violet-400'
        };
      case 'cyan':
        return {
          hoverBorder: 'hover:border-cyan-500/50',
          hoverBg: 'hover:bg-cyan-500/10',
          icon: 'group-hover:text-cyan-400',
          text: 'group-hover:text-cyan-400'
        };
      default:
        return {
          hoverBorder: 'hover:border-gray-500/50',
          hoverBg: 'hover:bg-gray-500/10',
          icon: 'group-hover:text-gray-400',
          text: 'group-hover:text-gray-400'
        };
    }
  };

  return (
    <div className="sticky top-0 z-50 py-6 bg-black/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category, index) => {
            const colorClasses = getColorClasses(category.color);

            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => scrollToSection(category.id)}
                className={`
                  group flex items-center gap-2 px-6 py-3 rounded-full
                  bg-gray-900 border border-gray-700
                  ${colorClasses.hoverBorder} ${colorClasses.hoverBg}
                  transition-all duration-300
                `}
              >
                <category.icon
                  className={`
                    w-5 h-5 text-gray-400
                    ${colorClasses.icon}
                    transition-colors
                  `}
                />

                <span
                  className={`
                    text-gray-300
                    ${colorClasses.text}
                    font-medium transition-colors
                  `}
                >
                  {category.label}
                </span>
              </motion.button>
            );
          })}

          <motion.button
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: categories.length * 0.1 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            onClick={openPortfolioPdf}
            className="
              group flex items-center gap-2 px-7 py-3 rounded-full
              bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500
              text-white font-semibold
              border border-white/30
              shadow-lg shadow-purple-500/30
              hover:shadow-cyan-500/40
              hover:brightness-110
              transition-all duration-300
            "
          >
            <FileText className="w-5 h-5 text-white group-hover:rotate-6 transition-transform" />
            <span>My Portfolio</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
