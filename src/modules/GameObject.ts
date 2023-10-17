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
  private mousePosition: { x: number; y: number; } = { x: 0, y: 0 };
  // Additional info
  public sprite: Sprite;
  private isDragging: boolean = false;
  private cell: Tile | null = null;

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
      // Click to move
      .on("touchstart", this.onDragging, this)
      .on("pointerdown", this.onDragging, this)
      // Drag to move
      .on("touchmove", this.onDragMove, this)
      .on("pointermove", this.onDragMove, this)
      .on("touchend", this.onDragEnd, this)
      .on("pointerup", this.onDragEnd, this)
      .on("touchendoutside", this.onDragEnd, this)
      .on("pointerupoutside", this.onDragEnd, this)
  }

  setPosition(x: number, y: number) {
    this.initialPosition = { x, y };
    this.sprite.x = x;
    this.sprite.y = y;
  }

  onDragging(event: PIXI.FederatedPointerEvent) {
    this.sprite.parent.emit<any>('select', this)

    this.isDragging ? this.onDragEnd() : this.onDragStart(event)
  }

  onDragStart(event: PIXI.FederatedPointerEvent) {
    this.isDragging = true;
    this.sprite.zIndex = 2;

    this.initialPosition.x = this.sprite.x;
    this.initialPosition.y = this.sprite.y;

    this.mousePosition.x = event.globalX
    this.mousePosition.y = event.globalY
  }

  onDragEnd() {
    this.isDragging = false;
    this.sprite.zIndex = 1;
    this.sprite.parent.emit<any>('deselect', this)
    this.sprite.parent.emit<any>('check-cell', this)
  }

  onDragMove(event: PIXI.FederatedPointerEvent) {
    if (this.isDragging) {

      const { x, y } = event.global;
      const dx = x - this.mousePosition.x;
      const dy = y - this.mousePosition.y;

      this.sprite.x = this.initialPosition.x + dx;
      this.sprite.y = this.initialPosition.y + dy;
    }
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
