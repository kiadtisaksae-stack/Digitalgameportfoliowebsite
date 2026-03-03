import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Gamepad2, Box } from 'lucide-react';

const SKILL_VIDEO_CONFIG = {
  // แก้ไข: ใส่เฉพาะ ID 11 หลักหลังเครื่องหมาย / 
  youtubeId: "RZeI-LqkOvU", 
  title: "Skill Showcase & Growth",
  subTitle: "SKILL EVOLUTION",
  description: "รวบรวมฟุตเทจการพัฒนาทักษะ ตั้งแต่การเขียนโค้ดเริ่มต้น จนถึงโปรเจกต์ที่ซับซ้อนในปัจจุบัน (ความยาว 5 นาที)"
};

export function SkillVideoSection() {
  return (
    <section className="py-20 px-4 bg-black relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 font-mono text-sm">{SKILL_VIDEO_CONFIG.subTitle}</span>
          </div>
          {/* แก้ไขจาก SKILL_VIDEO_DATA เป็น SKILL_VIDEO_CONFIG */}
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{SKILL_VIDEO_CONFIG.title}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">{SKILL_VIDEO_CONFIG.description}</p>
        </motion.div>

        {/* --- ส่วน YouTube Embed --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative aspect-video w-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_-12px_rgba(147,51,234,0.3)] bg-gray-900"
        >
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${SKILL_VIDEO_CONFIG.youtubeId}?rel=0&modestbranding=1`}
            title="YouTube Video Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { icon: Gamepad2, label: 'Game', value: 'ทำมาแล้ว 8 เกม' },
            { icon: Box, label: 'System', value: '15++  System' },
            { icon: Trophy, label: 'Platform', value: 'Mobile-PC' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="p-6 bg-gray-900/50 border border-white/5 rounded-2xl backdrop-blur-sm hover:border-purple-500/30 transition-colors"
            >
              <item.icon className="w-6 h-6 text-purple-400 mb-3" />
              <h4 className="text-white font-semibold">{item.label}</h4>
              <p className="text-gray-500 text-sm mt-1">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
