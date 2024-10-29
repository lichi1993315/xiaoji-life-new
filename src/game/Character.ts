export class Character {
  x: number;
  y: number;
  width: number;
  height: number;
  initialY: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.initialY = y;
    this.width = width;
    this.height = height;
  }

  checkCollision(object: { x: number; y: number; width: number; height: number }) {
    return (
      this.x < object.x + object.width &&
      this.x + this.width > object.x &&
      this.y + this.height > object.y &&
      this.y < object.y + object.height
    );
  }
}