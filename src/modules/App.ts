import * as PIXI from 'pixi.js';
import { getMaxAvailibleSideSize } from '../utils';
export default class App {
  public instance: PIXI.Application<HTMLCanvasElement>;

  constructor() {
    const size = getMaxAvailibleSideSize();
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';

    this.instance = new PIXI.Application<HTMLCanvasElement>({
      antialias: true,
      backgroundAlpha: 0,
      view: document.querySelector('canvas') as HTMLCanvasElement,
    });
    this.instance.renderer.resize(size, size);
  }
}
