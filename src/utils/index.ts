import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

import redOne from '../assets/sprites/blocks/red_one.png';
import redTwo from '../assets/sprites/blocks/red_two.png';
import redThree from '../assets/sprites/blocks/red_three.png';
import yellowOne from '../assets/sprites/blocks/yellow_one.png';
import yellowTwo from '../assets/sprites/blocks/yellow_two.png';
import yellowThree from '../assets/sprites/blocks/yellow_three.png';
import blueOne from '../assets/sprites/blocks/blue_one.png';
import blueTwo from '../assets/sprites/blocks/blue_two.png';
import blueThree from '../assets/sprites/blocks/blue_three.png';
import empty from '../assets/sprites/blocks/empty.png';

export enum Colors {
  RED = 'RED',
  RED_TWO = 'RED_TWO',
  RED_THREE = 'RED_THREE',
  YELLOW = 'YELLOW',
  YELLOW_TWO = 'YELLOW_TWO',
  YELLOW_THREE = 'YELLOW_THREE',
  BLUE = 'BLUE',
  BLUE_TWO = 'BLUE_TWO',
  BLUE_THREE = 'BLUE_THREE',
  EMPTY = 'EMPTY',
}

export const getSpritePathByColor: Record<Colors, string> = {
  [Colors.RED]: redOne,
  [Colors.RED_TWO]: redTwo,
  [Colors.RED_THREE]: redThree,
  [Colors.YELLOW]: yellowOne,
  [Colors.YELLOW_TWO]: yellowTwo,
  [Colors.YELLOW_THREE]: yellowThree,
  [Colors.BLUE]: blueOne,
  [Colors.BLUE_TWO]: blueTwo,
  [Colors.BLUE_THREE]: blueThree,
  [Colors.EMPTY]: empty,
};

const mainColors = [Colors.RED, Colors.YELLOW, Colors.BLUE, Colors.EMPTY];

export const getRandomColor = (excludeEmpty = false) => {
  const colors = excludeEmpty ? mainColors.filter(color => color !== Colors.EMPTY) : mainColors;
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
};

export const ColorsTextMap: Record<Colors, string> = {
  [Colors.RED]: 'Red I',
  [Colors.RED_TWO]: 'Red II',
  [Colors.RED_THREE]: 'Red III',
  [Colors.YELLOW]: 'Yellow I',
  [Colors.YELLOW_TWO]: 'Yellow II',
  [Colors.YELLOW_THREE]: 'Yellow III',
  [Colors.BLUE]: 'Blue I',
  [Colors.BLUE_TWO]: 'Blue II',
  [Colors.BLUE_THREE]: 'Blue III',
  [Colors.EMPTY]: 'Empty',
};

export const getSpriteByColor: Record<Colors, PIXI.Texture> = {
  [Colors.RED]: PIXI.Texture.from(redOne),
  [Colors.RED_TWO]: PIXI.Texture.from(redTwo),
  [Colors.RED_THREE]: PIXI.Texture.from(redThree),
  [Colors.YELLOW]: PIXI.Texture.from(yellowOne),
  [Colors.YELLOW_TWO]: PIXI.Texture.from(yellowTwo),
  [Colors.YELLOW_THREE]: PIXI.Texture.from(yellowThree),
  [Colors.BLUE]: PIXI.Texture.from(blueOne),
  [Colors.BLUE_TWO]: PIXI.Texture.from(blueTwo),
  [Colors.BLUE_THREE]: PIXI.Texture.from(blueThree),
  [Colors.EMPTY]: PIXI.Texture.from(empty),
};

export const getCostByColor: Record<Colors, number> = {
  [Colors.RED]: 1,
  [Colors.RED_TWO]: 3,
  [Colors.RED_THREE]: 5,
  [Colors.YELLOW]: 1,
  [Colors.YELLOW_TWO]: 3,
  [Colors.YELLOW_THREE]: 5,
  [Colors.BLUE]: 1,
  [Colors.BLUE_TWO]: 3,
  [Colors.BLUE_THREE]: 5,
  [Colors.EMPTY]: 0,
};

export const maxLevelColors = [Colors.BLUE_THREE, Colors.RED_THREE, Colors.YELLOW_THREE];

export const smoothMoveTo = (sprite: PIXI.Sprite, x: number, y: number, duration: number = 0.3) => {
  gsap.to(sprite, {
    duration,
    x,
    y,
    ease: 'power2.out',
  });
};

export function addAppListeners(instance: PIXI.Application<HTMLCanvasElement>) {
  window.addEventListener('resize', () => resizeRoot(instance), false);
}

export function resizeRoot(app: PIXI.Application<HTMLCanvasElement>) {
  const screenSize = getMaxAvailibleSideSize();
  app.renderer.resize(screenSize, screenSize);
}

export const getMaxAvailibleSideSize = () => {
  const isLandscape = window.innerWidth > window.innerHeight;
  const CANVAS_PADDING = isLandscape ? 24 : 0;
  const root = document.getElementById('root')! as HTMLDivElement;
  const sideSize = root.offsetWidth > root.offsetHeight ? root.offsetHeight : root.offsetWidth;
  return sideSize - CANVAS_PADDING;
};
