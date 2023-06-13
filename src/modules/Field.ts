import { Sprite } from 'pixi.js';
import Block from './Block';
import * as PIXI from 'pixi.js';
import empty from '../assets/sprites/blocks/empty.png';

export class Field {
  public sprite: Sprite;
  public isHovered: boolean = false;
  private block: Block | null = null;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    public index: number,
  ) {
    this.sprite = PIXI.Sprite.from(empty)
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

      console.log('FIELD STAT', {
        isHovered: this.isHovered,
        index: this.index,
        isEmpty: this.isEmpty(),
      });
    }

    this.sprite.onclick = () => {
      this.setBlock(new Block());
    }

    this.sprite.onmouseleave = () => {
      this.isHovered = false;
      if (this.isEmpty()) {
        this.sprite.alpha = 1;
      }
    }
  }

  setBlock(block: Block) {
    if (!this.isEmpty()) {
      throw new Error('Field is not empty');
    }

    this.block = block;
    this.sprite.alpha = 0.4;
  }

  isEmpty() {
    return !this.block;
  }
}
