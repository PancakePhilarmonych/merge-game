import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

export enum Colors {
  RED = 'RED',
  YELLOW = 'YELLOW',
  BLUE = 'BLUE',
  EMPTY = 'EMPTY',
}

const mainColors = [Colors.RED, Colors.YELLOW, Colors.BLUE, Colors.EMPTY];

export const getRandomColor = (excludeEmpty = false) => {
  const colors = excludeEmpty ? mainColors.filter(color => color !== Colors.EMPTY) : mainColors;
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
};

export const ColorsTextMap: Record<Colors, string> = {
  [Colors.RED]: 'Red',
  [Colors.YELLOW]: 'Yellow',
  [Colors.BLUE]: 'Blue',
  [Colors.EMPTY]: 'Empty',
};

import { PALETTE } from '@/config/colors';

export const getHexColorByColor = (color: Colors): PIXI.ColorSource => {
  switch (color) {
    case Colors.RED:
      return PALETTE.RED;
    case Colors.YELLOW:
      return PALETTE.YELLOW;
    case Colors.BLUE:
      return PALETTE.BLUE;
    default:
      return PALETTE.BLACK;
  }
};

export const maxLevelColors = [Colors.BLUE, Colors.RED, Colors.YELLOW];

export const smoothMoveTo = (
  container: PIXI.Container,
  x: number,
  y: number,
  duration: number = 0.3,
) => {
  gsap.to(container, {
    duration,
    x,
    y,
    ease: 'power2.out',
  });
};

export const getTopUIHeight = () => {
  return window.innerHeight * 0.1;
};

export const getBottomUIHeight = () => {
  return window.innerHeight * 0.1;
};

export const getAvailibleHeight = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const availableHeight = height - getTopUIHeight() - getBottomUIHeight();

  return Math.min(width, availableHeight);
};

export const getTotalGameHeight = () => {
  return getAvailibleHeight() + getTopUIHeight() + getBottomUIHeight();
};
