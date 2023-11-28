import * as PIXI from 'pixi.js';
import EmptyField from '../assets/sprites/blocks/grass-tile.png';
import EmptyFieldSecond from '../assets/sprites/blocks/grass-tile-second.png';
import { GameObject } from './GameObject';
import SelectedTile from '../assets/sprites/blocks/selected.png';

export default class Tile {
  public container: PIXI.Container = new PIXI.Container();
  public sprite: PIXI.Sprite;
  public selectArea: PIXI.Sprite;
  private row: number;
  private column: number;
  private gameObject: GameObject | null = null;

  constructor(x: number, y: number, size: number) {
    this.column = x;
    this.row = y;

    const tileeCount = x + y;
    if (tileeCount % 2 === 0) {
      this.sprite = PIXI.Sprite.from(EmptyField);
    } else {
      this.sprite = PIXI.Sprite.from(EmptyFieldSecond);
    }

    this.selectArea = PIXI.Sprite.from(SelectedTile);

    this.sprite.width = size;
    this.sprite.height = size;
    this.sprite.x = size * x;
    this.sprite.y = size * y;

    this.selectArea.width = size;
    this.selectArea.height = size;
    this.selectArea.x = size * x;
    this.selectArea.y = size * y;
    this.selectArea.alpha = 0;

    this.sprite.zIndex = 1;
    this.selectArea.zIndex = 2;

    this.container.addChild(this.sprite);
    this.container.addChild(this.selectArea);
  }

  get position() {
    return { x: this.column, y: this.row };
  }

  getGameObject() {
    return this.gameObject;
  }

  setGameObject(gameObject: GameObject) {
    this.gameObject = gameObject;
  }

  removeGameObject() {
    this.gameObject = null;
  }
}
