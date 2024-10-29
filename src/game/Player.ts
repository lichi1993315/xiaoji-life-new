import { Character } from './Character';

export class Player extends Character {
  velX: number = 0;
  velY: number = 0;

  constructor(x: number, y: number) {
    super(x, y, 30, 30); // Reduced from 40x40 to 30x30
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw cat body
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Draw ears (scaled down)
    ctx.beginPath();
    ctx.moveTo(this.x + 4, this.y);
    ctx.lineTo(this.x + 11, this.y - 8);
    ctx.lineTo(this.x + 18, this.y);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(this.x + 18, this.y);
    ctx.lineTo(this.x + 25, this.y - 8);
    ctx.lineTo(this.x + 32, this.y);
    ctx.fill();
    
    // Draw eyes (scaled down)
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(this.x + 11, this.y + 11, 3, 6, 0, 0, Math.PI * 2);
    ctx.ellipse(this.x + 26, this.y + 11, 3, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw nose (scaled down)
    ctx.fillStyle = '#FFC0CB';
    ctx.beginPath();
    ctx.moveTo(this.x + 18, this.y + 15);
    ctx.lineTo(this.x + 15, this.y + 18);
    ctx.lineTo(this.x + 21, this.y + 18);
    ctx.fill();
    
    // Draw whiskers (scaled down)
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    
    // Left whiskers
    ctx.beginPath();
    ctx.moveTo(this.x + 11, this.y + 18);
    ctx.lineTo(this.x, this.y + 15);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.x + 11, this.y + 18);
    ctx.lineTo(this.x, this.y + 18);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.x + 11, this.y + 18);
    ctx.lineTo(this.x, this.y + 21);
    ctx.stroke();
    
    // Right whiskers
    ctx.beginPath();
    ctx.moveTo(this.x + 26, this.y + 18);
    ctx.lineTo(this.x + 37, this.y + 15);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.x + 26, this.y + 18);
    ctx.lineTo(this.x + 37, this.y + 18);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.x + 26, this.y + 18);
    ctx.lineTo(this.x + 37, this.y + 21);
    ctx.stroke();
  }
}