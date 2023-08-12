import * as PIXI from 'pixi.js'
import EmptyField from '../assets/sprites/blocks/levels/ev-empty-2.png';
import { GameObject } from './GameObject';

export default class Tile {
  public sprite: PIXI.Sprite;
  private row: number;
  private column: number;
  private gameObject: GameObject | null = null;

  constructor(x: number, y: number, size: number) {
    this.column = x;
    this.row = y;

    this.sprite = PIXI.Sprite.from(EmptyField)
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
