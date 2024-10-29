import { Character } from './Character';

export class Enemy extends Character {
  speed: number;
  startX: number;
  range: number;
  direction: number;

  constructor(x: number, y: number, range: number = 100) {
    super(x, y, 35, 35); // Slightly larger than player
    this.speed = 2;
    this.startX = x;
    this.range = range;
    this.direction = 1;
  }

  update() {
    this.x += this.speed * this.direction;
    
    if (this.x > this.startX + this.range) {
      this.direction = -1;
    } else if (this.x < this.startX) {
      this.direction = 1;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw cat body
    ctx.fillStyle = '#000000';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Draw ears
    ctx.beginPath();
    ctx.moveTo(this.x + 5, this.y);
    ctx.lineTo(this.x + 15, this.y - 10);
    ctx.lineTo(this.x + 25, this.y);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(this.x + 25, this.y);
    ctx.lineTo(this.x + 35, this.y - 10);
    ctx.lineTo(this.x + 45, this.y);
    ctx.fill();
    
    // Draw eyes
    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();
    ctx.ellipse(this.x + 12, this.y + 12, 3, 6, 0, 0, Math.PI * 2);
    ctx.ellipse(this.x + 23, this.y + 12, 3, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw nose
    ctx.fillStyle = '#FFC0CB';
    ctx.beginPath();
    ctx.moveTo(this.x + 17, this.y + 17);
    ctx.lineTo(this.x + 12, this.y + 22);
    ctx.lineTo(this.x + 22, this.y + 22);
    ctx.fill();
    
    // Draw whiskers
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    
    // Left whiskers
    ctx.beginPath();
    ctx.moveTo(this.x + 12, this.y + 22);
    ctx.lineTo(this.x - 3, this.y + 17);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.x + 12, this.y + 22);
    ctx.lineTo(this.x - 3, this.y + 22);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.x + 12, this.y + 22);
    ctx.lineTo(this.x - 3, this.y + 27);
    ctx.stroke();
    
    // Right whiskers
    ctx.beginPath();
    ctx.moveTo(this.x + 23, this.y + 22);
    ctx.lineTo(this.x + 38, this.y + 17);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.x + 23, this.y + 22);
    ctx.lineTo(this.x + 38, this.y + 22);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.x + 23, this.y + 22);
    ctx.lineTo(this.x + 38, this.y + 27);
    ctx.stroke();
    
    // Draw tail
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.height - 5);
    ctx.quadraticCurveTo(
      this.x - 15,
      this.y + this.height - 15,
      this.x - 10,
      this.y + this.height - 25
    );
    ctx.stroke();
  }
}