import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Gamepad2, Box, Server } from 'lucide-react';

const VIDEOS = [
  {
    id: "RZeI-LqkOvU",
    title: "Skill Showcase & Growth",
    tag: "OVERALL SKILLS",
    description: "รวบรวมฟุตเทจการพัฒนาทักษะ ตั้งแต่เริ่มต้นจนถึงปัจจุบัน (5 นาที)"
  },
  {
    id: "vVElatLWMCM",
    title: "Project Dungeon11",
    tag: "Netcode / Co-op Multiplayer / Custom Editor",
    description: "โปรเจคนี้ ออกแบบ โดยพยายาม ใช้ Design pattern เป็นเกมที่ออกแบบมาเพื่อให้ Scale ได้ง่าย คนไม่รู้โค้ดด้านใน สามารถ แก้ไข Data ผ่าน Editor ได้"
  },
  {
    id: "8fY7gtjeNcI", 
    title: "Unity NGO Multiplayer System Lobby Relay",
    tag: "NETCODE / MULTIPLAYER",
    description: "ทดลองระบบ multiplayer"
  },
  {
    id: "8RhEJzvzqGs", 
    title: "Game Kaika Adventure",
    tag: "NETCODE / MULTIPLAYER",
    description: "Game Kaika กับระบบ Multiplayer ง่ายๆ เน้นความรวดเร็วในการพัฒนา"
  },
  {
    id: "ClG9eZZm4Lo", 
    title: "Full Game Pumpkin Rush Hotel",
    tag: "Unity / C#",
    description: "โปรเจคเกม Mini Thesis: พัฒนาระบบ Elevator State Machine และ Queue Management"
  }
];

export function SkillVideoSection() {
  return (
    <section className="py-20 px-4 bg-black relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 font-mono text-sm">TECHNICAL DEMONSTRATION</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Development Showcases</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            เจาะลึกทักษะด้านการพัฒนาเกมและการวางระบบ Technical ในโปรเจกต์ต่างๆ
          </p>
        </motion.div>

        {/* --- Video Grid (2 Columns) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {VIDEOS.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center space-y-6"
            >
              {/* Text Info - Moved to Top */}
              <div className="max-w-md">
                <span className="text-[10px] font-mono tracking-widest text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full uppercase">
                  {video.tag}
                </span>
                <h3 className="text-2xl font-bold text-white mt-3 mb-2">{video.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{video.description}</p>
              </div>

              {/* Video Container */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-gray-900 group">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: Gamepad2, label: 'Game Projects', value: '8 Games Developed' },
            { icon: Server, label: 'Multiplayer', value: 'NGO & Relay System' },
            { icon: Box, label: 'System Logic', value: '15+ Core Systems' },
            { icon: Trophy, label: 'Platform', value: 'Mobile & PC' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 bg-gray-900/50 border border-white/5 rounded-2xl backdrop-blur-sm hover:border-purple-500/30 transition-all group"
            >
              <item.icon className="w-6 h-6 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="text-white font-semibold">{item.label}</h4>
              <p className="text-gray-500 text-sm mt-1">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
