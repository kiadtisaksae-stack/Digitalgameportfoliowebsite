import { motion } from 'framer-motion';
import { PenTool, Target, Map, Users } from 'lucide-react';

const designConcepts = [
  { title: 'Core Loop', desc: 'การออกแบบระบบการเล่นหลักที่สนุกและดึงดูดผู้เล่น', icon: Target },
  { title: 'Level Design', desc: 'สร้างฉากและประสบการณ์การสำรวจที่น่าจดจำ', icon: Map },
  { title: 'UX/UI', desc: 'หน้าจอที่ใช้งานง่ายและเข้ากับธีมของเกม', icon: Users },
];

export function GameDesignSection() {
  return (
    <section id="game-design" className="py-20 px-4 bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <PenTool className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h2 className="text-4xl font-bold mb-4">Game Design Concept</h2>
          <p className="text-gray-400">แนวคิดการออกแบบเชิงลึกเพื่อให้เกมมีความหมาย</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {designConcepts.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-gray-900/50 rounded-2xl border border-gray-800 hover:border-green-500/50 transition-all"
            >
              <item.icon className="w-10 h-10 text-green-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
