import { motion } from 'motion/react';
import { Code2, Palette, Box, Zap } from 'lucide-react';

const skillCategories = [
  {
    title: '3D Modeling & Animation',
    icon: Box,
    color: 'from-purple-500 to-pink-500',
    skills: [
      { name: 'Blender', level: 90 },
      { name: 'Maya', level: 85 },
      { name: 'ZBrush', level: 75 },
      { name: '3ds Max', level: 70 },
    ]
  },
  {
    title: 'Game Engines',
    icon: Zap,
    color: 'from-blue-500 to-cyan-500',
    skills: [
      { name: 'Unity', level: 95 },
      { name: 'Unreal Engine', level: 88 },
      { name: 'Godot', level: 65 },
    ]
  },
  {
    title: 'Programming',
    icon: Code2,
    color: 'from-green-500 to-emerald-500',
    skills: [
      { name: 'C#', level: 90 },
      { name: 'C++', level: 80 },
      { name: 'Python', level: 75 },
      { name: 'JavaScript', level: 70 },
    ]
  },
  {
    title: 'Design & Art',
    icon: Palette,
    color: 'from-orange-500 to-red-500',
    skills: [
      { name: 'Photoshop', level: 85 },
      { name: 'Substance Painter', level: 80 },
      { name: 'Illustrator', level: 75 },
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
          <p className="text-gray-400 text-lg">
            เครื่องมือและเทคโนโลยีที่ใช้ในการสร้างสรรค์ผลงาน
          </p>
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
