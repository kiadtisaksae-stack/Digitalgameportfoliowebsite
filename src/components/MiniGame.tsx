import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, Upload, User, Zap, Disc, Target } from 'lucide-react';

interface Stats {
  atk: number;
  hp: number;
  maxHp: number;
  speedAttack: number;
  speedWalk: number;
}

interface Player {
  x: number;
  y: number;
  radius: number;
  stats: Stats;
  xp: number;
  level: number;
  xpToNext: number;
  shotCount: number;      // Item 1: จำนวนนัด
  hasLaser: boolean;      // Item 2: ปืนเลเซอร์
  hasPulse: boolean;      // Item 3: คลื่นพลัง
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  radius: number;
  hp: number;
  maxHp: number;
  speed: number;
  isBoss?: boolean;
}

interface Projectile {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  damage: number;
  isLaser?: boolean;
  hitEnemies: Set<number>; // สำหรับเลเซอร์ทะลุ
}

interface DropItem {
  id: number;
  x: number;
  y: number;
  type: 'shotgun' | 'laser' | 'pulse';
}

export function MiniGame() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [playerImage, setPlayerImage] = useState<string | null>(null);
  const playerImageRef = useRef<HTMLImageElement | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  
  const playerRef = useRef<Player>({
    x: 400, y: 300, radius: 15,
    stats: { atk: 20, hp: 100, maxHp: 100, speedAttack: 1, speedWalk: 3 },
    xp: 0, level: 1, xpToNext: 100,
    shotCount: 1, hasLaser: false, hasPulse: false
  });

  const enemiesRef = useRef<Enemy[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const itemsRef = useRef<DropItem[]>([]);
  const keysRef = useRef<Set<string>>(new Set());
  
  const lastAttackRef = useRef<number>(0);
  const lastPulseRef = useRef<number>(0);
  const enemyIdRef = useRef<number>(0);
  const projectileIdRef = useRef<number>(0);
  const itemIdRef = useRef<number>(0);
  const lastEnemySpawnRef = useRef<number>(0);
  const lastBossScoreRef = useRef<number>(0);

  const resetGame = useCallback(() => {
    playerRef.current = {
      x: 400, y: 300, radius: 15,
      stats: { atk: 10, hp: 100, maxHp: 100, speedAttack: 1, speedWalk: 2.5 },
      xp: 0, level: 1, xpToNext: 100,
      shotCount: 1, hasLaser: false, hasPulse: false
    };
    enemiesRef.current = [];
    projectilesRef.current = [];
    itemsRef.current = [];
    setScore(0);
    lastBossScoreRef.current = 0;
    setGameOver(false);
    setShowLevelUp(false);
    setIsPaused(false);
  }, []);

  const spawnEnemy = useCallback((canvas: HTMLCanvasElement, isBoss = false) => {
    const side = Math.floor(Math.random() * 4);
    let x, y;
    if (side === 0) { x = Math.random() * canvas.width; y = -50; }
    else if (side === 1) { x = canvas.width + 50; y = Math.random() * canvas.height; }
    else if (side === 2) { x = Math.random() * canvas.width; y = canvas.height + 50; }
    else { x = -50; y = Math.random() * canvas.height; }

    enemiesRef.current.push({
      id: enemyIdRef.current++,
      x, y,
      radius: isBoss ? 40 : 12,
      hp: isBoss ? 500 : 20 + playerRef.current.level * 5,
      maxHp: isBoss ? 500 : 20 + playerRef.current.level * 5,
      speed: isBoss ? 0.8 : 1 + playerRef.current.level * 0.1,
      isBoss
    });
  }, []);

  const shoot = useCallback(() => {
    if (enemiesRef.current.length === 0) return;
    const player = playerRef.current;
    
    // หาศัตรูที่ใกล้ที่สุดเพื่อกำหนดทิศทางหลัก
    const closest = enemiesRef.current.reduce((prev, curr) => 
      Math.hypot(curr.x - player.x, curr.y - player.y) < Math.hypot(prev.x - player.x, prev.y - player.y) ? curr : prev
    );

    const angle = Math.atan2(closest.y - player.y, closest.x - player.x);
    const spread = 0.2; // องศาที่กระจาย

    for (let i = 0; i < player.shotCount; i++) {
      const finalAngle = angle + (i - (player.shotCount - 1) / 2) * spread;
      projectilesRef.current.push({
        id: projectileIdRef.current++,
        x: player.x,
        y: player.y,
        vx: Math.cos(finalAngle),
        vy: Math.sin(finalAngle),
        speed: 7,
        damage: player.stats.atk,
        isLaser: player.hasLaser,
        hitEnemies: new Set()
      });
    }
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => { playerImageRef.current = img; setPlayerImage(event.target?.result as string); };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  useEffect(() => {
    if (!isOpen || isPaused || gameOver) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const gameLoop = (currentTime: number) => {
      const player = playerRef.current;
      
      // --- Logic: Movement ---
      if (keysRef.current.has('w')) player.y -= player.stats.speedWalk;
      if (keysRef.current.has('s')) player.y += player.stats.speedWalk;
      if (keysRef.current.has('a')) player.x -= player.stats.speedWalk;
      if (keysRef.current.has('d')) player.x += player.stats.speedWalk;

      // --- Logic: Spawning ---
      if (currentTime - lastEnemySpawnRef.current > 1500) {
        spawnEnemy(canvas);
        lastEnemySpawnRef.current = currentTime;
      }
      if (score - lastBossScoreRef.current >= 500) {
        spawnEnemy(canvas, true);
        lastBossScoreRef.current = score;
      }

      // --- Logic: Shooting ---
      if (currentTime - lastAttackRef.current > 1000 / player.stats.speedAttack) {
        shoot();
        lastAttackRef.current = currentTime;
      }

      // --- Logic: Pulse Skill (Every 5s) ---
      if (player.hasPulse && currentTime - lastPulseRef.current > 5000) {
        enemiesRef.current.forEach(en => {
          if (Math.hypot(en.x - player.x, en.y - player.y) < 150) en.hp -= 30;
        });
        lastPulseRef.current = currentTime;
        // Effect visual handled in draw
      }

      // --- Draw: Background ---
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // --- Logic & Draw: Items ---
      for (let i = itemsRef.current.length - 1; i >= 0; i--) {
        const item = itemsRef.current[i];
        ctx.beginPath();
        ctx.arc(item.x, item.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = item.type === 'shotgun' ? '#fbbf24' : item.type === 'laser' ? '#ef4444' : '#3b82f6';
        ctx.fill();
        
        if (Math.hypot(player.x - item.x, player.y - item.y) < player.radius + 10) {
          if (item.type === 'shotgun') player.shotCount++;
          if (item.type === 'laser') player.hasLaser = true;
          if (item.type === 'pulse') player.hasPulse = true;
          itemsRef.current.splice(i, 1);
        }
      }

      // --- Logic & Draw: Projectiles ---
      for (let i = projectilesRef.current.length - 1; i >= 0; i--) {
        const p = projectilesRef.current[i];
        p.x += p.vx * p.speed;
        p.y += p.vy * p.speed;

        ctx.beginPath();
        if (p.isLaser) {
            ctx.arc(p.x, p.y, 6, 0, Math.PI*2);
            ctx.fillStyle = '#ff0000';
            ctx.shadowBlur = 10; ctx.shadowColor = 'red';
        } else {
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#a855f7';
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        enemiesRef.current.forEach(en => {
          if (Math.hypot(en.x - p.x, en.y - p.y) < en.radius + 5) {
            if (p.isLaser) {
               if (!p.hitEnemies.has(en.id)) { en.hp -= p.damage; p.hitEnemies.add(en.id); }
            } else {
               en.hp -= p.damage;
               projectilesRef.current.splice(i, 1);
            }
          }
        });

        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) projectilesRef.current.splice(i, 1);
      }

      // --- Logic & Draw: Enemies ---
      for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
        const en = enemiesRef.current[i];
        const angle = Math.atan2(player.y - en.y, player.x - en.x);
        en.x += Math.cos(angle) * en.speed;
        en.y += Math.sin(angle) * en.speed;

        ctx.beginPath();
        ctx.arc(en.x, en.y, en.radius, 0, Math.PI * 2);
        ctx.fillStyle = en.isBoss ? '#f97316' : '#ef4444';
        ctx.fill();

        if (Math.hypot(player.x - en.x, player.y - en.y) < player.radius + en.radius) {
          player.stats.hp -= 0.5;
          if (player.stats.hp <= 0) setGameOver(true);
        }

        if (en.hp <= 0) {
          if (en.isBoss) {
            const types: ('shotgun' | 'laser' | 'pulse')[] = ['shotgun', 'laser', 'pulse'];
            itemsRef.current.push({
              id: itemIdRef.current++,
              x: en.x, y: en.y,
              type: types[Math.floor(Math.random() * types.length)]
            });
          }
          player.xp += en.isBoss ? 100 : 10;
          setScore(s => s + (en.isBoss ? 100 : 10));
          enemiesRef.current.splice(i, 1);
        }
      }

      // --- Draw: Pulse Effect ---
      if (player.hasPulse && currentTime - lastPulseRef.current < 500) {
        ctx.beginPath();
        ctx.arc(player.x, player.y, 150 * ((currentTime - lastPulseRef.current)/500), 0, Math.PI*2);
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
        ctx.lineWidth = 5;
        ctx.stroke();
      }

      // --- Draw: Player ---
      ctx.save();
      if (playerImageRef.current) {
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(playerImageRef.current, player.x - player.radius, player.y - player.radius, player.radius * 2, player.radius * 2);
      } else {
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#8b5cf6';
        ctx.fill();
      }
      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);
    const handleKD = (e: KeyboardEvent) => keysRef.current.add(e.key.toLowerCase());
    const handleKU = (e: KeyboardEvent) => keysRef.current.delete(e.key.toLowerCase());
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
      <motion.button
        onClick={() => { setIsOpen(true); resetGame(); }}
        className="fixed bottom-8 right-8 z-40 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold shadow-lg"
        whileHover={{ scale: 1.05 }}
      >
        <Play className="w-5 h-5 inline mr-2" /> เล่นมินิเกม
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-700 max-w-5xl w-full overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div className="flex gap-4 items-center">
                  <h3 className="font-bold text-white">Survival Arena</h3>
                  <div className="text-xs text-gray-400">Score: {score} | HP: {Math.ceil(playerRef.current.stats.hp)}</div>
                  <div className="flex gap-2">
                    {playerRef.current.shotCount > 1 && <Target className="w-4 h-4 text-yellow-400" />}
                    {playerRef.current.hasLaser && <Zap className="w-4 h-4 text-red-500" />}
                    {playerRef.current.hasPulse && <Disc className="w-4 h-4 text-blue-400" />}
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)}><X className="text-white"/></button>
              </div>
              
              <div className="relative bg-black flex justify-center">
                <canvas ref={canvasRef} width={800} height={600} className="max-w-full" />
                {gameOver && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white">
                    <h2 className="text-4xl font-bold text-red-500">GAME OVER</h2>
                    <p className="mb-4">Score: {score}</p>
                    <button onClick={resetGame} className="px-6 py-2 bg-purple-600 rounded-lg">Try Again</button>
                  </div>
                )}
              </div>
              <div className="p-2 text-center text-xs text-gray-500">WASD to Move | Boss spawns every 500 points</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
