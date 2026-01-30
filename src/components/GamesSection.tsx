import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Gamepad2, ExternalLink } from 'lucide-react';
import Slider from "react-slick";
// Import Assets images
import { Assets } from '../images';
const games = [
  {
    id: 1,
    title: 'Chronicles of the New World',
    genre: 'RPG RolePlay',
    image: Assets.CNW,
    description: 'เกมที่ผมพยายามออกแบบ มาให้ผู้เล่นสามารถเลือก อาชีพ และ การเติบโตได้แบบอิสระ มีระบบ ที่แข็งแรง ที่สุด ที่เคยเขียนมา',
    tech: ['Unity', 'C#']
  },
  {
    id: 2,
    title: 'Arimancer',
    genre: 'RPG Adventrue',
    image: Assets.ari,
    description: 'เกม First Person Shooting ที่เราจะได้รับบทเป็น นักเวท ที่ต้องใช้ ทักษะ ในการ คำนวน คณิตศาสตร์ ',
    tech: ['Unity', 'C#']
  },
  {
    id: 3,
    title: 'Try not to get eat',
    genre: 'Suvival Roglkie',
    image: Assets.tnte,
    description: 'เราจะได้รับบทเป็น นักวิทยาศาสตร์ ที่ต้อง เอาชีวิตรอดจาก เอเลี่ยน',
    tech: ['Unity', 'C#']
  },
];

export function GamesSection() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: false,
    className: "game-slider"
  };

  return (
    <section className="py-20 px-4 bg-gray-900 overflow-hidden">
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

        <Slider {...settings}>
          {games.map((game, index) => (
            <div key={game.id} className="px-2 outline-none">
              <div
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
                  
                  <div className="p-8 md:p-12 flex flex-col justify-center">
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
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <style jsx global>{`
        .game-slider .slick-dots li button:before {
          color: #60a5fa;
        }
        .game-slider .slick-dots li.slick-active button:before {
          color: #3b82f6;
        }
      `}</style>
    </section>
  );
}
