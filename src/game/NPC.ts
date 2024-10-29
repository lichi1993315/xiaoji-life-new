import { Character } from './Character';

export interface DialogueProps {
  text: string;
  emoji?: string;
  style?: {
    highlight?: string[];
    shake?: boolean;
  };
}

export class NPC extends Character {
  name: string;
  dialogue: DialogueProps;
  color: string;
  isFloating?: boolean;
  floatOffset: number = 0;
  floatSpeed: number = 0.05;
  hasCap?: boolean;
  hasOveralls?: boolean;
  hasSplitHair?: boolean;

  constructor(
    x: number, 
    y: number, 
    name: string, 
    dialogue: DialogueProps, 
    color: string, 
    isFloating: boolean = false,
    hasCap: boolean = false,
    hasOveralls: boolean = false,
    hasSplitHair: boolean = false
  ) {
    super(x, y, 50, 50);
    this.name = name;
    this.dialogue = dialogue;
    this.color = color;
    this.isFloating = isFloating;
    this.hasCap = hasCap;
    this.hasOveralls = hasOveralls;
    this.hasSplitHair = hasSplitHair;
  }

  update() {
    if (this.isFloating) {
      this.floatOffset = Math.sin(Date.now() * this.floatSpeed) * 20;
      this.y = this.initialY + this.floatOffset;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw name tag
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(this.x, this.y - 25, this.width, 20);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.name, this.x + this.width / 2, this.y - 10);

    // Draw body
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x + 12, this.y + 18, 26, 32);
    
    // Draw head
    ctx.fillStyle = '#FFE4C4';
    ctx.beginPath();
    ctx.arc(this.x + 25, this.y + 12, 12, 0, Math.PI * 2);
    ctx.fill();

    // Draw split hair for 杏子
    if (this.hasSplitHair) {
      ctx.fillStyle = '#000000';
      // Left side
      ctx.beginPath();
      ctx.moveTo(this.x + 13, this.y + 12);
      ctx.quadraticCurveTo(this.x + 10, this.y + 5, this.x + 8, this.y + 15);
      ctx.quadraticCurveTo(this.x + 10, this.y + 25, this.x + 13, this.y + 20);
      ctx.fill();
      // Right side
      ctx.beginPath();
      ctx.moveTo(this.x + 37, this.y + 12);
      ctx.quadraticCurveTo(this.x + 40, this.y + 5, this.x + 42, this.y + 15);
      ctx.quadraticCurveTo(this.x + 40, this.y + 25, this.x + 37, this.y + 20);
      ctx.fill();
    }

    // Draw eyes
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(this.x + 20, this.y + 10, 2.5, 0, Math.PI * 2);
    ctx.arc(this.x + 30, this.y + 10, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Draw smile
    ctx.beginPath();
    ctx.arc(this.x + 25, this.y + 15, 5, 0, Math.PI);
    ctx.stroke();

    // Draw arms
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x + 6, this.y + 25, 6, 19);
    ctx.fillRect(this.x + 38, this.y + 25, 6, 19);

    // Draw legs
    ctx.fillRect(this.x + 15, this.y + 44, 8, 19);
    ctx.fillRect(this.x + 27, this.y + 44, 8, 19);

    // Draw peaky cap if needed
    if (this.hasCap) {
      ctx.fillStyle = '#333333';
      // Main cap part
      ctx.beginPath();
      ctx.moveTo(this.x + 13, this.y);
      ctx.lineTo(this.x + 37, this.y);
      ctx.lineTo(this.x + 44, this.y + 6);
      ctx.lineTo(this.x + 6, this.y + 6);
      ctx.fill();
      
      // Extended peaky visor
      ctx.beginPath();
      ctx.moveTo(this.x + 6, this.y + 6);
      ctx.lineTo(this.x + 44, this.y + 6);
      ctx.lineTo(this.x + 52, this.y + 8);
      ctx.lineTo(this.x - 2, this.y + 8);
      ctx.fill();
    }

    // Draw overalls if needed
    if (this.hasOveralls) {
      ctx.fillStyle = '#4169E1';
      ctx.fillRect(this.x + 12, this.y + 18, 26, 38);
      
      // Straps
      ctx.fillRect(this.x + 15, this.y + 18, 5, 13);
      ctx.fillRect(this.x + 30, this.y + 18, 5, 13);
      
      // Pocket
      ctx.fillStyle = '#5179F1';
      ctx.fillRect(this.x + 19, this.y + 31, 13, 10);
    }
  }
}