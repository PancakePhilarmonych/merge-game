import { ETileType } from 'models.ts/common';
import * as PIXI from 'pixi.js'
import EmptyField from '../assets/sprites/blocks/empty.png';

export default class Tile {
  private container: PIXI.Container;
  private sprite: PIXI.Sprite;
  public position: { x: number, y: number };

  constructor(x: number, y: number, tileSize: number, type: ETileType) {
    this.position = { x, y };

    this.container = new PIXI.Container();
    this.sprite = PIXI.Sprite.from(EmptyField)

    this.container.x = tileSize * x;
    this.container.y = tileSize * y;

    this.container.width = tileSize;
    this.container.height = tileSize;

    this.sprite.width = tileSize;
    this.sprite.height = tileSize;

    this.sprite.x = this.container.x;
    this.sprite.y = this.container.y;

    this.container.addChild(this.sprite);
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
}
