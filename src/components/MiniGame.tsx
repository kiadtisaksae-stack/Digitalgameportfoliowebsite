import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, Upload, User, Zap, Disc, Target } from 'lucide-react';

// --- Interfaces ---
interface Stats {
  atk: number; hp: number; maxHp: number; speedAttack: number; speedWalk: number;
}

interface Player {
  x: number; y: number; radius: number; stats: Stats; xp: number; level: number; xpToNext: number;
  shotCount: number; hasLaser: boolean; hasPulse: boolean;
}

interface Enemy {
  id: number; x: number; y: number; radius: number; hp: number; maxHp: number; speed: number; isBoss?: boolean;
}

interface Projectile {
  id: number; x: number; y: number; vx: number; vy: number; speed: number; damage: number;
  isLaser?: boolean; hitEnemies: Set<number>;
}

interface Obstacle {
  x: number; y: number; w: number; h: number;
}

interface DropItem {
  id: number; x: number; y: number; type: 'shotgun' | 'laser' | 'pulse';
}

export function MiniGame() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [playerImage, setPlayerImage] = useState<string | null>(null);
  const playerImageRef = useRef<HTMLImageElement | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  
  // World Settings
  const WORLD_SIZE = { w: 2000, h: 2000 };
  
  const playerRef = useRef<Player>({
    x: 1000, y: 1000, radius: 15,
    stats: { atk: 20, hp: 100, maxHp: 100, speedAttack: 1, speedWalk: 3 },
    xp: 0, level: 1, xpToNext: 100,
    shotCount: 1, hasLaser: false, hasPulse: false
  });

  const enemiesRef = useRef<Enemy[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const itemsRef = useRef<DropItem[]>([]);
  const obstaclesRef = useRef<Obstacle[]>([]); // สิ่งปลูกสร้าง
  const keysRef = useRef<Set<string>>(new Set());
  
  const lastAttackRef = useRef<number>(0);
  const lastPulseRef = useRef<number>(0);
  const enemyIdRef = useRef<number>(0);
  const projectileIdRef = useRef<number>(0);
  const itemIdRef = useRef<number>(0);
  const lastEnemySpawnRef = useRef<number>(0);
  const lastBossScoreRef = useRef<number>(0);

  // สุ่มสร้างสิ่งปลูกสร้าง
  const generateLevel = useCallback(() => {
    const obs: Obstacle[] = [];
    for (let i = 0; i < 40; i++) {
      const w = 40 + Math.random() * 100;
      const h = 40 + Math.random() * 100;
      const x = Math.random() * (WORLD_SIZE.w - w);
      const y = Math.random() * (WORLD_SIZE.h - h);
      
      // เว้นระยะห่างจากจุดเกิด Player (กลางแมพ)
      const distToCenter = Math.hypot(x + w/2 - 1000, y + h/2 - 1000);
      if (distToCenter > 200) {
        obs.push({ x, y, w, h });
      }
    }
    obstaclesRef.current = obs;
  }, []);

  const resetGame = useCallback(() => {
    playerRef.current = {
      x: 1000, y: 1000, radius: 15,
      stats: { atk: 10, hp: 100, maxHp: 100, speedAttack: 1, speedWalk: 2.5 },
      xp: 0, level: 1, xpToNext: 100,
      shotCount: 1, hasLaser: false, hasPulse: false
    };
    enemiesRef.current = [];
    projectilesRef.current = [];
    itemsRef.current = [];
    generateLevel();
    setScore(0);
    lastBossScoreRef.current = 0;
    setGameOver(false);
    setIsPaused(false);
  }, [generateLevel]);

  const spawnEnemy = useCallback((isBoss = false) => {
    const player = playerRef.current;
    const angle = Math.random() * Math.PI * 2;
    const dist = 600; // เกิดนอกจอ
    const x = player.x + Math.cos(angle) * dist;
    const y = player.y + Math.sin(angle) * dist;

    enemiesRef.current.push({
      id: enemyIdRef.current++,
      x, y,
      radius: isBoss ? 40 : 12,
      hp: isBoss ? 500 : 20 + player.level * 5,
      maxHp: isBoss ? 500 : 20 + player.level * 5,
      speed: isBoss ? 0.8 : 1 + player.level * 0.1,
      isBoss
    });
  }, []);

  const shoot = useCallback(() => {
    if (enemiesRef.current.length === 0) return;
    const player = playerRef.current;
    const closest = enemiesRef.current.reduce((prev, curr) => 
      Math.hypot(curr.x - player.x, curr.y - player.y) < Math.hypot(prev.x - player.x, prev.y - player.y) ? curr : prev
    );

    const angle = Math.atan2(closest.y - player.y, closest.x - player.x);
    for (let i = 0; i < player.shotCount; i++) {
      const finalAngle = angle + (i - (player.shotCount - 1) / 2) * 0.2;
      projectilesRef.current.push({
        id: projectileIdRef.current++,
        x: player.x, y: player.y,
        vx: Math.cos(finalAngle), vy: Math.sin(finalAngle),
        speed: 7, damage: player.stats.atk,
        isLaser: player.hasLaser, hitEnemies: new Set()
      });
    }
  }, []);

  useEffect(() => {
    if (!isOpen || isPaused || gameOver) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const gameLoop = (currentTime: number) => {
      const player = playerRef.current;
      
      // --- Logic: Movement (Fix Language Issue using e.code) ---
      let nextX = player.x;
      let nextY = player.y;
      if (keysRef.current.has('KeyW')) nextY -= player.stats.speedWalk;
      if (keysRef.current.has('KeyS')) nextY += player.stats.speedWalk;
      if (keysRef.current.has('KeyA')) nextX -= player.stats.speedWalk;
      if (keysRef.current.has('KeyD')) nextX += player.stats.speedWalk;

      // Collision with Obstacles
      let canMoveX = nextX > 0 && nextX < WORLD_SIZE.w;
      let canMoveY = nextY > 0 && nextY < WORLD_SIZE.h;

      obstaclesRef.current.forEach(ob => {
        if (nextX + player.radius > ob.x && nextX - player.radius < ob.x + ob.w &&
            player.y + player.radius > ob.y && player.y - player.radius < ob.y + ob.h) canMoveX = false;
        if (player.x + player.radius > ob.x && player.x - player.radius < ob.x + ob.w &&
            nextY + player.radius > ob.y && nextY - player.radius < ob.y + ob.h) canMoveY = false;
      });

      if (canMoveX) player.x = nextX;
      if (canMoveY) player.y = nextY;

      // --- Logic: Spawning ---
      if (currentTime - lastEnemySpawnRef.current > 1500) {
        spawnEnemy();
        lastEnemySpawnRef.current = currentTime;
      }
      if (score - lastBossScoreRef.current >= 500) {
        spawnEnemy(true);
        lastBossScoreRef.current = score;
      }

      if (currentTime - lastAttackRef.current > 1000 / player.stats.speedAttack) {
        shoot(); lastAttackRef.current = currentTime;
      }

      // --- Draw: Camera Follow ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      // เลื่อนจุดศูนย์กลางกล้องมาที่กลาง Canvas แล้วหักลบตำแหน่ง Player
      ctx.translate(canvas.width/2 - player.x, canvas.height/2 - player.y);

      // Draw: World Boundary & Grid
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, WORLD_SIZE.w, WORLD_SIZE.h);
      ctx.strokeStyle = '#1a1a1a';
      for(let i=0; i<=WORLD_SIZE.w; i+=100) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i, WORLD_SIZE.h); ctx.stroke(); }
      for(let i=0; i<=WORLD_SIZE.h; i+=100) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(WORLD_SIZE.w, i); ctx.stroke(); }

      // Draw: Obstacles
      ctx.fillStyle = '#1f2937';
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 2;
      obstaclesRef.current.forEach(ob => {
        ctx.fillRect(ob.x, ob.y, ob.w, ob.h);
        ctx.strokeRect(ob.x, ob.y, ob.w, ob.h);
      });

      // Draw: Items, Projectiles, Enemies...
      itemsRef.current.forEach(item => {
        ctx.beginPath(); ctx.arc(item.x, item.y, 10, 0, Math.PI*2);
        ctx.fillStyle = '#fbbf24'; ctx.fill();
        if(Math.hypot(player.x-item.x, player.y-item.y) < 25) {
          if(item.type==='shotgun') player.shotCount++;
          if(item.type==='laser') player.hasLaser=true;
          if(item.type==='pulse') player.hasPulse=true;
          itemsRef.current = itemsRef.current.filter(i => i.id !== item.id);
        }
      });

      projectilesRef.current.forEach((p, pi) => {
        p.x += p.vx * p.speed; p.y += p.vy * p.speed;
        ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
        ctx.fillStyle = p.isLaser ? '#ff0000' : '#a855f7'; ctx.fill();
        
        enemiesRef.current.forEach(en => {
          if(Math.hypot(en.x-p.x, en.y-p.y) < en.radius+5) {
            en.hp -= p.damage;
            if(!p.isLaser) projectilesRef.current.splice(pi, 1);
          }
        });
      });

      enemiesRef.current.forEach((en, ei) => {
        const angle = Math.atan2(player.y - en.y, player.x - en.x);
        en.x += Math.cos(angle) * en.speed; en.y += Math.sin(angle) * en.speed;
        
        ctx.beginPath(); ctx.arc(en.x, en.y, en.radius, 0, Math.PI*2);
        ctx.fillStyle = en.isBoss ? '#f97316' : '#ef4444'; ctx.fill();

        if(Math.hypot(player.x-en.x, player.y-en.y) < player.radius+en.radius) {
          player.stats.hp -= 0.2;
          if(player.stats.hp <= 0) setGameOver(true);
        }
        if(en.hp <= 0) {
          if(en.isBoss) itemsRef.current.push({id: itemIdRef.current++, x: en.x, y: en.y, type: 'shotgun'});
          setScore(s => s + (en.isBoss?100:10));
          enemiesRef.current.splice(ei, 1);
        }
      });

      // Draw: Player
      ctx.save();
      ctx.beginPath(); ctx.arc(player.x, player.y, player.radius, 0, Math.PI*2);
      ctx.fillStyle = '#8b5cf6'; ctx.fill();
      ctx.restore();

      ctx.restore(); // End Camera Follow
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);
    const handleKD = (e: KeyboardEvent) => keysRef.current.add(e.code); // ใช้ e.code แทน e.key
    const handleKU = (e: KeyboardEvent) => keysRef.current.delete(e.code);
    window.addEventListener('keydown', handleKD);
    window.addEventListener('keyup', handleKU);
    return () => {
      cancelAnimationFrame(animationFrameRef.current!);
      window.removeEventListener('keydown', handleKD);
      window.removeEventListener('keyup', handleKU);
    };
  }, [isOpen, isPaused, gameOver, score, spawnEnemy, shoot]);

  return (
    <>
      <motion.button onClick={() => { setIsOpen(true); resetGame(); }} className="fixed bottom-8 right-8 z-40 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold shadow-lg">
        <Play className="w-5 h-5 inline mr-2" /> เล่นมินิเกม
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-700 max-w-5xl w-full overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-700 text-white">
                <h3 className="font-bold">Survival Arena (WASD Move - No Language Issues)</h3>
                <div className="flex gap-4">
                   <span>Score: {score}</span>
                   <span>HP: {Math.ceil(playerRef.current.stats.hp)}</span>
                   <button onClick={() => setIsOpen(false)}><X/></button>
                </div>
              </div>
              <div className="relative bg-black flex justify-center">
                <canvas ref={canvasRef} width={800} height={600} className="max-w-full" />
                {gameOver && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white">
                    <h2 className="text-4xl font-bold text-red-500 mb-4">GAME OVER</h2>
                    <button onClick={resetGame} className="px-6 py-2 bg-purple-600 rounded-lg">Try Again</button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
