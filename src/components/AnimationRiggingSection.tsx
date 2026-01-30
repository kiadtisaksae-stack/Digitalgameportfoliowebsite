import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Bone, PlayCircle, Layers, Youtube } from 'lucide-react';

const animations = [
  {
    id: 1,
    title: 'Combat Animation Set',
    category: 'Character Animation',
    image: 'https://images.unsplash.com/photo-1634473111040-4ab1f1e9dab0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMGNoYXJhY3RlciUyMHJpZ2dpbmclMjBza2VsZXRvbiUyMGFuaW1hdGlvbnxlbnwxfHx8fDE3Njk3ODczNDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Attack, block, and dodge animations for the main hero.',
    videoUrl: 'https://youtu.be/4XzeA9RNhQ8?si=fAsxBkr5_j4OTwqY'
  },
  {
    id: 2,
    title: 'Advanced Facial Rig',
    category: 'Rigging',
    image: 'https://images.unsplash.com/photo-1617396900799-f4ec2b43c7ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMGZhY2UlMjBtZXNofGVufDF8fHx8MTc2OTc4NzM4NHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Full facial rig with 52 blendshapes for ARKit compatibility.',
    videoUrl: 'https://youtu.be/4XzeA9RNhQ8?si=fAsxBkr5_j4OTwqY'
  },
  {
    id: 3,
    title: 'Creature Locomotion',
    category: 'Creature Animation',
    image: 'https://images.unsplash.com/photo-1599590984817-0c15f45b64a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltYWwlMjBza2VsZXRvbnxlbnwxfHx8fDE3Njk3ODczOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Walk, trot, and gallop cycles for a quadruped creature.',
    videoUrl: 'https://youtu.be/4XzeA9RNhQ8?si=fAsxBkr5_j4OTwqY'
  }
];

export function AnimationRiggingSection() {
  const openVideo = (url: string) => {
    window.open(url, '_blank');
  };

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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
            <Bone className="w-5 h-5 text-indigo-400" />
            <span className="text-indigo-400">Animation & Rigging</span>
          </div>
          <h2 className="text-5xl font-bold mb-4">แอนิเมชันและริกกิ้ง</h2>
          <p className="text-gray-400 text-lg">
            การสร้างการเคลื่อนไหวและโครงกระดูกสำหรับตัวละคร 3D
          </p>
        </motion.div>

        <div className="space-y-6">
          {animations.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => openVideo(item.videoUrl)}
              className="group flex flex-col md:flex-row gap-6 bg-black/40 border border-white/5 p-4 rounded-2xl hover:bg-black/60 hover:border-indigo-500/30 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="w-full md:w-64 aspect-video rounded-xl overflow-hidden flex-shrink-0 relative">
                <ImageWithFallback
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Youtube className="w-12 h-12 text-red-500 fill-current" />
                </div>
              </div>
              
              <div className="flex flex-col justify-center flex-grow relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 text-xs rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/20">
                    {item.category}
                  </span>
                  <div className="h-px flex-grow bg-white/10" />
                </div>
                
                <h3 className="text-2xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                <p className="text-gray-400 mb-4">{item.description}</p>
                
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Layers className="w-4 h-4" />
                    <span>Rigging</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <PlayCircle className="w-4 h-4" />
                    <span>Animation</span>
                  </div>
                </div>
              </div>
              
              {/* Hover effect background */}
              <div className="absolute inset-0 bg-indigo-500/5 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out z-0" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
