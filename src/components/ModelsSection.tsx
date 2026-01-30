import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Box } from 'lucide-react';

const models = [
  {
    id: 1,
    title: 'Character Model',
    category: '3D Character',
    image: 'https://images.unsplash.com/photo-1636189239307-9f3a701f30a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzRCUyMGdhbWUlMjBtb2RlbCUyMGNoYXJhY3RlcnxlbnwxfHx8fDE3Njg4MTQ3MzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Low-poly character model for mobile game'
  },
  {
    id: 2,
    title: 'Environment Asset',
    category: '3D Environment',
    image: 'https://images.unsplash.com/photo-1679322252828-d9dc50e83e12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1lJTIwZW52aXJvbm1lbnQlMjBjb25jZXB0JTIwYXJ0fGVufDF8fHx8MTc2ODgxNDczNnww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Stylized environment props and assets'
  },
  {
    id: 3,
    title: 'Weapon Design',
    category: '3D Props',
    image: 'https://images.unsplash.com/photo-1707312900236-12d6fefd2bbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBzZXR1cCUyMGRhcmt8ZW58MXx8fHwxNzY4ODEyOTI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'High-detail weapon models with PBR textures'
  },
];

export function ModelsSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4">
            <Box className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400">3D Models</span>
          </div>
          <h2 className="text-5xl font-bold mb-4">ผลงานโมเดล 3D</h2>
          <p className="text-gray-400 text-lg">
            โมเดล 3D คุณภาพสูงสำหรับเกมและแอนิเมชัน
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {models.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src={model.image}
                  alt={model.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-6">
                <span className="text-sm text-purple-400 font-medium">{model.category}</span>
                <h3 className="text-xl font-semibold mt-2 mb-2">{model.title}</h3>
                <p className="text-gray-400 text-sm">{model.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}