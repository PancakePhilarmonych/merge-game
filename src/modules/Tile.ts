import { ETileType } from 'models.ts/common';
import * as PIXI from 'pixi.js'
import EmptyField from '../assets/sprites/blocks/empty.png';

export default class Tile {
  private container: PIXI.Container;
  private sprite: PIXI.Sprite;
  private gameObject: any = null;
  public position: { x: number, y: number };

  constructor(x: number, y: number, tileSize: number, type: ETileType) {
    this.position = { x, y };

    this.container = new PIXI.Container();
    this.sprite = PIXI.Sprite.from(EmptyField)

    this.container.x = tileSize * x;
    this.container.y = tileSize * y;

    this.sprite.width = tileSize;
    this.sprite.height = tileSize;

    this.container.addChild(this.sprite);

    const text = new PIXI.Text(`${x}, ${y}`, { fontSize: 18, fill: 0xffffff });
    text.x = this.container.width / 2 - text.width / 2;
    text.y = this.container.height / 2 - text.height / 2;
    this.container.addChild(text);
  }

  select() {
    this.sprite.alpha = 0.4;
  }

  unselect() {
    this.sprite.alpha = 1;
  }

  hover() {
    this.sprite.alpha = 0.8;
  }

  getSpite() {
    return this.sprite;
  }

  getContainer() {
    return this.container;
  }
}
