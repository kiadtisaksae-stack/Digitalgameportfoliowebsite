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
    stats: { atk: 50, hp: 100, maxHp: 100, speedAttack: 1, speedWalk: 3 },
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

  // สุ่มสร้างสิ่งปลูกสร้าง
  const generateLevel = useCallback(() => {
    const obs: Obstacle[] = [];
    for (let i = 0; i < 45; i++) {
      const w = 60 + Math.random() * 140;
      const h = 60 + Math.random() * 140;
      const x = Math.random() * (WORLD_SIZE.w - w);
      const y = Math.random() * (WORLD_SIZE.h - h);
      
      const distToCenter = Math.hypot(x + w/2 - 1000, y + h/2 - 1000);
      if (distToCenter > 250) {
        obs.push({ x, y, w, h });
      }
    }
    obstaclesRef.current = obs;
  }, []);

  const resetGame = useCallback(() => {
    playerRef.current = {
      x: 1000, y: 1000, radius: 15,
      stats: { atk: 15, hp: 100, maxHp: 100, speedAttack: 1.2, speedWalk: 3 },
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
    const dist = 600; 
    const x = player.x + Math.cos(angle) * dist;
    const y = player.y + Math.sin(angle) * dist;

    enemiesRef.current.push({
      id: enemyIdRef.current++,
      x, y,
      radius: isBoss ? 45 : 12,
      hp: isBoss ? 600 : 25 + player.level * 5,
      maxHp: isBoss ? 600 : 25 + player.level * 5,
      speed: isBoss ? 0.9 : 1.2 + player.level * 0.1,
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
      const finalAngle = angle + (i - (player.shotCount - 1) / 2) * 0.25;
      projectilesRef.current.push({
        id: projectileIdRef.current++,
        x: player.x, y: player.y,
        vx: Math.cos(finalAngle), vy: Math.sin(finalAngle),
        speed: 8, damage: player.stats.atk,
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
      
      // --- Logic: Movement (Fix Language using Code) ---
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

      // Pulse Skill
      if (player.hasPulse && currentTime - lastPulseRef.current > 5000) {
        enemiesRef.current.forEach(en => { if (Math.hypot(en.x - player.x, en.y - player.y) < 180) en.hp -= 30; });
        lastPulseRef.current = currentTime;
      }

      // Spawning
      if (currentTime - lastEnemySpawnRef.current > 1800) { spawnEnemy(); lastEnemySpawnRef.current = currentTime; }
      if (score - lastBossScoreRef.current >= 500) { spawnEnemy(true); lastBossScoreRef.current = score; }
      if (currentTime - lastAttackRef.current > 1000 / player.stats.speedAttack) { shoot(); lastAttackRef.current = currentTime; }

      // --- Draw & Camera ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width/2 - player.x, canvas.height/2 - player.y);

      // World & Grid
      ctx.fillStyle = '#050505'; ctx.fillRect(0,0, WORLD_SIZE.w, WORLD_SIZE.h);
      ctx.strokeStyle = '#111'; ctx.lineWidth = 1;
      for(let i=0; i<=WORLD_SIZE.w; i+=100) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,WORLD_SIZE.h); ctx.stroke(); }
      for(let i=0; i<=WORLD_SIZE.h; i+=100) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(WORLD_SIZE.w,i); ctx.stroke(); }

      // Obstacles
      ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#334155';
      obstaclesRef.current.forEach(ob => { ctx.fillRect(ob.x, ob.y, ob.w, ob.h); ctx.strokeRect(ob.x, ob.y, ob.w, ob.h); });

      // Items
      itemsRef.current.forEach((item, ii) => {
        ctx.beginPath(); ctx.arc(item.x, item.y, 12, 0, Math.PI*2);
        ctx.fillStyle = item.type==='shotgun'?'#fbbf24':item.type==='laser'?'#f87171':'#60a5fa'; ctx.fill();
        if(Math.hypot(player.x-item.x, player.y-item.y) < 30) {
          if(item.type==='shotgun') player.shotCount++;
          else if(item.type==='laser') player.hasLaser = true;
          else if(item.type==='pulse') player.hasPulse = true;
          itemsRef.current.splice(ii, 1);
        }
      });

      // Projectiles
      projectilesRef.current.forEach((p, pi) => {
        p.x += p.vx * p.speed; p.y += p.vy * p.speed;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.isLaser?6:4, 0, Math.PI*2);
        ctx.fillStyle = p.isLaser?'#ff4444':'#a855f7'; ctx.fill();
        enemiesRef.current.forEach(en => {
          if(Math.hypot(en.x-p.x, en.y-p.y) < en.radius+5) {
            if(p.isLaser) { if(!p.hitEnemies.has(en.id)) { en.hp -= p.damage; p.hitEnemies.add(en.id); } }
            else { en.hp -= p.damage; projectilesRef.current.splice(pi, 1); }
          }
        });
        if(p.x < 0 || p.x > WORLD_SIZE.w || p.y < 0 || p.y > WORLD_SIZE.h) projectilesRef.current.splice(pi, 1);
      });

      // --- Enemies with FIXED Wall Collision ---
      enemiesRef.current.forEach((en, ei) => {
        const angle = Math.atan2(player.y - en.y, player.x - en.x);
        const nEx = en.x + Math.cos(angle) * en.speed;
        const nEy = en.y + Math.sin(angle) * en.speed;
        
        let canEx = true;
        let canEy = true;

        obstaclesRef.current.forEach(ob => {
          // Check X axis collision
          if (nEx + en.radius > ob.x && nEx - en.radius < ob.x + ob.w &&
              en.y + en.radius > ob.y && en.y - en.radius < ob.y + ob.h) {
            canEx = false;
          }
          // Check Y axis collision
          if (en.x + en.radius > ob.x && en.x - en.radius < ob.x + ob.w &&
              nEy + en.radius > ob.y && nEy - en.radius < ob.y + ob.h) {
            canEy = false;
          }
        });

        if (canEx) en.x = nEx;
        if (canEy) en.y = nEy;

        ctx.beginPath(); ctx.arc(en.x, en.y, en.radius, 0, Math.PI*2);
        ctx.fillStyle = en.isBoss?'#f97316':'#ef4444'; ctx.fill();
        
        if(Math.hypot(player.x-en.x, player.y-en.y) < player.radius+en.radius) {
          player.stats.hp -= 0.3; if(player.stats.hp <= 0) setGameOver(true);
        }
        if(en.hp <= 0) {
          if(en.isBoss) {
            const types: ('shotgun' | 'laser' | 'pulse')[] = ['shotgun', 'laser', 'pulse'];
            itemsRef.current.push({id: itemIdRef.current++, x: en.x, y: en.y, type: types[Math.floor(Math.random()*3)]});
          }
          setScore(s => s + (en.isBoss?100:10)); enemiesRef.current.splice(ei, 1);
        }
      });

      // Effects & Player
      if(player.hasPulse && currentTime - lastPulseRef.current < 600) {
        ctx.beginPath(); ctx.arc(player.x, player.y, 180 * ((currentTime-lastPulseRef.current)/600), 0, Math.PI*2);
        ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 3; ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(player.x, player.y, player.radius, 0, Math.PI*2);
      ctx.fillStyle = '#8b5cf6'; ctx.fill(); 
      ctx.restore(); 

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);
    const hKD = (e: KeyboardEvent) => keysRef.current.add(e.code);
    const hKU = (e: KeyboardEvent) => keysRef.current.delete(e.code);
    window.addEventListener('keydown', hKD); window.addEventListener('keyup', hKU);
    return () => { cancelAnimationFrame(animationFrameRef.current!); window.removeEventListener('keydown', hKD); window.removeEventListener('keyup', hKU); };
  }, [isOpen, isPaused, gameOver, score, spawnEnemy, shoot]);

  return (
    <>
      <motion.button onClick={() => { setIsOpen(true); resetGame(); }} className="fixed bottom-8 right-8 z-40 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold shadow-xl text-white">
        <Play className="w-5 h-5 inline mr-2" /> เล่นมินิเกม
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-700 max-w-5xl w-full overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-800 text-white font-mono">
                <div className="flex gap-6">
                  <h3 className="font-bold">Survival Arena</h3>
                  <span className="text-blue-400">Score: {score}</span>
                  <span className="text-red-400">HP: {Math.ceil(playerRef.current.stats.hp)}</span>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="flex gap-2">
                    {playerRef.current.shotCount > 1 && <Target className="w-5 h-5 text-yellow-500" />}
                    {playerRef.current.hasLaser && <Zap className="w-5 h-5 text-red-500" />}
                    {playerRef.current.hasPulse && <Disc className="w-5 h-5 text-blue-500" />}
                  </div>
                  <button onClick={() => setIsOpen(false)} className="hover:bg-gray-800 p-1 rounded"><X/></button>
                </div>
              </div>
              <div className="relative bg-black flex justify-center">
                <canvas ref={canvasRef} width={800} height={600} className="w-full cursor-crosshair" />
                {gameOver && (
                  <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-white">
                    <h2 className="text-5xl font-extrabold text-red-600 mb-2">GAME OVER</h2>
                    <p className="text-xl mb-6">Score: {score}</p>
                    <button onClick={resetGame} className="px-10 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all">TRY AGAIN</button>
                  </div>
                )}
              </div>
              <div className="p-3 bg-gray-800/50 text-center text-xs text-gray-500">
                [W,A,S,D] MOVE | KILL BOSS EVERY 500 PTS | ENEMIES NO LONGER PASS WALLS
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
