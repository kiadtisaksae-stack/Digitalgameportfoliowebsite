import { motion } from 'framer-motion'; // หรือ 'motion/react' ตามที่คุณติดตั้ง
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Gamepad2, ExternalLink } from 'lucide-react';

// --- ขั้นตอนที่ 1: Import รูปภาพจาก Folder images ---
import cyberRunnerImg from '../images/AutoReto.png';
import fantasyQuestImg from '../images/LobbyRalay.png';

const games = [
  {
    id: 1,
    title: 'Cyber Runner',
    genre: 'Action Platformer',
    // --- ขั้นตอนที่ 2: นำตัวแปรที่ import มาใช้แทน URL ---
    image: cyberRunnerImg,
    description: 'Fast-paced cyberpunk platformer with stunning visuals',
    tech: ['Unity', 'C#', 'Blender']
  },
  {
    id: 2,
    title: 'Fantasy Quest',
    genre: 'RPG Adventure',
    image: fantasyQuestImg,
    description: 'Open-world RPG with immersive storytelling',
    tech: ['Unreal Engine', 'C++', 'Maya']
  },
];

export function GamesSection() {
  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
            <Gamepad2 className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400">Game Projects</span>
          </div>
          <h2 className="text-5xl font-bold mb-4">เกมที่สร้าง</h2>
          <p className="text-gray-400 text-lg">
            โปรเจกต์เกมที่ได้พัฒนาและออกแบบด้วยตนเอง
          </p>
        </motion.div>

        <div className="space-y-8">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl bg-gray-800/50 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="grid md:grid-cols-2 gap-0">
                <div className={`relative aspect-video md:aspect-auto overflow-hidden ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <ImageWithFallback
                    src={game.image}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                </div>
                
                <div className="p-8 md:p-12 flex flex-col justify-col justify-center">
                  <span className="text-sm text-blue-400 font-medium mb-2">{game.genre}</span>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">{game.title}</h3>
                  <p className="text-gray-300 text-lg mb-6">{game.description}</p>
                  
                  <div className="mb-6">
                    <p className="text-sm text-gray-400 mb-2">เทคโนโลยีที่ใช้:</p>
                    <div className="flex flex-wrap gap-2">
                      {game.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors w-fit">
                    <span>ดูรายละเอียด</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
