import * as PIXI from 'pixi.js'
import EmptyField from '../assets/sprites/blocks/grass-tile.png';
import EmptyFieldSecond from '../assets/sprites/blocks/grass-tile-second.png';
import { GameObject } from './GameObject';

export default class Tile {
  public sprite: PIXI.Sprite;
  private row: number;
  private column: number;
  private gameObject: GameObject | null = null;

  constructor(x: number, y: number, size: number) {
    this.column = x;
    this.row = y;

    const tileeCount = x + y;
    if (tileeCount % 2 === 0) {
      this.sprite = PIXI.Sprite.from(EmptyField)
    } else {
      this.sprite = PIXI.Sprite.from(EmptyFieldSecond)
    }

    this.sprite.width = size;
    this.sprite.height = size;
    this.sprite.x = size * x;
    this.sprite.y = size * y;
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
