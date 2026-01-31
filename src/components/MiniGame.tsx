import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, Upload, User, Zap, Disc, Target } from 'lucide-react';

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
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const mousePosRef = useRef({ x: 0, y: 0 }); 
  
  const WORLD_SIZE = { w: 2000, h: 2000 };
  
  const playerRef = useRef<Player>({
    x: 1000, y: 1000, radius: 15,
    stats: { atk: 30, hp: 100, maxHp: 100, speedAttack: 1.5, speedWalk: 4 },
    xp: 0, level: 1, xpToNext: 100,
    shotCount: 1, hasLaser: false, hasPulse: false
  });

  const enemiesRef = useRef<Enemy[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const itemsRef = useRef<DropItem[]>([]);
  const obstaclesRef = useRef<Obstacle[]>([]); 
  const keysRef = useRef<Set<string>>(new Set());
  
  const lastPulseRef = useRef<number>(0);
  const enemyIdRef = useRef<number>(0);
  const projectileIdRef = useRef<number>(0);
  const itemIdRef = useRef<number>(0);
  const lastEnemySpawnRef = useRef<number>(0);
  const lastBossScoreRef = useRef<number>(0);
  const spawnIntervalRef = useRef<number>(1800);

  const generateLevel = useCallback(() => {
    const obs: Obstacle[] = [];
    for (let i = 0; i < 40; i++) {
      const w = 80 + Math.random() * 150;
      const h = 80 + Math.random() * 150;
      const x = Math.random() * (WORLD_SIZE.w - w);
      const y = Math.random() * (WORLD_SIZE.h - h);
      if (Math.hypot(x + w/2 - 1000, y + h/2 - 1000) > 300) obs.push({ x, y, w, h });
    }
    obstaclesRef.current = obs;
  }, []);

  const resetGame = useCallback(() => {
    playerRef.current = {
      x: 1000, y: 1000, radius: 15,
      stats: { atk: 25, hp: 100, maxHp: 100, speedAttack: 1.5, speedWalk: 4 },
      xp: 0, level: 1, xpToNext: 100,
      shotCount: 1, hasLaser: false, hasPulse: false
    };
    enemiesRef.current = [];
    projectilesRef.current = [];
    itemsRef.current = [];
    spawnIntervalRef.current = 1800;
    generateLevel();
    setScore(0);
    lastBossScoreRef.current = 0;
    setGameOver(false);
    setIsPaused(false);
  }, [generateLevel]);

  const shoot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isPaused || gameOver) return;
    
    const player = playerRef.current;
    // แก้ไขพิกัดเมาส์สำหรับหน้าต่างลอย
    const camX = canvas.width / 2 - player.x;
    const camY = canvas.height / 2 - player.y;
    const worldMouseX = mousePosRef.current.x - camX;
    const worldMouseY = mousePosRef.current.y - camY;
    
    const angle = Math.atan2(worldMouseY - player.y, worldMouseX - player.x);
    
    for (let i = 0; i < player.shotCount; i++) {
      const finalAngle = angle + (i - (player.shotCount - 1) / 2) * 0.2;
      projectilesRef.current.push({
        id: projectileIdRef.current++,
        x: player.x, y: player.y,
        vx: Math.cos(finalAngle), vy: Math.sin(finalAngle),
        speed: 12, damage: player.stats.atk,
        isLaser: player.hasLaser, hitEnemies: new Set()
      });
    }
  }, [isPaused, gameOver]);

  useEffect(() => {
    if (!isOpen || isPaused || gameOver) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const gameLoop = (currentTime: number) => {
      const player = playerRef.current;
      
      // Movement (WASD Fixed)
      let nPX = player.x; let nPY = player.y;
      if (keysRef.current.has('KeyW')) nPY -= player.stats.speedWalk;
      if (keysRef.current.has('KeyS')) nPY += player.stats.speedWalk;
      if (keysRef.current.has('KeyA')) nPX -= player.stats.speedWalk;
      if (keysRef.current.has('KeyD')) nPX += player.stats.speedWalk;

      let canPX = nPX > 0 && nPX < WORLD_SIZE.w;
      let canPY = nPY > 0 && nPY < WORLD_SIZE.h;
      obstaclesRef.current.forEach(ob => {
        if (nPX + player.radius > ob.x && nPX - player.radius < ob.x + ob.w && player.y + player.radius > ob.y && player.y - player.radius < ob.y + ob.h) canPX = false;
        if (player.x + player.radius > ob.x && player.x - player.radius < ob.x + ob.w && nPY + player.radius > ob.y && nPY - player.radius < ob.y + ob.h) canPY = false;
      });
      if (canPX) player.x = nPX; if (canPY) player.y = nPY;

      // Spawning
      if (currentTime - lastEnemySpawnRef.current > spawnIntervalRef.current) {
        const angle = Math.random() * Math.PI * 2;
        enemiesRef.current.push({ id: enemyIdRef.current++, x: player.x + Math.cos(angle)*600, y: player.y + Math.sin(angle)*600, radius: 15, hp: 30 + player.level*10, maxHp: 30 + player.level*10, speed: 1.5 + player.level*0.1 });
        lastEnemySpawnRef.current = currentTime;
      }
      if (score - lastBossScoreRef.current >= 200) {
        const angle = Math.random() * Math.PI * 2;
        enemiesRef.current.push({ id: enemyIdRef.current++, x: player.x + Math.cos(angle)*600, y: player.y + Math.sin(angle)*600, radius: 45, hp: 500, maxHp: 500, speed: 1, isBoss: true });
        lastBossScoreRef.current = score;
      }

      // Draw Sequence
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      const camX = canvas.width / 2 - player.x;
      const camY = canvas.height / 2 - player.y;
      ctx.translate(camX, camY);

      // World
      ctx.fillStyle = '#050505'; ctx.fillRect(0,0, WORLD_SIZE.w, WORLD_SIZE.h);
      obstaclesRef.current.forEach(ob => { ctx.fillStyle = '#1e293b'; ctx.fillRect(ob.x, ob.y, ob.w, ob.h); });

      // Projectiles (Collision with walls)
      for (let i = projectilesRef.current.length - 1; i >= 0; i--) {
        const p = projectilesRef.current[i];
        p.x += p.vx * p.speed; p.y += p.vy * p.speed;
        let hit = false;
        obstaclesRef.current.forEach(ob => { if(p.x > ob.x && p.x < ob.x+ob.w && p.y > ob.y && p.y < ob.y+ob.h) hit = true; });
        if (hit || p.x < 0 || p.x > WORLD_SIZE.w || p.y < 0 || p.y > WORLD_SIZE.h) { projectilesRef.current.splice(i, 1); continue; }
        ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI*2); ctx.fillStyle = '#a855f7'; ctx.fill();
        enemiesRef.current.forEach(en => {
          if (Math.hypot(en.x - p.x, en.y - p.y) < en.radius + 5) { en.hp -= p.damage; projectilesRef.current.splice(i, 1); }
        });
      }

      // Enemies
      enemiesRef.current.forEach((en, ei) => {
        const angle = Math.atan2(player.y - en.y, player.x - en.x);
        const nEx = en.x + Math.cos(angle)*en.speed; const nEy = en.y + Math.sin(angle)*en.speed;
        let cEx = true; let cEy = true;
        obstaclesRef.current.forEach(ob => {
          if (nEx + en.radius > ob.x && nEx - en.radius < ob.x + ob.w && en.y + en.radius > ob.y && en.y - en.radius < ob.y + ob.h) cEx = false;
          if (en.x + en.radius > ob.x && en.x - en.radius < ob.x + ob.w && nEy + en.radius > ob.y && nEy - en.radius < ob.y + ob.h) cEy = false;
        });
        if(cEx) en.x = nEx; if(cEy) en.y = nEy;
        ctx.beginPath(); ctx.arc(en.x, en.y, en.radius, 0, Math.PI*2); ctx.fillStyle = en.isBoss ? '#f97316' : '#ef4444'; ctx.fill();
        if(Math.hypot(player.x-en.x, player.y-en.y) < player.radius+en.radius) { player.stats.hp -= 0.5; if(player.stats.hp <= 0) setGameOver(true); }
        if(en.hp <= 0) {
          if(en.isBoss) {
             spawnIntervalRef.current = Math.max(400, spawnIntervalRef.current - 400);
             itemsRef.current.push({id: itemIdRef.current++, x: en.x, y: en.y, type: 'shotgun'});
          }
          player.xp += en.isBoss ? 100 : 20;
          if(player.xp >= player.xpToNext) { player.level++; player.xp=0; player.xpToNext*=1.5; player.stats.atk+=10; player.stats.hp=player.stats.maxHp; }
          setScore(s => s + (en.isBoss?100:10)); enemiesRef.current.splice(ei, 1);
        }
      });

      // Player & Crosshair
      ctx.beginPath(); ctx.arc(player.x, player.y, player.radius, 0, Math.PI*2); ctx.fillStyle = '#8b5cf6'; ctx.fill();
      const wMX = mousePosRef.current.x - camX; const wMY = mousePosRef.current.y - camY;
      ctx.beginPath(); ctx.arc(wMX, wMY, 6, 0, Math.PI*2); ctx.strokeStyle = 'white'; ctx.stroke();
      ctx.restore();
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);
    const hKD = (e: KeyboardEvent) => keysRef.current.add(e.code);
    const hKU = (e: KeyboardEvent) => keysRef.current.delete(e.code);
    const hMM = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener('keydown', hKD); window.addEventListener('keyup', hKU);
    canvas.addEventListener('mousemove', hMM); canvas.addEventListener('mousedown', shoot);
    return () => { cancelAnimationFrame(animationFrameRef.current!); window.removeEventListener('keydown', hKD); window.removeEventListener('keyup', hKU); canvas.removeEventListener('mousemove', hMM); canvas.removeEventListener('mousedown', shoot); };
  }, [isOpen, isPaused, gameOver, score, shoot]);

  return (
    <>
      <motion.button onClick={() => { setIsOpen(true); resetGame(); }} className="fixed bottom-8 right-8 z-40 px-6 py-3 bg-purple-600 rounded-full font-bold shadow-lg">เล่นมินิเกม</motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-700 max-w-5xl w-full overflow-hidden shadow-2xl font-mono">
              <div className="flex items-center justify-between p-4 bg-gray-800/50 text-white">
                <div className="flex gap-4 items-center">
                  <span className="font-bold text-lg">LEVEL {playerRef.current.level}</span>
                  <div className="w-32 h-2 bg-gray-700 rounded-full"><div className="h-full bg-purple-500" style={{width: `${(playerRef.current.xp/playerRef.current.xpToNext)*100}%`}}/></div>
                  <span className="text-red-400">HP {Math.ceil(playerRef.current.stats.hp)}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setIsPaused(!isPaused)} className="p-2 hover:bg-white/10 rounded">{isPaused ? <Play/> : <Pause/>}</button>
                  <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded"><X/></button>
                </div>
              </div>
              <div className="relative bg-black cursor-none">
                <canvas ref={canvasRef} width={800} height={600} className="w-full h-auto" />
                {isPaused && !gameOver && <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-3xl font-bold">PAUSED</div>}
                {gameOver && (
                  <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-white">
                    <h2 className="text-5xl font-bold text-red-500 mb-4">GAME OVER</h2>
                    <p className="text-xl mb-6">Score: {score}</p>
                    <button onClick={resetGame} className="px-10 py-3 bg-white text-black font-bold rounded-full">TRY AGAIN</button>
                  </div>
                )}
              </div>
              <div className="p-2 text-center text-[10px] text-gray-500">WASD: MOVE | CLICK: SHOOT | BOSS EVERY 200 PTS</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
