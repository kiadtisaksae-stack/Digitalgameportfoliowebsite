import { motion } from 'motion/react';
import { Gamepad2, PenTool, Bone, Box, Cpu } from 'lucide-react';

/**
 * ข้อมูลหมวดหมู่ (Data)
 * ใช้สำหรับวนลูปสร้างปุ่ม เพื่อให้โค้ดเป็นระเบียบและแก้ไขง่าย
 */
const categories = [
  { id: 'game-projects', label: 'Game Project', icon: Gamepad2, color: 'blue' },
  { id: 'game-design', label: 'Game Design', icon: PenTool, color: 'purple' },
  { id: 'animation-rigging', label: 'Animation Rigging', icon: Bone, color: 'indigo' },
  { id: '3d-modeling', label: '3D Modeling', icon: Box, color: 'violet' },
  { id: 'skills', label: 'Skills', icon: Cpu, color: 'cyan' }
];

export function CategoryNav() {
  /**
   * ฟังก์ชันเลื่อนหน้าจอ (Smooth Scroll)
   * คำนวณตำแหน่งและเลื่อนไปยัง Section ที่กำหนดโดยไม่ให้เมนูทับหัวข้อ
   */
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; 
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    /**
     * 1. ส่วนควบคุมแถบเมนู (Sticky Container)
     * sticky top-0: ค้างที่ขอบบน
     * z-50: อยู่บนสุด
     * flex justify-end: "จุดสำคัญ" บังคับให้เนื้อหาภายในทั้งหมดไหลไปทางขวาสุดของจอ
     */
    <div className="sticky top-0 z-50 py-3 bg-black/80 backdrop-blur-lg border-b border-white/10 flex justify-end">
      
      {/** * 2. ส่วนกำหนดขอบเขต (Wrapper)
       * w-full: เต็มความกว้าง
       * px-2 md:px-6: เว้นระยะห่างจากขอบจอขวาเพียงเล็กน้อยเพื่อให้ดูชิดมุมจริงๆ
       */}
      <div className="w-full px-2 md:px-6">
        
        {/** * 3. ส่วนจัดเรียงปุ่ม (Flex Row)
         * justify-end: ย้ำอีกครั้งให้ปุ่มเรียงจากขวามาซ้าย
         * overflow-x-auto: รองรับการปัดซ้าย-ขวาในมือถือ (9:16)
         * no-scrollbar: ซ่อนแถบเลื่อนที่ดูไม่สวยงาม
         */}
        <div className="flex flex-nowrap justify-end gap-2 md:gap-3 overflow-x-auto no-scrollbar scroll-smooth">
          
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              // Animation เลื่อนลงมาจากขอบบนตอนโหลดหน้าเว็บ
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => scrollToSection(category.id)}
              
              /**
               * สไตล์ปุ่ม (Button Styling)
               * flex-shrink-0: ป้องกันปุ่มเบี้ยวในมือถือ
               * text-xs / md:text-sm: ปรับขนาดตามหน้าจอให้สมส่วน
               * whitespace-nowrap: บังคับไม่ให้ข้อความตัดขึ้นบรรทัดใหม่
               */
              className={`
                group flex items-center gap-2 
                px-3 py-1.5 md:px-4 md:py-2 
                rounded-full flex-shrink-0
                bg-gray-900/40 border border-gray-800 
                hover:border-purple-500/50 hover:bg-purple-500/10 
                transition-all duration-300
              `}
            >
              <category.icon className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
              <span className="text-[10px] md:text-xs text-gray-300 group-hover:text-purple-400 font-medium transition-colors uppercase tracking-wider">
                {category.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
