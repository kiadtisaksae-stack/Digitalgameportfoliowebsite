import { motion } from 'motion/react';
import { Gamepad2, PenTool, Bone, Box, Cpu, FileText } from 'lucide-react';

// แก้ชื่อไฟล์ PDF ตรงนี้ได้เลย
import portfolioPdf from '../assets/Portfolio.pdf';

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

          {/* My Portfolio Button */}
          <motion.button
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              boxShadow: [
                '0 0 20px rgba(168, 85, 247, 0.35)',
                '0 0 35px rgba(34, 211, 238, 0.45)',
                '0 0 20px rgba(16, 185, 129, 0.35)'
              ]
            }}
            transition={{
              delay: 0,
              duration: 0.5,
              boxShadow: {
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse'
              }
            }}
            whileHover={{
              scale: 1.1,
              y: -3
            }}
            whileTap={{ scale: 0.96 }}
            onClick={openPortfolioPdf}
            className="
              relative group overflow-hidden
              flex items-center gap-2 px-8 py-3 rounded-full
              bg-gradient-to-r from-purple-600 via-cyan-500 to-emerald-400
              text-white font-bold
              border border-cyan-300/60
              shadow-lg shadow-cyan-500/30
              hover:shadow-emerald-400/50
              transition-all duration-300
            "
          >
            <span
              className="
                absolute inset-0 -translate-x-full
                bg-gradient-to-r from-transparent via-white/35 to-transparent
                group-hover:translate-x-full
                transition-transform duration-700
              "
            />

            <span
              className="
                absolute inset-0 rounded-full
                bg-gradient-to-r from-purple-500/30 via-cyan-400/30 to-emerald-400/30
                blur-md opacity-70
                group-hover:opacity-100
                transition-opacity duration-300
              "
            />

            <FileText
              className="
                relative z-10 w-5 h-5 text-white
                group-hover:rotate-12 group-hover:scale-110
                transition-transform duration-300
              "
            />

            <span className="relative z-10 tracking-wide">
              My Portfolio
            </span>
          </motion.button>

          {categories.map((category, index) => {
            const colorClasses = getColorClasses(category.color);

            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index + 1) * 0.1 }}
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
        </div>
      </div>
    </div>
  );
}
  );
}
