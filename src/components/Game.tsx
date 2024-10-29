import React, { useEffect, useRef, useState } from 'react';
import { useGameLoop } from '../hooks/useGameLoop';
import { Player } from '../game/Player';
import { Platform } from '../game/Platform';
import { Enemy } from '../game/Enemy';
import { MovingPlatform } from '../game/MovingPlatform';
import { Flag } from '../game/Flag';
import { Trophy, Skull } from 'lucide-react';

interface NPC {
  x: number;
  y: number;
  name: string;
  dialogue: {
    text: string;
    style?: {
      highlight?: string[];
      shake?: boolean;
    };
    emoji?: string;
  };
  color: string;
  isFloating?: boolean;
  hasPeakyCap?: boolean;
  hasOveralls?: boolean;
  hasSplitHair?: boolean;
  showDialogue?: boolean;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const MOVE_SPEED = 5;
const LEVEL_WIDTH = 6000;
const DEATH_HEIGHT = CANVAS_HEIGHT + 200;

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameWon, setGameWon] = useState(false);
  const [isDead, setIsDead] = useState(false);
  const cameraOffset = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const resetGame = () => {
    player.current = new Player(100, 300);
    cameraOffset.current = 0;
    setGameWon(false);
    setIsDead(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const handleDeath = () => {
    setIsDead(true);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const player = useRef(new Player(100, 300));
  const flag = useRef(new Flag(LEVEL_WIDTH - 100, CANVAS_HEIGHT - 240));
  
  const platforms = useRef([
    new Platform(0, 500, 300, 40),
    new Platform(400, 400, 200, 40),
    new Platform(700, 300, 200, 40),
    new Platform(1000, 400, 300, 40),
    new Platform(1400, 500, 200, 40),
    new Platform(1700, 400, 250, 40),
    new Platform(2000, 300, 200, 40),
    new Platform(2300, 400, 300, 40),
    new Platform(2700, 500, 400, 40),
    new Platform(3000, 400, 300, 40),
    new Platform(3400, 300, 250, 40),
    new Platform(3800, 400, 200, 40),
    new Platform(4200, 500, 300, 40),
    new Platform(4600, 400, 250, 40),
    new Platform(5000, 300, 200, 40),
    new Platform(5400, 400, 300, 40),
    new Platform(5800, 500, 400, 40)
  ]);

  const npcs = useRef([
    { x: 200, y: 440, name: "杏子", dialogue: { text: "快来闻我的臭拖鞋!" }, color: "#FF69B4", hasSplitHair: true },
    { x: 800, y: 240, name: "闫辰祥", dialogue: { text: "变!快给我变!" }, color: "#4169E1" },
    { x: 1500, y: 440, name: "峰哥", dialogue: { text: "小吉!快来让我撸一下小吉!" }, color: "#8B4513", isFloating: true },
    { x: 2200, y: 340, name: "姚越凡", dialogue: { text: "(正在和不行讨论游戏)我觉得这个体验是比较符合玩家直觉的!", style: { highlight: ["玩家直觉"] }, emoji: "😊" }, color: "#FFD700" },
    { x: 2900, y: 440, name: "不行", dialogue: { text: "策划案一定要写的让人能读懂才行啊啊啊啊!!!", style: { shake: true }, emoji: "❗" }, color: "#32CD32", hasOveralls: true },
    { x: 3600, y: 240, name: "泽哥", dialogue: { text: "啊,这个需求不是很简单吗,我明天做一个demo给你", emoji: "😎" }, color: "#9370DB" },
    { x: 4300, y: 440, name: "海鸥", dialogue: { text: "没错,我们这个游戏一定要发神经!(压了压鸭舌帽)", emoji: "😐" }, color: "#20B2AA", hasPeakyCap: true },
    { x: 5000, y: 240, name: "李泊凡", dialogue: { text: "这么说好像也没错!", emoji: "😮" }, color: "#FF7F50" },
    { x: 5700, y: 440, name: "杨泽雄", dialogue: { text: "小吉,没事的,我不是鬼,不用害怕!不要迷信哥,哥只是个传说", emoji: "😈" }, color: "#483D8B" }
  ]);

  const movingPlatforms = useRef([
    new MovingPlatform(350, 200, 100, 20, 150),
    new MovingPlatform(900, 250, 100, 20, 100),
    new MovingPlatform(1600, 200, 100, 20, 120),
    new MovingPlatform(2200, 200, 100, 20, 150),
    new MovingPlatform(3200, 200, 100, 20, 120),
    new MovingPlatform(4000, 200, 100, 20, 150),
    new MovingPlatform(4800, 200, 100, 20, 120),
    new MovingPlatform(5600, 200, 100, 20, 150)
  ]);

  const enemies = useRef([
    new Enemy(500, 360, 150),
    new Enemy(1100, 360, 200),
    new Enemy(1800, 360, 150),
    new Enemy(2400, 360, 200),
    new Enemy(3300, 360, 150),
    new Enemy(4100, 360, 200),
    new Enemy(4900, 360, 150),
    new Enemy(5500, 360, 200)
  ]);

  useEffect(() => {
    // Initialize background music
    audioRef.current = new Audio('/music/background.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
    audioRef.current.play().catch(() => {
      console.log('Audio autoplay was prevented. Click to start music.');
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const keys = useRef({
    left: false,
    right: false,
    up: false,
    space: false
  });

  const gameLoop = (ctx: CanvasRenderingContext2D) => {
    if (gameWon || isDead) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (player.current.x > CANVAS_WIDTH / 3) {
      cameraOffset.current = Math.min(
        player.current.x - CANVAS_WIDTH / 3,
        LEVEL_WIDTH - CANVAS_WIDTH
      );
    }

    if (keys.current.left) player.current.velX = -MOVE_SPEED;
    if (keys.current.right) player.current.velX = MOVE_SPEED;
    if (!keys.current.left && !keys.current.right) player.current.velX *= 0.8;

    player.current.velY += GRAVITY;
    player.current.x += player.current.velX;
    player.current.y += player.current.velY;

    if (player.current.y > DEATH_HEIGHT) {
      handleDeath();
      return;
    }

    // Check NPC collisions and update dialogue visibility
    npcs.current.forEach(npc => {
      const npcBounds = {
        x: npc.x,
        y: npc.y,
        width: 50,
        height: 60
      };
      npc.showDialogue = player.current.checkCollision(npcBounds);
    });

    movingPlatforms.current.forEach(platform => platform.update());
    enemies.current.forEach(enemy => enemy.update());

    let onGround = false;
    [...platforms.current, ...movingPlatforms.current].forEach(platform => {
      if (player.current.checkCollision(platform)) {
        onGround = true;
        player.current.y = platform.y - player.current.height;
        player.current.velY = 0;
      }
    });

    enemies.current.forEach(enemy => {
      if (player.current.checkCollision(enemy)) {
        handleDeath();
        return;
      }
    });

    if (player.current.checkCollision(flag.current)) {
      setGameWon(true);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }

    if ((keys.current.up || keys.current.space) && onGround) {
      player.current.velY = JUMP_FORCE;
    }

    if (player.current.x < 0) player.current.x = 0;
    if (player.current.x > LEVEL_WIDTH - player.current.width) {
      player.current.x = LEVEL_WIDTH - player.current.width;
    }

    ctx.save();
    ctx.translate(-cameraOffset.current, 0);

    // Background
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(cameraOffset.current, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Clouds
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < LEVEL_WIDTH; i += 300) {
      const offsetX = (i + (cameraOffset.current * 0.5) % 300);
      ctx.beginPath();
      ctx.arc(offsetX, 100, 30, 0, Math.PI * 2);
      ctx.arc(offsetX + 20, 100, 30, 0, Math.PI * 2);
      ctx.arc(offsetX + 40, 100, 30, 0, Math.PI * 2);
      ctx.fill();
    }

    platforms.current.forEach(platform => platform.draw(ctx));
    movingPlatforms.current.forEach(platform => platform.draw(ctx));
    enemies.current.forEach(enemy => enemy.draw(ctx));
    flag.current.draw(ctx);

    // Draw NPCs
    npcs.current.forEach(npc => {
      const npcWidth = 50;
      const npcHeight = 60;
      
      const floatOffset = npc.isFloating ? Math.sin(Date.now() / 500) * 10 : 0;
      const npcY = npc.y + floatOffset;

      // Draw body with overalls if needed
      if (npc.hasOveralls) {
        // Draw shirt part
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(npc.x, npcY, npcWidth, 20);
        
        // Draw overalls
        ctx.fillStyle = '#4444FF';
        ctx.fillRect(npc.x, npcY + 20, npcWidth, npcHeight - 20);
        
        // Draw straps
        ctx.fillRect(npc.x + 10, npcY, 8, 20); // Left strap
        ctx.fillRect(npc.x + npcWidth - 18, npcY, 8, 20); // Right strap
      } else {
        ctx.fillStyle = npc.color;
        ctx.fillRect(npc.x, npcY, npcWidth, npcHeight);
      }

      // Draw head
      ctx.fillStyle = '#FFE4C4';
      ctx.beginPath();
      ctx.arc(npc.x + npcWidth/2, npcY - 15, 20, 0, Math.PI * 2);
      ctx.fill();

      // Draw special features
      if (npc.hasPeakyCap) {
        // Main cap part
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(npc.x + npcWidth/2, npcY - 25, 15, Math.PI, 0);
        ctx.fill();
        
        // Baseball cap visor
        ctx.beginPath();
        ctx.moveTo(npc.x + npcWidth/2 - 15, npcY - 25);
        ctx.quadraticCurveTo(
          npc.x + npcWidth/2 - 5, 
          npcY - 35,
          npc.x + npcWidth/2 + 25, 
          npcY - 25
        );
        ctx.lineTo(npc.x + npcWidth/2 - 15, npcY - 25);
        ctx.fill();
      }

      if (npc.hasSplitHair) {
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(npc.x + npcWidth/2 - 15, npcY - 35);
        ctx.lineTo(npc.x + npcWidth/2, npcY - 25);
        ctx.lineTo(npc.x + npcWidth/2 + 15, npcY - 35);
        ctx.fill();
      }

      // Draw name tag and dialogue
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(npc.x - 10, npcY - 65, npcWidth + 20, 20);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(npc.name, npc.x + npcWidth/2, npcY - 50);

      // Draw dialogue bubble only when in contact
      if (npc.showDialogue && npc.dialogue) {
        const bubbleHeight = 40;
        const bubbleWidth = 200;
        const bubbleX = npc.x + npcWidth/2 - bubbleWidth/2;
        const bubbleY = npcY - 100;

        // Bubble background
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 10);
        ctx.fill();

        // Bubble pointer
        ctx.beginPath();
        ctx.moveTo(npc.x + npcWidth/2 - 10, bubbleY + bubbleHeight);
        ctx.lineTo(npc.x + npcWidth/2, bubbleY + bubbleHeight + 10);
        ctx.lineTo(npc.x + npcWidth/2 + 10, bubbleY + bubbleHeight);
        ctx.fill();

        // Text
        ctx.fillStyle = 'black';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        
        let text = npc.dialogue.text;
        if (npc.dialogue.emoji) {
          text += ' ' + npc.dialogue.emoji;
        }

        if (npc.dialogue.style?.shake) {
          const shakeOffset = Math.sin(Date.now() / 50) * 2;
          ctx.fillText(text, bubbleX + bubbleWidth/2 + shakeOffset, bubbleY + bubbleHeight/2);
        } else {
          ctx.fillText(text, bubbleX + bubbleWidth/2, bubbleY + bubbleHeight/2);
        }

        // Highlight specific words if specified
        if (npc.dialogue.style?.highlight) {
          ctx.fillStyle = '#FFD700';
          npc.dialogue.style.highlight.forEach(word => {
            const words = text.split(' ');
            let currentX = bubbleX + bubbleWidth/2;
            let totalWidth = 0;
            
            words.forEach(w => {
              const metrics = ctx.measureText(w + ' ');
              if (w === word) {
                ctx.fillText(w, currentX - totalWidth + metrics.width/2, bubbleY + bubbleHeight/2);
              }
              totalWidth += metrics.width;
            });
          });
        }
      }
    });

    player.current.draw(ctx);
    ctx.restore();
  };

  useGameLoop(canvasRef, gameLoop);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') keys.current.left = true;
      if (e.key === 'ArrowRight') keys.current.right = true;
      if (e.key === 'ArrowUp') keys.current.up = true;
      if (e.key === ' ') keys.current.space = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') keys.current.left = false;
      if (e.key === 'ArrowRight') keys.current.right = false;
      if (e.key === 'ArrowUp') keys.current.up = false;
      if (e.key === ' ') keys.current.space = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <h1 className="text-3xl font-bold text-white mb-4">小吉历险记</h1>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border-4 border-gray-700 rounded-lg shadow-lg"
          onClick={() => audioRef.current?.play()}
        />
        {!gameWon && !isDead && (
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded">
            使用方向键或空格键移动和跳跃
          </div>
        )}
        {gameWon && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
            <div className="text-center">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-white mb-2">恭喜通关！</h2>
              <p className="text-xl text-yellow-400 mb-6">小吉成功完成冒险！</p>
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                再玩一次
              </button>
            </div>
          </div>
        )}
        {isDead && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
            <div className="text-center">
              <Skull className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-white mb-2">游戏结束</h2>
              <p className="text-xl text-red-400 mb-6">小吉遇到了困难！要再试一次吗？</p>
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-400 transition-colors"
              >
                重新开始
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;