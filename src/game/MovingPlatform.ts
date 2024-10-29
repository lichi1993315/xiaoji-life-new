import { Platform } from './Platform';

export class MovingPlatform extends Platform {
  startY: number;
  range: number;
  speed: number;
  direction: number;

  constructor(x: number, y: number, width: number, height: number, range: number = 100) {
    super(x, y, width, height);
    this.startY = y;
    this.range = range;
    this.speed = 1.5;
    this.direction = 1;
  }

  update() {
    this.y += this.speed * this.direction;
    
    if (this.y > this.startY + this.range) {
      this.direction = -1;
    } else if (this.y < this.startY) {
      this.direction = 1;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#4682B4';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}