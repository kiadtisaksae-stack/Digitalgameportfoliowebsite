// src/images/index.ts

// 1. กวาดไฟล์รูปภาพทั้งหมดในโฟลเดอร์นี้
const imageModules = import.meta.glob('./*.{png,jpg,jpeg,svg,webp}', { eager: true });

// 2. แปลงข้อมูลให้อยู่ในรูปแบบ Object ที่เรียกใช้ง่าย
export const Assets: Record<string, string> = Object.entries(imageModules).reduce((acc, [path, module]) => {
  // ดึงชื่อไฟล์ออกมาเพื่อใช้เป็น Key (เช่น './ima.png' -> 'ima')
  const fileName = path.split('/').pop()?.split('.')[0] || path;
  
  // เก็บ URL ของรูปภาพ
  acc[fileName] = (module as any).default;
  
  return acc;
}, {} as Record<string, string>);
