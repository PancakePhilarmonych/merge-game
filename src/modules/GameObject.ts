import { Sprite } from 'pixi.js';
import * as PIXI from 'pixi.js';
import Tile from './Tile';
import { Colors, getSpriteByColor } from '../utils';

export class GameObject {
  // Only for game object
  private maxLevel: boolean = false;
  private level: number = 0;
  private type: string = '';
  private canBeSell: boolean = false;
  private cost: number = 0;
  // Only for game object
  private color: Colors;
  // Position
  public initialPosition: { x: number; y: number; };
  private lastMousePosition: { x: number; y: number; } = { x: 0, y: 0 };
  private mousePosition: { x: number; y: number; } = { x: 0, y: 0 };
  // Additional info
  public sprite: Sprite;
  private isDragging: boolean = false;
  private cell: Tile | null = null;
  public isUnblocked: boolean = false;
  private pointerDownTime: number = 0;
  private ponterDownTimeOut: any = null;

  constructor(
    x: number,
    y: number,
    size: number,
    color: Colors,
  ) {
    this.color = color;
    this.sprite = PIXI.Sprite.from(getSpriteByColor[color])
    this.initialPosition = { x, y };

    this.sprite.x = size * x + size / 2;
    this.sprite.y = size * y + size / 2;
    this.sprite.anchor.set(0.5);

    this.sprite.width = size;
    this.sprite.height = size;

    this.sprite.eventMode = 'dynamic'
    this.sprite.cursor = "pointer";
    this.sprite.zIndex = 1;

    this.sprite
      .on("pointerdown", this.onDragStart, this)
      .on("pointermove", this.onDragMove, this)
      .on("pointerup", this.onDragEnd, this)
  }

  setPosition(x: number, y: number) {
    this.initialPosition = { x, y };
    this.sprite.x = x;
    this.sprite.y = y;
  }

  onDragStart() {
    this.sprite.parent.emit<any>('select', this);
    this.pointerDownTime = Date.now();

    this.ponterDownTimeOut = setTimeout(() => {
      const timeElapsed = Date.now() - this.pointerDownTime;
      if (timeElapsed > 100) this.isDragging = true;
    }, 100);
  }

  onDragMove() {
    if (this.isDragging) {
      this.isUnblocked = true;
      this.sprite.zIndex = 2;
    }
  }

  onDragEnd(event: PIXI.FederatedPointerEvent) {
    clearTimeout(this.ponterDownTimeOut);

    this.isDragging = false;
    this.sprite.zIndex = 1;

    if (this.isUnblocked) {
      this.isUnblocked = false;
      this.sprite.parent.emit<any>('deselect', this);
      this.sprite.parent.emit<any>('check-cell', this);
    }

    this.lastMousePosition.x = event.data.global.x;
    this.lastMousePosition.y = event.data.global.y;
  }

  setCell(cell: Tile | null) {
    this.cell = cell;
  }

  deleteCell() {
    this.cell = null;
  }

  getCell() {
    return this.cell;
  }

  getColor() {
    return this.color;
  }

  setColor(color: Colors) {
    console.log('setColor', color)
    this.color = color;
    this.sprite.texture = getSpriteByColor[color];
  }

  delete() {
    this.sprite.parent.removeChild(this.sprite);
  }
}
