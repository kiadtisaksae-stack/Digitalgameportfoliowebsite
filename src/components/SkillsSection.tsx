import { motion } from 'motion/react';
import { Code2, Palette, Box, Zap } from 'lucide-react';

const skillCategories = [
  {
    title: '3D Modeling & Animation',
    icon: Box,
    color: 'from-purple-500 to-pink-500',
    skills: [
      { name: 'Blender', level: 65 },
      { name: 'Maya', level: 75 },
      { name: 'ZBrush', level: 65 },
    ]
  },
  {
    title: 'Game Engines',
    icon: Zap,
    color: 'from-blue-500 to-cyan-500',
    skills: [
      { name: 'Unity', level: 80 },
      { name: 'Unreal Engine', level: 25 },
      { name: 'Godot', level: 25 },
    ]
  },
  {
    title: 'Programming',
    icon: Code2,
    color: 'from-green-500 to-emerald-500',
    skills: [
      { name: 'C#', level: 65 },
      { name: 'C++', level: 35 },
      { name: 'Python', level: 25 },
      { name: 'JavaScript', level: 25 },
    ]
  },
  {
    title: 'Design & Art',
    icon: Palette,
    color: 'from-orange-500 to-red-500',
    skills: [
      { name: 'Photoshop', level: 50 },
      { name: 'Substance Painter', level: 70 },
      { name: 'Illustrator', level: 50 },
      { name: 'After Effects', level: 70 },
    ]
  },
];

export function SkillsSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-full mb-4">
            <Code2 className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400">Technical Skills</span>
          </div>
          <h2 className="text-5xl font-bold mb-4">ทักษะและโปรแกรม</h2>
          <p className="text-gray-400 text-lg mb-8">
            เครื่องมือและเทคโนโลยีที่ใช้ในการสร้างสรรค์ผลงาน
          </p>

          <div className="flex flex-col items-center max-w-lg mx-auto bg-gray-800/30 p-4 rounded-xl border border-gray-700/50">
             <div className="w-full h-2 bg-gray-700 rounded-full relative mb-2">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-500 rounded-full"></div>
                <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full -translate-x-1/2"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
             </div>
             <div className="w-full flex justify-between text-xs text-gray-400 font-mono">
                <span>Beginner (0%)</span>
                <span>Intermediate (70%)</span>
                <span>Advanced (100%)</span>
             </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color}`}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">{category.title}</h3>
              </div>

              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">{skill.name}</span>
                      <span className="text-sm text-gray-400">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                        viewport={{ once: true }}
                        className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
