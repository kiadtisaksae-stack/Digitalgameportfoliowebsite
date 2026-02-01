import { motion } from 'motion/react';
import { Gamepad2, PenTool, Bone, Box, Cpu } from 'lucide-react';

/**
 * 1. ส่วนการประกาศข้อมูล (Data Structure):
 * เก็บข้อมูลหมวดหมู่เป็น Array เพื่อให้นำไปวนลูป (Map) สร้างปุ่มได้ง่าย
 * ช่วยให้การแก้ไขชื่อหมวดหมู่หรือเปลี่ยนไอคอนทำได้จากที่เดียว
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
   * 2. ส่วนฟังก์ชันการนำทาง (Smooth Scrolling):
   * คำนวณตำแหน่งของ Element ตาม id ที่ส่งมา
   * มีการใช้ offset เพื่อหักลบความสูงของแถบเมนู ไม่ให้แถบเมนูไปทับหัวข้อเนื้อหา
   */
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // ระยะเผื่อด้านบนเพื่อให้หัวข้อไม่โดนเมนูบัง
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
     * 3. โครงสร้างแถบเมนู (Sticky Header):
     * sticky top-0: ทำให้แถบค้างอยู่ที่ขอบบนสุดเสมอ
     * z-50: กำหนดให้อยู่เลเยอร์หน้าสุด
     * bg-black/80 backdrop-blur-lg: ทำพื้นหลังโปร่งแสงและเบลอฉากหลังให้ดูทันสมัย
     */
    <div className="sticky top-0 z-50 py-3 bg-black/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        
        {/**
         * 4. ส่วนจัดวางตำแหน่ง (Alignment & Responsive):
         * flex-nowrap: ป้องกันไม่ให้ปุ่มตัดขึ้นบรรทัดใหม่ในมือถือ
         * justify-end: "หัวใจหลัก" ที่ทำให้ปุ่มทั้งหมดไปชิดมุมบนขวาเสมอ
         * overflow-x-auto: ช่วยให้ในหน้าจอมือถือ สามารถใช้นิ้วปัดซ้าย-ขวาเพื่อดูเมนูได้
         * no-scrollbar: ซ่อนแถบเลื่อนที่ดูเกะกะ (ต้องตั้งค่าใน CSS เพิ่มเติม)
         */}
        <div className="flex flex-nowrap md:flex-wrap justify-end gap-2 md:gap-4 overflow-x-auto no-scrollbar scroll-smooth">
          
          {/** * 5. การสร้างปุ่ม (Component Mapping):
           * วนลูปข้อมูลจาก categories มาสร้างเป็นปุ่ม motion.button 
           */}
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              // Animation ตอนเริ่มต้น: ค่อยๆ เลื่อนขึ้นจากด้านบนและจางปรากฏ
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }} // ให้ปุ่มค่อยๆ โผล่ทีละปุ่ม
              onClick={() => scrollToSection(category.id)}
              
              /**
               * 6. การกำหนดสไตล์ปุ่ม (Styling):
               * flex-shrink-0: ป้องกันปุ่มถูกบีบจนเบี้ยวในจอมือถือ
               * whitespace-nowrap: ป้องกันตัวหนังสือขึ้นบรรทัดใหม่
               * hover:border...: เปลี่ยนสีขอบและพื้นหลังเมื่อเมาส์ชี้ตามค่า color ใน Array
               */
              className={`
                group flex items-center gap-2 
                px-3 py-1.5 md:px-5 md:py-2.5 
                rounded-full flex-shrink-0
                bg-gray-900/50 border border-gray-700 
                hover:border-purple-500/50 hover:bg-purple-500/10 
                transition-all duration-300
              `}
            >
              {/* ไอคอน: ปรับขนาดตามหน้าจอ (เล็กในมือถือ ใหญ่ในคอม) */}
              <category.icon className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
              
              {/* ข้อความ: text-xs สำหรับมือถือเพื่อให้ประหยัดพื้นที่ และ md:text-sm สำหรับหน้าจอปกติ */}
              <span className="text-xs md:text-sm text-gray-300 group-hover:text-purple-400 font-medium transition-colors whitespace-nowrap">
                {category.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
