import { motion } from 'framer-motion';
import { Activity, Radio, Layers } from 'lucide-react';

const rigData = [
  { title: 'Skeleton Rigging', type: 'Humanoid & Creature', icon: Activity },
  { title: 'IK/FK Systems', type: 'Advanced Bone Control', icon: Radio },
  { title: 'Skinning', type: 'Smooth Mesh Deformation', icon: Layers },
];

export function AnimationSection() {
  return (
    <section id="animation" className="py-20 px-4 bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Activity className="w-12 h-12 text-pink-400 mx-auto mb-4" />
          <h2 className="text-4xl font-bold mb-4">Animation & Rigging</h2>
          <p className="text-gray-400">เบื้องหลังการเคลื่อนไหวที่สมจริงของตัวละคร</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {rigData.map((item, i) => (
            <motion.div 
              key={i}
              className="group p-6 bg-gray-900 rounded-xl border border-gray-800 flex items-center gap-4 hover:bg-pink-500/5 transition-all"
            >
              <div className="p-3 bg-pink-500/10 rounded-lg text-pink-400 group-hover:scale-110 transition-transform">
                <item.icon />
              </div>
              <div>
                <h4 className="font-bold">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.type}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
