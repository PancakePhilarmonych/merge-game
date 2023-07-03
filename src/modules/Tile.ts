import * as PIXI from 'pixi.js'
import EmptyField from '../assets/sprites/blocks/empty.png';
import { GameObject } from './GameObject';

export default class Tile {
  public sprite: PIXI.Sprite;
  private row: number;
  private column: number;

  constructor(x: number, y: number, size: number) {
    const fontSize = 64;
    this.column = x;
    this.row = y;

    this.sprite = PIXI.Sprite.from(EmptyField)
    this.sprite.width = size;
    this.sprite.height = size;
    this.sprite.x = size * x;
    this.sprite.y = size * y;


    const text = new PIXI.Text(`${x}, ${y}`, { fontSize, fill: 0xffffff40 });
    text.x = size + (fontSize / 2)
    text.y = size + (fontSize / 2)
    text.anchor.set(0.5);
    this.sprite.addChild(text);
  }

  get position() {
    return { x: this.column, y: this.row };
  }
}
