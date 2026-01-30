// src/images/index.ts

// ใช้ความสามารถของ Vite ในการกวาดไฟล์ทั้งหมดในโฟลเดอร์ images
const imageModules = import.meta.glob('./*.{png,jpg,jpeg,svg,webp}', { eager: true });

// จัดรูปแบบข้อมูลให้ดึงมาใช้ง่ายๆ
export const Assets = Object.entries(imageModules).reduce((acc, [path, module]) => {
  // ดึงชื่อไฟล์ออกมา (เช่น จาก './ima.png' เหลือแค่ 'ima')
  const fileName = path.split('/').pop()?.split('.')[0] || path;
  
  // เก็บ URL ของรูปไว้ใน Object โดยใช้ชื่อไฟล์เป็น Key
  acc[fileName] = (module as any).default;
  
  return acc;
}, {} as Record<string, string>);

/* ตอนนี้ Assets จะมีหน้าตาประมาณนี้:
  {
    "ima": "/src/images/ima.png",
    "background": "/src/images/background.jpg",
    ...
  }
*/
