import { Sprite } from 'pixi.js';
import * as PIXI from 'pixi.js';
import Tile from './Tile';

export class GameObject {
  public sprite: Sprite;
  public text: PIXI.Text;
  public initialPosition: { x: number; y: number; };
  private tile: Tile | null = null;
  private mousePosition: { x: number; y: number; } = { x: 0, y: 0 };
  private size = 0;

  private isDragging: boolean = false;

  constructor(
    x: number,
    y: number,
    size: number,
    sprite: string,
  ) {
    this.sprite = PIXI.Sprite.from(sprite);
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

    this.text = new PIXI.Text(`${x}, ${y}`, { fontSize: 32, fill: 0x0000020 });
    this.text.x = size / 32
    this.text.y = size / 32
    this.text.anchor.set(0.5);
    this.sprite.addChild(this.text);

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

  setText(text: string) {
    this.text.destroy();
    this.text = new PIXI.Text(text, { fontSize: 32, fill: 0x0000020 });
    this.text.x = this.size / 32
    this.text.y = this.size / 32
    this.text.anchor.set(0.5);
    this.sprite.addChild(this.text);

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

  setTile(tile: Tile) {
    this.tile = tile;
  }

  deleteTile() {
    this.tile = null;
  }

  getTile() {
    return this.tile;
  }
}
