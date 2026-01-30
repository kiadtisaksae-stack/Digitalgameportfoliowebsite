import { motion } from 'framer-motion';
import { ChevronDown, Gamepad2, PenTool, Activity, Box } from 'lucide-react';

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const categories = [
    { id: 'game-projects', label: 'Game Project', icon: Gamepad2, color: 'hover:bg-blue-500/20 hover:border-blue-500/50' },
    { id: 'game-design', label: 'Game Design', icon: PenTool, color: 'hover:bg-green-500/20 hover:border-green-500/50' },
    { id: 'animation', label: 'Animation Rigging', icon: Activity, color: 'hover:bg-pink-500/20 hover:border-pink-500/50' },
    { id: '3d-modeling', label: '3D Modeling', icon: Box, color: 'hover:bg-purple-500/20 hover:border-purple-500/50' },
  ];

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(to_right,#4f4f4f_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Game Developer
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            สร้างสรรค์ประสบการณ์เกมที่น่าประทับใจด้วยศิลปะดิจิตอลและเทคโนโลยี
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToSection(cat.id)}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl bg-gray-800/40 border border-gray-700/50 transition-all duration-300 group ${cat.color}`}
            >
              <cat.icon className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
              <span className="text-sm font-medium text-gray-300 group-hover:text-white">{cat.label}</span>
            </button>
          ))}
        </motion.div>

        <motion.button
          onClick={() => scrollToSection('game-projects')}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <ChevronDown className="w-8 h-8 text-purple-400 animate-bounce" />
        </motion.button>
      </div>
    </section>
  );
}
