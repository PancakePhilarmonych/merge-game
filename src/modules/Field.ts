import { Sprite } from 'pixi.js';
import * as PIXI from 'pixi.js';
import EmptyField from '../assets/sprites/blocks/empty.png';

export class Field {
  public sprite: Sprite;
  public isHovered: boolean = false;
  private gameObject: any = null;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    public index: number,
  ) {
    this.sprite = PIXI.Sprite.from(EmptyField)
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.width = width;
    this.sprite.height = height;

    this.sprite.interactive = true;

    this.sprite.onmouseenter = () => {
      this.isHovered = true;

      if (this.isEmpty()) {
        this.sprite.alpha = 0.8;
      }

      this.sprite.cursor = 'pointer';
    }

    this.sprite.onclick = () => {
      if (!this.isEmpty()) {
        this.gameObject = null;
        this.sprite.alpha = 0.8;
        return;
      }
      this.setGameObject(1);
    }

    this.sprite.onmouseleave = () => {
      this.isHovered = false;
      if (this.isEmpty()) {
        this.sprite.alpha = 1;
      }
    }
  }

  setGameObject(block: any) {
    if (!this.isEmpty()) {
      throw new Error('Field is not empty');
    }

    this.gameObject = block;
    this.sprite.alpha = 0.4;
  }

  isEmpty() {
    return !this.gameObject;
  }
}
