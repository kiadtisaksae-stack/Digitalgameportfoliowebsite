import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export function Hero() {
  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
      
      {/* Animated grid background */}
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
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            3D Models • Game Design • Digital Art
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            สร้างสรรค์ประสบการณ์เกมที่น่าประทับใจด้วยศิลปะดิจิตอลและเทคโนโลยี
          </p>
        </motion.div>

        <motion.button
          onClick={scrollToContent}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <ChevronDown className="w-8 h-8 text-purple-400 animate-bounce" />
        </motion.button>
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-20 left-20 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </section>
  );
}
