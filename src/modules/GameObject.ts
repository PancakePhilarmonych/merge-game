import { Sprite } from 'pixi.js';
import * as PIXI from 'pixi.js';
import Tile from './Tile';
import { Colors, getSpriteByColor } from '../utils';

export class GameObject {
  // Meta
  public level: number = 1;
  private color: Colors;
  // Position
  public initialPosition: { x: number; y: number };
  // Additional info
  private cell: Tile | null = null;
  public sprite: Sprite;
  public levelText: PIXI.Text;
  // Movement state
  private isDragging: boolean = false;
  public isUnblocked: boolean = false;
  private pointerDownTime: number = 0;
  private ponterDownTimeOut: any = null;
  public container: PIXI.Container;

  constructor(x: number, y: number, size: number, color: Colors) {
    this.color = color;
    this.container = new PIXI.Container();
    this.sprite = PIXI.Sprite.from(getSpriteByColor[color]);
    this.sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    this.initialPosition = { x, y };

    this.container.x = size * x + size / 2;
    this.container.y = size * y + size / 2;
    this.container.width = size;
    this.container.height = size;

    this.sprite.anchor.set(0.5);

    this.sprite.width = size;
    this.sprite.height = size;

    this.sprite.eventMode = 'dynamic';
    this.sprite.cursor = 'pointer';
    this.container.zIndex = 1;

    this.levelText = new PIXI.Text(this.getLevel(), {
      fontSize: this.sprite.width / 3,
      fontFamily: 'Titan One',
      fill: 0xffffff,
    });

    this.levelText.anchor.set(0.5);
    this.levelText.x = this.sprite.x;
    this.levelText.y = this.sprite.y;
    this.levelText.zIndex = 2;
    this.levelText.eventMode = 'none';

    this.container.addChild(this.sprite);
    this.container.addChild(this.levelText);

    this.sprite
      .on('pointerdown', this.onPointedDown, this)
      .on('pointermove', this.onPointerMove, this)
      .on('pointerup', this.onPointedUp, this)
      .on('pointerupoutside', this.onPointedUp, this);
  }

  setPosition(x: number, y: number) {
    this.initialPosition = { x, y };
    this.container.x = x;
    this.container.y = y;
  }

  onPointedDown() {
    this.container.parent.emit<any>('select', this);
    this.pointerDownTime = Date.now();

    this.ponterDownTimeOut = setTimeout(() => {
      this.isDragging = true;
    }, 20);
  }

  onPointerMove() {
    if (this.isDragging) {
      this.isUnblocked = true;
      this.container.zIndex = 2;
    }
  }

  onPointedUp() {
    clearTimeout(this.ponterDownTimeOut);

    this.isDragging = false;
    this.container.zIndex = 1;

    if (this.isUnblocked) {
      this.isUnblocked = false;
      this.container.parent.emit<any>('deselect', this);
      this.container.parent.emit<any>('check-cell', this);
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
    this.color = color;
    this.sprite.texture = getSpriteByColor[color];
  }

  delete() {
    this.container.parent.removeChild(this.container);
  }

  public getLevel() {
    let result = 1;

    for (let i = 1; i < this.level; i++) {
      result *= 2;
    }

    return result;
  }

  levelUp() {
    this.level++;
    this.levelText.text = this.getLevel();
  }
}
