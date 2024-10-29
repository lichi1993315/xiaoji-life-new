export class Flag {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 200;
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw pole
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(this.x, this.y, 8, this.height);
    
    // Draw flag
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.moveTo(this.x + 8, this.y);
    ctx.lineTo(this.x + 48, this.y + 20);
    ctx.lineTo(this.x + 8, this.y + 40);
    ctx.fill();
  }
}