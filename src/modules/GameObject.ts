import { Sprite } from 'pixi.js';
import * as PIXI from 'pixi.js';
import Tile from './Tile';
import { Colors, getSpriteByColor } from './garbage';

export class GameObject {
  public sprite: Sprite;
  private color: Colors;
  public initialPosition: { x: number; y: number; };
  private tile: Tile | null = null;
  private mousePosition: { x: number; y: number; } = { x: 0, y: 0 };
  private size = 0;

  private isDragging: boolean = false;

  constructor(
    x: number,
    y: number,
    size: number,
    color: Colors,
  ) {
    this.color = color;
    this.sprite = PIXI.Sprite.from(getSpriteByColor(color))
    this.initialPosition = { x, y };
    this.size = size;

    this.sprite.x = size * x + size / 2;
    this.sprite.y = size * y + size / 2;
    this.sprite.anchor.set(0.5);

    this.sprite.width = size;
    this.sprite.height = size;

    this.sprite.interactive = true;
    this.sprite.cursor = "pointer";
    this.sprite.zIndex = 1;

    this.sprite.on("mousedown", this.onDragging, this)
      .on("touchstart", this.onDragStart, this)
      .on("mouseup", this.onDragEnd, this)
      .on("mouseupoutside", this.onDragEnd, this)
      .on("touchend", this.onDragEnd, this)
      .on("touchendoutside", this.onDragEnd, this)
      .on("mousemove", this.onDragMove, this)
      .on("touchmove", this.onDragMove, this);
  }

  setPosition(x: number, y: number) {
    this.initialPosition = { x, y };
    this.sprite.x = x;
    this.sprite.y = y;
  }

  onDragging(event: PIXI.FederatedPointerEvent) {
    this.sprite.parent.emit<any>('select', this)

    if(this.isDragging) {
      this.onDragEnd();
    } else {
      this.onDragStart(event);
    }
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

    this.sprite.parent.emit<any>('check-tile', this)
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

  setTile(tile: Tile | null) {
    this.tile = tile;
  }

  deleteTile() {
    this.tile = null;
  }

  getTile() {
    return this.tile;
  }

  getColor() {
    return this.color;
  }

  setColor(color: Colors) {
    console.log('setColor', color)
    this.color = color;
    this.sprite.texture = getSpriteByColor(color);
  }
}
