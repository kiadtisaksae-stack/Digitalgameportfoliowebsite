import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, Upload, User } from 'lucide-react';

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
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  radius: number;
  hp: number;
  maxHp: number;
  speed: number;
}

interface Projectile {
  id: number;
  x: number;
  y: number;
  targetId: number;
  speed: number;
}

export function MiniGame() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [playerImage, setPlayerImage] = useState<string | null>(null);
  const [showCustomize, setShowCustomize] = useState(false);
  const playerImageRef = useRef<HTMLImageElement | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const playerRef = useRef<Player>({
    x: 400,
    y: 300,
    radius: 15,
    stats: {
      atk: 20,
      hp: 100,
      maxHp: 100,
      speedAttack: 1,
      speedWalk: 3
    },
    xp: 0,
    level: 1,
    xpToNext: 100
  });
  const enemiesRef = useRef<Enemy[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const keysRef = useRef<Set<string>>(new Set());
  const lastAttackRef = useRef<number>(0);
  const enemyIdRef = useRef<number>(0);
  const projectileIdRef = useRef<number>(0);
  const lastEnemySpawnRef = useRef<number>(0);

  const resetGame = useCallback(() => {
    playerRef.current = {
      x: 400,
      y: 300,
      radius: 15,
      stats: {
        atk: 6,
        hp: 100,
        maxHp: 100,
        speedAttack: 1,
        speedWalk: 2
      },
      xp: 0,
      level: 1,
      xpToNext: 100
    };
    enemiesRef.current = [];
    projectilesRef.current = [];
    setScore(0);
    setGameOver(false);
    setShowLevelUp(false);
    setIsPaused(false);
  }, []);

  const upgradeStat = useCallback((stat: keyof Stats) => {
    const player = playerRef.current;
    
    switch(stat) {
      case 'atk':
        player.stats.atk += 5;
        break;
      case 'maxHp':
        player.stats.maxHp += 20;
        player.stats.hp += 20;
        break;
      case 'speedAttack':
        player.stats.speedAttack += 0.2;
        break;
      case 'speedWalk':
        player.stats.speedWalk += 0.5;
        break;
    }
    
    setShowLevelUp(false);
    setIsPaused(false);
  }, []);

  const spawnEnemy = useCallback((canvas: HTMLCanvasElement) => {
    const side = Math.floor(Math.random() * 4);
    let x, y;
    
    switch(side) {
      case 0: // top
        x = Math.random() * canvas.width;
        y = -30;
        break;
      case 1: // right
        x = canvas.width + 30;
        y = Math.random() * canvas.height;
        break;
      case 2: // bottom
        x = Math.random() * canvas.width;
        y = canvas.height + 30;
        break;
      default: // left
        x = -30;
        y = Math.random() * canvas.height;
    }
    
    enemiesRef.current.push({
      id: enemyIdRef.current++,
      x,
      y,
      radius: 12,
      hp: 20 + playerRef.current.level * 5,
      maxHp: 20 + playerRef.current.level * 5,
      speed: 1 + playerRef.current.level * 0.1
    });
  }, []);

  const shootProjectile = useCallback(() => {
    if (enemiesRef.current.length === 0) return;
    
    const player = playerRef.current;
    const closestEnemy = enemiesRef.current.reduce((closest, enemy) => {
      const distToCurrent = Math.hypot(enemy.x - player.x, enemy.y - player.y);
      const distToClosest = Math.hypot(closest.x - player.x, closest.y - player.y);
      return distToCurrent < distToClosest ? enemy : closest;
    });
    
    projectilesRef.current.push({
      id: projectileIdRef.current++,
      x: player.x,
      y: player.y,
      targetId: closestEnemy.id,
      speed: 8
    });
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setPlayerImage(imageUrl);
      
      const img = new Image();
      img.onload = () => {
        playerImageRef.current = img;
      };
      img.src = imageUrl;
    };
    reader.readAsDataURL(file);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || isPaused || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      const player = playerRef.current;
      const enemies = enemiesRef.current;
      const projectiles = projectilesRef.current;

      // Clear canvas
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Move player
      if (keysRef.current.has('w') || keysRef.current.has('arrowup')) {
        player.y = Math.max(player.radius, player.y - player.stats.speedWalk);
      }
      if (keysRef.current.has('s') || keysRef.current.has('arrowdown')) {
        player.y = Math.min(canvas.height - player.radius, player.y + player.stats.speedWalk);
      }
      if (keysRef.current.has('a') || keysRef.current.has('arrowleft')) {
        player.x = Math.max(player.radius, player.x - player.stats.speedWalk);
      }
      if (keysRef.current.has('d') || keysRef.current.has('arrowright')) {
        player.x = Math.min(canvas.width - player.radius, player.x + player.stats.speedWalk);
      }

      // Spawn enemies
      if (currentTime - lastEnemySpawnRef.current > 2000) {
        spawnEnemy(canvas);
        lastEnemySpawnRef.current = currentTime;
      }

      // Shoot projectiles
      if (currentTime - lastAttackRef.current > 1000 / player.stats.speedAttack) {
        shootProjectile();
        lastAttackRef.current = currentTime;
      }

      // Update and draw enemies
      for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        
        // Move towards player
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist > 0) {
          enemy.x += (dx / dist) * enemy.speed;
          enemy.y += (dy / dist) * enemy.speed;
        }

        // Check collision with player
        const playerDist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (playerDist < player.radius + enemy.radius) {
          player.stats.hp -= 0.5;
          if (player.stats.hp <= 0) {
            setGameOver(true);
            return;
          }
        }

        // Draw enemy
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        ctx.strokeStyle = '#7f1d1d';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw enemy HP bar
        const barWidth = enemy.radius * 2;
        const barHeight = 4;
        const hpPercent = enemy.hp / enemy.maxHp;
        
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(enemy.x - barWidth / 2, enemy.y - enemy.radius - 8, barWidth, barHeight);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(enemy.x - barWidth / 2, enemy.y - enemy.radius - 8, barWidth * hpPercent, barHeight);
      }

      // Update and draw projectiles
      for (let i = projectiles.length - 1; i >= 0; i--) {
        const proj = projectiles[i];
        const target = enemies.find(e => e.id === proj.targetId);
        
        if (!target) {
          projectiles.splice(i, 1);
          continue;
        }

        // Move towards target
        const dx = target.x - proj.x;
        const dy = target.y - proj.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist < proj.speed) {
          // Hit target
          target.hp -= player.stats.atk;
          projectiles.splice(i, 1);
          
          if (target.hp <= 0) {
            // Enemy killed
            const enemyIndex = enemies.findIndex(e => e.id === target.id);
            if (enemyIndex !== -1) {
              enemies.splice(enemyIndex, 1);
              player.xp += 10;
              setScore(s => s + 10);
              
              // Level up
              if (player.xp >= player.xpToNext) {
                player.level++;
                player.xp -= player.xpToNext;
                player.xpToNext = Math.floor(player.xpToNext * 1.5);
                setShowLevelUp(true);
                setIsPaused(true);
              }
            }
          }
        } else {
          proj.x += (dx / dist) * proj.speed;
          proj.y += (dy / dist) * proj.speed;
        }

        // Draw projectile
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#a855f7';
        ctx.fill();
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw player
      if (playerImageRef.current) {
        ctx.drawImage(playerImageRef.current, player.x - player.radius, player.y - player.radius, player.radius * 2, player.radius * 2);
      } else {
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#8b5cf6';
        ctx.fill();
        ctx.strokeStyle = '#6d28d9';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isOpen, isPaused, gameOver, spawnEnemy, shootProjectile]);

  const player = playerRef.current;

  return (
    <>
      <motion.button
        onClick={() => {
          setIsOpen(true);
          resetGame();
        }}
        className="fixed bottom-8 right-8 z-40 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full font-semibold shadow-lg shadow-purple-500/50 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Play className="w-5 h-5 inline mr-2" />
        เล่นมินิเกม
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl border border-gray-700 max-w-5xl w-full overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold">Survival Arena</h3>
                  <div className="text-sm text-gray-400">Score: {score}</div>
                  <div className="text-sm text-gray-400">Level: {player.level}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="p-4 bg-gray-800/50 border-b border-gray-700">
                <div className="flex items-center gap-4 mb-3">
                  {/* Player Avatar Section */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {playerImage ? (
                        <img 
                          src={playerImage} 
                          alt="Player" 
                          className="w-12 h-12 rounded-full object-cover border-2 border-purple-500"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-purple-600 border-2 border-purple-500 flex items-center justify-center">
                          <User className="w-6 h-6" />
                        </div>
                      )}
                      <label 
                        htmlFor="player-image-upload"
                        className="absolute -bottom-1 -right-1 p-1 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                      >
                        <Upload className="w-3 h-3" />
                      </label>
                      <input
                        id="player-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <div className="text-xs text-gray-400">
                      อัพโหลดรูป<br/>ตัวละคร
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">ATK</div>
                      <div className="text-lg font-bold text-purple-400">{player.stats.atk}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Max HP</div>
                      <div className="text-lg font-bold text-red-400">{player.stats.maxHp}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Attack Speed</div>
                      <div className="text-lg font-bold text-blue-400">{player.stats.speedAttack.toFixed(1)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Move Speed</div>
                      <div className="text-lg font-bold text-green-400">{player.stats.speedWalk.toFixed(1)}</div>
                    </div>
                  </div>
                </div>

                {/* HP Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>HP</span>
                    <span>{Math.max(0, Math.floor(player.stats.hp))} / {player.stats.maxHp}</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300"
                      style={{ width: `${Math.max(0, (player.stats.hp / player.stats.maxHp) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* XP Bar */}
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>XP</span>
                    <span>{player.xp} / {player.xpToNext}</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-400 transition-all duration-300"
                      style={{ width: `${(player.xp / player.xpToNext) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Game Canvas */}
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="w-full bg-black"
                />

                {/* Level Up Screen */}
                <AnimatePresence>
                  {showLevelUp && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute inset-0 bg-black/80 flex items-center justify-center"
                    >
                      <div className="bg-gray-800 p-8 rounded-2xl border border-purple-500 max-w-md">
                        <h4 className="text-3xl font-bold text-center mb-2 text-purple-400">
                          Level Up!
                        </h4>
                        <p className="text-center text-gray-400 mb-6">เลือกสเตตัสที่ต้องการอัพเกรด</p>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() => upgradeStat('atk')}
                            className="p-4 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 rounded-xl transition-all"
                          >
                            <div className="text-2xl font-bold text-purple-400">ATK +5</div>
                            <div className="text-sm text-gray-400">เพิ่มพลังโจมตี</div>
                          </button>
                          
                          <button
                            onClick={() => upgradeStat('maxHp')}
                            className="p-4 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 rounded-xl transition-all"
                          >
                            <div className="text-2xl font-bold text-red-400">HP +20</div>
                            <div className="text-sm text-gray-400">เพิ่มพลังชีวิต</div>
                          </button>
                          
                          <button
                            onClick={() => upgradeStat('speedAttack')}
                            className="p-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 rounded-xl transition-all"
                          >
                            <div className="text-2xl font-bold text-blue-400">ATK SPD +0.2</div>
                            <div className="text-sm text-gray-400">เร็วขึ้น</div>
                          </button>
                          
                          <button
                            onClick={() => upgradeStat('speedWalk')}
                            className="p-4 bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 rounded-xl transition-all"
                          >
                            <div className="text-2xl font-bold text-green-400">MOVE +0.5</div>
                            <div className="text-sm text-gray-400">เดินเร็วขึ้น</div>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Game Over Screen */}
                <AnimatePresence>
                  {gameOver && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute inset-0 bg-black/80 flex items-center justify-center"
                    >
                      <div className="bg-gray-800 p-8 rounded-2xl border border-red-500 max-w-md text-center">
                        <h4 className="text-4xl font-bold mb-2 text-red-400">Game Over</h4>
                        <p className="text-xl text-gray-300 mb-2">คะแนน: {score}</p>
                        <p className="text-lg text-gray-400 mb-6">Level: {player.level}</p>
                        
                        <button
                          onClick={resetGame}
                          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold transition-all"
                        >
                          เล่นอีกครั้ง
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Controls Info */}
                <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-2 rounded-lg text-xs text-gray-400">
                  WASD หรือ ลูกศร = เคลื่อนที่ | โจมตีอัตโนมัติ
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
