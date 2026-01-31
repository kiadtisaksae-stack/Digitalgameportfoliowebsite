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
  const mousePosRef = useRef({ x: 0, y: 0 }); // เก็บตำแหน่งเมาส์
  
  const WORLD_SIZE = { w: 2000, h: 2000 };
  
  const playerRef = useRef<Player>({
    x: 1000, y: 1000, radius: 15,
    stats: { atk: 50, hp: 100, maxHp: 100, speedAttack: 1.5, speedWalk: 3.5 },
    xp: 0, level: 1, xpToNext: 100,
    shotCount: 1, hasLaser: false, hasPulse: false
  });

  const enemiesRef = useRef<Enemy[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const itemsRef = useRef<DropItem[]>([]);
  const obstaclesRef = useRef<Obstacle[]>([]); 
  const keysRef = useRef<Set<string>>(new Set());
  
  const lastAttackRef = useRef<number>(0);
  const lastPulseRef = useRef<number>(0);
  const enemyIdRef = useRef<number>(0);
  const projectileIdRef = useRef<number>(0);
  const itemIdRef = useRef<number>(0);
  const lastEnemySpawnRef = useRef<number>(0);
  const lastBossScoreRef = useRef<number>(0);
  const spawnIntervalRef = useRef<number>(1800);

  const generateLevel = useCallback(() => {
    const obs: Obstacle[] = [];
    for (let i = 0; i < 45; i++) {
      const w = 60 + Math.random() * 140;
      const h = 60 + Math.random() * 140;
      const x = Math.random() * (WORLD_SIZE.w - w);
      const y = Math.random() * (WORLD_SIZE.h - h);
      const distToCenter = Math.hypot(x + w/2 - 1000, y + h/2 - 1000);
      if (distToCenter > 250) obs.push({ x, y, w, h });
    }
    obstaclesRef.current = obs;
  }, []);

  const resetGame = useCallback(() => {
    playerRef.current = {
      x: 1000, y: 1000, radius: 15,
      stats: { atk: 15, hp: 100, maxHp: 100, speedAttack: 1.5, speedWalk: 3.5 },
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

  const spawnEnemy = useCallback((isBoss = false) => {
    const player = playerRef.current;
    const angle = Math.random() * Math.PI * 2;
    const dist = 700; 
    const x = player.x + Math.cos(angle) * dist;
    const y = player.y + Math.sin(angle) * dist;

    enemiesRef.current.push({
      id: enemyIdRef.current++,
      x, y,
      radius: isBoss ? 50 : 15,
      hp: isBoss ? 150 : 30 + player.level * 5,
      maxHp: isBoss ? 150 : 30 + player.level * 5,
      speed: isBoss ? 1.0 : 1.5 + player.level * 0.1,
      isBoss
    });
  }, []);

  const shootTowardsMouse = useCallback((canvas: HTMLCanvasElement) => {
    const player = playerRef.current;
    // คำนวณตำแหน่งเมาส์ใน World Space (เพราะกล้องเลื่อน)
    const worldMouseX = mousePosRef.current.x - (canvas.width/2 - player.x);
    const worldMouseY = mousePosRef.current.y - (canvas.height/2 - player.y);
    
    const angle = Math.atan2(worldMouseY - player.y, worldMouseX - player.x);
    
    for (let i = 0; i < player.shotCount; i++) {
      const finalAngle = angle + (i - (player.shotCount - 1) / 2) * 0.2;
      projectilesRef.current.push({
        id: projectileIdRef.current++,
        x: player.x, y: player.y,
        vx: Math.cos(finalAngle), vy: Math.sin(finalAngle),
        speed: 10, damage: player.stats.atk,
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
      if (isPaused) return;
      const player = playerRef.current;
      
      // Movement Logic
      let nextPX = player.x;
      let nextPY = player.y;
      if (keysRef.current.has('KeyW')) nextPY -= player.stats.speedWalk;
      if (keysRef.current.has('KeyS')) nextPY += player.stats.speedWalk;
      if (keysRef.current.has('KeyA')) nextPX -= player.stats.speedWalk;
      if (keysRef.current.has('KeyD')) nextPX += player.stats.speedWalk;

      let canPMoveX = nextPX > 0 && nextPX < WORLD_SIZE.w;
      let canPMoveY = nextPY > 0 && nextPY < WORLD_SIZE.h;

      obstaclesRef.current.forEach(ob => {
        if (nextPX + player.radius > ob.x && nextPX - player.radius < ob.x + ob.w &&
            player.y + player.radius > ob.y && player.y - player.radius < ob.y + ob.h) canPMoveX = false;
        if (player.x + player.radius > ob.x && player.x - player.radius < ob.x + ob.w &&
            nextPY + player.radius > ob.y && nextPY - player.radius < ob.y + ob.h) canPMoveY = false;
      });
      if (canPMoveX) player.x = nextPX;
      if (canPMoveY) player.y = nextPY;

      // Pulse
      if (player.hasPulse && currentTime - lastPulseRef.current > 5000) {
        enemiesRef.current.forEach(en => { if (Math.hypot(en.x - player.x, en.y - player.y) < 200) en.hp -= 40; });
        lastPulseRef.current = currentTime;
      }

      // Spawning & Shooting
      if (currentTime - lastEnemySpawnRef.current > spawnIntervalRef.current) { 
        spawnEnemy(); lastEnemySpawnRef.current = currentTime; 
      }
      if (score - lastBossScoreRef.current >= 150) { 
        spawnEnemy(true); lastBossScoreRef.current = score; 
      }
      if (currentTime - lastAttackRef.current > 1000 / player.stats.speedAttack) { 
        shootTowardsMouse(canvas); lastAttackRef.current = currentTime; 
      }

      // Draw Sequence
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width/2 - player.x, canvas.height/2 - player.y);

      // Map Background
      ctx.fillStyle = '#050505'; ctx.fillRect(0,0, WORLD_SIZE.w, WORLD_SIZE.h);
      ctx.strokeStyle = '#111';
      for(let i=0; i<=WORLD_SIZE.w; i+=100) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,WORLD_SIZE.h); ctx.stroke(); }
      for(let i=0; i<=WORLD_SIZE.h; i+=100) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(WORLD_SIZE.w,i); ctx.stroke(); }

      // Obstacles
      ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#334155';
      obstaclesRef.current.forEach(ob => { ctx.fillRect(ob.x, ob.y, ob.w, ob.h); ctx.strokeRect(ob.x, ob.y, ob.w, ob.h); });

      // Items
      itemsRef.current.forEach((item, ii) => {
        ctx.beginPath(); ctx.arc(item.x, item.y, 14, 0, Math.PI*2);
        ctx.fillStyle = item.type==='shotgun'?'#fbbf24':item.type==='laser'?'#f87171':'#60a5fa'; ctx.fill();
        if(Math.hypot(player.x-item.x, player.y-item.y) < 30) {
          if(item.type==='shotgun') player.shotCount++;
          else if(item.type==='laser') player.hasLaser = true;
          else if(item.type==='pulse') player.hasPulse = true;
          itemsRef.current.splice(ii, 1);
        }
      });

      // Projectiles (With Wall Collision)
      for (let i = projectilesRef.current.length - 1; i >= 0; i--) {
        const p = projectilesRef.current[i];
        const nextPX = p.x + p.vx * p.speed;
        const nextPY = p.y + p.vy * p.speed;
        
        // Check collision with walls
        let hitWall = false;
        obstaclesRef.current.forEach(ob => {
          if (nextPX > ob.x && nextPX < ob.x + ob.w && nextPY > ob.y && nextPY < ob.y + ob.h) hitWall = true;
        });

        if (hitWall) {
          projectilesRef.current.splice(i, 1);
          continue;
        }

        p.x = nextPX; p.y = nextPY;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.isLaser?6:4, 0, Math.PI*2);
        ctx.fillStyle = p.isLaser?'#ff4444':'#a855f7'; ctx.fill();
        
        enemiesRef.current.forEach(en => {
          if(Math.hypot(en.x-p.x, en.y-p.y) < en.radius+5) {
            if(p.isLaser) { if(!p.hitEnemies.has(en.id)) { en.hp -= p.damage; p.hitEnemies.add(en.id); } }
            else { en.hp -= p.damage; projectilesRef.current.splice(i, 1); }
          }
        });
        if(p.x < 0 || p.x > WORLD_SIZE.w || p.y < 0 || p.y > WORLD_SIZE.h) projectilesRef.current.splice(i, 1);
      }

      // Enemies
      enemiesRef.current.forEach((en, ei) => {
        const angle = Math.atan2(player.y - en.y, player.x - en.x);
        const nEx = en.x + Math.cos(angle) * en.speed;
        const nEy = en.y + Math.sin(angle) * en.speed;
        let cEx = true, cEy = true;
        obstaclesRef.current.forEach(ob => {
          if (nEx + en.radius > ob.x && nEx - en.radius < ob.x + ob.w && en.y + en.radius > ob.y && en.y - en.radius < ob.y + ob.h) cEx = false;
          if (en.x + en.radius > ob.x && en.x - en.radius < ob.x + ob.w && nEy + en.radius > ob.y && nEy - en.radius < ob.y + ob.h) cEy = false;
        });
        if (cEx) en.x = nEx; if (cEy) en.y = nEy;

        ctx.beginPath(); ctx.arc(en.x, en.y, en.radius, 0, Math.PI*2);
        ctx.fillStyle = en.isBoss?'#f97316':'#ef4444'; ctx.fill();
        
        if(Math.hypot(player.x-en.x, player.y-en.y) < player.radius+en.radius) {
          player.stats.hp -= 0.4; if(player.stats.hp <= 0) setGameOver(true);
        }
        if(en.hp <= 0) {
          if(en.isBoss) {
            spawnIntervalRef.current = Math.max(400, spawnIntervalRef.current - 450);
            const types: ('shotgun' | 'laser' | 'pulse')[] = ['shotgun', 'laser', 'pulse'];
            itemsRef.current.push({id: itemIdRef.current++, x: en.x, y: en.y, type: types[Math.floor(Math.random()*3)]});
          }
          player.xp += en.isBoss ? 50 : 15;
          if (player.xp >= player.xpToNext) {
            player.level++;
            player.xp -= player.xpToNext;
            player.xpToNext = Math.floor(player.xpToNext * 1.5);
            player.stats.atk += 10;
            player.stats.maxHp += 20;
            player.stats.hp = player.stats.maxHp;
          }
          setScore(s => s + (en.isBoss?100:10)); enemiesRef.current.splice(ei, 1);
        }
      });

      // Effects & Player
      if(player.hasPulse && currentTime - lastPulseRef.current < 600) {
        ctx.beginPath(); ctx.arc(player.x, player.y, 200 * ((currentTime-lastPulseRef.current)/600), 0, Math.PI*2);
        ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 4; ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(player.x, player.y, player.radius, 0, Math.PI*2);
      ctx.fillStyle = '#8b5cf6'; ctx.fill(); 
      ctx.restore(); 

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);
    
    // Listeners
    const hKD = (e: KeyboardEvent) => keysRef.current.add(e.code);
    const hKU = (e: KeyboardEvent) => keysRef.current.delete(e.code);
    const hMM = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    window.addEventListener('keydown', hKD);
    window.addEventListener('keyup', hKU);
    canvas.addEventListener('mousemove', hMM);

    return () => { 
      cancelAnimationFrame(animationFrameRef.current!); 
      window.removeEventListener('keydown', hKD); 
      window.removeEventListener('keyup', hKU);
      canvas.removeEventListener('mousemove', hMM);
    };
  }, [isOpen, isPaused, gameOver, score, spawnEnemy, shootTowardsMouse]);

  const player = playerRef.current;

  return (
    <>
      <motion.button onClick={() => { setIsOpen(true); resetGame(); }} className="fixed bottom-8 right-8 z-40 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold shadow-xl text-white">
        <Play className="w-5 h-5 inline mr-2" /> เล่นมินิเกม
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-700 max-w-5xl w-full overflow-hidden shadow-2xl font-mono">
              {/* Header with Level & Stats */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800 text-white">
                <div className="flex gap-6 items-center">
                  <h3 className="font-bold text-xl">Survival Arena</h3>
                  <div className="flex flex-col">
                    <span className="text-xs text-purple-400">LEVEL {player.level}</span>
                    <div className="w-32 h-2 bg-gray-800 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: `${(player.xp / player.xpToNext) * 100}%` }} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-red-400">HP {Math.ceil(player.stats.hp)}/{player.stats.maxHp}</span>
                    <div className="w-32 h-2 bg-gray-800 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: `${(player.stats.hp / player.stats.maxHp) * 100}%` }} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="flex gap-3">
                    {player.shotCount > 1 && <Target className="w-5 h-5 text-yellow-500" />}
                    {player.hasLaser && <Zap className="w-5 h-5 text-red-500" />}
                    {player.hasPulse && <Disc className="w-5 h-5 text-blue-500" />}
                  </div>
                  <button onClick={() => setIsPaused(!isPaused)} className="p-2 hover:bg-gray-800 rounded-lg">
                    {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
                  </button>
                  <button onClick={() => setIsOpen(false)} className="hover:bg-gray-800 p-1 rounded"><X className="w-6 h-6"/></button>
                </div>
              </div>

              {/* Canvas Area */}
              <div className="relative bg-black flex justify-center">
                <canvas ref={canvasRef} width={800} height={600} className="w-full cursor-crosshair" />
                
                {isPaused && !gameOver && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                    <h2 className="text-4xl font-bold flex items-center gap-4"><Pause className="w-10 h-10"/> PAUSED</h2>
                  </div>
                )}

                {gameOver && (
                  <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-white">
                    <h2 className="text-5xl font-extrabold text-red-600 mb-2">GAME OVER</h2>
                    <p className="text-xl mb-6">Final Score: {score}</p>
                    <button onClick={resetGame} className="px-10 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all">TRY AGAIN</button>
                  </div>
                )}
              </div>

              <div className="p-3 bg-gray-800/50 text-center text-xs text-gray-400">
                [W,A,S,D] MOVE | MOUSE AIM & AUTO SHOOT | BOSS EVERY 150 PTS | BULLETS COLLIDE WITH WALLS
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
