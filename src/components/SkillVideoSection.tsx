import { motion } from 'framer-motion';
import { PlayCircle, Trophy, TrendingUp, Gamepad2, Box } from 'lucide-react';

/**
 * 1. ส่วนการจัดการ Asset (Configuration):
 * ปรับแก้ Path ไฟล์ของคุณได้ที่นี่ที่เดียว
 * แนะนำ: ไฟล์วิดีโอขนาดใหญ่ควรอยู่ใน public/ เพื่อประสิทธิภาพในการ Build
 */
const SKILL_VIDEO_DATA = {
  videoSrc: "/videos/skill-progression.mp4", // Path จากโฟลเดอร์ public
  posterImg: "/images/video-thumbnail.jpg",  // รูป Preview ก่อนกดเล่น
  title: "Skill Showcase & Growth",
  subTitle: "SKILL EVOLUTION",
  description: "รวบรวมฟุตเทจการพัฒนาทักษะ ตั้งแต่การเขียนโค้ดเริ่มต้น จนถึงโปรเจกต์ที่ซับซ้อนในปัจจุบัน (ความยาว 5 นาที)"
};

export function SkillVideoSection() {
  return (
    <section className="py-20 px-4 bg-black relative overflow-hidden">
      {/* เอฟเฟกต์แสง Background (Glow Effect) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* --- ส่วนหัวข้อ (Header Section) --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 font-mono text-sm">{SKILL_VIDEO_DATA.subTitle}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{SKILL_VIDEO_DATA.title}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {SKILL_VIDEO_DATA.description}
          </p>
        </motion.div>

        {/* --- ส่วนเครื่องเล่นวิดีโอ (Video Player) --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative group aspect-video w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-gray-900"
        >
          <video 
            controls 
            className="w-full h-full object-cover"
            poster={SKILL_VIDEO_DATA.posterImg} // ดึงจากตัวแปร Asset
          >
            <source src={SKILL_VIDEO_DATA.videoSrc} type="video/mp4" /> {/* ดึงจากตัวแปร Asset */}
            Your browser does not support the video tag.
          </video>

          {/* Hover Overlay: แสดงปุ่ม Play สวยๆ เมื่อเอาเมาส์มาวาง */}
          <div className="absolute inset-0 pointer-events-none group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <PlayCircle className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- ส่วนข้อมูลสถิติ (Mini Stats Grid) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { icon: Gamepad2, label: 'Game Mechanics', value: '2023 - Present' },
            { icon: Box, label: '3D Evolution', value: 'Level 1 to Advanced' },
            { icon: Trophy, label: 'Major Milestones', value: '10+ Big Updates' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="p-6 bg-gray-900/50 border border-white/5 rounded-2xl backdrop-blur-sm"
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
