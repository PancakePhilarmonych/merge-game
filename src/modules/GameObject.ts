import * as PIXI from 'pixi.js';
import Tile from './Cell';
import { Colors, getSpriteByColor } from '../utils';
export class GameObject extends PIXI.Container {
  private color: Colors;
  private cell: Tile;
  private sprite: PIXI.Sprite;

  public level: number = 1;
  public levelText: PIXI.Text;

  constructor(cell: Tile, color: Colors) {
    const [x, y, size] = [cell.position.x, cell.position.y, cell.sprite.width];

    super();
    this.cell = cell;
    this.color = color;
    this.position = { x, y };

    this.x = size * x + size / 2;
    this.y = size * y + size / 2;
    this.width = size;
    this.height = size;
    this.zIndex = 1;

    this.sprite = PIXI.Sprite.from(getSpriteByColor[color]);
    this.sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    this.sprite.anchor.set(0.5);
    this.sprite.width = size;
    this.sprite.height = size;

    this.eventMode = 'dynamic';
    this.cursor = 'pointer';

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

    this.addChild(this.sprite);
    this.addChild(this.levelText);

    this.on('pointerdown', this.onPointedDown, this);
  }

  setPosition(x: number, y: number) {
    this.position = { x, y };
    this.x = x;
    this.y = y;
  }

  onPointedDown() {
    this.parent.emit<any>('select', this);
  }

  setCell(cell: Tile) {
    this.cell = cell;
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
