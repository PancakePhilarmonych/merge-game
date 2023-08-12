import * as PIXI from 'pixi.js';

import redOne from '../assets/sprites/blocks/levels/red_one.png';
import redTwo from '../assets/sprites/blocks/levels/red_two.png';
import redThree from '../assets/sprites/blocks/levels/red_three.png';
import yellowOne from '../assets/sprites/blocks/levels/yellow_one.png';
import yellowTwo from '../assets/sprites/blocks/levels/yellow_two.png';
import yellowThree from '../assets/sprites/blocks/levels/yellow_three.png';
import blueOne from '../assets/sprites/blocks/levels/blue_one.png';
import blueTwo from '../assets/sprites/blocks/levels/blue_two.png';
import blueThree from '../assets/sprites/blocks/levels/blue_three.png';
import empty from '../assets/sprites/blocks/levels/ev-empty-2.png';


export enum Colors {
  RED = 0,
  RED_TWO = 1,
  RED_THREE = 2,
  YELLOW = 3,
  YELLOW_TWO = 4,
  YELLOW_THREE = 5,
  BLUE = 6,
  BLUE_TWO = 7,
  BLUE_THREE = 8,
  EMPTY = 9,
}

export const getSpriteByColor = (color?: Colors) => {
  switch (color) {
    case Colors.RED:
      return PIXI.Texture.from(redOne);
    case Colors.RED_TWO:
      return PIXI.Texture.from(redTwo);
    case Colors.RED_THREE:
      return PIXI.Texture.from(redThree);
    case Colors.YELLOW:
      return PIXI.Texture.from(yellowOne);
    case Colors.YELLOW_TWO:
      return PIXI.Texture.from(yellowTwo);
    case Colors.YELLOW_THREE:
      return PIXI.Texture.from(yellowThree);
    case Colors.BLUE:
      return PIXI.Texture.from(blueOne);
    case Colors.BLUE_TWO:
      return PIXI.Texture.from(blueTwo);
    case Colors.BLUE_THREE:
      return PIXI.Texture.from(blueThree);
    case Colors.EMPTY:
      return PIXI.Texture.from(empty);
    default:
      return PIXI.Texture.from(empty);
  }
}
