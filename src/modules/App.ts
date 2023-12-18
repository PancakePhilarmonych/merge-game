import * as PIXI from 'pixi.js';
import { getMaxAvailibleSideSize } from '../utils';
export default class App {
  public instance: PIXI.Application<HTMLCanvasElement>;
  private root: HTMLDivElement;

  constructor() {
    const size = getMaxAvailibleSideSize();
    this.root = document.getElementById('root')! as HTMLDivElement;
    this.instance = new PIXI.Application<HTMLCanvasElement>({
      width: size,
      height: size,
      antialias: true,
    });
    this.root.appendChild(this.instance.view);
    this.instance.renderer.resize(size, size);
  }
}
